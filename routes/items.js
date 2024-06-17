const express = require('express');
const router = express.Router();
const Item  = require('../models/Item');

// Middleware για να χρησιμοποιεί JSON body parser
router.use(express.json());

// GET items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
        //console.log('items found', res.json(items));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//GET to find itmes per category
router.get('/category/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        console.log(categoryId);
        const items = await Item.find({ category: categoryId });
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// POST for new item
router.post('/', async (req, res) => {
    try {
        const newItem = new Item({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock,
            imageUrl: req.body.imageUrl
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req,res)=>{
    try {
        const item = await Item.findById(req.params.id);
        if(!item){
            return res.status(404).json({error: 'Item not found'});
        }
        await item.remove();
        res.json({message: 'Item deleted'});
    }catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
