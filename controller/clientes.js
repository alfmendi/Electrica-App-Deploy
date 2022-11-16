const Cliente = require("../model/cliente");
const Tarifa = require("../model/tarifa");
const Consumo = require("../model/consumo");
const Factura = require("../model/factura");

const ErrorAPIPropio = require("../error/ErrorAPIPropio");

// ------------------------------------------------
// GET /api/clientes                              -
// Privado                                        -
// Controlador para obtener el número de clientes -
// ------------------------------------------------
const conseguirNumeroClientes = async (req, res, next) => {
  try {
    const numeroClientes = await Cliente.estimatedDocumentCount();
    return res.status(200).json(numeroClientes);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------
// GET /api/clientes/clienteId                -
// Privado                                    -
// Controlador para obtener un cliente por id -
// --------------------------------------------
const conseguirClientePorId = async (req, res, next) => {
  try {
    const { clienteId } = req.params;
    const clienteDevolver = await Cliente.findById(clienteId).populate(
      "tarifa",
      {
        nombre: 1,
      }
    );
    return res.status(200).json(clienteDevolver);
  } catch (error) {
    next(error);
  }
};

// ------------------------------------------------
// GET /api/clientes/nombre/nombre                -
// Privado                                        -
// Controlador para obtener un cliente por nombre -
// ------------------------------------------------
const conseguirClientePorNombre = async (req, res, next) => {
  try {
    const { nombre } = req.params;
    // Esta opción permite hacer una busqueda case insensitive
    const clienteDevolver = await Cliente.find({
      nombre: { $regex: `^${nombre}$`, $options: "i" },
    }).populate("tarifa", { nombre: 1 });
    return res.status(200).json(clienteDevolver);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------
// GET /api/clientes/dni/dni                   -
// Privado                                     -
// Controlador para obtener un cliente por dni -
// ---------------------------------------------
const conseguirClientePorDni = async (req, res, next) => {
  try {
    const { dni } = req.params;
    // Esta opción permite hacer una busqueda case insensitive
    const clienteDevolver = await Cliente.find({
      dni: { $regex: `^${dni}$`, $options: "i" },
    }).populate("tarifa", { nombre: 1 });
    return res.status(200).json(clienteDevolver);
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------
// POST /api/clientes                           -
// Privado                                      -
// Controlador para añadir un cliente a la BBDD -
// ----------------------------------------------
const crearCliente = async (req, res, next) => {
  const {
    dni,
    nombre,
    email,
    telefono,
    direccion,
    localidad,
    cups,
    potencia,
    tarifa,
  } = req.body;
  try {
    // Compruebo si el cliente ya existe
    const cliente = await Cliente.findOne({ cups });
    if (cliente) {
      throw new ErrorAPIPropio(400, "Ya existe ese CUPS");
    }
    // Compruebo si existe la tarifa del cliente
    const existeTarifa = await Tarifa.findOne({ nombre: tarifa });
    if (!existeTarifa) {
      throw new ErrorAPIPropio(404, "No existe esa tarifa");
    }

    // Creo el nuevo cliente
    const nuevoCliente = await Cliente.create({
      dni,
      nombre,
      email,
      telefono,
      direccion,
      localidad,
      cups: cups.toUpperCase(),
      potencia,
      tarifa: existeTarifa.id,
    });

    return res.status(201).json(nuevoCliente);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// PATCH /api/clientes/clienteId                    -
// Privado                                          -
// Controlador para modificar un cliente de la BBDD -
// --------------------------------------------------
const modificarCliente = async (req, res, next) => {
  const {
    dni,
    nombre,
    email,
    telefono,
    direccion,
    localidad,
    cups,
    potencia,
    tarifa,
  } = req.body;
  const { clienteId } = req.params;
  try {
    // Compruebo si existe la tarifa del cliente
    const existeTarifa = await Tarifa.findOne({ nombre: tarifa });
    if (!existeTarifa) {
      throw new ErrorAPIPropio(404, "No existe esa tarifa");
    }
    const clienteModificado = await Cliente.findByIdAndUpdate(
      clienteId,
      {
        $set: {
          dni,
          nombre,
          email,
          telefono,
          direccion,
          localidad,
          cups: cups.toUpperCase(),
          potencia,
          tarifa: existeTarifa.id,
        },
      },
      { new: true, runValidators: true }
    );
    if (!clienteModificado) {
      throw new ErrorAPIPropio(404, "Ese cliente no existe");
    }
    return res.status(200).json(clienteModificado);
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------
// DELETE /api/clientes/clienteId                  -
// Privado                                         -
// Controlador para eliminar un cliente de la BBDD -
// -------------------------------------------------
const eliminarCliente = async (req, res, next) => {
  const { clienteId } = req.params;
  try {
    const clienteEliminar = await Cliente.findByIdAndRemove(clienteId);
    if (!clienteEliminar) {
      throw new ErrorAPIPropio(400, "No existe ese cliente");
    }
    await Consumo.deleteMany({ cliente: clienteId });
    await Factura.deleteMany({ cliente: clienteId });
    return res.status(200).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  conseguirNumeroClientes,
  conseguirClientePorId,
  conseguirClientePorNombre,
  conseguirClientePorDni,
  crearCliente,
  modificarCliente,
  eliminarCliente,
};
