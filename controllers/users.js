const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    res.status(BAD_REQUEST).send({ message: "An error occurred" });
    return;
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(CONFLICT_ERROR).send({
          message: "This email is already registered",
        });
      }

      return bcrypt.hash(password, 10).then((hash) => {
        User.create({ name, avatar, email, password: hash })

          .then((newUser) => {
            const payload = newUser.toObject();
            delete payload.password;
            res.status(201).send({ data: payload });
          });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid ID" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });

  // User.create({ name, avatar })
  //   .then((user) => res.status(201).send(user))

  //   .catch((err) => {
  //     console.error(err);
  //     if (err.name === "ValidationError") {
  //       return res.status(BAD_REQUEST).send({ message: "Invalid data" });
  //     }
  //     return res
  //       .status(INTERNAL_SERVER_ERROR)
  //       .send({ message: "An error has occurred on the server" });
  //   });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getUser };
