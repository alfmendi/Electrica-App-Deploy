const mongoose = require("mongoose");

const consumoSchema = new mongoose.Schema(
  {
    cups: {
      type: String,
      required: true,
      validate: /^[Ee][Ss][0-9]{16}[a-zA-Z]{2}$/,
    },
    mes: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    año: {
      type: Number,
      required: true,
      min: 2000,
    },
    datosConsumo: {
      type: Array,
      required: true,
    },
    consumoTotalHoraNormal: {
      type: Array,
      required: true,
    },
    consumoTotalHoraEspecial: {
      type: Array,
      required: true,
    },
    tarifa: {
      type: {
        nombreT: {
          type: String,
        },
        mesT: {
          type: Array,
        },
        diaT: {
          type: Array,
        },
        horaT: {
          type: Array,
        },
        precioHoraNormalT: {
          type: Number,
        },
        precioHoraEspecialT: {
          type: Number,
        },
      },
      required: true,
    },
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
    },
  }, // Se puede utilizar el objeto timestamps que añade
  // fecha tanto en la creación como en la modificación
  { timestamps: true }
);

consumoSchema.index({ cups: 1, mes: 1, año: 1 }, { unique: true });

consumoSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Consumo = mongoose.model("Consumo", consumoSchema);

module.exports = Consumo;
