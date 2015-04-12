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

		// if (minX > this.cameraOffset + 100) {
		// 	this.cameraOffset = minX - 100;
		// }
		if (maxX > this.cameraOffset + 1500) {
			this.cameraOffset = maxX - 1500;
		}

		this.graphics.sourceX = this.cameraOffset;

		this.checkPlayersPosition();
	}

	Map.prototype.checkPlayersPosition = function () {
		for (var i = this.activity._players.length; i--;) {
			if (this.activity._players[i].x < this.cameraOffset) {
				this.activity._players[i].die(this.cameraOffset + 960);
			}
		}
	}

	Map.prototype.loadBlocks = function (pattern) {
		for (var i = 0; i < pattern.length; i++) {
			for (var j = 0; j < pattern[i].length; j++) {
				if (pattern[i][j] == 1) {
					window.gameActivity.enemies.push(new Enemy({
						x: j * Consts.BLOCK_SIZE,
						y: i * Consts.BLOCK_SIZE
					}));
					this._blocks[i].push(0);
				}
				else
					this._blocks[i].push(pattern[i][j]);
			}
		}

		this.renderBlocks();
	};

	Map.prototype.changeBlock = function (x, y, newBlock) {
		this._blocks[x][y] = newBlock;
		this.renderBlock(y, x, newBlock, true);
	};

	Map.prototype.renderBlocks = function () {
		for (var i = 0; i < this._blocks.length; i++) {
			for (var j = 0; j < this._blocks[i].length; j++) {
				if (this._blocks[i][j]) {
					this.renderBlock(j, i, this._blocks[i][j]);
				}
			}
		}
	};

	Map.prototype.renderBlock = function (x, y, block, clear) {
		if (clear) {
			this.context.clearRect(	x * Consts.BLOCK_SIZE,
									y * Consts.BLOCK_SIZE,
									Consts.BLOCK_SIZE,
									Consts.BLOCK_SIZE);
		}
		this.context.drawImage(	this.textureTiles,
								(block - 2) * Consts.BLOCK_SIZE,
								0,
								Consts.BLOCK_SIZE,
								Consts.BLOCK_SIZE,
								x * Consts.BLOCK_SIZE,
								y * Consts.BLOCK_SIZE,
								Consts.BLOCK_SIZE,
								Consts.BLOCK_SIZE);
	}

	Map.prototype.checkCollision = function (circle) {
		var ctx = this.activity.application._stage.context;
		var scaleFactor = this.activity.application._stage.canvas.scaleFactor;
		ctx.beginPath();
		ctx.arc(circle.x * scaleFactor, circle.y * scaleFactor, circle.radius * scaleFactor, 0, Math.PI * 2);
		ctx.stroke();

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

		var block = 0;
		for (var i = minX; i <= maxX; i += Consts.BLOCK_SIZE) {
			for (j = minY; j <= maxY; j += Consts.BLOCK_SIZE) {
				block = this._blocks[j / Consts.BLOCK_SIZE][i / Consts.BLOCK_SIZE];
				if (block != 0) {
					point = this.getClosestPoint(circle, i, j);

					collisionInfo = this.circleCollidesPoint(circle, point);

					if ((collisionPoint == null || collisionInfo.dist < collisionPoint.dist) && collisionInfo.collides) {
						collisionPoint       = point;
						collisionPoint.dist  = collisionInfo.dist;
						collisionPoint.angle = collisionInfo.angle;
						collisionPoint.value = block;
						collisionPoint.pos 	 = [j / Consts.BLOCK_SIZE, i / Consts.BLOCK_SIZE];
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