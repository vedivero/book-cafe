//const conn = require('../mariadb');
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

   const { items, delivery, totalQuantity, totalPrice, user_id, firstBookTitle } = req.body;

   let delivery_Id;
   let order_id;

   //into delivery
   let sql = 'INSERT INTO delivery(address, receiver, contact) values (?, ?, ?)';
   let values = [delivery.address, delivery.receiver, delivery.contact];

   let [result] = await conn.execute(sql, values);

   console.log(result);

   //into order
   sql =
      'INSERT INTO orders(book_title, total_quantity, total_price, user_id, delivery_id) values (?, ?, ?, ?, ?)';
   values = [firstBookTitle, totalQuantity, totalPrice, user_id, delivery_Id];

   [result] = await conn.execute(sql, values);
   order_id = result.insertId;

   sql = `select book_id, quantity from cart where id in(?)`;
   let orderItems = await conn.query(sql, [items]);

   //into orderedBook
   sql = 'INSERT INTO orderedBook(order_id, book_id, quantity) values (?)';
   values = [];
   items.forEach((item) => {
      values.push([order_id, item.book_id, item.quantity]);
   });
   [result] = await conn.query(sql, [values]);
   result = await deleteCartItems(req, res);
   return res.status(StatusCodes.OK).json(result);
};

const deleteCartItems = async (req, res) => {
   let sql = `delete from cart where id in (?)`;
   let values = [1, 2, 3];

   let result = await conn.execute(sql, [items]);
   return result;
};

const getOrders = async (req, res) => {
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
};

const getOrderDetail = async (req, res) => {
   const { id } = req.params;
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

   let [rows, fields] = await conn.query(sql, [id]);
   return res.status(StatusCodes.OK).json(rows);
};

module.exports = {
   orders,
   getOrders,
   getOrderDetail,
};
