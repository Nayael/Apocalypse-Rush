define(function() {
    'use strict';

    function Screen(activity, entities) {
        // enforces new
        if (!(this instanceof Screen)) {
            return new Screen(activity, entities);
        }
        var _activity = activity;
        var _children = [];
        var _bufferChildren = [];

        if (entities) {
            for (var i = 0, entity; i < entities.length; i++) {
                _children.push(entities[i]);
            }
        }

        ////////////////////
        // PUBLIC METHODS //
        ////////////////////
        /**
         * @abstract
         * Initializes the screen children
         */
        this.initialize = function(children) {
            for (var i = 0, child; i < children.length; i++) {
                this.addChild(children[i]);
            }
        };

        /**
         * Adds a new child to the display list
         * @param  {Object} child The child to add
         */
        this.addChild = function(child, addToBuffer, index) {
            if (_children.indexOf(child) != -1) {
                return;
            }

            if (index === undefined || index > _children.length) {
                index = _children.length;
            }
            _children.splice(index, 0, child);
            if (addToBuffer) {
                _bufferChildren.push(child);
            }
        };

        /**
         * Removes a child from the display list
         * @param  {Object} child The child to remove
         */
        this.removeChild = function(child) {
            var index = _children.indexOf(child);
            if (index == -1) {
                return;
            }
            _children.splice(index, 1);
            var bufferIndex;
            if ( (bufferIndex = _bufferChildren.indexOf(_bufferChildren)) != -1) {
                _bufferChildren.splice(bufferIndex, 1);
            }
        };

        this.getChildren = function() {
            return _children;
        };

        this.getBufferChildren = function() {
            return _bufferChildren;
        };

        this.getActivity = function () {
            return _activity;
        };
    }

    return Screen;

});