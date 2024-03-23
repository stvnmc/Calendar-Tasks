export const monthsNames = [
  "enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const months = {
  enero: {},
  Febrero: {},
  Marzo: {},
  Abril: {},
  Mayo: {},
  Junio: {},
  Julio: {},
  Agosto: {},
  Septiembre: {},
  Octubre: {},
  Noviembre: {},
  Diciembre: {},
};

export const dayNames = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const dayHours = () => {
  const hours = [];
  let d = 1;
  let t = 1;
  let n = 1;

  for (let hour = 0; hour < 24; hour++) {
    if (hour < 6) {
      if (hour === 0) {
        hours.push({
          hour: 24,
          period: "early-Morning",
          style: { gridRow: hour + 1 },
        });
      } else {
        hours.push({
          hour: hour,
          period: "early-Morning",
          style: { gridRow: hour + 1 },
        });
      }
    } else if (hour < 12) {
      hours.push({ hour: hour, period: "morning", style: { gridRow: d } });
      d++;
    } else if (hour < 18) {
      hours.push({ hour: hour, period: "afternoon", style: { gridRow: t } });
      t++;
    } else {
      hours.push({ hour: hour, period: "night", style: { gridRow: n } });
      n++;
    }
  }

  return hours;
};
