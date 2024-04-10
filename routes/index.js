const router = require("express").Router();
// const { ERROR_CODES } = require("../utils/errors");

const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");

router.use("/items", clothingItemRouter);
router.use("/users", userRouter);

module.exports = router;
