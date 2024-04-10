const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connnected to DB");
  })
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "6616c105112385d61895815c",
  };
  next();
});
app.use(express.json());
app.use("/", mainRouter);
