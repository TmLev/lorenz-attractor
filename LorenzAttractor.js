class LorenzAttractor {
    constructor(x, y, z, dt, sigma, rho, beta) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.dt = dt;

        this.sigma = sigma;
        this.rho   = rho;
        this.beta  = beta;
    }

    getDxDt() {
        return this.sigma * (this.y - this.x);
    }

    getDyDt() {
        return this.x * (this.rho - this.z) - this.y;
    }

    getDzDt() {
        return this.x * this.y - this.beta * this.z;
    }

    update() {
        this.x += this.getDxDt() * this.dt;
        this.y += this.getDyDt() * this.dt;
        this.z += this.getDzDt() * this.dt;
    }

    resetCoordinates(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}