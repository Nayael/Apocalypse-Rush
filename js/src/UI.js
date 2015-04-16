define(['lib/Framework/Graphics', 'lib/Framework/AssetManager'], function(Graphics, AssetManager) {
	'use strict';

	function UI(data) {
		// enforces new
		if (!(this instanceof UI)) {
			return new UI(data);
		}

		this.canvas = document.createElement('canvas');
		var gameCanvas = data.activity.application.getStage().canvas;
		this.canvas.width = gameCanvas.width;
		this.canvas.height = gameCanvas.height;
		this.canvas.scaleFactor = gameCanvas.scaleFactor;
        this.canvas.style.top = (window.innerHeight / 2 - this.canvas.height / 2) + 'px';
		
		this.mode = "game";
		this.context = this.canvas.getContext('2d');
		this.scores = [];

		for (var i = 0, icon; i < data.nbPlayers; i++) {
			this.scores.push({
				index: i,
				value: 0
			});
			icon = AssetManager.instance.assets.images["cursor_p" + (i + 1)];
			this.context.drawImage(icon, 0, 0, icon.width, icon.height, i * (1920 / 4) * this.canvas.scaleFactor, 550 * this.canvas.scaleFactor, icon.width * this.canvas.scaleFactor * 2, icon.height * this.canvas.scaleFactor * 2);
			this.updateScore(i, 0);
		}
		document.body.appendChild(this.canvas);
	}

	UI.prototype.updateScore = function(index, value) {
		if (this.mode != "game") {
			return;
		}
		var score = null;
		for (var i = 0; i < this.scores.length; i++) {
			score = this.scores[i];
			if (score.index == index) {
				break;
			}
		}

		if (score == null) {
			return;
		}

		score.value = value;

		var x = (index * (1920 / 4) + 100) * this.canvas.scaleFactor;
		var y = 600 * this.canvas.scaleFactor;
		this.context.clearRect(x, y - (35 * this.canvas.scaleFactor) , 200 * this.canvas.scaleFactor, 100 * this.canvas.scaleFactor);
		this.context.font = (35 * this.canvas.scaleFactor) + "px Verdana";
		this.context.fillStyle = "white";
		this.context.fillText(value, x, y);
	}

	UI.prototype.showLeaderboard = function () {
		this.mode = "leaderboard";
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
		this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.scores.sort(function (a, b) {
			return b.value - a.value;
		});

		var x = (960 - 100) * this.canvas.scaleFactor;
		var y = 0;
		for (var i = 0, icon, score, playerID; i < this.scores.length; i++) {
			score = this.scores[i];
			playerID = score.index;
			y = 35 + (100 * i) * this.canvas.scaleFactor;
			icon = AssetManager.instance.assets.images["cursor_p" + (playerID + 1)];

			this.context.drawImage(icon, 0, 0, icon.width, icon.height, x, y, icon.width * this.canvas.scaleFactor * 2, icon.height * this.canvas.scaleFactor * 2);
			
			this.context.font = (35 * this.canvas.scaleFactor) + "px Verdana";
			this.context.fillStyle = "white";
			this.context.fillText(score.value, x + icon.width * this.canvas.scaleFactor * 2 + 20, y + 35);
		}

		this.context.fillText("Press START to continue", x -(100 * this.canvas.scaleFactor), 580 * this.canvas.scaleFactor);

	}

	UI.prototype.destroy = function () {
		this.scores.length = 0;
		this.scores = null;
		document.body.removeChild(this.canvas);
		this.canvas = null;
	}

	return UI;
});