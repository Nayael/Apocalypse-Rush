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

		this.faceRight = false;
		this.isCooldown = true;
		this.shootCooldown = 0.7 + Math.random() * 2;
		this.shootCooldownValue = 0;

		this.graphics = new Graphics(this, {
			spritesheet: AssetManager.instance.assets.images["enemy"]
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
		window.gameActivity._entities.push(bullet);
		window.gameActivity.getScreen().addChild(bullet);

		// window.gameActivity._assets.sounds["SFX_Shoot_Player_0" + (this.id + 1)].play();
	}

	Enemy.prototype.getBullet = function () {
		if (window.bulletsPool.length == 0) {
			return new Bullet();
		}
		return window.bulletsPool.splice(0, 1)[0];
	}

	return Enemy;
}(Entity, Graphics));