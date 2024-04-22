const router = require("express").Router();
const { createUser, login } = require("../controllers/users");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);
router.post("/signup", createUser);
router.post("/signin", login);

module.exports = router;
