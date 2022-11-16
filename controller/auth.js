const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Empleado = require("../model/empleado");

const ErrorAPIPropio = require("../error/ErrorAPIPropio");

// ------------------------------------------------------
// POST /api/auth/login                                 -
// Público                                              -
// Controlador para gestionar el login de los empleados -
// ------------------------------------------------------
const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    // Compruebo si el empleado no existe
    const empleado = await Empleado.findOne({ username });
    if (!empleado) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }

    // Compruebo que el password es válido
    const passwordValido = await bcryptjs.compare(password, empleado.password);
    if (!passwordValido) {
      throw new ErrorAPIPropio(401, "Credenciales no válidas");
    }

    // Genero el accessToken
    const accessToken = jwt.sign(
      { empleadoId: empleado.id },
      process.env.JWT_ACCESS_TOKEN_SECRETO,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRACION }
    );

    // Genero el refreshToken
    const refreshToken = jwt.sign(
      { empleadoId: empleado.id },
      process.env.JWT_REFRESH_TOKEN_SECRETO,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRACION }
    );

    // Guardo el refreshToken en el documento del empleado dentro de la base de datos
    empleado.refreshToken = refreshToken;
    await empleado.save();

    // Envio el Refresh Token como una httpOnly cookie. Una cookie
    // definida como httpOnly no es accesible por JavaScript,
    // por lo tanto no es accesible a los ataques. Access Token se envía normal.
    // Para hacer pruebas con Postman o Thunder Client se debe deshabilitar secure:true.
    // ES MUY IMPORTANTE HABILITAR SECURE:TRUE YA QUE SI NO SE HACE, EL REFRESH TOKEN NO SE ACTUALIZA
    return res
      .status(200)
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: process.env.JWT_REFRESH_TOKEN_MAXAGE * 60 * 60 * 1000,
      })
      .json({
        empleadoId: empleado.id,
        nombre: empleado.nombre,
        esAdmin: empleado.esAdmin,
        accessToken,
      });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------
// POST /api/auth/registro                                 -
// Público                                                 -
// Controlador para gestionar el registro de los empleados -
// ---------------------------------------------------------
const registro = async (req, res, next) => {
  const { nombre, username, password } = req.body;
  try {
    // Compruebo si el empleado ya existe. Realmente, esta comprobación
    // aquí no haría falta ya que también lo comprueba en el middleware
    // manejarErrores.
    const empleado = await Empleado.findOne({ username });
    if (empleado) {
      throw new ErrorAPIPropio(400, "Ya existe un empleado con ese username");
    }

    // Genero el hash para el password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    // Creo el nuevo empleado
    const nuevoEmpleado = await Empleado.create({
      nombre,
      username,
      password: passwordHash,
      esAdmin: req.body.esAdmin || false,
    });

    // Genero el accessToken
    const accessToken = jwt.sign(
      { empleadoId: nuevoEmpleado.id },
      process.env.JWT_ACCESS_TOKEN_SECRETO,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRACION }
    );

    // Genero el refreshToken. Realmente este token no sería necesario
    // crearlo en el registro ya que en mi caso, despues de hacer el registro voy
    // a la página de login. Si tras el registro fuese directamente a la zona privada
    // de la aplicación si que sería necesario.
    const refreshToken = jwt.sign(
      { empleadoId: nuevoEmpleado.id },
      process.env.JWT_REFRESH_TOKEN_SECRETO,
      { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRACION }
    );

    // Guardo el refreshToken en el documento del empleado dentro de la base de datos
    nuevoEmpleado.refreshToken = refreshToken;
    await nuevoEmpleado.save();

    // Envio el refreshToken como una httpOnly cookie. Una cookie
    // definida como httpOnly no es accesible por JavaScript,
    // por lo tanto no es accesible a los ataques. Access Token se envía normal
    // En producción se debe activar secure: true.
    // Para hacer pruebas con Postman o Thunder Client se debe deshabilitar secure:true.
    // ES MUY IMPORTANTE HABILITAR SECURE:TRUE YA QUE SI NO SE HACE, EL REFRESH TOKEN NO SE ACTUALIZA
    return res
      .status(201)
      .cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: process.env.JWT_REFRESH_TOKEN_MAXAGE * 60 * 60 * 1000,
      })
      .json({
        empleadoId: nuevoEmpleado.id,
        nombre: nuevoEmpleado.nombre,
        esAdmin: nuevoEmpleado.esAdmin,
        token: accessToken,
      });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, registro };
