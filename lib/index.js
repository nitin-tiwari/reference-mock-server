'use strict';
const morgan = require('morgan');
const express = require('express');
const Middleware = require('swagger-express-middleware').Middleware;
const dataSource = require('./datasource.js');

const port = 8001;
const app = express();
const middleware = new Middleware(app);
app.use(morgan('dev'));

dataSource.initResources(() => {
  const swagger = '../account-info-api-spec/dist/account-info-swagger.yaml';

  middleware.init(swagger, err => {
    app.use(
      middleware.metadata(),
      middleware.CORS(),
      middleware.files(),
      middleware.parseRequest(),
      middleware.validateRequest()
    );

    app.use((req, res, next) => {
      dataSource.mockData(req, data => {
        if (!data) {
          res.sendStatus(404);
        } else {
          res.send(data);
        }
      });
    });

    app.listen(port, () => {
      console.log('running on localhost:' + port + ' ... ');
    });
  });

});
