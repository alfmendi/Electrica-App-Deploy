// ------------------------------------------------------------
// Método para añadir ceros por delante en caso de que el día -
// o el mes tengan un valor entre 1 y 9                       -
// ------------------------------------------------------------
const añadirCero = (numero) => {
  return (numero < 10 ? "0" : "") + numero;
};

// ----------------------------------------------------------------
// Método para calcular el importe del consumo energético mensual -
// ----------------------------------------------------------------
const calcularImporteYConsumosTotales = (
  mes,
  año,
  datosConsumo,
  mesT,
  diaT,
  horaT,
  precioHoraNormalT,
  precioHoraEspecialT
) => {
  let kWatiosHoraNormal = 0;
  let kWatiosHoraEspecial = 0;
  let consumoTotalHoraNormal = [];
  let consumoTotalHoraEspecial = [];
  let esHoraNormal = true;
  for (let indiceDia = 0; indiceDia < datosConsumo.length; indiceDia++) {
    let kWatiosNormalDia = 0;
    let kWatiosEspecialDia = 0;
    for (let indiceHora = 0; indiceHora < 24; indiceHora++) {
      // La tarifa no tiene ningún condicionante por meses o por fines de semana
      if (mesT.length === 0 && diaT.length === 0) {
        const existe = horaT.find((elemento) => elemento === indiceHora);
        if (existe !== undefined) {
          esHoraNormal = false;
        }
      }
      // La tarifa tiene el condicionante de fin de semana
      if (diaT.length !== 0 && esHoraNormal) {
        let miFecha = new Date(
          `${año}/${añadirCero(mes)}/${añadirCero(indiceDia + 1)}`
        );
        let diaSemana = miFecha.getDay();
        if (diaSemana === 0) {
          diaSemana = 7;
        }
        if ((diaSemana === 5 && indiceHora >= 15) || diaSemana > 5) {
          esHoraNormal = false;
        }
      }
      if (mesT.length !== 0 && esHoraNormal) {
        for (let indice = 0; indice < mesT.length; indice += 4) {
          let mesDesde = mesT[indice];
          let diaDesde = mesT[indice + 1];
          let mesHasta = mesT[indice + 2];
          let diaHasta = mesT[indice + 3];
          if (mes === mesDesde && indiceDia + 1 >= diaDesde) {
            const existe = horaT.find((elemento) => elemento === indiceHora);
            if (existe !== undefined) {
              esHoraNormal = false;
            }
          }
          if (mes === mesHasta && indiceDia + 1 <= diaHasta) {
            const existe = horaT.find((elemento) => elemento === indiceHora);
            if (existe !== undefined) {
              esHoraNormal = false;
            }
          }
          if (mes > mesDesde && mes < mesHasta) {
            const existe = horaT.find((elemento) => elemento === indiceHora);
            if (existe !== undefined) {
              esHoraNormal = false;
            }
          }
          if (mesDesde === 12 && mes < 3) {
            const existe = horaT.find((elemento) => elemento === indiceHora);
            if (existe !== undefined) {
              esHoraNormal = false;
            }
          }
        }
      }
      // Compruebo si es horaNormal u horaEspecial y añado el consumo a watiosHoraNormal o a watiosHoraEspecial
      if (esHoraNormal) {
        kWatiosNormalDia += datosConsumo[indiceDia][indiceHora];
        kWatiosHoraNormal += datosConsumo[indiceDia][indiceHora];
      } else {
        kWatiosEspecialDia += datosConsumo[indiceDia][indiceHora];
        kWatiosHoraEspecial += datosConsumo[indiceDia][indiceHora];
      }
      esHoraNormal = true;
    }
    consumoTotalHoraNormal.push(kWatiosNormalDia);
    consumoTotalHoraEspecial.push(kWatiosEspecialDia);
  }
  const importeTotal =
    kWatiosHoraNormal * precioHoraNormalT +
    kWatiosHoraEspecial * precioHoraEspecialT;
  return {
    importeConsumo: importeTotal,
    consumoTotalHoraNormal,
    consumoTotalHoraEspecial,
  };
};

module.exports = { calcularImporteYConsumosTotales };
