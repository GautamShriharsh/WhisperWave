import  express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";

import path from "path";

import {app,server} from "./lib/socket.js";

dotenv.config();


const PORT = process.env.PORT;
const __dirname = path.resolve();

const allowedOrigins = [ 
    "http://localhost:5173", 
    "https://your-production-domain.com"
  ];

app.use(cors({ 
    origin: allowedOrigins,
    credentials: true,
 }
));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist", "index.html"));
  });
}




server.listen(PORT, () => {
    console.log("server is running on port: " +  PORT);
    connectDB();
})