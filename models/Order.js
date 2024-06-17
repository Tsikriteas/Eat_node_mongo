const mongoose = require('mongoose');
const {Schema} = require("mongoose");
const stream = require("node:stream");

const orderSchema = new mongoose.Schema({
    items: [{type: Schema.Types.ObjectId, ref: "Item"}],
    total: {type: Number, required: true},
    currency: {type: String, required: true},
    customerName: {type: String, required:true},
    customerAddress:{type: String, required:true},
    customerPhone: { type: String, required: true },
    status: { type: String, default: 'pending' },
    createdAt: {type: Date, default: Date.now},
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;