var Character = (function(Entity, Keyboard, GamepadManager, StateMachine) {
	'use strict';

	function Character(params) {
		// enforces new
		if (!(this instanceof Character)) {
			return new Character(params);
		}
		Entity.apply(this, arguments);

		this.previousX = this.x;
		this.previousY = this.y;

		this.speed = 5000;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.xForce = 0;
		this.yForce = 500;
		this.onTheGround = false;

		// ID of the character is also the gamepad ID
		this.id = -1;
		this.flags = [];
		this.move = {
			x: 0,
			y: 0
		};

		this.graphics = new Graphics(this, {
			spritesheet: params.sprites.idle_right,
			width: params.spriteWidth,
			height: params.spriteHeight
		});
		this.graphics.localX = -this.graphics.spriteWidth / 2;
	}
	Character.inheritsFrom(Entity);

	// STATIC
	Character.FLAGS = ["idle", "running", "jumping", "shooting", "dead", "canRun", "canJump", "canShoot"];

	Character.prototype.addFlag = function (flag) {
		var index = this.flags.indexOf(flag);
		if (Character.FLAGS.indexOf(flag) == -1 || (index != -1)) {
			return;
		}
		this.flags.push(flag);
	}

	Character.prototype.removeFlag = function (flag) {
		var index = this.flags.indexOf(flag);
		if (index == -1) {
			return;
		}
		this.flags.splice(index, 1);
	}

	Character.prototype.hasFlag = function (flag) {
		return this.flags.indexOf(flag) != -1;
	}

	Character.prototype.takeControl = function (id) {
		this.id = id;
		this.addFlag("canRun");
		this.addFlag("canJump");
		this.addFlag("canShoot");
	}

	Character.prototype.update = function (dt) {
		this.move.x = 0;
		this.move.y = 0;

		if (this.id != -1) {
			this.handleControls(dt);
		}

		// this.handleAnim();
		this.applyMove(dt);
		this.updatePhysics(dt);
	}

	Character.prototype.updatePhysics = function (dt) {
		this.previousX = this.x;
		this.previousY = this.y;

		this.x += this.xSpeed * dt + .5 * this.xForce * dt * dt;
		this.y += this.ySpeed * dt + .5 * this.yForce * dt * dt;
	
		this.xSpeed += this.xForce * dt;
		this.ySpeed += this.yForce * dt;
	}

	Character.prototype.handleControls = function (dt) {
		if (this.id == -1) {
			return;
		}

		// Move
		if (this.hasFlag("canRun")) {
			if (GamepadManager.instance.isButtonDown(this.id, GamepadManager.instance.getButtonID("RIGHT"))) {
				++this.move.x;
				this.addFlag("running");
			}

			if (GamepadManager.instance.isButtonDown(this.id, GamepadManager.instance.getButtonID("LEFT"))) {
				--this.move.x;
				this.addFlag("running");
			}
			if (GamepadManager.instance.isButtonDown(this.id, GamepadManager.instance.getButtonID("UP"))) {
				--this.move.y;
				this.addFlag("running");
			}

			if (GamepadManager.instance.isButtonDown(this.id, GamepadManager.instance.getButtonID("DOWN"))) {
				++this.move.y;
				this.addFlag("running");
			}
		}

		if (this.hasFlag("canJump")) {
			if (GamepadManager.instance.isButtonDown(this.id, GamepadManager.instance.getButtonID("A"))) {
				this.jump();
				this.removeFlag("canJump");
				this.addFlag("jumping");
			}
		}
	}

	Character.prototype.applyMove = function (dt) {
		var diffX = this.move.x * dt * this.speed;

		if ((this.xSpeed < 0 && this.move.x > 0) || (this.xSpeed > 0 && this.move.x < 0))
			this.xSpeed = 0;

		this.xSpeed += diffX;
		if (this.xSpeed > 1500) {
			this.xSpeed = 1500;
		}
		if (this.xSpeed < -1500) {
			this.xSpeed = -1500;
		}
		if (this.move.x == 0) {
			this.xSpeed *= .8 + .1 * dt;
		}
		// this.ySpeed += this.move.y * dt * this.speed;
	}

	Character.prototype.jump = function () {
		this.ySpeed = -400;
	}

	Character.prototype.handleCollision = function (collisionPoint) {
		if (collisionPoint == null) {
			this.onTheGround = false;
			this.removeFlag("canJump");
			return;
		}

		var angle = collisionPoint.angle;
		var tempAngle = Math.atan2(this.previousY - this.y, this.previousX - this.x);

		this.x += Math.cos(angle) * (30 - collisionPoint.dist + (this.onTheGround ? -1 : 0));
		this.y += Math.sin(angle) * (30 - collisionPoint.dist + (this.onTheGround ? -1 : 0));

		angle -= tempAngle - angle;

		var totalSpeed = Math.sqrt(this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed);
		if (!this.onTheGround)
			totalSpeed *= .2;

		// this.xSpeed = Math.cos(angle) * totalSpeed;
		this.ySpeed = Math.sin(angle) * totalSpeed;

		if (collisionPoint.angle < - Math.PI / 4 && collisionPoint.angle > - 3 * Math.PI / 4) {
			this.addFlag("canJump");
			this.onTheGround = true;
		}
	}


	return Character;

}(Entity, Keyboard, GamepadManager, StateMachine));
