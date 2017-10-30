const openidAspspAuthHost = process.env.OPENID_ASPSP_AUTH_HOST;
const log = require('debug')('log');

const get = (req, res) => {
  log(`http get open id config for aspsp: [${req.params.id}]`);
  res.json({
    authorization_endpoint: `${openidAspspAuthHost}/authorize`,
    token_endpoint: `${openidAspspAuthHost}/token`,
  });
};

exports.openIdConfig = { get };
