const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const allCategories = (req, res) => {
   let sql = 'select * from category';
   conn.query(sql, (err, result) => {
      if (err) {
         console.log(err);
         return res.status(StatusCodes.BAD_REQUEST).end();
      }
      return res.status(StatusCodes.CREATED).json(result);
   });
};

module.exports = {
   allCategories,
};
