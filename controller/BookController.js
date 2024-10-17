const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const ensureAuthorization = require('../auth');
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');

const allBooks = (req, res) => {
   let allBooksRes = {};

   let { category_id, news, limit, currentPage } = req.query;

   let offset = limit * (currentPage - 1);
   let sql = `select SQL_CALC_FOUND_ROWS *,
            (select count(*) from favorite where books.id = favorite_book_id ) as favorite
               from
                  books `;
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
      if (result.length) {
         allBooksRes.books = result;
      } else {
         return res.status(StatusCodes.NOT_FOUND).end();
      }
   });

   sql = `select found_rows()`;
   conn.query(sql, (err, result) => {
      if (err) {
         console.log(err);
         return res.status(StatusCodes.BAD_REQUEST).end();
      }

      let pagination = {};
      pagination.currentPage = currentPage;
      pagination.totalCount = result[0]['found_rows()'];

      allBooksRes.pagination = pagination;

      return res.status(StatusCodes.OK).json(allBooksRes);
   });
};

const detailBook = (req, res) => {
   let authorization = ensureAuthorization(req);

   if (authorization instanceof TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
         message: '로그인 세션이 만료되었습니다.',
      });
   } else if (authorization instanceof JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
         message: '잘못된 토큰입니다.',
      });
   } else if (authorization instanceof ReferenceError) {
      let book_id = req.params.id;
      let sql = `SELECT *,
                  (select count(*) from favorite where favorite_book_id = books.id) as favorities
                  FROM bookCafe.books left join category
                  on books.category_id = category.category_id
                  where books.id = ?`;
      let values = [book_id];
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
   } else {
      let book_id = req.params.id;

      let sql = `SELECT *,
                  (select count(*) from favorite where favorite_book_id = books.id) as favorities,
                  (select exists(select * from favorite where user_id = ? and favorite_book_id = ?) )as favorite
                FROM bookCafe.books left join category
                  on books.category_id = category.category_id where books.id = ?`;
      let values = [authorization.id, book_id, book_id];
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
   }
};

module.exports = {
   allBooks,
   detailBook,
};
