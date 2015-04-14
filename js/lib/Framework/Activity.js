define(['lib/Framework/Screen'], function(Screen) {
	'use strict';

	function Activity(existingEntities) {
		// enforces new
		if (!(this instanceof Activity)) {
			return new Activity(existingEntities);
		}
		
        ///////////////////////
        // PUBLIC ATTRIBUTES //
        ///////////////////////
        this.application = null;

        ////////////////////////
        // PRIVATE ATTRIBUTES //
        ////////////////////////
		this._entities = (existingEntities && (existingEntities instanceof Array) && existingEntities.length > 0) ? existingEntities : [];
		this._screen = new Screen(this, this._entities);
		this._enabled = true;
	}

    ////////////////////////////////////////////////////////
    // PUBLIC METHODS (with access to private attributes) //
    ////////////////////////////////////////////////////////
    /**
     * Update the activity
     */
	Activity.prototype.update = function(dt) {
		if (!this._enabled) {
			return;
		}

		for (var i = 0, nbEnt = this._entities.length, ent; i < nbEnt; ++i) {
			ent = this._entities[i];
			if (ent && ent.update && ent.enabled) {
				ent.update(dt);
			}
		}
	};

	Activity.prototype.getScreen = function () {
		return this._screen;
	};

	Activity.prototype.setEnabled = function (value) {
		this._enabled = value;
	};

	Activity.prototype.isEnabled = function () {
		return this._enabled;
	};

	return Activity;

});