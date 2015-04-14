define(function() {
    'use strict';

    var Utils = {};

    Utils.objectLength = function (obj) {
        var i = 0;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                ++i;
            }
        }
        return i;
    };

    Utils.getRandomElement = function (obj) {
        var randomIndex = (Math.random() * Utils.objectLength(obj)) | 0;
        var i = 0;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop) && i == randomIndex) {
                return obj[prop];
            }
            ++i;
        }
    };

    Utils.wrapText = function(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
    }

    // Date.now() shim for older browsers
    if (!Date.now) {
        Date.now = function now() {
            return new Date().getTime();
        };
    }

    // shims to ensure we have newer Array utility methods
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
    if (!Array.isArray) {
        Array.isArray = function(arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }

    return Utils;

});