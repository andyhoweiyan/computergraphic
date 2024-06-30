let game_map1, roadhole1, roadblock1;
let car1;
let cars1, cars2, cars3;
let bgmusic, exhaustsound, gameovermusic, menubackground, gameoverimage;
;
let fontstyle;

let carX = 960;
let carY = 220;
let carWidth = 130;
let carHeight = 130;
let carboxWidth = 120;
let carBoxHeight = 55;

let parkingWidth = 70;
let parkingHeight = 140;

// Define the variable for each robot car
//Teksi
let cars1X = 425;
let cars1Y = 105;

// Teksi 2
let teksi2X = 400;
let teksi2Y = 400;

// Teksi 3
let teksi3X = 655;
let teksi3Y = 550;

// M4 
let m4_x1 = 950;
let m4_y1 = 550;

// M4 2
let m4_x2 = 505;
let m4_y2 = 550;

// Police 1
let cars2X = 575;
let cars2Y = 105;

// Police 2
let policecar3X = 800;
let policecar3Y = 105;

//Police 3
let policecar2X = 700;
let policecar2Y = 400;

//Road block
let rdX1 = 1120;
let rdY1 = 400;

// roadhole
let rhX1 = 240;
let rhY1 = 100;
let rhX2 = 970;
let rhY2 = 400;

let carSpeed = 5;

let startButton;
let gameStarted = false;

let angle = 10; // Initialize angle as a number
let score = 0;

let parkingSlotIndex = 0;

let parkingSlots = [
    { x: 840, y: 40, width: parkingWidth, height: parkingHeight, angle: 0.1 },
    { x: 690, y: 40, width: parkingWidth, height: parkingHeight, angle: 0.1 },
    { x: 310, y: 40, width: parkingWidth, height: parkingHeight, angle: -0.1 },
    { x: 90, y: 40, width: parkingWidth, height: parkingHeight, angle: -0.1 },
    { x: 390, y: 480, width: parkingWidth, height: parkingHeight, angle: 0.1 },
    { x: 700, y: 480, width: parkingWidth, height: parkingHeight, angle: 0.1 },
    { x: 545, y: 480, width: parkingWidth, height: parkingHeight, angle: 2.1 },
    { x: 840, y: 480, width: parkingWidth, height: parkingHeight, angle: 2.1 },
];

let gameState = "menu";

let obstacles = [];
let teksi1BoxWidth = 120;
let teksi1BoxHeight = 50;

let police1BoxWidth = 140;
let police1BoxHeight = 50;

let police2BoxWidth = 140;
let police2BoxHeight = 50;

let m4_1BoxWidth = 120;
let m4_2BoxHeight = 50;

let roadblock1BoxWidth = 145;
let roadblock1BoxHeight = 50;

let roadhole1BoxWidth = 110;
let roadhole1BoxHeight = 60;

let roadhole2BoxWidth = 110;
let roadhole2BoxHeight = 60;

let gameDuration = 15; // Duration of the game in seconds
let timer = gameDuration; // Timer starts at gameDuration
let timerInterval; // Interval object for the timer

let volumecontrol;

let bounceAngle = 10;

function preload() {
    // Load images
    game_map1 = loadImage('images/map4.jpg');
    car1 = loadImage('images/car1.png');
    cars1 = loadImage('images/teksi_yellow.png');
    cars2 = loadImage('images/policecar.png');
    cars3 = loadImage('images/m4.png');
    roadblock1 = loadImage('images/roadblock.png');
    roadhole1 = loadImage('images/roadhole2.png');
    menubackground = loadImage('images/menubackground3.png')
    gameoverimage = loadImage('images/gameoverimage.png');
    

    bgmusic = loadSound('bgmusic1.mp3');
    exhaustsound = loadSound('exhaustsound.mp3');
    gameovermusic = loadSound('gameover.mp3');


    fontstyle = loadFont("fontstyle.ttf");
}

