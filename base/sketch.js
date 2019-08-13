p5.disableFriendlyErrors = false;

let pageFormatter = function (p) {
    p.setup = function () {
        p.noCanvas();

        let $headerNavigation = $(".nav");
        $headerNavigation[0].innerHTML = "<a href=\" https://github.com/tmlev/ \">Lev Khoroshansky</a>";

        let logo = p.select(".logo");
        logo.html(
            'HSE FCS AMI'
        );
    };
};

let sketchHeader = function (p) {
    let model = null;

    let x = 0;
    let y = 1;
    let z = 0;

    let sigma = 10;
    let rho = 28;
    let beta = 8 / 3;

    let dt = 0.005;

    let particlesCount = 200;

    let easycam = null;

    let particles = [];
    let canvas = null;
    let $canvas;

    p.setup = function () {
        canvas = p.createCanvas(p.min(window.innerWidth, 704), 450, p.WEBGL);
        canvas.parent(p.select("#headerCanvas"));
        p.colorMode(p.RGB);

        $canvas = $("#headerCanvas");

        model = new LorenzAttractor(x, y, z, dt, sigma, rho, beta);

        let randomMin = -75;
        let randomMax = 75;

        for (let i = 0; i < particlesCount; ++i) {
            particles.push(new p5.Vector(p.random(randomMin, randomMax),
                p.random(randomMin, randomMax),
                p.random(randomMin, randomMax)));
        }

        easycam = p.createEasyCam(p.RendererGL);
        Dw.EasyCam.prototype.apply = function (n) {
            let o = this.cam;
            n = n || o.renderer,
            n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
        };

        let center = [0.46691379691537993, 0.4606035903004856, 150.187145922344996];
        let distance = 250;
        let rotation = [-0.2480524065198549, -0.1886425467149905, 0.7171889384935938, -0.6233169496259671];
        easycam.setCenter(center, 0);
        easycam.setDistance(distance, 0);
        easycam.setRotation(rotation, 0);
        easycam.removeMouseListeners();
    };

    p.draw = function () {
        if (window.scrollY > $canvas.offset().top + $canvas[0].getBoundingClientRect().height) {
            return;
        }

        for (let i = 0; i < particlesCount; ++i) {
            let x = particles[i].x;
            let y = particles[i].y;
            let z = particles[i].z;
            particles[i].x += model.getDxDt(x, y, z) * dt;
            particles[i].y += model.getDyDt(x, y, z) * dt;
            particles[i].z += model.getDzDt(x, y, z) * dt;
        }

        p.background(255, 255, 255);
        p.scale(6);
        p.stroke(220, 0, 0, 150);

        for (let i = 0; i < particles.length; ++i) {
            p.push();
            p.translate(particles[i].x, particles[i].y, particles[i].z);
            p.sphere(0.5);
            p.pop();
        }
    };
};

let twoClosePoints = function (p) {
    let firstModel = null;
    let secondModel = null;

    let x = 0;
    let y = 1;
    let z = 1;

    let epsilonX = 0;
    let epsilonY = 0;
    let epsilonZ = 0.1;

    let sigma = 10;
    let rho = 28;
    let beta = 8 / 3;

    let dt = 0.005;

    let pointsCount = 3000;
    let pointsSpeed = 5;

    let easycam = null;

    let firstPoints = [];
    let secondPoints = [];
    let canvas = null;
    let $canvas;

    let zoomSlider = null;
    let currentZoom = 0;

    p.setup = function () {
        canvas = p.createCanvas(p.min(window.innerWidth, 700), 450, p.WEBGL);
        canvas.parent(p.select("#twoClosePointsCompare"));
        p.colorMode(p.RGB);

        $canvas = $("#twoClosePointsCompare");

        zoomSlider = p.createSlider(-200, 300, 0, 0.1);
        zoomSlider.position(5, 5);
        zoomSlider.parent(p.select("#twoClosePointsCompare"));

        firstModel = new LorenzAttractor(x, y, z, dt, sigma, rho, beta);
        secondModel = new LorenzAttractor(x + epsilonX, y + epsilonY, z + epsilonZ, dt, sigma, rho, beta);

        easycam = p.createEasyCam(p.RendererGL);
        Dw.EasyCam.prototype.apply = function (n) {
            let o = this.cam;
            n = n || o.renderer,
            n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
        };

        let center = [0.46691379691537993, 0.4606035903004856, 150.187145922344996];
        let distance = 350;
        let rotation = [-0.2480524065198549, -0.1886425467149905, 0.7171889384935938, -0.6233169496259671];
        easycam.setCenter(center, 0);
        easycam.setDistance(distance, 0);
        easycam.setRotation(rotation, 0);
        easycam.removeMouseListeners();
    };

    p.draw = function () {
        if (window.scrollY > $canvas.offset().top + $canvas[0].getBoundingClientRect().height ||
            window.scrollY + window.innerHeight < $canvas.offset().top) {
            return;
        }

        if (currentZoom !== zoomSlider.value()) {
            easycam.zoom(currentZoom - zoomSlider.value());
            currentZoom = zoomSlider.value();
        }

        for (let i = 0; i < pointsSpeed; ++i) {
            firstModel.update();
            let point = firstModel.getCoordinates();
            firstPoints.push(new p5.Vector(point[0], point[1], point[2]));

            secondModel.update();
            point = secondModel.getCoordinates();
            secondPoints.push(new p5.Vector(point[0], point[1], point[2]));
        }

        while (firstPoints.length > pointsCount) {
            firstPoints.shift();
            secondPoints.shift();
        }

        p.background(255, 255, 255);
        p.scale(6);
        p.noFill();

        p.strokeWeight(1.5);
        p.stroke(61, 129, 211, 200);

        p.beginShape();
        for (let i = 0; i < firstPoints.length; ++i) {
            p.vertex(firstPoints[i].x, firstPoints[i].y, firstPoints[i].z);
        }
        p.endShape();

        p.stroke(255, 102, 1, 200);
        p.beginShape();
        for (let i = 0; i < secondPoints.length; ++i) {
            p.vertex(secondPoints[i].x, secondPoints[i].y, secondPoints[i].z);
        }
        p.endShape();
    };
};

