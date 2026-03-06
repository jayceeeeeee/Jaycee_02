//user input, latitude and longitude
let humanX = 0;
let humanY = 0;
let humanLat = 0;
let humanLon = 0;

//measures of the universe
let pi = 3.142857;
let earthRadiusMiles = 4536; // in miles

//creating the canvas and getting the geolocation of the user
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  angleMode(RADIANS);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      humanLat = position.coords.latitude;
      humanLon = position.coords.longitude;
    });
  }
}

//conversion function from miles to pixels
function conversionMilesToPixels(miles) {
  let earthRadiusPixels = 250; // We choose the raius of the Earth as a frame of reference for any conversion.
  return miles * earthRadiusPixels / earthRadiusMiles;
}

//starting to draw
function draw() {
  /* 
    Initiating the canvas 
  */
  background(0);
  translate(width/2, height/2);

  stroke(255);
  noFill();

  /*
    Draw the circle of the Earth
  */
  let earthRadius = conversionMilesToPixels(earthRadiusMiles);
  circle(0, 0, earthRadius * 2);

  let angle = map(humanLon, -180, 180, -PI, PI); // Conversion longitude → angle

  let distance = map(humanLat, -90, 90, earthRadius, 0);  // Conversion latitude → distance

  let x = cos(angle) * distance;
  let y = sin(angle) * distance;

  fill(0, 200, 255);
  noStroke();
  circle(x, y, 12);

  /*
    Drawing the (lat, lon) grid around the Human
  */

  

  /*
    Center the Human
  */
  fill(255);
  circle(humanX, humanY, 8); // (0,0) because the human is the center of the canvas
}
