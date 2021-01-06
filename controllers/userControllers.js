//导入加密密码模块
const bcrypt = require('bcryptjs');

// 导入token模块
const jwt = require('jsonwebtoken');

// token 密钥
process.env.SECRET_KEY = 'secret';

//插入阿里大鱼插件
const Core = require('@alicloud/pop-core');

//引入配置文件
const aliconfig = require('../util/aliconfig');

//配置
let client = new Core(aliconfig.alicloud)
let requestOption = {
    method: 'POST'
};

// 数据库配置
var dbConfig = require('../util/dbconfig');

// 导入express框架
const { query } = require('express');

// 路由模块
const { connect } = require('../routes');

// 数据模块
const { db } = require('../util/dbconfig');

//生成随机数
function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

// 存放生成验证码的数组
let validitePhoneCode = [];

// 获取新注册用户详情方法
let getUserInfo = (user_id) => {
    let sql = `select * from userinfo where user_id=?`;
    let sqlArr = [user_id];
    return dbConfig.SySqlConnect(sql, sqlArr);
}

// 使用阿里大鱼向手机号发送验证码 使用需要调用 （发送验证码之后将此验证码删除掉）
sendCoreCode = (req, res) => {
    let j_number = req.body.j_number,
        password = req.body.password;
    let sql = `select id from user where j_number=${j_number} and password = ${password}`;
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
                'msg': '工号或密码出错'
            })
        } else {
            let user_id = data[0].id;
            console.log(user_id)
            let userinfo = await getUserInfo(user_id);
            console.log(userinfo)
            let phone = userinfo[0].phone;
            let phoneCode = rand(1000, 9999);
            let params = {
                "RegionId": "cn-hangzhou",
                "PhoneNumbers": phone,
                "SignName": "AubreyApp",
                "TemplateCode": "SMS_200179648",
                "TemplateParam": JSON.stringify({ "code": phoneCode })
            }
            client.request('SendSms', params, requestOption).then((result) => {
                console.log(result)
                if (result.Code == 'OK') {                   
                    validitePhoneCode.push({
                        'j_number':j_number,
                        'phoneCode':phoneCode
                    })
                    res.send({
                        'code': 200,
                        'msg': '验证码发送成功',
                    })            
                } else {
                    res.send({
                        'code': 400,
                        'msg': '验证码发送失败！'
                    })
                }
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}


//使用工号密码向手机发送验证码(发送验证码之后将此验证码删除掉)
loginGetCode = (req, res) => {
    let j_number = req.body.j_number,
        password = req.body.password;
    let sql = `select * from user where j_number=${j_number} and password = ${password}`;
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
                'msg': '工号或密码出错'
            })
        } else {
            let phoneCode = rand(1000,9999);
            validitePhoneCode.push({
                'j_number':j_number,
                'phoneCode':phoneCode
            })
            res.send({
                'code': 200,
                'msg': '验证码发送成功',
            })
            console.log(phoneCode);
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
    // 此时需要根据前台传来的j_number去到validitePhoneCode数组中循环遍历寻找存在数组中的验证码
    console.log('后台数组保存的验证码' + forCodeArr(j_number));
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
                'msg': '工号或密码出错'
            })
        } else {
            let token = jwt.sign({ data: data[0] }, process.env.SECRET_KEY, { expiresIn: 1440, });
            if (forCodeArr(j_number)==testcode) {
                res.send({
                    'code': 200,
                    'msg': '登录成功',
                    'data': data[0],
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
    let sql = `INSERT INTO user (password) VALUES ('123456');
    INSERT INTO userinfo (user_id,name,email,phone)VALUES ((SELECT LAST_INSERT_ID()),'liusi','dda@dsf.com','13584805555')`;
    let sqlArr = [password, name, email, phone];
    let callBack = (err, data) => {
        console.log(sql)
        if (err) {
            console.log(err)
            res.send({

                'code': 400,
                'msg': '用户信息添加失败'
            })
        } else {
            console.log(data)

            res.send({
                'code': 201,
                'msg': '用户信息添加成功'
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}


// addUserInfo = (req, res) => {
//     let name = req.body.name,
//         password = req.body.password,
//         email = req.body.email,
//         phone = req.body.phone;
//     u_id
//     db.query(`INSERT INTO userinfo (user_id,name,email,phone)VALUES ((SELECT LAST_INSERT_ID()),${name},${email},${phone})`, function (err, data) {
//         if (err) {
//             console.log(err)
//             res.send({
//                 'code': 400,
//                 'msg': '用户信息添加失败'
//             })
//         } else {
//             console.log(data)
//             res.send({
//                 'code': 201,
//                 'msg': '用户信息添加成功'
//             })
//         }
//     })
// }

// addUserInfo = (req, res) => {
//     let name = req.body.name,
//         password = req.body.password,
//         email = req.body.email,
//         phone = req.body.phone;
//     db.query(`INSERT INTO userinfo (name,email,phone,password) VALUES (${name},${email},${phone},${password})`, function (err, data) {
//         if (err) {
//             console.log(err)
//             res.send({
//                 'code': 400,
//                 'msg': '用户信息添加失败'
//             })
//         } else {
//             console.log(data)
//             res.send({
//                 'code': 201,
//                 'msg': '用户信息添加成功'
//             })
//         }
//     })
// }




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
    deleteUser,
    //使用阿里大鱼发送验证码接口
    sendCoreCode,
}