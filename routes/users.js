const router = require("express").Router();
const { authorization } = require("../middlewares/auth");
const { createUser, login, getCurrentUser } = require("../controllers/users");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);
router.post("/signup", createUser);
router.post("/signin", login);

router.use(authorization);

router.get("/me", getCurrentUser);

module.exports = router;
