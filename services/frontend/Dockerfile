# --- Giai đoạn Build ---
    FROM node:18-alpine AS builder

    # Thiết lập thư mục làm việc
    WORKDIR /app
    
    # Sao chép package.json và package-lock.json để tối ưu caching
    COPY package*.json ./
    
    # Cài đặt chỉ dependencies cho production
    RUN npm ci --legacy-peer-deps
    
    # Sao chép toàn bộ mã nguồn vào container
    COPY . .
    
    # Chạy build
    RUN npm run build
    
    # Loại bỏ các package dev để giảm dung lượng
    RUN npm prune --production
    
    
    # --- Giai đoạn Chạy ứng dụng (Tạo image nhẹ hơn) ---
    FROM node:18-alpine AS runner
    
    # Thiết lập biến môi trường để tối ưu Node.js
    ENV NODE_ENV=production
    
    WORKDIR /app
    
    # Chỉ copy các file cần thiết từ builder
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/public ./public
    
    # Mở port 3002
    EXPOSE 3002
    
    # Chạy ứng dụng
    CMD ["npm", "run", "start"]
    