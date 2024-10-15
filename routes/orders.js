const express = require('express');
const router = express.Router();
router.use(express.json());

const { orders, getOrders, getOrderDetail } = require('../controller/OrderController');

router.post('/', orders);
router.get('/', getOrders);
router.get('/:id', getOrderDetail);

module.exports = router;
