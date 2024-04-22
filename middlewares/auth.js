const jwt = require("jsonwebtoken");
require("dotenv").config();
const { JWT_SECRET } = require("../utils/config");
const { AUTH_ERROR } = require("../utils/errors");

const authorization = (req, res, next) => {
  const { auth } = req.headers;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(AUTH_ERROR).send({ message: "The session is expired" });
  }
  const token = auth.replace("Bearer ", "");
  return jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(AUTH_ERROR).json({ message: "Authorization required" });
    }
    req.user = payload;

    return next();
  });
};

module.exports = { authorization };
