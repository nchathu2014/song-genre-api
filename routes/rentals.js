const express = require('express');
const Fawn = require('fawn');
const mongoose = require('mongoose');

const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const { Rental, validate } = require('./../models/rentals');

const auth = require('./../middleware/auth');

const router = express.Router();

Fawn.init(mongoose);

//GET
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals)
});

//POST
router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer.');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid movie.');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    //Here rental saved and movie saved(), if somthing happned in rental and not saved() but movie.save() brings
    // Data inconsistancy, Here we need TRANSACTION to atomically handle this two operations
    // In MongoDB, it is not Transaction concept like relational databases. Mongo uses Two-Phase commit 

    //Task is like Transaction
    //rentals is the collection in MongoDB
    try {
        Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();
        res.send(rental);
    } catch (error) {
        res.status(500).send('Somthing Fail');
    }

    // rental = await rental.save(); // OPERATION 1

    //movie.numberInStock--;
    // movie.save();   // OPERATION 2
    // We have to use Transaction approach here OPERATION 1 and OPERATION 2 have to be atomic, if 
    //either fails changes have to be rollback

});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given ID was not found.');

    res.send(rental);
});

module.exports = router;