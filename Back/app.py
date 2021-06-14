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

    code,data = DB.Login('123456789','123456')
    #return json.dumps({'valid': code, 'identity': data['U_ID']}, indent=2, ensure_ascii=False)
    #code,data = DB.Login(phone,password)
    if code == 0:
        return json.dumps({'valid': code, 'U_ID': data['U_ID']}, indent=2, ensure_ascii=False)
    else:
        return json.dumps({'valid': code, 'U_ID': 'None'}, indent=2, ensure_ascii=False)


@app.route('/patientinfo',methods=['GET'])
def GetPatientInfo():
    uid = request.args.get('UID')

    data = DB.GetPatientInformation('0000000001')

    return json.dumps(data,indent=2,ensure_ascii=False)

if __name__ == '__main__':
    app.run(debug=True)