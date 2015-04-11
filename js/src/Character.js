var Character = (function(Entity, Keyboard, GamepadManager) {
	'use strict';

	function Character() {
		// enforces new
		if (!(this instanceof Character)) {
			return new Character();
		}
		Entity.constructor.apply(this, arguments);

		this.speed = 1000;
		
		// ID of the character is also the gamepad ID
		this.id = -1;
	}
	Character.inheritsFrom(Entity);

	Character.prototype.update = function (dt) {
		if (GamepadManager.instance.isButtonDown(this.id, GamepadManager.instance.getButtonID("RIGHT"))) {
			this.x += dt * this.speed;
		}
		if (GamepadManager.instance.isButtonDown(this.id, GamepadManager.instance.getButtonID("LEFT"))) {
			this.x -= dt * this.speed;
		}
	}

	return Character;

}(Entity, Keyboard, GamepadManager));
