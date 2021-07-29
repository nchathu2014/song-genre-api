const express = require('express');
const Joi = require('joi');
const _ = require('underscore');

const router = express.Router();


const genres = [
    {
        id: 1,
        name: 'Rock',
        description: 'Rock music is a broad genre of popular music that originated as "rock and roll" in the United States in the late 1940s and early 1950s, developing into a range of different styles in the mid-1960s and later, particularly in the United States and the United Kingdom.'
    },
    {
        id: 2,
        name: 'Pop music',
        description: 'Pop is a genre of popular music that originated in its modern form during the mid-1950s in the United States and the United Kingdom. The terms popular music and pop music are often used interchangeably, although the former describes all music that is popular and includes many disparate styles'
    }
    ,
    {
        id: 3,
        name: 'Jazz',
        description: 'Jazz is a music genre that originated in the African-American communities of New Orleans, Louisiana, United States, in the late 19th and early 20th centuries, with its roots in blues and ragtime.'
    }
];


//GET
router.get('/', (req, res) => {
    res.send(genres)
});

router.get('/:id', (req, res) => {
    const genre = _.find(genres, genre => genre.id === parseInt(req.params.id));

    if (!genre) return res.status(404).send('Genre is Not Found :(');
    res.send(genre);
});

//POST
router.post('/', (req, res) => {
    const genre = {
        id: genres.length + 1,
        name: req.body.name,
        desc: req.body.desc
    };

    //Body parameter validation
    const { error } = validateGenre(req.body);

    if (error) return res.status(400).send(error.details[0].message);

    genres.push(genre);
    res.send(genre)
});

//PUT
router.put('/:id', (req, res) => {
    const genreId = req.params.id;
    const genreName = req.body.name;
    const genreDesc = req.body.desc;

    //Body parameter validation
    const { error } = validateGenre(req.body);

    const genre = _.find(genres, genre => genre.id === parseInt(genreId));

    if (error) return res.status(400).send(error.details[0].message);
    if (!genre) return res.status(404).send('No genre find for this Id');

    if (genre.name !== genreName) genre.name = genreName;
    if (genre.desc !== genreDesc) genre.desc = genreDesc;

    res.send(genre)
});


//DELETE
router.delete('/:id', (req, res) => {
    const genreId = req.params.id;

    const genre = _.find(genres, genre => genre.id === parseInt(genreId));

    if (!genre) return res.status(404).send('No genre find for this Id');

    const index = genres.indexOf(genre);
    genres.splice(index, 1)
    res.send(genre)
});


function validateGenre(genre) {
    const schema = {
        name: Joi.string().min(3).required(),
        desc: Joi.string().min(10)
    };
    return Joi.validate(genre, schema);
}

module.exports = router;