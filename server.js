const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
app.use(express.json());
const userRoute = require("./routes/userRoutes.js");
const adminRoute = require('./routes/adminRoute.js')

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`listening on port ${port}`));
