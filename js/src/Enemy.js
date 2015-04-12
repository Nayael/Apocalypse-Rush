var Enemy = (function(Entity, Graphics) {
	'use strict';

	function Enemy(params) {
		// enforces new
		if (!(this instanceof Enemy)) {
			return new Enemy(params);
		}
		Entity.apply(this, arguments);

		this.x = params.x;
		this.y = params.y;
		this.width = 50;
		this.height = 50;
		this.isVulnerable = true;

		this.faceRight = params.faceRight || false;
		this.isCooldown = true;
		this.shootCooldown = 1 + Math.random() * 2;
		this.shootCooldownValue = 0;
		this.id = -1;

		this.graphics = new Graphics(this, {
			spritesheet: AssetManager.instance.assets.images["enemy_" + (this.faceRight ? "right" : "left")]
		});

		window.gameActivity._screen.addChild(this);
	}

	Enemy.inheritsFrom(Entity);

	Enemy.prototype.update = function (dt) {
		if (this.isCooldown) {
			this.shootCooldownValue	+= dt;
		}
		if (this.shootCooldownValue >= this.shootCooldown) {
			this.shootCooldownValue = 0;
			this.isCooldown = false;
			this.shoot();
		}
	}

	Enemy.prototype.shoot = function () {
		if (this.isCooldown) {
			return;
		}
		this.isCooldown = true;
		// Random time before shooting again
		this.shootCooldown = 0.7 + Math.random() * 2;

		var bullet = this.getBullet();
		bullet.direction = this.faceRight ? 1 : -1;
		bullet.x = this.x + (this.faceRight ? 50 : -50);
		bullet.y = this.y + 25;
		bullet.init();
		bullet.ttl = 0.6;
		window.gameActivity._entities.push(bullet);
		window.gameActivity.getScreen().addChild(bullet);
	}

	Enemy.prototype.die = function() {
		window.gameActivity._entities.splice(window.gameActivity._entities.indexOf(this), 1);
		window.gameActivity.enemies.splice(window.gameActivity.enemies.indexOf(this), 1);
		window.gameActivity.getScreen().removeChild(this);
	}

	Enemy.prototype.getBullet = function () {
		if (window.bulletsPool.length == 0) {
			return new Bullet();
		}
		return window.bulletsPool.splice(0, 1)[0];
	}

	return Enemy;
}(Entity, Graphics));