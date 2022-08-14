let snake;
var food;

var resolution = 20;
let rows, cols;

var grid;
let openSet = [];
let closedSet = [];

var foodSpot = () => grid[food.x][food.y];
var headSpot = () => grid[snake.x][snake.y];
var tailSpot = () => grid[snake.tail[0].x][snake.tail[0].y];
var gridSpot = obj => grid[obj.x][obj.y];

var TOO_CLOSE = 5;

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
	
	
	frameRate(20);
}

function draw() {
  // put drawing code here
	restart();

	// find a path to the food
	let path = findPath({
		end: foodSpot()
	})
	
	let pathFoodTail = [];
	if (path.length !== 0) {
		// there's a path to the apple
		// make sure there's a path from the food to the tail
		pathFoodTail = findPath({
			start: foodSpot(),
			end: tailSpot(),
			walls: path,
			allow: [tailSpot()]
		});

		if (pathFoodTail.length === 0) {
			// console.log('now');
			// noLoop();
		}
	
	}
	
	if (path.length === 0 || pathFoodTail.length === 0) {
		// if we can't find the food, try to find the tail
		restart();
		path = findPath({
			end: tailSpot(),
			allow: [tailSpot()]
		});
		// console.log(path,);
		if (path.length <= TOO_CLOSE) {
			// console.log(path);
			path = snake.stall();
			// console.log(path);
		}
		snake.moveTo(path.at(-2));
	} else {
		// move in the direction of the best path
		snake.moveTo(path.at(-2));
	}
		
	snake.update();
	snake.death();
	if (snake.eat(food)) {
		food = setFoodLocation();
	}

	// draw
	background(51);
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
	
	// for (let i=0; i<pathFoodTail.length; i++)
		// pathFoodTail[i].show(color(0, 255, 255));
	
	snake.show();
	grid[snake.tail[0].x][snake.tail[0].y].show(color(255, 0, 255));
	
	// food.show()
	fill(255, 0, 100);
	rect(food.x * resolution, food.y * resolution, resolution, resolution);
	
	// if ( current === end)
		// noLoop();
	
	// for (let i=0; i<snake.tail.length; i++)
		// for (let j=0; j<pathFoodTail.length; j++)
			// if (snake.tail[i].x === pathFoodTail[j].x && snake.tail[i].y === pathFoodTail[j])
				// grid[snake.tail[i].x][snake.tail[i].y].show(color(255, 0, 0));
	
	
	
}

function findPath({start=headSpot(), end, walls=[], allow=[]}) {
	restart();
	// calculate the best path
	let current;
	let path = [];
	// start = grid[snake.x][snake.y];
	// let end = grid[food.x][food.y];
	for (let i=0; i<walls.length; i++)
		gridSpot(walls[i]).wall = true;
	for (let i=0; i<allow.length; i++)
		gridSpot(allow[i]).wall = false;
	
	openSet.push(start);

	while (openSet.length > 0) {
		// find the item in the closed set with the lowest f
		let lowest = 0;
		for (let i=0; i<openSet.length; i++)
			if (openSet[i].f < openSet[lowest].f)
				lowest = i;
		
		current = openSet[lowest];
		
		// if the best is the end, we're done
		if (current === end) {
			// console.log("done");
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
	
	return path;
}

function heuristic(neighbor, previous, end) {
	// taxicab distance
	let d = abs(neighbor.x - end.x) + abs(neighbor.y - end.y);
	// do i have to turn later on
	let turn = (previous && neighbor.x !== previous.x && neighbor.y !== previous.y) ? 1.1 : 1;
	// do i have to turn right now
	let turnNow = (neighbor.g === 1 && neighbor.x !== snake.previous.x && neighbor.y !== snake.previous.y) ? 1.1 : 1;
	return d * turn * turnNow;
}

function restart() {
	for (let i=0; i<rows; i++)
		for (let j=0; j<cols; j++)
			grid[i][j].restart();

	for (let i=0; i<snake.tail.length-1; i++)
		grid[snake.tail[i].x][snake.tail[i].y].wall = true;
	
	openSet = [];
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

const setFoodLocation = () => {
	let attempt;
	let collide;
	do {
		attempt = createVector(floor(random(cols)), floor(random(rows)));
		collide = false;
		for (let i=0; i<snake.tail.length; i++)
			if (snake.tail[i].x === attempt.x && snake.tail[i].y === attempt.y) {
				collide = true;
				break;
			}
	} while (collide);
	return attempt;
}

