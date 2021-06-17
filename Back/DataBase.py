from datetime import time
import pymssql
import time

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
    def __del__(self):
        self.conn.close()
    
    def close(self):
        self.conn.close()
        
    def Login(self,phone,password):
        sql = 'SELECT U_ID FROM Users WHERE Phone=\'%s\' AND Pass=\'%s\'' % (phone,password)
        self.cursor.execute(sql)
        row = self.cursor.fetchone()
        if row:
            return 0,row
        else:
            return -1,row
    
    def GetCalender(self,uid,begin,end):
        '''
        parameter: begin/end: str 
                        format: yyyy-mm-dd
        '''
        
        sql = 'SELECT * FROM Calender_Events WHERE U_ID=\'%s\' AND (Event_Time BETWEEN CONVERT(smalldatetime,\'%s\',23) AND CONVERT(smalldatetime,\'%s\',23))' % (begin,end)
        self.cursor.execute(sql)
        row = self.cursor.fetchall()
        return row
    
    def GetPatientInformation(self,uid):
        sql = 'SELECT U_Name,Gender,Age,Phone FROM Users WHERE U_ID=\'%s\'' % (uid)
        self.cursor.execute(sql)
        row = self.cursor.fetchone()
        return row
    
    def GetDoctorInformation(self,uid):
        sql = 'SELECT U_Name,Gender,Age,Phone,Title,Department,Work_Time FROM Users,Doctors WHERE Users.U_ID=Doctors.U_ID AND Users.U_ID=\'%s\'' % (uid)
        self.cursor.execute(sql)
        row = self.cursor.fetchone()
        return row
    
    def AddUser(
        self,
        Phone,
        Pass,
        U_Name,
        U_Identity,
        Gender='O',
        Age=-1,
        U_Profile='',
        Certificate_ID='',
        Title='',
        Department='',
        WorkTime=''
    ):
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
            sql = "INSERT INTO Users VALUES(\'%s\',\'%s\',\'%s\',\'%s\',\'%s\',NULL,\'%s\',\'%s\')" % (U_ID,Phone,Pass,U_Name,Gender,U_Identity,U_Profile)
        else:
            sql = "INSERT INTO Users VALUES(\'%s\',\'%s\',\'%s\',\'%s\',\'%s\',%d,\'%s\',\'%s\')" % (U_ID,Phone,Pass,U_Name,Gender,Age,U_Identity,U_Profile)
        #print(U_ID)
        #print(sql)
        self.cursor.execute(sql)
        if U_Identity=='D':
            sql = "INSERT INTO Doctors VALUES(\'%s\',\'%s\',\'%s\',\'%s\',\'%s\')" % (U_ID,Certificate_ID,Title,Department,WorkTime)
            self.cursor.execute(sql)
        #else:
            #sql = "INSERT INTO MR_Records VALUES(\'%s\',\'%s\',\'0000000000\',CONVERT(smalldatetime,\'0000-00-00 00:00:00\',20),\'\',\'\',NULL" % (U_ID+'00000',U_ID)
            #self.cursor.execute(sql) 
        self.conn.commit()
        
        return 0,U_ID

    def AddApointment(
        self,
        Patient_ID,
        Doctor_ID,
        Ap_Time,
        Description,
        Location
    ):
        '''
        Ap_Time format: yyyy-mm-dd hh:mm:ss
        '''
        sql = "INSERT INTO Appointments VALUES(\'%s\',\'%s\',CONVERT(smalldatetime,\'%s\',20),\'%s\',\'%s\'" % (Patient_ID,Doctor_ID,Ap_Time,Description,Location)
        try:
            self.cursor.execute(sql)
            self.conn.commit()
            return 0
        except Exception as ex:
            self.conn.rollback()
            raise ex

    def AddRecord(
        self,
        Patient_ID,
        Doctor_ID,
        MR_Time,
        Description,
        Advice,
        FU_Time=''
    ):
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
            print(sql)
        else:
            sql = "INSERT INTO M_Records VALUES(\'%s\',\'%s\',\'%s\',CONVERT(smalldatetime,\'%s\',20),\'%s\',\'%s\',CONVERT(smalldatetime,\'%s\',20))" % (MR_ID,Patient_ID,Doctor_ID,MR_Time,Description,Advice,FU_Time)
        self.cursor.execute(sql)
        self.conn.commit()
        return MR_ID

    def AddPrescription(
        self,
        MR_ID,
        Medicine,
        Frequency_D,
        Frequency_T,
        Dose='',
        Notes=''
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
        Notice='Y',
        Note=''
    ):
        '''
        Event_Time format: yyyy-mm-dd hh:mm:ss
        '''
        Event_ID = str(int(time.time()))
        sql = "INSERT INTO Calender_Events VALUES (\'%s\',\'%s\',\'%s\',\'%s\',CONVERT(smalldatetime,\'%s\',20),\'%s\')" % (U_ID,Event_ID,Event_Type,Note,Event_Time,Notice)
        self.cursor.execute(sql)
        self.conn.commit()
    


