const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const os = require("os");
const fs = require('fs');
const path = require('path');

const { keystone, apps } = require("./keystone/keystone");

dotenv.config();
const app = express();
const port = 4000;

const authRoute = require("./Routes/authRoute");
const syncRoute = require("./Routes/syncRoute");
const eventRoute = require("./Routes/eventRoute");
const chatboxRoute = require("./Routes/chatboxRoute");
const SpeechtoTextRoute = require("./Routes/SpeechtoTextRoute");
const eventSharingRoute = require("./Routes/eventSharingRoute");
const sseRoute = require("./Routes/sseRoute");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOSV);
    console.log("✅ MongoDB is connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

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

const allowedOrigins = ["http://localhost:3000", "https://bearlander.onrender.com", ...getLocalIPs()];

app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gọi trước để đảm bảo DB sẵn sàng
connectDB();

// Bọc keystone.prepare trong async function
(async () => {
  // 🔁 KeystoneJS kết nối MongoDB
  await keystone.connect();
  console.log("✅ KeystoneJS is connected to MongoDB");

  const { middlewares } = await keystone.prepare({
    apps,
    dev: true,
    port,
  });


  // Mount routes của app
  app.use("/api/auth", authRoute);
  app.use("/api/event", eventRoute);
  app.use("/api/chatbox", chatboxRoute);
  app.use("/api/speech", SpeechtoTextRoute);
  app.use("/api/google-calendar", syncRoute);
  app.use("/api/collab", eventSharingRoute);
  app.use("/api/sse", sseRoute);

  // Mount Keystone Admin UI (gắn sau API)
  app.use(middlewares); // Keystone UI: /admin + /admin/api

  const originalConsoleLog = console.log;
  console.log = function (...args) {
    const msg = args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ') + '\n';
    keystoneLogStream.write(msg);
    originalConsoleLog.apply(console, args);
  }

  app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`🔐 Admin UI available at http://localhost:${port}/admin`);
  });
})();

// Ghi đè process.stdout.write để chuyển log JSON của Keystone vào file
const keystoneLogPath = path.join(__dirname, 'keystone', 'keystone_log.txt');
const keystoneLogStream = fs.createWriteStream(keystoneLogPath, { flags: 'a' });
const originalStdoutWrite = process.stdout.write;

process.stdout.write = function (chunk, encoding, callback) {
  // Nếu là log JSON của pino (Keystone), ghi vào file thay vì console
  if (typeof chunk === "string" && chunk.startsWith('{"level":')) {
    keystoneLogStream.write(chunk, encoding);
    return true;
  }
  return originalStdoutWrite.apply(process.stdout, arguments);
};
