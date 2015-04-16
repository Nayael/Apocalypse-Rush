define(['lib/Framework/Entity', 'lib/Framework/Graphics', 'lib/Framework/AssetManager', 'src/Bullet'],
function(Entity, Graphics, AssetManager, Bullet) {
	'use strict';

	function General(params) {
		// enforces new
		if (!(this instanceof General)) {
			return new General(params);
		}
		Entity.apply(this, arguments);

		this.x = params.x;
		this.y = params.y;
		this.width = 50;
		this.height = 50;
		this.isVulnerable = true;
		this.hp = 5;

		this.faceRight = params.faceRight || false;
		this.isCooldown = true;
		this.shootCooldown = 1 + Math.random() * 2;
		this.shootCooldownValue = 0;
		this.id = -1;

		this.graphics = new Graphics(this, {
			spritesheet: AssetManager.instance.assets.images["general_" + (this.faceRight ? "right" : "left")]
		});

		this.activity._screen.addChild(this);
	}

	General.inheritsFrom(Entity);

	General.prototype.update = function (dt) {
		if (this.isCooldown) {
			this.shootCooldownValue	+= dt;
		}
		if (this.shootCooldownValue >= this.shootCooldown) {
			this.shootCooldownValue = 0;
			this.isCooldown = false;
			this.shoot();
		}
	}

	General.prototype.shoot = function () {
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

	General.prototype.die = function(respawn, killer) {
		--this.hp;
		if (this.hp <= 0) {
			if (killer) {
				killer.addPoints(15);
			}
			this.activity._entities.splice(this.activity._entities.indexOf(this), 1);
			this.activity.enemies.splice(this.activity.enemies.indexOf(this), 1);
			this.activity.generals.splice(this.activity.generals.indexOf(this), 1);
			this.activity.getScreen().removeChild(this);

			if (this.activity.generals.length == 0) {
				this.activity.onGeneralsDead();
			}
		} else {
			// this.isVulnerable = false;

			if (!this.blink) {
				this.blink = setInterval(function () {
					this.graphics.enabled = !this.graphics.enabled;
				}.bind(this), 150);
			}

			setTimeout((function() {
				clearInterval(this.blink);
				this.blink = 0;
				this.graphics.enabled = true;
				this.isVulnerable = true;
			}).bind(this), 2500);
		}
	}

	General.prototype.getBullet = function () {
		if (this.activity.bulletsPool.length == 0) {
			return new Bullet({
				activity: this.activity
			});
		}
		return this.activity.bulletsPool.splice(0, 1)[0];
	}

	return General;
});