define(['lib/Framework/Activity', 'Howl', 'src/Consts', 'lib/Framework/AssetManager', 'lib/Utils', 'lib/Framework/GamepadManager', 'Keyboard', 'lib/Framework/Entity', 'lib/Framework/Graphics'],
function(Activity, Howl, Consts, AssetManager, Utils, GamepadManager, Keyboard, Entity, Graphics) {
	'use strict';

	function MainActivity(params) {
		// enforces new
		if (!(this instanceof MainActivity)) {
			return new MainActivity(params);
		}
		Activity.apply(this, params);

		this._assets = assets;
        this.loading_bar_outside = null;
        this.loading_bar_inside  = null;
        this.title               = null;
        this.pressStart          = null;
        this.logo                = null;
        this.creditsLogo         = null;
        this.creditsLogoBack     = null;
        this.credits             = null;
	}
	MainActivity.inheritsFrom(Activity);

	MainActivity.prototype.init = function () {
        // Initializing Asset manager
        AssetManager.instance.enqueueAssets(this._assets, "loading");
        AssetManager.instance.addListener(AssetManager.LOADING_COMPLETE, this.onLoadingScreenLoaded, this);
        AssetManager.instance.loadAll();
	}

	/**
	 * Preloads the assets
	 */
	MainActivity.prototype.onLoadingScreenLoaded = function(e) {
        AssetManager.instance.removeListener(AssetManager.LOADING_COMPLETE, this.onLoadingScreenLoaded);

        this.loading_bar_outside = new Entity({
            graphics: new Graphics(null, {
                spritesheet: AssetManager.instance.assets.images['loading_bar_outside']
            })
        });
        this.loading_bar_inside  = new Entity({
            graphics: new Graphics(null, {
                spritesheet: AssetManager.instance.assets.images['loading_bar_inside']
            })
        });
        var barTotalWidth = this.loading_bar_inside.graphics.spriteWidth + 0;
        this.loading_bar_inside.graphics.spriteWidth = 0;
        this.loading_bar_inside.x = (Consts.SCREEN_WIDTH >> 1) - this.loading_bar_inside.graphics.spritesheet.width / 2;
        this.loading_bar_inside.y = (Consts.SCREEN_HEIGHT >> 1);

        this.loading_bar_outside.x = (Consts.SCREEN_WIDTH >> 1) - this.loading_bar_outside.graphics.spritesheet.width / 2;
        this.loading_bar_outside.y = (Consts.SCREEN_HEIGHT >> 1);
        this._screen.addChild(this.loading_bar_outside);
        this._screen.addChild(this.loading_bar_inside);

        AssetManager.instance.enqueueAssets(this._assets);
        AssetManager.instance.addListener(AssetManager.LOADING_COMPLETE, onImagesLoadingComplete, this);
        AssetManager.instance.loadAll(updateLoadingScreen.bind(this));

        function updateLoadingScreen(e) {
            this.loading_bar_inside.graphics.spriteWidth = barTotalWidth * (e.completedCount / e.totalCount);
        };

        var nbLoadedSounds = 0;
        var soundLoadComplete = false;
        var imagesLoadComplete = false;
        this._assets.sounds = {
            MUSIC_Layer_01: new Howl({
                src: ['assets/audio/MUSIC/MUSIC_Layer_01.ogg'],
                preload: true,
                loop: true,
                onload: onSoundLoaded.bind(this)
            }),
            MUSIC_Layer_02: new Howl({
                src: ['assets/audio/MUSIC/MUSIC_Layer_02.ogg'],
                preload: true,
                loop: true,
                onload: onSoundLoaded.bind(this)
            }),
            MUSIC_Layer_03: new Howl({
                src: ['assets/audio/MUSIC/MUSIC_Layer_03.ogg'],
                preload: true,
                loop: true,
                onload: onSoundLoaded.bind(this)
            }),
            MUSIC_Layer_04: new Howl({
                src: ['assets/audio/MUSIC/MUSIC_Layer_04.ogg'],
                preload: true,
                loop: true,
                onload: onSoundLoaded.bind(this)
            }),
            MUSIC_Menu_Layer_01: new Howl({
                src: ['assets/audio/MUSIC/MUSIC_Menu_Layer_01.ogg'],
                preload: true,
                loop: true,
                onload: onSoundLoaded.bind(this)
            }),
            MUSIC_Menu_Layer_02: new Howl({
                src: ['assets/audio/MUSIC/MUSIC_Menu_Layer_02.ogg'],
                preload: true,
                loop: true,
                onload: onSoundLoaded.bind(this)
            }),
            MUSIC_Menu_Layer_03: new Howl({
                src: ['assets/audio/MUSIC/MUSIC_Menu_Layer_03.ogg'],
                preload: true,
                loop: true,
                onload: onSoundLoaded.bind(this)
            }),
            MUSIC_Menu_Layer_04: new Howl({
                src: ['assets/audio/MUSIC/MUSIC_Menu_Layer_04.ogg'],
                preload: true,
                loop: true,
                onload: onSoundLoaded.bind(this)
            }),
            MUSIC_Amb_Menu: new Howl({
                src: ['assets/audio/MUSIC/Amb_Menu_loop.ogg'],
                preload: true,
                loop: true,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Feedback_Missile: new Howl({
                src: ['assets/audio/SFX/SFX_Feedback_Missile.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Impact_Hit_Player_01: new Howl({
                src: ['assets/audio/SFX/SFX_Impact_Hit_Player_01.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Impact_Hit_Player_02: new Howl({
                src: ['assets/audio/SFX/SFX_Impact_Hit_Player_02.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Impact_Hit_Player_03: new Howl({
                src: ['assets/audio/SFX/SFX_Impact_Hit_Player_03.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Impact_Hit_Player_04: new Howl({
                src: ['assets/audio/SFX/SFX_Impact_Hit_Player_04.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Impact_Siren_01: new Howl({
                src: ['assets/audio/SFX/SFX_Impact_Siren_01.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Jump_Player_01: new Howl({
                src: ['assets/audio/SFX/SFX_Jump_Player_01.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Jump_Player_02: new Howl({
                src: ['assets/audio/SFX/SFX_Jump_Player_02.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Jump_Player_03: new Howl({
                src: ['assets/audio/SFX/SFX_Jump_Player_03.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Jump_Player_04: new Howl({
                src: ['assets/audio/SFX/SFX_Jump_Player_04.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Missile_Siren_Coming: new Howl({
                src: ['assets/audio/SFX/SFX_Missile_Siren_Coming_Loop.ogg'],
                preload: true,
                loop: true,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Shoot_Player_01: new Howl({
                src: ['assets/audio/SFX/SFX_Shoot_Player_01.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Shoot_Player_02: new Howl({
                src: ['assets/audio/SFX/SFX_Shoot_Player_02.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Shoot_Player_03: new Howl({
                src: ['assets/audio/SFX/SFX_Shoot_Player_03.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            SFX_Shoot_Player_04: new Howl({
                src: ['assets/audio/SFX/SFX_Shoot_Player_04.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            HUD_Switch: new Howl({
                src: ['assets/audio/HUD/HUD_Switch.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            }),
            HUD_Click: new Howl({
                src: ['assets/audio/HUD/HUD_Click.ogg'],
                preload: true,
                loop: false,
                onload: onSoundLoaded.bind(this)
            })
        };

        function onSoundLoaded () {
            ++nbLoadedSounds;
            if (nbLoadedSounds >= Utils.objectLength(this._assets.sounds)) {
                soundLoadComplete = true;
                if (imagesLoadComplete) {
                    this.onLoadingFinished();
                }
            }
        }

        function onImagesLoadingComplete (e) {
        AssetManager.instance.removeListener(AssetManager.LOADING_COMPLETE, onImagesLoadingComplete);
            imagesLoadComplete = true;
            if (soundLoadComplete) {
                this.onLoadingFinished();
            }
        }
    }

    MainActivity.prototype.onLoadingFinished = function (e) {
        this._screen.removeChild(this.loading_bar_outside);
        this._screen.removeChild(this.loading_bar_inside);

        var splash = {
            graphics: new Graphics(null, {
                spritesheet: AssetManager.instance.assets.images.background,
                localX: -1280
            })
        };

        this.title = {
            graphics: new Graphics({x: Consts.SCREEN_WIDTH / 2, y: 100}, {
                spritesheet: AssetManager.instance.assets.images.title,
                localX: -AssetManager.instance.assets.images.title.width / 2
            })
        };

        this.pressStart = {
            graphics: new Graphics({x: Consts.SCREEN_WIDTH / 2, y: Consts.SCREEN_HEIGHT - 200}, {
                spritesheet: AssetManager.instance.assets.images.pressStart,
                localX: -AssetManager.instance.assets.images.pressStart.width / 2
            })
        };

        this.credits = {
            graphics: new Graphics({x: Consts.SCREEN_WIDTH / 2 - AssetManager.instance.assets.images.credits.width / 2, y: Consts.SCREEN_HEIGHT - AssetManager.instance.assets.images.credits.height - 20}, {
                spritesheet: AssetManager.instance.assets.images.credits,
            })
        };

        this.creditsLogo = {
            graphics: new Graphics({x: Consts.SCREEN_WIDTH - AssetManager.instance.assets.images.creditsLogo.width - 20, y: Consts.SCREEN_HEIGHT - AssetManager.instance.assets.images.creditsLogo.height - 20}, {
                spritesheet: AssetManager.instance.assets.images.creditsLogo,
            })
        };

        this.creditsLogoBack = {
            graphics: new Graphics({x: Consts.SCREEN_WIDTH - AssetManager.instance.assets.images.creditsLogoBack.width - 20, y: Consts.SCREEN_HEIGHT - AssetManager.instance.assets.images.creditsLogoBack.height - 20}, {
                spritesheet: AssetManager.instance.assets.images.creditsLogoBack,
            })
        };

        this.logo = {
            graphics: new Graphics({x: 20, y: Consts.SCREEN_HEIGHT - AssetManager.instance.assets.images.logo.height}, {
                spritesheet: AssetManager.instance.assets.images.logo,
            })
        };

        this._screen.addChild(splash);
        this._screen.addChild(this.title);
        this._screen.addChild(this.logo);
        this.showMenu();

        this._assets.sounds["MUSIC_Amb_Menu"].play();
        this._assets.sounds["MUSIC_Menu_Layer_01"].play();
        this._assets.sounds["MUSIC_Menu_Layer_02"].play();
        this._assets.sounds["MUSIC_Menu_Layer_03"].play();
        this._assets.sounds["MUSIC_Menu_Layer_04"].play();
        this._assets.sounds["MUSIC_Menu_Layer_01"].volume(0.7);
        this._assets.sounds["MUSIC_Menu_Layer_02"].volume(0.7);
        this._assets.sounds["MUSIC_Menu_Layer_03"].volume(0.7);
        this._assets.sounds["MUSIC_Menu_Layer_04"].volume(0.7);
    }

    MainActivity.prototype.showMenu = function () {
        this._assets.sounds["HUD_Switch"].play();
        this._screen.addChild(this.pressStart);
        this._screen.addChild(this.creditsLogo);

        // Blink press start
        var blink = setInterval(function () {
            this.pressStart.graphics.enabled = !this.pressStart.graphics.enabled;
        }.bind(this), 600);

        GamepadManager.instance.addListener(GamepadManager.GamepadEvent.BUTTON_DOWN, onButtonDown, this);

        function onButtonDown (e) {
            if (e.button == "START") {
                clearInterval(blink);
                GamepadManager.instance.removeListener(GamepadManager.GamepadEvent.BUTTON_DOWN, onButtonDown);
                this._assets.sounds["HUD_Click"].play();
                this.startGame();
            }
            if (e.button == "BACK") {
                clearInterval(blink);
                GamepadManager.instance.removeListener(GamepadManager.GamepadEvent.BUTTON_DOWN, onButtonDown);
                this.showCredits();
            }
        }
    }

    MainActivity.prototype.showCredits = function () {

        this._assets.sounds["HUD_Switch"].play();
        this._screen.removeChild(this.pressStart);
        this._screen.removeChild(this.creditsLogo);
        this._screen.addChild(this.credits);
        this._screen.addChild(this.creditsLogoBack);
        GamepadManager.instance.addListener(GamepadManager.GamepadEvent.BUTTON_DOWN, onButtonDown, this);
        
        function onButtonDown (e) {
            if (e.button == "BACK") {
                GamepadManager.instance.removeListener(GamepadManager.GamepadEvent.BUTTON_DOWN, onButtonDown);
                this.hideCredits();
                this.showMenu();
            }
        }
    }

    MainActivity.prototype.hideCredits = function () {
        this._screen.removeChild(this.creditsLogoBack);
        this._screen.removeChild(this.credits);
    }

    MainActivity.prototype.startGame = function () {
        this.loading_bar_outside = null;
        this.loading_bar_inside = null;
        this.title = null;
        this.pressStart = null;
        this.logo = null;
        this.creditsLogo = null;
        this.creditsLogoBack = null;
        this.credits = null;


        this._assets.sounds["MUSIC_Amb_Menu"].stop();
        this._assets.sounds["MUSIC_Menu_Layer_01"].stop();
        this._assets.sounds["MUSIC_Menu_Layer_02"].stop();
        this._assets.sounds["MUSIC_Menu_Layer_03"].stop();
        this._assets.sounds["MUSIC_Menu_Layer_04"].stop();

        this._assets.sounds["MUSIC_Amb_Menu"] = null;
        this._assets.sounds["MUSIC_Menu_Layer_01"] = null;
        this._assets.sounds["MUSIC_Menu_Layer_02"] = null;
        this._assets.sounds["MUSIC_Menu_Layer_03"] = null;
        this._assets.sounds["MUSIC_Menu_Layer_04"] = null;

        window.gameActivity = new GameActivity({
            level: 0
        });
        this.application.removeActivity(this);
        this.application.addActivity(gameActivity);
        gameActivity.launch(this._assets);
    }

	return MainActivity;
});