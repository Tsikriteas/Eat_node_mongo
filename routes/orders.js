const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.use(express.json());

router.get('/', orderController.getOrders);

router.post('/', orderController.createOrder);

module.exports = router;
