var canvas;
var ironman, ironmanImg, beam, beamImg, beamGroup, badBeamGroup;
var sky, skyImg;
var robot, robotImg, robotGroup, trappedGirl, trappedGirlImg;
var play, titleScreenImg, titleScreen;
var gameState = "start";
var score = 0;
var backgroundMusic;
var boom, boomImg;

function preload() {
    ironmanImg = loadImage("Images/ironMan.png");
    skyImg = loadImage("Images/sky.jpg");
    robotImg = loadImage("Images/robot.png");
    trappedGirlImg = loadImage("Images/trappedGirl.png");
    backgroundMusic = loadSound("Images/backgroundMusic.mp3")
    titleScreenImg = loadImage("Images/titleScreen.jpg");
    beamImg = loadImage("Images/beam.png");
    boomImg = loadImage("Images/explosion.png")
}

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    backgroundMusic.play();

    sky = createSprite(300,300);
    sky.addImage("sky",skyImg);
    sky.scale = 6;
    sky.velocityY = 1;

    titleScreen = createSprite(960,530,width,height);
    titleScreen.addImage("title", titleScreenImg);
    titleScreen.scale = 1;

    play = createImg("Images/play.png");
    play.position(1200,300);
    play.size(500,500);
    play.mouseClicked(hide);

    ironman = createSprite(300,300,20,20);
    ironman.addImage("ironman", ironmanImg);
    ironman.scale = 0.3;
    ironman.visible = false;
    ironman.setCollider("rectangle",0,0,300,300);

    robotGroup = new Group();
    beamGroup = new Group();
    badBeamGroup = new Group();

    score = 0;
}

function draw() {
    background(200);
    
    if (gameState === "play") {
        ironman.visible = true;
        if(keyDown("RIGHT")) {
            ironman.x = ironman.x + 8;
        }
      
        if(keyDown("LEFT")) {
            ironman.x = ironman.x + -8;
        }
      
        if(keyDown("SPACE")) {
            ironman.velocityY = -10;
        }

        if(keyDown("UP")) {
            shootBeam();
        }

        ironman.velocityY = ironman.velocityY + 0.8;

        if(sky.y > 1000){
            sky.y = 300;
        }

        if(robotGroup.collide(beamGroup)) {
            robotHit();
            score = score + 1;
        }

        spawnRobots();

        if(score >= 5) {
            spawnBeams();
        }

        if(score >= 10) {
            spawnRobots();
        }

        console.log(score);
        
        if (robotGroup.isTouching(ironman)||badBeamGroup.isTouching(ironman)) {
            gameState = "end";
        }
    }
    else if (gameState === "end") {
        ironman.velocityY = 0;
        sky.velocityY = 0;
    }
    drawSprites();
}

function spawnRobots() {
    if (frameCount % 60 === 0) {
        var robot = createSprite(600,-100,40,10);
        robot.x = Math.round(random(1800,40));
        robot.addImage(robotImg);
        robot.scale = 0.3;
        robot.velocityY = (6);
        robot.lifetime = 200;
        robot.depth = ironman.depth;
        ironman.depth = ironman.depth + 1;
        robotGroup.add(robot);
    }
}

function spawnBeams() {
    if (frameCount % 80 === 0) {
        var badBeam = createSprite(600,-100,40,10);
        badBeam.x = Math.round(random(1800,40));
        badBeam.addImage(beamImg);
        badBeam.scale = 0.05;
        badBeam.velocityY = (10);
        badBeam.lifetime = 200;
        badBeam.depth = ironman.depth;
        ironman.depth = ironman.depth + 1;
        badBeamGroup.add(badBeam);
    }
}

function shootBeam() {
    beam = createSprite(150,width/2,50,20);
    beam.y=ironman.y-20;
    beam.x=ironman.x-20;
    beam.addImage(beamImg);
    beam.scale = 0.05;
    beam.velocityY = -10;
    beamGroup.add(beam);
}

function robotHit() {
    beamGroup.destroyEach();
    robotGroup.destroyEach();
    boom = createSprite(beam.x,beam.y-100,50,50);
    boom.addImage(boomImg);
    boom.life=20
    boom.scale = 0.7;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
  
function hide() {
    play.visible = false;
    titleScreen.visible = false;
    gameState = "play";
}