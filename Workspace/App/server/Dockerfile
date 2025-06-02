# 1. Chọn base image Node.js
FROM node:20

# 2. Tạo thư mục làm việc trong container
WORKDIR /app

# 3. Copy package.json và package-lock.json (nếu có) rồi cài dependencies
COPY package*.json ./
RUN npm install

# 4. Copy toàn bộ source code vào container
COPY . .

# 5. Expose port server đang chạy (ví dụ 4000)
EXPOSE 4000

# 6. Chạy server (giả sử file chính là index.js)
CMD ["npm", "start"]
