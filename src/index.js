const express = require('express');
const cors = require('cors');
const favicon = require('express-favicon');
const http = require('http');
const bodyParser = require('body-parser');
const logger = require('morgan');
const env = require('./config/env');
const responseMiddleware = require('./middlewares/response');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(responseMiddleware);

app.use(favicon('./public/img/favicon.png'));
app.get('/', (_request, response) => response.json({ status: true }));

require('./database');
require('./app')(app);

const server = http.createServer(app);
server.listen(env.port, () => {
	console.log('\x1b[32m%s\x1b[0m', '[ Ok ]', `Env: ${env.env}, port: ${env.port}`);
});