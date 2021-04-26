const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');

require('dotenv').config();

const app = express();
app.enable('trust proxy');
app.use(express.static(path.join(__dirname , '../client')));
app.use(morgan('dev'));
app.use(helmet());

module.exports = app;