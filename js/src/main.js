window.onload = function() {
    var stage = new Stage(Consts.SCREEN_WIDTH, Consts.SCREEN_HEIGHT, "rgb(0,127,255)");
	var application = new Application(stage);
    application.getStage().canvas.style.top = (window.innerHeight / 2 - application.getStage().canvas.height / 2) + 'px';

	InputManager.instance.init();

    application.init();

    var mainActivity = new MainActivity();
    application.addActivity(mainActivity);
}