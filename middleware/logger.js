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

const logger = (req, res, next) => {
  console.log("");
  console.log("-------------------------------------------------".yellow);
  console.log("---------------COMIENZO DEL LOGGER---------------".yellow);
  console.log(
    (req.method + " " + req.url + " " + JSON.stringify(req.body)).yellow
  );
  console.log("-----------------FIN DEL LOGGER------------------".yellow);
  console.log("-------------------------------------------------".yellow);
  console.log("");
  next();
};

module.exports = logger;
