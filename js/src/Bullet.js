var Bullet = (function(Entity, Graphics, AssetManager) {
	'use strict';

	function Bullet(params) {
		// enforces new
		if (!(this instanceof Bullet)) {
			return new Bullet(params);
		}
		Entity.apply(this, arguments);

		this.radius = 5;
		this.ttl = 0.45;
		this.time = 0;
		this.direction = 1;
		this.speed = 20;
		this.owner = params ? (params.owner !== undefined ? params.owner : -1) : -1;
		this.graphics = new Graphics(this, {
			spritesheet: AssetManager.instance.assets.images.bullet,
			localX: -AssetManager.instance.assets.images.bullet.width / 2,
			localY: -AssetManager.instance.assets.images.bullet.height / 2
		});
	}
	Bullet.inheritsFrom(Entity);

	Bullet.prototype.init = function (owner) {
		this.ttl = 0.45;
		this.time = 0;
		this.enabled = true;
		this.owner = owner !== undefined ? owner : -1;
		window.gameActivity.bullets.push(this);
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
			radius: this.radius
		});
		if (collision != null) {
			if (this.owner != -1 && collision.value == Consts.TYPES.DESTRUCTIBLE_WALL) {
				var player = gameActivity.getPlayer(this.owner);
				if (player) {
					player.addPoints(1);
				}
				window.gameActivity._map.changeBlock(collision.pos[0], collision.pos[1], 0);
				// window.gameActivity._map._blocks[collision.pos[0]][collision.pos[1]] = 0;
			}
			this.die();
		}
	}

	Bullet.prototype.die = function() {
		this.enabled = false;
		this.time = 0;
		window.gameActivity._entities.splice(window.gameActivity._entities.indexOf(this), 1);
		window.gameActivity.bullets.splice(window.gameActivity.bullets.indexOf(this), 1);
		window.gameActivity.getScreen().removeChild(this);
		window.bulletsPool.push(this);
	}

	return Bullet;

}(Entity, Graphics, AssetManager));