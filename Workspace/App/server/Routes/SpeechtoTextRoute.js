const express = require("express");
const { sendRecordtoAPI } = require("../Controllers/SpeechtoText/speedtotextController"); // Ensure correct import
const router = express.Router();
const multer = require("multer");
const upload = multer();

router.post("/send/:userId", upload.single('file'), sendRecordtoAPI);

module.exports = router;
