from flask import request,Flask
import DataBase

app = Flask(__name__)
DB = DataBase.DataBase()

'''
@app.route('/')
def test():
    return 'Hello,world'
'''



if __name__ == '__main__':
    app.run(debug=True)