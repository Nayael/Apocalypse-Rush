var Map = (function(Entity) {
	'use strict';

	function Map(params) {
		// enforces new
		if (!(this instanceof Map)) {
			return new Map(params);
		}
		
		Entity.constructor.apply(this, params);

		this.canvasBuffer = document.createElement('canvas');
        this.canvasBuffer.scaleFactor = params.activity.application._stage.canvas.scaleFactor;
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
        this.loadBlocks(levelPatterns[0]);
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
		
	};

	return Map;
}(Entity));