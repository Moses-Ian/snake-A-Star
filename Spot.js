function Spot(x, y) {
	this.x = x;
	this.y = y;
	this.f = 0;
	this.g = 0; 
	this.h = 0;
	this.neighbors = [];
	this.previous;
	this.wall = false;
	
	this.addNeighbors = () => {
		if (x < cols-1) this.neighbors.push(grid[this.x+1][this.y]);
		if (x > 0)      this.neighbors.push(grid[this.x-1][this.y]);
		if (y < rows-1) this.neighbors.push(grid[this.x][this.y+1]);
		if (y > 0)      this.neighbors.push(grid[this.x][this.y-1]);
	}
	
	this.restart = () => {
		this.f = 0;
		this.g = 0;
		this.h = 0;
		this.previous = undefined;
		this.wall = false;
	}
	
	this.show = (color=51) => {
		fill(color);
		rect(this.x * resolution, this.y * resolution, resolution, resolution);
	}
	
}