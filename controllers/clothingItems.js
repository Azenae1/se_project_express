const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server", error: err });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  console.log(req.user._id);
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data", error: err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server", error: err });
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
//         return res.status(NOT_FOUND).send({ message: "An error has occurred on the server", error: err });
//       }
//       if (err.name === "CastError") {
//         return res
//           .status(BAD_REQUEST)
//           .send({ message: "An error has occurred on the server", error: err });
//       }
//       return res
//         .status(INTERNAL_SERVER_ERROR)
//         .send({ message: "An error has occurred on the server", error: err });
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
        return res
          .status(NOT_FOUND)
          .send({ message: "An error has occurred on the server", error: err });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data", error: err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server", error: err });
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
        return res
          .status(NOT_FOUND)
          .send({ message: "An error has occurred on the server", error: err });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data", error: err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server", error: err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  // console.log("Deleting item with ID:", itemId);

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      console.log(item);
      res.status(200).send({ message: "The item has been deleted" });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data", error: err });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "An error has occurred on the server", error: err });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server", error: err });
    });
};

// module.exports.createClothingItem = (req, res) => {
//   console.log(res);
//   console.log(req.user._id);
// };
module.exports = { createItem, getItems, likeItem, dislikeItem, deleteItem };
