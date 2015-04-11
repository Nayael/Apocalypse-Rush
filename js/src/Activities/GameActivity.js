var GameActivity = (function(Activity, PxLoader, PxLoaderImage, Entity, Graphics, InputManager, Character) {
	'use strict';

	function GameActivity(existingEntities) {
		// enforces new
		if (!(this instanceof GameActivity)) {
			return new GameActivity(existingEntities);
		}
		Activity.constructor.apply(this, arguments);

		this._assets = {};
	}
	GameActivity.inheritsFrom(Activity);

	GameActivity.prototype.init = function() {
		var loader = new PxLoader();

		// this time we'll create a PxLoaderImage instance instead of just 
		// giving the loader the image url 
		this._assets = {
			cat_idle_left: new PxLoaderImage("assets/textures/characters/idle_left.png"),
			cat_idle_right: new PxLoaderImage("assets/textures/characters/idle_right.png"),
			cat_jump_l: new PxLoaderImage("assets/textures/characters/jump_l.png"),
			cat_jump_r: new PxLoaderImage("assets/textures/characters/jump_r.png"),
			cat_left: new PxLoaderImage("assets/textures/characters/left.png"),
			cat_right: new PxLoaderImage("assets/textures/characters/right.png"),
		}

		for (var prop in this._assets) {
			if (this._assets.hasOwnProperty(prop)) {
				loader.add(this._assets[prop]);
			}
		}

		// callback that runs every time an image loads 
		loader.addProgressListener(function(e) {
			console.log(e.completedCount + ' / ' + e.totalCount);
		}.bind(this));

		loader.addCompletionListener(this.onGameLoaded.bind(this));

		loader.start();
	};

	GameActivity.prototype.onGameLoaded = function(e) {
		this.initMap();

		var character = new Character({
			sprites: {
				idle_left: this._assets.cat_idle_left.img,
				idle_right: this._assets.cat_idle_right.img,
				jump_l: this._assets.cat_jump_l.img,
				jump_r: this._assets.cat_jump_r.img,
				left: this._assets.cat_left.img,
				right: this._assets.cat_right.img
			},
			width: 36,
			height: 36
		});
		this._entities.push(character);

		this._screen.addChild(character.graphics);

		character.takeControl(0);
	};

	GameActivity.prototype.initMap = function() {
		this._map = new Map({
			activity: this
		});

		this._screen.addChild(this._map.graphics);
	};

	return GameActivity;

}(Activity, PxLoader, PxLoaderImage, Entity, Graphics, InputManager, Character));