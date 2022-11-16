const router = require("express").Router();

const autenticacionMiddleware = require("../middleware/autenticacion");

const {
  validadorCrear,
  validadorModificar,
  validadorModificarPassword,
} = require("../validator/empleados");

const {
  conseguirEmpleados,
  conseguirEmpleado,
  crearEmpleado,
  modificarEmpleado,
  modificarPasswordEmpleado,
  eliminarEmpleado,
} = require("../controller/empleados");

// Llevo a cabo la validación con express-validator
// He optado por esta opción y no por dejar que mongoose haga la valicación
// porque el password se usa antes de llevar a cabo la validación con mongoose
// (se usa con bcryptjs)
router.get("/", autenticacionMiddleware, conseguirEmpleados);
router.get("/:empleadoId", autenticacionMiddleware, conseguirEmpleado);
router.post("/", autenticacionMiddleware, validadorCrear, crearEmpleado);
router.patch(
  "/:empleadoId",
  autenticacionMiddleware,
  validadorModificar,
  modificarEmpleado
);
router.patch(
  "/modificarPassword/:empleadoId",
  autenticacionMiddleware,
  validadorModificarPassword,
  modificarPasswordEmpleado
);
router.delete("/:empleadoId", autenticacionMiddleware, eliminarEmpleado);

module.exports = router;
