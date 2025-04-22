const { google } = require("googleapis");
const Event = require("../../Models/Event"); // Giả sử bạn có model Event
const User = require("../../Models/User");

const syncGoogleCalendar = async (req, res) => {
    console.log("syncGoogleCalendar loaded");
    const user = req.user;

    if (!user.googleAccessToken || !user.googleRefreshToken) {
        return res.status(403).json({ message: "Google Calendar chưa được kết nối." });
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GG_CLIENT_ID,
        process.env.GG_CLIENT_SECRET,
        process.env.GG_REDIRECT_URI
    );

    oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken,
    });

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    try {
        const events = await calendar.events.list({
            calendarId: "primary",
            timeMin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // lấy từ 7 ngày trước
            maxResults: 50,
            singleEvents: true,
            orderBy: "startTime",
        });

        const rawEvents = events.data.items;
        const filteredEvents = rawEvents.filter(ev => {
            // Bỏ qua các sự kiện lặp lại hoặc được tạo bởi calendar ngày lễ
            const isRecurring = ev.recurringEventId || ev.recurrence;
            const isHoliday = ev.organizer?.displayName?.toLowerCase().includes("holiday")
                || ev.summary?.toLowerCase().includes("tết")
                || ev.summary?.toLowerCase().includes("giáng sinh")
                || ev.creator?.email?.includes("holiday")
                || ev.description?.toLowerCase().includes("holiday");

            return !isRecurring && !isHoliday;
        });

        // Lưu vào MongoDB nếu chưa có
        let addedCount = 0;

        for (const ev of filteredEvents) {
            const exists = await Event.findOne({
                userId: user._id,
                title: ev.summary,
                start: new Date(ev.start.dateTime || ev.start.date)
            });

            if (!exists) {
                await Event.create({
                    userId: user._id,
                    title: ev.summary || "Không tiêu đề",
                    description: ev.description || "",
                    start: new Date(ev.start.dateTime || ev.start.date),
                    end: new Date(ev.end.dateTime || ev.end.date),
                    category: "other",  // hoặc map theo logic của bạn
                    completed: false
                });
                addedCount++;
            }
        }


        return res.status(200).json({ message: `Đã thêm ${addedCount} sự kiện từ Google Calendar.` });
    } catch (error) {
        console.error("❌ Lỗi khi sync Google Calendar:", error);
        console.error("🔍 Chi tiết lỗi:", error);
        return res.status(500).json({ message: "Không thể lấy dữ liệu từ Google Calendar." });
    }
};

const addEventToGoogleCalendar = async (req, res) => {
    const user = req.user;

    if (!user.googleAccessToken || !user.googleRefreshToken) {
        return res.status(403).json({ message: "Google Calendar chưa được kết nối." });
    }

    const { title, description, start, end } = req.body;

    const oauth2Client = new google.auth.OAuth2(
        process.env.GG_CLIENT_ID,
        process.env.GG_CLIENT_SECRET,
        process.env.GG_REDIRECT_URI
    );

    oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken,
    });

    oauth2Client.on("tokens", (tokens) => {
        if (tokens.access_token) {
          user.googleAccessToken = tokens.access_token;
          user.save(); // 🔁 Cập nhật DB
          console.log("🔁 Refreshed and saved new Google access_token");
        }
      });
      

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    try {
        const event = {
            summary: title,
            description: description,
            start: { dateTime: start, timeZone: "Asia/Ho_Chi_Minh" },
            end: { dateTime: end, timeZone: "Asia/Ho_Chi_Minh" },
        };

        const response = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
        });

        res.status(200).json({ message: "Sự kiện đã được thêm vào Google Calendar.", event: response.data });
    } catch (error) {
        console.error("❌ Lỗi khi thêm sự kiện vào Google Calendar:", error);
        res.status(500).json({ message: "Không thể thêm sự kiện vào Google Calendar." });
    }
};


const refreshGoogleToken = async (req, res) => {
  const { refreshToken } = req.body; // Lấy refresh token từ client hoặc database

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    });

    const { access_token, expires_in } = response.data;

    // Trả về access token mới
    res.status(200).json({ access_token, expires_in });
  } catch (error) {
    console.error("Error refreshing Google token:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to refresh token" });
  }
};


module.exports = {
    syncGoogleCalendar,
    addEventToGoogleCalendar, // Export hàm mới
    refreshGoogleToken ,
};
