var express = require('express');
var router = express.Router();
var User = require('../controllers/userControllers')
/* GET users listing. */
router.post('/login', User.login);

router.post('/loginGetCode', User.loginGetCode);

router.get('/getUserInfoList', User.getUserInfolist)

router.put(`/:user_id/status/:newstatus`, User.userStateChange)

router.post(`/adduserinfo`, User.addUserInfo)


module.exports = router;
