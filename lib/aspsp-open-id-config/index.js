const env = require('env-var');
const log = require('debug')('log');

const openidAspspAuthHost = env.get('OPENID_ASPSP_AUTH_HOST').asString();

const get = (req, res) => {
  log(`http get open id config for aspsp: [${req.params.id}]`);
  res.json({
    authorization_endpoint: `${openidAspspAuthHost}/authorize`,
    token_endpoint: `${openidAspspAuthHost}/token`,
  });
};

exports.openIdConfig = { get };
