var Enemy = (function(Entity) {
	'use strict';

	function Enemy(params) {
		// enforces new
		if (!(this instanceof Enemy)) {
			return new Enemy(params);
		}
		Entity.apply(this, arguments);

		this.x = params.x;
		this.y = params.y;

		this.graphics = new Graphics(this, {
			spritesheet: AssetManager.instance.assets.images["enemy"]
		});

		window.gameActivity._screen.addChild(this);
	}

	Enemy.inheritsFrom(Entity);

	return Enemy;
}(Entity));