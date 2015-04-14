define(['lib/Framework/MakeEventDispatcher'], function (MakeEventDispatcher) {
	'use strict';


	////////////
	// CLASSES
	//
	var GamepadEvent = (function() {
		'use strict';

		function GamepadEvent(type) {
			// enforces new
			if (!(this instanceof GamepadEvent)) {
				return new GamepadEvent(type);
			}
			this.target = null;
			this.currentTarget = null;
			this.type = type || '';


		}

		return GamepadEvent;
	})();

	////////////
	// STATIC ATTRIBUTES
	//
	GamepadEvent.BUTTON_DOWN    = "GamepadEvent.BUTTON_DOWN";
	GamepadEvent.BUTTON_PRESSED = "GamepadEvent.BUTTON_PRESSED";
	GamepadEvent.BUTTON_UP      = "GamepadEvent.BUTTON_UP";
	GamepadEvent.JOYSTICK       = "GamepadEvent.JOYSTICK";

	var Controller = (function() {
		'use strict';
	
		function Controller(gamepad) {
			// enforces new
			if (!(this instanceof Controller)) {
				return new Controller(gamepad);
			}
			this.gamepad = gamepad;
			this.pressedButtons = [];
		}
		
		return Controller;
	}());


	/**
	 * @constructor
	 * GamepadManager
	 */
	function GamepadManager() {
		// enforces new
		if (!(this instanceof GamepadManager)) {
			return new GamepadManager();
		}
		MakeEventDispatcher(this);

		////////////////////////
		// PRIVATE ATTRIBUTES //
		////////////////////////
		var _controllers = [];

		window.addEventListener("gamepadconnected", _onGamepadConnected.bind(this));
		window.addEventListener("gamepaddisconnected", _onGamepadDisconnected.bind(this));

		////////////////////
		// PUBLIC METHODS //
		////////////////////
		/**
		 * Checks if a given button is pressed on a given gamepad
		 * @param  {number}  gamepadID The gamepad ID
		 * @param  {number}  bt        The button ID
		 * @return {Boolean}           True if the button is pressed
		 */
		this.isButtonDown = function (gamepadID, bt) {
			var controller = this.getController(gamepadID);
			if (controller == null) {
				return false;
			}
			return (controller.pressedButtons.indexOf(bt) != -1);
		}

		/**
		 * Checks if a given button is pressed on a given gamepad
		 * @param  {number}  gamepadID The gamepad ID
		 * @param  {number}  bt        The button ID
		 * @return {Boolean}           True if the button is pressed
		 */
		this.isButtonUp = function (gamepadID, bt) {
			var controller = this.getController(gamepadID);
			if (controller == null) {
				return false;
			}
			return (controller.pressedButtons.indexOf(bt) == -1);
		}

		/////////////////////
		// PRIVATE METHODS //
		/////////////////////
		function _onGamepadConnected(e) {
			console.log('e: ', e);
			_addController.call(this, e.gamepad);
		}

		function _onGamepadDisconnected(e) {
			console.log('e: ', e);
			_removeController.call(this, e.gamepad);
		}

		function _addController(gp) {
			var controller = this.getController(gp);
			if (controller != null) {
				return;
			}
			_controllers.push(new Controller(gp));
		}

		function _removeController(gp) {
			var controller = this.getController(gp);
			if (controller == null) {
				return;
			}
			_controllers.splice(i, 1);
		}

		function _update() {
			var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
			var i = 0, axis = 0;
			for (i = 0; i < gamepads.length; i++) {
				if (gamepads[i]) {
					if (!(gamepads[i].index in _controllers)) {
						_addController.call(this, gamepads[i]);
					} else {
						_controllers[gamepads[i].index] = this.getController(gamepads[i]) || new Controller(gamepads[i]);
					}
				}
			}

			var val;
			var button;
			var buttonName;
			var pressed;
			var controller;
			var gamepad;
			var btIndex;

			for (var j in _controllers) {
				controller = _controllers[j];
				gamepad = controller.gamepad;

				for (i = 0; i < gamepad.buttons.length; i++) {
					button = gamepad.buttons[i];
					buttonName = this.getButtonName(i);
					pressed = button == 1.0;
					if (typeof(button) == "object") {
						pressed = button.pressed;
						val = button.value;
					}

					if (pressed) {
						if (controller.pressedButtons.indexOf(i) == -1) {
							controller.pressedButtons.push(i);

							this.dispatch(GamepadEvent.BUTTON_DOWN, {
								gamepad: j,
								button: buttonName,
								value: val
							});
						}

						this.dispatch(GamepadEvent.BUTTON_PRESSED, {
							gamepad: j,
							button: buttonName,
							value: val
						});
					} else {
						btIndex = controller.pressedButtons.indexOf(i);
						if (btIndex != -1) {
							controller.pressedButtons.splice(btIndex, 1);

							this.dispatch(GamepadEvent.BUTTON_UP, {
								gamepad: j,
								button: buttonName,
								value: val
							});
						}
					}
				}
			}

			requestAnimationFrame(_update.bind(this));
		}

		requestAnimationFrame(_update.bind(this));

		this.getController = function (gp) {
			var controller = null;
			if (gp instanceof Gamepad) {
				for (var i = 0; i < _controllers.length; ++i) {
					if (_controllers[i].gamepad == gp) {
						controller = _controllers[i];
						break;
					}
				}
			} else if (typeof(gp) === 'number' && (gp in _controllers)) {
				controller = _controllers[gp];
			}
			return controller;
		}

		this.getControllers = function () {
			return _controllers;
		}
	}
	GamepadManager.GamepadEvent = GamepadEvent;	
	GamepadManager.BUTTONS = ["A", "B", "X", "Y", "LB", "RB", "LT", "RT", "BACK", "START", "LEFT_JOYSTICK", "RIGHT_JOYSTICK", "UP", "DOWN", "LEFT", "RIGHT", "GUIDE"];

	GamepadManager.prototype.getButtonName = function (id) {
		return GamepadManager.BUTTONS[id];
	}

	GamepadManager.prototype.getButtonID = function (name) {
		return GamepadManager.BUTTONS.indexOf(name);
	}

	// Singleton
	GamepadManager.instance = new GamepadManager();
	return GamepadManager;
	
});