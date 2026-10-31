
import { Router } from "express";
import type { Request, Response } from "express";

// Router independiente para todas las operaciones de estudiantes.
const estudiantesRouter = Router();

// Modelo de datos del backend.
interface Estudiante {
  id: number;
  nombre: string;
  email: string;
  bootcamp: string;
}

// Arreglo en memoria compartido por todos los endpoints.
const listaEstudiantes: Estudiante[] = [];

// Generador de IDs automáticos.
let siguienteId = 1;

// Validamos los datos recibidos.
// Aceptamos "nombre" del backend o "name" de Netlify.
function validarEstudiante(body: unknown): string | null {
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return "El cuerpo debe ser un objeto JSON.";
  }

  const datos = body as Record<string, unknown>;
  const nombre = datos.nombre ?? datos.name;

  if (
    typeof nombre !== "string" ||
    !nombre.trim()
  ) {
    return "El nombre es obligatorio y debe ser texto.";
  }

  if (
    typeof datos.email !== "string" ||
    !datos.email.trim()
  ) {
    return "El email es obligatorio y debe ser texto.";
  }

  if (
    typeof datos.bootcamp !== "string" ||
    !datos.bootcamp.trim()
  ) {
    return "El bootcamp es obligatorio y debe ser texto.";
  }

  return null;
}

// Normalizamos los datos para trabajar internamente
// con "nombre", independientemente de si llega "name".
function normalizarEstudiante(body: unknown): Omit<Estudiante, "id"> {
  const datos = body as Record<string, unknown>;

  return {
    nombre: String(datos.nombre ?? datos.name).trim(),
    email: String(datos.email).trim(),
    bootcamp: String(datos.bootcamp).trim(),
  };
}

// Adaptamos la respuesta para que Netlify reciba "name".
function formatearEstudiante(estudiante: Estudiante) {
  return {
    ...estudiante,
    name: estudiante.nombre,
  };
}

// GET /api/estudiantes
// GET /api/estudiantes?bootcamp=Frontend
// Devuelve directamente un arreglo, como espera Netlify.
estudiantesRouter.get(
  "/",
  (req: Request, res: Response) => {
    // #swagger.tags = ['Estudiantes']
    // #swagger.summary = 'Obtener estudiantes'
    // #swagger.description = 'Devuelve todos los estudiantes registrados. Permite filtrar por nombre de bootcamp.'
    // #swagger.parameters['bootcamp'] = { in: 'query', description: 'Nombre del bootcamp para filtrar', type: 'string' }

    const bootcamp = req.query.bootcamp;

    let estudiantes = listaEstudiantes;

    if (typeof bootcamp === "string") {
      estudiantes = listaEstudiantes.filter(
        (estudiante) =>
          estudiante.bootcamp.toLowerCase() ===
          bootcamp.trim().toLowerCase()
      );
    }

    return res.status(200).json(
      estudiantes.map(formatearEstudiante)
    );
  }
);

// GET /api/estudiantes/:id
// Busca un estudiante por su ID.
estudiantesRouter.get(
  "/:id",
  (req: Request, res: Response) => {
    // #swagger.tags = ['Estudiantes']
    // #swagger.summary = 'Obtener estudiante por ID'
    // #swagger.description = 'Busca y devuelve un estudiante utilizando su ID.'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID del estudiante', required: true, type: 'integer' }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un número entero positivo.",
      });
    }

    const estudiante = listaEstudiantes.find(
      (item) => item.id === id
    );

    if (!estudiante) {
      return res.status(404).json({
        ok: false,
        mensaje: `El estudiante con ID ${id} no existe.`,
      });
    }

    return res.status(200).json({
      ok: true,
      data: formatearEstudiante(estudiante),
    });
  }
);

// POST /api/estudiantes
// Registra un estudiante.
estudiantesRouter.post(
  "/",
  (req: Request, res: Response) => {
    // #swagger.tags = ['Estudiantes']
    // #swagger.summary = 'Registrar estudiante'
    // #swagger.description = 'Registra un nuevo estudiante.'
    /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos del estudiante',
      required: true,
      schema: {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        bootcamp: 'Frontend'
      }
    } */

    const error = validarEstudiante(req.body);

    if (error) {
      return res.status(400).json({
        ok: false,
        mensaje: error,
      });
    }

    const datos = normalizarEstudiante(req.body);

    const nuevoEstudiante: Estudiante = {
      id: siguienteId++,
      ...datos,
    };

    listaEstudiantes.push(nuevoEstudiante);

    return res.status(201).json({
      ok: true,
      mensaje: "Estudiante registrado con éxito.",
      data: formatearEstudiante(nuevoEstudiante),
    });
  }
);

// PUT /api/estudiantes/:id
// Actualiza todos los campos del estudiante.
estudiantesRouter.put(
  "/:id",
  (req: Request, res: Response) => {
    // #swagger.tags = ['Estudiantes']
    // #swagger.summary = 'Actualizar estudiante'
    // #swagger.description = 'Actualiza los datos de un estudiante existente.'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID del estudiante', required: true, type: 'integer' }
    /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos actualizados del estudiante',
      required: true,
      schema: {
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        bootcamp: 'Backend'
      }
    } */

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un número entero positivo.",
      });
    }

    const indice = listaEstudiantes.findIndex(
      (item) => item.id === id
    );

    if (indice === -1) {
      return res.status(404).json({
        ok: false,
        mensaje: `El estudiante con ID ${id} no existe.`,
      });
    }

    const error = validarEstudiante(req.body);

    if (error) {
      return res.status(400).json({
        ok: false,
        mensaje: error,
      });
    }

    const datos = normalizarEstudiante(req.body);

    const estudianteActualizado: Estudiante = {
      id,
      ...datos,
    };

    listaEstudiantes[indice] = estudianteActualizado;

    return res.status(200).json({
      ok: true,
      mensaje: "Estudiante actualizado con éxito.",
      data: formatearEstudiante(estudianteActualizado),
    });
  }
);

// DELETE /api/estudiantes/:id
// Elimina el estudiante indicado.
estudiantesRouter.delete(
  "/:id",
  (req: Request, res: Response) => {
    // #swagger.tags = ['Estudiantes']
    // #swagger.summary = 'Eliminar estudiante'
    // #swagger.description = 'Elimina un estudiante utilizando su ID.'
    // #swagger.parameters['id'] = { in: 'path', description: 'ID del estudiante', required: true, type: 'integer' }

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El ID debe ser un número entero positivo.",
      });
    }

    const indice = listaEstudiantes.findIndex(
      (item) => item.id === id
    );

    if (indice === -1) {
      return res.status(404).json({
        ok: false,
        mensaje: `El estudiante con ID ${id} no existe.`,
      });
    }

    const estudianteEliminado = listaEstudiantes[indice]!;

    listaEstudiantes.splice(indice, 1);

    return res.status(200).json({
      ok: true,
      mensaje: "Estudiante eliminado con éxito.",
      data: formatearEstudiante(estudianteEliminado),
    });
  }
);

// Exportamos el router para registrarlo en src/index.ts.
export default estudiantesRouter;