let twoFarPoints = function (p) {
    let firstModel = null;
    let secondModel = null;

    let x = -25; 
    let y = 20; 
    let z = -15;

    let epsilonX = 10;
    let epsilonY = 20;
    let epsilonZ = 30;

    let sigma = 10;
    let rho = 28;
    let beta = 8 / 3;

    let dt = 0.005;

    let pointsCount = 3000;
    let pointsSpeed = 5;

    let easycam = null;

    let firstPoints = [];
    let secondPoints = [];
    let canvas = null;
    let $canvas;

    let zoomSlider = null;
    let currentZoom = 0;

    p.setup = function () {
        canvas = p.createCanvas(p.min(window.innerWidth, 700), 450, p.WEBGL);
        canvas.parent(p.select("#twoFarPointsCompare"));
        p.colorMode(p.RGB);

        $canvas = $("#twoFarPointsCompare");

        zoomSlider = p.createSlider(-200, 300, -200, 0.1);
        zoomSlider.position(5, 5);
        zoomSlider.parent(p.select("#twoFarPointsCompare"));

        firstModel = new LorenzAttractor(x, y, z, dt, sigma, rho, beta);
        secondModel = new LorenzAttractor(x + epsilonX, y + epsilonY, z + epsilonZ, dt, sigma, rho, beta);

        easycam = p.createEasyCam(p.RendererGL);
        Dw.EasyCam.prototype.apply = function (n) {
            let o = this.cam;
            n = n || o.renderer,
            n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
        };

        let center = [0.46691379691537993, 0.4606035903004856, 150.187145922344996];
        let distance = 350;
        let rotation = [-0.2480524065198549, -0.1886425467149905, 0.7171889384935938, -0.6233169496259671];
        easycam.setCenter(center, 0);
        easycam.setDistance(distance, 0);
        easycam.setRotation(rotation, 0);
        easycam.removeMouseListeners();
    };

    p.draw = function () {
        if (window.scrollY > $canvas.offset().top + $canvas[0].getBoundingClientRect().height ||
            window.scrollY + window.innerHeight < $canvas.offset().top) {
            return;
        }

        if (currentZoom !== zoomSlider.value()) {
            easycam.zoom(currentZoom - zoomSlider.value());
            currentZoom = zoomSlider.value();
        }

        for (let i = 0; i < pointsSpeed; ++i) {
            firstModel.update();
            let point = firstModel.getCoordinates();
            firstPoints.push(new p5.Vector(point[0], point[1], point[2]));

            secondModel.update();
            point = secondModel.getCoordinates();
            secondPoints.push(new p5.Vector(point[0], point[1], point[2]));
        }

        while (firstPoints.length > pointsCount) {
            firstPoints.shift();
            secondPoints.shift();
        }

        p.background(255, 255, 255);
        p.scale(6);
        p.noFill();

        p.strokeWeight(1.5);
        p.stroke(61, 129, 211, 200);

        p.beginShape();
        for (let i = 0; i < firstPoints.length; ++i) {
            p.vertex(firstPoints[i].x, firstPoints[i].y, firstPoints[i].z);
        }
        p.endShape();

        p.stroke(255, 102, 1, 200);
        p.beginShape();
        for (let i = 0; i < secondPoints.length; ++i) {
            p.vertex(secondPoints[i].x, secondPoints[i].y, secondPoints[i].z);
        }
        p.endShape();
    };
};

