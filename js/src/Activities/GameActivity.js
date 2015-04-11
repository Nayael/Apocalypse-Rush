var GameActivity = (function(Activity, PxLoader, PxLoaderImage, Entity, Graphics, InputManager, Character, GamepadManager) {
	'use strict';

	function GameActivity(params) {
		// enforces new
		if (!(this instanceof GameActivity)) {
			return new GameActivity(params);
		}
		Activity.constructor.apply(this, params);

		this._assets = {};
		this._players = [];
	}
	GameActivity.inheritsFrom(Activity);

	GameActivity.prototype.launch = function(assets) {
		console.log('assets: ', assets);
		this._assets = assets;
		this.initMap();
		this.initPlayers();
		this.launchGame();
	};

	GameActivity.prototype.launchGame = function() {
		this._assets.sounds["MUSIC_Layer_01"].play();
		this._assets.sounds["MUSIC_Layer_02"].play();
		this._assets.sounds["MUSIC_Layer_03"].play();
		this._assets.sounds["MUSIC_Layer_04"].play();
	};

	GameActivity.prototype.initPlayers = function () {
		var controllers = GamepadManager.instance.getControllers();
		for (var i = 0, character; i < controllers.length; i++) {
			if (i >= 4) {
				break;
			}
			character = new Character({
				sprites: {
					idle_left: this._assets[i + "_idle_l"].img,
					idle_right: this._assets[i + "_idle_r"].img,
					jump_l: this._assets[i + "_jump_l"].img,
					jump_r: this._assets[i + "_jump_r"].img,
					left: this._assets[i + "_run_l"].img,
					right: this._assets[i + "_run_r"].img
				},
				width: 36,
				height: 36,
				spriteWidth: 36,
				spriteHeight: 36
			});
			character.x = 100 + i * 10;
			this._entities.push(character);
			this._players.push(character);

			this._screen.addChild(character.graphics);

			character.takeControl(i);
		}
	}

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

		this.checkPlayersCollisionWithMap(dt);
	}

	GameActivity.prototype.checkPlayersCollisionWithMap = function (dt) {
		if (!this._map) {
			return;
		}

		var collisionPoint;

		for (var i = this._players.length; i--;) {
			// console.log(this._players[i]);
			// debugger;
			collisionPoint = this._map.checkCollision({
				x: this._players[i].x + this._players[i].width / 2,
				y: this._players[i].y + this._players[i].height / 2,
				radius: 30
			});

			// if (collisionPoint != null) {
				this._players[i].handleCollision(collisionPoint);
			// }

			// console.log(collisionPoint);
		}
	}

	return GameActivity;

}(Activity, PxLoader, PxLoaderImage, Entity, Graphics, InputManager, Character, GamepadManager));