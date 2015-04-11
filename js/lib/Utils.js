var Utils = (function() {
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

    return Utils;

})();