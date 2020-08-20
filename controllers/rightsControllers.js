var dbConfig = require('../util/dbconfig')
getRights = (req, res) => {
    var sql = `select * from menu`;
    var sqlArr = [];
    var callBack = (err, data) => {
        if (err) {
            res.send({
                'code': 400,
                'msg': '获取权限列表失败',
            })
        } else {
            res.send({
                'code': 200,
                'msg': '获取权限列表成功',
                'data': data
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}

module.exports = {
    getRights,
}