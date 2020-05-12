var dbConfig = require('../util/dbconfig')
function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}
validitePhoneCode = [];
let sendCodeP = (phone) => {
    for (var item of validitePhoneCode) {
        if (phone == item.phone) {
            return true
        }
    }
    return false
}
let findCodeAndPhone = (phone, code) => {
    for (var item of validitePhoneCode) {
        if (phone == item.phone && code == item.code) {
            return 'login'
        }
    }
    return 'error'
}
//验证码登录检测是否是第一次登录
let phoneLoginBind = async (phone) => {
    let sql = 'select * from user where username=? or phone=?';
    let sqlArr = [phone, phone];
    let res = await dbConfig.sySqlConnect(sql, sqlArr);
    if (res.length) {
        return res
    } else {

    }
}
//用户注册方法
let regUser = (phone) => {
    //检测是否第一次注册
    let avatar = ''
}
//模拟验证码接口
sendCode = (req, res) => {
    let phone = req.query.phone;
    if (sendCodeP(phone)) {
        res.send({
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
    res.send({
        'code': 200,
        'msg': '发送成功'
    })
    console.log(code)
}
//验证码登陆接口
codePhoneLogin = (req, res) => {
    let { phone, code } = req.query;
    //该手机号码是否发送过验证码
    if (sendCodeP(phone)) {
        let status = findCodeAndPhone(phone, code);
        if (status == 'login') {
            //登录成功 已经登录之后的操作
            res.send({
                'code': 200,
                'msg': '登陆成功'
            })
        } else if (status == 'error') {
            res.send({
                'code': 200,
                'msg': '登录失败'
            })
        }
    } else {
        res.send({
            'code': 400,
            'msg': '未发送验证码'
        })
    }
}
module.exports = {
    sendCode,
    codePhoneLogin
}