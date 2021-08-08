const express = require('express');
const router = express.Router();

const { Genre } = require('./../models/genre');
const { Movie, validate } = require('./../models/movie');
const auth = require('./../middleware/auth');

//GET
router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies)
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send('Movie is Not Found :(');
    res.send(movie);
});

//POST
router.post('/', auth, async (req, res) => {
    //Body parameter validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('Genre is Not Found :(');


    let movie = new Movie(
        {
            title: req.body.title,
            genre: {
                _id: genre.id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate

        });
    movie = await movie.save()
    res.send(movie)
});

//PUT
router.put('/:id', auth, async (req, res) => {

    //Body parameter validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('Genre is Not Found :(');

    //Update first approach
    const movie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
            title: req.body.title,
            genre: {
                _id: genre.id,
                name: genre.name
            },// Dont assign genre: genre, coz then all genre properties assigned, but here we want name property only
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }, { new: true }
    );
    if (!movie) return res.status(404).send('No movie find for this Id');
    res.send(movie)
});

//DELETE
router.delete('/:id', auth, async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id)
    if (!movie) return res.status(404).send('No movie find for this Id');
    res.send(movie)
});

module.exports = router;