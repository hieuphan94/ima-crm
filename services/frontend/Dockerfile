# --- Giai đoạn Build ---
    FROM node:18-alpine AS builder

    # Thiết lập thư mục làm việc
    WORKDIR /app
    
    # Sao chép package.json và package-lock.json để tối ưu caching
    COPY package*.json ./
    
    # Cài đặt chỉ dependencies cho production (bỏ qua devDependencies)
    RUN npm ci --omit=dev --legacy-peer-deps
    
    # Sao chép toàn bộ mã nguồn vào container
    COPY . .
    
    # Xóa cache của Next.js trước khi build
    RUN rm -rf .next/cache

    # Chạy build
    RUN npm run build
    
    # Xóa cache npm để giảm dung lượng image
    RUN rm -rf ~/.npm
    
    
    # --- Giai đoạn Chạy ứng dụng ---
    FROM node:18-alpine AS runner
    
    # Thiết lập biến môi trường để tối ưu Node.js
    ENV NODE_ENV=production
    
    WORKDIR /app
    
    # Chỉ copy các file cần thiết từ builder
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/public ./public
    
    # Đặt quyền non-root để tăng bảo mật
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup
    USER appuser
    
    # Mở port 3002
    EXPOSE 3002
    
    # Chạy ứng dụng bằng next start thay vì npm run start
    CMD ["npx", "next", "start"]
    