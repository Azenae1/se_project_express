const router = require("express").Router();
const { authorization } = require("../middlewares/auth");
const {
  createUser,
  login,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);
router.post("/signup", createUser);
router.post("/signin", login);

router.use(authorization);

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
