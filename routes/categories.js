const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.use(express.json());

// GET all categories
router.get('/', categoryController.getCategories);

// POST a new category
router.post('/', categoryController.createCategory);

// DELETE a category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
