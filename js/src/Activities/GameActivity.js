var GameActivity = (function (Activity, PxLoader, PxLoaderImage, Entity, Graphics, InputManager, Character) {
	'use strict';

	function GameActivity(existingEntities) {
		// enforces new
		if (!(this instanceof GameActivity)) {
			return new GameActivity(existingEntities);
		}
		Activity.constructor.apply(this, arguments);

		this._assets = {};

		/**
		 * At each update, make the character move
		 */
		// this.update = function() {
		// 	if (this._entities.length > 0) {
		// 		this._entities[0].x++;
		// 	}
		// };
	}
	GameActivity.inheritsFrom(Activity);

	GameActivity.prototype.init = function() {
		var loader = new PxLoader();

	    // this time we'll create a PxLoaderImage instance instead of just 
	    // giving the loader the image url 
	    this._assets.pxImage = new PxLoaderImage("assets/textures/spritesheet.png"); 
	 
	    loader.add(this._assets.pxImage); 
		 
		// callback that runs every time an image loads 
		loader.addProgressListener(function(e) { 
		    console.log(e.completedCount + ' / ' + e.totalCount); 
		}.bind(this));

		loader.addCompletionListener(this.onGameLoaded.bind(this));
		 
		loader.start();
	};

	GameActivity.prototype.onGameLoaded = function(e) {
		this.initMap();

		var character = new Character();
		character.x = 100;
		character.graphics = new Graphics(character, {
			spritesheet: this._assets.pxImage.img,
			width: 41,
			height: 49,
			animated: true,
			totalFrames: 8,
			frameRate: 150
		});
		character.graphics.localX = -character.graphics.spriteWidth / 2;
		this._entities.push(character);

		this._screen.addChild(character.graphics);

		character.addListener(InputManager.InputEvent.TOUCH_CLICKED, this.onTouch, this);
	};

	GameActivity.prototype.initMap = function() {
		this._map = new Map({
			activity: this
		});

		this._circle = {
			x: 100,
			y: 100,
			radius: 10
		};

		this._screen.addChild(this._map.graphics);
	};

	GameActivity.prototype.update = function (dt) {
		Activity.prototype.update.call(this, dt);

		if (this._map) {
			this._map.checkCollision(this._circle);
		}
	}

	GameActivity.prototype.onTouch = function(e) {
		console.log(e);
	};

	return GameActivity;

}(Activity, PxLoader, PxLoaderImage, Entity, Graphics, InputManager, Character));