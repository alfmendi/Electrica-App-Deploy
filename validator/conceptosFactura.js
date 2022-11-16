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

const precioPotencia = body(
  "precioPotencia",
  "Precio Potencia debe ser mayor 0"
)
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isFloat({ min: 0 });

const impuestoElectricidad = body(
  "impuestoElectricidad",
  "Impuesto Electricidad debe ser mayor 0"
)
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isFloat({ min: 0 });

const alquilerEquipos = body(
  "alquilerEquipos",
  "Alquiler equipos debe ser mayor 0"
)
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isFloat({ min: 0 });

const iva = body("iva", "IVA debe ser mayor 0")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isFloat({ min: 0 });

// Validador para comprobar que los campos enviados en el proceso de creación son válidos
const validadorCrear = [
  precioPotencia,
  impuestoElectricidad,
  alquilerEquipos,
  iva,
  comprobadorErrores,
];

const validador = {
  validadorCrear,
};

module.exports = validador;
