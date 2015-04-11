var Character = (function(Entity, Keyboard, GamepadManager, StateMachine) {
	'use strict';

	function Character(params) {
		// enforces new
		if (!(this instanceof Character)) {
			return new Character(params);
		}
		Entity.constructor.apply(this, params);

		this.speed = 100;

		// ID of the character is also the gamepad ID
		this.id = -1;
		this.flags = [];
		this.joystickVal = 0;
		this.move = {
			x: 0,
			y: 0
		};

		this.graphics = new Graphics(this, {
			spritesheet: params.sprites.idle_right,
			width: params.width,
			height: params.height
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
	}

	Character.prototype.handleControls = function (dt) {
		if (this.id == -1) {
			return;
		}

		// Move
		if (this.hasFlag("canRun")) {
			var curJoystickVal = GamepadManager.instance.getController(this.id).gamepad.axes[0];
			var joystickMove = curJoystickVal - this.joystickVal;
			if (joystickMove != 0) {
				this.move.x += joystickMove;
				this.addFlag("running");
			}
			if (GamepadManager.instance.isButtonDown(this.id, GamepadManager.instance.getButtonID("RIGHT"))) {
				++this.move.x;
				this.addFlag("running");
			}

			if (GamepadManager.instance.isButtonDown(this.id, GamepadManager.instance.getButtonID("LEFT"))) {
				--this.move.x;
				this.addFlag("running");
			}
			this.joystickVal = curJoystickVal;
		}

		if (this.hasFlag("canJump")) {

		}
	}

	Character.prototype.applyMove = function (dt) {
		this.x += this.move.x * dt * this.speed;
		this.y += this.move.y * dt * this.speed;
		
	}

	return Character;

}(Entity, Keyboard, GamepadManager, StateMachine));
