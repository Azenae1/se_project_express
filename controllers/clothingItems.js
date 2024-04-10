const ClothingItem = require("../models/clothingItem");
const { ERROR_CODES } = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: err.message });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

// const likeItem = (req, res) => {
//   const { itemId } = req.params;
//   ClothingItem.findByIdAndUpdate(
//     itemId,
//     { $addToSet: { likes: req.user._id } },
//     { new: true },
//   )
//     .then((item) => {
//       res.status(200).send({ message: "Item liked" });
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res.status(ERROR_CODES.NOT_FOUND).send({ message: err.message });
//       }
//       if (err.name === "CastError") {
//         return res
//           .status(ERROR_CODES.BAD_REQUEST)
//           .send({ message: err.message });
//       }
//       return res
//         .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
//         .send({ message: err.message });
//     });
// };

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.likes.includes(req.user._id)) {
        return res.status(200).send({ message: "User hasn't liked this item" });
      }
      item.likes.pull(req.user._id);
      return item.save();
    })
    .then((updatedItem) => {
      res.status(200).send({ message: "Item disliked", item: updatedItem });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: err.message });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.likes.includes(req.user._id)) {
        return res
          .status(200)
          .send({ message: "User has already liked this item" });
      }
      item.likes.push(req.user._id);
      return item.save();
    })
    .then((updatedItem) => {
      res.status(200).send({ message: "Item liked", item: updatedItem });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODES.NOT_FOUND).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: err.message });
      }
      return res
        .status(ERROR_CODES.INTERNAL_SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.createClothingItem = (req, res) => {
  console.log(req.user._id);
};
module.exports = { createItem, getItems, likeItem, dislikeItem };
