const mongoose = require("mongoose");

const conceptoFacturaSchema = new mongoose.Schema(
  {
    precioPotencia: {
      type: Number,
      required: true,
      min: 0,
    },
    impuestoElectricidad: {
      type: Number,
      required: true,
      min: 0,
    },
    alquilerEquipos: {
      type: Number,
      required: true,
      min: 0,
    },
    iva: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  // Se puede utilizar el objeto timestamps que añade
  // fecha tanto en la creación como en la modificación
  { timestamps: true }
);

conceptoFacturaSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const ConceptoFactura = mongoose.model(
  "ConceptoFactura",
  conceptoFacturaSchema
);

module.exports = ConceptoFactura;
