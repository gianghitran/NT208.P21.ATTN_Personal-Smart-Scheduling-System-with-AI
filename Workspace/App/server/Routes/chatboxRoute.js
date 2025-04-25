const express = require("express");
const { saveMessage, getChatHistory } = require("../Controllers/Chatbox/chatboxController"); // Ensure correct import
const router = express.Router();
const { chatWithAI } = require("../Controllers/Chatbox/chatboxController");


router.post("/history/:userId", saveMessage); // Ensure `saveMessage` is not undefined
router.get("/history/:userId", getChatHistory); 

router.get("/send/:userId", getChatHistory); // Ensure `getChatHistory` is not undefined
router.post("/ask/:userId", chatWithAI);

module.exports = router;
 