function setup() {
    createCanvas(1280, 720);
    startbutton();
    obstacles = [
        { x: cars1X, y: cars1Y, width: teksi1BoxWidth, height: teksi1BoxHeight, angle: 4.5 },
        { x: teksi2X, y: teksi2Y, width: teksi1BoxWidth, height: teksi1BoxHeight, angle: 4.5 },
        { x: teksi3X, y: teksi3Y, width: teksi1BoxWidth, height: teksi1BoxHeight, angle: 4.5 },
        { x: cars2X, y: cars2Y, width: police1BoxWidth, height: police1BoxHeight, angle: 4.5 },
        { x: policecar2X, y: policecar2Y, width: police2BoxWidth, height: police2BoxHeight, angle: 4.5 },
        { x: policecar3X, y: policecar3Y, width: police2BoxWidth, height: police2BoxHeight, angle: 4.5 },
        { x: m4_x1, y: m4_y1, width: m4_1BoxWidth, height: m4_2BoxHeight, angle: 4.5 },
        { x: m4_x2, y: m4_y2, width: m4_1BoxWidth, height: m4_2BoxHeight, angle: 4.5 },
        { x: rdX1, y: rdY1, width: roadblock1BoxWidth, height: roadblock1BoxHeight, angle: 0 },
        { x: rhX1, y: rhY1, width: roadhole1BoxWidth, height: roadhole1BoxHeight, angle: 0 },
        { x: rhX2, y: rhY2, width: roadhole2BoxWidth, height: roadhole2BoxHeight, angle: 0 }
    ];

    // Create volume slider
    volumecontrol = createSlider(0, 1, 0.5, 0.01); // min: 0, max: 1, initial: 0.5, step: 0.01
    volumecontrol.position(10, 70);

    // Play background music
    bgmusic.loop();
}

// Draw a collision box around an object with rotation
function drawCollisionBox(x, y, width, height, angle, col) {
    push();
    translate(x, y);
    rotate(angle);
    noFill();
    stroke(col);
    rectMode(CENTER);
    rect(0, 0, width, height);
    pop();
}

