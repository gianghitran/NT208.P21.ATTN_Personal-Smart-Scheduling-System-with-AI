const express = require("express");
const { saveMessage, getChatHistory } = require("../Controllers/Chatbox/chatboxController"); // Ensure correct import
const router = express.Router();

router.post("/history/:userId", saveMessage); // Ensure `saveMessage` is not undefined
router.get("/send/:userId", getChatHistory); // Ensure `getChatHistory` is not undefined

module.exports = router;
 