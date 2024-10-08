const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allBooks = (req, res) => {
   let { category_id, news, limit, currentPage } = req.query;

   let offset = limit * (currentPage - 1);
   let sql =
      'select *,(select count(*) from favorite where books.id = favorite_book_id ) as favorite from books ';
   let values = [];

   if (category_id && news) {
      sql += 'where category_id = ? and pub_date between date_sub(now(), interval 1 month) and now()';
      values = [category_id];
   } else if (category_id) {
      sql += 'where category_id = ?';
      values = [category_id];
   } else if (news) {
      sql += 'where pub_date between date_sub(now(), interval 1 month) and now()';
   }
   sql += ` limit ? offset ?`;
   values.push(parseInt(limit), offset);

   conn.query(sql, values, (err, result) => {
      if (err) {
         console.log(err);
         return res.status(StatusCodes.BAD_REQUEST).end();
      }
      if (result[0]) {
         return res.status(StatusCodes.OK).json(result);
      } else {
         return res.status(StatusCodes.NOT_FOUND).end();
      }
   });
};

const detailBook = (req, res) => {
   let { user_id } = req.body;
   let book_id = req.params.id;

   let sql = `SELECT *,
               (select count(*) from favorite where favorite_book_id = books.id) as favorities,
               (select exists(select * from favorite where user_id = ? and favorite_book_id = ?) )as favorite
             FROM bookCafe.books left join category
               on books.category_id = category.category_id where books.id = ?`;
   let values = [user_id, book_id, book_id];
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

module.exports = {
   allBooks,
   detailBook,
};
