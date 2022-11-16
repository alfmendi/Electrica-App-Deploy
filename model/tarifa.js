const mongoose = require("mongoose");

const tarifaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },
    tarifaBase: {
      type: Boolean,
      required: true,
      default: false,
    },
    descripcion: {
      type: String,
      required: true,
    },
    precioHoraNormal: {
      type: Number,
      min: 0,
      required: true,
    },
    precioHoraEspecial: {
      type: Number,
      min: 0,
      required: true,
    },
    periodoPrecioEspecial: {
      type: {
        selectEstacional: {
          type: Array,
        },
        selectHoras: {
          type: Array,
        },
        mes: {
          type: Array,
        },
        dia: {
          type: Array,
        },
        hora: {
          type: Array,
        },
      },
      required: true,
    },
  },
  // Se puede utilizar el objeto timestamps que añade
  // fecha tanto en la creación como en la modificación
  { timestamps: true }
);

tarifaSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Tarifa = mongoose.model("Tarifa", tarifaSchema);

module.exports = Tarifa;
