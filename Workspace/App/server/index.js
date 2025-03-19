const express = require("express"); // Import express
const app = express(); // Define our app using express
const port = 4000; // Port that server will be run on

app.get("/api/user", (req, res) => {
    console.log("hello");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});