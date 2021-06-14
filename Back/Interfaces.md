## 登录模块

| 接口地址 | Method | 需要提供的字段                              | 返回                                                         | 完成 |
| -------- | ------ | ------------------------------------------- | ------------------------------------------------------------ | ---- |
| /login   | GET    | varchar(11) phone <br />varchar(8) password | "valid": 0表示登陆成功，-1表示登陆失败，未查询到用户<br />“U_ID": char(10)，如果登陆成功则返回用户UID，如果登陆失败则返回”None“ | Y    |
| /signup  | POST   |                                             |                                                              |      |
|          |        |                                             |                                                              |      |

<span style='color:red'>有个疑问：如果我们登陆的时候分患者和医生的话那医生自己如果有就医要求怎么办？是否需要两个账号？</span>

## 用户信息模块

| 接口地址     | Method | 需要提供的字段 | 返回                                                         | 完成 |
| ------------ | ------ | -------------- | ------------------------------------------------------------ | ---- |
| /patientinfo | GET    | char(10) UID   | U_Name：用户名<br />Gender：性别（M，F，O）<br />Age：年龄<br />Phone：电话 | Y    |
| /doctorinfo  | GET    | char(10) UID   | U_Name<br />Gender<br />Age<br />Phone<br />Title<br />Work_Time: <span style='color:red'>这里最好后边改成统一格式化字符串</span> | Y    |
| /modinfo     | POST   |                |                                                              |      |
|              |        |                |                                                              |      |

## 就诊模块

