/**
 * CheckBox.js
 * @author Andrew
 */

define(['javascripts/source/control/ControlBase'], function (ControlBase) {
    'use strict';
    try {
        return function CheckBox(options) {
            var self = this;

            // call parent constructor
            ControlBase.call(self, options);

            options = options ? options : {};

            // CheckBox specific options
            self._boxSize = options.boxSize || 18;
            self._boxPadding = options.boxPadding || 15;
            self._textPadding = options.textPadding || options._fontSize;
            self._checkInset = options.checkInset || 3;
            self._checkWidth = options.checkWidth || 3;

            // setup the defaults
            self._label = options.label || 'CheckBox Label';
            self._width = options.width || (self._textWidth() + self._boxPadding + self._boxSize + self._textPadding);
            self._height = options.height || self._fontSize > self._boxSize ? self._fontSize : self._boxSize;

            self._onfocus = options.onfocus || function () { };
            self._onblur = options.onblur || function () { };
            self._selected = options.selected || false;

            /**
             * Get/set the width of the text box.
             * @param  {Number} data Width in pixels.
             * @return {Mixed}      CheckBox or current width.
             */
            self.width = function (data) {
                if (typeof data !== 'undefined') {
                    self._width = data;

                    //                    return self.render();
                } else {
                    return self._width;
                }
            };

            /**
             * Get/set the height of the text box.
             * @param  {Number} data Height in pixels.
             * @return {Mixed}      CheckBox or current height.
             */
            self.height = function (data) {
                if (typeof data !== 'undefined') {
                    self._height = data;

                    //                    return self.render();
                } else {
                    return self._height;
                }
            };


            /**
             * Get/set the current CheckBox value.
             * @param  {String} data Text value.
             * @return {Mixed}      CheckBox or checkbox boolean value.
             */
            self.selected = function (data) {
                if (typeof data !== 'undefined') {
                    self._selected = data;

                    //                    self.render();

                    return self;
                } else {
                    return self._selected;
                }
            };

            /**
             * Fired with the keydown event to draw the typed characters.
             * @param  {Event}       e    The keydown event.
             * @param  {FormControl} parent
             * @return {CheckBox}
             */
            self.keydown = function (e, parent) {
                var keyCode = e.which,
                    isShift = e.shiftKey,
                    key = null;

                // make sure the correct text field is being updated
                if (!self._hasFocus) {
                    return;
                }

                // fire custom user event
                self._onkeydown(e, self);

                if (keyCode === 13) { // enter key
                    e.preventDefault();
                    self._selected = !self._selected;
                } else if (keyCode === 9) { // tab key
                    e.preventDefault();

                    isShift ? self._form.rewindFocus(self) : self._form.advanceFocus(self);
                }
            };

            /**
            * Checks if a coordinate point is over the input box.
            * @param  {Number} x x-coordinate position.
            * @param  {Number} y y-coordinate position.
            * @return {Boolean}   True if it is over the input box.
            */
            self.mouseOverControl = function (x, y) {
                var xLeft = x >= self._x,
                    xRight = x <= self._x + self._width,
                    yTop = y >= self._y,
                    yBottom = y <= self._y + self._height;

                return xLeft && xRight && yTop && yBottom;
            };

            /**
             * Fired with the click event on the canvas, and puts focus on/off
             * based on where the user clicks.
             * @param  {Event}       e    The click event.
             * @param  {FormControl} parent
             * @return {CheckBox}
             */
            self.click = function (e, parent) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y;

                if (self.mouseOverControl(x, y)) {
                    if (self._mouseDown) {
                        self._mouseDown = false;
                        self._selected = !self._selected;
                        return self.focus();
                    }
                } else {
                    return self.blur();
                }
            };

            /**
             * Fired with the mousemove event to update the default cursor.
             * @param  {Event}       e    The mousemove event.
             * @param  {FormControl} parent
             * @return {CheckBox}
             */
            self.mousemove = function (e, parent) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y,
                    isOver = self.mouseOverControl(x, y);
            };

            /**
             * Fired with the mousedown event to start a selection drag.
             * @param  {Event} e    The mousedown event.
             * @param  {FormControl} parent
             */
            self.mousedown = function (e, parent) {
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
             * @param  {FormControl} parent
             */
            self.mouseup = function (e, parent) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y;

                self.click(e, self);
            };

            /**
             * Clears and redraws the CheckBox on an off-DOM canvas,
             * and if a main canvas is provided, draws it all onto that.
             * @return {CheckBox}
             */
            self.render = function (ctx) {
                // ctx.clearRect(self._x, self._y, self._width, self._height);

                ctx.save();

                // draw the text
                var textX = self._x + self._boxPadding + self._boxSize + self._textPadding,
                    textY = self._y + self._height / 2;

                if (self._hasFocus) {
                    if (ctx.setLineDash !== undefined) ctx.setLineDash([1, 5]);
                    ctx.strokeRect(textX, self._y + 2, self._width - textX, self._height - 4);
                    if (ctx.setLineDash !== undefined) ctx.setLineDash([0, 0]);
                }

                // draw the checkbox
                ctx.lineWidth = 2;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                ctx.shadowBlur = 5;
                ctx.shadowColor = '#e3e3e3';
                ctx.strokeStyle = '#3c7fb1';
                ctx.strokeRect(self._x, self._y, self._boxSize, self._boxSize);

                // draw the X if selected
                if (self._selected) {
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(self._x + self._checkInset, self._y + self._checkInset);
                    ctx.lineTo(self._x + self._boxSize - self._checkInset, self._y + self._boxSize - self._checkInset);
                    ctx.moveTo(self._x + self._boxSize - self._checkInset, self._y + self._checkInset);
                    ctx.lineTo(self._x + self._checkInset, self._y + self._boxSize - self._checkInset);
                    ctx.stroke();
                }


                ctx.fillStyle = self._fontColor;
                ctx.font = self._fontStyle + ' ' + self._fontWeight + ' ' + self._fontSize + 'px ' + self._fontFamily;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(self._label, textX, textY);

                // draw the control outline
                ctx.restore();
            };

            // setup the inheritance chain
            CheckBox.prototype = ControlBase.prototype;
            CheckBox.prototype.constructor = ControlBase;
        }
    }
    catch (e) {
        alert('CheckBox ctor' + e.message);
    }
});