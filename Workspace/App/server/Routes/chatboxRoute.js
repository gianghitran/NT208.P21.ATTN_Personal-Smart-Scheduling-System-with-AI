const express = require("express");
const { saveMessage, getChatHistory } = require("../Controllers/Chatbox/chatboxController"); 
const router = express.Router();
const { chatWithAI } = require("../Controllers/Chatbox/chatboxController");


router.post("/history/:userId", saveMessage); 
router.get("/history/:userId", getChatHistory); 

router.get("/send/:userId", getChatHistory); 
router.post("/ask/:userId", chatWithAI);

module.exports = router;
 