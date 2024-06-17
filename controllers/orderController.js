const Order = require('../models/Order');
const Item = require('../models/Item');

exports.getOrders = async (req, res) => {
    try{
        //popualate to retrieve all the items
        const orders = await Order.find().populate('items')
        res.json(orders);
    }catch (err){
        res.status(500).json({ error: err.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        //if same items dont work
        console.log("Request body:", req.body); // Εκτυπώστε τα δεδομένα που λαμβάνετε
        const { items, total, currency, customerName, customerAddress, customerPhone } = req.body;
        console.log(customerName);
        // valid items
        const validItems = await Item.find({ '_id': { $in: items } });
        console.log("Valid items:", validItems);
        if (validItems.length !== items.length) {
            return res.status(400).json({ error: 'Some items do not exist.' });
        }

        const newOrder = new Order({
            items,
            total,
            currency,
            customerName,
            customerAddress,
            customerPhone,
            status : "pending",
            createdAt: new Date()
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};