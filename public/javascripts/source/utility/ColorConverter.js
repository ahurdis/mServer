

// @author Andrew

define([],
    function () {
        'use strict';

        var ColorConverter = function ColorConverter() {

        };

        ColorConverter.hexToRgb = function (hex) {
            var bigint = parseInt(hex, 16);
            var r = (bigint >> 16) & 255;
            var g = (bigint >> 8) & 255;
            var b = bigint & 255;

            return r + "," + g + "," + b;
        };

        ColorConverter.componentToHex = function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };

        ColorConverter.rgbToHex = function (r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        };

        return ColorConverter;
    });
