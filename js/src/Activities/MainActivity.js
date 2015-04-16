define(['lib/Framework/Activity', 'src/Activities/GameActivity', 'Howl', 'src/Consts', 'lib/Framework/AssetManager', 'lib/Utils', 'lib/Framework/GamepadManager', 'Keyboard', 'lib/Framework/Entity', 'lib/Framework/Graphics', 'lib/Framework/InputManager', 'lib/Framework/MakeEventDispatcher'],
function(Activity, GameActivity, Howl, Consts, AssetManager, Utils, GamepadManager, Keyboard, Entity, Graphics, InputManager, MakeEventDispatcher) {
	'use strict';

	function MainActivity(params) {
		// enforces new
		if (!(this instanceof MainActivity)) {
			return new MainActivity(params);
		}
		Activity.apply(this, arguments);

		this._assets = assets;
        this.players = [{
            id: 0,
            gamepadID: -1,
            keyboard: false
        }, {
            id: 1,
            gamepadID: -1,
            keyboard: false
        }, {
            id: 2,
            gamepadID: -1,
            keyboard: false
        }, {
            id: 3,
            gamepadID: -1,
            keyboard: false
        }];

        this.canStart = false;

        this.loading_bar_outside = null;
        this.loading_bar_inside  = null;
        this.title               = null;
        this.pressStart          = null;
        this.logo                = null;
        this.creditsLogo         = null;
        this.creditsLogoBack     = null;
        this.credits             = null;
        this.playerIcons         = [];
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

        var nbLoadedSounds     = 0;
        var soundLoadComplete  = false;
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
        MakeEventDispatcher(splash);
        splash.addListener(InputManager.InputEvent.TOUCH_MOVE, this.onBgHovered, this);

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
        MakeEventDispatcher(this.logo);
        this.logo.addListener(InputManager.InputEvent.TOUCH_CLICKED, this.onLogoClicked, this);
        this.logo.addListener(InputManager.InputEvent.TOUCH_MOVE, this.onLogoHovered, this);

        this._screen.addChild(splash);
        this._screen.addChild(this.title);
        this._screen.addChild(this.logo);

        for (var i = 0, icon = null, controllerIcon = null, keyboardIcon = null, playerStart = null, playerStartKey = null; i < this.players.length; i++) {
            playerStartKey = null;
            icon = {
                graphics: new Graphics({
                    x: 20,
                    y: 60 + (i * 70)
                }, {
                    spritesheet: AssetManager.instance.assets.images["cursor_p" + (i + 1)]
                })
            };
            controllerIcon = {
                graphics: new Graphics({
                    x: (i < 2 ? 150 : 75),
                    y: 65 + (i * 70)
                }, {
                    spritesheet: AssetManager.instance.assets.images.controllerIconTransparent
                })
            };
            playerStart = {
                graphics: new Graphics({
                    x: (i < 2 ? 215 : 140),
                    y: 50 + (i * 70)
                }, {
                    spritesheet: AssetManager.instance.assets.images.playerStart
                })
            };

            if (i < 2) {
                keyboardIcon = {
                    graphics: new Graphics({
                        x: 75,
                        y: 55 + (i * 70)
                    }, {
                        spritesheet: AssetManager.instance.assets.images.keyboardTransparent
                    })
                };
                playerStartKey = {
                    graphics: new Graphics({
                        x: 295,
                        y: 62 + (i * 70)
                    }, {
                        spritesheet: AssetManager.instance.assets.images.sKey
                    })
                };
                this._screen.addChild(keyboardIcon);
                this._screen.addChild(playerStartKey);
            }

            this._screen.addChild(icon);
            this._screen.addChild(controllerIcon);
            this._screen.addChild(playerStart);
            this.playerIcons.push({
                icon: icon,
                controllerIcon: controllerIcon,
                keyboardIcon: keyboardIcon,
                playerStarts: playerStartKey ? [playerStart, playerStartKey] : [playerStart]
            });
        }

        // The first player necessarily has control
        this.takePlayerControl(false, 0);

        // The players can take control of characters
        Keyboard.on('keydown', 'S', secondPlayerTakeControl.bind(this));
        GamepadManager.instance.addListener(GamepadManager.GamepadEvent.BUTTON_DOWN, this.onButtonDownForControl, this);

        this.showMenu();
        var blink = setInterval(function () {
            // this.pressStart.graphics.enabled = !this.pressStart.graphics.enabled;
            for (var i = 0, j = 0, playerIconList = null; i < this.playerIcons.length; i++) {
                playerIconList = this.playerIcons[i];
                if (playerIconList.playerStarts) {
                    for (j = 0; j < playerIconList.playerStarts.length; j++) {
                        playerIconList.playerStarts[j].graphics.enabled = !playerIconList.playerStarts[j].graphics.enabled;
                    }
                }
            }
        }.bind(this), 500);

        this._assets.sounds["MUSIC_Amb_Menu"].play();
        this._assets.sounds["MUSIC_Menu_Layer_01"].play();
        this._assets.sounds["MUSIC_Menu_Layer_02"].play();
        this._assets.sounds["MUSIC_Menu_Layer_03"].play();
        this._assets.sounds["MUSIC_Menu_Layer_04"].play();
        this._assets.sounds["MUSIC_Menu_Layer_01"].volume(0.7);
        this._assets.sounds["MUSIC_Menu_Layer_02"].volume(0.7);
        this._assets.sounds["MUSIC_Menu_Layer_03"].volume(0.7);
        this._assets.sounds["MUSIC_Menu_Layer_04"].volume(0.7);

        function secondPlayerTakeControl (e) {
            Keyboard.remove('keydown', 'S', secondPlayerTakeControl.bind(this));
            this.takePlayerControl(false, 1);
        }
    }

    /**
     * The player will take control of a character with his gamepad
     * @param  {Event} e The event triggered by the Gamepadmanager
     */
    MainActivity.prototype.onButtonDownForControl = function (e) {
        if (e.button == "A" && e.gamepad < this.players.length) {
            this.takePlayerControl(true, e.gamepad);
        }
    }

    MainActivity.prototype.showMenu = function () {
        this._assets.sounds["HUD_Switch"].play();
        this._screen.addChild(this.creditsLogo);

        // Blink press start
        this._screen.addChild(this.pressStart);

        Keyboard.on('keydown', 'ENTER', onStartButtonPressed.bind(this));
        Keyboard.on('keydown', 'ESCAPE', onBackButtonPressed.bind(this));
        GamepadManager.instance.addListener(GamepadManager.GamepadEvent.BUTTON_DOWN, onButtonDown, this);

        function onButtonDown (e) {
            if (e.button == "START") {
                onStartButtonPressed.call(this, e);
            }
            if (e.button == "BACK") {
                onBackButtonPressed.call(this, e);
            }
        }

        function onStartButtonPressed (e) {
            var playerPressed = false;

            if (e.type == "keydown") {
                playerPressed = true;
            } else {
                for (var i = 0; i < this.players.length; i++) {
                    if (this.players[i].gamepadID == e.gamepad) {
                        playerPressed = true;
                        break;
                    }
                }
            }

            if (!playerPressed) {
                return;
            }

            Keyboard.remove('keydown', 'ENTER', onStartButtonPressed.bind(this));
            Keyboard.remove('keydown', 'ESCAPE', onBackButtonPressed.bind(this));
            GamepadManager.instance.removeListener(GamepadManager.GamepadEvent.BUTTON_DOWN, onButtonDown);
            this._assets.sounds["HUD_Click"].play();
            this.startGame();
        }

        function onBackButtonPressed (e) {
            Keyboard.remove('keydown', 'ENTER', onStartButtonPressed.bind(this));
            Keyboard.remove('keydown', 'ESCAPE', onBackButtonPressed.bind(this));
            GamepadManager.instance.removeListener(GamepadManager.GamepadEvent.BUTTON_DOWN, onButtonDown);
            this.showCredits();
        }
    }

    MainActivity.prototype.showCredits = function () {
        this._assets.sounds["HUD_Switch"].play();
        this._screen.removeChild(this.pressStart);
        this._screen.removeChild(this.creditsLogo);
        this._screen.addChild(this.credits);
        this._screen.addChild(this.creditsLogoBack);
        GamepadManager.instance.addListener(GamepadManager.GamepadEvent.BUTTON_DOWN, onButtonDown, this);
        Keyboard.on('keydown', 'ESCAPE', onBackButtonPressed.bind(this));
        
        function onButtonDown (e) {
            if (e.button == "BACK") {
                onBackButtonPressed.call(this, e);
            }
        }
        
        function onBackButtonPressed (e) {
            GamepadManager.instance.removeListener(GamepadManager.GamepadEvent.BUTTON_DOWN, onButtonDown);
            Keyboard.remove('keydown', 'ESCAPE', onBackButtonPressed.bind(this));
            this.hideCredits();
            this.showMenu();
        }
    }

    MainActivity.prototype.hideCredits = function () {
        this._screen.removeChild(this.creditsLogoBack);
        this._screen.removeChild(this.credits);
    }

    MainActivity.prototype.takePlayerControl = function (isGamepad, id) {
        var i = 0,
            player = null;

        if (!isGamepad && id <= 1) {
            player = this.players[id];
            if (player.id == id && !player.keyboard) {
                player.keyboard = true;
            }
            this.playerIcons[id].keyboardIcon.graphics.spritesheet = AssetManager.instance.assets.images.keyboard;
            this._screen.removeChild(this.playerIcons[player.id].playerStarts[this.playerIcons[player.id].playerStarts.length - 1]);

            // If there was a gamepad control on this player, we switch it to the next one
            if (player.gamepadID != -1) {
                var gamepadID = player.gamepadID;
                player.gamepadID = -1;
                this._screen.addChild(this.playerIcons[player.id].playerStarts[0]);
                this.playerIcons[player.id].controllerIcon.graphics.spritesheet = AssetManager.instance.assets.images.controllerIconTransparent;
                this.takePlayerControl(true, gamepadID);
            }
        } else if (isGamepad) {
            // If there already is a player assigned to this gamepad, we ignore it
            for (i = 0; i < this.players.length; i++) {
                if (this.players[i].gamepadID == id) {
                    return;
                }
            }

            // First, put the keyboard-controllable players at the end of the array
            var players = this.players.concat();
            players.sort(function (a, b) {
                if (a.keyboard && b.keyboard) {
                    return 0;
                }
                if (a.keyboard && !b.keyboard) {
                    return 1;
                }
                return -1;
            })
            
            for (i = 0; i < players.length; i++) {
                player = players[i];
                // We take the first player that doesn't have a gamepad assigned to it
                if (player.gamepadID == -1) {
                    this.players[player.id].gamepadID = id;
                    this.playerIcons[player.id].controllerIcon.graphics.spritesheet = AssetManager.instance.assets.images.controllerIcon;
                    this._screen.removeChild(this.playerIcons[player.id].playerStarts[0]);
                    break;    
                }
            }
        }
    }

    MainActivity.prototype.onLogoClicked = function (e) {
        window.open("http://html5gamejam.org/#/home");
    }

    MainActivity.prototype.onLogoHovered = function (e) {
        this.application.getStage().canvas.style.cursor = "pointer";
    }

    MainActivity.prototype.onBgHovered = function (e) {
        this.application.getStage().canvas.style.cursor = "default";
    }

    MainActivity.prototype.startGame = function () {
        // remove all the listeners on the GamepadManager
        GamepadManager.instance.listenersFor = {};
        this.logo.removeListener(InputManager.InputEvent.TOUCH_CLICKED, this.onLogoClicked);

        this.loading_bar_outside = null;
        this.loading_bar_inside  = null;
        this.title               = null;
        this.pressStart          = null;
        this.logo                = null;
        this.creditsLogo         = null;
        this.creditsLogoBack     = null;
        this.credits             = null;


        this._assets.sounds["MUSIC_Amb_Menu"].stop();
        this._assets.sounds["MUSIC_Menu_Layer_01"].stop();
        this._assets.sounds["MUSIC_Menu_Layer_02"].stop();
        this._assets.sounds["MUSIC_Menu_Layer_03"].stop();
        this._assets.sounds["MUSIC_Menu_Layer_04"].stop();

        this._assets.sounds["MUSIC_Amb_Menu"]      = null;
        this._assets.sounds["MUSIC_Menu_Layer_01"] = null;
        this._assets.sounds["MUSIC_Menu_Layer_02"] = null;
        this._assets.sounds["MUSIC_Menu_Layer_03"] = null;
        this._assets.sounds["MUSIC_Menu_Layer_04"] = null;

        this.application.removeActivity(this);

        for (var i = 0; i < this.players.length; i++) {
            if (!this.players[i].keyboard && this.players[i].gamepadID == -1) {
                this.players.splice(i, 1);
                --i;
            }
        }
        
        this.application.addActivity(new GameActivity({
            level: 0
        })).launch({
            players: this.players,
            assets: this._assets
        });
    }

	return MainActivity;
});