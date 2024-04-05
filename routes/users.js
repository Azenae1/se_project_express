const router = require("express").Router();
const { getUsers } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", () => {
  console.log("Get users by Id");
});
router.post("/", () => {
  console.log("Post users");
});

module.exports = router;
