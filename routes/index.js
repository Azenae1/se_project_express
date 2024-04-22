const router = require("express").Router();
const { NOT_FOUND } = require("../utils/errors");
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

// Middleware for handling unknown routes
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Not Found" });
});

module.exports = router;
