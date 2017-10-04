const { Middleware } = require('swagger-express-middleware');
const { fetchSwagger } = require('./swagger.js');
const { app } = require('./app.js');
const dataSource = require('./datasource.js');
const error = require('debug')('error');
const morgan = require('morgan');

const middleware = new Middleware(app);

const initApp = (initFinished) => {
  dataSource.initResources(() => {
    fetchSwagger((swagger) => {
      middleware.init(swagger, (err) => {
        if (err) error(err);

        app.use(morgan('dev'));
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

        initFinished(app);
      });
    });
  });
};

exports.initApp = initApp;
