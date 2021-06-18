from datetime import datetime, timedelta
import json
from flask import request,Flask
import DataBase
from Class import Users,M_Record,Prescription,Appointment

app = Flask(__name__)
DB = DataBase.DataBase()


@app.route('/')
def test():
    return 'Hello,world'


@app.route('/login',methods=['GET','POST'])
def Login():
    phone = request.values['phone']
    password = request.values['password']

    user = Users(msg=phone,Password=password,msgid=False)
    code,data = user.logIn()

    #code,data = DB.Login(phone,password)
    if code == 0:
        return json.dumps({'valid': code, 'U_ID': data['U_ID']}, indent=2, ensure_ascii=False)
    else:
        return json.dumps({'valid': code, 'U_ID': 'None'}, indent=2, ensure_ascii=False)

'''
@app.route('/patientinfo',methods=['GET','POST'])
def GetPatientInfo():
    uid = request.values['UID']

    data = DB.GetPatientInformation(uid)

    return json.dumps(data,indent=2,ensure_ascii=False).encode('latin1').decode('gbk')

@app.route('/doctorinfo',methods=['GET','POST'])
def GetDoctorInfo():
    uid = request.values['UID']

    data = DB.GetDoctorInformation(uid)

    return json.dumps(data,indent=2,ensure_ascii=False).encode('latin1').decode('gbk')
'''
@app.route('/modinfo',methods=['POST'])
def ModInfo():
    data = request.get_json()
    phone=data['phone']
    identity=data['identity']
    new_name=data['new_name']
    new_gender=data['new_gender']
    new_age=data['new_age']
    if identity=='D'
        new_title=data['new_title']
        new_department=data['new_department']
        new_work_time=data['new_work_time']
        DB.ModUser(phone,identity,new_name,new_gender,new_age,new_title,new_department,new_work_time)
    else DB.ModUser(phone,identity,new_name,new_gender,new_age)

@app.route('/userinfo',methods=['GET','POST'])
def GetInfo():
    uid = request.values['U_ID']
    identity = request.values['identity']

    user = Users(msg=uid,msgid=True)
    data = user.getInfo(identity=='D')

    return json.dumps(data,indent=2,ensure_ascii=False).encode('latin1').decode('gbk')

@app.route('/signup',methods=['POST'])
def SignUp():
    phone = request.values['phone']
    password = request.values['password']
    name = request.values['name']
    identity = request.values['identity']
    gender = request.values['gender']
    if request.values['age'] == '':
        age = -1
    else:
        age = int(request.values['age'])
     
    if identity=='D':
        certificate = request.values['certificate']
        title = request.values['title']
        department = request.values['department']
        worktime = request.values['worktime']
    else:
        certificate = title = department = worktime = ''
    
    user = Users()

    user.setInfo(
        Phone=phone,
        Pass=password,
        U_Name=name,
        U_Identity=identity,
        Gender=gender,
        Age=age,
        Certificate_ID=certificate,
        Title=title,
        Department=department,
        WorkTime=worktime
    )
    code,uid = user.signUp()
    '''
    code,uid = DB.AddUser(
        Phone=phone,
        Pass=password,
        U_Name=name,
        U_Identity=identity,
        Gender=gender,
        Age=age,
        Certificate=certificate,
        Title=title,
        Department=department,
        Worktime=worktime
    )
    '''
    return json.dumps({'state':code,'U_ID':uid},indent=2,ensure_ascii=False)
'''    
@app.route('/addrecord',methods=['POST'])
def AddRecord():
    patient_id = request.values['patient_id']
    doctor_id = request.values['doctor_id']
    mr_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    advice = request.values['advice']
    description = request.values['description']
    fu_time = request.values['fu_time']

    record = M_Record(
        Patient_ID=patient_id,
        Doctor_ID=doctor_id,
        MR_Time=mr_time,
        Description=description,
        Advice=advice,
        FU_Time=fu_time
    )
    #mr_id = DB.AddRecord(patient_id,doctor_id,mr_time,description,advice,fu_time)

    pres_num = int(request.values['pres_num'])

    for i in range(pres_num):
        medicine = request.values['medicine'+str(i)]
        frequency_d = int(request.values['frequency_d'+str(i)])
        frequency_t = int(request.values['frequency_t'+str(i)])
        endtime = request.values['endtime'+str(i)]
        dose = request.values['dose'+str(i)]
        notes = request.values['notes'+str(i)]
        pres = Prescription(medicine,frequency_d,frequency_t,endtime,dose,notes)
        record.addPres(pres)
        #DB.AddPrescription(mr_id,medicine,frequency,dose,notes)

    record.addRecord()
    return json.dumps({'code':200,'MR_ID':record.MR_ID},indent=2,ensure_ascii=False)
'''
@app.route('/addrecord',methods=['POST'])
def addRecord():
    data = request.get_json()
    patient_id = data['patient_id']
    doctor_id = data['doctor_id']
    mr_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    advice = data['advice']
    description = data['description']
    fu_time = data['fu_time']

    record = M_Record(
        Patient_ID=patient_id,
        Doctor_ID=doctor_id,
        MR_Time=mr_time,
        Description=description,
        Advice=advice,
        FU_Time=fu_time
    )
    #mr_id = DB.AddRecord(patient_id,doctor_id,mr_time,description,advice,fu_time)
    pres_list = data['pres_list']
    for i in range(len(pres_list)):
        medicine = pres_list[i]['medicine']
        frequency_d = int(pres_list[i]['frequency_d'])
        frequency_t = int(pres_list[i]['frequency_t'])
        endtime = pres_list[i]['endtime']
        dose = pres_list[i]['dose']
        notes = pres_list[i]['notes']
        pres = Prescription(medicine,frequency_d,frequency_t,endtime,dose,notes)
        record.addPres(pres)
        #DB.AddPrescription(mr_id,medicine,frequency,dose,notes)

    record.addRecord()
    return json.dumps({'code':200,'MR_ID':record.MR_ID},indent=2,ensure_ascii=False)    

@app.route('/addappointment',methods=['POST'])
def AddAppointment():
    '''
    date:yyyy-mm-dd
    '''
    data = request.get_json()
    patient_id = data['patient_id']
    doctor_id = data['doctor_id']
    date = datetime.strptime(data['date'],"%Y-%m-%d").replace(hour=8,minute=0,second=0)
    time:int = data['time']
    description = data['description']

    if time<=8:
        date += timedelta(minutes=30*time)
    else:
        date += timedelta(hours=6,minutes=30*(time-9))
    
    ap_time = date.strftime("%Y-%m-%d %H:%M:%S")

    appointment = Appointment(patient_id,doctor_id,ap_time,description)

    code = appointment.addAppointment()
    if code == -1:
        return json.dumps({'code':-1,'msg':"人数已满"},indent=2,ensure_ascii=False)
    else:
        return json.dumps({'code':0,'msg':'预约成功'},indent=2,ensure_ascii=False)


if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')