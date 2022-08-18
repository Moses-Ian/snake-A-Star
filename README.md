# Snake with A* Algorithm in p5.js

## Description

This is the classic game Snake, played by an AI developed by me.

This project was developed because I saw numerous snake AIs, and I figured I can do better. I realize that the ultimate goal is to develop a snake AI with machine learning, but I'm not skilled at that (yet). I also realize that a more perfect AI would simply loop through every square, thereby guaranteeing 100% success, but that is slow and boring to watch. I want an AI that _feels_ like it's making decisions, especially ones that seem correct.

## Link

You can view the deployed page here:
https://moses-ian.github.io/snake-a-star/

## Usage

You have some options for viewing the algorithms in action.
- Set the framerate with the _speed_ slider.
- By checking _View path_, you will highlight the path that the snake intends to follow.
- By checking _View path from apple to tail_, you will highlight that path. The snake doesn't follow this path, but does make decisions based on this path.
- Check _View open/closed set_ to view the open and closed sets that are a result of the A* algorithm. 
- You can pause and resume by pressing SPACE.

## Brief Explanation of the Algorithms

### Overall Strategy

In actual Snake, as long as there is a path to tail, you are guaranteed success, as long as you don't actually collide with that tail. So, the snake will only move to the apple if there is a path from the apple to the tail, bearing in mind that once the snake reaches the apple, _the position of the snake's head has changed_. If the snake can't guarantee a safe path to the apple then the tail, it will just follow the tail.

The second consideration that must be made is colliding with the end of the tail. Eating the apple takes time to propogate. The snake can't be assured that on any given frame, the tail will move out of its way. If it previously ate an apple at that spot, the tail may linger and cause a collision. Therefore, when the snake is too close to the tail, it will do its best to stall and avoid getting too close.

On every frame, the snake tries to decide the best path to follow. It will do one of three things:
- Move to the apple
- Move to the tail
- Stall

### Move to the apple

The snake will use A* to find a path to the apple. If it can't find one, it will try to move the tail.

After it finds a path to the apple, it will check whether there is a path from the apple to the tail. If there is, it will follow that path. If not, it will try again in reverse, from the apple to the tail then from the head to the apple. If it still can't find a path, it will follow its tail.

### Move to the tail

The snake will use A* to find a path to the tail. If the distance is greater than 5 spaces, it follows the tail. If it's less than or equal to 5 spaces, it will stall.

### Stall

The snake grades each direction: forward, left, and right.

The scores are:
- The space is its body: 0 points.
- The space is its tail: 0.5 points.
- The space is empty: 1 point.
- The space is empty and has a path to the tail, but the path is too short: 2 + 0.1 * _path length_ points.
- The space is empty and has a long path to the tail: 3 points.

The space with the highest score is the one it moves to.

### A* Algorithm Heuristic

The heuristic is as follows:
- Taxicab distance: 1 point per square.
- Turn: Every time the snake turns, multiply _g_ by 1.1.
- Turn now: If on the first step of the path, the snake has to turn, multiply _g_ by 1.1.

The effect is that the snake follows paths that _feel_ right. Without both _turn_ and _turn now_, the snake likes to follow a zig-zag pattern. As a bonus, without obstacles, _turn now_ has the effect that the _only_ spaces that are checked are the ones that will become the path. It's a massive time savings.

## Credits

The Coding Train - A* Pathfinding Algorithm: https://www.youtube.com/watch?v=aKYlikFAV4k

Omer Yalavac - Making A Snake AI (A* Algorithm): https://www.youtube.com/watch?v=0ims0c2fVlM&t=212s

## Created by Ian Moses

https://github.com/Moses-Ian

https://moses-ian.github.io/portfolio/

https://www.linkedin.com/in/moses-ian/