define(['lib/Framework/MakeEventDispatcher'], function(MakeEventDispatcher) {
	'use strict';

	function Entity(params) {
		// enforces new
		if (!(this instanceof Entity)) {
			return new Entity(params);
		}
		this.enabled  = true;
		this.graphics = null;
		this.x        = 0;
		this.y        = 0;
		this.name     = null;
		this.activity = null;

		if (params) {
			this.width    = params.width;
			this.height   = params.height;
			this.name     = params.name || null;
			this.activity = params.activity || null;

			if (params.graphics) {
				this.graphics = params.graphics;
				this.graphics.entity = this;
			}
		}
        MakeEventDispatcher(this);
	}

	Entity.prototype.init = function() {
		
	};


	Entity.prototype.update = function(dt) {
		
	};

	return Entity;

});