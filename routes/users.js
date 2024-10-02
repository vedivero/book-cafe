const express = require('express');
const router = express.Router();
const { join, login, reqPwdReset, pwdReset } = require('../controller/UserController');

router.use(express.json());

router.post('/join', join);
router.post('/login', login);
router.post('/reset', reqPwdReset);
router.put('/reset', pwdReset);

module.exports = router;
