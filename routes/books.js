const express = require('express');
const router = express.Router();
router.use(express.json());

router.get('/', (req, res) => {
   res.json('전체 도서 목록 조회');
});

router.get('/:id', (req, res) => {
   res.json('개별 도서 조회');
});

router.get('/category', (req, res) => {
   res.json('장르 별 도서 목록 조회');
});

module.exports = router;
