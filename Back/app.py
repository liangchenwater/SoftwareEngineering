from datetime import datetime
import json
from flask import request,Flask
import DataBase

app = Flask(__name__)
DB = DataBase.DataBase()

'''
@app.route('/')
def test():
    return 'Hello,world'
'''

@app.route('/login',methods=['GET','POST'])
def Login():
    phone = request.values['phone']
    password = request.values['password']
    #code,data = DB.Login('123456789','123456')
    code,data = DB.Login(phone,password)
    if code == 0:
        return json.dumps({'valid': code, 'U_ID': data['U_ID']}, indent=2, ensure_ascii=False)
    else:
        return json.dumps({'valid': code, 'U_ID': 'None'}, indent=2, ensure_ascii=False)


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
        age = request.values['age']
     
    if identity=='D':
        certificate = request.values['certificate']
        title = request.values['title']
        department = request.values['department']
        worktime = request.values['worktime']
    else:
        certificate = title = department = worktime = ''
    
    code,uid = DB.AddUser(phone,password,name,identity,gender,age,certificate,title,department,worktime)
    return json.dumps({'state':code,'U_ID':uid},indent=2,ensure_ascii=False)
    
@app.route('/addrecord',methods=['POST'])
def AddRecord():
    patient_id = request.values['patient_id']
    doctor_id = request.values['doctor_id']
    mr_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    advice = request.values['advice']
    description = request.values['description']
    fu_time = request.values['fu_time']

    mr_id = DB.AddRecord(patient_id,doctor_id,mr_time,description,advice,fu_time)

    pres_num = int(request.values['pres_num'])

    for i in range(pres_num):
        medicine = request.values['medicine'+str(i)]
        frequency = request.values['frequency'+str(i)]
        dose = request.values['dose'+str(i)]
        notes = request.values['notes'+str(i)]
        DB.AddPrescription(mr_id,medicine,frequency,dose,notes)

if __name__ == '__main__':
    app.run(debug=True)