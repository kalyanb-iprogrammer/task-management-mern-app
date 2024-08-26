const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser')

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');

const errorHandlers = require('./handlers/errorHandlers');

const passport = require('../src/config/passport');

require('dotenv').config({ path: '.env' });

// create express app
const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_BASE_URL,
        credentials: false,
    })
);

const jsonParser = bodyParser.json()


// app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(passport.initialize())

// API routes
app.use('/api', jsonParser, coreAuthRouter);

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);


module.exports = app;