const express = require("express");
const cors = require("cors");
const router = require("./routes");

const app = express();

app.use(cors());              // <-- FIXED
app.use(express.json());
app.use(router);

app.listen(4000, () => console.log("Backend running on 4000"));
