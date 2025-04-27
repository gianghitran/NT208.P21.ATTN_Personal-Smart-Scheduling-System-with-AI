require("dotenv").config(); // Đọc biến môi trường từ .env

exports.sendRecordtoAPI= async (req, res) => {
    
    try {
        const { audioFile } = req.body; // Nhận file âm thanh từ client

        if (!audioFile) {
            return res.status(400).json({ error: "Không tìm thấy file audio" });
        }

        const res = await fetch("https://api.openai.com/v1/audio/translations", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.WHISPER_API_KEY}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "SpeechToText",
            },
            body: JSON.stringify({
                file: audioFile,
                model: "whisper-1",
            }),
        });

        res.status(200).json({ text: res.text });
    } catch (error) {
        console.error("Lỗi audio file:", error.message);
        res.status(500).json({ error: "Audio processing error" });
    }
};