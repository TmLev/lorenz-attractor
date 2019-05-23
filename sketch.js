let x = 0.01;
let y = 0.01;
let z = 0.01;

let dt = 0.005;

let sigma = 10;
let rho   = 28;
let beta  = 8 / 3;

let sliderSigma;
let sliderRho;
let sliderBeta;

let pointsCount = 7000;
let partsCount = 200;
let particlesCount = 50;
let sliderPointsCount;

let model;

let easycam;
let points = new Array();
let particles = new Array();

function sliderUpdate() {
    model.resetCoordinates(x, y, z);
    points = model.drawPoints(pointsCount, particlesCount);
    center = model.getCenterOfMass();
    easycam.setCenter(center, 0);
}

function changeSigma() {
    model.sigma = sliderSigma.value();
    sliderUpdate();
}

function changeRho() {
    model.rho = sliderRho.value();
    sliderUpdate();
}

function changeBeta() {
    model.beta = sliderBeta.value();
    sliderUpdate();
}

function changePointsCount() {
    pointsCount = sliderPointsCount.value();
    sliderUpdate();
}

function setup() {
    createCanvas(windowWidth - 100, 500, WEBGL);
    colorMode(RGB);

    model = new LorenzAttractor(x, y, z, dt, sigma, rho, beta);
    points = model.drawPoints(pointsCount, particlesCount);

    easycam = createEasyCam(p5.RendererGL);
    center = model.getCenterOfMass();
    easycam.setCenter(center, 0);

    sliderSigma = createSlider(0, 20,  sigma, 0.001);
    sliderRho   = createSlider(0, 100, rho,   0.001);
    sliderBeta  = createSlider(0, 20,  beta,  0.001);

    sliderSigma.input(changeSigma);
    sliderRho.input(changeRho);
    sliderBeta.input(changeBeta);

    //sliderPointsCount = createSlider(1000, 10000, pointsCount, 100);

    //sliderPointsCount.input(changePointsCount);
}

function draw() {
    background(0);

    scale(6);
    noFill();

    for (let part = 0; part < partsCount; ++part) {
        let v = points[part];
        stroke(100 + 155 * Math.abs(v.x) / 15, 0, 0, 150);
        beginShape();
        for (let i = part * (pointsCount / partsCount); i <= Math.min((part + 1) * (pointsCount / partsCount), pointsCount - 1); ++i) {
            vertex(points[i].x, points[i].y, points[i].z);
        }
        endShape();
    }

    stroke(255, 255, 255);
    for (let p of model.drawParticles()) {
        push();
        let coordinates = p.getCoordinates()
        translate(coordinates[0], coordinates[1], coordinates[2]);
        sphere(0.2);
        pop();
    }
}