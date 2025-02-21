# Sử dụng Node.js phiên bản nhẹ (Alpine)
FROM node:18-alpine AS builder

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép file package.json và package-lock.json trước để tối ưu cache layer
COPY package*.json ./

# Cài đặt dependencies production (không có devDependencies)
RUN npm install --omit=dev

# Sao chép toàn bộ source code vào container
COPY . .

# Chạy lệnh build nếu cần (bỏ qua nếu app không cần build)
# RUN npm run build  

# Sử dụng một image nhẹ để chạy app (multi-stage build)
FROM node:18-alpine AS runner

# Định nghĩa thư mục làm việc
WORKDIR /app

# Copy dependencies từ builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./

# Định nghĩa biến môi trường mặc định
ENV NODE_ENV=production
ENV PORT=3000

# Expose cổng 3000 (không bắt buộc nếu đã có docker-compose.yml)
EXPOSE 3000

# Chạy ứng dụng
CMD ["node", "src/index.js"]
