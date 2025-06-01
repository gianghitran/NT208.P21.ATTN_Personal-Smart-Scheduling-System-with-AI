require("dotenv").config();
const FormData = require("form-data");
const fetch = require("node-fetch");

exports.sendRecordtoAPI = async (req, res) => {
  try {
    const audioFile = req.file; // nhận file từ multer

    if (!audioFile) {
      return res.status(400).json({ error: "Không tìm thấy file audio" });
    }

    console.log("Đã nhận file:", audioFile.originalname);

    // Upload file lên AssemblyAI
    const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
        method: "POST",
        headers: {
          "authorization": `${process.env.ASSEMBLYAI_API_KEY}`,
          "transfer-encoding": "chunked",
        },
        body: audioFile.buffer,
      });
  
      const uploadResult = await uploadResponse.json();
      if (uploadResponse.status === 401) {
        alert("Token API đã hết!");
        return res.status(401).json({ error: "Token API đã hết" });
      }
      if (!uploadResponse.ok) {
        console.error("Lỗi upload file:", uploadResult);
        alert("Lỗi API!");
        return res.status(500).json({ error: "Lỗi upload file", details: uploadResult });
      }
  
      const audio_url = uploadResult.upload_url;
  
      // Gửi yêu cầu transcript
      const transcriptResponse = await fetch("https://api.assemblyai.com/v2/transcript", {
        method: "POST",
        headers: {
          "authorization": process.env.ASSEMBLYAI_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          audio_url,
        }),
      });
  
      const transcriptResult = await transcriptResponse.json();
  
      if (!transcriptResponse.ok) {
        console.error("Lỗi tạo transcript:", transcriptResult);
        return res.status(500).json({ error: "Lỗi tạo transcript", details: transcriptResult });
      }
  
      //Polling cho đến khi hoàn thành
      const transcriptId = transcriptResult.id;
      let pollingResult;
      while (true) {
        const pollingRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          headers: {
            authorization: process.env.ASSEMBLYAI_API_KEY,
          },
        });
        pollingResult = await pollingRes.json();
        if (pollingResult.status === "completed") break;
        if (pollingResult.status === "error") {
          throw new Error(pollingResult.error);
        }
        await new Promise((resolve) => setTimeout(resolve, 3000)); // đợi 3s rồi check tiếp
      }
  
      res.status(200).json({ text: pollingResult.text });
    } catch (error) {
      console.error("Lỗi xử lý AssemblyAI:", error);
      res.status(500).json({ error: "AssemblyAI processing error", message: error.message });
    }
  };
