# FUNVAL Pro 3 — API REST con TypeScript y Express

## Descripción del proyecto

Este repositorio contiene el proyecto semanal de FUNVAL, enfocado en el desarrollo de una API REST utilizando **Node.js, TypeScript y Express**.

Además del ejercicio principal de inscripciones académicas, se incorporan los ejercicios prácticos de la guía semanal dentro de la carpeta `src/Ejercicios/`.

El objetivo es mantener cada ejercicio organizado en su propio archivo y permitir que sus funcionalidades se ejecuten desde el servidor principal.

## Tecnologías utilizadas

- Node.js
- TypeScript
- Express
- tsx
- Git y GitHub

## Estructura del proyecto

```text
.
├── README.md
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts
    ├── routes/
    │   └── estudiantes.routes.ts
    ├── Index1_lunes.ts
    ├── Index_comentado_lunes.ts
    └── Ejercicios/
        ├── Eje1-libreria.ts
        ├── Eje2-flota_autos.ts
        ├── Eje3-pedidos_comida.ts
        ├── eje4-middleware.ts
        └── Guia.md
```

### Responsabilidad de los archivos

- **`src/index.ts`**: punto de entrada de la aplicación. Configura Express y registra los routers de estudiantes y de los ejercicios.
- **`src/routes/estudiantes.routes.ts`**: router Express para el CRUD de estudiantes, filtrado por bootcamp y validación de datos.
- **`src/Index_comentado_lunes.ts`**: versión comentada del ejercicio principal, utilizada como material de estudio.
- **`src/Ejercicios/Eje1-libreria.ts`**: API REST para gestionar una biblioteca digital.
- **`src/Ejercicios/Eje2-flota_autos.ts`**: API REST para gestionar vehículos de una flota.
- **`src/Ejercicios/Eje3-pedidos_comida.ts`**: API REST para gestionar pedidos de comida.
- **`src/Ejercicios/eje4-middleware.ts`**: API de productos con validación de datos y control de roles para los borrados.
- **`src/Ejercicios/Guia.md`**: guía de referencia para los ejercicios.

## Integración de los ejercicios

Los ejercicios se incorporan al proyecto mediante el mecanismo de **enrutamiento modular de Express**.

El archivo principal importa los routers de cada ejercicio:

```typescript
import librosRouter from "./Ejercicios/Eje1-libreria";
import vehiculosRouter from "./Ejercicios/Eje2-flota_autos";
import pedidosRouter from "./Ejercicios/Eje3-pedidos_comida";
import productosRouter from "./Ejercicios/eje4-middleware";
import estudiantesRouter from "./routes/estudiantes.routes";
```

Después los registra en la aplicación:

```typescript
app.use("/api/libros", librosRouter);
app.use("/api/vehiculos", vehiculosRouter);
app.use("/api/pedidos", pedidosRouter);
app.use("/api/productos", productosRouter);
app.use("/api/estudiantes", estudiantesRouter);
```

Las rutas de estudiantes se definen en `src/routes/estudiantes.routes.ts` de forma relativa al router (`/`, `/:id`) y quedan disponibles bajo `/api/estudiantes`. Los demás endpoints quedan disponibles bajo el prefijo indicado en cada llamada a `app.use`.

**Ventaja:** todas las funcionalidades comparten el mismo servidor, pero mantienen separada la lógica de cada ejercicio y sus endpoints.

## Ejercicio principal: Inscripciones académicas

El sistema permite gestionar estudiantes mediante operaciones CRUD.

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/estudiantes` | Listar todos los estudiantes |
| GET | `/api/estudiantes?bootcamp=Frontend` | Filtrar por bootcamp (sin distinguir mayúsculas/minúsculas) |
| GET | `/api/estudiantes/:id` | Consultar estudiante por ID |
| POST | `/api/estudiantes` | Registrar estudiante |
| PUT | `/api/estudiantes/:id` | Actualizar estudiante |
| DELETE | `/api/estudiantes/:id` | Eliminar estudiante |

Cada estudiante contiene `id`, `nombre`, `email` y `bootcamp`. El `id` se genera automáticamente y los registros se almacenan temporalmente en un arreglo en memoria, inicialmente vacío; se pierden al reiniciar el servidor. Para crear o actualizar un estudiante, `nombre`, `email` y `bootcamp` son obligatorios y deben ser textos no vacíos. Los IDs deben ser enteros positivos; los datos inválidos y los IDs no válidos responden `400 Bad Request`, mientras que un estudiante inexistente responde `404 Not Found`.

## Ejercicio 1: Biblioteca digital

La API administra un catálogo de libros con los siguientes campos:

- `id`: identificador numérico.
- `titulo`: título del libro.
- `autor`: nombre del autor.
- `paginas`: cantidad de páginas.
- `disponible`: disponibilidad del libro.

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/libros` | Listar libros |
| GET | `/api/libros/:id` | Consultar libro por ID |
| POST | `/api/libros` | Registrar libro |
| PUT | `/api/libros/:id` | Actualizar libro |
| DELETE | `/api/libros/:id` | Eliminar libro |

