const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Get all items
router.get('/', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

// Add a new item
router.post('/', async (req, res) => {
    try {
        // console.log("Data received from frontend:", req.body); // Debugging line
        const newItem = new Item({
            name: req.body.name,
            price: req.body.price
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(400).json({ error: err.message });
    }
});

// Delete an item
router.delete('/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed" });
});

module.exports = router;
