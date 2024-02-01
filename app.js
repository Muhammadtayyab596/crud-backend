require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const connectDB = require("./db/index");
const routes = require("./routes/index");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/", routes);

app.listen(port, () => {
  connectDB();
  console.log(`http://localhost:${port}`);
});
