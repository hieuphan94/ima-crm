# Sử dụng Node.js nhẹ (Alpine)
FROM node:18-alpine AS builder

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json trước (tận dụng cache Docker)
COPY package*.json ./

# Cài đặt dependencies production mà không bao gồm devDependencies
RUN npm ci --omit=dev

# Sao chép toàn bộ source code vào container
COPY . .

# Xóa cache npm để giảm dung lượng image
RUN rm -rf ~/.npm

# Sử dụng một image nhẹ hơn để chạy app
FROM node:18-alpine AS runner

# Thiết lập biến môi trường
ENV NODE_ENV=production
ENV PORT=3000

# Định nghĩa thư mục làm việc
WORKDIR /app

# Copy chỉ những file cần thiết từ builder để tránh dư thừa
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/src ./src

# Tạo một user non-root để chạy app an toàn hơn
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose cổng 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["node", "src/index.js"]
