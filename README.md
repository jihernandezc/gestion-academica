## Sistema de Gestión de Estudiantes, Cursos y Matrículas

**Presentado por**
<ul>
  <li>Valentina Lujan Robledo</li>
  <li>Santiago Vanegas Vasquez</li>
  <li>Laura Ladino Gallego</li>
  <li>Jimena Hernandez Castillo</li>
</ul>

Este es un sistema de gestión desarrollado con NestJS, Prisma y una interfaz frontend en React.js. Permite gestionar estudiantes, cursos y las matrículas de los estudiantes en los cursos, todo conectado a bases de datos PostgreSQL.

## Tecnologías Utilizadas

**Backend**

NestJS: Framework de Node.js para la creación de aplicaciones escalables y eficientes.

Prisma: ORM para interactuar con las bases de datos PostgreSQL.

PostgreSQL: Base de datos relacional.

Npm: Gestor de paquetes utilizado en el proyecto.

**Frontend**

React.js: Biblioteca de JavaScript para construir interfaces de usuario.

Material-UI: Biblioteca para componentes UI responsivos y fáciles de usar.

## Instalación

**Backend (NestJS)** 

- Clona el repositorio:

git clone <https://github.com/jihernandezc/gestion-academica.git>

- Accede al directorio del backend:

cd apps y luego podras acceder a cada microservicio con cd (nombre del servicio)

- Crea los archivos de las variables de entorno:

  abre el archivo .env.exaple y sigue sus instrucciones 

- Instala las dependencias:

npm install
hacerlo en la raiz del proyecto y en cada microservicio incluyendo el frontend.

- Configura tus bases de datos en PostgreSQL. Asegúrate de que el archivo .env esté correctamente configurado con las credenciales de conexión.

- Ejecuta las migraciones de Prisma con el siguiente comando:

npx prisma migrate dev --name init

- Construir y levantar los contenedores:

docker-compose build
docker compose up

-Inserción de Datos de Ejemplo
Para poblar la base de datos con datos de ejemplo, puedes ejecutar los siguientes comandos SQL en tu PostgreSQL:
**Base de datos de Estudiantes**

INSERT INTO "Student" (name, lastName, email, phone, career) VALUES
('Ana', 'Martínez', 'ana.martinez@example.com', '555123456', 'Arquitectura'),
('Carlos', 'López', 'carlos.lopez@example.com', '555987654', 'Derecho'),
('Lucía', 'Fernández', 'lucia.fernandez@example.com', '555456789', 'Psicología'),
('Pedro', 'Ramírez', 'pedro.ramirez@example.com', '555789123', 'Ingeniería de Software'),
('Laura', 'García', 'laura.garcia@example.com', '555321654', 'Administración de Empresas');

**Base de datos de Cursos**

INSERT INTO "Course" (name, maxStudents, description, category) VALUES
('Física Cuántica', 20, 'Introducción a la mecánica cuántica', 'Ciencia'),
('Literatura Clásica', 15, 'Análisis de obras literarias clásicas', 'Humanidades'),
('Programación en JavaScript', 35, 'Desarrollo web con JavaScript', 'Tecnología'),
('Economía Global', 25, 'Principios de macro y microeconomía', 'Negocios'),
('Biología Molecular', 20, 'Estudio de la estructura y función de las biomoléculas', 'Ciencia');

**Base de datos de Matrículas**

INSERT INTO "Enrollment" (studentId, courseId, finalGrade, isAssigned) VALUES
(1, 3, 4.5, true),
(2, 5, NULL, false),
(3, 1, 3.5, true),
(4, 4, 1.6, true),
(5, 2, 4.0, true),
(1, 2, NULL, false),
(3, 4, NULL, false),
(5, 5, 3.8, true);

### Los microservicios estarán disponibles en las siguientes direcciones:

http://localhost:4000 puerto del api-gateway


**Frontend (React.js)**

- Accede al directorio del frontend:

cd frontend

- Instala las dependencias:

npm install

- Inicia el servidor de desarrollo:

npm run dev

### El frontend estará disponible en http://localhost:5173.

## Estructura del API Gateway

El API Gateway expone los siguientes endpoints para interactuar con los microservicios de cursos, estudiantes y matrículas.

# API Gateway

Este módulo centraliza el acceso a los microservicios de cursos, matrículas y estudiantes. A continuación se listan las rutas disponibles:

## Rutas de Cursos

- *GET* /count/courses  
  Retorna la cantidad total de cursos (usa COURSES_SERVICE para obtenerlos).

- *GET* /courses  
  Retorna todos los cursos (usa COURSES_SERVICE).

- *GET* /courses/:id  
  Obtiene un curso por su ID (usa COURSES_SERVICE).

- *POST* /courses  
  Crea un curso con la información enviada en el body (usa COURSES_SERVICE).

- *PUT* /courses/update/:id  
  Actualiza un curso según el ID, recibiendo datos en el body (usa COURSES_SERVICE).

- *DELETE* /courses/:id  
  Elimina un curso por ID (usa COURSES_SERVICE).

- *GET* /courses/search/:name  
  Busca cursos por nombre (usa COURSES_SERVICE).

- *GET* /courses/available-count/:courseId  
  Retorna los cupos disponibles de un curso (usa COURSES_SERVICE y ENROLLMENTS_SERVICE).

- *GET* /courses/assigned/count  
  Obtiene el total de asignaciones por curso (usa ENROLLMENTS_SERVICE).

- *GET* /coursesName/assigned/count  
  Igual que la anterior, pero además devuelve los nombres de los cursos consultados (usa COURSES_SERVICE y ENROLLMENTS_SERVICE).

## Rutas de Matrículas

- *GET* /enrollments  
  Lista todas las matrículas (usa ENROLLMENTS_SERVICE).

- *GET* /enrollments/:id  
  Obtiene una matrícula por ID (usa ENROLLMENTS_SERVICE).

- *POST* /enrollments  
  Crea una matrícula (usa ENROLLMENTS_SERVICE).

- *PUT* /enrollments/update/:id  
  Actualiza una matrícula según el ID, recibiendo datos en el body (usa ENROLLMENTS_SERVICE).

- *DELETE* /enrollments/:id  
  Elimina una matrícula por ID (usa ENROLLMENTS_SERVICE).

- *GET* /assigned/students  
  Retorna la cantidad total de estudiantes asignados (usa ENROLLMENTS_SERVICE).

- *GET* /unassigned/students  
  Muestra la cantidad de estudiantes que no están asignados a un curso (usa ENROLLMENTS_SERVICE).

## Rutas de Estudiantes

- *GET* /students  
  Retorna todos los estudiantes (usa STUDENTS_SERVICE).

- *GET* /count/students  
  Retorna la cantidad total de estudiantes (usa STUDENTS_SERVICE).

- *GET* /students/find/:id  
  Retorna el estudiante con el ID especificado (usa STUDENTS_SERVICE).

- *POST* /students  
  Crea un estudiante (usa STUDENTS_SERVICE).

- *PUT* /students/update/:id  
  Actualiza un estudiante por ID (usa STUDENTS_SERVICE).

- *DELETE* /students/:id  
  Elimina un estudiante por ID (usa STUDENTS_SERVICE).

- *GET* /students/search/:name  
  Busca estudiantes por nombre o apellido (usa STUDENTS_SERVICE).

## Ejecución del Proyecto - Docker

Ejecuta el docker

```sh
docker-compose build
```

```sh
docker-compose up
```

## Acceso a las URL

Acceder a la interfaz en la ruta http://localhost:5173/
En caso de necesitar directamete la api-gateway esta en http://localhost:4000/


