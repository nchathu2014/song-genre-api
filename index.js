require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');

const health = require('./routes/health');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');


if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.')
    process.exit(1);
}

const app = express();

//Create the MongoDB connection
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.log('Error: ', err.message));

// Inbuilt middleware
app.use(express.json());

//Routes
app.use('/health', health);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening to port ${port}`));


