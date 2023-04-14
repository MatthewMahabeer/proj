CREATE TABLE Admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idNumber VARCHAR(10),
    name VARCHAR(50),
    password VARCHAR(50)
);

CREATE TABLE Lecturer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idNumber VARCHAR(10),
    name VARCHAR(50),
    password VARCHAR(50),
    faculty VARCHAR(50),
    department VARCHAR(50)
);

CREATE TABLE Student (
    id INT PRIMARY KEY AUTO_INCREMENT,
    idNumber VARCHAR(10),
    name VARCHAR(50),
    password VARCHAR(50),
    major VARCHAR(50),
    faculty VARCHAR(50)
);

CREATE TABLE Course (
    id INT PRIMARY KEY AUTO_INCREMENT,
    courseID VARCHAR(10),
    courseName VARCHAR(50)
);

CREATE TABLE Assigned_to (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT,
    course_id INT,
    grade FLOAT,
    FOREIGN KEY (student_id) REFERENCES Student(id),
    FOREIGN KEY (course_id) REFERENCES Course(id)
);

CREATE TABLE Manages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lecturer_id INT,
    course_id INT,
    FOREIGN KEY (lecturer_id) REFERENCES Lecturer(id),
    FOREIGN KEY (course_id) REFERENCES Course(id)
);
