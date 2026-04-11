/*
 * variables
*/

//user input

//space
//latitude and longitude
/*let humanLat = 0;
let humanLon = 0;
geolocation();*/
let humanLat = 37.5665;   // Seoul
let humanLon = 126.9780;  // Seoul
//time
const date_now = getKabbalahDateTime();

//measures of the universe
let pi = Math.PI;
let earthRadiusMiles = 4536; // in miles

//other variables
let humanX = 0;
let humanY = 0;


/*
 * p5 setup
*/

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(20);
  
  // Draw info window on top-left
  drawInfoWindow();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


/*
 * functions
*/

function drawInfoWindow() {
  const d = getKabbalahDateTime(); // Recalculate to get updated values
  const pad = (n, z = 2) => String(n).padStart(z, "0");
  
  // Window properties
  const windowX = 20;
  const windowY = 20;
  const windowWidth = 350;
  const padding = 12;
  const cornerRadius = 8;
  const lineHeight = 14;
  
  // Calculate window height based on content
  const titleHeight = 18;
  const separatorHeight = 8;
  const contentHeight = lineHeight * 10; // 11 lines for all info
  const windowHeight = padding * 2 + titleHeight + separatorHeight + contentHeight;
  
  // Draw semi-transparent background panel
  fill(35, 35, 45, 220);
  stroke(100, 180, 255);
  strokeWeight(2);
  rect(windowX, windowY, windowWidth, windowHeight, cornerRadius);
  
  // Draw title
  noStroke();
  fill(100, 180, 255);
  textAlign(LEFT, TOP);
  textFont('monospace');
  textSize(15);
  textStyle(BOLD);
  text("CONSTANTS", windowX + padding, windowY + padding);
  
  // Draw separator line
  stroke(100, 150, 255, 100);
  strokeWeight(1);
  line(windowX + padding, windowY + padding + 18, windowX + windowWidth - padding, windowY + padding + 18);
  
  // Draw constants text
  textStyle(NORMAL);
  textSize(12);
  fill(200, 220, 255);
  let textY = windowY + padding + 25;
  
  // Time info
  text("Hebrew Date: " + d.day + " " + d.monthName + " (" + d.month + ") " + d.year, windowX + padding, textY);
  textY += lineHeight;
  text("Time: " + pad(d.hours) + ":" + pad(d.minutes) + ":" + pad(d.seconds) + ":" + pad(d.milliseconds), windowX + padding, textY);
  //textY += lineHeight;
  //text("Stamp: " + d.timestamp, windowX + padding, textY);
  textY += lineHeight + 5;
  
  // Space info
  text("Lat: " + humanLat.toFixed(4), windowX + padding, textY);
  textY += lineHeight;
  text("Lon: " + humanLon.toFixed(4), windowX + padding, textY);
  textY += lineHeight + 5;
  
  // Sun times
  const sunrise = d.sunrise ? new Date(d.sunrise).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
  const sunset = d.sunset ? new Date(d.sunset).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
  text("Sunrise: " + sunrise, windowX + padding, textY);
  textY += lineHeight;
  text("Sunset: " + sunset, windowX + padding, textY);
  textY += lineHeight + 5;
  
  // Kabbalistic hours
  text("Kabbalistic Hour: " + d.kabbalisticHour + "/12 (" + d.kabbalisticPeriod + ")", windowX + padding, textY);
  textY += lineHeight;
  text("Day/Night Length: " + d.dayLength + " / " + d.nightLength, windowX + padding, textY);
  textY += lineHeight;
  text("Day/Night Hour Length: " + d.dayHourLength + " / " + d.nightHourLength, windowX + padding, textY);
}

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
