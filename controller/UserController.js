const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');

const join = (req, res) => {
   const { email, password, name } = req.body;

   let sql = 'insert into users (email, password, name, salt) values (?,?,?,?)';

   const salt = crypto.randomBytes(64).toString('base64');
   const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

   console.log('salt : ', salt);

   let values = [email, hashPassword, name, salt];

   conn.query(sql, values, (err, result) => {
      if (err) {
         console.log(err);
         return res.status(StatusCodes.BAD_REQUEST).end();
      }

      res.status(StatusCodes.CREATED).json(result);
   });
};

const login = (req, res) => {
   const { email, password } = req.body;

   let sql = 'select * from users where email=?';
   conn.query(sql, email, (err, result) => {
      if (err) {
         console.log(err);
         return res.status(StatusCodes.BAD_REQUEST).end();
      }

      const loginUser = result[0];

      const hashPassword = crypto
         .pbkdf2Sync(password, loginUser.salt, 10000, 64, 'sha512')
         .toString('base64');

      if (loginUser && loginUser.password === hashPassword) {
         const token = jwt.sign(
            {
               email: loginUser.email,
            },
            process.env.PRIVATE_KEY,
            {
               expiresIn: '30m',
               issuer: 'vedivero',
            },
         );

         res.cookie('token', token, {
            httpOnly: true,
         });

         res.status(StatusCodes.OK).json(result);
      } else {
         return res.status(StatusCodes.UNAUTHORIZED).end();
      }
   });
};

const reqPwdReset = (req, res) => {
   const { email } = req.body;

   let sql = 'select * from users where email=?';

   conn.query(sql, email, (err, result) => {
      if (err) {
         return res.status(StatusCodes.BAD_REQUEST).end();
      }

      const user = result[0];
      if (user) return res.status(StatusCodes.OK).end();
      else return res.status(StatusCodes.UNAUTHORIZED).end();
   });
};

const pwdReset = (req, res) => {
   const { email, password } = req.body;

   const salt = crypto.randomBytes(64).toString('base64');
   const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');

   let sql = 'update users set password = ?, salt=? where email = ?';
   let values = [hashPassword, salt, email];

   conn.query(sql, values, (err, result) => {
      if (err) {
         return res.status(StatusCodes.BAD_REQUEST).end();
      }

      if (result.affectedRows === 0) return res.status(StatusCodes.BAD_REQUEST).end();
      else return res.status(StatusCodes.OK).json(result);
   });
};

module.exports = {
   join,
   login,
   reqPwdReset,
   pwdReset,
};
