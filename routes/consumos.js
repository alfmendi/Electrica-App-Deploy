const router = require("express").Router();

const autenticacionMiddleware = require("../middleware/autenticacion");

const {
  obtenerNumeroConsumos,
  obtenerConsumosCliente,
  numeroFicherosParaSerCargados,
  crearConsumos,
  almacenarFicheros,
  eliminarTodosConsumos,
} = require("../controller/consumos");

const { upload } = require("../util/almacenarFicheros");

const { validadorModificar } = require("../validator/consumos");

router.get("/", autenticacionMiddleware, obtenerNumeroConsumos);
router.get("/:clienteId", autenticacionMiddleware, obtenerConsumosCliente);
// A esta ruta le añado /numero para que cuando se envíe no confunda ficherosDatos con :clienteId
router.get(
  "/ficherosDatos/numero",
  autenticacionMiddleware,
  numeroFicherosParaSerCargados
);
router.post("/", autenticacionMiddleware, crearConsumos);
router.post(
  "/guardar",
  autenticacionMiddleware,
  upload.single("ficheros"),
  almacenarFicheros
);
router.patch("/:consumoId", autenticacionMiddleware, validadorModificar);
router.delete("/", autenticacionMiddleware, eliminarTodosConsumos);

module.exports = router;
