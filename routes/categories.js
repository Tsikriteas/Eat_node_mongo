const express = require('express');
const router = express.Router();
const Category = require('../models/Category');


router.use(express.json());

//GET

router.get('/', async (req,res) =>{
    try{
        const categories = await Category.find();
        res.json(categories);
    }catch (err) {
        res.status(500).json({error: err.message});
    }
});

//POST
router.post('/', async (req,res) =>{
    try{
        const newCategory = new Category({
            name: req.body.name,
            description: req.body.description
        });
        const saveCategory = await newCategory.save();
        res.status(201).json(saveCategory);
    }catch (err) {
        res.status(500).json({error: err.message});
    }
});

//DELETE
router.delete('/:id', async (req,res)=>{
   try{
       const { id } = req.params;
       const deletedCategory = await Category.findByIdAndDelete(id);

       if (!deletedCategory) {
           return res.status(404).json({ error: 'Category not found' });
       }
       res.json({ message: 'Category deleted successfully' });
   }catch (err) {
       res.status(500).json({error: err.message})
   }
});

module.exports = router;