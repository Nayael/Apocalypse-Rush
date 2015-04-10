var Entity = (function(MakeEventDispatcher) {
	'use strict';

	function Entity(params) {
		// enforces new
		if (!(this instanceof Entity)) {
			return new Entity(params);
		}
		this.enabled = true;
		this.graphics = null;
		this.x = 0;
		this.y = 0;
        this.name = null;

		if (params) {
			if (params.graphics) {
				this.graphics = params.graphics;
				this.graphics.entity = this;
			}
			if (params.name) {
				this.name = params.name;
			}
		}
        MakeEventDispatcher(this);
	}

	Entity.prototype.init = function() {
		
	};


	Entity.prototype.update = function() {
		
	};

	return Entity;
}(MakeEventDispatcher));