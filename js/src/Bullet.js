var Bullet = (function(Entity, Graphics, AssetManager) {
	'use strict';

	function Bullet(params) {
		// enforces new
		if (!(this instanceof Bullet)) {
			return new Bullet(params);
		}
		Entity.apply(this, arguments);

		this.ttl = 0.5;
		this.time = 0;
		this.direction = 1;
		this.speed = 60;
		this.graphics = new Graphics(this, {
			spritesheet: AssetManager.instance.assets.images.bullet,
			localX: -AssetManager.instance.assets.images.bullet.width / 2,
			localY: -AssetManager.instance.assets.images.bullet.height / 2
		});
	}
	Bullet.inheritsFrom(Entity);

	Bullet.prototype.init = function () {
		this.ttl = 0.5;
		this.time = 0;
		this.enabled = true;
	}

	Bullet.prototype.update = function (dt) {
		this.time += dt;
		if (this.time >= this.ttl) {
			this.die();
			return;
		}
		this.x += this.speed * this.direction;

		var collision = window.gameActivity._map.checkCollision({
			x: this.x,
			y: this.y,
			radius: 5
		});
		if (collision != null) {
			this.die();
		}
	}

	Bullet.prototype.die = function() {
		this.enabled = false;
		this.time = 0;
		window.gameActivity._entities.splice(window.gameActivity._entities.indexOf(this), 1);
		window.gameActivity.getScreen().removeChild(this);
		window.bulletsPool.push(this);
	}

	return Bullet;

}(Entity, Graphics, AssetManager));