La biblioteca utiliza un arreglo en memoria con tres registros iniciales.

## Ejercicio 2: Gestión de flota de vehículos

La API administra vehículos con los campos `id`, `placa`, `modelo`, `kilometraje` y `estado`. El estado puede ser `activo` o `mantenimiento`. Inicia con tres vehículos de ejemplo y almacena los cambios en memoria.

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/vehiculos` | Listar vehículos |
| GET | `/api/vehiculos/:id` | Consultar vehículo por ID |
| POST | `/api/vehiculos` | Registrar vehículo |
| PUT | `/api/vehiculos/:id` | Reemplazar los datos de un vehículo |
| DELETE | `/api/vehiculos/:id` | Dar de baja un vehículo |

Para POST y PUT, enviar los campos `placa`, `modelo`, `kilometraje` y `estado` en el cuerpo JSON.

## Ejercicio 3: Gestión de pedidos de comida

La API administra pedidos con los campos `id`, `cliente`, `platillo`, `total` y `entregado`. Inicia con tres pedidos de ejemplo y almacena los cambios en memoria.

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/pedidos` | Listar pedidos |
| GET | `/api/pedidos/:id` | Consultar pedido por ID |
| POST | `/api/pedidos` | Crear pedido |
| PUT | `/api/pedidos/:id` | Reemplazar los datos de un pedido |
| DELETE | `/api/pedidos/:id` | Cancelar pedido |

Para POST y PUT, enviar los campos `cliente`, `platillo`, `total` y `entregado` en el cuerpo JSON.

## Taller: Middlewares y gestión de productos

El archivo `src/Ejercicios/eje4-middleware.ts` exporta un router para gestionar productos. Cada producto tiene los siguientes campos:

- `id`: identificador numérico generado por la API.
- `nombre`: nombre del producto.
- `precio`: precio, debe ser un número mayor a cero.
- `stock`: cantidad disponible.
- `activo`: indica si el producto está activo.

Los datos se guardan en un arreglo en memoria que comienza con tres productos. El middleware `validarProducto` se aplica a POST y PUT y comprueba que:

- `nombre` sea texto no vacío.
- `precio` sea un número finito mayor a cero.
- `stock` sea un número entero mayor o igual a cero.
- `activo`, si se envía, sea booleano.

