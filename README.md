# NT208.P21.ATTN_Personal-Smart-Scheduling-System-with-AI
---


## Mục lục

- [ĐỒ ÁN MÔN HỌC](#đồ-án-môn-học-lập-trình-ứng-dụng-web---nt208p21antn-)
  - [Nhóm thực hiện - Nhóm 5](#nhóm-thực-hiện---nhóm-5)
- [Thông tin sản phẩm](#personal-smart-scheduling-system-with-ai)
- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Các tính năng chính](#các-tính-năng-chính)
- [Các tính năng nổi bật](#các-tính-năng-nổi-bật)
  - [Đăng nhập/Đăng ký](#chức-năng-đăng-nhập-đăng-ký)
  - [Đồng bộ Google Calendar](#đồng-bộ-google-calendar)
  - [Chatbox AI hỗ trợ đặt lịch](#chatbox-ai-hỗ-trợ-đặt-lịch-thông-minh--cá-nhân-hóa)
  - [To-do List, Nhắc nhở & Collaboration](#chế-độ-to-do-list-nhắc-nhở--collaboration)
  - [Admin page](#admin-page---cho-phép-admin-quản-lý-website)
  - [Mobile Friendly](#mobile-friendly)
- [Tối ưu hiệu năng](#các-tính-năng-hỗ-trợ-load-và-tối-ưu)
- [Sơ đồ hệ thống](#sơ-đồ-hệ-thống)
- [Sơ đồ kiến trúc](#sơ-đồ-kiến-trúc)
- [Cách sử dụng](#cách-sử-dụng)
  - [1. Tạo file cấu hình `.env`](#1-tạo-file-cấu-hình-env)
  - [2. Khởi động dự án](#2-khởi-động-dự-án)
  - [4. Tắt hệ thống](#4-tắt-hệ-thống)
  - [6. Lưu ý](#3-lưu-ý)
- [Video PR sản phẩm](#video-pr-sản-phẩm)
- [Bản quyền](#bản-quyền)


## ĐỒ ÁN MÔN HỌC [Lập trình ứng dụng Web - NT208.P21.ANTN] :
###  Nhóm thực hiện - Nhóm 5:
  
| MSSV | Họ và Tên | Email |
|:--------|:------------|:----------------------------|
| 23521005 | Trần Gia Nghi | 23521005@gm.uit.edu.vn |
| 23521802 | Nguyễn Đa Vít | 23521802@gm.uit.edu.vn |
| 23521018 | Trần Trọng Nghĩa | 23521018@gm.uit.edu.vn |

---
## This project was built by us:
- Gia-Nghi Tran : 23521005@gm.uit.edu.vn
- Trong-Nghia Tran : 23521018@gm.uit.edu.vn
- Da-Vit Nguyen : 23521802@gm.uit.edu.vn

> ![PosterThreeBears_origin](https://github.com/user-attachments/assets/91c74b63-bdc9-4756-85cd-e713a8108410)



---


## Personal Smart Scheduling System with AI

- Website: [https://bearlander.onrender.com/](https://bearlander.onrender.com/)  
- Source Code: [GitHub Repo](https://github.com/gianghitran/NT208.P21.ATTN_Personal-Smart-Scheduling-System-with-AI)
- Video demo: [Video demo](https://www.canva.com/design/DAGpK4XvsGc/v75jtWdCBoDPqklSqqjI0g/edit?utm_content=DAGpK4XvsGc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
---

## Giới thiệu

**Personal Smart Scheduling System with AI** là một nền tảng lập kế hoạch cá nhân thông minh, giúp người dùng quản lý công việc, hoạt động và sự kiện dễ dàng với sự hỗ trợ của Trí tuệ nhân tạo. Ứng dụng hỗ trợ các thao tác đặt lịch trực quan, đồng bộ với Google Calendar, đặt lịch bằng giọng nói, upload file CSV/TXT, và AI Chatbox lên lịch tự động.

---

## Công nghệ sử dụng

- **Frontend**: ReactJS
- **Backend**: ExpressJS, NodeJS
- **Database**: MongoDB Atlas

---

## Các tính năng chính
![image](https://github.com/user-attachments/assets/367f64c4-ba1c-4ec7-bf90-ee6ebfe99b03)

> ### Lịch và Giao diện quản lý lịch
> - Hiển thị lịch theo **Tuần / Tháng**.
> - Tùy chỉnh chế độ sáng tối **Darkmode / Lightmode**.
> - **Realtime Schedule**: cập nhật thời gian thực.
> - Kéo & thả sự kiện vào lịch.
> 
> ### Quản lý sự kiện & công việc
> - Thêm / Sửa / Xóa sự kiện, công việc cá nhân.
>   - Thêm bằng giao diện web thân thiện, tiện lợi.
>   - Thêm bằng cách lấy sự kiện từ google calendar ( đồng bộ google calendar).
>   - Thêm từ file csv.
>   - Thêm từ người khác (Collaboration)
> - Đặt sự kiện lặp lại theo ngày/tuần/tháng.
> - Phân loại sự kiện theo màu sắc.
> - Gửi **lời mời tham gia sự kiện** đến người khác.
> 
> ### AI Scheduling & AI Chatbox
> - Tích hợp **AI Chatbox** gợi ý và đặt lịch thông minh dựa trên yêu cầu người dùng.
> - **Voice Input**: Nhận dạng giọng nói và chuyển thành sự kiện.
> - **Text Upload**: Upload file TXT chứa nội dung sự kiện.
> - **CSV Upload**: Nhập hàng loạt sự kiện bằng file CSV.
> 
> ### Tích hợp và đồng bộ
> - **Google OAuth 2.0 Sign-in**.
> - Đồng bộ hóa sự kiện với **Google Calendar**.
> - Tích hợp API AI xử lý ngôn ngữ tự nhiên cho AI Chatbox.
> - Tích hợp **Assembly AI** nhận diện giọng nói và chuyển thành văn bản.
> 
> ### Thông báo & nhắc nhở
> - Nhắc nhở sự kiện bằng **Email và Push Notification**.
> - Tạo **Reminders** tự động cho các công việc quan trọng.
> 
> ### Đa ngôn ngữ
> - Hỗ trợ **Tiếng Việt | English** chuyển đổi nhanh.
 
---
## Các tính năng nổi bật
### Chức năng đăng nhập/ đăng ký


![image](https://github.com/user-attachments/assets/d8e15d96-0fab-453b-8fff-51914dbc9490)

> - Khả năng ghi nhớ mật khẩu (remember me).
> - Verify email khi đăng ký.
> - Lưu session key.

### Đồng bộ Google Calendar
- Cho phép người dùng đồng bộ hóa lịch trình cá nhân với Google Calendar chỉ bằng vài cú nhấp chuột.
- Tự động cập nhật các sự kiện, nhắc nhở và công việc giữa hệ thống Bearlander AI Scheduler và Google Calendar theo thời gian thực.
- Hỗ trợ đăng nhập bằng Google OAuth 2.0 và xác thực bảo mật phiên.

### Chatbox AI hỗ trợ đặt lịch thông minh & cá nhân hóa
> Tích hợp AI Chatbox Scheduling, cho phép người dùng lên lịch bằng ngôn ngữ tự nhiên qua trò chuyện.
> - AI có khả năng:
>   - Hỏi bằng giọng nói
>   - Hiểu và xử lý ngữ cảnh theo từng người dùng.
>   - Đề xuất thời gian hợp lý dựa trên lịch hiện có.
>   - Phát hiện lịch trùng, dày đặc để đưa ra gợi ý điều chỉnh.
>   - Lên lịch qua giọng nói bằng cách tích hợp với Assembly API.
>   - Cá nhân hóa lịch trình theo thói quen, ưu tiên và nhu cầu của từng người dùng.

![image](https://github.com/user-attachments/assets/993c8e11-d964-46e8-bc86-6cde70d1459f)


### Chế độ To-do List, Nhắc nhở & Collaboration


> - [My Task / To-do list]:
>   - Quản lý các công việc cần làm sắp đến và những công việc đã quá hạn.
>   - Thêm, sửa, xóa, đánh dấu hoàn thành từng task.
>   - Hệ thống nhắc nhở tự động bằng Email và Push Notification thông qua Google Calendar.

![image](https://github.com/user-attachments/assets/09d37459-b0c5-4a5a-8825-f7950f40e6c7)


> - [Chế độ Collaboration]:
>   - Chia sẻ sự kiện, công việc với bạn bè hoặc thành viên nhóm.
>   - Phân quyền xem hoặc chỉnh sửa từng sự kiện.
>   - Nhận thông báo ngay khi có sự kiện mới, cập nhật hoặc người khác tham gia.

![image](https://github.com/user-attachments/assets/de1e4708-ccb9-4a9f-969b-13dc636eb7ce)

> - [My activities]:
>   - Liệt kê các sự kiện trong ngày.
>   - Bao gồm cả sự kiện quá hank, sự kiện đang diễn ra, sự kiện sắp đến.

![image](https://github.com/user-attachments/assets/1dbf8e44-034a-4772-83a8-3d62795f9638)

> - [Darkmode]:

![image](https://github.com/user-attachments/assets/0cd92fd1-d150-4757-969e-e9304e78ef3b)


### Admin page - Cho phép admin quản lý website

![image](https://github.com/user-attachments/assets/82d585e1-258d-4045-9ced-26ce2d1dd324)

### Mobile friendly

- Hỗ trợ máy tính, tablet, điện thoại,..

https://github.com/user-attachments/assets/0ffd1232-ea8e-40f2-a3c4-fb6ee6139e21



---

## Các tính năng hỗ trợ load và tối ưu:
- SEO : > 90
- Lazy loading
- Google-site: ``` site:bearlander.onrender.com ```
- Real-time
- Mobile FriendlyFriendly

---
## Sơ đồ hệ thống
Bearlander\
│\
├── Trang chủ\
│   ├── Giới thiệu\
│   └── Đăng nhập / Đăng ký\
│\
│\
├── Admin Page\
│   ├── Quản lý người dùng\
│   ├── Quản lý sự kiện hệ thống\
│   ├── Quản lý token đã cấp\
│   ├── Quản lý lịch sử chatbox\
│   └── Quản lý sự kiện colab\
│\
│\
├── Tài khoản người dùng\
│   ├── Đăng ký (Google OAuth / Email)\
│   ├── Đăng nhập\
│   ├── Ghi nhớ đăng nhập (Remember me)\
│   └── Xác thực Email\
│\
│\
├── Schedule (Quản lý lịch cá nhân)\
│   ├── Lịch Tuần / Tháng\
│   ├── Thêm / xóa\
│   │    ├── Quản lý sự kiện & công việc\
│   │         ├── Tạo / Sửa / Xóa sự kiện\
│   │             ├── Tạo sự kiện từ:\
│   │                  ├── Google Calendar\
│   │                  ├── AI Chatbox\
│   │                  ├── CSV Upload\
│   │                  ├── Text Upload\
│   │                  └── Giọng nói (Voice Input)\
│   ├── Kéo thả sự kiện\
│   ├── Phân loại sự kiện theo màu\
│   ├── Đồng bộ Google Calendar\
│   ├── Sự kiện Collaboration\
│\
│\
├── Chatbox (AI Scheduling)\
│   ├── AI Chatbox đặt lịch thông minh\
│   ├── Gợi ý sự kiện cá nhân hóa\
│   ├── Phân tích thời gian trống\
│   ├── Nhận diện lịch trùng\
│   ├── Tự động tạo sự kiện vào lịch\
│   ├── Đề xuất thời gian hợp lý\
│   └── Nhận dạng giọng nói (Voice to Text)\
│\
│\
├── My Activities (Sự kiện trong ngày)\
│   ├── Hiển thị chi tiết các sự kiện trong ngày\
│   ├── Phân loại sự kiện: quá khứ / đang diễn ra / sắp diễn ra\
│\
│\
├── My task (To-do list)\
│   │   ├── Hiển thị những sự kiện có tag là "to do"\
│   │   ├── Đánh dấu hoàn thành\
│   │   └── Kí hiệu đã quá hạn hay chưa\
│   └── Nhắc nhở / Reminders\
│\
│\
│\
├── My Teams (Collaboration-Cộng tác sự kiện)\
│   ├── Chia sẻ sự kiện với người khác\
│   ├── Mời tham gia sự kiện\
│   ├── Phân quyền: Xem / Chỉnh sửa\
│   └── Nhận thông báo khi có cập nhật\
│\
│\
├── Tùy chỉnh giao diện\
│   ├── Hiển thị thông tin người dùng\
│   ├── Dark Mode / Light Mode\
│   └── Ngôn ngữ: Tiếng Việt / English\
│\
│\
└── Hệ thống tối ưu\
│    ├── Lazy Loading\
│    │     ├── Từng tab\
│    │     ├── Từng grid của tuần\
│    ├── Chuyển tab không cần reload\
│    ├── SEO > 90\
│    ├── Google-site search hỗ trợ\
│    ├── Real-time\
│    └── Mobile friendly\ 


---
## Sơ đồ kiến trúc

> Xem chi tiết trong file: [`Mindmap_PERSONAL-SMART-SCHEDULING-SYSTEM-WITH-AI.pdf`](Workspace/06-03-2025_MEETING4IDEAS_MINDMAP_DATABASES/Mindmap_PERSONAL-SMART-SCHEDULING-SYSTEM-WITH-AI.pdf)

---


## Cách sử dụng

> **Yêu cầu**: Máy cần có Docker và Docker Compose được cài đặt sẵn.

### 1. Tạo file cấu hình `.env`

Dự án đã có sẵn file `.env.sample` chứa các biến môi trường mẫu. Để chạy dự án, bạn cần tạo file `.env` từ file này:

```bash
cp .env.sample .env
```

Sau đó, chỉnh sửa nội dung file `.env` và điền các thông tin cần thiết như:

```dotenv
#### Google OAuth Configuration
VITE_GG_CLIENT_ID=your_google_client_id_here
GG_CLIENT_SECRET=your_google_client_secret_here
GG_REDIRECT_URI=http://localhost:3000/oauth2callback
GG_REDIRECT_LOGIN_URL=http://localhost:3000/oauth2callback-login

#### Database Configuration
MONGOSV=mongodb://mongo:27017/dbname
# MONGOSV=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

#### JWT Secret Keys
ACCESS_KEY=your_jwt_access_secret_key_minimum_32_characters_long
REFRESH_KEY=your_jwt_refresh_secret_key_minimum_32_characters_long

#### AI Services
OPENROUTER_API_KEY=sk-or-v1-your_openrouter_api_key_here
#### WHISPER_API_KEY=sk-proj-your_openai_whisper_api_key_here
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here

#### Email Configuration
MAIL_USER=your_gmail_address@gmail.com
MAIL_PASS=your_gmail_app_password_here

#### Cookie Secret
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

### 3. Lưu ý

- **MongoDB local có thể khởi động chậm** — nếu backend chưa kết nối được ngay, hãy thử đợi vài phút hoặc khởi động lại container.
- **MongoDB Atlas kết nối nhanh hơn** — bạn có thể thay đổi biến `MONGOSV` trong `.env` để sử dụng chuỗi kết nối từ MongoDB Atlas.
- Không nên commit file `.env` vào Git — hãy đảm bảo file này nằm trong `.gitignore`.

---

### 4. Tắt hệ thống

Khi không sử dụng, bạn có thể dừng toàn bộ các container với lệnh:

```bash
docker-compose down
```

---
## Video pr sản phẩm:
- [Video giới thiệu sản phẩm](https://drive.google.com/file/d/1BoezXOcbhSpHe9RJW1ExvsfBi4tgjKtN/view?usp=sharing)
---

## Bản quyền

© 2025 **BearLander Team**. All rights reserved.

---
