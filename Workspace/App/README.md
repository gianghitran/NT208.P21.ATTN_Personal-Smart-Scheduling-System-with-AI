## I.Cách sử dụng

> 💡 **Yêu cầu**: Máy cần có Docker và Docker Compose được cài đặt sẵn.

### 1. Tạo file cấu hình `.env`

Dự án đã có sẵn file `.env.sample` chứa các biến môi trường mẫu. Để chạy dự án, bạn cần tạo file `.env` từ file này:

```bash
cp .env.sample .env
```

Sau đó, chỉnh sửa nội dung file `.env` và điền các thông tin cần thiết như:

```dotenv
# Google OAuth Configuration
VITE_GG_CLIENT_ID=your_google_client_id_here
GG_CLIENT_SECRET=your_google_client_secret_here
GG_REDIRECT_URI=http://localhost:3000/oauth2callback
GG_REDIRECT_LOGIN_URL=http://localhost:3000/oauth2callback-login

# Database Configuration
MONGOSV=mongodb://mongo:27017/dbname
# MONGOSV=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# JWT Secret Keys
ACCESS_KEY=your_jwt_access_secret_key_minimum_32_characters_long
REFRESH_KEY=your_jwt_refresh_secret_key_minimum_32_characters_long

# AI Services
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_api_key_here
# WHISPER_API_KEY=sk-proj-your_openai_whisper_api_key_here
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here

# Email Configuration
MAIL_USER=your_gmail_address@gmail.com
MAIL_PASS=your_gmail_app_password_here

# Cookie Secret
COOKIE_SECRET=your_cookie_secret_key_minimum_32_characters_long
```

---

### 2. Khởi động dự án

Sau khi đã cấu hình `.env`, chạy lệnh sau để build và khởi động toàn bộ hệ thống:

```bash
docker-compose up --build -d
```

Chỉ để khởi động sau khi đã build trước đó:

```bash
docker-compose up -d
```

---

### 3. Lưu ý

- 🐢 **MongoDB local có thể khởi động chậm** — nếu backend chưa kết nối được ngay, hãy thử đợi vài phút hoặc khởi động lại container.
- ⚡ **MongoDB Atlas kết nối nhanh hơn** — bạn có thể thay đổi biến `MONGOSV` trong `.env` để sử dụng chuỗi kết nối từ MongoDB Atlas.
- 🔐 Không nên commit file `.env` vào Git — hãy đảm bảo file này nằm trong `.gitignore`.

---

### 4. Tắt hệ thống

Khi không sử dụng, bạn có thể dừng toàn bộ các container với lệnh:

```bash
docker-compose down
```

## II. Hướng dẫn chạy dự án trên trình IDLE
### Client side

#### BEGIN

Install steps:

1. npm create vite@latest . --template (install react.js by vite in current directory)

Run steps:

1. git clone (for sure)
2. `npm install` in current directory if node_modules disappear (package.json logged all package you installed in this project so just npm install)
3. `npm run dev` to load server

Note:

- Can delete some files and foldes that we don't need when first installation.
- `Link` in React help you navigate to other pages without load the website again.
- To run frontend and backend, set frontend's vite.config.js value _"proxy":"url"_ of backend's url.

### Server side
RUN steps:

1. npm init -y (init workspace for server)
2. npm i express (install express package)
3. npm i nodemon (nodemon helps update app when saving)
4. npm i cors dotenv bcrypt cookie-parser jsonwebtoken
5. npm i mongoose (package to connect database)

**NOTE:**

- To run this app use this command **npm run start** in current directory
- How to connect to mongoose (if use web cluster, remember to add your ip or apply for all ip).

```
const dotenv = require("dotenv"); // Import dotenv
const mongoose = require("mongoose"); // Import mongoose
dotenv.config(); // Use dotenv

const connectToMongo = async () => {
  await mongoose.connect(process.env.MONGO_URL); // MONGO_URL is a var in file .env
  console.log("Connected to MongoDB");
};
connectToMongo();
```

![image](https://github.com/user-attachments/assets/a18ed740-e0d5-4300-b406-c15f0f6c4112)



key meta lama: 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
key gpt4o: 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


#### JSON google calendar:
```
{
  "kind": "calendar#event",
  "etag": "\"p33q5f5b2gsk60g0\"",
  "id": "1g6t3g8p1v0e8b9ro9d1ha0t4g",
  "status": "confirmed",
  "htmlLink": "https://www.google.com/calendar/event?eid=1g6t3g8p1v0e8b9ro9d1ha0t4g",
  "created": "2023-04-01T10:00:00Z",
  "updated": "2023-04-01T10:00:00Z",
  "summary": "Cuộc họp định kỳ",
  "description": "Cuộc họp định kỳ vào thứ Ba và thứ Sáu.",
  "location": "Địa điểm cụ thể",
  "creator": {
    "email": "your-email@example.com",
    "displayName": "Tên bạn",
    "self": true
  },
  "organizer": {
    "email": "your-email@example.com",
    "displayName": "Tên bạn",
    "self": true
  },
  "start": {
    "date": "2015-06-01",
    "dateTime": "2015-09-15T06:00:00+02:00",
    "timeZone": "Europe/Zurich"
  },
  "end": {
    "date": "2015-06-02",
    "dateTime": "2015-09-15T07:00:00+02:00",
    "timeZone": "Europe/Zurich"
  },
  "iCalUID": "1g6t3g8p1v0e8b9ro9d1ha0t4g@google.com",
  "sequence": 0,
  "attendees": [
    {
      "email": "attendee1@example.com",
      "displayName": "Người tham dự 1",
      "responseStatus": "accepted"
    },
    {
      "email": "attendee2@example.com",
      "displayName": "Người tham dự 2",
      "responseStatus": "needsAction"
    }
  ],
  "recurrence": [
    "RRULE:FREQ=WEEKLY;COUNT=5;BYDAY=TU,FR"
  ],
  "reminders": {
    "useDefault": false,
    "overrides": [
      {
        "method": "email",
        "minutes": 1440
      },
      {
        "method": "popup",
        "minutes": 10
      }
    ]
  },
  "eventType": "default"
}
```
