const express = require('express');
const router = express.Router();
router.use(express.json());

router.post('/', (req, res) => {
   res.json('장바구니에 도서 추가');
});

router.get('/', (req, res) => {
   res.json('장바구니 목록 조회');
});

router.delete('/:id', (req, res) => {
   res.json('장바구니 도서 삭제');
});

module.exports = router;