function draw() {
    if (gameState === "menu") {
        drawMenu();
    } else if (gameState === "play") {
        background(game_map1);
        textSize(50);
        fill(255);
        text("Time: " + timer, 10, 90);

        // Adjust volume based on slider value
        bgmusic.setVolume(volumecontrol.value());

        if (gameState == "play") {
            // Update currentParkingSlot based on parkingSlotIndex
            let currentParkingSlot = parkingSlots[parkingSlotIndex];

            // Check collision between user car box and current parking slot box
            if (checkCollision(carX, carY, carboxWidth, carBoxHeight, currentParkingSlot.x, currentParkingSlot.y, currentParkingSlot.width, currentParkingSlot.height)) {
                handleParkingSuccess();
            }

            // Move the car based on user input
            if (keyIsDown(65)) { // 'A' key
                angle -= 0.05;
            }
            if (keyIsDown(68)) { // 'D' key
                angle += 0.05;
            }
            // Move the car based on user input
            if (keyIsDown(87)) { // 'W' key
                carX += carSpeed * cos(angle);
                carY += carSpeed * sin(angle);
                if (!exhaustsound.isPlaying()) {
                    exhaustsound.play(); // Play exhaust sound only if not already playing
                }
            } else if (keyIsDown(83)) { // 'S' key
                carX -= carSpeed * cos(angle);
                carY -= carSpeed * sin(angle);
                if (!exhaustsound.isPlaying()) {
                    exhaustsound.play(); // Play exhaust sound only if not already playing
                }
            } else { // If neither 'W' nor 'S' keys are pressed
                exhaustsound.stop(); // Stop the exhaust sound
            }

            // User Car
            push();
            translate(carX, carY);
            rotate(angle);
            imageMode(CENTER);
            image(car1, 0, 0, carWidth, carHeight);
            pop();

            // Draw bounding box for User Car
            // drawCollisionBox(carX, carY, carboxWidth, carBoxHeight, angle, color(0, 255, 0));

            // Robot car - Teksi
            push();
            translate(cars1X, cars1Y);
            rotate(4.5);
            imageMode(CENTER);
            image(cars1, 0, 0, 150, 110);
            pop();

            // Draw bounding box for Teksi (cars1)
            // drawCollisionBox(cars1X, cars1Y, 120, 50, 4.5, color(0, 255, 0));

            // Robot car - Teksi 2
            push();
            translate(teksi2X, teksi2Y);
            rotate(4.5);
            imageMode(CENTER);
            image(cars1, 0, 0, 150, 110);
            pop();

            // Draw bounding box for Teksi (cars1)
            // drawCollisionBox(teksi2X, teksi2Y , 120, 50, 4.5, color(0, 255, 0));

            // Teksi 3
            push();
            translate(teksi3X, teksi3Y);
            rotate(4.5);
            imageMode(CENTER);
            image(cars1, 0, 0, 150, 110);
            pop();

            // Draw bounding box for Teksi (cars1)
            //  drawCollisionBox(teksi3X, teksi3Y, 120, 50, 4.5, color(0, 255, 0));

            // Police 1
            push();
            translate(cars2X, cars2Y);
            rotate(4.5);
            imageMode(CENTER);
            image(cars2, 0, 0, 150, 160);
            pop();

            // Draw bounding box for Police (cars2)
            // drawCollisionBox(cars2X, cars2Y, 140, 50, 4.5, color(0, 0, 255));

            // Police 2
            push();
            translate(policecar2X, policecar2Y);
            rotate(4.5);
            imageMode(CENTER);
            image(cars2, 0, 0, 150, 160);
            pop();

            // Draw bounding box for Police (cars2)
            //  drawCollisionBox(policecar2X, policecar2Y, 140, 50, 4.5, color(0, 0, 255));

            // Police 3
            push();
            translate(policecar3X, policecar3Y);
            rotate(4.5);
            imageMode(CENTER);
            image(cars2, 0, 0, 150, 160);
            pop();

            // Draw bounding box for Police (cars2)
            //  drawCollisionBox(policecar3X, policecar3Y, 140, 50, 4.5, color(0, 0, 255));

            // m4
            push();
            translate(m4_x1, m4_y1);
            rotate(4.5);
            imageMode(CENTER);
            image(cars3, 0, 0, 150, 130);
            pop();

            // Draw bounding box for Police (cars2)
            //  drawCollisionBox(m4_x1, m4_y1, 120, 50, 4.5, color(0, 0, 255));

            // m4
            push();
            translate(m4_x2, m4_y2);
            rotate(4.5);
            imageMode(CENTER);
            image(cars3, 0, 0, 150, 130);
            pop();

            // Draw bounding box for Police (cars2)
            // drawCollisionBox(m4_x2, m4_y2, 120, 50, 4.5, color(0, 0, 255));

            // Roadblock
            push();
            translate(rdX1, rdY1);
            imageMode(CENTER);
            image(roadblock1, 0, 0, 200, 120);
            pop();
            // drawCollisionBox(rdX1, rdY1, 145, 50, 0, color(0, 255, 0));

            // Roadhole2
            push();
            translate(rhX2, rhY2);
            imageMode(CENTER);
            image(roadhole1, 0, 0, 200, 120);
            pop();
            // drawCollisionBox(rhX2, rhY2, 110, 60, 0, color(0, 255, 0));

            // RoadHole1
            push();
            translate(rhX1, rhY1);
            imageMode(CENTER);
            image(roadhole1, 0, 0, 180, 100);
            pop();
            // drawCollisionBox(rhX1, rhY1, 110, 60, 0, color(0, 255, 0));

            // Draw parking slot
            drawCollisionBox(currentParkingSlot.x + currentParkingSlot.width / 2, currentParkingSlot.y + currentParkingSlot.height / 2, currentParkingSlot.width, currentParkingSlot.height, 3.0, color(255, 255, 0));

            // Check for collisions with obstacles
            for (let i = 0; i < obstacles.length; i++) {
                let obs = obstacles[i];
                if (obs.type === 'roadblock1') {
                    if (checkCollision(carX, carY, carboxWidth, carBoxHeight, obs.x, obs.y, obs.width, obs.height, 'roadblock1')) {
                        gameover();
                        break;
                    }
                } else if (obs.type === 'roadhole1') {
                    if (checkCollision(carX, carY, carboxWidth, carBoxHeight, obs.x, obs.y, obs.width, obs.height, 'roadhole1')) {
                        gameover();
                        break;
                    }
                } else {
                    if (checkCollision(carX, carY, carboxWidth, carBoxHeight, obs.x, obs.y, obs.width, obs.height, 'other')) {
                        gameover();
                        break;
                    }
                }
            }

            // Check for outbound condition
            if (carX < 0 || carX > width || carY < 0 || carY > height) {
                gameover();
            }
        }

        // Display the score at the top-left corner
        fill(255);
        textSize(50);
        textAlign(LEFT, TOP);
        text("Score: " + score, 10, 10);
    }

    if (gameState === "end") {
        background(gameoverimage);
        textSize(50);
        textAlign(CENTER, CENTER);
        textFont(fontstyle);
        fill(255);
        text("Press R to replay", width / 2, height / 2);
        text("Total Score: " + score, width / 2, height / 2 + 50);
        bgmusic.stop();
        exhaustsound.stop();
    }
}

