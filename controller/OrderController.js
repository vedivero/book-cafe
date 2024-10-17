const ensureAuthorization = require('../auth');
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');
const mariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');

const orders = async (req, res) => {
   const conn = await mariadb.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'root',
      database: 'bookCafe',
      dateStrings: true,
   });

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
      const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;

      //into delivery
      let sql = 'INSERT INTO delivery(address, receiver, contact) values (?, ?, ?)';
      let values = [delivery.address, delivery.receiver, delivery.contact];
      let [result] = await conn.execute(sql, values);
      let delivery_Id = result.insertId;

      //into order
      sql =
         'INSERT INTO orders(book_title, total_quantity, total_price, user_id, delivery_id) values (?, ?, ?, ?, ?)';
      values = [firstBookTitle, totalQuantity, totalPrice, authorization.id, delivery_Id];

      [result] = await conn.execute(sql, values);
      let order_id = result.insertId;

      sql = `select book_id, quantity from cart where id in(?)`;
      let [orderItems, fields] = await conn.query(sql, [items]);

      //into orderedBook
      sql = 'INSERT INTO orderedBook(order_id, book_id, quantity) values ?';
      values = [];
      orderItems.forEach((item) => {
         values.push([order_id, item.book_id, item.quantity]);
      });
      [result] = await conn.query(sql, [values]);
      result = await deleteCartItems(conn, items);
      return res.status(StatusCodes.OK).json(result);
   }
};

const deleteCartItems = async (conn, items) => {
   const placeholders = items.map(() => '?').join(', ');
   const sql = `DELETE FROM cart WHERE id IN (${placeholders})`;
   const [result] = await conn.execute(sql, items);
   return result;
};

const getOrders = async (req, res) => {
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
      const conn = await mariadb.createConnection({
         host: '127.0.0.1',
         user: 'root',
         password: 'root',
         database: 'bookCafe',
         dateStrings: true,
      });
      let sql = `SELECT orders.id, book_title, total_quantity, total_price, created_at,
               address, receiver, contact
               FROM orders LEFT JOIN delivery
               ON orders.delivery_id = delivery.id;`;

      let [rows, fields] = await conn.query(sql);
      return res.status(StatusCodes.OK).json(rows);
   }
};

const getOrderDetail = async (req, res) => {
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
      const orderId = req.params.id;
      const conn = await mariadb.createConnection({
         host: '127.0.0.1',
         user: 'root',
         password: 'root',
         database: 'bookCafe',
         dateStrings: true,
      });
      let sql = `SELECT  title, author, price, quantity
               FROM orderedBook LEFT JOIN books
               ON orderedBook.book_id = books.id;`;

      let [rows, fields] = await conn.query(sql, [orderId]);
      return res.status(StatusCodes.OK).json(rows);
   }
};

module.exports = {
   orders,
   getOrders,
   getOrderDetail,
};
