var Map = (function(Entity) {
	'use strict';

	function Map(params) {
		// enforces new
		if (!(this instanceof Map)) {
			return new Map(params);
		}
		
		Entity.apply(this, arguments);

		this.activity = params.activity;

		this.canvasBuffer = document.createElement('canvas');
        this.canvasBuffer.scaleFactor = this.activity.application._stage.canvas.scaleFactor;
        this.canvasBuffer.width    = 8192;
        this.canvasBuffer.height   = Consts.SCREEN_HEIGHT;
        this.context = this.canvasBuffer.getContext('2d');

		this.textureTiles = AssetManager.instance.assets.images["texture_tiles"];

		this.graphics = new Graphics(this, {
			spritesheet: this.canvasBuffer,
			width: Consts.SCREEN_WIDTH,
			height: Consts.SCREEN_HEIGHT,
			isCanvas: true
		});

		this.cameraOffset = 0;

        this._blocks = [];
        for (var i = 0; i < Consts.SCREEN_HEIGHT / Consts.BLOCK_SIZE; i++) {
        	this._blocks.push([]);
        }

        this.loadBlocks(levelPatterns[0]);
	}

	Map.inheritsFrom(Entity);

	Map.prototype.checkCameraOffset = function () {
		var minX = this.activity._players[0].x, maxX = minX;

		for (var i = 1; i < this.activity._players.length; i++) {
			if (minX > this.activity._players[i].x) {
				minX = this.activity._players[i].x;
			}
			else if (maxX < this.activity._players[i].x) {
				maxX = this.activity._players[i].x;
			}
		}

		// minX -= 100;

		if (minX > this.cameraOffset + 100) {
			this.cameraOffset = minX - 100;
		}
		if (maxX > this.cameraOffset + 1500) {
			this.cameraOffset = maxX - 1500;
		}

		this.graphics.sourceX = this.cameraOffset;
	}

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
					this.context.drawImage(	this.textureTiles,
											(this._blocks[i][j] - 1) * Consts.BLOCK_SIZE,
											0,
											Consts.BLOCK_SIZE,
											Consts.BLOCK_SIZE,
											j * Consts.BLOCK_SIZE,
											i * Consts.BLOCK_SIZE,
											Consts.BLOCK_SIZE,
											Consts.BLOCK_SIZE);

					// this.context.strokeRect(j * Consts.BLOCK_SIZE,
					// 						i * Consts.BLOCK_SIZE,
					// 						Consts.BLOCK_SIZE,
					// 						Consts.BLOCK_SIZE);
					// this.context.fillRect(j * Consts.BLOCK_SIZE,
					// 						i * Consts.BLOCK_SIZE,
					// 						Consts.BLOCK_SIZE,
					// 						Consts.BLOCK_SIZE);
				}
			}
		}
	};

	Map.prototype.checkCollision = function (circle) {
		// console.log(circle);
		// circle.y = 120;
		// circle.x = 190;
		// circle.radius = 50;
		var ctx = this.activity.application._stage.context;
		var scaleFactor = this.activity.application._stage.canvas.scaleFactor;
		// console.log(scaleFactor);

		// ctx.beginPath();
		// ctx.arc(circle.x * scaleFactor, circle.y * scaleFactor, circle.radius * scaleFactor, 0, Math.PI * 2);
		// ctx.stroke();

		var minX = (circle.x - circle.radius) - (circle.x - circle.radius) % Consts.BLOCK_SIZE;
		var maxX = (circle.x + circle.radius) - (circle.x + circle.radius) % Consts.BLOCK_SIZE;
		var minY = (circle.y - circle.radius) - (circle.y - circle.radius) % Consts.BLOCK_SIZE;
		var maxY = (circle.y + circle.radius) - (circle.y + circle.radius) % Consts.BLOCK_SIZE;
		var j, point, collisionPoint = null;
		var collisionInfo;

		if (minX < 0) {
			minX = 0;
		}
		if (maxX > (this._blocks[0].length - 1) * Consts.BLOCK_SIZE) {
			maxX = (this._blocks[0].length - 1) * Consts.BLOCK_SIZE;
		}
		if (minY < 0) {
			minY = 0;
		}
		if (maxY > (this._blocks.length - 1) * Consts.BLOCK_SIZE) {
			maxY = (this._blocks.length - 1) * Consts.BLOCK_SIZE;
		}

		// console.log(minX, maxX, minY, maxY);

		for (var i = minX; i <= maxX; i += Consts.BLOCK_SIZE) {
			for (j = minY; j <= maxY; j += Consts.BLOCK_SIZE) {
				if (this._blocks[j / Consts.BLOCK_SIZE][i / Consts.BLOCK_SIZE] != 0) {
					point = this.getClosestPoint(circle, i, j);

					collisionInfo = this.circleCollidesPoint(circle, point);

					if ((collisionPoint == null || collisionInfo.dist < collisionPoint.dist) && collisionInfo.collides) {
						collisionPoint = point;
						collisionPoint.dist = collisionInfo.dist;
						collisionPoint.angle = collisionInfo.angle;
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
				dist: Math.sqrt((circle.x - point.x) * (circle.x - point.x) + (circle.y - point.y) * (circle.y - point.y)),
				angle: Math.atan2(circle.y - point.y, circle.x - point.x)};
	};

	return Map;
}(Entity));