var MainActivity = (function(Activity, Howl, Consts, AssetManager, Utils) {
	'use strict';

	function MainActivity(params) {
		// enforces new
		if (!(this instanceof MainActivity)) {
			return new MainActivity(params);
		}
		Activity.apply(this, params);

		this._assets = assets;
	    this.loader = new PxLoader();
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
        var loading_bar_outside = new Entity({
        	graphics: new Graphics(null, {
                spritesheet: AssetManager.instance.assets.images['loading_bar_outside']
        	})
        });
        var loading_bar_inside  = new Entity({
        	graphics: new Graphics(null, {
                spritesheet: AssetManager.instance.assets.images['loading_bar_inside']
        	})
        });
        var barTotalWidth = loading_bar_inside.graphics.spriteWidth + 0;
        loading_bar_inside.graphics.spriteWidth = 0;
        loading_bar_inside.x = (Consts.SCREEN_WIDTH >> 1) - loading_bar_inside.graphics.spritesheet.width / 2;
        loading_bar_inside.y = (Consts.SCREEN_HEIGHT >> 1);

        loading_bar_outside.x = (Consts.SCREEN_WIDTH >> 1) - loading_bar_outside.graphics.spritesheet.width / 2;
        loading_bar_outside.y = (Consts.SCREEN_HEIGHT >> 1);
        this._screen.addChild(loading_bar_outside);
        this._screen.addChild(loading_bar_inside);

        AssetManager.instance.removeListener(AssetManager.LOADING_COMPLETE, this.onLoadingScreenLoaded);

        AssetManager.instance.enqueueAssets(this._assets);
        AssetManager.instance.addListener(AssetManager.LOADING_COMPLETE, onImagesLoadingComplete, this);
        AssetManager.instance.loadAll(updateLoadingScreen);

        function updateLoadingScreen(e) {
            loading_bar_inside.graphics.spriteWidth = barTotalWidth * (e.completedCount / e.totalCount);
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
            	src: ['assets/audio/SFX/SFX_Missile_Siren_Coming.ogg'],
                preload: true,
                loop: false,
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
	    	imagesLoadComplete = true;
			if (soundLoadComplete) {
				this.onLoadingFinished();
			}
	    }
	}

	MainActivity.prototype.onLoadingFinished = function (e) {
	    var gameActivity = new GameActivity();
	    this.application.removeActivity(this);
	    this.application.addActivity(gameActivity);
	    gameActivity.launch(this._assets);
	}

	return MainActivity;
}(Activity, Howl, Consts, AssetManager, Utils));