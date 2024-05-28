const router = require("express").Router();
const { authorization } = require("../middlewares/auth");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { updateUserValidation } = require("../middlewares/validation");

router.use(authorization);

router.get("/me", getCurrentUser);
router.patch("/me", updateUserValidation, updateUser);

module.exports = router;
