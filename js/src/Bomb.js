var Bomb = (function(Entity, Graphics, AssetManager) {
	'use strict';

	function Bomb(params) {
		// enforces new
		if (!(this instanceof Bomb)) {
			return new Bomb(params);
		}
		Entity.apply(this, arguments);

		this.graphics = new Graphics(this, {
			spritesheet: AssetManager.instance.assets.images.bomb
		});
		this.speed = 20;
		this.alarm = window.gameActivity._assets.sounds.SFX_Missile_Siren_Coming;
		this.missileSound = window.gameActivity._assets.sounds.SFX_Feedback_Missile;
		this.alarm.volume(0.5);

		this.moving = false;
		this.bombSpawnDelay = 10;
		this.nextAlarmDelay = 8;
	}
	Bomb.inheritsFrom(Entity);

	Bomb.prototype.reset = function() {
		gameActivity._screen.removeChild(this);
		this.moving = false;
		this.alarm.stop();
		this.bombSpawnDelay = Math.floor(10 + Math.random() * 10);
		this.nextAlarmDelay = this.bombSpawnDelay - Math.floor(2 + Math.random() * 3);
		this.enabled = true;
		this.x = gameActivity._map.cameraOffset + 1950;
		console.log('this.bombSpawnDelay, this.nextAlarmDelay: ', this.bombSpawnDelay, this.nextAlarmDelay);
	}

	Bomb.prototype.update = function (dt) {
		this.bombSpawnDelay -= dt;

		if (this.bombSpawnDelay > 0 && this.bombSpawnDelay <= this.nextAlarmDelay && !this.alarm.playing()) {
			this.alarm.play();
			this.alarm.fade(0, 0.5, 2000);
		}
		
		if (this.bombSpawnDelay <= 0 && this.moving == false) {
			this.alarm.fade(0.5, 0, 2000);
			this.moving = true;
			this.missileSound.play();
			this.y = gameActivity.getFirstPlayer().y;
			gameActivity._screen.addChild(this);
		}

		if (this.moving) {
			this.x -= this.speed;

			if (this.x < gameActivity._map.cameraOffset - 200) {
				this.reset();
			}
		} else {
			this.x = gameActivity._map.cameraOffset + 1950;
		}
	}

	return Bomb;
}(Entity, Graphics, AssetManager));