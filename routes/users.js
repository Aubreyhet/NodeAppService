var express = require('express');
var router = express.Router();
var User = require('../controllers/userControllers')
/* GET users listing. */
router.post('/login', User.login);

router.post('/loginGetCode', User.loginGetCode);

router.post(`/adduserinfo`, User.addUserInfo)

router.get('/getUserInfoList', User.getUserInfolist)

router.get('/pagination', User.pagination)

//按照填入信息查询用户信息
router.get('/inquiry', User.inquiry)

//修改用户前通过id查询用户信息
router.get('/modifyUser/:id', User.modifyUser)

router.put('/:id/status/:status', User.userStateChange)

router.post('/modifyUsered', User.modifyUsered)

router.delete('/deleteuser/:id', User.deleteUser)




module.exports = router;