Al crear un producto, `activo` toma el valor `true` si no se envía. En una actualización PUT, si se omite `activo`, se conserva el valor actual.

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/productos` | Listar productos activos |
| GET | `/api/productos/:id` | Consultar un producto activo por ID |
| POST | `/api/productos` | Crear un producto |
| PUT | `/api/productos/:id` | Actualizar un producto activo |
| PATCH | `/api/productos/soft/:id` | Desactivar un producto (requiere rol MODERADOR o ADMIN) |
| DELETE | `/api/productos/hard/:id` | Eliminar definitivamente un producto (requiere rol ADMIN) |

Los roles se simulan leyendo la cabecera `x-rol`. Esto sirve para practicar middleware y autorización por roles, pero **no es autenticación real**: cualquier cliente puede enviar esa cabecera y declararse ADMIN. En una aplicación real, el servidor debe verificar la identidad del usuario y obtener sus permisos desde una fuente confiable, por ejemplo una sesión validada o un token verificado; no debe confiar en el rol enviado directamente por el cliente.

La aplicación también registra un middleware global de errores. Si el cuerpo de una solicitud contiene JSON malformado, responde `400` con un mensaje JSON; si excede el tamaño permitido, responde `413`. Los errores inesperados se registran en la consola y reciben una respuesta `500` genérica.

## Configuración e instalación

Desde la raíz del repositorio, instalar las dependencias:

```bash
npm install
```

## Ejecución del servidor

Para iniciar la aplicación en modo desarrollo:

```bash
npm run dev
```

Para compilar TypeScript y ejecutar la versión compilada:

```bash
npm run build
npm start
```

El servidor utiliza el puerto `3000`.

Dirección base:

```text
http://localhost:3000
```

No es necesario iniciar un servidor independiente para cada ejercicio integrado.

## Pruebas de funcionamiento

Con el servidor en ejecución, abrir una segunda terminal.

### 1. Comprobar la API de estudiantes

Inicia el servidor con `npm run dev` y ejecuta las consultas desde otra terminal.

Consultar la lista completa de estudiantes:

```bash
curl -i http://localhost:3000/api/estudiantes
```

Consultar un estudiante específico:

```bash
curl -i http://localhost:3000/api/estudiantes/1
```

Filtrar estudiantes por bootcamp (la comparación no distingue mayúsculas/minúsculas):

```bash
curl -i "http://localhost:3000/api/estudiantes?bootcamp=Frontend"
```

Registrar un estudiante. Los campos `nombre`, `email` y `bootcamp` son obligatorios:

```bash
curl -i -X POST http://localhost:3000/api/estudiantes \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Gustavo Andres","email":"gus@example.com","bootcamp":"Node.js"}'
```

Actualizar un estudiante existente (en este ejemplo, el ID `1`). El PUT requiere enviar los tres campos:

```bash
curl -i -X PUT http://localhost:3000/api/estudiantes/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Carlos Mendoza","email":"carlos@example.com","bootcamp":"TypeScript"}'
```

### 2. Comprobar la API de biblioteca

```bash
curl -i http://localhost:3000/api/libros
```

Consultar un libro específico:

```bash
curl -i http://localhost:3000/api/libros/1
```

Registrar un libro:

```bash
curl -i -X POST http://localhost:3000/api/libros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"La sombra del viento","autor":"Carlos Ruiz Zafón","paginas":576,"disponible":true}'
```

Actualizar un libro existente (en este ejemplo, el ID `1`):

```bash
curl -i -X PUT http://localhost:3000/api/libros/1 \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Cien años de soledad","autor":"Gabriel García Márquez","paginas":471,"disponible":false}'
```

Una respuesta `HTTP 200 OK` confirma que una consulta GET o una actualización PUT fue atendida correctamente. Las operaciones POST exitosas responden `HTTP 201 Created`. El endpoint DELETE también está disponible para probar la eliminación de registros.

### 3. Comprobar las APIs de vehículos y pedidos

Listar vehículos y consultar un vehículo por ID:

```bash
curl -i http://localhost:3000/api/vehiculos
curl -i http://localhost:3000/api/vehiculos/1
```

Registrar un vehículo:

```bash
curl -i -X POST http://localhost:3000/api/vehiculos \
  -H "Content-Type: application/json" \
  -d '{"placa":"GUS-123","modelo":"Toyota Hiace","kilometraje":12000,"estado":"activo"}'
