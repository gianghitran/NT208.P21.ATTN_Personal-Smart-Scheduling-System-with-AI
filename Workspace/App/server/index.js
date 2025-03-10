const express = require("express"); // Import express
const app = express(); // Define our app using express
const port = 3000; // Port that server will be run on

app.get("/", (req, res) => {
    res.send("Hello World")
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${port}`);
});