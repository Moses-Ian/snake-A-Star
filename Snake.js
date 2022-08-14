function Snake() {
	this.x = 0;
	this.y = 0;
	this.xspeed = 1;
	this.yspeed = 0;
	this.length = 1;
	this.tail = [createVector(this.x, this.y)];
	this.previous = {x: 0, y: 0};
	this.loopCounter = 0;
	// debug
	this.length = 150;
	this.tail = new Array(this.length).fill(createVector(this.x, this.y));
	
	this.dir = (x, y) => {
		this.xspeed = x;
		this.yspeed = y;
	}
	
	this.moveTo = spot => {
		try {
			this.dir(spot.x - this.x, spot.y - this.y);
		} catch (err) {
			console.error(err);
			console.log(spot);
			noLoop();
		}
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
		
		if (bestDirSoFar.points === 0)
			noLoop();
		nextSpot = grid[this.x + bestDirSoFar.x][this.y + bestDirSoFar.y];
		return [nextSpot, nextSpot];
		
		// if we truly have nowhere to go, we're dead
		noLoop();
	}
	
	this.checkDir = (xspeed, yspeed) => {
		let dir = {
			x: xspeed,
			y: yspeed,
			points: 0
		};
		try {
			nextSpot = grid[this.x + dir.x][this.y + dir.y];
			if (!nextSpot.wall) {
				dir.points = 1;
				let path = findPath({
					start: nextSpot,
					end: tailSpot(),
					walls: [nextSpot, headSpot()],
				});
				if (path.length !== 0) {
					dir.points = 2;
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
		
		this.tail[this.length-1] = createVector(this.x, this.y);
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
				console.log('death');
				noLoop();
			}
		}
	}
	
	this.show = () => {
		fill(255);
		for (let i=1; i < this.tail.length; i++)
			rect(this.tail[i].x * resolution, this.tail[i].y * resolution, resolution, resolution);
		grid[snake.tail[0].x][snake.tail[0].y].show(color(255, 0, 255));
	}
}