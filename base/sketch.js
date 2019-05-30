let sketchHeader = function (p) {
    p.model = null;

    p.x = 0.01;
    p.y = 0;
    p.z = 1;

    p.sigma = 10;
    p.rho = 28;
    p.beta = 8 / 3;

    p.dt = 0.005;

    p.pointsCount = 5000;
    p.pointsSpeed = 5;

    p.easycam = null;
    p.points = [];

    p.canvas = null;
    let $canvas;

    p.setup = function () {
        p.canvas = p.createCanvas(704, 500, p.WEBGL);
        p.canvas.parent(p.select("#headerCanvas"));
        p.colorMode(p.RGB);

        $canvas = $("#headerCanvas");

        p.model = new LorenzAttractor(p.x, p.y, p.z, p.dt, p.sigma, p.rho, p.beta);

        p.easycam = p.createEasyCam(p.RendererGL);
        Dw.EasyCam.prototype.apply = function (n) {
            let o = this.cam;
            n = n || o.renderer,
            n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
        };

        let center = [0.46691379691537993, 0.4606035903004856, 150.187145922344996];
        let distance = 311;
        let rotation = [-0.2480524065198549, -0.1886425467149905, 0.7171889384935938, -0.6233169496259671];
        p.easycam.setCenter(center, 0);
        p.easycam.setDistance(distance, 0);
        p.easycam.setRotation(rotation, 0);
        p.easycam.removeMouseListeners();
    };

    p.draw = function () {
        if (window.scrollY > $canvas.offset().top + $canvas[0].getBoundingClientRect().height) {
            return;
        }

        for (let i = 0; i < p.pointsSpeed; ++i) {
            p.model.update();
            p.point = p.model.getCoordinates();
            p.points.push(new p5.Vector(p.point[0], p.point[1], p.point[2]));
        }

        while (p.points.length > p.pointsCount) {
            p.points.shift();
        }

        p.background(255, 255, 255);
        p.scale(6);
        p.noFill();

        p.strokeWeight(1.5);
        p.stroke(220, 0, 0, 150);

        p.beginShape();
        for (let i = 0; i < p.points.length; ++i) {
            p.vertex(p.points[i].x, p.points[i].y, p.points[i].z);
        }
        p.endShape();

    }
};

let mainSketch = function (p) {
    p.x = 0.01;
    p.y = 0;
    p.z = 1;

    p.dt = 0.005;

    p.sigma = 10;
    p.rho = 28;
    p.beta = 8 / 3;

    p.pointsCount = 10000;
    p.partsCount = 1000;
    p.particlesCount = 50;
    p.sliderPointsCount = 0;

    p.sliderSigma = null;
    p.sliderRho = null;
    p.sliderBeta = null;

    p.model = null;

    p.easycam = null;
    p.center = null;
    p.points = [];

    p.canvas = null;

    p.inputSigma = null;
    p.inputRho = null;
    p.inputBeta = null;

    function redrawModel() {
        p.model.resetCoordinates(p.x, p.y, p.z);
        p.points = p.model.drawPoints(p.pointsCount, p.particlesCount);
        p.center = p.model.getCenterOfMass();
        p.easycam.setCenter(p.center, 0);
    }

    function changeSigmaBySlider(data) {
        p.model.sigma = data.from;
        redrawModel();
    }

    function changeRhoBySlider(data) {
        p.model.rho = data.from;
        redrawModel();
    }

    function changeBetaBySlider(data) {
        p.model.beta = data.from;
        redrawModel();
    }

    function changePointsCountBySlider(data) {
        p.pointsCount = data.from;
        redrawModel();
    }

    p.changeSigmaByInput = function () {
        p.model.sigma = p.inputSigma.value();
        redrawModel();
    };

    p.setup = function () {
        p.canvas = p.createCanvas(p.windowWidth, 500, p.WEBGL);
        p.canvas.parent(p.select("#mainCanvas"));
        p.colorMode(p.RGB);

        p.model = new LorenzAttractor(p.x, p.y, p.z, p.dt, p.sigma, p.rho, p.beta);
        p.points = p.model.drawPoints(p.pointsCount, p.particlesCount);

        p.easycam = p.createEasyCam(p.RendererGL);

        Dw.EasyCam.prototype.apply = function (n) {
            let o = this.cam;
            n = n || o.renderer,
            n && (this.camEYE = this.getPosition(this.camEYE), this.camLAT = this.getCenter(this.camLAT), this.camRUP = this.getUpVector(this.camRUP), n._curCamera.camera(this.camEYE[0], this.camEYE[1], this.camEYE[2], this.camLAT[0], this.camLAT[1], this.camLAT[2], this.camRUP[0], this.camRUP[1], this.camRUP[2]))
        };

        p.center = p.model.getCenterOfMass();
        p.easycam.setCenter(p.center, 0);
    };

    p.draw = function () {
        p.background(16, 45, 60);

        p.scale(6);
        p.noFill();

        p.push();
        p.translate(-p.model.centerX, -p.model.centerY, -p.model.centerZ);

        let deltaColor = 0.01;
        let stepColor = 0.01;

        let startRed = 112;
        let startGreen = 22;
        let startBlue = 30;

        let endRed = 235;
        let endGreen = 0;
        let endBlue = 0;

        for (let part = 0; part < p.partsCount; ++part, deltaColor += stepColor) {
            if (deltaColor > 1) {
                stepColor = -0.01;
            } else if (deltaColor < 0) {
                stepColor = 0.01;
            }

            let red = startRed + deltaColor * (endRed - startRed);
            let green = startGreen + deltaColor * (endGreen - startGreen);
            let blue = startBlue + deltaColor * (endBlue - startBlue);

            p.stroke(red, green, blue, 255);
            p.beginShape();
            for (let i = part * (p.pointsCount / p.partsCount);
                 i <= Math.min((part + 1) * (p.pointsCount / p.partsCount), p.pointsCount - 1);
                 ++i) {
                p.vertex(p.points[i].x, p.points[i].y, p.points[i].z);
            }
            p.endShape();
        }

        p.stroke(255, 255, 255);
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

p5.disableFriendlyErrors = true;

let firstP5 = new p5(sketchHeader);
//let secondP5 = new p5(mainSketch);