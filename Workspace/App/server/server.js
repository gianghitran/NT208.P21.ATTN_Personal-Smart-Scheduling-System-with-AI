const express = require("express"); // Import express
const app = express(); // Define our app using express
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const port = 4000; // Port that server will be run on

const authRoute = require("./Routes/authRoute");
const cookieParser = require("cookie-parser");

const eventRoute = require("./Routes/eventRoute");
const chatboxRoute = require("./Routes/chatboxRoute");

const os = require("os");

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOSV);
        console.log("MongoDB is connected");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

connectDB();


function getLocalIPs() {
    const interfaces = os.networkInterfaces();
    const ips = [];
  
    Object.values(interfaces).forEach((iface) => {
      iface.forEach((info) => {
        if (info.family === "IPv4" && !info.internal) {
          ips.push(`http://${info.address}:3000`);
        }
      });
    });
  
    return ips;
  }
  
const allowedOrigins = ["http://localhost:3000", ...getLocalIPs()];


app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);
  
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoute);
app.use("/api/event", eventRoute);
app.use("/api/chatbox", chatboxRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

