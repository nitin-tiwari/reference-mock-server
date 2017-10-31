const assert = require('assert');
const request = require('supertest'); // eslint-disable-line
const OPENID_CONFIG_ENDPOINT_URL = 'http://localhost/openid/config';

process.env.OPENID_CONFIG_ENDPOINT_URL = OPENID_CONFIG_ENDPOINT_URL;
const { app } = require('../lib/app.js');

describe('/scim/v2/OBAccountPaymentServiceProviders', () => {
  it('returns JSON payload', (done) => {
    request(app)
      .get('/scim/v2/OBAccountPaymentServiceProviders')
      .set('Accept', 'application/json')
      .end((err, res) => {
        const authServer = res.body.Resources[0].AuthorisationServers[0];
        assert.equal(res.status, 200);
        assert.equal(res.body.Resources.length, 3);
        assert.equal(res.body.Resources[0].id, 'aaa-example-bank');
        assert.equal(authServer.CustomerFriendlyName, 'AAA Example Bank');
        assert.equal(authServer.BaseApiDNSUri, 'http://aaa-example-bank.example.com');
        assert.equal(authServer.CustomerFriendlyLogoUri, '');
        assert.equal(authServer.OpenIDConfigEndPointUri, `${OPENID_CONFIG_ENDPOINT_URL}/${res.body.Resources[0].id}`);
        done();
      });
  });
});
