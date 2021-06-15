### 注：github预览markdown貌似不支持html语法，最好用typora等软件打开，可以看到标红的字段

## 登录模块

| 接口地址 | Method   | 需要提供的字段                                               | 返回                                                         | 完成   |
| -------- | -------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------ |
| /login   | GET/POST | varchar(11) phone <br />varchar(8) password                  | "valid": 0表示登陆成功，-1表示登陆失败，未查询到用户<br />“U_ID": char(10)，如果登陆成功则返回用户UID，如果登陆失败则返回”None“ | Y      |
| /signup  | POST     | phone<br />password<br />name<br />identity<br />gender<br />age<br />(certificate)<br />(title)<br />(department)<br />(worktime) | "state"：-1表示用户已经存在，0表示注册新用户成功<br />"U_ID"：已存在的用户ID或者新的用户ID | 未测试 |
|          |          |                                                              |                                                              |        |

<span style='color:red'>有个疑问：如果我们登陆的时候分患者和医生的话那医生自己如果有就医要求怎么办？是否需要两个账号？</span>

## 用户信息模块

| 接口地址     | Method   | 需要提供的字段 | 返回                                                         | 完成 |
| ------------ | -------- | -------------- | ------------------------------------------------------------ | ---- |
| /patientinfo | GET/POST | char(10) UID   | U_Name：用户名<br />Gender：性别（M，F，O）<br />Age：年龄<br />Phone：电话 | Y    |
| /doctorinfo  | GET/POST | char(10) UID   | U_Name<br />Gender<br />Age<br />Phone<br />Title<br />Work_Time: <span style='color:red'>这里最好后边改成统一格式化字符串</span> | Y    |
| /modinfo     | POST     |                |                                                              |      |
|              |          |                |                                                              |      |

## 就诊模块

| 接口地址   | Method | 需要提供的字段                                               | 返回 | 完成   |
| ---------- | ------ | ------------------------------------------------------------ | ---- | ------ |
| /addrecord | POST   | patient_id<br />doctor_id<br />advice<br />description<br />fu_time:<span style='color:red'>yyyy-mm-dd HH:MM:SS<br />pres_num: number of prescriptions<br />medicine0,medicine1,...<br />frequency0,frequency1,...<br />dose0,dose1,...<br />notes0,notes1,... | --   | 未测试 |
|            |        |                                                              |      |        |
|            |        |                                                              |      |        |
|            |        |                                                              |      |        |
