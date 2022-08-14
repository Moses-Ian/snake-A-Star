let snake;
let food;

var resolution = 20;
let rows, cols;

var grid;
let openSet = [];
let closedSet = [];
let start;
let end;
let path = [];

function setup() {
  // put setup code here
	let canvas = createCanvas(500, 500);
	canvas.parent('sketch-container');
	
	rows = height / resolution;
	cols = width / resolution;
	
	grid = new Array(rows);
	for (let i=0; i<rows; i++)
		grid[i] = new Array(cols);
	
	for (let i=0; i<rows; i++)
		for (let j=0; j<cols; j++)
			grid[i][j] = new Spot(i, j);
	
	for (let i=0; i<rows; i++)
		for (let j=0; j<cols; j++)
			grid[i][j].addNeighbors();
	
	snake = new Snake();
	food = setFoodLocation();
	
	// should be head and food
	start = grid[snake.x][snake.y];
	end = grid[food.x][food.y];
	
	openSet.push(start);
	
	frameRate(20);
}

function draw() {
  // put drawing code here
	background(51);
	restart();

	// calculate the best path
	let current;
	while (openSet.length > 0) {
		// find the item in the closed set with the lowest f
		let lowest = 0;
		for (let i=0; i<openSet.length; i++)
			if (openSet[i].f < openSet[lowest].f)
				lowest = i;
		
		current = openSet[lowest];
		
		// if the best is the end, we're done
		if (current === end) {
			console.log("done");
			path = [];
			path.push(current);
			let temp = current;
			while (temp.previous) {
				path.push(temp.previous);
				temp = temp.previous;
			}
			break;
		}
		
		// move current from the open set to the closed set
		openSet = [...openSet.slice(0, lowest), ...openSet.slice(lowest+1)];
		closedSet.push(current);
		
		for (let i=0; i<current.neighbors.length; i++) {
			let neighbor = current.neighbors[i];
			if (!closedSet.includes(neighbor)) {
				let tentative_g = current.g + 1;
				// if this is a new node, add it
				if (!openSet.includes(neighbor) && !neighbor.wall)
					openSet.push(neighbor)
				// if this is worse than a previously checked path
				else if (tentative_g >= neighbor.g) 
					continue;
				
				// this is the best path so far
				neighbor.previous = current;
				neighbor.g = tentative_g;
				neighbor.h = heuristic(neighbor, current.previous, end);
				neighbor.f = neighbor.g + neighbor.h;
			}
		}
	}	
	// draw the grid
	// for (let i=0; i < rows; i++)
		// for (let j=0; j<cols; j++)
			// grid[i][j].show();
	
	// for (let i=0; i<closedSet.length; i++)
		// closedSet[i].show(color(255, 0, 0));
	
	// for (let i=0; i<openSet.length; i++)
		// openSet[i].show(color(0, 255, 0));
	
	// for (let i=0; i<path.length; i++)
		// path[i].show(color(0, 0, 255));
	
	// move in the direction of the best path
	snake.moveTo(path.at(-2));
	snake.update();
	snake.death();
	if (snake.eat(food)) {
		food = setFoodLocation();
	}
	snake.show();
	
	// food.show()
	fill(255, 0, 100);
	rect(food.x * resolution, food.y * resolution, resolution, resolution);
	
	// if ( current === end)
		// noLoop();
	
	
	
	
	
}

function heuristic(neighbor, previous, end) {
	// taxicab distance
	let d = abs(neighbor.x - end.x) + abs(neighbor.y - end.y);
	// do i have to turn later on
	let turn = (previous && neighbor.x !== previous.x && neighbor.y !== previous.y) ? 1.1 : 1;
	// do i have to turn right now
	let turnNow = (snake.previous && neighbor.g === 1 && neighbor.x !== snake.previous.x && neighbor.y !== snake.previous.y) ? 1.1 : 1;
	return d * turn * turnNow;
}

function restart() {
	for (let i=0; i<rows; i++)
		for (let j=0; j<cols; j++)
			grid[i][j].restart();
	
	start = grid[snake.x][snake.y];
	end = grid[food.x][food.y];
	
	openSet = [];
	openSet.push(start);
	closedSet = [];
}

function keyPressed() {
	
	switch (keyCode) {
		case UP_ARROW:
			snake.dir(0, -1);
			break;
		case DOWN_ARROW:
			snake.dir(0, 1);
			break;
		case RIGHT_ARROW:
			snake.dir(1, 0);
			break;
		case LEFT_ARROW:
			snake.dir(-1, 0);
			break;
		default:
			break;
	}
}

const setFoodLocation = () => createVector(floor(random(cols)), floor(random(rows)));