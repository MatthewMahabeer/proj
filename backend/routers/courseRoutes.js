const Router = require("express");
const {
  createCourseHandler,
  getAllCoursesHandler,
  getCoursesForUserHandler,
  registerLecturerForCourseHandler,
  registerStudentForCourseHandler,
  getCourseMembersHandler,
  getCalendarEventsForCourseHandler,
  getCalendarEventsForStudentHandler,
  checkCourseAssignmentHandler,
} = require("../handlers/courseHandler");

const router = Router();

router.post("/course/:adminID", createCourseHandler);

router.get("/courses", getAllCoursesHandler);

router.get("/courses/:idNumber", getCoursesForUserHandler);

router.post("/c/lecturer", registerLecturerForCourseHandler);

router.get("/c/lecturer/check/:courseID", checkCourseAssignmentHandler);

router.post("/c/student", registerStudentForCourseHandler);

router.get("/c/members/:courseID", getCourseMembersHandler);

router.get("/events/:courseID", getCalendarEventsForCourseHandler);

router.get("/event/student", getCalendarEventsForStudentHandler);

module.exports = router;
