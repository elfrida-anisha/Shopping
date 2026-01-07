const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create Order with Token
router.post('/', async (req, res) => {
    try {
        // Generate a simple 4-digit token
        const token = Math.floor(1000 + Math.random() * 9000).toString();
        const newOrder = new Order({ ...req.body, token, paymentStatus: 'paid' });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
});

router.patch('/:id', async (req, res) => {
    const updated = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(updated);
});

// Verification Route
router.post('/verify', async (req, res) => {
    const { token } = req.body;
    const order = await Order.findOne({ token, status: 'ready' });
    if (order) {
        order.status = 'collected';
        await order.save();
        res.json({ success: true, order });
    } else {
        res.status(404).json({ success: false, message: "Invalid token or order not ready" });
    }
});

module.exports = router;
