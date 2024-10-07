const express = require('express');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.listen(process.env.PORT, () => {
   console.log(`Server on port number : ${process.env.PORT}.`);
});

const userRouter = require('./routes/users');
const bookRouter = require('./routes/books');
const cateroryRouter = require('./routes/category');
const favoriteRouter = require('./routes/favorite');
const cartRouter = require('./routes/carts');
const orderRouter = require('./routes/orders');

app.use('/users', userRouter);
app.use('/books', bookRouter);
app.use('/category', cateroryRouter);
app.use('/favorite', favoriteRouter);
app.use('/carts', cartRouter);
app.use('/orders', orderRouter);
