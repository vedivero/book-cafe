const express = require('express');
const router = express.Router();
const { allBooks, detailBook, booksByCategory } = require('../controller/BookController');

router.use(express.json());

router.get('/', allBooks);
router.get('/:id', detailBook);

module.exports = router;
