const express = require('express');
const router = express.Router();

const { Genre, validate } = require('./../models/genre');

//GET
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres)
});

router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send('Genre is Not Found :(');
    res.send(genre);
});

//POST
router.post('/', async (req, res) => {
    //Body parameter validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save()
    res.send(genre)
});

//PUT
router.put('/:id', async (req, res) => {

    //Body parameter validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Update first approach
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!genre) return res.status(404).send('No genre find for this Id');
    res.send(genre)
});

//DELETE
router.delete('/:id', async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if (!genre) return res.status(404).send('No genre find for this Id');
    res.send(genre)
});

module.exports = router;