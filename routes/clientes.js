const router = require("express").Router();

const autenticacionMiddleware = require("../middleware/autenticacion");

const { validadorCrear } = require("../validator/clientes");

const {
  conseguirNumeroClientes,
  conseguirClientePorId,
  conseguirClientePorNombre,
  conseguirClientePorDni,
  crearCliente,
  modificarCliente,
  eliminarCliente,
} = require("../controller/clientes");

// Llevo a cabo la validación con express-validator
router.get("/", autenticacionMiddleware, conseguirNumeroClientes);
router.get("/:clienteId", autenticacionMiddleware, conseguirClientePorId);
router.get(
  "/nombre/:nombre",
  autenticacionMiddleware,
  conseguirClientePorNombre
);
router.get("/dni/:dni", autenticacionMiddleware, conseguirClientePorDni);
router.post("/", autenticacionMiddleware, validadorCrear, crearCliente);
router.patch(
  "/:clienteId",
  autenticacionMiddleware,
  validadorCrear,
  modificarCliente
);
router.delete("/:clienteId", autenticacionMiddleware, eliminarCliente);

module.exports = router;
