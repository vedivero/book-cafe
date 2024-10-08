const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const addFavorite = (req, res) => {
   const { favorite_book_id } = req.params;
   const { user_id } = req.body;

   let sql = 'INSERT INTO favorite(user_id, favorite_book_id) values (?, ?)';
   let values = [user_id, favorite_book_id];

   conn.query(sql, values, (err, result) => {
      if (err) {
         console.log(err);
         return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.CREATED).json(result);
   });
};

const removeFavorite = (req, res) => {
   const { favorite_book_id } = req.params;
   const { user_id } = req.body;

   let sql = 'delete from favorite where user_id = ? and favorite_book_id = ?';
   let values = [user_id, favorite_book_id];

   conn.query(sql, values, (err, result) => {
      if (err) {
         console.log(err);
         return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.CREATED).json(result);
   });
};

module.exports = {
   addFavorite,
   removeFavorite,
};
