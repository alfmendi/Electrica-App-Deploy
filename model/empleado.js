const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const empleadoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
      minlength: 3,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    esAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    refreshToken: {
      type: String,
    },
  },
  // Se puede utilizar el objeto timestamps que añade
  // fecha tanto en la creación como en la modificación
  { timestamps: true }
);

// Aplica el plugin uniqueValidator a empleadoSchema.
//empleadoSchema.plugin(uniqueValidator);

empleadoSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // El password no se debe enviar
    delete returnedObject.password;
  },
});

const Empleado = mongoose.model("Empleado", empleadoSchema);

module.exports = Empleado;
