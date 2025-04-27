const express = require("express");
const { sendRecordtoAPI } = require("../Controllers/SpeechtoText/speedtotextController"); // Ensure correct import
const router = express.Router();

router.post("/send:userId", sendRecordtoAPI);

module.exports = router;
