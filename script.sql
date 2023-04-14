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

-- insert sample Admin data
INSERT INTO Admin (idNumber, name, password) VALUES
('A001', 'John Doe', 'password1'),
('A002', 'Jane Smith', 'password2'),
('A003', 'Mike Johnson', 'password3');

-- insert sample Lecturer data
INSERT INTO Lecturer (idNumber, name, password, faculty, department) VALUES
('L001', 'Mark Lee', 'password4', 'Engineering', 'Computer Science'),
('L002', 'Samantha Brown', 'password5', 'Arts', 'History'),
('L003', 'David Kim', 'password6', 'Science', 'Chemistry');

-- insert sample Student data
INSERT INTO Student (idNumber, name, password, major, faculty) VALUES
('S001', 'Peter Lee', 'password7', 'Computer Science', 'Engineering'),
('S002', 'Karen Chen', 'password8', 'History', 'Arts'),
('S003', 'Bob Smith', 'password9', 'Chemistry', 'Science');

-- insert sample Course data
INSERT INTO Course (courseID, courseName) VALUES
('C001', 'Introduction to Computer Science'),
('C002', 'World History'),
('C003', 'Organic Chemistry'),
('C004', 'Software Engineering'),
('C005', 'Modern Art'),
('C006', 'Calculus'),
('C007', 'Physics I'),
('C008', 'Data Structures and Algorithms');

-- enroll students in courses
INSERT INTO Assigned_to (student_id, course_id, grade) VALUES
(1, 1, NULL), (1, 4, NULL), (1, 8, NULL), 
(2, 2, NULL), (2, 5, NULL), (2, 6, NULL), 
(3, 3, NULL), (3, 7, NULL), (3, 8, NULL);

-- assign lecturers to courses
INSERT INTO Manages (lecturer_id, course_id) VALUES
(1, 1), (1, 4), (1, 8),
(2, 2), (2, 5), (2, 6),
(3, 3), (3, 7);

CREATE TABLE Calendar (
  calID INT NOT NULL AUTO_INCREMENT,
  courseID INT NOT NULL,
  EventName VARCHAR(255) NOT NULL,
  StartDate DATETIME NOT NULL,
  EndDate DATETIME NOT NULL,
  description VARCHAR(255) NOT NULL,
  PRIMARY KEY (calID),
  FOREIGN KEY (courseID) REFERENCES Course(id) ON DELETE CASCADE ON UPDATE CASCADE
);


INSERT INTO Calendar (courseID, EventName, StartDate, EndDate, description) VALUES
  (1, 'Midterm Exam', '2022-04-15 08:00:00', '2022-04-15 10:00:00', 'Midterm Exam for Course 1'),
  (1, 'Final Exam', '2022-05-20 10:00:00', '2022-05-20 12:00:00', 'Final Exam for Course 1'),
  (2, 'Project Presentation', '2022-04-20 14:00:00', '2022-04-20 16:00:00', 'Course 2 Project Presentation'),
  (2, 'Midterm Exam', '2022-05-05 09:00:00', '2022-05-05 11:00:00', 'Midterm Exam for Course 2'),
  (3, 'Guest Speaker', '2022-04-10 16:00:00', '2022-04-10 17:30:00', 'Guest Speaker for Course 3');
  
CREATE TABLE DiscussionForum (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT,
  forum_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES Course(id)
);

CREATE TABLE DiscussionThread (
  id INT AUTO_INCREMENT PRIMARY KEY,
  forum_id INT,
  thread_title VARCHAR(255),
  thread_post TEXT,
  parent_thread_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (forum_id) REFERENCES DiscussionForum(id),
  FOREIGN KEY (parent_thread_id) REFERENCES DiscussionThread(id)
);

INSERT INTO DiscussionForum (course_id, forum_name) VALUES
  (1, 'Introduction to Computer Science'),
  (2, 'Data Structures and Algorithms');

INSERT INTO DiscussionThread (forum_id, thread_title, thread_post) VALUES
  (1, 'Welcome to CS101', 'Hi everyone, welcome to CS101!'),
  (1, 'Homework Help', 'Can someone help me with question 3 on homework 1?'),
  (2, 'Sorting Algorithms', 'What''s your favorite sorting algorithm?'),
  (2, 'Big O Notation', 'Can someone explain Big O notation to me?'),
  (2, 'Stack vs. Queue', 'When should I use a stack instead of a queue?'),
  (2, 'Recursion', 'Can someone provide an example of a recursive function?');

INSERT INTO DiscussionThread (forum_id, thread_title, thread_post, parent_thread_id) VALUES
  (1, 'Course Schedule', 'Is there a schedule available for this course?', null),
  (1, 'Grades', 'When will grades be posted for the first assignment?', null),
  (1, 'Question 3', 'For question 3 on homework 1, you need to use the formula...', 2),
  (2, 'Quicksort', 'I like Quicksort because it has an average time complexity of...', 3),
  (2, 'Bubble Sort', 'I think Bubble Sort is the easiest to understand because...', 3),
  (2, 'Tail Recursion', 'Tail recursion is when the recursive call is the last...', 6),
  (2, 'Binary Search', 'Binary Search is an algorithm that can search an array...', 6),
  (2, 'Linked List', 'Linked Lists are a data structure that...', 6),
  (2, 'Merge Sort', 'Merge Sort is a divide-and-conquer algorithm that...', 3);


select * from Student;

select * from Course;