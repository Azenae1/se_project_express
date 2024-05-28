const router = require("express").Router();
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");
const { createUser, login } = require("../controllers/users");
const {
  loginValidation,
  createUserValidation,
} = require("../middlewares/validation");
const NotFoundErr = require("../utils/err_notFound");

router.post("/signup", createUserValidation, createUser);
router.post("/signin", loginValidation, login);

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

// Middleware for handling unknown routes

router.use((req, res, next) => {
  next(new NotFoundErr("Not found"));
});

module.exports = router;

// Server launch:
// GitBash "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --dbpath="c:\data\db"
// PowerShell C:\"Program Files"\MongoDB\Server\5.0\bin\mongo.exe
