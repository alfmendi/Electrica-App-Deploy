const mongoose = require("mongoose");

const Tarifa = require("../model/tarifa");
const Cliente = require("../model/cliente");

const ErrorAPIPropio = require("../error/ErrorAPIPropio");

// --------------------------------------------------
// GET /api/tarifas/tarifaId                        -
// Privado                                          -
// Controlador para conseguir una tarifa de la BBDD -
// --------------------------------------------------
const conseguirTarifa = async (req, res, next) => {
  try {
    const { tarifaId } = req.params;
    const tarifa = await Tarifa.findById(tarifaId);
    if (!tarifa) {
      throw new ErrorAPIPropio(400, "Esa tarifa no existe");
    }
    return res.status(200).json(tarifa);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------
// GET /api/tarifas                                  -
// Privado                                           -
// Controlador para conseguir las tarifas de la BBDD -
// ---------------------------------------------------
const conseguirTarifas = async (req, res, next) => {
  try {
    const tarifas = await Tarifa.find();
    return res.status(200).json(tarifas);
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------
// POST /api/tarifas                            -
// Privado                                      -
// Controlador para añadir una tarifa a la BBDD -
// ----------------------------------------------
const crearTarifa = async (req, res, next) => {
  try {
    const {
      nombre,
      tarifaBase,
      descripcion,
      precioHoraNormal,
      precioHoraEspecial,
      periodoPrecioEspecial,
    } = req.body;
    if (!periodoPrecioEspecial) {
      throw new ErrorAPIPropio(400, "Periodo Precio Hora Especial está vacío");
    }

    //  Si tarifaBase es true compruebo si ya existe una tarifa base
    if (tarifaBase === true) {
      const existeTarifaBase = await Tarifa.findOne({ tarifaBase: true });
      if (existeTarifaBase) {
        throw new ErrorAPIPropio(400, "Ya existe una tarifa base");
      }
    }

    // Compruebo si ya existe la tarifa
    const tarifa = await Tarifa.findOne({ nombre });
    if (tarifa) {
      throw new ErrorAPIPropio(400, "Esa tarifa ya existe");
    }

    // Almaceno la nueva tarifa
    const nuevaTarifa = await Tarifa.create({
      nombre,
      tarifaBase,
      descripcion,
      precioHoraNormal,
      precioHoraEspecial,
      periodoPrecioEspecial,
    });
    return res.status(201).json(nuevaTarifa);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// PATCH /api/tarifas/tarifaId                      -
// Privado                                          -
// Controlador para modificar una tarifa de la BBDD -
// --------------------------------------------------
const modificarTarifa = async (req, res, next) => {
  const {
    nombre,
    tarifaBase,
    descripcion,
    precioHoraNormal,
    precioHoraEspecial,
    periodoPrecioEspecial,
  } = req.body;
  const { tarifaId } = req.params;
  try {
    const tarifaModificada = await Tarifa.findByIdAndUpdate(
      tarifaId,
      {
        $set: {
          nombre,
          tarifaBase,
          descripcion,
          precioHoraNormal,
          precioHoraEspecial,
          periodoPrecioEspecial,
        },
      },
      { new: true, runValidators: true }
    );
    if (!tarifaModificada) {
      throw new ErrorAPIPropio(404, "Esa tarifa no existe");
    }
    return res.status(200).json(tarifaModificada);
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------
// DELETE /api/tarifas/tarifaId                    -
// Privado                                         -
// Controlador para eliminar una tarifa de la BBDD -
// -------------------------------------------------
const eliminarTarifa = async (req, res, next) => {
  const { tarifaId } = req.params;
  try {
    const tarifa = await Tarifa.findById(tarifaId);
    if (!tarifa) {
      throw new ErrorAPIPropio(400, "No existe esa tarifa");
    }
    // NOTA: Esta tarifaId pertenece a la tarifa maestra y NO SE PUEDE ELIMINAR.
    // ESTO OBEDECE A UNA CUESTIÓN DE DISEÑO (DEBE EXISTIR SIEMPRE UNA TARIFA MAESTRA
    // QUE SE ASIGNA A LOS CLIENTES QUE POR CUALQUIER MOTIVO NO TIENEN UNA TARIFA CONCRETA)
    if (tarifa.tarifaBase === true) {
      throw new ErrorAPIPropio(400, "No se puede eliminar la Tarifa Base");
    }
    // Elimino esta tarifa de todos los clientes que la tienen y añado la tarifa maestra
    const registroTarifaBase = await Tarifa.findOne({ tarifaBase: true });
    await Cliente.updateMany(
      { tarifa: tarifaId },
      {
        $set: { tarifa: mongoose.Types.ObjectId(registroTarifaBase.id) },
      }
    );
    // Elimino la tarifa
    await Tarifa.findByIdAndRemove(tarifaId);
    return res.status(200).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  conseguirTarifa,
  conseguirTarifas,
  crearTarifa,
  modificarTarifa,
  eliminarTarifa,
};
