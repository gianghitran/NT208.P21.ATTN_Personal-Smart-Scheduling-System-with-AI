require("dotenv").config(); // Đọc biến môi trường từ .env

exports.sendRecordtoAPI= async (req, res) => {
    
    try {
        const { messages } = req.body; // Nhận file âm thanh từ client

        if (!messages) {
            return res.status(400).json({ error: "Không tìm thấy file audio" });
        }

        const responseFromOpenAI  = await fetch("https://api.openai.com/v1/audio/translations", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.WHISPER_API_KEY}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "SpeechToText",
            },
            body: JSON.stringify({
                file: messages,
                model: "whisper-1",
            }),
        });

        res.status(200).json({ text: responseFromOpenAI.text });
    } catch (error) {
        console.error("Lỗi audio file:", error.message);
        res.status(500).json({ error: "Audio processing error" });
    }
};