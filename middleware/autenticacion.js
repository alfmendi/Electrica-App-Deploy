let colors = require("colors");

// text colors
// black
// red
// green
// yellow
// blue
// magenta
// cyan
// white
// gray
// grey

const jwt = require("jsonwebtoken");

const ErrorAPIPropio = require("../error/ErrorAPIPropio");

const Empleado = require("../model/empleado");

const autenticacionMiddleware = async (req, res, next) => {
  // console.log("");
  // console.log("-------------------------------------------------".gray);
  // console.log("-------COMIENZO DE AUTENTICACIONMIDDLEWARE-------".gray);
  // console.log(
  //   ("req.headers.authorization vale..." + req.headers.authorization).gray
  // );
  // console.log("---------FIN DE AUTENTICACIONMIDDLEWARE----------".gray);
  // console.log("-------------------------------------------------".gray);
  // console.log("");
  try {
    const autorizacion = req.headers.authorization;
    if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }
    const token = autorizacion.split(" ")[1];
    const tokenDecodificado = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRETO
    );
    if (!tokenDecodificado) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }
    const empleado = await Empleado.findById(tokenDecodificado.empleadoId);
    req.empleado = empleado.id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = autenticacionMiddleware;
