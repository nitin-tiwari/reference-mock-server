const express = require('express');
const { OBAccountPaymentServiceProviders } = require('./ob-directory');

const app = express();

app.use('/scim/v2/OBAccountPaymentServiceProviders', OBAccountPaymentServiceProviders);

exports.app = app;
