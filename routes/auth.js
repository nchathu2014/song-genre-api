const express = require('express');
const Joi = require('joi');
const router = express.Router();
const bcrypt = require('bcrypt');

const { User } = require('./../models/users');



//POST
router.post('/', async (req, res) => {
    //Body parameter validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Invalid username or password');


    const isValidPassword = await bcrypt.compare(req.body.password, user.password)

    if (!isValidPassword) return res.status(400).send('Invalid username or password');
    res.send(true);
});


function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    };
    return Joi.validate(req, schema);
}

module.exports = router;