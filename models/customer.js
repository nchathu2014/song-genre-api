const mongoose = require('mongoose');
const Joi = require('joi');

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

function validateCustomer(customer) {
    const schema = {
        name: Joi.string().min(5).required(),
        phone: Joi.string().min(5).required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;