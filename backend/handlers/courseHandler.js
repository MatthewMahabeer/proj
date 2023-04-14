const {
  createCourse,
  getAllCourses,
  getCoursesForUser,
  registerLecturerForCourse,
  registerStudentForCourse,
  getCourseMembers,
  getCalendarEventsForCourse,
  getCalendarEventsForStudent,
  checkCourseAssignment,
} = require("../services/courseService");

const createCourseHandler = async (req, res) => {
  const { courseID, courseName } = req.body;

  //get adminID from req.params
  const adminID = req.params.adminID;

  try {
    const result = await createCourse(courseID, courseName, adminID);

    if (result.error) {
      res.status(400).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
  }
};

const getAllCoursesHandler = async (req, res) => {
  try {
    const result = await getAllCourses();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const getCoursesForUserHandler = async (req, res) => {
  const idNumber = req.params.idNumber;

  try {
    const result = await getCoursesForUser(idNumber);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const checkCourseAssignmentHandler = async (req, res) => {
  const courseID = req.params.courseID;

  try {
    const result = await checkCourseAssignment(courseID);

    if (result.error) {
      res.status(400).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
  }
};

const registerLecturerForCourseHandler = async (req, res) => {
  const { courseID, idNumber } = req.body;

  try {
    const result = await registerLecturerForCourse(idNumber, courseID);

    if (result.error) {
      res.status(400).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
  }
};

const registerStudentForCourseHandler = async (req, res) => {
  const { courseID, idNumber } = req.body;

  try {
    const result = await registerStudentForCourse(idNumber, courseID);

    if (result.error) {
      res.status(400).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
  }
};

const getCourseMembersHandler = async (req, res) => {
  const courseID = req.params.courseID;

  try {
    const result = await getCourseMembers(courseID);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const getCalendarEventsForCourseHandler = async (req, res) => {
  const courseID = req.params.courseID;

  try {
    const result = await getCalendarEventsForCourse(courseID);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

const getCalendarEventsForStudentHandler = async (req, res) => {
  const { idNumber, date } = req.query;

  try {
    const result = await getCalendarEventsForStudent(idNumber, date);

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createCourseHandler,
  getAllCoursesHandler,
  getCoursesForUserHandler,
  registerLecturerForCourseHandler,
  registerStudentForCourseHandler,
  getCourseMembersHandler,
  getCalendarEventsForCourseHandler,
  getCalendarEventsForStudentHandler,
  checkCourseAssignmentHandler,
};
