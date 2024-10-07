const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
   let { category_id, news } = req.query;

   let sql = 'select * from books ';
   let values = [];

   if (category_id && news) {
      sql += 'where category_id = ? and pub_date between date_sub(now(), interval 1 month) and now()';
      values = [category_id, news];
   } else if (category_id) {
      sql += 'where category_id = ?';
      values = category_id;
   } else if (news) {
      sql += 'where pub_date between date_sub(now(), interval 1 month) and now()';
      values = news;
   }

   conn.query(sql, values, (err, result) => {
      if (err) {
         console.log(err);
         return res.status(StatusCodes.BAD_REQUEST).end();
      }
      if (result[0]) {
         return res.status(StatusCodes.OK).json(result[0]);
      } else {
         return res.status(StatusCodes.NOT_FOUND).end();
      }
   });
};

const detailBook = (req, res) => {
   let { id } = req.params;

   let sql = `SELECT * FROM bookCafe.books left join category
      on books.category_id = category.id where books.id = ?`;
   conn.query(sql, id, (err, result) => {
      if (err) {
         console.log(err);
         return res.status(StatusCodes.BAD_REQUEST).end();
      }
      if (result[0]) {
         return res.status(StatusCodes.OK).json(result[0]);
      } else {
         return res.status(StatusCodes.NOT_FOUND).end();
      }
   });
};

module.exports = {
   allBooks,
   detailBook,
};
