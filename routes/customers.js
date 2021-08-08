const express = require('express');
const router = express.Router();
const auth = require('./../middleware/auth');
const { Customer, validate } = require('./../models/customer');

//GET
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send('Customer is Not Found :(');
    res.send(customer);
});

//POST
router.post('/', auth, async (req, res) => {
    //Body parameter validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });
    customer = await customer.save()
    res.send(customer)
});

//PUT
router.put('/:id', auth, async (req, res) => {

    //Body parameter validation
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Update first approach
    const customer = await Customer.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        },
        { new: true });
    if (!customer) return res.status(404).send('No customer find for this Id');
    res.send(customer)
});

//DELETE
router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
    if (!customer) return res.status(404).send('No customer find for this Id');
    res.send(customer)
});

module.exports = router;