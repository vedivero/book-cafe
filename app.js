const express = require('express');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.listen(process.env.PORT, () => {
   console.log(`Server on port number : ${process.env.PORT}.`);
});

const userRouter = require('./routes/users');

app.use('/users', userRouter);
