/*
 * Icon.js
 * @author Andrew
 */

define(function () {
    'use strict';
    try {
        var self = function Icon() {
        };

        self.drawO = function (ctx, x, y) {
            ctx.save();
            
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, 2 * Math.PI);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#FFFFFF";
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        };

        self.drawX = function (ctx, x, y) {
            ctx.save();
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(25, 0);
            ctx.lineTo(25, 25);
            ctx.lineTo(0, 25);
            ctx.closePath();
            ctx.clip();
            ctx.translate(0, 0);
            ctx.translate(0, 0);
            ctx.scale(0.25, 0.25);
            ctx.translate(0, 0);
            ctx.strokeStyle = 'rgba(0,0,0,0)';
            ctx.lineCap = 'butt';
            ctx.lineJoin = 'miter';
            ctx.miterLimit = 4;
            ctx.save();
            ctx.fillStyle = app.iconFillStyle;
            ctx.beginPath();
            ctx.moveTo(76.83, 32.561);
            ctx.lineTo(59.392, 50);
            ctx.lineTo(76.83, 67.439);
            ctx.bezierCurveTo(79.42399999999999, 70.03299999999999, 79.42399999999999, 74.237, 76.83, 76.83099999999999);
            ctx.bezierCurveTo(75.53399999999999, 78.127, 73.835, 78.77599999999998, 72.136, 78.77599999999998);
            ctx.bezierCurveTo(70.43599999999999, 78.77599999999998, 68.737, 78.12799999999999, 67.441, 76.83099999999999);
            ctx.lineTo(50, 59.391);
            ctx.lineTo(32.56, 76.831);
            ctx.bezierCurveTo(31.264000000000003, 78.12700000000001, 29.565, 78.776, 27.865000000000002, 78.776);
            ctx.bezierCurveTo(26.166, 78.776, 24.468000000000004, 78.128, 23.171000000000003, 76.831);
            ctx.bezierCurveTo(20.577, 74.238, 20.577, 70.034, 23.171000000000003, 67.43900000000001);
            ctx.lineTo(40.608, 50);
            ctx.lineTo(23.17, 32.561);
            ctx.bezierCurveTo(20.576, 29.967, 20.576, 25.762999999999998, 23.17, 23.169);
            ctx.bezierCurveTo(25.763, 20.577, 29.965000000000003, 20.577, 32.559, 23.169);
            ctx.lineTo(50, 40.609);
            ctx.lineTo(67.44, 23.169);
            ctx.bezierCurveTo(70.03399999999999, 20.577, 74.236, 20.577, 76.829, 23.169);
            ctx.bezierCurveTo(79.424, 25.763, 79.424, 29.967, 76.83, 32.561);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            ctx.restore();
        };

        self.drawAdd = function (ctx, x, y) {
            ctx.save();
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(25, 0);
            ctx.lineTo(25, 25);
            ctx.lineTo(0, 25);
            ctx.closePath();
            ctx.clip();
            ctx.translate(0, 0);
            ctx.translate(0, 0);
            ctx.scale(0.25, 0.25);
            ctx.translate(0, 0);
            ctx.strokeStyle = 'rgba(0,0,0,0)';
            ctx.lineCap = 'butt';
            ctx.lineJoin = 'miter';
            ctx.miterLimit = 4;
            ctx.save();
            ctx.fillStyle = app.iconFillStyle;
            ctx.beginPath();
            ctx.moveTo(50, 11.126);
            ctx.bezierCurveTo(29.129, 11.126, 12.209000000000003, 28.046, 12.209000000000003, 48.916999999999994);
            ctx.bezierCurveTo(12.209000000000003, 69.78799999999998, 29.129, 86.708, 50, 86.708);
            ctx.bezierCurveTo(70.871, 86.708, 87.791, 69.788, 87.791, 48.917);
            ctx.bezierCurveTo(87.791, 28.046000000000006, 70.871, 11.126, 50, 11.126);
            ctx.closePath();
            ctx.moveTo(71.566, 54.988);
            ctx.lineTo(55.487, 54.988);
            ctx.lineTo(55.487, 71.065);
            ctx.bezierCurveTo(55.487, 73.82, 53.255, 76.053, 50.5, 76.053);
            ctx.bezierCurveTo(47.746, 76.053, 45.512, 73.82, 45.512, 71.065);
            ctx.lineTo(45.512, 54.988);
            ctx.lineTo(29.435, 54.988);
            ctx.bezierCurveTo(26.68, 54.988, 24.447, 52.755, 24.447, 50);
            ctx.bezierCurveTo(24.447, 47.245, 26.68, 45.012, 29.435, 45.012);
            ctx.lineTo(45.513, 45.012);
            ctx.lineTo(45.513, 28.935);
            ctx.bezierCurveTo(45.513, 26.18, 47.745999999999995, 23.948, 50.501, 23.948);
            ctx.bezierCurveTo(53.256, 23.948, 55.488, 26.18, 55.488, 28.935000000000002);
            ctx.lineTo(55.488, 45.013000000000005);
            ctx.lineTo(71.56700000000001, 45.013000000000005);
            ctx.bezierCurveTo(74.32100000000001, 45.013000000000005, 76.555, 47.246, 76.555, 50.001000000000005);
            ctx.bezierCurveTo(76.555, 52.75600000000001, 74.32, 54.988, 71.566, 54.988);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            ctx.restore();
        };

        self.drawLink = function (ctx, x, y) {
            ctx.save();
            ctx.translate(x, y);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(25, 0);
            ctx.lineTo(25, 25);
            ctx.lineTo(0, 25);
            ctx.closePath();
            ctx.clip();
            ctx.translate(0, 0);
            ctx.translate(0, 0);
            ctx.scale(0.25, 0.25);
            ctx.translate(0, 0);
            ctx.strokeStyle = 'rgba(0,0,0,0)';
            ctx.lineCap = 'butt';
            ctx.lineJoin = 'miter';
            ctx.miterLimit = 4;
            ctx.save();
            ctx.fillStyle = app.iconFillStyle;
            ctx.beginPath();
            ctx.moveTo(53.426, 83.59);
            ctx.lineTo(53.426, 84.59);
            ctx.bezierCurveTo(53.426, 86.247, 52.083, 87.59, 50.426, 87.59);
            ctx.lineTo(40.426, 87.59);
            ctx.bezierCurveTo(24.849000000000004, 87.59, 12.176000000000002, 74.917, 12.176000000000002, 59.34);
            ctx.bezierCurveTo(12.176000000000002, 43.763000000000005, 24.849000000000004, 31.090000000000003, 40.426, 31.090000000000003);
            ctx.lineTo(58.875, 31.090000000000003);
            ctx.lineTo(46.168, 18.384);
            ctx.bezierCurveTo(44.804, 17.02, 44.804, 14.799, 46.168, 13.435);
            ctx.bezierCurveTo(47.489, 12.113, 49.796, 12.113, 51.117, 13.435);
            ctx.lineTo(69.798, 32.116);
            ctx.bezierCurveTo(70.459, 32.777, 70.82300000000001, 33.656, 70.82300000000001, 34.591);
            ctx.bezierCurveTo(70.82300000000001, 35.526, 70.459, 36.405, 69.798, 37.066);
            ctx.lineTo(51.118, 55.746);
            ctx.bezierCurveTo(49.797000000000004, 57.068000000000005, 47.492000000000004, 57.07, 46.168, 55.746);
            ctx.bezierCurveTo(44.804, 54.382000000000005, 44.804, 52.161, 46.168, 50.797000000000004);
            ctx.lineTo(58.875, 38.09);
            ctx.lineTo(40.426, 38.09);
            ctx.bezierCurveTo(28.709000000000003, 38.09, 19.176000000000002, 47.623000000000005, 19.176000000000002, 59.34);
            ctx.bezierCurveTo(19.176000000000002, 71.057, 28.709000000000003, 80.59, 40.426, 80.59);
            ctx.lineTo(50.426, 80.59);
            ctx.bezierCurveTo(52.083, 80.59, 53.426, 81.934, 53.426, 83.59);
            ctx.closePath();
            ctx.moveTo(86.799, 32.116);
            ctx.lineTo(68.118, 13.435);
            ctx.bezierCurveTo(66.797, 12.113, 64.49, 12.113, 63.169, 13.435);
            ctx.bezierCurveTo(61.803999999999995, 14.799000000000001, 61.803999999999995, 17.02, 63.169, 18.384);
            ctx.lineTo(75.875, 31.09);
            ctx.lineTo(79.275, 34.459);
            ctx.lineTo(75.875, 38.09);
            ctx.lineTo(63.169, 50.796);
            ctx.bezierCurveTo(61.803999999999995, 52.16, 61.803999999999995, 54.381, 63.169, 55.745);
            ctx.bezierCurveTo(64.493, 57.068999999999996, 66.798, 57.067, 68.119, 55.745);
            ctx.lineTo(86.8, 37.06399999999999);
            ctx.bezierCurveTo(87.461, 36.40299999999999, 87.825, 35.523999999999994, 87.825, 34.58899999999999);
            ctx.bezierCurveTo(87.825, 33.65399999999999, 87.46, 32.776, 86.799, 32.116);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            ctx.restore();
        };

        return self;
    } catch (e) {
        alert("Icon c'tor " + e.name + " " + e.message);
    }
});