const router = require("express").Router();
// const { ERROR_CODES } = require("../utils/errors");

const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

// Middleware for handling unknown routes
router.use((req, res) => {
  res.status(404).send({ message: "Not Found" });
});

module.exports = router;
