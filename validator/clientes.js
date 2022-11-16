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

const dni = body("dni", "DNI no válido")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isLength({ min: 9, max: 9 })
  .matches(/^[0-9]{8}[a-zA-Z]{1}$/);

const nombre = body("nombre", "Nombre: Mínimo 3 caracteres")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isLength({ min: 3 });

const email = body("email", "Email no válido")
  .exists()
  .trim()
  .not()
  .isEmpty()
  .escape()
  .isEmail()
  .normalizeEmail();

const telefono = body("telefono", "Teléfono no válido")
  .not()
  .isEmpty()
  .trim()
  .escape()
  .isLength({ min: 9, max: 9 })
  .matches(/[0-9]{9}/);

const direccion = body("direccion", "Dirección no válida")
  .not()
  .isEmpty()
  .trim()
  .escape();

const localidad = body("localidad", "Localidad no válida")
  .not()
  .isEmpty()
  .trim()
  .escape();

const cups = body("cups", "CUPS no válido")
  .not()
  .isEmpty()
  .trim()
  .escape()
  .isLength({ min: 20, max: 20 })
  .matches(/^[Ee][Ss][0-9]{16}[a-zA-Z]{2}$/);

const potencia = body("potencia", "Potencia no válida (2.3 - 10.35)")
  .not()
  .isEmpty()
  .trim()
  .escape()
  .isFloat({ min: 2.3, max: 10.35 });

const tarifa = body("tarifa", "Tarifa no válida")
  .not()
  .isEmpty()
  .trim()
  .escape();

// Validador para comprobar que los campos enviados en el proceso de creación son válidos
const validadorCrear = [
  dni,
  nombre,
  email,
  telefono,
  direccion,
  localidad,
  cups,
  potencia,
  tarifa,
  comprobadorErrores,
];

const validador = {
  validadorCrear,
};

module.exports = validador;
