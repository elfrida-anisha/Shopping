const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const Admin = require('./models/Admin');

const seedAdmin = async () => {
    try {
        const existing = await Admin.findOne({ username: 'cafe_owner' });
        if (!existing) {
            // This will trigger the .pre('save') hook in the model
            await Admin.create({ 
                username: 'cafe_owner', 
                password: 'college123' 
            });
            console.log("✅ Admin account created!");
        } else {
            console.log("ℹ️ Admin account already exists.");
        }
    } catch (err) {
        console.error("❌ Error seeding admin:", err);
    }
};
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected')
        seedAdmin();
    })
    .catch(err => console.log(err));

app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
