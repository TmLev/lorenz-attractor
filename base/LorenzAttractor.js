class LorenzAttractor {
    constructor(x, y, z, dt, sigma, rho, beta) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.dt = dt;

        this.sigma = sigma;
        this.rho = rho;
        this.beta = beta;

        this.centerX = x;
        this.centerY = y;
        this.centerZ = z;

        this.totalMass = 1;

        this.minVelocity = 10000000;
        this.maxVelocity = 0;

        this.particles = [];
    }

    getCoordinates() {
        return [this.x, this.y, this.z];
    }

    getCenterOfMass() {
        return [this.centerX, this.centerY, this.centerZ];
    }

    getParticles() {
        return this.particles;
    }

    getDxDt(x, y, z) {
        return this.sigma * (y - x);
    }

    getDyDt(x, y, z) {
        return x * (this.rho - z) - y;
    }

    getDzDt(x, y, z) {
        return x * y - this.beta * z;
    }

    getVelocity(x, y, z) {
        let dx = this.getDxDt(x, y, z) * this.dt;
        let dy = this.getDyDt(x, y, z) * this.dt;
        let dz = this.getDzDt(x, y, z) * this.dt;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    getRangeVelocity() {
        return this.maxVelocity - this.minVelocity;
    }

    update() {
        let x = this.x;
        let y = this.y;
        let z = this.z;
        this.x += this.getDxDt(x, y, z) * this.dt;
        this.y += this.getDyDt(x, y, z) * this.dt;
        this.z += this.getDzDt(x, y, z) * this.dt;
        this.centerX += this.x;
        this.centerY += this.y;
        this.centerZ += this.z;
    }

    resetCoordinates(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    drawPoints(pointsCount, particlesCount) {
        this.totalMass = pointsCount;

        let points = [];
        this.particles.length = 0;

        let particlesStep = pointsCount / particlesCount;

        for (let i = 0; i < pointsCount; ++i) {
            this.update();
            points.push(new p5.Vector(this.x, this.y, this.z));

            let velocity = this.getVelocity(this.x, this.y, this.z);
            this.minVelocity = Math.min(this.minVelocity, velocity);
            this.maxVelocity = Math.max(this.maxVelocity, velocity);


            if (i % particlesStep === 0) {
                this.particles.push(new Particle(this.x, this.y, this.z));
            }
        }

        this.centerX /= this.totalMass;
        this.centerY /= this.totalMass;
        this.centerZ /= this.totalMass;

        return points;
    }

    drawParticles() {
        let result = [];

        for (let i = 0; i < this.particles.length; ++i) {
            let p = this.particles[i];
            p.update(this.getDxDt(p.x, p.y, p.z) * this.dt,
                     this.getDyDt(p.x, p.y, p.z) * this.dt,
                     this.getDzDt(p.x, p.y, p.z) * this.dt);
            result.push(p);
        }

        return result;
    }
}