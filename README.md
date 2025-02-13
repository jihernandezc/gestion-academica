## Sistema de Gestión de Estudiantes, Cursos y Matrículas

Este es un sistema de gestión desarrollado con NestJS, Prisma y una interfaz frontend en React.js. Permite gestionar estudiantes, cursos y las matrículas de los estudiantes en los cursos, todo conectado a bases de datos PostgreSQL.

## Tecnologías Utilizadas

**Backend**

NestJS: Framework de Node.js para la creación de aplicaciones escalables y eficientes.

Prisma: ORM para interactuar con las bases de datos PostgreSQL.

PostgreSQL: Base de datos relacional.

Yarn: Gestor de paquetes utilizado en el proyecto.

**Frontend**

React.js: Biblioteca de JavaScript para construir interfaces de usuario.

Material-UI: Biblioteca para componentes UI responsivos y fáciles de usar.

## Instalación

**Backend (NestJS)** 

- Clona el repositorio:

git clone <URL_DEL_REPOSITORIO>

- Accede al directorio del backend:

cd backend

- Copia el archivo de variables de entorno:

cp .env.example .env

- Instala las dependencias:

npm install
hacerlo en la raiz del proyecto y en cada microservicio incluyendo el frontend.

- Configura tus bases de datos en PostgreSQL. Asegúrate de que el archivo .env esté correctamente configurado con las credenciales de conexión.

- Ejecuta las migraciones de Prisma con el siguiente comando:

npx prisma migrate dev --name init

- Construir y levantar los contenedores:

docker-compose build
docker compose up


### Los microservicios estarán disponibles en las siguientes direcciones:

http://localhost:3000 para la gestión de estudiantes.

http://localhost:3001 para la gestión de cursos.

http://localhost:3002 para la gestión de matrículas.

**Frontend (React.js)**

- Accede al directorio del frontend:

cd frontend

- Instala las dependencias:

yarn install

- Inicia el servidor de desarrollo:

yarn run dev

### El frontend estará disponible en http://localhost:5173.

## Estructura del API Gateway

El API Gateway expone los siguientes endpoints para interactuar con los microservicios de cursos, estudiantes y matrículas.

### Rutas de Cursos

- **GET `/count/courses`** - Retorna el número total de cursos.
- **GET `/courses`** - Obtiene la lista de todos los cursos.
- **GET `/courses/:id`** - Obtiene un curso por su ID.
- **POST `/courses`** - Crea un nuevo curso.
- **PUT `/courses/update/:id`** - Actualiza un curso por su ID.
- **DELETE `/courses/:id`** - Elimina un curso por su ID.
- **GET `/courses/search/:name`** - Busca cursos por nombre.
- **GET `/courses/available-count/:courseId`** - Obtiene la cantidad de plazas disponibles en un curso.
- **GET `/courses/assigned/count`** - Obtiene el número de estudiantes asignados a cursos.
- **GET `/coursesName/assigned/count`** - Obtiene el número de estudiantes asignados junto con los nombres de los cursos.

### Rutas de Matrículas

- **GET `/enrollments`** - Obtiene todas las matrículas.
- **GET `/enrollments/:id`** - Obtiene una matrícula por ID.
- **POST `/enrollments`** - Crea una matrícula.
- **PUT `/enrollments/update/:id`** - Actualiza una matrícula.
- **DELETE `/enrollments/:id`** - Elimina una matrícula.
- **GET `/assigned/students`** - Obtiene la cantidad total de estudiantes asignados.
- **GET `/unassigned/students`** - Obtiene la cantidad de estudiantes no asignados a cursos.

### Rutas de Estudiantes

- **GET `/students`** - Obtiene todos los estudiantes.
- **GET `/count/students`** - Obtiene el número total de estudiantes.
- **GET `/students/multiple/by-ids?ids=1,2,3`** - Obtiene varios estudiantes por sus IDs.
- **GET `/students/find/:id`** - Obtiene un estudiante por su ID.
- **POST `/students`** - Crea un estudiante.
- **PUT `/students/update/:id`** - Actualiza un estudiante.
- **DELETE `/students/:id`** - Elimina un estudiante.
- **GET `/students/search/:name`** - Busca estudiantes por nombre o apellido.

## Ejecución del Proyecto

Ejecuta el backend con el siguiente comando:

```sh
yarn start:dev
```

El frontend se ejecuta en el puerto 5173 por defecto:

```sh
yarn dev
```

