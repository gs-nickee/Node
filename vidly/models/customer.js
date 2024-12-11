const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    isGold: { type: Boolean, default: false },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 20,
    }
});

const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer) {
    const schema = Joi.object({
        isGold: Joi.boolean().optional(), 
        name: Joi.string().min(2).max(50).required(),
        phone: Joi.string().min(5).max(20).required()
    })

    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;