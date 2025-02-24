FROM nginx:alpine

# Copy template file thay vì copy trực tiếp default.conf
COPY conf.d/default.conf /etc/nginx/templates/default.conf

# Chạy envsubst để thay thế biến môi trường trước khi start Nginx
CMD ["sh", "-c", "envsubst '$$PORT_BACKEND $$PORT_FRONTEND $$DOMAIN_NAME' < /etc/nginx/templates/default.conf > /etc/nginx/conf.d/default.conf && cat /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
