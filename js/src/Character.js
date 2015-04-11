var Character = (function(Entity, Keyboard) {
	'use strict';

	function Character() {
		// enforces new
		if (!(this instanceof Character)) {
			return new Character();
		}
		Entity.constructor.apply(this, arguments);

		this.speed = 1000;
	}
	Character.inheritsFrom(Entity);

	Character.prototype.update = function (dt) {
		if (Keyboard.isDown(Keyboard.RIGHT_ARROW)) {
			this.x += dt * this.speed;
		}
		if (Keyboard.isDown(Keyboard.LEFT_ARROW)) {
			this.x -= dt * this.speed;
		}
	}

	return Character;

}(Entity, Keyboard));
