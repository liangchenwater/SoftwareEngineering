from datetime import datetime, timedelta
import json
from flask import request,Flask
from werkzeug.datastructures import is_immutable
import DataBase
from Class import Users,M_Record,Prescription,Appointment,Event,Calender

app = Flask(__name__)
#DB = DataBase.DataBase()


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
    uid=data['uid']
    user = Users(msg=uid,msgid=True)
    identity=data['identity']
    new_name=data['new_name']
    new_gender=data['new_gender']
    new_age=data['new_age']
    if identity=='D':
        new_title=data['new_title']
        new_department=data['new_department']
        new_hospital=data['new_hospital']
    else:
        new_title = new_department = new_hospital = ''
    user.setInfo(
        Phone='',
        Pass='',
        U_Name=new_name,
        U_Identity=identity,
        Gender=new_gender,
        Age=new_age,
        Title=new_title,
        Department=new_department,
        hospital=new_hospital
    )
    user.modInfo()
    return json.dumps({'code':200,},indent=2,ensure_ascii=False)

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
        hospital = request.values['hospital']
    else:
        certificate = title = department = hospital = ''
    
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
        Hospital=hospital
    )
    code,uid = user.signUp()
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

@app.route('/addevent',methods=['POST'])
def AddEvent():
    Calen = Calender()
    data = request.get_json()
    u_id = data['u_id']
    event_type = data['event_type']
    event_time = data['event_time']
    notice = data['notice']
    note = data['note']

    new_event = Event(u_id,event_type,event_time,notice,note)
    event_id = Calen.addEvent(new_event)

    if event_id == -1:
        return json.dumps({'event_id':-1,'msg':"添加失败！"},indent=2,ensure_ascii=False)
    else:
        return json.dumps({'event_id':event_id,'msg':"添加成功！"},indent=2,ensure_ascii=False)

@app.route('/deleteevent',methods=['POST'])
def DeleteEvent():
    Calen = Calender()
    data = request.get_json()
    u_id = data['u_id']
    event_id = data['event_id']
    code = Calen.deleteEvent(u_id,event_id)
    if code == -1:
        return json.dumps({'code':-1,'msg':"删除失败！"},indent=2,ensure_ascii=False)
    else:
        return json.dumps({'code':code,'msg':"删除成功！"},indent=2,ensure_ascii=False)
    
@app.route('/displaycalender',methods=['GET','POST'])
def DisplayCalender():
    Calen = Calender()
    data = request.get_json()
    u_id = data['u_id']
    begin=data['begin']
    end = data['end']
    event_list = Calen.Display(u_id,begin,end)
    for event in event_list:
        notes = event['Note'].split('&')
        event['name'] = notes[0]
        event['info1'] = notes[1]
        event['info2'] = notes[2]
        event['info3'] = notes[3]
        del event['Note']
    return json.dumps(event_list,indent=2,ensure_ascii=False).encode('latin1').decode('gbk')

    
@app.route('/searchdocs',methods=['POST'])
def SearchDocs():
    data = request.get_json()
    phone = data['phone']
    name = data['name']
    hospital = data['hospital']
    department = data['department']
    user = Users()
    user.setInfo(
        Phone=phone,
        U_Name=name,
        Hospital=hospital,
        Department=department
    )
    row = user.searchDocs()
    return json.dumps(row,indent=2,ensure_ascii=False).encode('latin1').decode('gbk')

@app.route('/addcontact',methods=['POST'])
def AddContact():
    data = request.get_json()
    uid = data['uid']
    contact_id = data['contact_id']
    user = Users(msg=uid,msgid=True)
    code = user.addContact(contact_id)
    return json.dumps({'code':code},indent=2,ensure_ascii=False)

@app.route('/getcontacts',methods=['GET'])
def GetContacts():
    uid = request.values['uid']
    user = Users(msg=uid,msgid=True)
    return json.dumps(user.getContacts(),indent=2,ensure_ascii=False)
    
if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0')