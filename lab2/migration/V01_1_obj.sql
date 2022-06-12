create  table "user"(
googleID varchar PRIMARY KEY ,
fullName  varchar, 
linkImg varchar,
email varchar,
dateRegistration bigint
)

create  table list(
"ID" int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
userID varchar,
"name" varchar,
"delete" bool,
FOREIGN KEY(userID)
REFERENCES "user"(googleID)
)

create table pomoState(
"ID" INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
userID varchar,
status bool,
startTime bigint,
totalPomo int,
FOREIGN KEY(userID)
REFERENCES "user"(googleID)
)

create table pomoSettings(
"ID" INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
userID varchar,
pomoDur int,
shortBreakDur int,
longBreakDur int,
longBreakEvery int,
dailyFocusGoal int,
FOREIGN KEY(userID)
REFERENCES "user"(googleID)
)

create table note (
"ID" INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
listID int,
userID varchar,
"name" varchar,
dateCreate bigint,
deadline bigint, 
dateComplation bigint, 
important bool, 
status bool,  
deleteDate bigint,
FOREIGN KEY(userID)
REFERENCES "user"(googleID),
FOREIGN KEY(listID)
REFERENCES "list"("ID")
)