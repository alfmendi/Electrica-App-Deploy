const origenesPermitidos = require("../config/origenesPermitidos");

const credenciales = (req, res, next) => {
  const origin = req.headers.origin;
  if (origenesPermitidos.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

module.exports = credenciales;
