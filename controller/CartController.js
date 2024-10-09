const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const addCart = (req, res) => {
   const { book_id, quantity, user_id } = req.body;

   let sql = 'INSERT INTO cart(book_id, quantity, user_id) values (?, ?, ?)';
   let values = [book_id, quantity, user_id];

   conn.query(sql, values, (err, result) => {
      if (err) {
         console.log(err);
         return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.CREATED).json(result);
   });
};

const getCart = (req, res) => {
   let { user_id, selected } = req.body;

   let sql = `select cart.id, book_id, title, summary, quantity, price
                from cart left join books
                on cart.book_id = books.id
                where user_id = ?
                and cart.id in (?)`;

   conn.query(sql, [user_id, selected], (err, result) => {
      if (err) {
         console.log(err);
         return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.CREATED).json(result);
   });
};

const removeCart = (req, res) => {
   let { id } = req.params;

   let sql = `delete from cart where id = ?`;

   conn.query(sql, id, (err, result) => {
      if (err) {
         console.log(err);
         return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.CREATED).json(result);
   });
};

module.exports = {
   addCart,
   getCart,
   removeCart,
};
