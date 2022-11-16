const router = require("express").Router();

const autenticacionMiddleware = require("../middleware/autenticacion");

const { validadorCrear } = require("../validator/conceptosFactura");

const {
  conseguirConceptosFactura,
  crearConceptosFactura,
  actualizarConceptosFactura,
} = require("../controller/conceptosFactura");

// Llevo a cabo la validación con express-validator
router.get("/", autenticacionMiddleware, conseguirConceptosFactura);
router.post(
  "/",
  autenticacionMiddleware,
  validadorCrear,
  crearConceptosFactura
);
router.patch(
  "/:conceptosFacturaId",
  autenticacionMiddleware,
  validadorCrear,
  actualizarConceptosFactura
);

module.exports = router;
