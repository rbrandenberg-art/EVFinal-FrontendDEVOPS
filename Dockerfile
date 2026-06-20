# ==========================================
# Etapa 1: Construcción (Build Stage) con Node
# ==========================================
FROM node:18-alpine AS builder
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código y construimos para producción
COPY . .
RUN npm run build

# ==========================================
# Etapa 2: Servidor Web (Run Stage) con Nginx
# ==========================================
FROM nginx:alpine

# Copiamos nuestra configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos la carpeta 'dist' generada por Vite hacia Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Exponemos el puerto 80 (el estándar web)
EXPOSE 80

# Comando para arrancar Nginx
CMD ["nginx", "-g", "daemon off;"]