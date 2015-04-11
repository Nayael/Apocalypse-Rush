var GameActivity = (function (Activity, PxLoader, PxLoaderImage, Entity, Graphics, InputManager, Character) {
	'use strict';

	function GameActivity(existingEntities) {
		// enforces new
		if (!(this instanceof GameActivity)) {
			return new GameActivity(existingEntities);
		}
		Activity.constructor.apply(this, arguments);

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
	    var pxImage = new PxLoaderImage("assets/textures/spritesheet.png"); 
	 
	    loader.add(pxImage); 
		 
		// callback that runs every time an image loads 
		loader.addProgressListener(function(e) { 
		    console.log(e.completedCount + ' / ' + e.totalCount); 
		}.bind(this));

		loader.addCompletionListener(function (e) {
			var character = new Character();
			character.x = 100;
			character.graphics = new Graphics(character, {
				spritesheet: pxImage.img,
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
		}.bind(this));
		 
		loader.start();
	};

	GameActivity.prototype.onTouch = function(e) {
		console.log(e);
	};

	return GameActivity;

}(Activity, PxLoader, PxLoaderImage, Entity, Graphics, InputManager, Character));