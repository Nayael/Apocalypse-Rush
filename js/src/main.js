window.onload = function() {

    var stage = new Stage(Consts.SCREEN_WIDTH, Consts.SCREEN_HEIGHT, "rgb(0,127,255)");
	var application = new Application(stage);
	InputManager.instance.init();

    application.init();

    var mainActivity = new MainActivity();
    application.addActivity(mainActivity);
}