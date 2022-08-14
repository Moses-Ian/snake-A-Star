function Snake() {
	this.x = 0;
	this.y = 0;
	this.xspeed = 1;
	this.yspeed = 0;
	this.length = 1;
	this.tail = [createVector(this.x, this.y)];
	this.previous = {x: 0, y: 0};
	// debug
	this.length = 50;
	this.tail = new Array(this.length).fill(createVector(this.x, this.y));
	
	this.dir = (x, y) => {
		this.xspeed = x;
		this.yspeed = y;
	}
	
	this.moveTo = spot => {
		try {
			this.xspeed = spot.x - this.x;
			this.yspeed = spot.y - this.y;
		} catch (err) {
			console.error(err);
			console.log(spot);
			noLoop();
		}
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

		// if (this.length !== this.tail.length)
			// this.tail.push(createVector(this.x, this.y));
		
	}
	
	this.eat = food => {
		if (this.x === food.x && this.y === food.y) {
			this.length++;
			return true;
			
		}
		return false;
	}
	
	this.death = () => {
		for (let i=0; i < this.tail.length-1; i++) {
			if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
				this.length = 1;
				this.tail = [createVector(this.x, this.y)];
			}
		}
	}
	
	this.show = () => {
		fill(255);
		for (let i=0; i < this.tail.length; i++)
			rect(this.tail[i].x * resolution, this.tail[i].y * resolution, resolution, resolution);
		// rect(this.x * resolution, this.y * resolution, resolution, resolution);
	}
}