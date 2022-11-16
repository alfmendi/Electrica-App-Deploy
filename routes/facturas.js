const router = require("express").Router();

const {
  conseguirNumeroFacturas,
  conseguirFacturasCliente,
} = require("../controller/facturas");

const autenticacionMiddleware = require("../middleware/autenticacion");

router.get("/", autenticacionMiddleware, conseguirNumeroFacturas);
router.get("/:clienteId", autenticacionMiddleware, conseguirFacturasCliente);

module.exports = router;
