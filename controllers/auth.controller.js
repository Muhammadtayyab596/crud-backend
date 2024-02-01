const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const signInToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const cookiesOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
};

const createSendToken = (user, statusCode, res) => {
  const token = signInToken(user._id);
  res.cookie("jwt", token, cookiesOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(422).json({
      message: "Please provide all the required fields",
      statusCode: 422,
      status: "error",
    });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({
        message: "Email already exist",
        statusCode: 422,
        status: "error",
      });
    }

    const user = new User({ name, email, password });
    const userRegister = await user.save();

    if (userRegister) {
      createSendToken(userRegister, 201, res);
    }
  } catch (error) {
    res.status(422).json({ message: error.message });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      message: "Please provide all the required fields",
      statusCode: 422,
      status: "error",
    });
  }

  try {
    const user = await User.findOne({ email: email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(422).json({
        message: "Incorrect email or password",
        statusCode: 422,
        status: "error",
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(422).json({ message: error.message });
  }
};

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      message: "You are not logged in! Please log in to get access.",
      statusCode: 401,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User does not exist",
        statusCode: 401,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token! Please log in again to get access.",
      statusCode: 401,
    });
  }
};
