const fs = require("fs");
const util = require("util");

const Cliente = require("../model/cliente");
const Tarifa = require("../model/tarifa");
const Consumo = require("../model/consumo");
const Factura = require("../model/factura");
const ConceptoFactura = require("../model/conceptoFactura");

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const ErrorAPIPropio = require("../error/ErrorAPIPropio");

const {
  calcularImporteYConsumosTotales,
} = require("../util/calcularImporteYConsumosTotales");

// En caso de que no exista el directorio consumosPorLeer, lo crea
!fs.existsSync("./consumosPorLeer/") && fs.mkdirSync("./consumosPorLeer/");

// ------------------------------------------------
// GET /api/consumos                              -
// Privado                                        -
// Controlador para obtener el número de consumos -
// ------------------------------------------------
const obtenerNumeroConsumos = async (req, res, next) => {
  try {
    const numeroConsumos = await Consumo.estimatedDocumentCount();
    return res.status(200).json(numeroConsumos);
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------
// GET /api/consumos/clienteId                        -
// Privado                                             -
// Controlador para obtener los consumos de un cliente -
// -----------------------------------------------------
const obtenerConsumosCliente = async (req, res, next) => {
  try {
    const { clienteId } = req.params;
    const consumosDevolver = await Consumo.find({ cliente: clienteId });
    if (!consumosDevolver) {
      throw new ErrorAPIPropio(404, "No existen consumos para ese cliente");
    }
    return res.status(200).json(consumosDevolver);
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------
// GET /api/consumos/ficherosDatos/numero                          -
// Privado                                                  -
// Controlador para obtener el número de ficheros con datos -
// que se encuentran disponibles para ser cargados          -
// ----------------------------------------------------------
const numeroFicherosParaSerCargados = async (req, res, next) => {
  try {
    !fs.existsSync("./consumosPorLeer/") && fs.mkdirSync("./consumosPorLeer/");
    const nombreFicheros = await readdir("./consumosPorLeer/");
    const numero = nombreFicheros.length || 0;
    return res.status(200).json({ numero });
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------------
// POST /api/consumos                                                                -
// Privado                                                                           -
// Controlador para almacenar los consumos ubicados en el directorio consumosPorLeer -
// en la BBDD y crear la factura correspondiente a cada consumo                      -
// -----------------------------------------------------------------------------------
const crearConsumos = async (req, res, next) => {
  try {
    const tarifas = await Tarifa.find();
    const conceptosFactura = await ConceptoFactura.find();
    !fs.existsSync("./consumosPorLeer/") && fs.mkdirSync("./consumosPorLeer/");
    const nombreFicheros = await readdir("./consumosPorLeer/");
    for (const fichero in nombreFicheros) {
      const datosFichero = await readFile(
        "./consumosPorLeer/" + nombreFicheros[fichero],
        "utf-8"
      );
      objetoJSON = JSON.parse(datosFichero);
      for (let registro in objetoJSON.consumo) {
        let cups = objetoJSON.consumo[registro].cups.toUpperCase();
        const clienteBuscar = await Cliente.findOne({ cups });
        if (!clienteBuscar) {
          continue;
        }
        const tarifaCliente = tarifas?.find(
          (elemento) => elemento.id == clienteBuscar.tarifa
        );
        let mes = objetoJSON?.consumo[registro].mes;
        let año = objetoJSON?.consumo[registro].año;
        let datosConsumo = objetoJSON?.consumo[registro].datos;
        let mesT = tarifaCliente?.periodoPrecioEspecial.mes;
        let diaT = tarifaCliente?.periodoPrecioEspecial.dia;
        let horaT = tarifaCliente?.periodoPrecioEspecial.hora;
        let precioHoraNormalT = tarifaCliente?.precioHoraNormal;
        let precioHoraEspecialT = tarifaCliente?.precioHoraEspecial;
        let {
          importeConsumo,
          consumoTotalHoraNormal,
          consumoTotalHoraEspecial,
        } = calcularImporteYConsumosTotales(
          mes,
          año,
          datosConsumo,
          mesT,
          diaT,
          horaT,
          precioHoraNormalT,
          precioHoraEspecialT
        );
        importeConsumo = parseFloat(importeConsumo.toFixed(2));
        consumoTotalHoraNormal = consumoTotalHoraNormal.map((elemento) =>
          parseFloat(elemento.toFixed(2))
        );
        consumoTotalHoraEspecial = consumoTotalHoraEspecial.map((elemento) =>
          parseFloat(elemento.toFixed(2))
        );
        const objetoLectura = {
          cups: cups.toUpperCase(),
          mes,
          año,
          datosConsumo,
          cliente: clienteBuscar.id,
          tarifa: {
            nombreT: tarifaCliente?.nombre,
            mesT,
            diaT,
            horaT,
            precioHoraNormalT,
            precioHoraEspecialT,
          },
          consumoTotalHoraNormal,
          consumoTotalHoraEspecial,
        };
        const lecturaExiste = await Consumo.findOne({ cups, mes, año });
        if (lecturaExiste) {
          continue;
        }
        const nuevaLectura = new Consumo(objetoLectura);
        const consumoSalvado = await nuevaLectura.save();
        // Crea registro en factura
        let potencia = clienteBuscar.potencia;
        let importePotenciaContratada =
          clienteBuscar.potencia *
          conceptosFactura[0].precioPotencia *
          datosConsumo.length;
        importePotenciaContratada = parseFloat(
          importePotenciaContratada.toFixed(2)
        );
        let importeEnergiaConsumida = importeConsumo;
        let importeImpuestoElectricidad =
          (clienteBuscar.potencia * conceptosFactura[0].precioPotencia +
            importeConsumo) *
          (conceptosFactura[0].impuestoElectricidad / 100);
        importeImpuestoElectricidad = parseFloat(
          importeImpuestoElectricidad.toFixed(2)
        );
        let importeAlquilerEquipos =
          datosConsumo.length * conceptosFactura[0].alquilerEquipos;
        importeAlquilerEquipos = parseFloat(importeAlquilerEquipos.toFixed(2));
        let importeIva =
          (importePotenciaContratada +
            importeEnergiaConsumida +
            importeImpuestoElectricidad +
            importeAlquilerEquipos) *
          (conceptosFactura[0].iva / 100);
        importeIva = parseFloat(importeIva.toFixed(2));

        const objetoFactura = {
          potencia,
          importePotenciaContratada,
          importeEnergiaConsumida,
          importeImpuestoElectricidad,
          importeAlquilerEquipos,
          importeIva,
          consumo: consumoSalvado.id,
          cliente: clienteBuscar.id,
        };
        const nuevaFactura = new Factura(objetoFactura);
        await nuevaFactura.save();
      }
    }
    // Una vez leidos los ficheros, se mueven a un nuevo directorio
    !fs.existsSync("./consumosLeidos/") && fs.mkdirSync("./consumosLeidos/");
    for (const fichero in nombreFicheros) {
      let pathAntiguo = "./consumosPorLeer/" + nombreFicheros[fichero];
      let pathNuevo = "./consumosLeidos/" + nombreFicheros[fichero];
      fs.rename(pathAntiguo, pathNuevo, function (err) {
        if (err) throw err;
        // console.log("Fichero movidos correctamente");
      });
    }
    return res.status(200).json({
      mensaje: "Consumos almacenados en la BBDD",
    });
  } catch (error) {
    next(error);
  }
};

// -------------------------------------------------------------------
// POST /api/consumos/guardar                                        -
// Privado                                                           -
// Controlador para almacenar los ficheros con los datos de consumos -
// en el directorio consumosPorLeer                                  -
// -------------------------------------------------------------------
const almacenarFicheros = (req, res, next) => {
  try {
    if (req.fileValidationError) {
      console.log("Entro en if de almacenarFicheros en consumosController");
      throw new ErrorAPIPropio(500, req.fileValidationError);
    }
    return res.status(200).json({
      mensaje: "Fichero almacenado en el servidor",
    });
  } catch (error) {
    console.log(
      "Entro en catch(error) de almacenarFicheros en consumosController"
    );
    next(error);
  }
};

// --------------------------------------------------
// PATCH /api/consumos/consumoId                    -
// Privado                                          -
// Controlador para actualizar valores de  consumos -
// --------------------------------------------------
const modificarConsumos = async (req, res, next) => {
  try {
    const body = req.body;
    const { consumoId } = req.params;
    const consumoModificar = await Consumo.findById(consumoId);
    consumoModificar.datosConsumo[body.dia - 1] = body.datosConsumo;
    let { importeConsumo, consumoTotalHoraNormal, consumoTotalHoraEspecial } =
      calcularImporteYConsumosTotales(
        consumoModificar.mes,
        consumoModificar.año,
        consumoModificar.datosConsumo,
        consumoModificar.tarifa.mesT,
        consumoModificar.tarifa.diaT,
        consumoModificar.tarifa.horaT,
        consumoModificar.tarifa.precioHoraNormalT,
        consumoModificar.tarifa.precioHoraEspecialT
      );
    importeConsumo = parseFloat(importeConsumo.toFixed(2));
    consumoTotalHoraNormal = consumoTotalHoraNormal.map((elemento) =>
      parseFloat(elemento.toFixed(2))
    );
    consumoTotalHoraEspecial = consumoTotalHoraEspecial.map((elemento) =>
      parseFloat(elemento.toFixed(2))
    );

    const consumoModificado = await Consumo.findByIdAndUpdate(
      consumoId,
      {
        $set: {
          datosConsumo: consumoModificar.datosConsumo,
          consumoTotalHoraNormal,
          consumoTotalHoraEspecial,
        },
      },
      { new: true, runValidators: true }
    );
    // Modificar el importe del consumo en la factura correspondiente
    const facturaModificar = await Factura.find({
      consumo: consumoModificado.id,
    });
    await Factura.findByIdAndUpdate(
      facturaModificar.id,
      { $set: { importeEnergiaConsumida: importeConsumo } },
      { new: true, runValidators: true }
    );
    return res.status(200).json(consumoModificado);
  } catch (error) {
    next(error);
  }
};

// --------------------------------------------------
// DELETE /api/consumos                   -
// Privado                                          -
// Controlador para eliminar todos los consumos -
// --------------------------------------------------
const eliminarTodosConsumos = async (req, res, next) => {
  try {
    await Consumo.deleteMany();
    await Factura.deleteMany();
    return res
      .status(200)
      .json({ mensaje: "Todos los consumos han sido borrados" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerNumeroConsumos,
  obtenerConsumosCliente,
  numeroFicherosParaSerCargados,
  crearConsumos,
  almacenarFicheros,
  modificarConsumos,
  eliminarTodosConsumos,
};
