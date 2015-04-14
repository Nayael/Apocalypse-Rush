require.config({
	baseUrl: 'js',
	paths: {
		'Keyboard': './lib/Keyboard.min',
		'Howl': './lib/howler.min',
		'PxLoader': './lib/Framework/lib/PxLoader/PxLoader',
		'PxLoaderImage': './lib/Framework/lib/PxLoader/PxLoaderImage'
	},
	shim: {
		'Keyboard': {
			exports: "Keyboard"
		},
		'Howl': {
			exports: "Howl"
		},
		'PxLoader': {
			exports: "PxLoader"
		},
		'PxLoaderImage': {
			deps: ['PxLoader'],
			exports: "PxLoaderImage"
		}
	}
});

require(['lib/onEachFrame', 'lib/inheritance', '../assets/data/assets', '../assets/data/levelPatterns']);

require(['lib/Framework/Application', 'lib/Framework/Stage', 'lib/Framework/InputManager', 'src/Activities/MainActivity', 'src/Consts'], function (Application, Stage, InputManager, MainActivity, Consts) {
    var stage = new Stage(Consts.SCREEN_WIDTH, Consts.SCREEN_HEIGHT, "rgb(0,0,0)");
	var application = new Application(stage);
    application.getStage().canvas.style.top = (window.innerHeight / 2 - application.getStage().canvas.height / 2) + 'px';

	InputManager.instance.init();

    application.init();

    var mainActivity = new MainActivity();
    application.addActivity(mainActivity);
});