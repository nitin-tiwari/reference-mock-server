'use strict';
const morgan = require('morgan');
const util = require('util');
const pathconst = require('path');
const express = require('express');
const sem = require('swagger-express-middleware');
const Middleware = sem.Middleware;
const Resource = sem.Resource;

const port = 8001;
const app = express();
const middleware = new Middleware(app);
app.use(morgan('dev'));

const fs = require('fs');
const dataSource = require('./datasource.js');
const utf8 = 'utf8';
const swagger = '../account-info-api-spec/dist/account-info-swagger.yaml';

middleware.init(swagger, (err) => {

  app.use(
    middleware.metadata(),
    middleware.CORS(),
    middleware.files(),
    middleware.parseRequest(),
    middleware.validateRequest()
  );

  app.use((req, res, next) => {
    const file = dataSource.dataFile(req);
    fs.readFile(file, utf8, (err, data) => {
      if (err) {
        res.sendStatus(404);
      } else {
        const json = JSON.parse(data);
        res.send(json);
      }
    });
  });

  app.listen(port, () => {
    console.log('running on localhost:' + port + ' ... ');
  });
});
