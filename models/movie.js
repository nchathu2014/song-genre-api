const mongoose = require('mongoose');
const Joi = require('joi');

const { genreSchema } = require('./genre');

//Persisitance Schema(Store in MongoDB)
const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
}));

function validateMovie(movie) {
    //User send schema
    const schema = {
        title: Joi.string().min(5).required(),
        genreId: Joi.string().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
    };
    return Joi.validate(movie, schema);
}

module.exports.Movie = Movie;
exports.validate = validateMovie;