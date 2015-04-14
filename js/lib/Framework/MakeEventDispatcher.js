define(function() {
    'use strict';

    var MakeEventDispatcher = function(object) {
        if (object.isEventDispatcher) {
            return;
        }
        object.listenersFor = {};   // A list of all the listeners on a given event
        object.isEventDispatcher = true;
        
        object.addListener = function(eventName, callback, target) {
            if (!this.listenersFor[eventName]) {
                this.listenersFor[eventName] = [];
            }

            // We add the callback to the list of listeners on this event
            this.listenersFor[eventName].push({
                callback: callback,
                target: target || this
            });
        };

        object.removeListener = function(eventName, callback) {
            if (this.listenersFor[eventName] != undefined) {    // If the event has at least one listener
                for (var i = 0; i < this.listenersFor[eventName].length; i++) { // We run through the callbacks for the given event
                    if (this.listenersFor[eventName][i].callback === callback) {
                        this.listenersFor[eventName].splice(i, 1);  // We remove the given callback if we find it
                    }
                };
            }
        };
        
        object.dispatch = function () {
            var args = Array.prototype.slice.call(arguments),   // We transforms the 'arguments' parameter to an array
                eventName = args.shift(),                       // We get the emitted event's name
                listeners = this.listenersFor[eventName];       // We get all the listeners on this event

            if (listeners != undefined) {
                for (var i = 0; i < listeners.length; i++) {
                    try {
                        listeners[i].callback.apply(listeners[i].target, args); // We call all the listeners one by one
                    } catch(e) {
                        console.warn('Error on event ' + eventName);
                        throw(e);
                    }
                }
            }
        };
    }

    return MakeEventDispatcher;
});