const router = require("express").Router();
const { authorization } = require("../middlewares/auth");
const {
  createItem,
  getItems,
  likeItem,
  dislikeItem,
  deleteItem,
} = require("../controllers/clothingItems");
const {
  createItemValidation,
  idValidation,
} = require("../middlewares/validation");

router.get("/", getItems);

router.use(authorization);

router.post("/", createItemValidation, createItem);
router.put("/:itemId/likes", idValidation, likeItem);
router.delete("/:itemId/likes", idValidation, dislikeItem);
router.delete("/:itemId", idValidation, deleteItem);

module.exports = router;
