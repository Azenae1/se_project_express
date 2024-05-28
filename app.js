/* eslint-disable no-console */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");

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

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.use("/", mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
