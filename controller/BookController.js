const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
   res.json('전체 도서 조회');
};

const detailBook = (req, res) => {
   res.json('개별 도서 조회');
};

const booksByCategory = (req, res) => {
   res.json('항목별 도서 조회');
};

module.exports = {
   allBooks,
   detailBook,
   booksByCategory,
};
