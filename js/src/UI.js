var UI = (function(Graphics, AssetManager) {
	'use strict';

	function UI(nbPlayers) {
		// enforces new
		if (!(this instanceof UI)) {
			return new UI(nbPlayers);
		}

		this.canvas = document.createElement('canvas');
		var gameCanvas = gameActivity.application.getStage().canvas;
		this.canvas.width = gameCanvas.width;
		this.canvas.height = gameCanvas.height;
		this.canvas.scaleFactor = gameCanvas.scaleFactor;
        this.canvas.style.top = (window.innerHeight / 2 - this.canvas.height / 2) + 'px';
		
		this.context = this.canvas.getContext('2d');
		this.scores = [];

		for (var i = 0, icon; i < nbPlayers; i++) {
			icon = AssetManager.instance.assets.images["cursor_p" + (i + 1)];
			this.context.drawImage(icon, 0, 0, icon.width, icon.height, i * (1920 / 4) * this.canvas.scaleFactor, 550 * this.canvas.scaleFactor, icon.width * this.canvas.scaleFactor * 2, icon.height * this.canvas.scaleFactor * 2);
			this.updateScore(i, 0);
		}
		document.body.appendChild(this.canvas);
	}

	UI.prototype.updateScore = function(index, value) {
		var x = (index * (1920 / 4) + 100) * this.canvas.scaleFactor;
		var y = 600 * this.canvas.scaleFactor;
		this.context.clearRect(x, y - (35 * this.canvas.scaleFactor) , 200 * this.canvas.scaleFactor, 100 * this.canvas.scaleFactor);
		this.context.font = (35 * this.canvas.scaleFactor) + "px Verdana";
		this.context.fillStyle = "white";
		this.context.fillText(value, x, y);
	}

	return UI;
}(Graphics, AssetManager));