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
		console.log('stall!');
		restart();
		
		let nextSpot;
		let oldxspeed = this.xspeed;
		let oldyspeed = this.yspeed;
		// see if we can go straight
		let bestDirSoFar = {
			x: 0,
			y: 0,
			points: 0
		};
		try {
			this.dir(oldxspeed, oldyspeed);
			nextSpot = grid[this.x + this.xspeed][this.y + this.yspeed];
			if (!nextSpot.wall) {
				let dir = {
					x: this.xspeed, 
					y: this.yspeed,
					points: 1
				};
				let path = findPath({
					start: nextSpot,
					end: tailSpot(),
					walls: [nextSpot, headSpot()],
					allow: [tailSpot()]
				});
				if (path.length !== 0) {
					dir.points = 2;
					if (path.length > TOO_CLOSE)
						dir.points = 3;
				}
				if (dir.points > bestDirSoFar.points)
					bestDirSoFar = dir;
			}
		} catch (err) { }
		
		// see if we can turn right
		try {
			this.dir(-this.yspeed, this.xspeed);
			nextSpot = grid[this.x + this.xspeed][this.y + this.yspeed];
			if (!nextSpot.wall) {
				let dir = {
					x: this.xspeed, 
					y: this.yspeed,
					points: 1
				};
				let path = findPath({
					start: nextSpot,
					end: tailSpot(),
					walls: [nextSpot, headSpot()],
					allow: [tailSpot()]
				});
				if (path.length !== 0) {
					dir.points = 2;
					if (path.length > TOO_CLOSE)
						dir.points = 3;
				}
				if (dir.points > bestDirSoFar.points)
					bestDirSoFar = dir;
			}
		} catch (err) { }
		
		// see if we can turn left
		try {
			this.dir(-this.xspeed, -this.yspeed);
			nextSpot = grid[this.x + this.xspeed][this.y + this.yspeed];
			if (!nextSpot.wall) {
				let dir = {
					x: this.xspeed, 
					y: this.yspeed,
					points: 1
				};
				let path = findPath({
					start: nextSpot,
					end: tailSpot(),
					walls: [nextSpot, headSpot()],
					allow: [tailSpot()]
				});
				if (path.length !== 0) {
					dir.points = 2;
					if (path.length > TOO_CLOSE)
						dir.points = 3;
				}
				if (dir.points > bestDirSoFar.points)
					bestDirSoFar = dir;
			}
		} catch (err) { }
		
		if (bestDirSoFar.points === 0)
			noLoop();
		nextSpot = grid[this.x + bestDirSoFar.x][this.y + bestDirSoFar.y];
		return [nextSpot, nextSpot];
		
		// if we truly have nowhere to go, we're dead
		noLoop();
	}

	this.update = () => {
		// this.preventLoop();		
		
		for (let i = 0; i < this.tail.length-1; i++)
			this.tail[i] = this.tail[i+1].copy();
		
		this.previous.x = this.x;
		this.previous.y = this.y;
		this.x += this.xspeed;
		this.y += this.yspeed;
		
		this.x = constrain(this.x, 0, cols-1);
		this.y = constrain(this.y, 0, rows-1);
		
		this.tail[this.length-1] = createVector(this.x, this.y);

		// if (this.length !== this.tail.length)
			// this.tail.push(createVector(this.x, this.y));
		
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
				// this.length = 1;
				// this.tail = [createVector(this.x, this.y)];
				console.log('death');
				noLoop();
			}
		}
	}
	
	this.preventLoop = () => {
		this.loopCounter++;
		this.loopCounter = this.loopCounter % 100;
		if (this.loopCounter === 0) {
			// save the old speed
			let oldxspeed = this.xspeed;
			let oldyspeed = this.yspeed;
			
			let nextSpot;
			
			try {
				// see if we can turn right
				this.dir(-this.yspeed, this.xspeed);
				nextSpot = grid[this.x + this.xspeed][this.y + this.yspeed];
				if (nextSpot && !nextSpot.wall) {
					// console.log('I think this is ok');
					// console.log(nextSpot);
					return;
				}
			} catch (err) { }
			
			try {
				// see if we can turn left
				this.dir(-this.xspeed, -this.yspeed);
				nextSpot = grid[this.x + this.xspeed][this.y + this.yspeed];
				if (nextSpot && !nextSpot.wall) {
					// console.log('I think this is ok');
					// console.log(nextSpot);
					return;
				}
			} catch (err) { }
			
			// we can only keep going straight;
			this.dir(oldxspeed, oldyspeed);
		}
	}
	
	this.show = () => {
		fill(255);
		for (let i=0; i < this.tail.length; i++)
			rect(this.tail[i].x * resolution, this.tail[i].y * resolution, resolution, resolution);
		// rect(this.x * resolution, this.y * resolution, resolution, resolution);
	}
}