class ErrorAPIPropio extends Error {
  constructor(codigoEstado, mensaje) {
    super(mensaje);
    this.codigoEstado = codigoEstado;
  }
}

module.exports = ErrorAPIPropio;
