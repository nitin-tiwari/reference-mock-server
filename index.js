if (!process.env.DEBUG) process.env.DEBUG = 'error,log';

const port = (process.env.PORT || 8001);
const morgan = require('morgan');
const log = require('debug')('log');
const { initApp } = require('./lib');

initApp((app) => {
  app.use(morgan('dev'));
  app.listen(port, () => {
    log(`running on localhost:${port} ... `);
  });
});
