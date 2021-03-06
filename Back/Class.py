from flask.globals import session
import DataBase
from typing import List,Tuple,Dict
from datetime import datetime, timedelta

class Users:
    def __init__(self,msg='',Password='',msgid=False):
        if msgid==False:    #msg is phone
            self.Phone = msg
            self.Password = Password
        else:
            self.U_ID = msg
    
    def setInfo(
        self,
        Phone='',
        Pass='',
        U_Name='',
        U_Identity='P',
        Gender='O',
        Age=-1,
        U_Profile='',
        Certificate_ID='',
        Title='',
        Department='',
        Hospital=''
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
        self.Hospital = Hospital
    
    def logIn(self)->Tuple[int,Dict]:
        DB = DataBase.DataBase()
        code,data = DB.Login(self.Phone,self.Password)
        DB.close()
        return code,data
    
    def getInfo(self,doctor=False)->Dict:
        DB = DataBase.DataBase()
        if doctor==False:
            data = DB.GetPatientInformation(self.U_ID)
        else:
            data = DB.GetDoctorInformation(self.U_ID)
        DB.close()
        return data
    
    def signUp(self)->Tuple[int,str]:
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
            Hospital=self.Hospital
        )
        DB.close()
        return code,uid
    
    def modInfo(self):
        DB = DataBase.DataBase()
        DB.ModUser(
            U_ID=self.U_ID,
            U_Identity=self.U_Identity,
            Gender=self.Gender,
            Age=self.Age,
            U_Name=self.U_Name,
            Title=self.Title,
            Department=self.Department,
            Hospital=self.Hospital
        )
        DB.close()
    
    def searchDocs(self)->List:
       DB = DataBase.DataBase()
       row = DB.SearchDoctors(
           Phone=self.Phone,
           Name=self.U_Name,
           Hospital=self.Hospital,
           Department=self.Department
       )
       DB.close()
       return row
    
    def addContact(self,contact_id:str)->int:
        DB = DataBase.DataBase()
        code = DB.AddContact(self.U_ID,contact_id)
        DB.close()
        return code
    def deleteContact(self,contact_id:str)->int:
        DB = DataBase.DataBase()
        code = DB.DeleteContact(self.U_ID,contact_id)
        DB.close()
        return code

    def getContacts(self)->List[str]:
        DB = DataBase.DataBase()
        contacts = DB.GetContacts(self.U_ID)
        DB.close()
        return contacts
    def displayMRList(
        self,
        doctor_id=''
    ):
        DB = DataBase.DataBase()
        mr_list = DB.GetMRList(self.U_ID,doctor_id)
        DB.close()
        return mr_list

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
        Complete='N',
        Note=''
        ):
            self.U_ID = U_ID
            self.Type = Event_Type
            self.Time = Event_Time
            self.Notice = Complete
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
        starttime = datetime.now()+delta
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
            #name
            Notes:str = self.Prescriptions[i].Medicine
            Notes += '&'
            #info1:dose
            Notes += self.Prescriptions[i].Dose
            Notes += '&'
            #info2:frequency
            Notes += str(self.Prescriptions[i].Frequency_D)+'???'+str(self.Prescriptions[i].Frequency_T)+'???'
            Notes += '&'
            #info3:notes
            Notes += self.Prescriptions[i].Notes
            endtime = datetime.strptime(self.Prescriptions[i].Endtime,"%Y-%m-%d")
            for day in range((endtime.date()-starttime.date()).days+1):
                if day % self.Prescriptions[i].Frequency_D == 0:
                    Event_Time = (starttime+timedelta(days=day)).strftime("%Y-%m-%d %H:%M:%S")
                    DB.AddEvent(
                        U_ID=self.Patient_ID,
                        Event_Type='M',
                        Event_Time=Event_Time,
                        Note=Notes
                    )
        Notes = '&'
        #info1:doctorname
        Notes += DB.GetDoctorInformation(self.Doctor_ID)['U_Name'].encode('latin1').decode('gbk')
        Notes += '&'
        #info2:patientname
        Notes += DB.GetPatientInformation(self.Patient_ID)['U_Name'].encode('latin1').decode('gbk')
        Notes += '&'
        #info3:appointnote
        Notes += self.Description
        if self.FU_Time != '':
            DB.AddEvent(
                U_ID=self.Patient_ID,
                Event_Type='F',
                Event_Time=self.FU_Time,
                Note=Notes
            )
        DB.close()

    def addPres(self,pres:Prescription):
        self.Prescriptions.append(pres)


    




class Appointment:
    def __init__(
        self,
        Patient_id,
        Doctor_id,
        Ap_Time,
        Description,
        Type,
        Location=''
    ):
        self.Patient_id = Patient_id
        self.Doctor_id = Doctor_id
        self.Ap_Time = Ap_Time
        self.Description = Description
        self.Location = Location
        self.Type = Type

    def addAppointment(self)->int:
        DB = DataBase.DataBase()
        code = DB.AddApointment(
            Patient_ID=self.Patient_id,
            Doctor_ID=self.Doctor_id,
            Ap_Time=self.Ap_Time,
            Description=self.Description,
            Location=self.Location
        )
        Notes = self.Description
        Notes += '&'
        #info1:doctorid
        Notes += self.Doctor_id
        Notes += '&'
        #info2:patientid
        Notes += self.Patient_id
        Notes += '&'
        DB.AddEvent(
            U_ID=self.Patient_id,
            Event_Type=self.Type,
            Event_Time=self.Ap_Time,
            Note=Notes
        )
        #print('here')
        DB.AddEvent(
            U_ID=self.Doctor_id,
            Event_Type=self.Type,
            Event_Time=self.Ap_Time,
            Note=Notes
        )
        #print('here2')
        DB.close()
        return code

class Calender:

        #eventList with time stamp
    def addEvent(self,
        event:Event):
        DB = DataBase.DataBase()
        event_id = DB.AddEvent(event.U_ID,event.Type,event.Time,event.Notice,event.Note)
        DB.close()
        return event_id
    
    def deleteEvent(
        self,
        u_id,
        event_id
    ):
        DB = DataBase.DataBase()
        code = DB.DeleteEvent(u_id,event_id)
        DB.close()
        return code
    
    def Display(
        self,
        u_id,
        begin,
        end
    ):
        DB = DataBase.DataBase()
        event_list = DB.GetCalender(u_id,begin,end)
        DB.close()
        return event_list
