var onEachFrame = (function() {
    'use strict';

    ///////////////////////////////////////////////////////
    // Assuring compatibility with requestAnimationFrame //
    ///////////////////////////////////////////////////////
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }

    /**
     * A list containing all the callbacks running on each frame that were registered with a name
     * @type {Object}
     */
    var requestAnimationFrameCallbacks = {};
    var cancelledAnimationFrameCallbacks = {};

    /**
     * Triggers a callback on each rendering frame
     * @param  {Function} cb     The callback to call on each frame
     * @param  {String}   label  The loop label. If not null, the callback will be registered, in a list, and cancellable with onEachFrame.cancel()
     * @param  {Object}   target The object to bind to the call on each frame (the "this"-object in the callback)
     */
    var onEachFrame = function(cb, label, target) {
        var callback = cb;

        if (target != undefined) {
            callback = function() {
                cb.apply(target);
            }
        }

        var _cb = function() {
            // We check if the callback was unregistered before calling it, so that we don't call it if not necessary
            if (cancelledAnimationFrameCallbacks[label]) {
                delete cancelledAnimationFrameCallbacks[label];
            }
            
            callback();

            // If the callback was just cancelled, then we stop here, and don't call the next requestAnimationFrame
            if (cancelledAnimationFrameCallbacks[label]) {
                delete cancelledAnimationFrameCallbacks[label];
                return;
            }

            var anim = requestAnimationFrame(_cb);
            if (label) {
                requestAnimationFrameCallbacks[label] = anim;
            }
        };
        requestAnimationFrame(_cb);
    };

    /**
     * Cancels an onEachFrame() loop
     * @param  {String} loopLabel The label of the loop to cancel
     */
    onEachFrame.cancel = function(loopLabel) {
        if (loopLabel == undefined) {
            return;
        }
        if (typeof loopLabel == 'string') { // If the given index is a label, cancel the callback with the given label
            var label = loopLabel;
            loopLabel = requestAnimationFrameCallbacks[label];
            cancelledAnimationFrameCallbacks[label] = true;
            delete requestAnimationFrameCallbacks[label];
        }
        window.cancelAnimationFrame(loopLabel);
    }

    // Initializing a global time/delta-time
    window.Time = {
        time: null,
        deltaTime: null
    };

    /**
     * Launching a callback to always update the passed time and delta-time
     */
    onEachFrame(function() {
        Time.time = Time.time || Date.now();
        var t = Date.now();
        Time.deltaTime = (t - Time.time) / 1000;
        if (Time.deltaTime > 0.2) {
            Time.deltaTime = 0.2;
        }
        Time.time = t;
    });

    return onEachFrame;
})();