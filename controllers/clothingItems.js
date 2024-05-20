const ClothingItem = require("../models/clothingItem");
const BadRequestErr = require("../utils/err_badRequest");
const NotFoundErr = require("../utils/err_notFound");
const ForbiddenErr = require("../utils/err_forbidden");
// const {
//   BAD_REQUEST,
//   NOT_FOUND,
//   INTERNAL_SERVER_ERROR,
//   FORBIDDEN_ERROR,
// } = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      next(err);
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  console.log(req.user._id);
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestErr("Invalid data"));
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((updatedItem) => {
      res.send({ message: "Item disliked", item: updatedItem });
    })
    .catch((err) => {
      // console.error(err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundErr("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestErr("Invalid data"));
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((updatedItem) => {
      res.send({ message: "Item liked", item: updatedItem });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundErr("Item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestErr("Invalid data"));
      } else next(err);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        next(new ForbiddenErr("You can't delete another user's card"));
      }
      return ClothingItem.deleteOne({ _id: itemId })
        .orFail()
        .then(() => res.send({ message: "Item has been deleted" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestErr("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundErr("Item not found"));
      } else {
        next(err);
      }
    });
};

module.exports = { createItem, getItems, likeItem, dislikeItem, deleteItem };
