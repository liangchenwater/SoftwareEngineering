CREATE TABLE Users(
	U_ID char(10) primary key,
	Phone varchar(11) not null,
	Pass varchar(8) not null,		/* password length between 5 and 15 */
	U_Name varchar(15) not null,
	Gender char(1) not null,		/* Male Female and Other */
	Age integer,
	U_Identity char(1) not null,	/* P for Patients D for Doctors */
	U_Profile varchar(30),			/* Path for User Profile */
	CHECK(len(Pass)>=5 AND len(Pass)<=15),
	CHECK(Age>=0),
	CHECK(U_Identity in ('P','D')),
	CHECK(Gender in ('M','F','O')))
/*CREATE TABLE Patients(
	Patient_ID char(10) primary key,
	Phone char(15),
	Pass varchar(8) not null,
	Patient_Name varchar(15) not null,
	Gender char(1) not null,
	Age integer,
	Calender_ID char(10) not null,
	UNIQUE(Calender_ID),
	CHECK(len(Pass)>=5 AND len(Pass)<=15),
	CHECK(Age>=0),
	CHECK(Gender in ('M','F','O')))*/

CREATE TABLE Doctors(
	U_ID char(10) not null,
	Certificate_ID char(27) primary key,	/* Qualification Certificate Number */
	Title varchar(10),	
	Department varchar(20) not null,
	Work_Time varchar(50) not null,
	foreign key(U_ID) references Users
)

CREATE TABLE M_Records(				/* Medical Records */
	MR_ID char(15) primary key,
	Patient_ID char(10) not null,
	Doctor_ID char(10) not null,
	MR_Time smalldatetime not null,		/* %Y-%m-%d %H:%M */
	Condition_Descrip varchar(50) not null,
	Medical_Advice varchar(50) not null,
	Follow_Up_Time smalldatetime,		/* %Y-%m-%d */
	foreign key(Patient_ID) references Users,
	foreign key(Doctor_ID) references Users)

CREATE TABLE Prescriptions(
	MR_ID char(15) not null,
	Pres_ID integer not null,
	Medicine varchar(20) not null,
	Frequency varchar(10) not null,		/* Use Formatted Strings Like 3pD 5pW ect. */
	Dose varchar(10),
	primary key(MR_ID,Pres_ID),			/* One Medical Record May Contain Several Prescriptions */
	foreign key(MR_ID) references M_Records)

CREATE TABLE Appointments(
	Patient_ID char(10) not null,
	Doctor_ID char(10) not null,
	Ap_Time smalldatetime not null,			/* %Y-%m-%d %H:%M */
	Condition_Descip varchar(50) not null,
	Locat varchar(50) not null,
	primary key(Patient_ID,Ap_Time),
	foreign key(Patient_ID) references Users,
	foreign key(Doctor_ID) references Users)

CREATE TABLE Calender_Events(
	U_ID char(10) not null,
	Event_ID char(10) not null,
	Event_Type char(1) not null,		/* Medicine/Appointment/FollowUp */
	Note varchar(20),
	Event_Time smalldatetime not null,		/* %Y-%m-%d %H:%M */
	Notice char(1) not null,			/* Yes or Not */
	primary key(U_ID,Event_ID),
	foreign key(U_ID) references Users,
	CHECK(Event_Type in ('M','F','A')))

