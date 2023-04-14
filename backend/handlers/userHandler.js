const { login } = require("../services/userService");

const loginHandler = async (req, res) => {
  const { idNumber, password } = req.body;

  try {
    const success = await login(idNumber, password);

    res.status(200).json(success);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loginHandler,
};
