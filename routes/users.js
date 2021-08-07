const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const _ = require('lodash');

const { User, validate } = require('../models/user');
const authorization = require('./../middleware/auth');

router.get('/me', authorization, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user)
});

//POST
router.post('/', async (req, res) => {
    //Body parameter validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check whether user already exist
    let user = await User.findOne({
        email: req.body.email
    });

    if (user) return res.status(400).send('User already regsitered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    //Creating salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(req.body.password, salt);
    user.password = hashPwd;
    await user.save();

    //generate jwt and set res header to use in FE
    const token = user.generateAuthToken();

    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));

    // Old way of doing
    /* res.send({
        _id: user._id,
        name: user.name,
        email: user.email
    }); */
});

module.exports = router;


// For password complexity, can use a module called 'joi-password-complexity'