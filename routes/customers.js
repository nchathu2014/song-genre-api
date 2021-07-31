const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');

const router = express.Router();

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    }

}));

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
router.post('/', async (req, res) => {
    //Body parameter validation
    const { error } = validateCustomer(req.body);
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
router.put('/:id', async (req, res) => {

    //Body parameter validation
    const { error } = validateCustomer(req.body);
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
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
    if (!customer) return res.status(404).send('No customer find for this Id');
    res.send(customer)
});


function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).required(),
        phone: Joi.string().min(5).required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);
}

module.exports = router;