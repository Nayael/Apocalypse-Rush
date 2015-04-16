define(['lib/Framework/MakeEventDispatcher', 'lib/Framework/InputManager'], function(MakeEventDispatcher, InputManager) {
    'use strict';

    /**
     * @constructor
     * @param {Number} stageWidth The stage's width
     * @param {Number} stageHeight The stage's height
     * @param {Number} backgroundColor Optionnal stage background color
     */
    function Stage(stageWidth, stageHeight, backgroundColor) {
        // enforces new
        if (!(this instanceof Stage)) {
            return new Stage(stageWidth, stageHeight, backgroundColor);
        }

        this.stageWidth      = stageWidth;
        this.stageHeight     = stageHeight;

        // Adding the canvas to the stage
        this.canvas          = document.createElement('canvas');
        this.context         = this.canvas.getContext('2d');
        this.canvas.id       = 'main';
        this.canvas.width    = stageWidth;
        this.canvas.height   = stageHeight;
        this.backgroundColor = backgroundColor || null;

        if (this.backgroundColor) {
            this.context.fillStyle = this.backgroundColor;
            this.context.fillRect(0, 0, stageWidth, stageHeight);
        }
        
        // Logical Ratio
        this.stageRatio = stageWidth / stageHeight;
        var navigatorRatio = window.innerWidth / window.innerHeight;
        var width, height;

        if (navigatorRatio > this.stageRatio) {
            width = window.innerHeight * this.stageRatio;
            height = window.innerHeight;
        } else {
            width = window.innerWidth;
            height = window.innerWidth / this.stageRatio;
        }
        this.canvas.scaleFactor = width / stageWidth;

        width = (width | 0);
        height = (height | 0);

        this.canvas.scaleFactor = width / stageWidth;

        // Add the canvas to the document
        document.body.appendChild(this.canvas);
        this.canvas.width  *= this.canvas.scaleFactor;
        this.canvas.height *= this.canvas.scaleFactor;

        // Screen Handling
        this.screen = null;

        // Listen to input
        MakeEventDispatcher(this.canvas);
        this.touchable = true;

        // Canvas Buffer
        this.canvasBuffer = document.createElement('canvas');
        this.canvasBuffer.scaleFactor = width / stageWidth;
        this.canvasBuffer.width    = stageWidth;
        this.canvasBuffer.height   = stageHeight;

        this.canvasBuffer.width    *= this.canvas.scaleFactor;
        this.canvasBuffer.height   *= this.canvas.scaleFactor;


        ////////////
        // PRIVATE ATTRIBUTES
        //
        var _screens = [];


        ////////////
        // PUBLIC METHODS
        //
        this.pushScreen = function(s) {
            _screens.push(s);
            this.updateBuffer();
        };

        this.unshiftScreen = function(s) {
            _screens.unshift(s);
            this.updateBuffer();
        };

        this.removeScreen = function(s) {
            var index = _screens.indexOf(s);
            if (index != -1) {
                _screens.splice(index, 1);
                this.updateBuffer();
            }
        };

        this.setScreenIndex = function (s, index) {
            var prevID = _screens.indexOf(s);
            if (prevID == -1) {
                return;
            }

            _screens.splice(prevID, 1);
            _screens.splice(index, 0, s);
        };

        this.updateBuffer = function() {
            // Clearing the canvas
            var context = this.canvasBuffer.getContext('2d');

            // Updating all the children
            for (var i = 0, j = 0, sc = null, child = null, bufferChildren = null, nbScreens = _screens.length; i < nbScreens; ++i) {
                sc = _screens[i];
                bufferChildren = sc.getBufferChildren();
                for (j = 0, child = null; j < bufferChildren.length; ++j) {
                    child = bufferChildren[j];
                    if (child && child.graphics) {
                        child.graphics.draw(context);
                    }
                }
            }
        };

        this.render = function() {
            // Clearing the canvas
            this.context.fillStyle = this.backgroundColor || 'rgb(255, 255, 255)';
            this.context.fillRect(0, 0, this.stageWidth * this.canvas.scaleFactor, this.stageHeight * this.canvas.scaleFactor);

            // Updating all the children
            for (var i = 0, j = 0, sc = null, child = null, children = null, bufferChildren = null, nbScreens = _screens.length; i < nbScreens; ++i) {
                sc = _screens[i];

                if (!sc.getActivity().isEnabled()) {
                    continue;
                }

                children = sc.getChildren();
                bufferChildren = sc.getBufferChildren();
                for (j = 0; j < children.length; ++j) {
                    child = children[j];
                    if (child.render) {
                        child.render(this.context);
                    } else if (child && child.graphics) {
                        if ( bufferChildren.indexOf(child) != -1) {
                            this.context.drawImage(this.canvasBuffer, child.graphics.stageX, child.graphics.stageY, child.graphics.spriteWidth, child.graphics.spriteHeight, child.graphics.stageX * this.canvas.scaleFactor, child.graphics.stageY * this.canvas.scaleFactor, child.graphics.spriteWidth * this.canvas.scaleFactor, child.graphics.spriteHeight * this.canvas.scaleFactor);
                        } else {
                            child.graphics.draw(this.context);
                        }
                    }
                }
            }
        };

        /**
         * Called when the canvas is touched
         * @param  {InputEvent} e The touch InputEvent
         */
        this.onTouchEvent = function(e) {
            if (!this.touchable) {
                return;
            }
            var touchedChild = null;
            // Parse all the children (ordered by index), and get the one that was touched that is the most on top of the list
            for (var i = 0, j = 0, sc = null, child = null, children = null, bufferChildren = null, nbScreens = _screens.length; i < nbScreens; ++i) {
                sc = _screens[i];
                if (!sc.getActivity().isEnabled()) {
                    continue;
                }

                children = sc.getChildren();
                for (j = 0; j < children.length; j++) {
                    child = children[j];
                    if (!child || !child.graphics || !child.graphics.touchable || child.graphics.stageX > e.stageX || child.graphics.stageY > e.stageY || child.graphics.stageX + child.graphics.spriteWidth < e.stageX || child.graphics.stageY + child.graphics.spriteHeight < e.stageY) {
                        continue;
                    }
                    touchedChild = child;
                }
            }

            if (!touchedChild) {
                return;
            }

            MakeEventDispatcher(touchedChild);
            if (touchedChild.stageX) {
                e.stageX -= touchedChild.stageX;
            }
            if (touchedChild.stageY) {
                e.stageY -= touchedChild.stageY;
            }
            e.target = touchedChild;
            touchedChild.dispatch(e.type, e);
        };


        this.canvas.addListener(InputManager.InputEvent.TOUCH_CLICKED, this.onTouchEvent, this);
        this.canvas.addListener(InputManager.InputEvent.TOUCH_MOVE, this.onTouchEvent, this);
        this.canvas.addListener(InputManager.InputEvent.TOUCH_START, this.onTouchEvent, this);
        this.canvas.addListener(InputManager.InputEvent.TOUCH_END, this.onTouchEvent, this);
        InputManager.instance.init();
    }

    return Stage;

});