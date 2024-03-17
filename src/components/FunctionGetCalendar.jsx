export const getInfoCalendar = async (id1, id2) => {
  try {
    const formerPromise = getDaysMonth("former", id1, id2);
    const currentPromise = getDaysMonth("current", id1, id2);

    // Obtener la información de los meses de forma asincrónica
    const [former, current] = await Promise.all([
      formerPromise,
      currentPromise,
    ]);

    let next;

    // Determinar si se necesita obtener el próximo mes
    if (current.length + former.length > 34) {
      next = getDaysMonth("next", id1, id2).reverse().slice(7).reverse();
    } else {
      next = getDaysMonth("next", id1, id2);
    }

    // Combinar la información de los tres meses
    const calendarInfo = [...former, ...current, ...next];
    return calendarInfo;
  } catch (error) {
    console.error("Error al obtener el calendario:", error);
  }
};

const getDaysMonth = (type, id1, id2) => {
  const idAdjustment = (e) => {
    if (e === "date") {
      return type === "next"
        ? parseInt(id1) + 1
        : type === "former"
        ? id1 - 1
        : id1;
    }
    if (e === "day") {
      return type === "next"
        ? id1
        : type === "former"
        ? parseInt(id1) - 2
        : id1 - 1;
    }
  };

  const daysInMonth = new Date(id2, idAdjustment("date"), 0).getDate();
  const firstDayOfMonth = new Date(id2, idAdjustment("day"), 1).getDay();

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => ({
    type: type,
    dayNumber: i + 1,
    dayOfWeek: (firstDayOfMonth + i) % 7,
  }));

  if (type === "next") {
    const reversedArrayNext = daysArray;
    let extractedArrayNext = [];
    let i = 0;
    for (const day of reversedArrayNext) {
      extractedArrayNext.push(day);
      if (day.dayOfWeek === 6 && ++i === 2) break;
    }
    return extractedArrayNext;
  }

  if (type === "former") {
    const reversedArray = daysArray.slice().reverse();
    let extractedArray = [];
    for (const day of reversedArray) {
      if (day.dayOfWeek === 6) break;
      extractedArray.unshift(day);
      if (day.dayOfWeek === 0) break;
    }
    return extractedArray;
  }

  return daysArray;
};
