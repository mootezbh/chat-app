require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const messageRoutes = require("./routes/message.route");
const connect = require("./db/connect");
const { app, server } = require("./socket/socket");

const PORT = process.env.PORT || 5000;
const dirname = path.resolve();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(dirname + "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(dirname + "/frontend/dist/index.html"));
});
server.listen(PORT, () => {
  console.log(`server started on port ${PORT}`), connect();
});
