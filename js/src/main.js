window.onload = function() {

    var stage = new Stage(Consts.SCREEN_WIDTH, Consts.SCREEN_HEIGHT, "rgb(255, 255, 200)");
	var application = new Application(stage);
	InputManager.instance.init();

    application.init();

    var gameActivity = new GameActivity();
    var pauseActivity = new Activity();
    application.addActivity(pauseActivity);
    application.addActivity(gameActivity);
    
    pauseActivity.setEnabled(false);
    gameActivity.init();
}