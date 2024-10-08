const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite } = require('../controller/FavoriteController');
router.use(express.json());

router.post('/:favorite_book_id', addFavorite);

router.delete('/:favorite_book_id', removeFavorite);

module.exports = router;
