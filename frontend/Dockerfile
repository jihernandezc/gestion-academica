# Etapa de compilación
FROM node:18-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de la aplicación
COPY . .

# Compila la aplicación
RUN npm run build

# Etapa final
FROM nginx:alpine

# Copia los archivos compilados desde la etapa de compilación
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia el archivo de configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 5173

# Comando para ejecutar Nginx
CMD ["nginx", "-g", "daemon off;"]