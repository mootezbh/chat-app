require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const messageRoutes = require("./routes/message.route");
const connect = require("./db/connect");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`), connect();
});
