const express = require('express');
const router = express.Router();
router.use(express.json());

const { addCart, getCart, removeCart } = require('../controller/CartController');

router.post('/', addCart);

router.get('/', getCart);

router.delete('/:id', removeCart);

module.exports = router;
