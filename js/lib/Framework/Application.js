define(['lib/Framework/Stage'], function(Stage) {
	'use strict';

	function Application(stage) {
		// enforces new
		if (!(this instanceof Application)) {
			return new Application(stage);
		}

		///////////////////
		// PUBLIC FIELDS //
		///////////////////
		this.mainLoop = null;


		////////////////////
		// PRIVATE FIELDS //
		////////////////////
		this._stage = stage || new Stage(window.innerWidth, window.innerHeight);
		this._activities = [];
		this._prevTime = Date.now();
		this._time = 0;
		this._dt = 0;

		////////////////////
		// PUBLIC METHODS //
		////////////////////
		this.init = function () {
			this.mainLoop = requestAnimationFrame(this.update.bind(this));
		};

		this.addActivity = function (activity) {
			activity.application = this;
			this._activities.push(activity);
			this._stage.pushScreen(activity.getScreen());
			if (activity.init) {
				activity.init();
			}
			return activity;
		};

		this.removeActivity = function (activity) {
			var index = this._activities.indexOf(activity);
			if (index != -1) {
				this._stage.removeScreen(activity.getScreen());
				activity._screen = null;
				this._activities.splice(index, 1);
			}
		};

		this.update = function () {
			this._prevTime = this._prevTime || Date.now();
	        this._time = Date.now();
	        this._dt = (this._time - this._prevTime) / 1000;
	        if (this._dt > 0.2) {
	            this._dt = 0.2;
	        }

			this._stage.render();
			for (var i = 0, nbAct = this._activities.length, activity; i < nbAct; ++i) {
				activity = this._activities[i];
				if (!activity.isEnabled()) {
					continue;
				}
				activity.update(this._dt);
			}

			// Call for update at the next frame
			this.mainLoop = requestAnimationFrame(this.update.bind(this));

	        this._prevTime = this._time;
		};

		this.getStage = function () {
			return this._stage;
		};

		this.getDT = function () {
			return this._dt;
		}
	}

	return Application;
});