const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemController');

router.use(express.json());

router.get('/', itemsController.getItems);

router.get('/category/:categoryId', itemsController.getItemsPerCategory);

router.post('/', itemsController.createItem);

router.delete('/:id', itemsController.deleteItem);

module.exports = router;
