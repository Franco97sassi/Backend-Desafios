# Entrega Proyecto Final - Backend CoderHouse - Comisión 51400

## Descripción del Proyecto

El proyecto permite a los usuarios una experiencia completa de compra de productos de un comercio electrónico, y un panel administrador para la gestión de productos y usuarios.

### Tecnologías y Conceptos Utilizados

- **Programación Sincrónica y Asincrónica:** Se implementa programación
  sincrónica y asincrónica para gestionar eficazmente las solicitudes
  de los usuarios y procesos de fondo, lo que mejora la velocidad y la
  eficiencia del sistema.
- **Express Avanzado y Router**: Se utiliza el framework Node.js Express
  para crear una API REST robusta. Se aplican enrutadores (Routers)
  para organizar y modularizar las rutas de la API.

- **Multer**: Para la carga de archivos, se emplea Multer, una librería de
  middleware que permite manejar fácilmente las subidas de archivos por
  parte de los usuarios.

- **Motores de Plantillas (Handlebars):** Handlebars se utiliza como motor
  de plantillas para la generación dinámica de páginas web en el
  frontend, permitiendo una interfaz de usuario flexible y altamente
  personalizable.

- **Websockets**: La tecnología de WebSockets se integra para habilitar la
  comunicación en tiempo real, como notificaciones en vivo y chat en
  línea.

- **MongoDB**: La base de datos NoSQL MongoDB se utiliza para almacenar
  información de productos, usuarios y pedidos, permitiendo una
  escalabilidad eficiente.

- **Cookies y Estrategias de Autenticación de Terceros**: Se implementan
  cookies para gestionar la autenticación y sesiones de usuario, además
  de estrategias de autenticación de terceros para permitir a los
  usuarios registrarse e iniciar sesión con sus cuentas de redes
  sociales.

- **Passport y JWT (JSON Web Tokens)**: Passport se emplea para simplificar
  la autenticación y autorización, mientras que los JWT se utilizan
  para generar tokens seguros y gestionar la autenticación de usuarios.

- **Arquitectura del Servidor**: El proyecto sigue una arquitectura modular
  y escalable para garantizar un mantenimiento sencillo y una
  escalabilidad sin problemas.

- **Servicio de Mailing**: Se integra un servicio de envío de correos
  electrónicos para notificaciones, confirmaciones de pedidos y otras
  comunicaciones con los usuarios.

- **Mocks**: Se crean mocks de datos para pruebas y desarrollo, lo que
  facilita la simulación de datos reales en un entorno de pruebas.

- **Swagger**: Se documenta la API REST utilizando Swagger para
  proporcionar una referencia clara de las rutas, parámetros y
  respuestas de la API.

- **Testing Avanzado**: Se implementa un sólido conjunto de pruebas
  unitarias y de integración para garantizar la calidad y la fiabilidad
  del código.

- **Logger**: Se utiliza un sistema de registro (logger) para rastrear y
  registrar eventos importantes en la aplicación, lo que facilita la
  detección y resolución de problemas.
- **Stripe**: Pasarela de pago.

Este proyecto eCommerce combina todas estas tecnologías y conceptos para proporcionar una plataforma de comercio electrónico sólida y eficiente que satisface las necesidades de los usuarios y los requisitos de negocio. Con una interfaz de usuario atractiva y una API REST potente, los usuarios pueden disfrutar de una experiencia de compra en línea fluida.

## Instalación
 
Para poder ejecutar el proyecto, debes tener instalado [Node.js](https://nodejs.org/)

1. Clonar el repositorio con el comando:

 > `git clone https://github.com/Franco97sassi/Backend-Desafios.git`
2. Abre el proyecto en la carpeta raíz y ejecutar en la terminal:

 > `npm i`
3. Para iniciar el servidor local y ver el proyecto
 ## Comandos del Proyecto

En este proyecto, se proporcionan varios comandos para gestionar y ejecutar la aplicación. Puedes utilizar estos comandos desde la línea de comandos utilizando `npm` o `yarn` según tu preferencia. A continuación, se describen los comandos disponibles:

- **Iniciar la Aplicación en Producción:**
> `npm start`
Este comando inicia la aplicación en un entorno de producción utilizando Node.js.

- **Iniciar la Aplicación en Modo de Desarrollo (con Nodemon):**
>  `npm run dev`
Utiliza este comando para iniciar la aplicación en modo de desarrollo con Nodemon. Este permite la recarga automática de la aplicación cuando se realizan cambios en el código fuente, lo que es útil durante el desarrollo.

- **Ejecutar Pruebas Unitarias:**
>`npm test`
Ejecuta este comando para realizar pruebas unitarias utilizando Mocha en el archivo `usersDAO.test.js`. El comando incluye un límite de tiempo de 10 segundos por prueba.

- **Ejecutar Pruebas de Integración (con límite de tiempo extendido):**
> `npm run supertest`
> Este comando se utiliza para ejecutar pruebas de integración utilizando Mocha en el archivo `supertest.test.js`. En este caso, se ha establecido un límite de tiempo extendido de 50 segundos por prueba. 