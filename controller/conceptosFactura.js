const ConceptoFactura = require("../model/conceptoFactura");

const ErrorAPIPropio = require("../error/ErrorAPIPropio");

// ----------------------------------------------------
// GET /api/conceptosFactura                          -
// Privado                                            -
// Controlador para obtener el registro con           -
// los diferentes conceptos aplicables a las facturas -
// ----------------------------------------------------
const conseguirConceptosFactura = async (req, res, next) => {
  try {
    const conceptoFactura = await ConceptoFactura.find();
    return res.status(200).json(conceptoFactura);
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// POST /api/conceptosFactura                         -
// Privado                                            -
// Controlador para crear el registro con             -
// los diferentes conceptos aplicables a las facturas -
// ----------------------------------------------------
const crearConceptosFactura = async (req, res, next) => {
  try {
    const existeConceptoFactura = await ConceptoFactura.find();
    if (existeConceptoFactura.length === 1) {
      throw new ErrorAPIPropio(400, "Ya existen los conceptos de factura");
    }
    const nuevoConceptoFactura = await ConceptoFactura.create({ ...req.body });
    return res.status(201).json(nuevoConceptoFactura);
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------
// PATCH /api/conceptosFactura                        -
// Privado                                            -
// Controlador para actualizar el registro con        -
// los diferentes conceptos aplicables a las facturas -
// ----------------------------------------------------
const actualizarConceptosFactura = async (req, res, next) => {
  try {
    const { precioPotencia, impuestoElectricidad, alquilerEquipos, iva } =
      req.body;
    const { conceptosFacturaId } = req.params;
    const existeConceptoFactura = await ConceptoFactura.find();
    if (existeConceptoFactura.length === 0) {
      throw new ErrorAPIPropio(404, "No existen los conceptos de factura");
    }
    const conceptosFacturaModificado = await ConceptoFactura.findByIdAndUpdate(
      conceptosFacturaId,
      {
        $set: {
          precioPotencia,
          impuestoElectricidad,
          alquilerEquipos,
          iva,
        },
      },
      { new: true, runValidators: true }
    );
    return res.status(200).json(conceptosFacturaModificado);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  conseguirConceptosFactura,
  crearConceptosFactura,
  actualizarConceptosFactura,
};
