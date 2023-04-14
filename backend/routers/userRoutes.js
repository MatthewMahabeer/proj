const Router = require("express");
const { loginHandler } = require("../handlers/userHandler");

const router = Router();

router.post("/login", loginHandler);

module.exports = router;
