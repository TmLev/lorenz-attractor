class Particle {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	update(dx, dy, dz) {
		this.x += dx;
		this.y += dy;
		this.z += dz;
	}

	getCoordinates() {
		return [this.x, this.y, this.z];
	}
}