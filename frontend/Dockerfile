# Etapa de compilación
FROM node:18-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Elimina node_modules y package-lock.json si existen
RUN rm -rf node_modules package-lock.json

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Compila la aplicación con Vite
RUN npm run build

# Etapa final con Nginx
FROM nginx:alpine

# Copia los archivos de la build al servidor de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configuración personalizada de Nginx (opcional)
COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto en el que Nginx servirá la app
EXPOSE 80

# Inicia Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]