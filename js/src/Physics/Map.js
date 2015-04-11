var Map = (function(Entity) {
	'use strict';

	function Map(params) {
		// enforces new
		if (!(this instanceof Map)) {
			return new Map(params);
		}
		
		Entity.constructor.apply(this, params);

		this.activity = params.activity;

		this.canvasBuffer = document.createElement('canvas');
        this.canvasBuffer.scaleFactor = this.activity.application._stage.canvas.scaleFactor;
        this.canvasBuffer.width    = Consts.SCREEN_WIDTH;
        this.canvasBuffer.height   = Consts.SCREEN_HEIGHT;
        this.context = this.canvasBuffer.getContext('2d');

        // this.context.fillRect(0, 0, this.canvasBuffer.width, this.canvasBuffer.height);

		this.graphics = new Graphics(this, {
			spritesheet: this.canvasBuffer,
			width: Consts.SCREEN_WIDTH,
			height: Consts.SCREEN_HEIGHT,
			isCanvas: true
		});

        this._blocks = [];
        for (var i = 0; i < Consts.SCREEN_HEIGHT / Consts.BLOCK_SIZE; i++) {
        	this._blocks.push([]);
        }

        this.loadBlocks(levelPatterns[0]);
        this.loadBlocks(levelPatterns[1]);
        this.loadBlocks(levelPatterns[0]);
	}

	Map.inheritsFrom(Entity);

	Map.prototype.loadBlocks = function (pattern) {
		for (var i = 0; i < pattern.length; i++) {
			for (var j = 0; j < pattern[i].length; j++) {
				this._blocks[i].push(pattern[i][j]);
			}
		}

		this.renderBlocks();
	};

	Map.prototype.renderBlocks = function () {
		this.context.fillStyle = "rgb(255,0,0)";
		for (var i = 0; i < this._blocks.length; i++) {
			for (var j = 0; j < this._blocks[i].length; j++) {
				if (this._blocks[i][j]) {
					this.context.strokeRect(j * Consts.BLOCK_SIZE,
											i * Consts.BLOCK_SIZE,
											Consts.BLOCK_SIZE,
											Consts.BLOCK_SIZE);
					this.context.fillRect(j * Consts.BLOCK_SIZE,
											i * Consts.BLOCK_SIZE,
											Consts.BLOCK_SIZE,
											Consts.BLOCK_SIZE);
				}
			}
		}
	};

	Map.prototype.checkCollision = function (circle) {
		circle.y = 120;
		circle.x = 190;
		circle.radius = 50;
		var ctx = this.activity.application._stage.context;
		var scaleFactor = this.activity.application._stage.canvas.scaleFactor;
		// console.log(scaleFactor);

		ctx.beginPath();
		ctx.arc(circle.x * scaleFactor, circle.y * scaleFactor, circle.radius * scaleFactor, 0, Math.PI * 2);
		ctx.stroke();

		var minX = (circle.x - circle.radius) - (circle.x - circle.radius) % Consts.BLOCK_SIZE;
		var maxX = (circle.x + circle.radius) - (circle.x + circle.radius) % Consts.BLOCK_SIZE;
		var minY = (circle.y - circle.radius) - (circle.y - circle.radius) % Consts.BLOCK_SIZE;
		var maxY = (circle.y + circle.radius) - (circle.y + circle.radius) % Consts.BLOCK_SIZE;
		var j, point, collisionPoint = null;
		var collisionInfo;

		// console.log(minX, maxX, minY, maxY);

		for (var i = minX; i <= maxX; i += Consts.BLOCK_SIZE) {
			for (j = minY; j <= maxY; j += Consts.BLOCK_SIZE) {
				if (this._blocks[i / Consts.BLOCK_SIZE][j / Consts.BLOCK_SIZE] != 0) {
					point = this.getClosestPoint(circle, i, j);

					collisionInfo = this.circleCollidesPoint(circle, point);

					if (collisionPoint == null || collisionInfo.dist < collisionPoint.dist) {
						collisionPoint = point;
						collisionPoint.dist = collisionInfo.dist;
					}
					// console.log(collisionInfo);
					// console.log(point);
				}
			}
		}

		// console.log(collisionPoint);

		return collisionPoint;

		// debugger;
	};

	Map.prototype.getClosestPoint = function (circle, x, y) {
		var closestX = circle.x;
		var closestY = circle.y;

		if (circle.x < x) {
			closestX = x;
		}
		else if (circle.x > x + Consts.BLOCK_SIZE) {
			closestX = x + Consts.BLOCK_SIZE;
		}

		if (circle.y < y) {
			closestY = y;
		}
		else if (circle.y > y + Consts.BLOCK_SIZE) {
			closestY = y + Consts.BLOCK_SIZE;
		}

		return {x: closestX, y: closestY};
	};

	Map.prototype.circleCollidesPoint = function (circle, point) {
		return {collides: ((circle.x - point.x) * (circle.x - point.x) + (circle.y - point.y) * (circle.y - point.y) < circle.radius * circle.radius),
				dist: (circle.x - point.x) * (circle.x - point.x) + (circle.y - point.y) * (circle.y - point.y)};
	};

	return Map;
}(Entity));