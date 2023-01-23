require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const mobileRoutes = require("./routes/mobile.route")
const deviceRoutes = require("./routes/device.route")
const messageRoutes = require("./routes/message.route")
const helpRoutes = require("./routes/helpsupport.route")

//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api", authRoutes);
app.use("/mobile", mobileRoutes );
app.use("/device",deviceRoutes);
app.use("/message",messageRoutes);
app.use("/help/",helpRoutes)

app.get('/forgot', function(req, res) {
  res.render('forgot', {
    user: req.user
  });
});
//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
