var express = require('express');
var router = express.Router();
var User = require('../controllers/userControllers')
/* GET users listing. */
router.post('/login', User.login);
router.post('/loginGetCode', User.loginGetCode);
module.exports = router;
