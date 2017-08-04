const morgan = require('morgan');
const fs = require('fs');
const express = require('express');
const Middleware = require('swagger-express-middleware').Middleware;
const dataSource = require('./datasource.js');
const error = require('debug')('error');
const log = require('debug')('log');

const SWAGGER = process.env.SWAGGER;
const port = 8001;
const app = express();
const middleware = new Middleware(app);
app.use(morgan('dev'));

dataSource.initResources(() => {
  let swagger = '../account-info-api-spec/dist/account-info-swagger.yaml';
  if (SWAGGER && SWAGGER.toString().indexOf('.yaml') !== -1) {
    swagger = SWAGGER;
  }

  if (!fs.existsSync(swagger)) {
    const err = `Swagger file ${swagger} does not exist`;
    throw new Error(err);
  }

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
