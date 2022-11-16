let colors = require("colors");

// text colors
// black
// red
// green
// yellow
// blue
// magenta
// cyan
// white
// gray
// grey

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const conectar = mongoose
  .connect(MONGODB_URI)
  .then((resultado) => {
    console.log("");
    console.log("-------------------------------------------------".green);
    console.log("------------------CONEXIÓN BBDD------------------".green);
    console.log("Conexión con la BBDD realizada correctamente".green);
    console.log("-------------------------------------------------".green);
    console.log("");
  })
  .catch((error) => {
    console.log("");
    console.log("-------------------------------------------------".red);
    console.log("------------------CONEXIÓN BBDD------------------".red);
    console.log("No se ha podido conectar con la BBDD");
    console.log("-------------------------------------------------".red);
    console.log("");
  });
module.exports = conectar;
