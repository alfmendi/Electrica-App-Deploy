const bcryptjs = require("bcryptjs");

const Empleado = require("../model/empleado");

const ErrorAPIPropio = require("../error/ErrorAPIPropio");

// ---------------------------------------------------------
// GET /api/empleados                                      -
// Privado                                                 -
// Controlador para obtener todos los empleados de la BBDD -
// ---------------------------------------------------------
const conseguirEmpleados = async (req, res, next) => {
  try {
    const empleados = await Empleado.find().select(
      "-password -refreshToken -createdAt -updatedAt"
    );
    return res.status(200).json(empleados);
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------
// GET /api/empleados/empleadoId                   -
// Privado                                         -
// Controlador para obtener un empleado de la BBDD -
// -------------------------------------------------
const conseguirEmpleado = async (req, res, next) => {
  const { empleadoId } = req.params;
  try {
    const empleado = await Empleado.findById(empleadoId).select(
      "-password -refreshToken -createdAt -updatedAt"
    );
    return res.status(200).json(empleado);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------
// POST /api/empleados                           -
// Privado                                       -
// Controlador para añadir un empleado a la BBDD -
// -----------------------------------------------
const crearEmpleado = async (req, res, next) => {
  const { nombre, username, password } = req.body;
  try {
    // Compruebo si el empleado ya existe
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

    return res.status(201).json({
      id: nuevoEmpleado.id,
      nombre: nuevoEmpleado.nombre,
      username: nuevoEmpleado.username,
      esAdmin: nuevoEmpleado.esAdmin,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------
// PATCH /api/empleados/empleadoId                   -
// Privado                                           -
// Controlador para modificar un empleado de la BBDD -
// ---------------------------------------------------
const modificarEmpleado = async (req, res, next) => {
  const { nombre, username, esAdmin } = req.body;
  const { empleadoId } = req.params;
  try {
    const empleadoModificado = await Empleado.findByIdAndUpdate(
      empleadoId,
      { $set: { nombre, username, esAdmin } },
      { new: true, runValidators: true }
    );
    if (!empleadoModificado) {
      throw new ErrorAPIPropio(404, "Ese empleado no existe");
    }

    return res.status(200).json({
      id: empleadoModificado.id,
      nombre: empleadoModificado.nombre,
      username: empleadoModificado.username,
      esAdmin: empleadoModificado.esAdmin,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------
// PATCH /api/empleados/modificarPassword/empleadoId                   -
// Privado                                           -
// Controlador para modificar un empleado de la BBDD -
// ---------------------------------------------------
const modificarPasswordEmpleado = async (req, res, next) => {
  const { password } = req.body;
  const { empleadoId } = req.params;
  try {
    // Genero el hash para el password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);
    const empleadoModificado = await Empleado.findByIdAndUpdate(
      empleadoId,
      { $set: { password: passwordHash } },
      { new: true, runValidators: true }
    );
    if (!empleadoModificado) {
      throw new ErrorAPIPropio(404, "Ese empleado no existe");
    }
    return res.status(200).send();
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// DELETE /api/empleados/empleadoId                 -
// Privado                                          -
// Controlador para eliminar un empleado de la BBDD -
// --------------------------------------------------
const eliminarEmpleado = async (req, res, next) => {
  const { empleadoId } = req.params;
  try {
    const empleadoABorrar = await Empleado.findByIdAndRemove(empleadoId);
    if (!empleadoABorrar) {
      throw new ErrorAPIPropio(400, "No existe ese empleado");
    }
    return res.status(200).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  conseguirEmpleados,
  conseguirEmpleado,
  crearEmpleado,
  modificarEmpleado,
  modificarPasswordEmpleado,
  eliminarEmpleado,
};
