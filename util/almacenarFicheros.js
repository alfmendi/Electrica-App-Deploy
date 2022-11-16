const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, "./consumosPorLeer");
  },

  filename: function (request, file, cb) {
    cb(null, file.originalname);
  },
});

let upload = multer({
  storage: storage,
  fileFilter: (request, file, cb) => {
    if (fs.existsSync(path.join("./consumosPorLeer", file.originalname))) {
      request.fileValidationError = "El fichero ya existe";
      return cb(null, false, new Error("El fichero ya existe"));
    } else {
      return cb(null, true);
    }
  },
});

module.exports = { storage, upload };
