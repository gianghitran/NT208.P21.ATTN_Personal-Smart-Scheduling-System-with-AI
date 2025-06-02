## 🚀 Cách sử dụng

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

---

### 3. Lưu ý

- 🐢 **MongoDB local có thể khởi động chậm** — nếu backend chưa kết nối được ngay, hãy thử đợi vài giây hoặc khởi động lại container.
- ⚡ **MongoDB Atlas kết nối nhanh hơn** — bạn có thể thay đổi biến `MONGOSV` trong `.env` để sử dụng chuỗi kết nối từ MongoDB Atlas.
- 🔐 Không nên commit file `.env` vào Git — hãy đảm bảo file này nằm trong `.gitignore`.

---

### 4. Tắt hệ thống

Khi không sử dụng, bạn có thể dừng toàn bộ các container với lệnh:

```bash
docker-compose down
```
