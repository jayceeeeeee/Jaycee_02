//user input, latitude and longitude
let humanX = 0;
let humanY = 0;
let humanLat = 0;
let humanLon = 0;

//measures of the universe
let pi = Math.PI;
let earthRadiusMiles = 4536; // in miles

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  angleMode(RADIANS);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      humanLat = position.coords.latitude;
      humanLon = position.coords.longitude;
    });
  }
}

//conversion function from miles to pixels
function conversionMilesToPixels(miles) {
  let earthRadiusPixels = 250; // frame of reference
  return (miles * earthRadiusPixels) / earthRadiusMiles;
}

function draw() {
  background(0);
  translate(width / 2, height / 2);

  stroke(255, 100);
  strokeWeight(1);
  noFill();

  // Draw the circle of the Earth
  let earthRadius = conversionMilesToPixels(earthRadiusMiles);
  circle(0, 0, earthRadius * 2);

  // --------- Grille carrée à l'intérieur du cercle ---------
  let step = 50; // distance entre les lignes

  // lignes verticales
  for (let x = -earthRadius; x <= earthRadius; x += step) {
    let yLimit = sqrt(earthRadius * earthRadius - x * x); // borne du cercle
    line(x, -yLimit, x, yLimit);
  }

  // lignes horizontales
  for (let y = -earthRadius; y <= earthRadius; y += step) {
    let xLimit = sqrt(earthRadius * earthRadius - y * y); // borne du cercle
    line(-xLimit, y, xLimit, y);
  }

  // Center the Human
  fill(255, 0, 0);
  noStroke();
  circle(humanX, humanY, 8); // humain au centre
}
