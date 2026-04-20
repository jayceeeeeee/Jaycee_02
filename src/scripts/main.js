/*
 * imports
*/

import * as consts from "./constants.js";
import * as utils from "./utils.js";

/*
 * p5 setup
*/

window.setup = function() {
  createCanvas(windowWidth, windowHeight);
}

window.draw = function() {
  background(20);
  
  // Draw earth/territory
  drawEarth();
  
  // Draw Kabbalah Sun Circle
  drawKabbalahSunCircle();
  
  // Draw time markers every 1h20
  drawTime();
  
  // Draw degrees around the circle
  drawDegrees();
  
  // Draw info window on top-left
  drawInfoWindow(consts.date_now, consts.humanLat, consts.humanLon);
}

window.windowResized = function() {
  resizeCanvas(windowWidth, windowHeight);
  // Recalculate territory size based on new window dimensions
  utils.updateRadiusTerritory();
}


/*
 * functions
*/

function drawInfoWindow(date_now, humanLat, humanLon) {
  const d = date_now; // Use cached constant instead of recalculating
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
  stroke(130, 200, 255);
  strokeWeight(2);
  rect(windowX, windowY, windowWidth, windowHeight, cornerRadius);
  
  // Draw title
  noStroke();
  fill(130, 200, 255);
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

function drawEarth() {
  // Center of canvas
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  
  // Draw territory circle
  noFill();
  stroke(100, 180, 255);
  strokeWeight(1);
  circle(centerX, centerY, utils.RyōikiTenkaiPixels * 2);
  
  // Draw human at center (top-down view)
  fill(100, 180, 255);
  noStroke();
  circle(centerX, centerY, 8); // Small circle for human
}

function drawDegrees() {
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  const radius = utils.RyōikiTenkaiPixels;
  const textRadius = radius - 17;
  const tickLength = 6;
  const smallTickLength = 3;
  
  // Draw tick marks and degree text
  fill(100, 180, 220, 120);
  textFont('monospace');
  textSize(9);
  textAlign(CENTER, CENTER);
  
  // Draw small ticks for all 360 degrees
  stroke(100, 180, 220, 60);
  strokeWeight(1);
  for (let deg = 0; deg < 360; deg += 1) {
    let angle_rad = radians(deg - 90);
    let x1 = centerX + cos(angle_rad) * radius;
    let y1 = centerY + sin(angle_rad) * radius;
    let x2 = centerX + cos(angle_rad) * (radius - smallTickLength);
    let y2 = centerY + sin(angle_rad) * (radius - smallTickLength);
    line(x1, y1, x2, y2);
  }
  
  // Draw larger ticks and labels every 10°
  for (let deg = 0; deg < 360; deg += 10) {
    let angle_rad = radians(deg - 90);
    
    // Draw tick line from circle outward
    stroke(100, 180, 220, 120);
    strokeWeight(1);
    let x1 = centerX + cos(angle_rad) * radius;
    let y1 = centerY + sin(angle_rad) * radius;
    let x2 = centerX + cos(angle_rad) * (radius - tickLength);
    let y2 = centerY + sin(angle_rad) * (radius - tickLength);
    line(x1, y1, x2, y2);
    
    // Draw degree text
    noStroke();
    let x = centerX + cos(angle_rad) * textRadius;
    let y = centerY + sin(angle_rad) * textRadius;
    text(`${deg}°`, x, y);
  }
}

function drawTime() {
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  const innerRadius = utils.RyōikiTenkaiPixels;
  const kabbalahMargin = 40; // Margin from drawKabbalahSunCircle
  const timeMargin = 40; // Margin for time circle
  const innerTimeRadius = innerRadius + kabbalahMargin; // Start where Kabbalah ends
  const radius = innerTimeRadius + timeMargin; // Outer radius of time circle
  
  // Draw outer circle for time markers
  noFill();
  stroke(100, 180, 255, 100);
  strokeWeight(1);
  circle(centerX, centerY, radius * 2);
  
  // Draw time markers every 20° (1h20)
  textFont('monospace');
  textSize(9);
  fill(200, 220, 255);
  
  for (let deg = 0; deg < 360; deg += 20) {
    let angle_rad = radians(deg - 90);
    
    // Calculate time from degree (0° = 00:00, each degree = 4 minutes)
    let totalMinutes = Math.round((deg / 360) * 24 * 60);
    let hours = Math.floor(totalMinutes / 60) % 24;
    let minutes = totalMinutes % 60;
    let timeStr = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
    
    // Draw label in margin
    let tickInner = innerTimeRadius + 1;
    let tickOuter = radius - (timeMargin - timeMargin / 6);
    let tx1 = centerX + cos(angle_rad) * tickInner;
    let ty1 = centerY + sin(angle_rad) * tickInner;
    let tx2 = centerX + cos(angle_rad) * tickOuter;
    let ty2 = centerY + sin(angle_rad) * tickOuter;
    stroke(130, 200, 255, 150);
    strokeWeight(1);
    line(tx1, ty1, tx2, ty2);
    
    noStroke();
    let textRadius = innerTimeRadius + timeMargin * 0.55;
    let textX = centerX + cos(angle_rad) * textRadius;
    let textY = centerY + sin(angle_rad) * textRadius;
    textAlign(CENTER, CENTER);
    text(timeStr, textX, textY);
  }
}

function drawKabbalahSunCircle() {
  const centerX = windowWidth / 2;
  const centerY = windowHeight / 2;
  const innerRadius = utils.RyōikiTenkaiPixels;
  const margin = 40; // Reduced margin
  const radius = innerRadius + margin;
  
  // Draw the outer circle
  noFill();
  stroke(100, 180, 255, 150);
  strokeWeight(1);
  circle(centerX, centerY, radius * 2);
  
  // Sephiroth data (one center time, 0° = center of Sephira 9 at midnight)
  const sephiroth = [
    { num: 9, deg: 0, time: '00:00' },
    { num: 1, deg: 40, time: '02:40' },
    { num: 2, deg: 80, time: '05:20' },
    { num: 4, deg: 120, time: '08:00' },
    { num: 3, deg: 160, time: '10:40' },
    { num: 5, deg: 200, time: '13:20' },
    { num: 7, deg: 240, time: '16:00' },
    { num: 6, deg: 280, time: '18:40' },
    { num: 8, deg: 320, time: '21:20' }
  ];
  
  // Draw dividing lines on the circle edge for each period boundary
  const boundaries = [0, 40, 80, 120, 160, 200, 240, 280, 320];
  stroke(100, 180, 255, 100);
  strokeWeight(1);
  for (let boundary of boundaries) {
    let angle_rad = radians(boundary - 90+-20); // Shift by -20° to align with Sephira centers
    let x1 = centerX + cos(angle_rad) * innerRadius;
    let y1 = centerY + sin(angle_rad) * innerRadius;
    let x2 = centerX + cos(angle_rad) * radius;
    let y2 = centerY + sin(angle_rad) * radius;
    line(x1, y1, x2, y2);
  }
  
  // Draw small label ticks and label text in the margin for each period center
  textFont('monospace');
  textSize(10);
  for (let s of sephiroth) {
    let angle_rad = radians(s.deg - 90);
    let tickInner = innerRadius;
    let tickOuter = radius - (margin-margin/6); // Shorter tick for better aesthetics
    let tx1 = centerX + cos(angle_rad) * tickInner;
    let ty1 = centerY + sin(angle_rad) * tickInner;
    let tx2 = centerX + cos(angle_rad) * tickOuter;
    let ty2 = centerY + sin(angle_rad) * tickOuter;
    stroke(130, 200, 255, 180);
    strokeWeight(1);
    line(tx1, ty1, tx2, ty2);

    fill(200, 220, 255);
    noStroke();
    let textRadius = innerRadius + margin * 0.55;
    let textX = centerX + cos(angle_rad) * textRadius;
    let textY = centerY + sin(angle_rad) * textRadius;
    textAlign(CENTER, CENTER);
    textSize(12);
    text(s.num, textX, textY);
  }
}