from datetime import time,datetime, timedelta
import pymssql
import time
from typing import List, Tuple,Dict

class DataBase():
    def __init__(self):
        try:
            self.conn = pymssql.connect(
                host='127.0.0.1',
                user='sa',
                password='huyujia123',
                database='HealthBond',
                charset='utf8',
                as_dict=True
            )
            self.cursor = self.conn.cursor()
        except Exception as ex:
            raise ex
    #def __del__(self):
    #    self.conn.close()
    
    def close(self):
        self.conn.close()
        
    def Login(self,phone:str,password:str)->Tuple[int,Dict]:
        sql = 'SELECT U_ID FROM Users WHERE Phone=\'%s\' AND Pass=\'%s\'' % (phone,password)
        self.cursor.execute(sql)
        row = self.cursor.fetchone()
        if row:
            return 0,row
        else:
            return -1,row
    
    def GetCalender(self,uid:str,begin:str,end:str)->List[Dict]:
        '''
        parameter: begin/end: yyyy-mm-dd
        '''
        
        #sql = 'SELECT * FROM Calender_Events WHERE U_ID=\'%s\' AND (Event_Time BETWEEN CONVERT(smalldatetime,\'%s\') AND CONVERT(smalldatetime,\'%s\')) ORDER BY Event_Time' % (uid,begin,end)
        sql = 'SELECT Event_ID,Event_Type,Note,CONVERT(varchar,Event_Time,20) AS Event_Time,Complete FROM Calender_Events WHERE U_ID=\'%s\' AND (Event_Time BETWEEN CONVERT(smalldatetime,\'%s\') AND CONVERT(smalldatetime,\'%s\')) ORDER BY Event_Time' % (uid,begin,end)
        self.cursor.execute(sql)
        row = self.cursor.fetchall()   
        return row
    
    def GetPatientInformation(self,uid:str)->Dict:
        sql = 'SELECT U_Name,Gender,Age,Phone FROM Users WHERE U_ID=\'%s\'' % (uid)
        self.cursor.execute(sql)
        row = self.cursor.fetchone()
        return row
    
    def GetDoctorInformation(self,uid)->Dict:
        sql = 'SELECT U_Name,Gender,Age,Phone,Title,Department,Hospital FROM Users,Doctors WHERE Users.U_ID=Doctors.U_ID AND Users.U_ID=\'%s\'' % (uid)
        self.cursor.execute(sql)
        row = self.cursor.fetchone()
        return row
        
    def ModUser(
        self,
        #used to specify a user
        U_ID,
        U_Identity,
        #These 3 keys of both patients and doctors can be modified
        U_Name='',
        Gender='',
        Age=-1,
        #Only doctors have these keys
        Title='',
        Department='',
        Hospital=''):
        #sql = "SELECT U_ID FROM Users WHERE Phone=\'%s\'"%(Phone)
        #self.cursor.execute(sql)
        #row=self.cursor.fetchone()
        #account does not exist
        #if row == None:
        #    return -1
        #U_ID = str(row['U_ID'])
        #orig_name=str(row['U_Name'])
        #orig_gender=str(row['Gender'])
        #orig_age=int(row['Age'])
        #if U_Name=='':
        #    U_Name=orig_name
        #if Gender=='':
        #    Gender=orig_gender
        #if Age==-1:
        #    Age=orig_age
        sql = "UPDATE Users SET U_Name=\'%s\', Gender=\'%s\', Age=\'%s\' WHERE U_ID=\'%s\'"%(U_Name,Gender,Age,U_ID)
        try:
            self.cursor.execute(sql)
            if U_Identity=='D':
                sql = "UPDATE Doctors SET Title=\'%s\', Department=\'%s\', Hospital=\'%s\' WHERE U_ID=\'%s\'"%(Title,Department,Hospital,U_ID)
                self.cursor.execute(sql)
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            raise e
        return U_ID

    def AddUser(
        self,
        Phone:str,
        Pass:str,
        U_Name:str,
        U_Identity:str,
        Gender:str='O',
        Age:int=-1,
        U_Profile:str='',
        Certificate_ID:str='',
        Title:str='',
        Department:str='',
        Hospital:str=''
    )->Tuple[int,str]:
        sql = "SELECT U_ID FROM Users WHERE Phone=\'%s\'" % (Phone)
        self.cursor.execute(sql)
        row = self.cursor.fetchone()
        if row:
            return -1,row['U_ID']
        sql = 'SELECT max(U_ID) AS U_ID FROM Users'
        self.cursor.execute(sql)
        row = self.cursor.fetchone()
        if row:
            U_ID = str(int(row['U_ID'])+1)
            U_ID = U_ID.zfill(10)
            #print(U_ID)
            #return
        else:
            U_ID = '0000000001'
        if Age==-1:
            sql = "INSERT INTO Users VALUES(\'%s\',\'%s\',\'%s\',\'%s\',\'%s\',NULL,\'%s\',\'%s\',\'\')" % (U_ID,Phone,Pass,U_Name,Gender,U_Identity,U_Profile)
        else:
            sql = "INSERT INTO Users VALUES(\'%s\',\'%s\',\'%s\',\'%s\',\'%s\',%d,\'%s\',\'%s\',\'\')" % (U_ID,Phone,Pass,U_Name,Gender,Age,U_Identity,U_Profile)
        #print(U_ID)
        #print(sql)
        try:
            self.cursor.execute(sql)
            if U_Identity=='D':
                sql = "INSERT INTO Doctors VALUES(\'%s\',\'%s\',\'%s\',\'%s\',\'%s\')" % (U_ID,Certificate_ID,Title,Department,Hospital)
                self.cursor.execute(sql)
            #else:
                #sql = "INSERT INTO MR_Records VALUES(\'%s\',\'%s\',\'0000000000\',CONVERT(smalldatetime,\'0000-00-00 00:00:00\',20),\'\',\'\',NULL" % (U_ID+'00000',U_ID)
                #self.cursor.execute(sql) 
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            raise e
        
        return 0,U_ID

    def AddApointment(
        self,
        Patient_ID:str,
        Doctor_ID:str,
        Ap_Time:str,
        Description:str,
        Location:str=''
    )->int:
        '''
        Ap_Time format: yyyy-mm-dd hh:mm:ss
        '''
        time_next = ((datetime.strptime(Ap_Time,"%Y-%m-%d %H:%M:%S")+timedelta(minutes=30))).strftime("%Y-%m-%d %H:%M:%S")
        
        sql = "SELECT * FROM Appointments WHERE Doctor_ID=\'%s\' AND (AP_Time BETWEEN CONVERT(smalldatetime,\'%s\',20) AND CONVERT(smalldatetime,\'%s\',20))" % (Doctor_ID,Ap_Time,time_next)
        self.cursor.execute(sql)
        row = self.cursor.fetchall()
        if len(row)>=5:
            return -1
        sql = "INSERT INTO Appointments VALUES(\'%s\',\'%s\',CONVERT(smalldatetime,\'%s\',20),\'%s\',\'%s\')" % (Patient_ID,Doctor_ID,Ap_Time,Description,Location)
        try:
            self.cursor.execute(sql)
            self.conn.commit()
            return 0
        except Exception as ex:
            self.conn.rollback()
            raise ex

    def AddRecord(
        self,
        Patient_ID:str,
        Doctor_ID:str,
        MR_Time:str,
        Description:str,
        Advice:str,
        FU_Time:str=''
    )->str:
        sql = "SELECT max(MR_ID) AS MR_ID FROM M_Records"
        self.cursor.execute(sql)
        row = self.cursor.fetchone()
        if row['MR_ID'] != None:
            MR_ID = str(int(row['MR_ID'])+1)
            MR_ID = MR_ID.zfill(15)
        else:
            MR_ID = '000000000000001'
        if FU_Time=='':
            #print(MR_Time)
            sql = "INSERT INTO M_Records VALUES(\'%s\',\'%s\',\'%s\',CONVERT(smalldatetime,\'%s\',20),\'%s\',\'%s\',NULL)" % (MR_ID,Patient_ID,Doctor_ID,MR_Time,Description,Advice)
            #print(sql)
        else:
            sql = "INSERT INTO M_Records VALUES(\'%s\',\'%s\',\'%s\',CONVERT(smalldatetime,\'%s\',20),\'%s\',\'%s\',CONVERT(smalldatetime,\'%s\',20))" % (MR_ID,Patient_ID,Doctor_ID,MR_Time,Description,Advice,FU_Time)
        try:
            self.cursor.execute(sql)
            self.conn.commit()
            return MR_ID
        except Exception as e:
            self.conn.rollback()
            raise e


    def AddPrescription(
        self,
        MR_ID:str,
        Medicine:str,
        Frequency_D:int,
        Frequency_T:int,
        Dose:str='',
        Notes:str=''
    ):
        sql = "SELECT max(Pres_ID) AS Pres_ID FROM Prescriptions WHERE MR_ID=\'%s\'" % (MR_ID)
        self.cursor.execute(sql)
        row = self.cursor.fetchone()
        if row['Pres_ID']!=None:
            Pres_ID = row['Pres_ID'] + 1
        else:
            Pres_ID = 1
        sql = "INSERT INTO Prescriptions VALUES (\'%s\',%d,\'%s\',%d,%d,\'%s\',\'%s\')" % (MR_ID,Pres_ID,Medicine,Frequency_D,Frequency_T,Dose,Notes)
        self.cursor.execute(sql)
        self.conn.commit()

    def AddEvent(
        self,
        U_ID,
        Event_Type,
        Event_Time,
        Complete='N',
        Note=''
    ):
        '''
        Event_Time format: yyyy-mm-dd hh:mm:ss
        '''
        Event_ID = str(int(time.time()*100000))
        sql = "INSERT INTO Calender_Events VALUES (\'%s\',\'%s\',\'%s\',\'%s\',CONVERT(smalldatetime,\'%s\',20),\'%s\')" % (U_ID,Event_ID,Event_Type,Note,Event_Time,Complete)
        try:
            self.cursor.execute(sql)
            self.conn.commit()
            return Event_ID
        except Exception as ex:
            self.conn.rollback()
            raise ex


    def DeleteEvent(
        self,
        u_id,
        event_id
    ):
        '''
        U_ID,Event_ID to decide the event
        '''
        sql = "DELETE FROM Calender_Events WHERE U_ID = \'%s\' AND Event_ID = \'%s\'" % (u_id,event_id)
        try:
            self.cursor.execute(sql)
            self.conn.commit()
            return 0
        except Exception as ex:
            self.conn.rollback()
            return -1
    
    def SearchDoctors(
        self,
        Phone:str='',
        Name:str='',
        Hospital:str='',
        Department:str=''
    )->List :
        sql = 'SELECT Users.U_ID,Phone,U_Name,Title,Department,Hospital FROM Users,Doctors WHERE Users.U_ID=Doctors.U_ID'
        if Phone != '':
            sql += ' AND Phone=\'%s\''%(Phone)
        if Name != '':
            sql += ' AND U_Name LIKE \'%'+Name+'%\''
        if Hospital != '':
            sql += ' AND Hospital LIKE \'%'+Hospital+'%\''
        if Department != '':
            sql += ' AND Department LIKE \'%'+Department+'%\''
        
        self.cursor.execute(sql)
        row = self.cursor.fetchall()
        if row:
            return row
        return []
        



