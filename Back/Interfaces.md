### 注：github预览markdown貌似不支持html语法，最好用typora等软件打开，可以看到标红的字段

## 登录模块

| 接口地址 | Method   | 需要提供的字段                                               | 返回                                                         | 完成 |
| -------- | -------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| /login   | GET/POST | phone<br />password                                          | "valid": 0表示登陆成功，-1表示登陆失败，未查询到用户<br />“U_ID": char(10)，如果登陆成功则返回用户UID，如果登陆失败则返回”None“ | Y    |
| /signup  | POST     | phone<br />password<br />name<br />identity<br />gender<br />(age):可以为空，但是必须提供空串或者-1<br />(certificate)<br />(title)<br />(department)<br />(hospital) | "state"：-1表示用户已经存在，0表示注册新用户成功<br />"U_ID"：已存在的用户ID或者新的用户ID | Y    |
|          |          |                                                              |                                                              |      |

<span style='color:red'>有个疑问：如果我们登陆的时候分患者和医生的话那医生自己如果有就医要求怎么办？是否需要两个账号？</span>

## 用户信息模块

| 接口地址         | Method   | 需要提供的字段                                               | 返回                                                         | 完成                                |
| ---------------- | -------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ----------------------------------- |
| /patientinfo     | GET/POST | char(10) UID                                                 | U_Name：用户名<br />Gender：性别（M，F，O）<br />Age：年龄<br />Phone：电话 | <span style='color:red'>废弃</span> |
| /doctorinfo      | GET/POST | char(10) UID                                                 | U_Name<br />Gender<br />Age<br />Phone<br />Title<br />Hospital | <span style='color:red'>废弃</span> |
| /modinfo         | POST     | uid: str<br />identity: str<br />new_name: str<br />new_gender: str<br />new_age: int<br />new_title: str<br />new_department: str<br />new_hospital: str<br /> |                                                              | Y                                   |
| /userinfo        | POST     | U_ID<br />identity: 'P' or 'D'                               | U_Name<br />Gender<br />Age<br />Phone<br />(Title)<br />(Hospital)<br />(Department) | Y                                   |
| /addevent        | POST     | u_id:str<br/>event_type:'F','M','A'<br/>event_time:str<br/>notice:'Y' or 'N'<br/>note:str | event_id:str<br/>                                            | Y                                   |
| /deleteevent     | POST     | u_id:str<br/>event_id:str                                    | code:-1 or other                                             | Y                                   |
| /displaycalender | GET/POST | u_id:str<br/>begin:str<br/>end:str<br/>                      | 返回一个event列表，每个event包含Event_ID<br />Event_Type<br />Event_Time<br />Complete<br />name<br />info1<br />info2<br />info3 | Y                                   |
| /displaymrlist   | GET/POST | patient_id:str<br/>doctor_id:str（可以为空）<br/>            | 返回一个MR的列表，每个MR包括Patient_ID<br/>Doctor_ID<br/>MR_Time:datetime<br/>Condition_Descrip:str<br/>Medical_Advice:str<br/>Follow_Up_Time:datetime<br/>Prescription的List<br/>每一个Prescriptions<br/>Medicine:str<br/>Frequency:str<br/>Dose:str<br/>Notes:str<br/> | 未测试                              |

## 就诊模块

| 接口地址        | Method | 需要提供的字段                                               | 返回                                              | 完成 |
| --------------- | ------ | ------------------------------------------------------------ | ------------------------------------------------- | ---- |
| /addrecord      | POST   | patient_id<br />doctor_id<br />advice<br />description<br />(fu_time):<span style='color:red'>yyyy-mm-dd HH:MM:SS</span><br />pres_num: number of prescriptions<br />medicine0,medicine1,...<br />frequency_d0,frequency_d1,...<br />frequency_t0,frequency_t1,...<br />endtime0,endtime1:<span style='color:red'>yyyy-mm-dd HH:MM:SS</span><br />dose0,dose1,...<br />notes0,notes1,... | code:200<br />MR_ID                               | Y    |
| /addappointment | POST   | patient_id: str<br />doctor_id: str<br />date: yyyy-mm-dd<br />time: int(从8点到12点（下午从2点开始到6点）time每+1，预约时间段增加半小时)<br />desctription: str | code: -1表示该时间段人数已满<br />msg: 服务器信息 | Y    |
|                 |        |                                                              |                                                   |      |
|                 |        |                                                              |                                                   |      |

## 好友模块

| 接口地址     | Method | 需要提供的字段                                               | 返回                                                         | 完成 |
| ------------ | ------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ---- |
| /searchdocs  | POST   | phone: 可以为空串,<br />name: 可以为空串<br />hospital: 可以为空串<br />department: 可以为空串 | 医生列表，包含医生的U_ID, Phone, U_Name, Title, Department, Hospital | Y    |
| /addcontact  | POST   | uid<br />contact_id                                          | code: 0表示添加成功                                          | Y    |
| /getcontacts | GET    | uid                                                          | 联系人UID的列表                                              | Y    |
|              |        |                                                              |                                                              |      |
