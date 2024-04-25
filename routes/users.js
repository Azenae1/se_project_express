const router = require("express").Router();
const { authorization } = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");

router.use(authorization);

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