```

Listar pedidos y consultar un pedido por ID:

```bash
curl -i http://localhost:3000/api/pedidos
curl -i http://localhost:3000/api/pedidos/1
```

Crear un pedido:

```bash
curl -i -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"cliente":"Gustavo Andres","platillo":"Hamburguesa clásica","total":120,"entregado":false}'
```

## Pruebas de los Breakout Rooms: Middlewares en Express

Las pruebas se ejecutan contra el servidor principal de FUNVAL, en el puerto `3000`, usando la base `/api/productos`. Los dos breakout rooms están reunidos en el router de productos.

### Preparación

Desde la raíz del repositorio, ejecuta:

```bash
npm run build
npm run dev
```

Deja el servidor en ejecución y usa una segunda terminal para los comandos `curl`. Los productos se guardan en memoria; al reiniciar el servidor se recuperan los tres registros iniciales. Para ejecutar la secuencia completa desde un estado conocido, reinicia el servidor antes de empezar. Ejecuta las pruebas en el orden mostrado: algunas cambian o eliminan productos.

### Breakout Room 1: Validación de datos

`POST` y `PUT` requieren `nombre` no vacío, `precio` numérico finito mayor a cero y `stock` entero mayor o igual a cero. `activo` es opcional, pero si se envía debe ser booleano.

| # | Prueba | Resultado esperado |
|---:|---|---|
| 1 | `GET /api/productos` | `200 OK`, lista los productos activos |
| 2 | `GET /api/productos/1` | `200 OK`, devuelve el producto activo |
| 3 | `GET /api/productos/abc` | `400 Bad Request`, ID inválido |
| 4 | `GET /api/productos/999` | `404 Not Found`, producto inexistente |
| 5 | POST con `{}` | `400 Bad Request`, nombre obligatorio |
| 6 | POST sin nombre | `400 Bad Request` |
| 7 | POST con nombre vacío o espacios | `400 Bad Request` |
| 8 | POST con precio `0` o negativo | `400 Bad Request` |
| 9 | POST con precio enviado como texto | `400 Bad Request` |
| 10 | POST con stock enviado como texto, negativo o decimal | `400 Bad Request` |
| 11 | POST con `activo` enviado como texto | `400 Bad Request` |
| 12 | POST con datos válidos | `201 Created` |
| 13 | PUT de producto existente con datos válidos | `200 OK` |
| 14 | PUT con nombre vacío, precio inválido, stock inválido o `activo` no booleano | `400 Bad Request` |
| 15 | PUT de producto inexistente con datos válidos | `404 Not Found` |

Ejecuta las consultas y validaciones:

```bash
# 1. Listar productos activos (200)
curl -i http://localhost:3000/api/productos

# 2. Consultar producto activo (200)
curl -i http://localhost:3000/api/productos/1

# 3. ID inválido (400)
curl -i http://localhost:3000/api/productos/abc

# 4. Producto inexistente (404)
curl -i http://localhost:3000/api/productos/999

# 5. Cuerpo vacío (400)
curl -i -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{}'

# 6. Nombre omitido (400)
curl -i -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"precio":600,"stock":10}'

# 7. Nombre vacío o solo espacios (400)
curl -i -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"   ","precio":600,"stock":10}'

# 8. Precio cero o negativo (400)
curl -i -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Audífonos","precio":0,"stock":10}'
curl -i -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Audífonos","precio":-50,"stock":10}'

# 9. Precio enviado como texto (400)
curl -i -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Audífonos","precio":"600","stock":10}'

# 10. Stock inválido: texto, negativo o decimal (400)
curl -i -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Audífonos","precio":600,"stock":"10"}'
curl -i -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Audífonos","precio":600,"stock":-1}'
curl -i -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Audífonos","precio":600,"stock":1.5}'

# 11. Activo enviado como texto (400)
curl -i -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Audífonos","precio":600,"stock":10,"activo":"true"}'

# 12. Crear producto válido (201); activo es opcional
curl -i -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Audífonos","precio":600,"stock":10,"activo":true}'

# 13. Actualizar producto existente (200)
curl -i -X PUT http://localhost:3000/api/productos/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Teclado profesional","precio":1200,"stock":8,"activo":true}'

# 14. Actualizar con nombre vacío (400)
curl -i -X PUT http://localhost:3000/api/productos/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"","precio":1200,"stock":8,"activo":true}'

# También puedes probar PUT con valores inválidos de precio, stock o activo
# usando los mismos cuerpos inválidos anteriores y cambiando POST por PUT
# y agregando /1 al endpoint.

# 15. Actualizar producto inexistente con datos válidos (404)
curl -i -X PUT http://localhost:3000/api/productos/999 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Producto nuevo","precio":100,"stock":1,"activo":true}'
```

### Breakout Room 2: Control de roles y eliminación

El borrado lógico requiere `MODERADOR` o `ADMIN`; el borrado definitivo requiere exclusivamente `ADMIN`.

| # | Prueba | Resultado esperado |
|---:|---|---|
| 16 | Soft Delete sin rol | `403 Forbidden` |
| 17 | Soft Delete con rol `USUARIO` | `403 Forbidden` |
| 18 | Soft Delete con rol `MODERADOR` | `200 OK`, desactiva el producto |
| 19 | Soft Delete con rol `ADMIN` | `200 OK`, desactiva el producto |
| 20 | Repetir Soft Delete de un producto inactivo | `400 Bad Request` |
| 21 | Soft Delete con ID inválido y rol permitido | `400 Bad Request` |
| 22 | Hard Delete sin rol | `403 Forbidden` |
| 23 | Hard Delete con rol `MODERADOR` | `403 Forbidden` |
| 24 | Hard Delete con rol `ADMIN` | `200 OK`, elimina el producto |
| 25 | Hard Delete con ID inválido y `ADMIN` | `400 Bad Request` |
| 26 | Hard Delete de producto inexistente y `ADMIN` | `404 Not Found` |

Ejecuta las pruebas en este orden, usando los productos iniciales `1` y `2`:

```bash
# 16. Soft Delete sin rol (403)
curl -i -X PATCH http://localhost:3000/api/productos/soft/1

