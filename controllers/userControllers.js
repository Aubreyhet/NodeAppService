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
    let res = await dbConfig.SySqlConnect(sql, sqlArr);
    if (res.length) {
        res[0].userinfo = await getUserInfo(res[0].id);
        return res
    } else {
        let res = await regUser(phone);
        res[0].userinfo = await getUserInfo(res[0].id);
        return res
    }
}

//用户注册方法
let regUser = async (phone) => {
    //检测是否第一次注册
    let userpic = 'https://avatars2.githubusercontent.com/u/24616366?s=460&u=496a9b265fc23ccd9f9a1113d93effc71d25422a&v=4';
    let sql = `insert into user(username,userpic,phone,create_time) value(?,?,?,?)`;
    let sqlArr = [phone, userpic, phone, (new Date())];
    let res = await dbConfig.SySqlConnect(sql, sqlArr);
    if (res.affectedRows == 1) {
        //执行成功获取用户信息
        //获取用户信息的方法
        let user = await getUser(phone);
        //绑定用户副表
        let userinfo = await createUserInfo(user[0].id);
        if (userinfo.affectedRows == 1) {
            return user
        } else {
            return false
        }
    } else {
        return false;
    }
}

//获取用户信息的方法
let getUser = (username) => {
    let sql = `select * from user where id=? or phone=? or username=?`;
    let sqlArr = [username, username, username];
    return dbConfig.SySqlConnect(sql, sqlArr);
}

//创建用户副标
let createUserInfo = (user_id) => {
    let sql = `insert into userinfo(user_id,age,sex,job) values(?,?,?,?)`;
    let sqlArr = [user_id, 18, 2, '未设置'];
    return dbConfig.SySqlConnect(sql, sqlArr);
}
//获取新注册用户详情方法
let getUserInfo = (user_id) => {
    let sql = `select age,sex,job,path,birthday from userinfo where user_id=?`;
    let sqlArr = [user_id];
    return dbConfig.SySqlConnect(sql, sqlArr);
}

//查看用户详情
let findUserInfo = async (user_id) => {
    let sql = `select * from userinfo where user_id=?`;
    let sqlArr = [user_id];
    let res = await dbConfig.SySqlConnect(sql, sqlArr);
    if (res.length) {
        return true
    }
    return false;
}

//修改用户信息详情方法
let setUserInfo = async (user_id, age, sex, job, path, birthday) => {
    if (await findUserInfo(user_id)) {
        let sql = `update userinfo set age=?,sex=?,job=?,path=?,birthday=? where user_id=?`;
        let sqlArr = [age, sex, job, path, birthday, user_id];
        let res = await dbConfig.SySqlConnect(sql, sqlArr);
        if (res.affectedRows == 1) {
            let user = await getUser(user_id);
            let userinfo = await getUserInfo(user_id)
            user[0].userinfo = userinfo[0];
            return user
        } else {
            return false
        }
    } else {
        let sql = `insert into userinfo (user_id,age,sex,job,path,birthday) values(?,?,?,?,?,?)`;
        let sqlArr = [user_id, age, sex, job, path, birthday];
        let res = await dbConfig.SySqlConnect(sql, sqlArr);
        if (res.affectedRows == 1) {
            let user = await getUser(user_id);
            let userinfo = await getUserInfo(user_id)
            user[0].userinfo = userinfo[0];
            return user
        } else {
            return false
        }
    }
}

//修改用户名称
let setUserName = async (user_id, username) => {
    let sql = `update user set username=? where id=?`;
    let sqlArr = [username, user_id];
    let res = await dbConfig.SySqlConnect(sql, sqlArr);
    if (res.affectedRows == 1) {
        return true
    } else {
        return false
    }
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
codePhoneLogin = async (req, res) => {
    let { phone, code } = req.query;
    //该手机号码是否发送过验证码
    if (sendCodeP(phone)) {
        let status = findCodeAndPhone(phone, code);
        if (status == 'login') {
            //登录成功 已经登录之后的操作
            let user = await phoneLoginBind(phone);
            res.send({
                'code': 200,
                'msg': '登陆成功',
                'data': user[0]
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
//用户名或者手机号登录
login = (req, res) => {
    let username = req.query.username,
        password = req.query.password;
    let phone = /^1[3456789]\d{9}$/;
    let email = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
    if (phone.test(username)) {
        let sql = `select * from user where phone=? and password=?`;
        let sqlArr = [username, password, username, password];
        let callBack = async (err, data) => {
            if (err) {
                console.log(err)
                res.send({
                    'code': 400,
                    'msg': '出错了'
                })
            } else if (data == "") {
                res.send({
                    'code': 400,
                    'msg': '手机号或密码出错',
                    'data': []
                })
            } else {
                let user_id = data[0].id;
                let result = await getUserInfo(user_id);
                data[0].userinfo = result[0];
                res.send({
                    'code': 200,
                    'msg': '登录成功',
                    'data': data[0]
                })
            }
        }
        dbConfig.sqlConnect(sql, sqlArr, callBack);
    } else if (email.test(username)) {
        let sql = `select * from user where email=? and password=?`;
        let sqlArr = [username, password];
        let callBack = async (err, data) => {
            if (err) {
                console.log(err)
                res.send({
                    'code': 400,
                    'msg': '出错了'
                })
            } else if (data == "") {
                res.send({
                    'code': 400,
                    'msg': '邮箱或密码出错',
                    'data': []
                })
            } else {
                let user_id = data[0].id;
                let result = await getUserInfo(user_id);
                data[0].userinfo = result[0];
                res.send({
                    'code': 200,
                    'msg': '登录成功',
                    'data': data[0]
                })
            }
        }
        dbConfig.sqlConnect(sql, sqlArr, callBack);
    } else {
        let sql = `select * from user where username=? and password=?`;
        let sqlArr = [username, password];
        let callBack = async (err, data) => {
            if (err) {
                console.log(err)
                res.send({
                    'code': 400,
                    'msg': '出错了'
                })
            } else if (data == "") {
                res.send({
                    'code': 400,
                    'msg': '用户名或密码出错',
                    'data': []
                })
            } else {
                let user_id = data[0].id;
                let result = await getUserInfo(user_id);
                data[0].userinfo = result[0];
                res.send({
                    'code': 200,
                    'msg': '登录成功',
                    'data': data[0]
                })
            }
        }
        dbConfig.sqlConnect(sql, sqlArr, callBack);
    }
}

//修改资料
editUserInfo = async (req, res) => {
    let { user_id, username, age, sex, job, path, birthday } = req.query;
    let result = await setUserName(user_id, username);
    if (result) {
        let ress = await setUserInfo(user_id, age, sex, job, path, birthday);
        if (ress.length) {
            res.send({
                'code': 200,
                'data': ress[0]
            })
        } else {
            res.send({
                'code': 400,
                'msg': '修改失败'
            })
        }
    } else {
        res.send({
            'code': 400,
            'msg': '修改失败'
        })
    }
}

module.exports = {
    sendCode,
    codePhoneLogin,
    login,
    editUserInfo
}