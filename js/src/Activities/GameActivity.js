define(['lib/Framework/Activity', 'PxLoader', 'PxLoaderImage', 'lib/Framework/Entity', 'lib/Framework/Graphics', 'lib/Framework/InputManager', 'src/Physics/Map', 'src/Character', 'lib/Framework/GamepadManager', 'src/Bomb', 'src/Consts', 'src/UI'],
function(Activity, PxLoader, PxLoaderImage, Entity, Graphics, InputManage, Map, Character, GamepadManager, Bomb, Consts, UI) {
	'use strict';

	function GameActivity(params) {
		// enforces new
		if (!(this instanceof GameActivity)) {
			return new GameActivity(params);
		}
		Activity.apply(this, arguments);

		this._assets = {};
		this._players = [];
		this.bullets = [];
		this.bomb = null;
		this.enemies = [];
		this.generals = [];
		this.level = params ? params.level : 0;
	}
	GameActivity.inheritsFrom(Activity);

	GameActivity.prototype.launch = function(assets) {
		this._assets = assets;
		this.initMap();
		this.initPlayers();
		this.launchGame();
	};

	GameActivity.prototype.launchGame = function() {
		this.ui = new UI(this._players.length);
		this.bomb = new Bomb();
		this._entities.push(this.bomb);

		this._assets.sounds["MUSIC_Layer_01"].play();
		this._assets.sounds["MUSIC_Layer_02"].play();
		this._assets.sounds["MUSIC_Layer_03"].play();
		this._assets.sounds["MUSIC_Layer_04"].play();

		this._assets.sounds["MUSIC_Layer_01"].volume(.6);
		this._assets.sounds["MUSIC_Layer_02"].volume(0);
		this._assets.sounds["MUSIC_Layer_03"].volume(0);
		this._assets.sounds["MUSIC_Layer_04"].volume(0);
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
		// Background
		var bg = null, bgImage;
		for (var i = 0; i < 3; i++) {
			bgImage = this._assets.images.background;
			bg = {
				graphics: new Graphics({x: i * bgImage.width}, {
					spritesheet: bgImage
				})
			};
			this._screen.addChild(bg);
		}

		this._map = new Map({
			activity: this,
			level: this.level
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
		var bullet, player, playerX, playerY, character, characterX, characterY, respawnX, killer;
		var j = 0;
		var characters = this._players.concat(this.enemies);
		for (var i = 0; i < this.bullets.length; i++) {
			bullet = this.bullets[i];
			for (j = 0; j < characters.length; j++) {
				character = characters[j];
				if (!character.isVulnerable) {
					continue;
				}

				if (bullet.owner != character.id) {
					characterX = character.x + character.width / 2;
					characterY = character.y + character.height / 2;
					if ((bullet.x - characterX) * (bullet.x - characterX) + (bullet.y - characterY) * (bullet.y - characterY) < ((bullet.radius + Consts.CHARACTER_RADIUS) * (bullet.radius + Consts.CHARACTER_RADIUS))) {
						if (bullet.direction == 1) {
							respawnX = character.x - 100;
							// respawnX = character.x - (character.x - this._map.cameraOffset) * (2/3);
						} else {
							respawnX = character.x - 100;
							// respawnX = character.x + (-250 + Math.floor(Math.random() * 500));
						}

						// Points to the player
						killer = this.getPlayer(bullet.owner);
						bullet.die();
						character.die({
							x: respawnX,
							y: character.y - 50
						}, killer);
						break;
					}
				}
			}
		}

		for (var j = 0; j < this._players.length; j++) {
			player = this._players[j];
			if (!player.isVulnerable) {
				continue;
			}

			playerX = player.x + player.width / 2;
			playerY = player.y + player.height / 2;
			if ((this.bomb.x - playerX) * (this.bomb.x - playerX) + (this.bomb.y - playerY) * (this.bomb.y - playerY) < ((this.bomb.radius + Consts.CHARACTER_RADIUS) * (this.bomb.radius + Consts.CHARACTER_RADIUS))) {
				respawnX = player.x - (player.x - this._map.cameraOffset) * (2/3);
				window.gameActivity._assets.sounds["SFX_Impact_Siren_01"].play();
				player.die({
					x: respawnX
				});
				break;
			}
		}
	}

	GameActivity.prototype.onGeneralsDead = function () {
		this.ui.showLeaderboard();
		GamepadManager.instance.addListener(GamepadManager.GamepadEvent.BUTTON_PRESSED, this.onButtonDownLeaderboard, this);
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

	GameActivity.prototype.getPlayer = function (id) {
		for (var i = 0; i < this._players.length; i++) {
			if (this._players[i].id == id) {
				return this._players[i];
			}
		}
		return;
	}

	GameActivity.prototype.onButtonDownLeaderboard = function (e) {
		if (e.button == "START") {
			GamepadManager.instance.removeListener(GamepadManager.GamepadEvent.BUTTON_PRESSED, this.onButtonDownLeaderboard);
			this.nextLevel();
		}
	}

	GameActivity.prototype.nextLevel = function() {
		window.gameActivity = null;
	    this.application.removeActivity(this);
	    this._entities.length = 0;
	    this._players.length = 0;
	    this.enemies.length = 0;
	    this.bullets.length = 0;
	    this._entities = null;
	    this._players = null;
	    this.enemies = null;
	    this.bullets = null;
	    this.ui.destroy();
		this.ui = null;

		this._assets.sounds["MUSIC_Layer_01"].stop();
		this._assets.sounds["MUSIC_Layer_02"].stop();
		this._assets.sounds["MUSIC_Layer_03"].stop();
		this._assets.sounds["MUSIC_Layer_04"].stop();

	    var assets = this._assets;
	    this._assets = null;

		window.gameActivity = new GameActivity({
            level: this.level == 0 ? 1 : 0
        });
	    this.application.addActivity(window.gameActivity);
	    window.gameActivity.launch(assets);
	}

	return GameActivity;

});
