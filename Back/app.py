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

@app.route('/login',methods=['GET'])
def Login():
    phone = request.args.get('phone')
    password = request.args.get('password')

    #code,data = DB.Login('123456789','123456')
    code,data = DB.Login(phone,password)
    if code == 0:
        return json.dumps({'valid': code, 'U_ID': data['U_ID']}, indent=2, ensure_ascii=False)
    else:
        return json.dumps({'valid': code, 'U_ID': 'None'}, indent=2, ensure_ascii=False)


@app.route('/patientinfo',methods=['GET'])
def GetPatientInfo():
    uid = request.args.get('UID')

    data = DB.GetPatientInformation(uid)

    return json.dumps(data,indent=2,ensure_ascii=False).encode('latin1').decode('gbk')

@app.route('/doctorinfo',methods=['GET'])
def GetDoctorInfo():
    uid = request.args.get('UID')

    data = DB.GetDoctorInformation(uid)

    return json.dumps(data,indent=2,ensure_ascii=False).encode('latin1').decode('gbk')


@app.route('/signup',methods=['POST'])
def SignUp():
    phone = request.form['phone']
    password = request.form['password']
    name = request.form['name']
    identity = request.form['identity']
    gender = request.form['gender']
    if request.form['age'] == '':
        age = -1
    else:
        age = request.form['age']
     
    if identity=='D':
        certificate = request.form['certificate']
        title = request.form['title']
        department = request.form['department']
        worktime = request.form['worktime']
    else:
        certificate = title = department = worktime = ''
    
    code,uid = DB.AddUser(phone,password,name,identity,gender,age,certificate,title,department,worktime)
    return json.dumps({'state':code,'U_ID':uid},indent=2,ensure_ascii=False)
    
if __name__ == '__main__':
    app.run(debug=True)