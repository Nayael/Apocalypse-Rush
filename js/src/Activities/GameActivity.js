var GameActivity = (function(Activity, PxLoader, PxLoaderImage, Entity, Graphics, InputManager, Character, GamepadManager, Bomb) {
	'use strict';

	function GameActivity(params) {
		// enforces new
		if (!(this instanceof GameActivity)) {
			return new GameActivity(params);
		}
		Activity.constructor.apply(this, params);

		this._assets = {};
		this._players = [];
		this.bullets = [];
		this.bomb = null;
		this.enemies = [];
	}
	GameActivity.inheritsFrom(Activity);

	GameActivity.prototype.launch = function(assets) {
		this._assets = assets;
		this.initMap();
		this.initPlayers();
		this.launchGame();
	};

	GameActivity.prototype.launchGame = function() {
		this.bomb = new Bomb();
		this._entities.push(this.bomb);
		this._screen.addChild(this.bomb);

		// this._assets.sounds["MUSIC_Layer_01"].play();
		// this._assets.sounds["MUSIC_Layer_02"].play();
		// this._assets.sounds["MUSIC_Layer_03"].play();
		// this._assets.sounds["MUSIC_Layer_04"].play();
	};

	GameActivity.prototype.initPlayers = function () {
		var controllers = GamepadManager.instance.getControllers();
		for (var i = 0, character; i < controllers.length; i++) {
			if (i >= 4) {
				break;
			}
			character = new Character({
				sprites: {
					idle_l: this._assets.images["player_" + i + "-idle_l"],
					idle_r: this._assets.images["player_" + i + "-idle_r"],
					jump_l: this._assets.images["player_" + i + "-jump_l"],
					jump_r: this._assets.images["player_" + i + "-jump_r"],
					run_l: this._assets.images["player_" + i + "-run_l"],
					run_r: this._assets.images["player_" + i + "-run_r"]
				},
				width: 75,
				height: 105,
				spriteWidth: 75,
				spriteHeight: 105
			});
			character.x = 100 + i * 10;
			this._entities.push(character);
			this._players.push(character);

			this._screen.addChild(character);

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

		this._screen.addChild(this._map);
	};

	GameActivity.prototype.update = function (dt) {
		Activity.prototype.update.call(this, dt);

		this.checkPlayersCollisionWithMap(dt);
		this._map.checkCameraOffset();
		this.checkCollideWithPlayers();
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
				radius: Consts.CHARACTER_RADIUS
			});

			// if (collisionPoint != null) {
				this._players[i].handleCollision(collisionPoint);
			// }

			// console.log(collisionPoint);
		}
	}

	GameActivity.prototype.checkCollideWithPlayers = function () {
		var bullet, player, playerX, playerY, respawnX;
		for (var i = 0; i < this.bullets.length; i++) {
			bullet = this.bullets[i];
			for (var j = 0; j < this._players.length; j++) {
				player = this._players[j];
				if (!player.isVulnerable) {
					continue;
				}

				if (bullet.owner != player.id) {
					playerX = player.x + player.width / 2;
					playerY = player.y + player.height / 2;
					if ((bullet.x - playerX) * (bullet.x - playerX) + (bullet.y - playerY) * (bullet.y - playerY) < ((bullet.radius + Consts.CHARACTER_RADIUS) * (bullet.radius + Consts.CHARACTER_RADIUS))) {
						if (bullet.direction == 1) {
							respawnX = player.x - (player.x - this._map.cameraOffset) * (2/3);
						} else {
							respawnX = player.x + (-250 + Math.floor(Math.random() * 500));
						}
						bullet.die();
						player.die(respawnX);
						break;
					}
				}
			}
		}
	}

	GameActivity.prototype.getFirstPlayer = function () {
		var firstPlayer = null;
		for (var i = 0, xMax = 0, nbPlayers = this._players.length, player; i < nbPlayers; ++i) {
			player = this._players[i];
			if (player.x > xMax) {
				xMax = player.x;
				firstPlayer = player;
			}
		}
		return firstPlayer;
	}

	return GameActivity;

}(Activity, PxLoader, PxLoaderImage, Entity, Graphics, InputManager, Character, GamepadManager, Bomb));