# 17. Soft Delete con rol no permitido (403)
curl -i -X PATCH http://localhost:3000/api/productos/soft/1 \
  -H "x-rol: USUARIO"

# 18. Soft Delete con MODERADOR (200); el producto 1 queda inactivo
curl -i -X PATCH http://localhost:3000/api/productos/soft/1 \
  -H "x-rol: MODERADOR"

# 20. Repetir Soft Delete del producto 1 (400)
curl -i -X PATCH http://localhost:3000/api/productos/soft/1 \
  -H "x-rol: MODERADOR"

# 21. ID inválido con rol permitido (400)
curl -i -X PATCH http://localhost:3000/api/productos/soft/abc \
  -H "x-rol: MODERADOR"

# 19. Soft Delete con ADMIN (200); el producto 2 queda inactivo
curl -i -X PATCH http://localhost:3000/api/productos/soft/2 \
  -H "x-rol: ADMIN"

# 22. Hard Delete sin rol (403)
curl -i -X DELETE http://localhost:3000/api/productos/hard/2

# 23. Hard Delete con MODERADOR (403)
curl -i -X DELETE http://localhost:3000/api/productos/hard/2 \
  -H "x-rol: MODERADOR"

# 24. Hard Delete con ADMIN (200); también puede eliminar un inactivo
curl -i -X DELETE http://localhost:3000/api/productos/hard/2 \
  -H "x-rol: ADMIN"

# 25. ID inválido con ADMIN (400)
curl -i -X DELETE http://localhost:3000/api/productos/hard/abc \
  -H "x-rol: ADMIN"

# 26. Producto inexistente con ADMIN (404)
curl -i -X DELETE http://localhost:3000/api/productos/hard/999 \
  -H "x-rol: ADMIN"
```

### Middleware global de errores

El parser JSON de Express rechaza los cuerpos malformados antes de que lleguen a las rutas. El middleware global convierte ese error en una respuesta JSON `400`:

```bash
curl -i -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  --data-binary '{"nombre":'
```

Se espera `400 Bad Request` con el mensaje `El cuerpo de la solicitud contiene JSON inválido.`. Los cuerpos que exceden el límite configurado reciben `413 Payload Too Large`.

### Consideraciones de las pruebas

- Los datos viven en un arreglo en memoria; reiniciar el servidor restaura los tres productos iniciales.
- Soft Delete cambia `activo` a `false` y conserva el registro; Hard Delete elimina el registro del arreglo.
- Las consultas GET solo muestran productos activos.
- La validación comprueba `nombre`, `precio`, `stock` y el tipo de `activo` cuando se envía.
- `x-rol` es solo didáctico; cualquier cliente puede enviar esa cabecera. En producción, los permisos deben depender de una identidad autenticada y verificada por el servidor.

## Compilación de TypeScript

Para comprobar que el código compila:

```bash
npm run build
```

Si la compilación termina sin errores, TypeScript habrá generado los archivos JavaScript de salida según la configuración de `tsconfig.json`.

## Consideraciones

- Los ejercicios utilizan arreglos en memoria, no una base de datos persistente.
- Los cambios realizados mediante POST, PUT, PATCH y DELETE se pierden cuando se reinicia el servidor.
- Los ejercicios de vehículos y pedidos ya están integrados bajo `/api/vehiculos` y `/api/pedidos`.
- `Index_comentado_lunes.ts` es material de referencia; el servidor de desarrollo ejecuta `src/index.ts`.

## Objetivo de aprendizaje

Practicar la creación de APIs REST con TypeScript y Express, implementar operaciones CRUD, organizar módulos independientes e integrarlos mediante Express Router en una aplicación backend común.
