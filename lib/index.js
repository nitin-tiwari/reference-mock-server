const morgan = require('morgan');
const express = require('express');
const Middleware = require('swagger-express-middleware').Middleware;
const dataSource = require('./datasource.js');
const fetchSwagger = require('./swagger.js').fetchSwagger;
const error = require('debug')('error');
const log = require('debug')('log');

const port = 8001;
const app = express();
const middleware = new Middleware(app);
app.use(morgan('dev'));

dataSource.initResources(() => {
  fetchSwagger((swagger) => {
    middleware.init(swagger, (err) => {
      if (err) error(err);

      app.use(
        middleware.metadata(),
        middleware.CORS(),
        middleware.files(),
        middleware.parseRequest(),
        middleware.validateRequest(),
      );

      app.use((req, res) => {
        dataSource.mockData(req, (data) => {
          if (!data) {
            res.sendStatus(404);
          } else {
            res.send(data);
          }
        });
      });

      app.listen(port, () => {
        log(`running on localhost:${port} ... `);
      });
    });
  });
});
