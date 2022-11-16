const { body, validationResult } = require("express-validator");

// Función que comprueba si existen errores de validación en el servidor empleando express-validator.
// En caso afirmativo, devuelve un objeto con los diferentes errores
const comprobadorErrores = (req, res, next) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next({ errors: errors.array({ onlyFirstError: true }) });
  }
  next();
};

const nombre = body("nombre", "Nombre está vacío")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape();

const tarifaBase = body("tarifaBase", "Tarifa base debe ser true o false")
  .trim()
  .isBoolean();

const descripcion = body("descripcion", "Descripción está vacía")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape();

const precioHoraNormal = body(
  "precioHoraNormal",
  "Precio Hora Normal está vacío"
)
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape();

const precioHoraNormalValor = body(
  "precioHoraNormal",
  "Precio Hora Normal debe ser mayor 0"
).isFloat({ min: 0 });

const precioHoraEspecial = body(
  "precioHoraEspecial",
  "Precio Hora Especial esta esta vacío"
)
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape();

const precioHoraEspecialValor = body(
  "precioHoraEspecial",
  "Precio Hora Especial debe ser mayor 0"
).isFloat({ min: 0 });

// Validador para comprobar que los campos enviados en el proceso de creación son válidos
const validadorCrear = [
  nombre,
  tarifaBase,
  descripcion,
  precioHoraNormal,
  precioHoraNormalValor,
  precioHoraEspecial,
  precioHoraEspecialValor,
  comprobadorErrores,
];

const validador = { validadorCrear };

module.exports = validador;
