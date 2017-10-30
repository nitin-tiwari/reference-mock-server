const express = require('express');
const { OBAccountPaymentServiceProviders } = require('./ob-directory');
const { authServer } = require('./auth-server');
const { accountRequests } = require('./account-requests');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/token', authServer);
app.post('/account-requests', accountRequests.post);
app.get('/account-requests/:id', accountRequests.get);
app.delete('/account-requests/:id', accountRequests.del);
app.use('/scim/v2/OBAccountPaymentServiceProviders', OBAccountPaymentServiceProviders);

exports.app = app;
