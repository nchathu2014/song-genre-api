const express = require('express');
const router = express.Router();

const { User, validate } = require('./../models/users');

//GET
router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).send('User is Not Found :(');
    res.send(user);
});

//POST
router.post('/', async (req, res) => {
    //Body parameter validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user = await user.save();
    res.send(user);
});

//PUT
router.put('/:id', async (req, res) => {

    //Body parameter validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Update first approach
    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }, { new: true });
    if (!user) return res.status(404).send('No user find for this Id');
    res.send(user)
});

//DELETE
router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id)
    if (!user) return res.status(404).send('No user find for this Id');
    res.send(user);
});

module.exports = router;