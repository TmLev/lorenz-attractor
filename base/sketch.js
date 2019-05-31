p5.disableFriendlyErrors = false;

let pageFormatter = function (p) {
    p.setup = function () {
        p.noCanvas();

        let $headerNavigation = $(".nav");
        $headerNavigation[0].innerHTML = "<a href=\" https://github.com/tmlev/ \">GitHub</a>";

        let logo = p.select(".logo");
        logo.html(
            '<svg id="svgLogo" viewBox="0 0 64 64"> </svg>' +
            'HSE FCS AMI'
        );

        let logoImage = p.createImg("https://i.imgur.com/p3fyPkL.png");
        logoImage.removeAttribute("crossorigin");
        logoImage.attribute("height", "55");
        logoImage.attribute("width", "55");
        logoImage.parent(p.select("#svgLogo"));

        // let $referenceBar = $("#references");
        // $referenceBar[0].innerHTML = "Ссылки";
    };

    p.mousePressed = function () {

    }
};

let sketchHeader0 = function (p) {
    let model = null;

    let x = 0;
    let y = 1;
    let z = 0;

    let sigma = 10;
    let rho = 28;
    let beta = 8 / 3;

    let dt = 0.005;

    let pointsCount = 5000;
    let pointsSpeed = 5;

    let easycam = null;
    let rotationAngle = 0.01;

    let points = [];
    let canvas = null;
    let $canvas;

    p.setup = function () {
        canvas = p.createCanvas(704, 450, p.WEBGL);
        canvas.parent(p.select("#headerCanvas"));
        p.colorMode(p.RGB);

        $canvas = $("#headerCanvas");

        model = new LorenzAttractor(x, y, z, dt, sigma, rho, beta);

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
        if (window.scrollY > $canvas.offset().top + $canvas[0].getBoundingClientRect().height) {
            return;
        }

        easycam.rotateY(rotationAngle);

        for (let i = 0; i < pointsSpeed; ++i) {
            model.update();
            let point = model.getCoordinates();
            points.push(new p5.Vector(point[0], point[1], point[2]));
        }

        while (points.length > pointsCount) {
            points.shift();
        }

        p.background(255, 255, 255);
        p.scale(6);
        p.noFill();

        p.strokeWeight(1.5);
        p.stroke(220, 0, 0, 150);

        p.beginShape();
        for (let i = 0; i < points.length; ++i) {
            p.vertex(points[i].x, points[i].y, points[i].z);
        }
        p.endShape();
    };
};

let sketchHeader1 = function (p) {
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
        canvas = p.createCanvas(704, 450, p.WEBGL);
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

        //easycam.rotateY(rotationAngle);

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
        canvas = p.createCanvas(700, 450, p.WEBGL);
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

let mainSketch = function (p) {
    let x = 0.01;
    let y = 0;
    let z = 1;

    let dt = 0.005;

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
        p.model.resetCoordinates(x, y, z);
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

        // let points = [];
        // let seed = 100 * p.random();
        //
        // for (let i = 0; i < 100; i++) {
        //     points[i] = new GPoint(i, 10 * p.noise(0.1 * i + seed));
        // }
        //
        // // Create a new plot and set its position on the screen
        // let plot = new GPlot(p);
        // plot.setPos(25, 25);
        //
        // // Set the plot title and the axis labels
        // plot.setPoints(points);
        // plot.getXAxis().setAxisLabelText("x axis");
        // plot.getYAxis().setAxisLabelText("y axis");
        // plot.setTitleText("A very simple example");
        //
        // // Draw it!
        // plot.defaultDraw();
    }
};

var defaultPlotSketch = function (p) {
    // Initial setup
    p.setup = function () {
        // Create the canvas
        const canvas = p.createCanvas(500, 350);
        canvas.parent(p.select("#mainCanvas"));
        p.background(150);
    };

    p.draw = function () {
        // Prepare the points for the plot
        const points = [];
        const seed = 100 * p.random();

        for (let i = 0; i < 100; i++) {
            points[i] = new GPoint(i, 10 * p.noise(0.1 * i + seed));
        }

        // Create a new plot and set its position on the screen
        const plot = new GPlot(p);
        plot.setPos(0, 0);

        // Set the plot title and the axis labels
        plot.setPoints(points);
        plot.getXAxis().setAxisLabelText("x axis");
        plot.getYAxis().setAxisLabelText("y axis");
        plot.setTitleText("A very simple example");

        // Draw it!
        plot.defaultDraw();
    }
};

let zeroP5 = new p5(pageFormatter);
let firstP5 = new p5(sketchHeader1);
let secondP5 = new p5(twoClosePoints);