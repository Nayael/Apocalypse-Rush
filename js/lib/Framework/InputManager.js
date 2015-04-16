define(['lib/Framework/MakeEventDispatcher'], function (MakeEventDispatcher) {
    'use strict';

    ////////////
    // CLASSES
    //
    var InputEvent = (function() {
        'use strict';
    
        function InputEvent(type) {
            // enforces new
            if (!(this instanceof InputEvent)) {
                return new InputEvent(type);
            }
            this.target = null;
            this.currentTarget = null;
            this.type = type || '';

            this.screenX = 0;
            this.screenY = 0;
            this.clientX = 0;
            this.clientY = 0;
            this.stageX = 0;
            this.stageY = 0;
            this.localX = 0;
            this.localY = 0;

            this.ctrlKey  = false;
            this.shiftKey = false;
            this.altKey   = false;
            this.metaKey  = false;
        }

        ////////////
        // STATIC ATTRIBUTES
        //
        InputEvent.TOUCH_START   = "InputEvent.TOUCH_START";
        InputEvent.TOUCH_MOVE    = "InputEvent.TOUCH_MOVE";
        InputEvent.TOUCH_END     = "InputEvent.TOUCH_END";
        InputEvent.TOUCH_CLICKED = "InputEvent.TOUCH_CLICKED";
    
        return InputEvent;
    })();


    /**
     * @constructor
     * InputManager for single-touch app
     */
    function InputManager() {
        // Singleton
        if (InputManager.instance) {
            throw new Error('InputManager is a singleton. Use InputManager.instance.');
        }
        // enforces new
        if (!(this instanceof InputManager)) {
            return new InputManager();
        }
        MakeEventDispatcher(this);
        this.currentTouch = null;
        this.canvasElements = [];

        this.addListener(InputEvent.TOUCH_START, _onInputStart, this);
        this.addListener(InputEvent.TOUCH_MOVE, _onInputMove, this);
        this.addListener(InputEvent.TOUCH_END, _onInputEnd, this);

        ////////////////////////
        // PRIVATE ATTRIBUTES //
        ////////////////////////
        var _touchedCanvas = null;
        var _clickTimeout = 0;
        var _gamepads = [];

        
        ////////////////////////////////////////////////////////
        // PUBLIC METHODS (with access to private attributes) //
        ////////////////////////////////////////////////////////
        
        /**
         * Starts listening to click/touch on all the canvas elements
         */
        this.init = function() {
            var canvasElements = document.getElementsByTagName('canvas');
            for (var i = 0, canvas; i < canvasElements.length; i++) {
                canvas = canvasElements[i];
                // Make the canvas an event dispatcher
                MakeEventDispatcher(canvas);
                this.canvasElements.push(canvas);
                canvas.removeEventListener('mousedown', _onMouseDown);
                canvas.removeEventListener('mouseup', _onMouseUp);
                canvas.removeEventListener('mousemove', _onMouseMove);

                canvas.removeEventListener('touchstart', _onTouchStart);
                canvas.removeEventListener('touchmove', _onTouchMove);
                canvas.removeEventListener('touchend', _onTouchEnd);
                
                canvas.addEventListener('mousedown', _onMouseDown, false);
                canvas.addEventListener('mouseup', _onMouseUp, false);
                canvas.addEventListener('mousemove', _onMouseMove, false);

                canvas.addEventListener('touchstart', _onTouchStart, false);
                canvas.addEventListener('touchmove', _onTouchMove, false);
                canvas.addEventListener('touchend', _onTouchEnd, false);
            }
        }


        /////////////////////
        // PRIVATE METHODS //
        /////////////////////
        function _createInputEvent(type, e) {
            var inputEvent = new InputEvent(type);
            inputEvent.type  = type;

            inputEvent.target        = e.target;
            inputEvent.currentTarget = e.currentTarget;
            inputEvent.view          = e.view;
            var eventData = (navigator.isCocoonJS && e.changedTouches) ? e.changedTouches[0] : e;
            var canvas = eventData.target;
            inputEvent.screenX  = eventData.screenX;
            inputEvent.screenY  = eventData.screenY;
            inputEvent.clientX  = eventData.clientX;
            inputEvent.clientY  = eventData.clientY;
            inputEvent.stageX   = (inputEvent.clientX - (canvas.offsetLeft ? canvas.offsetLeft : 0)) / canvas.scaleFactor;
            inputEvent.stageY   = (inputEvent.clientY - (canvas.offsetTop ? canvas.offsetTop : 0)) / canvas.scaleFactor;
            inputEvent.canvasX  = inputEvent.stageX * canvas.scaleFactor;
            inputEvent.canvasY  = inputEvent.stageY * canvas.scaleFactor;
            inputEvent.ctrlKey  = eventData.ctrlKey;
            inputEvent.shiftKey = eventData.shiftKey;
            inputEvent.altKey   = eventData.altKey;
            inputEvent.metaKey  = eventData.metaKey;

            return inputEvent;
        }

        function _onMouseDown(e) {
            // If the clicked element is not a registered canvas, stop
            if (InputManager.instance.canvasElements.indexOf(e.target) == -1) {
                return
            }
            var inputEvent = _createInputEvent(InputEvent.TOUCH_START, e);
            InputManager.instance.dispatch(InputEvent.TOUCH_START, inputEvent);
            e.target.dispatch(InputEvent.TOUCH_START, inputEvent);
        }

        function _onMouseMove(e) {
            // If the clicked element is not a registered canvas, stop
            if (InputManager.instance.canvasElements.indexOf(e.target) == -1) {
                return
            }
            var inputEvent = _createInputEvent(InputEvent.TOUCH_MOVE, e);
            InputManager.instance.dispatch(InputEvent.TOUCH_MOVE, inputEvent);
            e.target.dispatch(InputEvent.TOUCH_MOVE, inputEvent);
        }

        function _onMouseUp(e) {
            // If the clicked element is not a registered canvas, stop
            if (InputManager.instance.canvasElements.indexOf(e.target) == -1) {
                return
            }
            var inputEvent = _createInputEvent(InputEvent.TOUCH_END, e);
            InputManager.instance.dispatch(InputEvent.TOUCH_END, inputEvent);
            e.target.dispatch(InputEvent.TOUCH_END, inputEvent);
        }

        function _onTouchStart(e) {
            e.preventDefault();
            // If the clicked element is not a registered canvas, stop
            if (InputManager.instance.canvasElements.indexOf(e.target) == -1) {
                return
            }
            if (InputManager.instance.currentTouch) {
                return;
            }
            InputManager.instance.currentTouch = e.touches[0];

            var inputEvent = _createInputEvent(InputEvent.TOUCH_START, e);
            InputManager.instance.dispatch(InputEvent.TOUCH_START, inputEvent);
            e.target.dispatch(InputEvent.TOUCH_START, inputEvent);
        }

        function _onTouchMove(e) {
            e.preventDefault();
            // If the clicked element is not a registered canvas, stop
            if (InputManager.instance.canvasElements.indexOf(e.target) == -1) {
                return
            }
            if (e.changedTouches.indexOf(InputManager.instance.currentTouch) == -1) {
                return;
            }
            var inputEvent = _createInputEvent(InputEvent.TOUCH_MOVE, e);
            InputManager.instance.dispatch(InputEvent.TOUCH_MOVE, inputEvent);
            e.target.dispatch(InputEvent.TOUCH_MOVE, inputEvent);
        }

        function _onTouchEnd(e) {
            // If the clicked element is not a registered canvas, stop
            if (InputManager.instance.canvasElements.indexOf(e.target) == -1) {
                return
            }
            var inputEvent = _createInputEvent(InputEvent.TOUCH_END, e);
            if (!InputManager.instance.currentTouch || e.changedTouches.indexOf(InputManager.instance.currentTouch) == -1) {
                return;
            }
            InputManager.instance.dispatch(InputEvent.TOUCH_END, inputEvent);
            e.target.dispatch(InputEvent.TOUCH_END, inputEvent);
            InputManager.instance.currentTouch = null;
        }

        function _onInputStart(e) {
            if (_touchedCanvas) {
                return;
            }
            _touchedCanvas = e.target;
            _clickTimeout = setTimeout(_cancelCurrentTouch, 200);
        }

        function _onInputMove(e) {
            
        }

        function _onInputEnd(e) {
            if (!_touchedCanvas) {
                return;
            }
            _cancelCurrentTouch();

            var inputEvent = _createInputEvent(InputEvent.TOUCH_CLICKED, e);
            InputManager.instance.dispatch(InputEvent.TOUCH_CLICKED, inputEvent);
            e.target.dispatch(InputEvent.TOUCH_CLICKED, inputEvent);
        }

        function _cancelCurrentTouch() {
            _touchedCanvas = null;
            clearTimeout(_clickTimeout);
        }
    }

    ////////////
    // STATIC PUBLIC ATTRIBUTES
    //
    InputManager.InputEvent = InputEvent;

    // Singleton
    InputManager.instance = new InputManager();
    return InputManager;

});