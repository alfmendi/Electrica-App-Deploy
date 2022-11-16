const mongoose = require("mongoose");

const facturaSchema = new mongoose.Schema(
  {
    potencia: {
      type: Number,
      required: true,
      min: 2.2,
    },
    importePotenciaContratada: {
      type: Number,
      required: true,
      min: 0,
    },
    importeEnergiaConsumida: {
      type: Number,
      required: true,
      min: 0,
    },
    importeImpuestoElectricidad: {
      type: Number,
      required: true,
      min: 0,
    },
    importeAlquilerEquipos: {
      type: Number,
      required: true,
      min: 0,
    },
    importeIva: {
      type: Number,
      required: true,
      min: 0,
    },
    consumo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consumo",
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cliente",
    },
  },
  // Se puede utilizar el objeto timestamps que añade
  // fecha tanto en la creación como en la modificación
  { timestamps: true }
);

facturaSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Factura = mongoose.model("Factura", facturaSchema);

module.exports = Factura;
