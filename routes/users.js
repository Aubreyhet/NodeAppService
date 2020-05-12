var express = require('express');
var router = express.Router();
var User = require('../controllers/userControllers')
/* GET users listing. */
router.post('/sendCode', User.sendCode);
router.post('/codePhoneLogin', User.codePhoneLogin);
router.post('/login', User.login);
router.post('/editUserInfo', User.editUserInfo);
module.exports = router;
