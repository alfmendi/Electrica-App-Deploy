const router = require("express").Router();

const { validadorLogin, validadorRegistro } = require("../validator/auth");
const { login, registro } = require("../controller/auth");

// Llevo a cabo la validación con express-validator
// He optado por esta opción y no por dejar que mongoose haga la valicación
// porque el password se usa antes de llevar a cabo la validación con mongoose
// (se usa con bcryptjs)
router.post("/login", validadorLogin, login);
router.post("/registro", validadorRegistro, registro);

module.exports = router;
