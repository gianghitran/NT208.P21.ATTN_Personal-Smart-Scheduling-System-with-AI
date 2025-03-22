const express = require("express"); // Import express
const app = express(); // Define our app using express
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const port = 4000; // Port that server will be run on

const authRoute = require("./Routes/authRoute");
const cookieParser = require("cookie-parser");

const eventRoute = require("./Routes/eventRoute");

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

app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000"],
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoute);
app.use("/api/event", eventRoute);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

