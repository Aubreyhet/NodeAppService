//导入加密密码模块
const bcrypt = require('bcryptjs');

// 导入token模块
const jwt = require('jsonwebtoken');

// token 密钥
process.env.SECRET_KEY = 'secret';

var dbConfig = require('../util/dbconfig');
const { query } = require('express');
const { connect } = require('../routes');
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
    let sql = `select * from userinfo where user_id=?`;
    let sqlArr = [user_id];
    return dbConfig.SySqlConnect(sql, sqlArr);
}

//插入数据

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
    let j_number = req.body.j_number,
        password = req.body.password;
    let sql = `select * from user where j_number=? and password = ?`;
    let sqlArr = [j_number, password];
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
                'msg': '工号或密码出错',
                'data': []
            })
        } else {
            let user_id = data[0].id;
            let result = await getUserInfo(user_id);
            let phone = result[0].phone;
            res.send({
                'code': 200,
                'msg': '验证码发送成功',
            })
            console.log(phone);
            sendCode(phone);
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}

//账号密码携带验证码登录
login = (req, res) => {
    let j_number = req.body.j_number,
        password = req.body.password,
        testcode = req.body.testcode;
    console.log('前端传来的body' + req);
    console.log('前端传来的testcode' + testcode);
    console.log('j_number' + j_number);
    console.log('前端的password' + password);
    console.log('后端保存的testcode' + phoneCode);
    let sql = `select * from user where j_number=? and password = ?`;
    let sqlArr = [j_number, password];
    let callBack = async (err, data) => {
        if (err) {
            console.log(err)
            res.send({
                'code': 400,
                'msg': '出错了'
            })
        } else if (data == "") {
            console.log(j_number)
            res.send({
                'code': 400,
                'msg': '工号或密码出错',
                'data': []
            })
        } else {
            let token = jwt.sign({ data: data[0] }, process.env.SECRET_KEY, { expiresIn: 1440, });
            if (testcode == phoneCode) {
                res.send({
                    'code': 200,
                    'msg': '登录成功',
                    'token': token
                })
            } else {
                res.send({
                    'code': 200,
                    'msg': '验证码错误',
                })
            }
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}


//获取用户列表
getUserInfolist = (req, res) => {
    console.log('进到获取用户列表函数')
    let sql = `SELECT * FROM user u,userinfo uf where uf.user_id = u.id`
    let sqlArr = []
    let callBack = (err, data) => {
        if (err) {
            console.log(sql)
            res.send({
                'code': 400,
                'msg': '获取用户列表失败',
            })
        } else {
            console.log(sql)
            res.send({
                'total': data.length,
                'code': 200,
                'msg': '获取用户列表成功',
                'data': Transformation(data),
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}

pagination = (req, res) => {
    console.log('进到获取用户列表函数')
    console.log(req.query.query)
    let pagenum = req.query.pagenum - 1
    let pagesize = req.query.pagesize
    let forlike = `%${req.query.query}%`
    console.log(pagesize)
    let sql = `SELECT * FROM user u,userinfo uf where uf.user_id = u.id and uf.name like ? limit ${pagenum},${pagesize}`
    let sqlArr = [forlike]
    let callBack = (err, data) => {
        if (err) {
            console.log(sql)
            res.send({
                'code': 400,
                'msg': '获取用户列表失败',
            })
        } else {
            console.log(sql)
            res.send({
                'code': 200,
                'msg': '获取用户列表成功',
                'data': Transformation(data),
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}


inquiry = (req, res) => {
    console.log('进到获取用户列表函数')
    console.log(req.query.query)
    let forlike = `%${req.query.query}%`
    let sql = `SELECT * FROM user u,userinfo uf where uf.user_id = u.id and uf.name like ?`
    let sqlArr = [forlike]
    let callBack = (err, data) => {
        if (err) {
            console.log(sql)
            res.send({
                'code': 400,
                'msg': '获取用户列表失败',
            })
        } else {
            console.log(sql)
            res.send({
                'total': data.length,
                'code': 200,
                'msg': '获取用户列表成功',
                'data': Transformation(data),
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}

//添加用户
addUserInfo = (req, res) => {
    let name = req.body.name,
        password = req.body.password,
        email = req.body.email,
        phone = req.body.phone;
    console.log(req.body)
    console.log(req.body.name)
    // let sql = `INSERT INTO user (password)VALUES (?);INSERT INTO userinfo (user_id,name,email,phone)VALUES ((SELECT LAST_INSERT_ID()),?,?,?)`;
    let sql = 'INSERT INTO user (password)VALUES ("123456");INSERT INTO userinfo (user_id,age,name)VALUES ((SELECT LAST_INSERT_ID()),36,"zhang");'
    let sqlArr = [password, name, email, phone];
    let callBack = (err, data) => {
        console.log(sql)
        if (err) {
            res.send({
                'arr': sql,
                'code': 400,
                'msg': '用户信息添加失败'
            })
        } else {
            res.send({
                'code': 201,
                'msg': '用户信息添加成功'
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}
userStateChange = (req, res) => {
    let status = req.params.status,
        id = req.params.id
    let sql = `UPDATE user SET status=? WHERE id = ?`;
    let sqlArr = [status, id];
    console.log(req.params)
    let callBack = (err, data) => {
        if (err) {
            res.send({
                'code': 400,
                'msg': '用户状态更新失败,请刷新列表'
            })
        } else {
            res.send({
                'code': 200,
                'msg': '用户状态更新成功',
                'data': data
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}


//修改用户信息前根据用户id获取用户信息
modifyUser = (req, res) => {
    let id = req.params.id
    console.log(id)
    let sql = 'SELECT * FROM user u,userinfo uf where u.id = ? and uf.user_id = u.id'
    let sqlArr = [id]
    let callBack = (err, data) => {
        if (err) {
            res.send({
                'code': 400,
                'msg': '用户信息获取失败'
            })
        } else {
            res.send({
                'code': 200,
                'msg': '用户信息获取成功',
                'data': data
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}



modifyUsered = (req, res) => {
    let id = req.body.id,
        email = req.body.email,
        phone = req.body.phone;
    console.log('前台传递过来的用户id:' + id + '-----')
    console.log('前台传递过来的用户信息body:' + req.body + '-----')
    console.log('前台传递过来的用户信息query:' + req.query + '-----')
    let sql = `UPDATE user u,userinfo uf SET uf.phone=?,uf.email=? where u.id=? and uf.user_id = u.id `
    let sqlArr = [phone, email, id]
    let callBack = (err, data) => {
        if (err) {
            res.send({
                'code': 400,
                'msg': '用户信息更新失败！'
            })
        } else {
            res.send({
                'code': 200,
                'msg': '用户信息更新成功！'
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

deleteUser = (req, res) => {
    let id = req.params.id;
    console.log(id)
    let sql = 'DELETE user,userinfo FROM user,userinfo WHERE userinfo.user_id=user.id AND user.id = ?'
    let sqlArr = [id]
    let callBack = (err, data) => {
        if (err) {
            res.send({
                'code': 400,
                'msg': '删除用户失败！'
            })
        } else {
            res.send({
                'code': 200,
                'msg': '删除用户成功！'
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack)
}

// 取值类型转换
Transformation = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].status !== 0) {
            arr[i].status = true
        } else { arr[i].status = false }
    }
    return arr
}

module.exports = {
    loginGetCode,
    login,
    getUserInfolist,
    pagination,
    inquiry,
    userStateChange,
    addUserInfo,
    modifyUser,
    modifyUsered,
    deleteUser
}