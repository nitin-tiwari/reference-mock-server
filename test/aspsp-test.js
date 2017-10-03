const assert = require('assert');
const request = require('supertest'); // eslint-disable-line
const { app } = require('../lib/app.js');

describe('/scim/v2/OBAccountPaymentServiceProviders', () => {
  it('returns JSON payload', (done) => {
    request(app)
      .get('/scim/v2/OBAccountPaymentServiceProviders')
      .set('Accept', 'application/json')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.Resources.length, 3);
        assert.equal(res.body.Resources[0].AuthorisationServers[0].CustomerFriendlyName, 'AAA Example Bank');
        assert.equal(res.body.Resources[0].id, 'aaa-example-bank');
        done();
      });
  });
});
