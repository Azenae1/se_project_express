const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT_ERROR,
  AUTH_ERROR,
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
    res.status(BAD_REQUEST).send({ message: "Email or password incorrect" });
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
        return User.create({ name, avatar, email, password: hash }).then(
          (newUser) => {
            const payload = newUser.toObject();
            delete payload.password;
            res.status(201).send({ data: payload });
          },
        );
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

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

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(BAD_REQUEST).send({ message: "Invalid data" });
    return;
  }
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Email or password incorrect") {
        return res
          .status(AUTH_ERROR)
          .send({ message: "Email or password incorrect" });
      }

      if (err.name === "DocumentNotFoundError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// const getUser = (req, res) => {
//   const { userId } = req.params;
//   User.findById(userId)
//     .orFail()
//     .then((user) => res.status(200).send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(NOT_FOUND).send({ message: "User not found" });
//       }
//       if (err.name === "CastError") {
//         return res.status(BAD_REQUEST).send({ message: "Invalid data" });
//       }
//       return res
//         .status(INTERNAL_SERVER_ERROR)
//         .send({ message: "An error has occurred on the server" });
//     });
// };

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
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

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then(() => {
      res.status(200).send({ name, avatar });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Something went wrong!" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ error: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getCurrentUser, updateUser, login };
