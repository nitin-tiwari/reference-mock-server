const assert = require('assert');
const request = require('supertest'); // eslint-disable-line
const proxyquire = require('proxyquire');
const env = require('env-var');

describe('/openid/config/:id', () => {
  let oid, app;

  before(function () {
    oid = proxyquire('../lib/open-id-config.js', {
      'env-var': env.mock({
        OPENID_ASPSP_AUTH_HOST: 'http://localhost'
      })
    });

    app = proxyquire('../lib/app.js', { './open-id-config': oid }).app;
  });

  it('returns JSON payload', (done) => {
    request(app)
      .get('/openid/config/aaa-example-bank')
      .set('Accept', 'application/json')
      .end((err, res) => {
        const oidConfig = res.body;
        assert.equal(res.status, 200);
        assert.equal(oidConfig.authorization_endpoint, `http://localhost/authorize`);
        assert.equal(oidConfig.token_endpoint, `http://localhost/token`);
        done();
      });
  });
});
