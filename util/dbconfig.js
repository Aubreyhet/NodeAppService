const mysql = require('mysql')
var db = mysql.createConnection({
    host: '192.168.1.102',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'nodeappdata'
})
module.exports = {

    //数据库配置
    config: {
        host: '192.168.1.102',
        port: '3306',
        user: 'root',
        password: '123456',
        database: 'nodeappdata'
    },
    //连接数据库，使用mysql连接池方式
    //连接池对象
    sqlConnect: function (sql, sqlArr, callBack) {
        var pool = mysql.createPool(this.config)
        pool.getConnection((err, conn) => {
            console.log('数据库连接成功！')
            if (err) {
                console.log('连接失败！' + err);
                return;
            }
            //事件驱动回调
            conn.query(sql, sqlArr, callBack);
            //释放连接
            conn.release();
        })
    },
    //promise 回调
    SySqlConnect: function (sql, sqlArr) {
        return new Promise((resolve, reject) => {
            var pool = mysql.createPool(this.config)
            pool.getConnection((err, conn) => {
                console.log('数据库连接成功！')
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    //事件驱动回调
                    conn.query(sql, sqlArr, (err, data) => {
                        if (err) {
                            console.log(err)
                            reject(err)
                        } else {
                            resolve(data)
                        }
                    });
                    //释放连接
                    conn.release();
                }
            })
        }).catch((err) => {
            console.log(err)
        })
    },
    db
}