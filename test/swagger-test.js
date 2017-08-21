/* eslint import/no-extraneous-dependencies: off */
const assert = require('assert');
const sinon = require('sinon');
const swagger = require('../lib/swagger.js');
const https = require('https');
const fs = require('fs');
const { URL } = require('url');

describe('fetchSwagger', () => {
  describe('when SWAGGER env contains URI', () => {
    const uri = 'https://host/path?token=123';
    before(() => {
      process.env.SWAGGER = uri;
    });

    it('does HTTP GET of URI', () => {
      sinon.stub(https, 'get').returns({ on: () => {} });
      swagger.fetchSwagger(() => {});
      const options = new URL(uri);
      assert(https.get.calledWithMatch(options));
    });
  });

  describe('when SWAGGER env does not contain URI', () => {
    const file = './path/swagger.yaml';
    before(() => {
      process.env.SWAGGER = file;
    });

    it('checks env is a file that exists', () => {
      sinon.stub(fs, 'existsSync').returns(true);
      swagger.fetchSwagger((result) => { assert(result, file); });
      assert(fs.existsSync.calledWithMatch(file));
    });
  });
});
