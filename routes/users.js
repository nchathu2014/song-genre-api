const express = require('express');
const router = express.Router();

const { User, validate } = require('./../models/users');

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

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    await user.save();
    res.send(user);
});

module.exports = router;