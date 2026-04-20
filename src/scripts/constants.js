/*
 * constants (independant from the user choice)
*/

//latitude and longitude
/*let humanLat = 0;
let humanLon = 0;
geolocation();*/
export let humanLat = 37.5665;   // fixed Seoul
export let humanLon = 126.9780;  // fixed Seoul

//time
export const date_now = getKabbalahDateTime();

/*
 * functions geolocation and time
*/

function geolocation(){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      humanLat = position.coords.latitude;
      humanLon = position.coords.longitude;
    });
  }
}

function getKabbalahDateTime(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-u-ca-hebrew", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).formatToParts(date);

  const get = (type) => parts.find(p => p.type === type).value;

  const months = [
    "Tishrei", "Cheshvan", "Kislev",
    "Tevet", "Shevat", "Adar",
    "Nisan", "Iyar", "Sivan",
    "Tammuz", "Av", "Elul"
  ];

  const monthName = get("month");

  const times = SunCalc.getTimes(date, humanLat, humanLon);

  const sunrise = times.sunrise;
  const sunset = times.sunset;

  const kHour = getKabbalisticHour(date, sunrise, sunset);

  return {
    // Hebrew date
    day: Number(get("day")),
    month: months.indexOf(monthName), // 0 → 11
    monthName: monthName,
    year: Number(get("year")),

    // Time (precise)
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    milliseconds: date.getMilliseconds(),

    // Kabbalistic hour (1 → 12)
    sunrise,
    sunset,
    kabbalisticHour: kHour.hour,
    kabbalisticHourLength: kHour.hourLength,
    kabbalisticPeriod: kHour.period,
    dayLength: kHour.dayLength,
    nightLength: kHour.nightLength,
    dayHourLength: kHour.dayHourLength,
    nightHourLength: kHour.nightHourLength, 

    // Bonus (useful)
    timestamp: date.getTime()
  };
}

function formatMillisecondsToTime(ms) {
  const totalMinutes = Math.floor(ms / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
}

function getKabbalisticHour(date, sunrise, sunset) {
  const dayLength = sunset - sunrise;
  
  // Obtenir sunrise du jour suivant pour calculer nightLength
  const nextDayDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  const nextDayTimes = SunCalc.getTimes(nextDayDate, humanLat, humanLon);
  const nightLength = nextDayTimes.sunrise - sunset;
  
  const dayHourLength = dayLength / 12;
  const nightHourLength = nightLength / 12;
  
  const dayHourLengthFormatted = formatMillisecondsToTime(dayHourLength);
  const nightHourLengthFormatted = formatMillisecondsToTime(nightHourLength);
  
  // Déterminer si on est en jour ou nuit
  let hour, hourLength, period;
  if (date >= sunrise && date < sunset) {
    // Heure kabbalistique du jour
    hour = Math.floor((date - sunrise) / dayHourLength) + 1;
    hourLength = dayHourLengthFormatted;
    period = "Day";
  } else {
    // Heure kabbalistique de la nuit
    let nightStart = date < sunrise ? sunset : new Date(date.getTime() - (date - sunset));
    hour = Math.floor((date - nightStart) / nightHourLength) + 1;
    hourLength = nightHourLengthFormatted;
    period = "Night";
  }

  return {
    hour: hour,
    hourLength: hourLength,
    period: period,
    dayLength: formatMillisecondsToTime(dayLength),
    nightLength: formatMillisecondsToTime(nightLength),
    dayHourLength: dayHourLengthFormatted,
    nightHourLength: nightHourLengthFormatted
  };
}

