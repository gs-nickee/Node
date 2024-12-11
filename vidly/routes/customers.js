const {Customer, validate} = require('../models/customer');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
})

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found');
    res.send(customer);
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body);

    if (error) return res.status(404).send(error.details[0].message);

    const customer = new Customer({ isGold: req.body.isGold, name: req.body.name, phone: req.body.phone });
    await customer.save();
    res.send(customer);
})

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        isGold: req.body.isGold, name: req.body.name, phone: req.body.phone
    }, {new: true});
    if (!customer) return res.status(404).send('The customer with the given ID was not found');

    res.send(genre);
})

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found');

    res.send(customer);
});

module.exports = router;