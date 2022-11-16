const router = require("express").Router();

const autenticacionMiddleware = require("../middleware/autenticacion");

const { validadorCrear } = require("../validator/tarifas");

const {
  conseguirTarifas,
  conseguirTarifa,
  crearTarifa,
  modificarTarifa,
  eliminarTarifa,
} = require("../controller/tarifas");

// Llevo a cabo la validación con express-validator
router.get("/", autenticacionMiddleware, conseguirTarifas);
router.get("/:tarifaId", autenticacionMiddleware, conseguirTarifa);
router.post("/", autenticacionMiddleware, validadorCrear, crearTarifa);
router.patch(
  "/:tarifaId",
  autenticacionMiddleware,
  validadorCrear,
  modificarTarifa
);
router.delete("/:tarifaId", autenticacionMiddleware, eliminarTarifa);

module.exports = router;
