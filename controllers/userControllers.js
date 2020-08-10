//导入加密密码模块
const bcrypt = require('bcryptjs');

// 导入token模块
const jwt = require('jsonwebtoken');

// token 密钥
process.env.SECRET_KEY = 'secret';

var dbConfig = require('../util/dbconfig')
function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}
validitePhoneCode = [];
let phoneCode
let sendCodeP = (phone) => {
    for (var item of validitePhoneCode) {
        if (phone == item.phone) {
            return true
        }
    }
    return false
}


//获取新注册用户详情方法
let getUserInfo = (user_id) => {
    let sql = `select age,sex,job,path,birthday from userinfo where user_id=?`;
    let sqlArr = [user_id];
    return dbConfig.SySqlConnect(sql, sqlArr);
}

//模拟验证码接口
sendCode = (phone) => {
    if (sendCodeP(phone)) {
        return ({
            'code': 400,
            'msg': '已经发送验证码,稍后再发'
        })
    }
    let code = rand(1000, 9999);
    validitePhoneCode.push({
        'phone': phone,
        'code': code
    })
    console.log(validitePhoneCode)
    phoneCode = validitePhoneCode[validitePhoneCode.length - 1].code
    console.log('验证码' + phoneCode)
    return ({
        'code': 200,
        'msg': '发送成功'
    })
}

//登录用户名向手机发送验证码
loginGetCode = (req, res) => {
    let username = req.body.username,
        password = req.body.password;
    let sql = `select * from user where username=? and password = ?`;
    let sqlArr = [username, password];
    let callBack = async (err, data) => {
        if (err) {
            console.log(err)
            res.send({
                'code': 400,
                'msg': '出错了'
            })
        } else if (data == "") {
            console.log(username)
            res.send({
                'code': 400,
                'msg': '用户名或密码出错',
                'data': []
            })
        } else {
            let user_id = data[0].id;
            let phone = data[0].phone;
            let result = await getUserInfo(user_id);
            data[0].userinfo = result[0];
            res.send({
                'code': 200,
                'msg': '验证码发送成功',
                'data': data[0],
            })
            console.log(phone);
            sendCode(phone);
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}

//账号密码携带验证码登录
login = (req, res) => {
    let username = req.body.username,
        password = req.body.password,
        testcode = req.body.testcode;
    console.log('前端传来的body' + req);
    console.log('前端传来的testcode' + testcode);
    console.log('前端的username' + username);
    console.log('前端的password' + password);
    console.log('后端保存的testcode' + phoneCode);
    let sql = `select * from user where username=? and password = ?`;
    let sqlArr = [username, password];
    let callBack = async (err, data) => {
        if (err) {
            console.log(err)
            res.send({
                'code': 400,
                'msg': '出错了'
            })
        } else if (data == "") {
            console.log(username)
            res.send({
                'code': 400,
                'msg': '用户名或密码出错',
                'data': []
            })
        } else {
            let user_id = data[0].id;
            let phone = data[0].phone;
            let result = await getUserInfo(user_id);
            let token = jwt.sign({ data: data[0] }, process.env.SECRET_KEY, { expiresIn: 1440, });
            data[0].userinfo = result[0];
            if (testcode == phoneCode) {
                res.send({
                    'code': 200,
                    'msg': '登录成功',
                    'data': data[0],
                    'token': token
                })
                console.log(phone)
            } else {
                res.send({
                    'code': 200,
                    'msg': '验证码错误',
                    'data': [0]
                })
            }
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}
module.exports = {
    loginGetCode,
    login,
}