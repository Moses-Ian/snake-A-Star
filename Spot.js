function Spot(x, y) {
	this.x = x;	// col
	this.y = y; // row
	this.f = 0;
	this.g = 0; 
	this.h = 0;
	this.neighbors = [];
	this.previous;
	this.wall = false;
	
	this.addNeighbors = () => {
		// if (x < cols-1) this.neighbors.push(grid[this.x+1][this.y]);
		// if (x > 0)      this.neighbors.push(grid[this.x-1][this.y]);
		// if (y < rows-1) this.neighbors.push(grid[this.x][this.y+1]);
		// if (y > 0)      this.neighbors.push(grid[this.x][this.y-1]);
		if (this.x == cols-1 && this.y < rows-1)
			this.neighbors.push(grid[this.x][this.y+1]);
		
		if (this.x < cols-1 && this.y%2 == 0)
			this.neighbors.push(grid[this.x+1][this.y]);
		
		if (this.x < cols-1 && this.x > 0 && this.y%2 == 1)
			this.neighbors.push(grid[this.x-1][this.y]);
		
		if (this.x < cols-1 && this.y > 0)
			this.neighbors.push(grid[this.x][this.y-1]);
		
		if (this.x == cols-1 && this.y == rows-1) 
			this.neighbors.push(grid[this.x-1][this.y]);
		
	}
	
	this.restart = () => {
		this.f = 0;
		this.g = 0;
		this.h = 0;
		this.previous = undefined;
		this.wall = false;
	}
	
	this.show = (color=255) => {
		fill(color);
		noStroke();
		rect(this.x * resolution, this.y * resolution, resolution, resolution);
	}
	
	this.showArrow = () => {
		stroke(0);
		this.neighbors.forEach(n => {
			let p = createVector((this.x - n.x) * resolution, (this.y - n.y) * resolution);
			p.mult(.5);
			line(
				this.x * resolution + resolution/2,       this.y * resolution + resolution/2,
				this.x * resolution + resolution/2 + p.x, this.y * resolution + resolution/2 + p.y
			);
		});
	}
}