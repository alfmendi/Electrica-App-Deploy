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

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Paquetes para aumentar la seguridad de la aplicación
const helmet = require("helmet");
const xss = require("xss-clean");

// Realizar la conexión con la base de datos
require("./db/conexionDB");

const app = express();

const tokensRouter = require("./routes/tokens");
const authRouter = require("./routes/auth");
const empleadosRouter = require("./routes/empleados");
const clientesRouter = require("./routes/clientes");
const tarifasRouter = require("./routes/tarifas");
const consumosRouter = require("./routes/consumos");
const facturasRouter = require("./routes/facturas");
const conceptosFacturaRouter = require("./routes/conceptosFactura");

const opcionesCORS = require("./config/opcionesCORS");
const credenciales = require("./middleware/credenciales");
const logger = require("./middleware/logger");
const rutaInvalidaMiddleware = require("./middleware/rutaInvalida");
const manejarErroresMiddleware = require("./middleware/manejarErrores");

// Middleware

// Tras hacer una petición con axios y habilitar withCredentials:true, aparece el siguiente error:
// Access to XMLHttpRequest at 'http://localhost:5000/api/auth/registro' from origin 'http://localhost:3000'
// has been blocked by CORS policy: Response to preflight request doesn't pass
// access control check: The value of the 'Access-Control-Allow-Origin' header in the response
// must not be the wildcard '*' when the request's credentials mode is 'include'.
// The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
// Para solventarlo, es necesario establecer una lista de origenes con acceso.

// Comprobamos las credenciales antes de CORS
app.use(credenciales);
app.use(cors(opcionesCORS));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(express.static("build"));

// Middleware
app.use(logger);

// Rutas
app.use("/api/tokens", tokensRouter);
app.use("/api/auth", authRouter);
app.use("/api/empleados", empleadosRouter);
app.use("/api/clientes", clientesRouter);
app.use("/api/tarifas", tarifasRouter);
app.use("/api/consumos", consumosRouter);
app.use("/api/facturas", facturasRouter);
app.use("/api/conceptosFactura", conceptosFacturaRouter);

// POR FIN: ESTA SOLUCIÓN ES CORRECTA!!!!!!!!!!!!!
// La aplicación cada vez que se hacía un refresh (F5) llamaba al servidor
// con la dirección que figuraba en el navegador. Esto hacía que cualquier
// dirección que no fuese el raiz definido en app.use(express.static("build"))
// generase un error.
// Para solventarlo, se añade el siguiente código...
// app.get("*", function (request, response) {
//   response.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
// });
app.get("*", function (req, res) {
  res.sendFile(path.resolve(__dirname, "./build", "index.html"));
});

// Middleware
// app.use(rutaInvalidaMiddleware);
app.use(manejarErroresMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("");
  console.log("-------------------------------------------------".green);
  console.log("------------COMIENZO DE LA APLICACIÓN------------".green);
  console.log(`Servidor ejecutandose en el puerto ${PORT}`.green);
  console.log("-------------------------------------------------".green);
  console.log("");
});
