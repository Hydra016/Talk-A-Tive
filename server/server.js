const express = require("express");
const { chats } = require("./data");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middelwares/errorMiddelwares");
const chatRoutes = require("./routes/chatRoutes");


const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


app.use(express.json());

mongoose.connect(process.env.DB_STRING);

app.use("/api", [userRoutes, chatRoutes]);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => `server running on port ${PORT}`);
