const db = require("../db/pool");

async function createCourse(courseID, courseName, adminID) {
  try {
    const [admin] = await db.execute("SELECT * FROM Admin WHERE idNumber = ?", [
      adminID,
    ]);

    if (admin.length === 0) {
      return { error: "Admin not found" };
    }
    const [result] = await db.execute(
      "INSERT INTO Course (courseID, courseName) VALUES (?, ?)",
      [courseID, courseName]
    );

    const affectedRows = result.affectedRows;

    if (affectedRows === 0) {
      return { error: "Course not created" };
    }

    const [rows] = await db.execute("SELECT * FROM Course WHERE courseID = ?", [
      courseID,
    ]);

    return rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getAllCourses() {
  try {
    // retrieve all courses from the Course table
    const [rows] = await db.query("SELECT * FROM Course");

    // return an array of course objects
    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getCoursesForUser(idNumber) {
  try {
    let userRole;
    let userId;

    // if not found, search the Lecturer table for a matching idNumber
    [rows, fields] = await db.query(
      "SELECT id, name FROM Lecturer WHERE idNumber = ?",
      [idNumber]
    );
    if (rows.length > 0) {
      userRole = "lecturer";
      userId = rows[0].id;
    }

    // if not found, search the Student table for a matching idNumber
    if (!userId) {
      [rows, fields] = await db.query(
        "SELECT id, name FROM Student WHERE idNumber = ?",
        [idNumber]
      );
      if (rows.length > 0) {
        userRole = "student";
        userId = rows[0].id;
      }
    }

    // if user not found, throw an error
    if (!userId) {
      return { error: "User not found" };
    }

    // retrieve all courses for the user based on their role
    let courseRows;
    if (userRole === "lecturer") {
      [courseRows] = await db.query(
        "SELECT Course.* FROM Course JOIN Manages ON Course.id = Manages.course_id WHERE Manages.lecturer_id = ?",
        [userId]
      );
    } else if (userRole === "student") {
      [courseRows] = await db.query(
        "SELECT Course.* FROM Course JOIN Assigned_to ON Course.id = Assigned_to.course_id WHERE Assigned_to.student_id = ?",
        [userId]
      );
    }

    return courseRows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function registerStudentForCourse(idNumber, courseCode) {
  try {
    // find the student's ID based on the idNumber parameter
    const [students] = await db.query(
      "SELECT id FROM Student WHERE idNumber = ?",
      [idNumber]
    );
    if (students.length === 0) {
      return { error: "Student not found" };
    }
    const studentID = students[0].id;

    // find the course's ID based on the courseCode parameter
    const [courseRows] = await db.query(
      "SELECT id FROM Course WHERE courseID = ?",
      [courseCode]
    );
    if (courseRows.length === 0) {
      return { error: "Course not found" };
    }
    const courseID = courseRows[0].id;

    // check if the student is already registered for the course
    const [studentRows] = await db.query(
      "SELECT * FROM Assigned_to WHERE student_id = ? AND course_id = ?",
      [studentID, courseID]
    );
    if (studentRows.length > 0) {
      return { error: "Student already registered for the course" };
    }

    // check if the student is already registered for the maximum number of courses
    const [enrollmentRows] = await db.query(
      "SELECT COUNT(*) as num_enrollments FROM Assigned_to WHERE student_id = ?",
      [studentID]
    );
    const numEnrollments = enrollmentRows[0].num_enrollments;
    if (numEnrollments >= 6) {
      return {
        error: "Student already registered for the maximum number of courses",
      };
    }

    // register the student for the course
    const [result] = await db.execute(
      "INSERT INTO Assigned_to (student_id, course_id) VALUES (?, ?)",
      [studentID, courseID]
    );

    if (result.affectedRows > 0) {
      const [courseRows] = await db.query(
        "SELECT Course.* FROM Course JOIN Assigned_to ON Course.id = Assigned_to.course_id WHERE Assigned_to.student_id = ?",
        [studentID]
      );

      return courseRows;
    }

    return { error: "Student not registered for the course" };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function checkCourseAssignment(courseID) {
  try {
    const [assignmentRows] = await db.query(
      "SELECT lecturer_id FROM Manages WHERE course_id = ?",
      [courseID]
    );

    if (assignmentRows.length === 0) {
      return { assigned: false };
    }

    const lecturerID = assignmentRows[0].lecturer_id;

    const [lecturerRows] = await db.query(
      "SELECT name FROM Lecturer WHERE id = ?",
      [lecturerID]
    );

    const lecturerName = lecturerRows[0].name;

    return { assigned: true, lecturer_name: lecturerName };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function registerLecturerForCourse(idNumber, courseCode) {
  try {
    // find the lecturer's ID based on the idNumber parameter
    const [lecturerRows] = await db.query(
      "SELECT id FROM Lecturer WHERE idNumber = ?",
      [idNumber]
    );
    if (lecturerRows.length === 0) {
      return { error: "Lecturer not found" }; // lecturer not found
    }
    const lecturerID = lecturerRows[0].id;

    const [courseRows] = await db.query(
      "SELECT id FROM Course WHERE courseID = ?",
      [courseCode]
    );
    if (courseRows.length === 0) {
      return { error: "Course not found" }; // course not found
    }
    const courseID = courseRows[0].id;

    // check if the course ID exists in the Manages table
    const [rows] = await db.query("SELECT * FROM Manages WHERE course_id = ?", [
      courseID,
    ]);
    if (rows.length > 0) {
      // check if the same lecturer is already assigned to the course
      const existingLecturerID = rows[0].lecturer_id;
      if (existingLecturerID === lecturerID) {
        return { message: "This lecturer is already assigned to this course." }; // lecturer is already assigned to the course
      }
      await db.query("DELETE FROM Manages WHERE course_id = ?", [courseID]);
    }

    const [result] = await db.execute(
      "INSERT INTO Manages (lecturer_id, course_id) VALUES (?, ?)",
      [lecturerID, courseID]
    );

    if (result.affectedRows > 0) {
      return { message: "Lecturer successfully assigned to the course." };
    }

    return { error: "Lecturer not assigned to the course" };
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getCourseMembers(courseCode) {
  try {
    // retrieve the course details
    const [courseRows] = await db.query(
      "SELECT id FROM Course WHERE courseID = ?",
      [courseCode]
    );

    const courseID = courseRows[0].id;
    // retrieve the lecturer details
    const [lecturerRows] = await db.query(
      "SELECT Lecturer.* FROM Lecturer JOIN Manages ON Lecturer.id = Manages.lecturer_id WHERE Manages.course_id = ?",
      [courseID]
    );

    const lecturer = lecturerRows[0];

    // retrieve the student details
    const [studentRows] = await db.query(
      "SELECT Student.* FROM Student JOIN Assigned_to ON Student.id = Assigned_to.student_id WHERE Assigned_to.course_id = ?",
      [courseID]
    );
    const students = studentRows;

    // format the return object
    const courseMembers = {
      lecturer,
      students,
    };

    return courseMembers;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getCalendarEventsForCourse(id) {
  try {
    // find the id of the course based on the courseID parameter
    const [courseRows] = await db.query(
      "SELECT id FROM Course WHERE courseID = ?",
      [id]
    );

    if (courseRows.length === 0) {
      return { error: "Course not found" };
    }

    const courseID = courseRows[0].id;

    // query the Calendar table for events matching the course ID
    const [eventRows] = await db.query(
      "SELECT * FROM Calendar WHERE courseID = ?",
      [courseID]
    );

    return eventRows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

const convertDateStringToMySQLDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  const sqlDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return sqlDate;
};

async function getCalendarEventsForStudent(studentID, date) {
  try {
    const [student] = await db.query(
      "SELECT * FROM Student WHERE idNumber = ?",
      [studentID]
    );

    const student_id = student[0].id;

    const sqlDate = convertDateStringToMySQLDate(date);

    const [rows] = await db.query(
      "SELECT Calendar.*, Course.courseID, Course.courseName, Assigned_to.grade FROM Calendar JOIN Assigned_to ON Calendar.courseID = Assigned_to.course_id JOIN Course ON Calendar.courseID = Course.id WHERE Assigned_to.student_id = ? AND DATE(StartDate) = ?",
      [student_id, sqlDate]
    );

    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function createDiscussionForum(courseId, forumName) {
  try {
    const [result] = await db.execute(
      "INSERT INTO DiscussionForum (course_id, forum_name) VALUES (?, ?)",
      [courseId, forumName]
    );

    return result.insertId;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getDiscussionForumsForCourse(courseCode) {
  try {
    const [courseRows] = await db.query(
      "SELECT id FROM Course WHERE courseID = ?",
      [courseCode]
    );
    if (courseRows.length === 0) {
      return { error: "Course not found" }; // course not found
    }
    const courseId = courseRows[0].id;

    const [rows] = await db.query(
      "SELECT * FROM DiscussionForum WHERE course_id = ?",
      [courseId]
    );

    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function createDiscussionThread(
  forumId,
  title,
  post,
  parentThreadId = null
) {
  try {
    const [result] = await db.execute(
      "INSERT INTO DiscussionThread (forum_id, thread_title, thread_post, parent_thread_id) VALUES (?, ?, ?, ?)",
      [forumId, title, post, parentThreadId]
    );

    return result.insertId;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function getDiscussionThreadsForForum(forumId) {
  try {
    const [rows] = await db.query(
      "SELECT * FROM DiscussionThread WHERE forum_id = ?",
      [forumId]
    );

    return rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  createCourse,
  getAllCourses,
  getCoursesForUser,
  registerStudentForCourse,
  registerLecturerForCourse,
  getCourseMembers,
  getCalendarEventsForCourse,
  getCalendarEventsForStudent,
  createDiscussionForum,
  getDiscussionForumsForCourse,
  createDiscussionThread,
  getDiscussionThreadsForForum,
  checkCourseAssignment,
};
