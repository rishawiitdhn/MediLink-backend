const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const mainRouter = require("./routes/mainRouter");
const cors = require("cors");

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let dbURL = process.env.MONGODB_URL;
main()
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
}

app.use(cors({ origin: "*" }));

app.use("/", mainRouter);

const port = process.env.PORT;

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});
app.listen(port, () => {
  console.log(`app is listening to the port`);
});
