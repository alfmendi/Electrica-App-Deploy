const origenesPermitidos = require("./origenesPermitidos");

const opcionesCORS = {
  origin: (origin, callback) => {
    if (origenesPermitidos.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = opcionesCORS;
