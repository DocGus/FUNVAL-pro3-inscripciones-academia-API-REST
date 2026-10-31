import express from "express";
import type { ErrorRequestHandler } from "express";

// Rutas independientes del proyecto.
import librosRouter from "./Ejercicios/Eje1-libreria";
import productosRouter from "./Ejercicios/eje4-middleware";
import vehiculosRouter from "./Ejercicios/Eje2-flota_autos";
import pedidosRouter from "./Ejercicios/Eje3-pedidos_comida";
import estudiantesRouter from "./routes/estudiantes.routes";

// Documentación y CORS.
import swaggerUi from "swagger-ui-express";
import swaggerOutput from "../swagger_output.json";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ?? 3000;

// ==========================================
// MIDDLEWARE GLOBAL
// ==========================================

app.use(cors());
app.use(express.json());

// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: "API FUNVAL funcionando correctamente",
  });
});

// ==========================================
// RUTAS DE LA API
// ==========================================

app.use("/api/libros", librosRouter);
app.use("/api/productos", productosRouter);
app.use("/api/vehiculos", vehiculosRouter);
app.use("/api/pedidos", pedidosRouter);
app.use("/api/estudiantes", estudiantesRouter);
app.use("/api/students", estudiantesRouter);

// ==========================================
// DOCUMENTACIÓN SWAGGER
// ==========================================

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOutput));

// ==========================================
// MIDDLEWARE GLOBAL DE ERRORES
// ==========================================

const manejarErrores: ErrorRequestHandler = (
  error,
  _req,
  res,
  next
) => {
  // Si la respuesta ya empezó, dejamos que Express gestione el error.
  if (res.headersSent) {
    next(error);
    return;
  }

  // Identificamos el tipo de error.
  const tipoError =
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    typeof error.type === "string"
      ? error.type
      : undefined;

  // JSON mal formado: 400 Bad Request.
  if (tipoError === "entity.parse.failed") {
    res.status(400).json({
      ok: false,
      mensaje: "El cuerpo de la solicitud contiene JSON inválido.",
    });
    return;
  }

  // Cuerpo demasiado grande: 413 Content Too Large.
  if (tipoError === "entity.too.large") {
    res.status(413).json({
      ok: false,
      mensaje: "El cuerpo de la solicitud excede el tamaño permitido.",
    });
    return;
  }

  // Errores no previstos.
  console.error("Error interno al procesar la solicitud:", error);

  res.status(500).json({
    ok: false,
    mensaje: "Error interno del servidor.",
  });
};

app.use(manejarErrores);

// ==========================================
// INICIO DEL SERVIDOR
// ==========================================

app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});