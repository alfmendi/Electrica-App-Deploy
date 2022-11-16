const jwt = require("jsonwebtoken");

const Empleado = require("../model/empleado");

const ErrorAPIPropio = require("../error/ErrorAPIPropio");

// ---------------------------------------------------
// Función para refrescar el Access Token que emplea -
// el cliente para hacer las peticiones al servidor  -
// ---------------------------------------------------
const refrescarAccessToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }
    const refreshToken = cookies.jwt;
    const empleado = await Empleado.findOne({ refreshToken });
    if (!empleado) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }
    const tokenDecodificado = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRETO
    );
    if (
      !tokenDecodificado ||
      tokenDecodificado.empleadoId !== empleado.id.toString()
    ) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }
    // Genero el accessToken
    const accessToken = jwt.sign(
      { empleadoId: empleado.id },
      process.env.JWT_ACCESS_TOKEN_SECRETO,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRACION }
    );

    return res.status(200).json({
      empleadoId: empleado.id,
      nombre: empleado.nombre,
      esAdmin: empleado.esAdmin,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------------------------------------------
// Función para borrar el Refresh Token empleado para refrescar el Access Token -
// ------------------------------------------------------------------------------
const borrarRefreshToken = async (req, res, next) => {
  // En el cliente se debe borrar el Access Token
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.status(204).json({ mensaje: "No existe el contenido" });
    }
    const refreshToken = cookies.jwt;
    await Empleado.findOneAndUpdate(
      { refreshToken },
      { $unset: { refreshToken: "" } }
    );
    // Envio el Refresh Token como una httpOnly cookie. Una cookie
    // definida como httpOnly no es accesible por JavaScript,
    // por lo tanto no es accesible a los ataques. Access Token se envía normal.
    // Para hacer pruebas con Postman o Thunder Client se debe deshabilitar secure:true.
    // ES MUY IMPORTANTE HABILITAR SECURE:TRUE YA QUE SI NO SE HACE, EL REFRESH TOKEN NO SE ACTUALIZA
    return res
      .status(204)
      .clearCookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      })
      .json({ mensaje: "No existe el contenido" });
  } catch (error) {
    next(error);
  }
};

module.exports = { refrescarAccessToken, borrarRefreshToken };
