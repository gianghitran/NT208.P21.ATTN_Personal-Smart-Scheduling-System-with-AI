const { google } = require("googleapis");
const Event = require("../../Models/Event");
const User = require("../../Models/User");

const syncGoogleCalendar = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user?.googleAccessToken || !user?.googleRefreshToken) {
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


    try {
        const tokenResponse = await oauth2Client.getAccessToken();
        const newAccessToken = tokenResponse?.token;

        if (newAccessToken && newAccessToken !== user.googleAccessToken) {
            user.googleAccessToken = newAccessToken;
            await user.save();
        }

        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        
        const events = await calendar.events.list({
            calendarId: "primary",
            timeMin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            maxResults: 50,
            singleEvents: true,
            orderBy: "startTime",
        });

        const rawEvents = events.data.items;
        const filteredEvents = rawEvents.filter(ev => {
            const isRecurring = ev.recurringEventId || ev.recurrence;
            const isHoliday = ev.organizer?.displayName?.toLowerCase().includes("holiday")
                || ev.summary?.toLowerCase().includes("tết")
                || ev.summary?.toLowerCase().includes("giáng sinh")
                || ev.creator?.email?.includes("holiday")
                || ev.description?.toLowerCase().includes("holiday");

            return !isRecurring && !isHoliday;
        });

        const googleEventKeys = filteredEvents.map(ev =>
            `${ev.summary}|${new Date(ev.start.dateTime || ev.start.date).toISOString()}|${new Date(ev.end.dateTime || ev.end.date).toISOString()}`
        );

        const dbEvents = await Event.find({ userId: user._id });
        const dbEventKeys = dbEvents.map(ev =>
            `${ev.title}|${new Date(ev.start).toISOString()}|${new Date(ev.end).toISOString()}`
        );

        let addedCount = 0;
        for (const ev of filteredEvents) {
            const exists = await Event.findOne({
                userId: user._id,
                title: ev.summary,
                start: new Date(ev.start.dateTime || ev.start.date),
                end: new Date(ev.end.dateTime || ev.end.date),
            });
            if (!exists) {
                await Event.create({
                    userId: user._id,
                    title: ev.summary || "Không tiêu đề",
                    description: ev.description || "",
                    start: new Date(ev.start.dateTime || ev.start.date),
                    end: new Date(ev.end.dateTime || ev.end.date),
                    category: "other",
                    completed: false
                });
                addedCount++;
            }
        }

        let pushedCount = 0;
        for (const dbEv of dbEvents) {
            const key = `${dbEv.title}|${new Date(dbEv.start).toISOString()}|${new Date(dbEv.end).toISOString()}`;
            if (!googleEventKeys.includes(key)) {
                try {
                    await calendar.events.insert({
                        calendarId: "primary",
                        resource: {
                            summary: dbEv.title,
                            description: dbEv.description,
                            start: { dateTime: dbEv.start, timeZone: "Asia/Ho_Chi_Minh" },
                            end: { dateTime: dbEv.end, timeZone: "Asia/Ho_Chi_Minh" },
                        },
                    });
                    pushedCount++;
                } catch (err) {
                }
            }
        }

        return res.status(200).json({ message: `Đã thêm ${addedCount} sự kiện từ Google Calendar và đẩy ${pushedCount} sự kiện lên Google Calendar.` });
    } catch (error) {
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

    oauth2Client.on("tokens", async (tokens) => {
        if (tokens.access_token) {
            user.googleAccessToken = tokens.access_token;
            await user.save();
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
        res.status(500).json({ message: "Không thể thêm sự kiện vào Google Calendar." });
    }
};


const refreshGoogleToken = async (req, res) => {
    const { refreshToken } = req.body; 

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

        res.status(200).json({ access_token, expires_in });
    } catch (error) {
        res.status(500).json({ message: "Failed to refresh token" });
    }
};


module.exports = {
    syncGoogleCalendar,
    addEventToGoogleCalendar,
    refreshGoogleToken,
};
