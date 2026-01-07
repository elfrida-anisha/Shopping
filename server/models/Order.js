const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    studentId: { type: String, required: true },
    studentName: { type: String, required: true },
    items: [{ name: String, price: Number }],
    totalPrice: Number,
    status: { 
        type: String, 
        enum: ['pending', 'preparing', 'ready', 'collected'], 
        default: 'pending' 
    },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    token: { type: String, unique: true }, // The unique verification code
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
