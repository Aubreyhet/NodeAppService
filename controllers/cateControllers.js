var dbConfig = require('../util/dbconfig')
//获取分类
loginGetCode = (req, res) => {
    var sql = 'select * from cate';
    var sqlArr = [];
    var callBack = (err, data) => {
        if (err) {
            console.log('连接出错了！')
        } else {
            res.send({
                'list': data
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
    // res.render('index', { title: 'Express' });
}


//获取制定分类的文章列表
getPostCate = (req, res) => {
    let { id } = req.query;
    var sql = `select * from post where cate_id=?`;
    var sqlArr = [id];
    var callBack = (err, data) => {
        if (err) {
            console.log('连接出错了！')
        } else {
            res.send({
                'list': data
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}


// 获取菜单列表接口
getMenu = (req, res) => {
    var sql = 'select * from menu';
    var sqlArr = [];
    var callBack = (err, data) => {
        if (err) {
            console.log('连接出错了！')
        } else {
            res.send({
                'data': setTreeData(data)
            })
        }
    }
    dbConfig.sqlConnect(sql, sqlArr, callBack);
}

// toTreeData = (data, pid) => {
//     tree = (id) => {
//         let arr = []
//         data.filter(item => {
//             return item.parent_id === id;
//         }).forEach(item => {
//             arr.push({
//                 menuid: item.menu_id,
//                 label: item.menu_name,
//                 path: item.menu_url,
//                 children: tree(item.menu_id)
//             })
//         });
//         return arr
//     }
//     return tree(pid)
// }


// function findItemChild(item) {
//     var arrayList = [];
//     for (var i in item) {
//         if (item.parent_id == item.menu_id) {
//             arrayList.push(item);
//         }
//     }
//     return arrayList;
// }
// //get all child
// function getAllChild(array) {
//     var childList = findItemChild(array[0]);
//     if (childList == null) {
//         return [];
//     }
//     else {
//         for (var j in childList) {
//             childList[j].sub = [];
//             childList[j].sub = getAllChild([childList[j]]);
//         }
//         array[0].sub = childList;
//     }
//     return childList;

// }
setTreeData = arr => {
    arr.forEach(item => {
        delete item.children;
    });
    let map = {};
    arr.forEach(i => {
        map[i.menu_id] = i;
    });
    let = treeData = [];
    arr.forEach(child => {
        const mapItem = map[child.parent_id];
        if (mapItem) {
            (mapItem.children || (mapItem.children = [])).push(child)
        } else {
            treeData.push(child);
        }
    });
    return treeData;
}

module.exports = {
    loginGetCode,
    getPostCate,
    getMenu
}

