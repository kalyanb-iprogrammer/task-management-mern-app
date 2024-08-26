const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser')

require('dotenv').config({ path: '.env' });

// create express app
const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_BASE_URL,
        credentials: false,
    })
);

app.use(bodyParser.urlencoded({ extended: false }))


module.exports = app;