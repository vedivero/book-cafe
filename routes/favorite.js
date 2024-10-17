const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite } = require('../controller/FavoriteController');
router.use(express.json());

router.post('/:id', addFavorite);

router.delete('/:id', removeFavorite);

module.exports = router;
