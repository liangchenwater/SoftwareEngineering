from time import time
import DataBase
from typing import List 
from datetime import date, datetime, timedelta

class Users:
    def __init__(self,msg='',Password='',msgid=False):
        if msgid==False:    #msg is phone
            self.Phone = msg
            self.Password = Password
        else:
            self.U_ID = msg
    
    def setInfo(
        self,
        Phone,
        Pass,
        U_Name,
        U_Identity,
        Gender,
        Age,
        U_Profile='',
        Certificate_ID='',
        Title='',
        Department='',
        WorkTime=''
        ):
        self.Phone = Phone
        self.Password = Pass
        self.U_Name = U_Name
        self.U_Identity = U_Identity
        self.Gender = Gender
        self.Age = Age
        self.U_Profile = U_Profile
        self.Certificate_ID = Certificate_ID
        self.Title = Title
        self.Department = Department
        self.WorkTime = WorkTime
    
    def logIn(self):
        DB = DataBase.DataBase()
        code,data = DB.Login(self.Phone,self.Password)
        DB.close()
        return code,data
    
    def getInfo(self,doctor=False):
        DB = DataBase.DataBase()
        if doctor==False:
            data = DB.GetPatientInformation(self.U_ID)
        else:
            data = DB.GetDoctorInformation(self.U_ID)
        DB.close()
        return data
    
    def signUp(self):
        DB = DataBase.DataBase()
        code,uid = DB.AddUser(
            Phone=self.Phone,
            Pass=self.Password,
            U_Name=self.U_Name,
            U_Identity=self.U_Identity,
            Gender=self.Gender,
            Age=self.Age,
            Certificate_ID=self.Certificate_ID,
            Title=self.Title,
            Department=self.Department,
            WorkTime=self.WorkTime
        )
        DB.close()
        return code,uid
        
class Prescription:
    def __init__(
        self,
        Medicine,
        Frequency_D,
        Frequency_T,
        endtime,
        Dose='',
        Notes=''
    ):
        self.Medicine = Medicine
        self.Frequency_D = Frequency_D
        self.Frequency_T = Frequency_T
        self.Endtime = endtime
        self.Dose = Dose
        self.Notes = Notes
    
class Event:
    def __init__(
        self,
        U_ID,
        Event_Type,
        Event_Time,
        Notice='Y',
        Note=''
        ):
            self.U_ID = U_ID
            self.Type = Event_Type
            self.Time = Event_Time
            self.Notice = Notice
            self.Note = Note

class M_Record:
    def __init__(
        self,
        Patient_ID,
        Doctor_ID,
        MR_Time,
        Description,
        Advice,
        MR_ID='',
        FU_Time='',
    ):
        self.Patient_ID = Patient_ID
        self.Doctor_ID = Doctor_ID
        self.MR_Time = MR_Time
        self.Description = Description
        self.Advice = Advice
        self.MR_ID = MR_ID
        self.FU_Time = FU_Time
        self.Prescriptions:List[Prescription] = []
    
    def addRecord(self):
        DB = DataBase.DataBase()
        self.MR_ID = DB.AddRecord(
            Patient_ID=self.Patient_ID,
            Doctor_ID=self.Doctor_ID,
            MR_Time=self.MR_Time,
            Description=self.Description,
            Advice=self.Advice,
            FU_Time=self.FU_Time
        )
        delta = timedelta(days=1)
        starttime = datetime.now().date()+delta
        starttime = datetime.replace(starttime,hour=8,minute=0,second=0)
        for i in range(len(self.Prescriptions)):
            DB.AddPrescription(
                MR_ID=self.MR_ID,
                Medicine=self.Prescriptions[i].Medicine,
                Frequency_D=self.Prescriptions[i].Frequency_D,
                Frequency_T=self.Prescriptions[i].Frequency_T,
                Dose=self.Prescriptions[i].Dose,
                Notes=self.Prescriptions[i].Notes
            )
            endtime = datetime.strptime(self.Prescriptions[i].Endtime,"%Y-%m-%d")
            for day in range((endtime-starttime).days):


        DB.close()

    def addPres(self,pres:Prescription):
        self.Prescriptions.append(pres)