let mainSketch = function (p) {
    let x = 0.01; 
    let y = 0; 
    let z = 1;

    let dt = 0.01;

    p.sigma = 10;
    p.rho = 28;
    p.beta = 8 / 3;

    p.pointsCount = 7000;
    p.particlesCount = 50;
    p.sliderPointsCount = 0;

    let sliderSigma = null;
    let sliderRho = null;
    let sliderBeta = null;
    let sliderPointsCount = null;

    p.model = null;

    p.easycam = null;
    p.center = null;
    p.points = [];

    p.canvas = null;
    let $canvas;

    function redrawModel() {
        p.model.resetCoordinates(x, y, z);
        p.points = p.model.drawPoints(p.pointsCount, p.particlesCount);
        p.center = p.model.getCenterOfMass();
        p.easycam.setCenter(p.center, 0);
    }

    function changeSigmaBySlider() {
        p.model.sigma = sliderSigma.value();
        redrawModel();
    }

    function changeRhoBySlider() {
        p.model.rho = sliderRho.value();
        redrawModel();
    }

    function changeBetaBySlider() {
        p.model.beta = sliderBeta.value();
        redrawModel();
    }

    function changePointsCountBySlider() {
        p.pointsCount = sliderPointsCount.value();
        redrawModel();
    }

    p.setup = function () {
        p.canvas = p.createCanvas(p.min(p.windowWidth, 700), 500, p.WEBGL);
        p.canvas.parent(p.select("#mainCanvas"));
        p.colorMode(p.RGB);

        $canvas = $("#mainCanvas");

        sliderSigma = p.createSlider(1, 50, p.sigma, 0.1);
        sliderRho = p.createSlider(0.1, 45, p.rho, 0.1);
        sliderBeta = p.createSlider(0.1, 20, p.beta, 0.1);
        sliderPointsCount = p.createSlider(5000, 10000, p.pointsCount, 100);

        sliderSigma.parent(p.select("#mainCanvas"));
        sliderRho.parent(p.select("#mainCanvas"));
        sliderBeta.parent(p.select("#mainCanvas"));
        sliderPointsCount.parent(p.select("#mainCanvas"));

        sliderSigma.position(5, 5);
        sliderRho.position(5, 25);
        sliderBeta.position(5, 45);
        sliderPointsCount.position(5, 65);

        sliderSigma.input(changeSigmaBySlider);
        sliderRho.input(changeRhoBySlider);
        sliderBeta.input(changeBetaBySlider);
        sliderPointsCount.input(changePointsCountBySlider);

        p.model = new LorenzAttractor(x, y, z, dt, p.sigma, p.rho, p.beta);
        p.points = p.model.drawPoints(p.pointsCount, p.particlesCount);

        p.easycam = p.createEasyCam(p.RendererGL);

        Dw.EasyCam.prototype.apply = function (n) {
            let o = this.cam;
            n = n || o.renderer,
            n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
        };

        p.center = p.model.getCenterOfMass();
        p.easycam.setCenter(p.center, 0);
        let distance = 350;
        let rotation = [-0.2480524065198549, -0.1886425467149905, 0.7171889384935938, -0.6233169496259671];
        p.easycam.setDistance(distance, 0);
        p.easycam.setRotation(rotation, 0);
    };

    p.draw = function () {
        if (window.scrollY > $canvas.offset().top + $canvas[0].getBoundingClientRect().height ||
            window.scrollY + window.innerHeight < $canvas.offset().top) {
            return;
        }

        p.background(255, 255, 255);

        p.scale(6);
        p.noFill();

        p.push();
        p.translate(-p.model.centerX, -p.model.centerY, -p.model.centerZ);

        p.stroke(61, 129, 211, 200);
        p.beginShape();
        for (let i = 0; i < p.pointsCount; ++i) {
            p.vertex(p.points[i].x, p.points[i].y, p.points[i].z);
        }
        p.endShape();

        p.stroke(255, 102, 1, 200);
        for (let v of p.model.drawParticles()) {
            p.push();
            let coordinates = v.getCoordinates();
            p.translate(coordinates[0], coordinates[1], coordinates[2]);
            p.sphere(0.3);
            p.pop();
        }
        p.pop();
    }
};

let zeroP5 = new p5(pageFormatter);
let firstP5 = new p5(sketchHeader);
let secondP5 = new p5(twoClosePoints);
let thirdP5 = new p5(twoFarPoints);
let fourthP5 = new p5(mainSketch);

