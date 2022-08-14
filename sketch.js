let snake;
let food;

var resolution = 20;
let rows, cols;

function setup() {
  // put setup code here
	let canvas = createCanvas(500, 500);
	canvas.parent('sketch-container');
	
	rows = height / resolution;
	cols = width / resolution;
	
	snake = new Snake();
	food = setFoodLocation();
	
	frameRate(10);
}

function draw() {
  // put drawing code here
	background(51);
	snake.update();
	snake.death();
	if (snake.eat(food)) {
		food = setFoodLocation();
	}
	snake.show();
	
	fill(255, 0, 100);
	rect(food.x * resolution, food.y * resolution, resolution, resolution);
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