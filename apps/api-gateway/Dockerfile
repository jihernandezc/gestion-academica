# Etapa de compilación
FROM node:18-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y el package-lock.json
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm install --only=production --legacy-peer-deps

# Copia el resto de la aplicación
COPY . .

# Compila la aplicación
RUN npm run build

# Etapa final
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia las dependencias de producción desde la etapa de compilación
COPY --from=builder /app/node_modules ./node_modules

# Copia los archivos compilados desde la etapa de compilación
COPY --from=builder /app/dist ./dist

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 4000

# Comando para ejecutar la aplicación
CMD ["node", "dist/main"]