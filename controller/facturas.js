const Factura = require("../model/factura");

// ------------------------------------------------
// GET /api/facturas                              -
// Privado                                        -
// Controlador para obtener el número de facturas -
// ------------------------------------------------
const conseguirNumeroFacturas = async (req, res, next) => {
  try {
    const numeroFacturas = await Factura.estimatedDocumentCount();
    return res.status(200).json(numeroFacturas);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------
// GET /api/facturas/clienteId                         -
// Privado                                             -
// Controlador para obtener las facturas de un cliente -
// -----------------------------------------------------
const conseguirFacturasCliente = async (req, res, next) => {
  try {
    const { clienteId } = req.params;
    const facturasDevolver = await Factura.find({
      cliente: clienteId,
    }).populate("consumo", {
      mes: 1,
      año: 1,
      tarifa: 1,
      importeConsumo: 1,
      consumoTotalHoraNormal: 1,
      consumoTotalHoraEspecial: 1,
    });
    return res.status(200).json(facturasDevolver);
  } catch (error) {
    next(error);
  }
};

module.exports = { conseguirNumeroFacturas, conseguirFacturasCliente };
