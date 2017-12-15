// JavaScript source code

/**
 * Connector.js
 * @author Andrew
 */

define([], function () {
    'use strict';
    try {
        return function Connector(options) {
            var self = this;

            var _offset = options.offset || 30;

            var _sourceControl = options.sourceControl || null;
            var _targetControl = options.targetControl || null;

            /*
            var _startX = _sourceControl.x() + _sourceControl.width();
            var _startY = _sourceControl.y() + _sourceControl.height() / 2;
                _endX = _targetControl.x();
                _endY = _targetControl.y() + _targetControl.height() / 2;
            */

            var _startX = options.startX;
            var _startY = options.startY;
            var _endX = options.endX;
            var _endY = options.endY;
            
            var _controlPointRadius = 4;
            var _lineWidth = 3;
            var _selectedLineWidth = 5;

            var _controlPointOneX = options.controlPointOneX || _startX + _offset;
            var _controlPointOneY = options.controlPointOneY || _startY;
            var _controlPointTwoX = options.controlPointTwoX || _endX - _offset;
            var _controlPointTwoY = options.controlPointTwoY || _endY;


            var _fontSize = options.fontSize || 11;
            var _fontFamily = options.fontFamily || 'Arial';
            var _fontColor = options.fontColor || '#FFF';
            var _fontWeight = options.fontWeight || 'normal';
            var _fontStyle = options.fontStyle || 'normal';

            // the edge for which this Connector is the shape
            var _edge = options.edge || {};

            // var _name = options.name || '';

            var _strokeStyle = '#AAAAAA';

            // because we do a hit test in the render method
            // canSelectAgain is used in coordination with a timer 
            // to restrict how quickly the connector can be selected/deselected
            var _canSelectAgain = true;

            self._isSelected = options.isSelected || false;

            self._onkeydown = options.onkeydown || function () { };
            self._onkeyup = options.onkeyup || function () { };
            self._onkeypress = options.onkeypress || function () { };


            self.render = function (ctx, mouseDownPos) {
                ctx.save();

                ctx.strokeStyle = _strokeStyle;

                if (self._isSelected) {
                    ctx.lineWidth = _selectedLineWidth;

                    ctx.beginPath();
                    ctx.arc(_startX, _startY, _controlPointRadius, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                    /*
                    if (mouseDownPos && ctx.isPointInStroke(mouseDownPos.x, mouseDownPos.y)) {
                        alert('start');
                    }
                    */

                    ctx.beginPath();
                    ctx.arc(_endX, _endY, _controlPointRadius, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();
                    /*
                    if (mouseDownPos && ctx.isPointInStroke(mouseDownPos.x, mouseDownPos.y)) {
                        alert('end');
                    }
                    */
                } else {
                    ctx.lineWidth = _lineWidth;
                }

                ctx.beginPath();

                ctx.moveTo(_startX, _startY);

                ctx.bezierCurveTo(_controlPointOneX,
                    _controlPointOneY,
                    _controlPointTwoX,
                    _controlPointTwoY,
                    _endX,
                    _endY);

                ctx.stroke();

                ctx.closePath();

                ctx.font = _fontStyle + ' ' + _fontWeight + ' ' + _fontSize + 'px ' + _fontFamily;

                ctx.fillStyle = _fontColor;
/*
                ctx.fillText(_sourceControl._vertex.outboundType,
                    _controlPointOneX,
                    _controlPointOneY);
*/
                ctx.fillText(_edge.argumentName,
                    (_controlPointTwoX + _controlPointOneX) / 2, 
                    (_controlPointTwoY + _controlPointOneY) / 2 - 20);

                ctx.fillText(_edge.filterProperties,
                    (_controlPointTwoX + _controlPointOneX) / 2, 
                    (_controlPointTwoY + _controlPointOneY) / 2 + 20);
/*
                ctx.fillText(_targetControl._vertex.inboundType,
                    _controlPointTwoX,
                    _controlPointTwoY);
*/
                if (mouseDownPos && ctx.isPointInStroke(mouseDownPos.x, mouseDownPos.y)) {

                    // restrict how quickly the connector can be selected/deselected
                    // without this, the selection will 'twitch'
                    if (_canSelectAgain) {
                        self._isSelected = !self._isSelected;

                        _canSelectAgain = false;

                        setTimeout(function () {
                            _canSelectAgain = true;
                        }, 300);
                    }
                }

                ctx.restore();
            };

            /**
             * Gets the selected state of the connector
             * @return {bool} Is the connector selected?
             */
            self.isSelected = function () {
                return self._isSelected;
            };

            /**
             * Get/set the start x-position.
             * @param  {Number} data The pixel position along the x-coordinate.
             * @return {Mixed}      Get: the connector or Set: the current x-value.
             */
            self.startX = function (data) {
                if (typeof data !== 'undefined') {
                    _startX = data;
                    return self;
                } else {
                    return _startX;
                }
            };

            /**
             * Get/set the start y-position.
             * @param  {Number} data The pixel position along the y-coordinate.
             * @return {Mixed}      Get: the connector or Set: the current y-value.
             */
            self.startY = function (data) {
                if (typeof data !== 'undefined') {
                    _startY = data;
                    return self;
                } else {
                    return _startY;
                }
            };

            /**
             * Get/set the end x-position.
             * @param  {Number} data The pixel position along the x-coordinate.
             * @return {Mixed}      Get: the connector or Set: the current x-value.
             */
            self.endX = function (data) {
                if (typeof data !== 'undefined') {
                    _endX = data;
                    return self;
                } else {
                    return _endX;
                }
            };

            /**
             * Get/set the end y-position.
             * @param  {Number} data The pixel position along the y-coordinate.
             * @return {Mixed}      Get: the connector or Set: the current y-value.
             */
            self.endY = function (data) {
                if (typeof data !== 'undefined') {
                    _endY = data;
                    return self;
                } else {
                    return _endY;
                }
            };

            /**
             * Get/set the first control point x-position.
             * @param  {Number} data The pixel position along the x-coordinate.
             * @return {Mixed}      Get: the connector or Set: the current x-value.
             */
            self.controlPointOneX = function (data) {
                if (typeof data !== 'undefined') {
                    _controlPointOneX = data;
                    return self;
                } else {
                    return _controlPointOneX;
                }
            };

            /**
             * Get/set the first control point y-position.
             * @param  {Number} data The pixel position along the y-coordinate.
             * @return {Mixed}      Get: the connector or Set: the current y-value.
             */
            self.controlPointOneY = function (data) {
                if (typeof data !== 'undefined') {
                    _controlPointOneY = data;
                    return self;
                } else {
                    return _controlPointOneY;
                }
            };

            /**
             * Get/set the first control point x-position.
             * @param  {Number} data The pixel position along the x-coordinate.
             * @return {Mixed}      Get: the connector or Set: the current x-value.
             */
            self.controlPointTwoX = function (data) {
                if (typeof data !== 'undefined') {
                    _controlPointTwoX = data;
                    return self;
                } else {
                    return _controlPointTwoX;
                }
            };

            /**
             * Get/set the first control point y-position.
             * @param  {Number} data The pixel position along the y-coordinate.
             * @return {Mixed}      Get: the connector or Set: the current y-value.
             */
            self.controlPointTwoY = function (data) {
                if (typeof data !== 'undefined') {
                    _controlPointTwoY = data;
                    return self;
                } else {
                    return _controlPointTwoY;
                }
            };

            /**
             * Get/set the font size.
             * @param  {Number} data Font size.
             * @return {Mixed}      Get: the connector or Set: the current font size.
             */
            self.fontSize = function (data) {
                if (typeof data !== 'undefined') {
                    _fontSize = data;
                    return self;
                } else {
                    return _fontSize;
                }
            };

            /**
             * Get/set the font family.
             * @param  {String} data Font family.
             * @return {Mixed}      Get: the connector or Set: the current font family.
             */
            self.fontFamily = function (data) {
                if (typeof data !== 'undefined') {
                    _fontFamily = data;
                    return self;
                } else {
                    return _fontFamily;
                }
            };

            /**
             * Get/set the font color.
             * @param  {String} data Font color.
             * @return {Mixed}      Get: the connector or Set: the current font color.
             */
            self.fontColor = function (data) {
                if (typeof data !== 'undefined') {
                    _fontColor = data;
                    return self;
                } else {
                    return _fontColor;
                }
            };

            /**
             * Get/set the font weight.
             * @param  {String} data Font weight.
             * @return {Mixed}      Get: the connector or Set: the current font weight.
             */
            self.fontWeight = function (data) {
                if (typeof data !== 'undefined') {
                    _fontWeight = data;
                    return self;
                } else {
                    return _fontWeight;
                }
            };


            /**
             * Get/set the font style.
             * @param  {String} data Font style.
             * @return {Mixed}      Get: the connector or Set: the current font style.
             */
            self.fontStyle = function (data) {
                if (typeof data !== 'undefined') {
                    _fontStyle = data;
                    return self;
                } else {
                    return _fontStyle;
                }
            };

            /**
             * Fired with the click event on the control, and puts focus on/off
             * based on where the user clicks.
             * @param  {Event}       e    The click event.
             * @param  {Render} self
             * @return {Render}
             */

            self.click = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y;

                if (self._canvas && self.mouseOverControl(x, y) || !self._canvas) {
                    if (self._mouseDown) {
                        self._mouseDown = false;
                        self.click(e, self);
                        return self.focus();
                    }
                } else {
                    return self.blur();
                }
            };

            /**
             * Fired with the mousemove event
             * @param  {Event}       e    The mousemove event.
             * @param  {Render} self
             * @return {Render}
             */
            self.mousemove = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y;

            };

            /**
             * Fired with the mousedown event
             * @param  {Event} e    The mousedown event.
             * @param  {Render} self
             */
            self.mousedown = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y,
                    isOver = self.mouseOverControl(x, y);

                // setup the 'click' event
                self._mouseDown = isOver;
            };

            /**
             * Fired with the mouseup event
             * @param  {Event} e    The mouseup event.
             * @param  {Render} self
             */
            self.mouseup = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y;

                self.click(e, self);
            };

            self.toJSON = function () {

                var obj = {
                    sourceControl: _sourceControl._vertex.id,
                    targetControl: _targetControl._vertex.id,
                    isSelected: self._isSelected,
                    startX: _startX,
                    startY: _startY,
                    endX: _endX,
                    endY: _endY
                };

                return obj;
            };
        };
    }
    catch (e) {
        alert('Connector ctor' + e.message);
    }
});
