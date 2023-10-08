const express = require("express");
const { update } = require("./routes/index.js");
const cors = require("cors");
const {corsOrigins} = require('./config')
const app = express();

app.use(cors(corsOrigins));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/update', update);





app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
