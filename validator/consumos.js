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

const datosConsumo = body(
  "datosConsumo",
  "Datos de consumo debe ser un array no vacío"
).isArray({
  min: 24,
  max: 24,
});

// Validador para comprobar que los campos enviados en el proceso de creación son válidos
const validadorModificar = [datosConsumo, comprobadorErrores];

const validador = {
  validadorModificar,
};

module.exports = validador;
