# NT208.P21.ATTN_Personal-Smart-Scheduling-System-with-AI
## This project was built by us:
- Gia-Nghi Tran : 23521005@gm.uit.edu.vn
- Trong-Nghia Tran : 23521018@gm.uit.edu.vn
- Da-Vit Nguyen : 23521802@gm.uit.edu.vn
## 📅 Personal Smart Scheduling System with AI

Website: [https://bearlander.onrender.com/](https://bearlander.onrender.com/)  
Source Code: [GitHub Repo](https://github.com/gianghitran/NT208.P21.ATTN_Personal-Smart-Scheduling-System-with-AI)

---

## 📖 Giới thiệu

**Personal Smart Scheduling System with AI** là một nền tảng lập kế hoạch cá nhân thông minh, giúp người dùng quản lý công việc, hoạt động và sự kiện dễ dàng với sự hỗ trợ của Trí tuệ nhân tạo. Ứng dụng hỗ trợ các thao tác đặt lịch trực quan, đồng bộ với Google Calendar, đặt lịch bằng giọng nói, upload file CSV/TXT, và AI Chatbox lên lịch tự động.

---

## 📌 Công nghệ sử dụng

- **Frontend**: ReactJS
- **Backend**: ExpressJS, NodeJS
- **Database**: MongoDB Atlas

---

## 🎯 Các tính năng chính
![image](https://github.com/user-attachments/assets/367f64c4-ba1c-4ec7-bf90-ee6ebfe99b03)

> ### 📆 Lịch và Giao diện quản lý lịch
> - Hiển thị lịch theo **Tuần / Tháng**.
> - Tùy chỉnh chế độ sáng tối **Darkmode / Lightmode**.
> - **Realtime Schedule**: cập nhật thời gian thực.
> - Kéo & thả sự kiện vào lịch.
> 
> ### 📑 Quản lý sự kiện & công việc
> - Thêm / Sửa / Xóa sự kiện, công việc cá nhân.
>   - Thêm bằng giao diện web thân thiện, tiện lợi.
>   - Thêm bằng cách lấy sự kiện từ google calendar ( đồng bộ google calendar).
>   - Thêm từ file csv.
>   - Thêm từ người khác (Collaboration)
> - Đặt sự kiện lặp lại theo ngày/tuần/tháng.
> - Phân loại sự kiện theo màu sắc.
> - Gửi **lời mời tham gia sự kiện** đến người khác.
> 
> ### 📚 AI Scheduling & AI Chatbox
> - Tích hợp **AI Chatbox** gợi ý và đặt lịch thông minh dựa trên yêu cầu người dùng.
> - **Voice Input**: Nhận dạng giọng nói và chuyển thành sự kiện.
> - **Text Upload**: Upload file TXT chứa nội dung sự kiện.
> - **CSV Upload**: Nhập hàng loạt sự kiện bằng file CSV.
> 
> ### 🔗 Tích hợp và đồng bộ
> - **Google OAuth 2.0 Sign-in**.
> - Đồng bộ hóa sự kiện với **Google Calendar**.
> - Tích hợp API AI xử lý ngôn ngữ tự nhiên cho AI Chatbox.
> - Tích hợp **Assembly AI** nhận diện giọng nói và chuyển thành văn bản.
> 
> ### 🔔 Thông báo & nhắc nhở
> - Nhắc nhở sự kiện bằng **Email và Push Notification**.
> - Tạo **Reminders** tự động cho các công việc quan trọng.
> 
> ### 🌐 Đa ngôn ngữ
> - Hỗ trợ **Tiếng Việt | English** chuyển đổi nhanh.
 
---
## 🌟 Các tính năng nổi bật
### 📌 Chức năng đăng nhập/ đăng ký


![image](https://github.com/user-attachments/assets/d8e15d96-0fab-453b-8fff-51914dbc9490)

> - Khả năng ghi nhớ mật khẩu (remember me).
> - Verify email khi đăng ký.
> - Lưu session key.

### 📌 Đồng bộ Google Calendar
- Cho phép người dùng đồng bộ hóa lịch trình cá nhân với Google Calendar chỉ bằng vài cú nhấp chuột.
- Tự động cập nhật các sự kiện, nhắc nhở và công việc giữa hệ thống Bearlander AI Scheduler và Google Calendar theo thời gian thực.
- Hỗ trợ đăng nhập bằng Google OAuth 2.0 và xác thực bảo mật phiên.

### 📌 Chatbox AI hỗ trợ đặt lịch thông minh & cá nhân hóa
> Tích hợp AI Chatbox Scheduling, cho phép người dùng lên lịch bằng ngôn ngữ tự nhiên qua trò chuyện.
> - AI có khả năng:
>   - Hỏi bằng giọng nói
>   - Hiểu và xử lý ngữ cảnh theo từng người dùng.
>   - Đề xuất thời gian hợp lý dựa trên lịch hiện có.
>   - Phát hiện lịch trùng, dày đặc để đưa ra gợi ý điều chỉnh.
>   - Lên lịch qua giọng nói bằng cách tích hợp với Assembly API.
>   - Cá nhân hóa lịch trình theo thói quen, ưu tiên và nhu cầu của từng người dùng.

![image](https://github.com/user-attachments/assets/993c8e11-d964-46e8-bc86-6cde70d1459f)


### 📌 Chế độ To-do List, Nhắc nhở & Collaboration


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

### 📌 Admin page - Cho phép admin quản lý website

![image](https://github.com/user-attachments/assets/82d585e1-258d-4045-9ced-26ce2d1dd324)



---
## 📖 Sơ đồ kiến trúc

> Xem chi tiết trong file: [`Mindmap_PERSONAL-SMART-SCHEDULING-SYSTEM-WITH-AI.pdf`](./Mindmap_PERSONAL-SMART-SCHEDULING-SYSTEM-WITH-AI.pdf)

---

## 📣 Nhóm thực hiện

| MSSV | Họ và Tên | Email |
|:--------|:------------|:----------------------------|
| 23521005 | Trần Gia Nghi | 23521005@gm.uit.edu.vn |
| 23521802 | Nguyễn Đa Vít | 23521802@gm.uit.edu.vn |
| 23521018 | Trần Trọng Nghĩa | 23521018@gm.uit.edu.vn |

---

## 📑 Bản quyền

© 2025 **BearLander Team**. All rights reserved.

---
