define(['lib/Framework/Entity', 'lib/Framework/Graphics', 'lib/Framework/AssetManager'],
function(Entity, Graphics, AssetManager) {
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

		this.activity._screen.addChild(this);
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
		this.activity._entities.push(bullet);
		this.activity.getScreen().addChild(bullet);
	}

	Enemy.prototype.die = function(respawn, killer) {
		this.activity._entities.splice(this.activity._entities.indexOf(this), 1);
		this.activity.enemies.splice(this.activity.enemies.indexOf(this), 1);
		this.activity.getScreen().removeChild(this);
		if (killer) {
			killer.addPoints(2);
		}
	}


	Enemy.prototype.getBullet = function () {
		if (this.activity.bulletsPool.length == 0) {
			return new Bullet({
				activity: this.activity
			});
		}
		return this.activity.bulletsPool.splice(0, 1)[0];
	}

	return Enemy;
});