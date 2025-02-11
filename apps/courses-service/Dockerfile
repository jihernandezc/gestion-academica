# Etapa de compilación
FROM node:18-alpine AS builder

# Instala OpenSSL
RUN apk add --no-cache openssl

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm install --only=production --legacy-peer-deps

# Copia el resto de la aplicación
COPY . .

# Genera el cliente de Prisma
RUN npx prisma generate

# Compila la aplicación
RUN npm run build

# Etapa final
FROM node:18-alpine

# Instala OpenSSL
RUN apk add --no-cache openssl

# Establece el directorio de trabajo
WORKDIR /app

# Copia las dependencias de producción desde la etapa de compilación
COPY --from=builder /app/node_modules ./node_modules

# Copia los archivos compilados desde la etapa de compilación
COPY --from=builder /app/dist ./dist

# Copia también la carpeta de Prisma si es necesaria
COPY --from=builder /app/prisma ./prisma

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 4000

# Comando para ejecutar la aplicación
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]