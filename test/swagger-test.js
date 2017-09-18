/* eslint import/no-extraneous-dependencies: off */
const assert = require('assert');
const sinon = require('sinon');
const swagger = require('../lib/swagger.js');
const https = require('https');
const fs = require('fs');
const { URL } = require('url');

const sandbox = sinon.createSandbox();

describe('fetchSwagger', () => {
  const uri = 'https://host/path';
  const uriFallback = 'https://host/path_fallback';
  const file = './path/swagger.yaml';

  describe('when SWAGGER env contains URI', () => {
    before(() => {
      sandbox.restore();
      process.env.SWAGGER = uri;
    });

    it('does HTTP GET of URI', () => {
      sandbox.stub(https, 'get').returns({ statusCode: 200, on: () => {} });
      swagger.fetchSwagger(() => {});
      const options = new URL(uri);
      assert(https.get.calledWithMatch(options));
    });
  });

  describe('when SWAGGER env contains URI that returns 404', () => {
    before(() => {
      sandbox.restore();
      process.env.SWAGGER = uri;
      process.env.SWAGGER_FALLBACK = uriFallback;
    });

    it('does HTTP GET of fallback URI', () => {
      const options = new URL(uri);
      const options2 = new URL(uriFallback);
      const stub = sandbox.stub(https, 'get');
      stub.withArgs(options).returns({ statusCode: 404 });
      stub.withArgs(options2).returns({ statusCode: 200, on: () => {} });
      swagger.fetchSwagger(() => {});
    });
  });

  describe('when SWAGGER env does not contain URI', () => {
    before(() => {
      sandbox.restore();
      process.env.SWAGGER = file;
      try {
        sandbox.stub(fs, 'existsSync').returns(true);
      } catch (e) {
        // ignore, due to error raised when running npm run test:watch
      }
    });

    it('checks env is a file that exists', () => {
      swagger.fetchSwagger((result) => { assert(result, file); });
      assert(fs.existsSync.calledWithMatch(file));
    });
  });
});
