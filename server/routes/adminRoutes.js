const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

// Admin Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (admin && await bcrypt.compare(password, admin.password)) {
        res.json({ success: true, message: "Login successful" });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// Change Password
router.post('/change-password', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    const admin = await Admin.findOne({ username });
    if (admin && await bcrypt.compare(oldPassword, admin.password)) {
        admin.password = newPassword; // The .pre('save') hook will hash this
        await admin.save();
        res.json({ success: true, message: "Password updated" });
    } else {
        res.status(401).json({ success: false, message: "Verification failed" });
    }
});

module.exports = router;
