/**
 * Button.js
 * @author Andrew
 */

define(['javascripts/source/control/ControlBase'], function (ControlBase) {
    'use strict';
    try {
        return function Button(options) {
            var self = this;

            // call parent constructor
            ControlBase.call(self, options);

            options = options ? options : {};

            self._width = options.width || 150;
            self._height = options.height || self._fontSize * 3;
            self._borderRadius = options.borderRadius || 4;
            self._value = 'Press Me!';

            self._borderColor = options.borderColor || 'rgba(79, 212, 253, 1.0)';

            self._onsubmit = options.onsubmit || function () { return self._form._onsubmit(); };
            self._onclick = options.onclick || function () { };

            /**
             * Fired with the click event on the canvas, and puts focus on/off
             * based on where the user clicks.
             * @param  {Event}       e    The click event.
             * @param  {FormControl} parent
             * @return {Button}
             */
            self.click = function (e, parent) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y;

                if (self.mouseOverControl(x, y)) {
                    if (self._mouseDown) {
                        self._mouseDown = false;

                        // call the user defined onclick
                        self._onclick();

                        // call the form defined submit function
                        // alert(JSON.stringify(self._onsubmit()));
                        alert('Button clicked!');

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
             * @return {Button}
             */
            self.mousemove = function (e, parent) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y,
                    isOver = self.mouseOverControl(x, y);
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

                // self.render();
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
             * Clears and redraws the CanvasInput on an off-DOM canvas,
             * and if a main canvas is provided, draws it all onto that.
             * @return {CanvasInput}
             */
            self.render = function (ctx) {

                ctx.save();

                // clear the canvas
                ctx.clearRect(self._offsetX + self._x, self._offsetY + self._y,
                    self._width,
                    self._height);


                self._roundedRect(ctx,
                    self._offsetX + self._x,
                    self._offsetY + self._y,
                    self._width,
                    self._height,
                    self._borderRadius);
                ctx.lineWidth = 3;
                ctx.stroke();

                if (self._mouseDown === true) {
                    // first draw the background
                    ctx.fillStyle = 'white';
                    ctx.fill();

                    // then set up the text color
                    ctx.fillStyle = self._borderColor;
                }
                else {
                    ctx.fillStyle = self._borderColor;
                    ctx.fill();

                    ctx.fillStyle = 'white';
                }

                ctx.font = self._fontStyle + ' ' + self._fontWeight + ' ' + self._fontSize + 'px ' + self._fontFamily;
                ctx.fillText(self._value, self._offsetX + self._x + ((self._width - ctx.measureText(self._value).width) / 2),
                    self._offsetY + self._y + self._height - ((self._height - self._fontSize) / 2));

                ctx.restore();
            };

            // setup the inheritance chain
            Button.prototype = ControlBase.prototype;
            Button.prototype.constructor = ControlBase;
        }
    }
    catch (e) {
        alert('Button ctor' + e.message);
    }
});