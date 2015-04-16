define(['lib/Framework/Entity', 'lib/Framework/Graphics', 'lib/Framework/AssetManager'], function(Entity, Graphics, AssetManager) {
	'use strict';

	function Bomb(params) {
		// enforces new
		if (!(this instanceof Bomb)) {
			return new Bomb(params);
		}
		Entity.apply(this, arguments);

		var spritesheet = AssetManager.instance.assets.images.bomb;
		this.graphics = new Graphics(this, {
			spritesheet: spritesheet,
			localX: -spritesheet.width / 2,
			localY: -spritesheet.height / 2
		});
		this.speed = 20;
		this.alarm = this.activity._assets.sounds.SFX_Missile_Siren_Coming;
		this.missileSound = this.activity._assets.sounds.SFX_Feedback_Missile;
		this.alarm.volume(0.8);

		this.moving = false;
		this.bombSpawnDelay = 10;
		this.nextAlarmDelay = 3;

		this.radius = 130;
	}
	Bomb.inheritsFrom(Entity);

	Bomb.prototype.reset = function() {
		this.activity._screen.removeChild(this);
		this.moving = false;
		this.alarm.stop();
		this.bombSpawnDelay = (10 + Math.random() * 10);
		this.nextAlarmDelay = (2 + Math.random() * 3);
		this.enabled = true;
		this.x = this.activity._map.cameraOffset + 2200;
	}

	Bomb.prototype.update = function (dt) {
		this.bombSpawnDelay -= dt;

		if (this.bombSpawnDelay > 0 && this.bombSpawnDelay <= this.nextAlarmDelay && !this.alarm.playing()) {
			this.alarm.play();
			this.alarm.fade(0, 0.9, 2000);
		}
		
		if (this.bombSpawnDelay <= 0 && this.moving == false) {
			this.alarm.fade(0.9, 0, 2000);
			this.moving = true;
			this.missileSound.play();
			var player = this.activity.getFirstPlayer();
			this.y = player ? player.y : 300;
			this.activity._screen.addChild(this);
		}

		if (this.moving) {
			this.x -= this.speed;

			if (this.x < this.activity._map.cameraOffset - 200) {
				this.reset();
			}
		} else {
			this.x = this.activity._map.cameraOffset + 2200;
		}
	}

	return Bomb;
});