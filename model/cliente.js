const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema(
  {
    dni: {
      type: String,
      required: true,
      validate: /^[0-9]{8}[a-zA-Z]{1}$/,
    },
    nombre: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    telefono: {
      type: String,
      required: true,
      validate: /[0-9]{9}/,
    },
    direccion: {
      type: String,
      required: true,
    },
    localidad: {
      type: String,
      required: true,
    },
    cups: {
      type: String,
      required: true,
      unique: true,
      validate: /^[Ee][Ss][0-9]{16}[a-zA-Z]{2}$/,
    },
    potencia: {
      type: Number,
      required: true,
      min: 2.3,
      max: 10.35,
    },
    tarifa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tarifa",
    },
  },
  // Se puede utilizar el objeto timestamps que añade
  // fecha tanto en la creación como en la modificación
  { timestamps: true }
);

// El motivo por el que se establece el par direccion-localidad como
// clave es porque puede haber un cliente que tenga varias
// propiedades.
clienteSchema.index({ direccion: 1, localidad: 1 }, { unique: true });

clienteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Cliente = mongoose.model("Cliente", clienteSchema);

module.exports = Cliente;
