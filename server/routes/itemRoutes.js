const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Item = require('../models/Item');

// 1. Standard Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Use Memory Storage (Keep the file in RAM temporarily)
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const uploadRes = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'college_cafe' },
                (err, result) => (err ? reject(err) : resolve(result))
            );
            stream.end(req.file.buffer);
        });

        const newItem = new Item({
            name: req.body.name,
            price: req.body.price,
            imageUrl: uploadRes.secure_url,
            publicId: uploadRes.public_id // <--- Save the Public ID here
        });

        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET and DELETE remain the same...
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        // 1. Find the item first to get its publicId
        const item = await Item.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        // 2. If it has a publicId, delete from Cloudinary
        if (item.publicId) {
            await cloudinary.uploader.destroy(item.publicId);
            console.log("Deleted image from Cloudinary:", item.publicId);
        }

        // 3. Delete from MongoDB
        await Item.findByIdAndDelete(req.params.id);
        
        res.json({ message: "Item and Image removed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;