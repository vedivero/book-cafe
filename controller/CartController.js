const ensureAuthorization = require('../auth');
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');

const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const addCart = (req, res) => {
   const { book_id, quantity } = req.body;

   let authorization = ensureAuthorization(req);

   if (authorization instanceof TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
         message: '로그인 세션이 만료되었습니다.',
      });
   } else if (authorization instanceof JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
         message: '잘못된 토큰입니다.',
      });
   } else {
      let sql = 'INSERT INTO cart(book_id, quantity, user_id) values (?, ?, ?)';
      let values = [book_id, quantity, authorization.id];

      conn.query(sql, values, (err, result) => {
         if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
         }
         return res.status(StatusCodes.CREATED).json(result);
      });
   }
};

const getCart = (req, res) => {
   let { selected } = req.body;

   let authorization = ensureAuthorization(req);

   if (authorization instanceof TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
         message: '로그인 세션이 만료되었습니다.',
      });
   } else if (authorization instanceof JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
         message: '잘못된 토큰입니다.',
      });
   } else {
      let sql = `select cart.id, book_id, title, summary, quantity, price
      from cart left join books
      on cart.book_id = books.id
      where user_id = ?`;

      let values = [authorization.id, selected];

      if (selected) {
         sql += `and cart.id in (?)`;
         values.push(selected);
      }

      conn.query(sql, values, (err, result) => {
         if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
         }
         return res.status(StatusCodes.CREATED).json(result);
      });
   }
};

const removeCart = (req, res) => {
   let authorization = ensureAuthorization(req);

   if (authorization instanceof TokenExpiredError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
         message: '로그인 세션이 만료되었습니다.',
      });
   } else if (authorization instanceof JsonWebTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
         message: '잘못된 토큰입니다.',
      });
   } else {
      let cartItemId = req.params.id;

      let sql = `delete from cart where id = ?`;

      conn.query(sql, cartItemId, (err, result) => {
         if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
         }
         return res.status(StatusCodes.CREATED).json(result);
      });
   }
};

module.exports = {
   addCart,
   getCart,
   removeCart,
};
