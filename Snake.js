const UP = 0;
const RGT = 1;
const BTM = 2;
const LFT = 3;

function Snake() {
	this.x = 0;
	this.y = 0;
	this.xspeed = 1;
	this.yspeed = 0;
	this.length = 1;
	this.tail = [new Body(this.x, this.y)];
	this.previous = {x: 0, y: 0};
	this.loopCounter = 0;
	// debug
	// this.length = 150;
	// this.tail = new Array(this.length).fill(createVector(this.x, this.y));
	
	this.dir = (x, y) => {
		this.xspeed = x;
		this.yspeed = y;
	}
	
	this.moveTo = spot => {
		this.dir(spot.x - this.x, spot.y - this.y);
	}
	
	this.stall = () => {
		restart();
		
		let nextSpot;
		let bestDirSoFar = {
			x: 0,
			y: 0,
			points: 0
		};
		// see if we can go straight
		let dir = this.checkDir(this.xspeed, this.yspeed);
		if (dir.points > bestDirSoFar.points)
			bestDirSoFar = dir;
		
		// see if we can turn right
		dir = this.checkDir(-this.yspeed, this.xspeed);
		if (dir.points > bestDirSoFar.points)
			bestDirSoFar = dir;
		
		// see if we can turn left
		dir = this.checkDir(this.yspeed, -this.xspeed);
		if (dir.points > bestDirSoFar.points)
			bestDirSoFar = dir;
		
		nextSpot = grid[this.x + bestDirSoFar.x][this.y + bestDirSoFar.y];
		return [nextSpot, nextSpot];
	}
	
	this.checkDir = (xspeed, yspeed) => {
		let dir = {
			x: xspeed,
			y: yspeed,
			points: 0
		};
		try {
			nextSpot = grid[this.x + dir.x][this.y + dir.y];
			if (nextSpot.x === this.tail[0].x && nextSpot.y === this.tail[0].y) {
				dir.points = 0.5;
				return dir;
			}
			if (!nextSpot.wall) {
				dir.points = 1;
				let path = findPath({
					start: nextSpot,
					end: tailSpot(),
					walls: [nextSpot, headSpot()],
				});
				if (path.length !== 0) {
					dir.points = 2 + path.length * 0.1;
					if (path.length > TOO_CLOSE)
						dir.points = 3;
				}
			}
		} catch (err) { }
		return dir;
	}

	this.update = () => {
		for (let i = 0; i < this.tail.length-1; i++)
			this.tail[i] = this.tail[i+1].copy();
		
		this.previous.x = this.x;
		this.previous.y = this.y;
		this.x += this.xspeed;
		this.y += this.yspeed;
		
		this.x = constrain(this.x, 0, cols-1);
		this.y = constrain(this.y, 0, rows-1);
		
		this.tail[this.length-1] = new Body(this.x, this.y);
	}
	
	this.eat = food => {
		if (this.x === food.x && this.y === food.y) {
			this.length++;
			this.loopCounter = 0;
			return true;
		}
		return false;
	}
	
	this.death = () => {
		for (let i=0; i < this.tail.length-1; i++) {
			if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
				console.log(`death: segment ${i}`);
				noLoop();
			}
		}
	}
	
	this.show = () => {
		fill(255);
		this.tail[0].reset();
		for (let i=this.tail.length-1; i >= 1; i--) {
			this.tail[i].setEdge(this.tail[i-1]);
			this.tail[i].show();
		}
		this.tail[0].show(color(255, 0, 255));
	}
}

class Body {
	
	constructor(x, y, edges) {
		this.x = x;
		this.y = y;
		this.edges = edges || [true, true, true, true];	// up right down left
	}
	
	reset = () => this.edges = [true, true, true, true];
	
	setEdge = other => {
		if (other.x > this.x) {
			this.edges[RGT] = false;
			other.edges[LFT] = false;
		}
		if (other.x < this.x) {
			this.edges[LFT] = false;
			other.edges[RGT] = false;
		}
		if (other.y > this.y) {
			this.edges[BTM] = false;
			other.edges[UP] = false;
		}
		if (other.y < this.y) {
			this.edges[UP] = false;
			other.edges[BTM] = false;
		}
		if (other.x === this.x && other.y === this.y)
			other.edges = this.edges.slice(0);
	}
	
	copy = () => new Body(this.x, this.y, this.edges.slice(0));
	
	show = color => {
		let x = this.x * resolution;
		let y = this.y * resolution;
		noStroke();
		if (color) fill(color);
		rect(x, y, resolution, resolution);
		stroke(0);
		if (this.edges[0]) line(x, y, x + resolution, y);
		if (this.edges[1]) line(x + resolution, y, x + resolution, y + resolution);
		if (this.edges[2]) line(x + resolution, y + resolution, x, y + resolution);
		if (this.edges[3]) line(x, y + resolution, x, y);
	}
}