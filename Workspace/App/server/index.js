const express = require("express"); // Import express
const app = express(); // Define our app using express
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const port = 4000; // Port that server will be run on

const authRoute = require("./Routes/authRoute");
const cookieParser = require("cookie-parser");

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

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoute);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});