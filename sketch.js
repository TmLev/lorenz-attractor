let x = 1;
let y = 0;
let z = 0;

let dt = 0.01;

let sliderDt;

let sigma = 10;
let rho   = 28;
let beta  = 8 / 3;

let sliderSigma;
let sliderRho;
let sliderBeta;

let model;

let points = new Array();

function changeSigma() {
    model.sigma = sliderSigma.value();
    model.resetCoordinates(x, y, z);
    points.length = 0;
}

function changeRho() {
    model.rho = sliderRho.value();
    model.resetCoordinates(x, y, z);
    points.length = 0;
}

function changeBeta() {
    model.beta = sliderBeta.value();
    model.resetCoordinates(x, y, z);
    points.length = 0;
}

function setup() {
    createCanvas(windowWidth, 600, WEBGL);
    colorMode(HSB);

    model = new LorenzAttractor(x, y, z, dt, sigma, rho, beta);

    sliderSigma = createSlider(0, 20,  10,    0.001);
    sliderRho   = createSlider(0, 100, 28,    0.001);
    sliderBeta  = createSlider(0, 20,  8 / 3, 0.001);

    sliderSigma.input(changeSigma);
    sliderRho.input(changeRho);
    sliderBeta.input(changeBeta);
}

function draw() {
    background(0);

    model.update();

    points.push(new p5.Vector(model.x, model.y, model.z));

    orbitControl();

    stroke(255);
    noFill();

    beginShape();
    for (let v of points) {
        vertex(v.x, v.y, v.z);
    }
    endShape();

    if (points.length >= 5000) {
        points.shift();
    }
}