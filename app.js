const express = require('express');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

app.listen(process.env.PORT, () => {
   console.log('Server on port number : 3000.');
});
