const mongoose = require('mongoose');
//const {mongo, models} = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const item = mongoose.model('Item', itemSchema);

module.exports = item;