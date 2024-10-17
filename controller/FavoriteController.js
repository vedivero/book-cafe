const ensureAuthorization = require('../auth');
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const addFavorite = (req, res) => {
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
      const book_id = req.params.id;

      let authorization = ensureAuthorization(req);

      let sql = 'INSERT INTO favorite(user_id, favorite_book_id) values (?, ?)';
      let values = [authorization.id, book_id];

      conn.query(sql, values, (err, result) => {
         if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
         }
         return res.status(StatusCodes.CREATED).json(result);
      });
   }
};

const removeFavorite = (req, res) => {
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
      const book_id = req.params.id;
      let authorization = ensureAuthorization(req);
      let sql = 'delete from favorite where user_id = ? and favorite_book_id = ?';
      let values = [authorization.id, book_id];

      conn.query(sql, values, (err, result) => {
         if (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
         }
         return res.status(StatusCodes.CREATED).json(result);
      });
   }
};

module.exports = {
   addFavorite,
   removeFavorite,
};