function handleParkingSuccess() {
    score++;
    carX = 960;
    carY = 220;
    angle = 10;

    parkingSlotIndex = (parkingSlotIndex + 1) % parkingSlots.length;
    fill(0);

    textSize(24);

    text("Parked!", width / 2 - 30, height / 2);
}

function startbutton() {
    startButton = createButton('Start');
    startButton.position(width / 2 - 80, height / 2);
    startButton.size(200, 100);
    startButton.style('background-color', '#4CAF50');
    startButton.style('color', 'white');
    startButton.style('font-size', '24px');
    startButton.style('border', 'none');
    startButton.style('border-radius', '12px');
    startButton.style('cursor', 'pointer');
    startButton.mousePressed(gamestart);
    gameovermusic.stop();
}

function gamestart() {
    background(150);
    startButton.hide();
    gameState = "play";
    score = 0;
    bgmusic.play(); // Play the start sound

    timerInterval = setInterval(updateTimer, 1000);
}

function drawMenu() {
    background(menubackground);
    textSize(60);
    textAlign(CENTER);
    textFont(fontstyle);
    fill(255, 0, 0);
    bounceAngle += 0.05;
    let bounce = sin(bounceAngle) * 10;
    text("Parking Simulator Game", width / 2, height / 2 - 100 + bounce);
    textSize(24);
    fill(255);
    text("Click the button below to start the game", width / 2, height / 2 - 50 + bounce);
    textSize(40);
    text("W -> Up", 1100 , 40);
    text("D -> Right", 1100 , 80);
    text("S -> Down", 1100 , 120);
    text("A -> Left", 1100 , 160);

}

function gameover() {
    gameState = "end";
    textSize(50);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    bgmusic.stop();
    exhaustsound.stop();
    gameovermusic.play();
    clearInterval(timerInterval); // Stop the timer interval
}


function updateTimer() {
    timer--;
    if (timer <= 0) {
        gameover();
    }
}

function restartgame() {
    gameState = "menu";
    score = 0;
    carX = 960;
    carY = 220;
    angle = 10;
    timer = gameDuration;
    bgmusic.stop();
    exhaustsound.stop();
    gameovermusic.stop();
    startButton.show();
}

function keyReleased() {
    if (key === 'R' || key === 'r') {
        if (gameState === "end") {
            restartgame();
        }
    }
}

function checkCollision(x1, y1, w1, h1, x2, y2, w2, h2, type) {
    let left1, right1, top1, bottom1;
    let left2, right2, top2, bottom2;

    h1 -= 20; // Adjust the height of the first object
    h2 -= 20; // Adjust the height of the second object

    // 如果 type 是 'roadhole' 或 'roadblock'，则使用横向的碰撞检测
    if (type === 'roadhole1' || type === 'roadblock1') {
        // Calculate the sides of the first rectangle
        left1 = x1 - w1 / 2;
        right1 = x1 + w1 / 2;
        top1 = y1 - h1 / 2;
        bottom1 = y1 + h1 / 2;

        // Calculate the sides of the second rectangle
        left2 = x2 - w2 / 2;
        right2 = x2 + w2 / 2;
        top2 = y2 - h2 / 2;
        bottom2 = y2 + h2 / 2;
    } else {
        // 对于其他人机车，使用纵向的碰撞检测
        // Calculate the sides of the first rectangle
        left1 = x1 - h1 / 2;
        right1 = x1 + h1 / 2;
        top1 = y1 - w1 / 2;
        bottom1 = y1 + w1 / 2;

        // Calculate the sides of the second rectangle
        left2 = x2 - h2 / 2;
        right2 = x2 + h2 / 2;
        top2 = y2 - w2 / 2;
        bottom2 = y2 + w2 / 2;
    }

    // Check for overlap
    if (right1 >= left2 && left1 <= right2 && bottom1 >= top2 && top1 <= bottom2) {
        return true; // Collision detected
    } else {
        return false; // No collision
    }
}
