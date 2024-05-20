const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const ConflictErr = require("../utils/err_conflict");
const BadRequestErr = require("../utils/err_badRequest");
const NotFoundErr = require("../utils/err_notFound");
const AuthErr = require("../utils/err_auth");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT_ERROR,
  AUTH_ERROR,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestErr("Email or password incorrect"));
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new ConflictErr("This email is already registered"));
      }

      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, avatar, email, password: hash }))
        .then((newUser) => {
          const payload = newUser.toObject();
          delete payload.password;
          res.status(201).send({ data: payload });
        });
    })
    .catch((err) => {
      // console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestErr("Invalid data"));
      } else {
        next(err);
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestErr("Invalid data"));
    return;
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token });
    })
    .catch((err) => {
      // console.error(err);
      if (err.message === "Email or password incorrect") {
        next(new AuthErr("Email or password incorrect"));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      // console.error(err);

      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundErr("User not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestErr("Invalid data"));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((updatedUser) => {
      res.send(updatedUser);
    })
    .catch((err) => {
      // console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestErr("Something went wrong!"));
      } else {
        next(err);
      }
    });
};

module.exports = { createUser, getCurrentUser, updateUser, login };
