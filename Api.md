# 根地址

> http://127.0.0.1/

## 登录获取验证码接口

### 1. 登录获取验证码接口

#### 接口功能

> 根据提交的用户名和密码查询手机号 并向该手机号发送验证码

#### URL

> [users/loginGetCode](http://127.0.0.1/loginGetCode)

#### 支持格式

> JSON

#### HTTP 请求方式

> POST

#### 请求参数

| 参数     | 必选 | 类型   | 说明           |
| :------- | :--- | :----- | -------------- |
| username | ture | string | 登录账户用户名 |
| password | true | string | 登录密码       |

#### 返回字段

| 返回字段 | 字段类型 | 说明                             |
| :------- | :------- | :------------------------------- |
| status   | int      | 返回结果状态。0：正常；1：错误。 |
| company  | string   | 所属公司名                       |
| category | string   | 所属类型                         |

#### 接口示例

> 地址：[http://www.api.com/index.php?name=可口可乐&type=1](http://www.api.com/index.php?name=可口可乐&type=1)

{
"state": 0,
"company": "可口可乐",
"category": "饮料"
}
