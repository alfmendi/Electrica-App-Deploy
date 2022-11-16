const rutaInvalida = (req, res) => {
  return res.status(400).json({
    mensaje: "Esa ruta no existe",
    url: req.url,
    hostname: req.hostname,
  });
};

module.exports = rutaInvalida;
