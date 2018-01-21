// JavaScript source code

/**
 * ControlBase.js
 * @author Andrew
 */

define(function () {
    'use strict';
    try {
        return function ControlBase(options) {
            var self = this;

            self._canvas = options.canvas || null;
            self._ctx = options.ctx || self._canvas.getContext("2d");
            self._parent = options.parent;

            self._form = options.form || null;

            self._id = options.id || null;

            self._x = options.x || 0;
            self._y = options.y || 0;

            self._offsetX = options.offsetX || 2;
            self._offsetY = options.offsetY || 2;

            self._paddingX = options.paddingX || 5;
            self._paddingY = options.paddingY || 5;

            self._fontSize = options.fontSize || 14;
            self._fontFamily = options.fontFamily || 'Arial, Helvetica, sans-serif';
            self._fontColor = options.fontColor || app.fontColor || '#FFFFFF';
            self._fontWeight = options.fontWeight || 'normal';
            self._fontStyle = options.fontStyle || 'normal';

            self._readonly = options.readonly || false;
            self._hasFocus = false;
            self._mouseDown = false;

            self._onsubmit = options.onsubmit || function () { };
            self._onkeydown = options.onkeydown || function () { };
            self._onkeyup = options.onkeyup || function () { };
            self._onkeypress = options.onkeypress || function () { };
            self._onfocus = options.onfocus || function () { };
            self._onblur = options.onblur || function () { };

            self.toJSON = function () {

                return {
                    id: self._id,
                    x: self._x,
                    y: self._y,
                    offsetX: self._offsetX,
                    offsetY: self._offsetY,
                    paddingX: self._paddingX,
                    paddingY: self._paddingY,
                    fontSize: self._fontSize,
                    fontFamily: self._fontFamily,
               //     fontColor: self._fontColor,
                    fontWeight: self._fontWeight,
                    fontStyle: self._fontStyle,
                    readonly: self._readonly
                };
            };

            self.canvas = function (data) {
                if (typeof data !== 'undefined') {
                    self._canvas = data;
                    self._ctx = self._canvas.getContext('2d');

                    //  return self._form.render();
                } else {
                    return self._canvas;
                }
            };


            /**
             * Get/set the controls id.
             * @param  {Number} data The pixel padding along the y-coordinate.
             * @return {Mixed}      ControlBase or current x-value.
             */
            self.id = function (data) {
                if (typeof data !== 'undefined') {
                    self._id = data;

                    return self;
                } else {
                    return self._id;
                }
            };

            /**
             * Get/set the x-position.
             * @param  {Number} data The pixel position along the x-coordinate.
             * @return {Mixed}      ControlBase or current x-value.
             */
            self.x = function (data) {
                if (typeof data !== 'undefined') {
                    self._x = data;

                    //  return self._form.render();
                } else {
                    return self._x;
                }
            };

            /**
             * Get/set the y-position.
             * @param  {Number} data The pixel position along the y-coordinate.
             * @return {Mixed}      ControlBase or current y-value.
             */
            self.y = function (data) {
                if (typeof data !== 'undefined') {
                    self._y = data;

                    //  return self._form.render();
                } else {
                    return self._y;
                }
            };

            /**
             * Get/set the x-padding.
             * @param  {Number} data The pixel padding along the x-coordinate.
             * @return {Mixed}      ControlBase or current x-value.
             */
            self.paddingX = function (data) {
                if (typeof data !== 'undefined') {
                    self._paddingX = data;

                    //  return self._form.render();
                } else {
                    return self._paddingX;
                }
            };


            /**
             * Get/set the y-padding.
             * @param  {Number} data The pixel padding along the y-coordinate.
             * @return {Mixed}      ControlBase or current x-value.
             */
            self.paddingY = function (data) {
                if (typeof data !== 'undefined') {
                    self._paddingY = data;

                    //  return self._form.render();
                } else {
                    return self._paddingY;
                }
            };

            /**
             * Get/set the font size.
             * @param  {Number} data Font size.
             * @return {Mixed}      ControlBase or current font size.
             */

            self.fontSize = function (data) {
                if (typeof data !== 'undefined') {
                    self._fontSize = data;

                    //  return self._form.render();
                } else {
                    return self._fontSize;
                }
            };

            /**
             * Get/set the font family.
             * @param  {String} data Font family.
             * @return {Mixed}      ControlBase or current font family.
             */
            self.fontFamily = function (data) {
                if (typeof data !== 'undefined') {
                    self._fontFamily = data;

                    //  return self._form.render();
                } else {
                    return self._fontFamily;
                }
            };

            /**
             * Get/set the font color.
             * @param  {String} data Font color.
             * @return {Mixed}      ControlBase or current font color.
             */
            self.fontColor = function (data) {
                if (typeof data !== 'undefined') {
                    self._fontColor = data;

                    //  return self._form.render();
                } else {
                    return self._fontColor;
                }
            };

            /**
             * Get/set the font weight.
             * @param  {String} data Font weight.
             * @return {Mixed}      ControlBase or current font weight.
             */
            self.fontWeight = function (data) {
                if (typeof data !== 'undefined') {
                    self._fontWeight = data;

                    //  return self._form.render();
                } else {
                    return self._fontWeight;
                }
            };

            /**
             * Get/set the font style.
             * @param  {String} data Font style.
             * @return {Mixed}      ControlBase or current font style.
             */
            self.fontStyle = function (data) {
                if (typeof data !== 'undefined') {
                    self._fontStyle = data;

                    //  return self._form.render();
                } else {
                    return self._fontStyle;
                }
            };

            /**
             * Get/set the font style.
             * @param  {String} data Font style.
             * @return {Mixed}      ControlBase or current font style.
             */
            self.hasFocus = function () {
                return self._hasFocus;
            };

            /**
             * Get/set the width of the control.
             * @param  {Number} data Height in pixels.
             * @return {Mixed}      Current height.
             */
            self.width = function (data) {
                if (typeof data !== 'undefined') {
                    self._width = data;
                    //  return self._form.render();
                } else {
                    return self._width;
                }
            };

            /**
             * Get/set the height of the control.
             * @param  {Number} data Height in pixels.
             * @return {Mixed}  Current height.
             */
            self.height = function (data) {
                if (typeof data !== 'undefined') {
                    self._height = data;
                    //  return self._form.render();
                } else {
                    return self._height;
                }
            };

            /**
             * Set or fire the onsubmit event.
             * @param  {Function} fn Custom callback.
             */
            self.onsubmit = function (fn) {
                if (typeof fn !== 'undefined') {
                    self._onsubmit = fn;

                    return self;
                } else {
                    self._onsubmit();
                }
            };

            /**
             * Set or fire the onkeydown event.
             * @param  {Function} fn Custom callback.
             */
            self.onkeydown = function (fn) {
                if (typeof fn !== 'undefined') {
                    self._onkeydown = fn;

                    return self;
                } else {
                    self._onkeydown();
                }
            };

            /**
             * Set or fire the onkeyup event.
             * @param  {Function} fn Custom callback.
             */
            self.onkeyup = function (fn) {
                if (typeof fn !== 'undefined') {
                    self._onkeyup = fn;

                    return self;
                } else {
                    self._onkeyup();
                }
            };

            /**
             * Set or fire the onkeypress event.
             * @param  {Function} fn Custom callback.
             */
            self.onkeypress = function (fn) {
                if (typeof fn !== 'undefined') {
                    self._onkeypress = fn;

                    return self;
                } else {
                    self._onkeypress();
                }
            };

            /**
             * Fired with the keydown event to draw the typed characters.
             * @param  {Event}       e    The keydown event.
             * @param  {ControlBase} self
             * @return {ControlBase}
             */
            self.keydown = function (e, self) {
                var keyCode = e.which,
                    isShift = e.shiftKey,
                    key = null;

                // make sure the correct text field is being updated
                if (!self._hasFocus) {
                    return;
                }

                // fire custom user event
                self._onkeydown(e, self);
            };

            /**
             * Fired with the click event on the control, and puts focus on/off
             * based on where the user clicks.
             * @param  {Event}       e    The click event.
             * @param  {ControlBase} self
             * @return {ControlBase}
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
             * @param  {ControlBase} self
             * @return {ControlBase}
             */
            self.mousemove = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y,
                    isOver = self.mouseOverControl(x, y);

            };

            /**
             * Fired with the mousedown event
             * @param  {Event} e    The mousedown event.
             * @param  {ControlBase} self
             */
            self.mousedown = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y,
                    isOver = self.mouseOverControl(x, y);

                // setup the 'click' event
                self._mouseDown = isOver;

                // self._form.render();
            };

            /**
             * Fired with the mouseup event
             * @param  {Event} e    The mouseup event.
             * @param  {ControlBase} self
             */
            self.mouseup = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y;

                self.click(e, self);
            };


            /**
             * Fired with the double click event
             * @param  {Event} e    The mouseup event.
             * @param  {ControlBase} self
             */
            self.dblclick = function (e, self) {

                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y;

                if (self._canvas && self.mouseOverControl(x, y)) {
                    // alert('hi');
                    return self.focus();
                }
            };

            /**
             * Checks if a coordinate point is over the control.
             * @param  {Number} x x-coordinate position.
             * @param  {Number} y y-coordinate position.
             * @return {Boolean}   True if it is over the control
             */
            self.mouseOverControl = function (x, y) {
                var xLeft = x >= self._x,
                    xRight = x <= self._x + self._width,
                    yTop = y >= self._y,
                    yBottom = y <= self._y + self._height;

                return xLeft && xRight && yTop && yBottom;
            };

            /**
             * Place focus on the ControlBase  derived control
             * @return {ControlBase}
             */
            self.focus = function () {

                // only fire the focus event when going from unfocused
                if (!self._hasFocus) {
                    self._onfocus(self);

                    // if (self._form) {
                    //    self._form.removeFocus();
                    //  }
                }

                self._hasFocus = true;

                //  return self._form.render();
            };

            /**
             * Removes focus from the ControlBase derived control
             * @param  {Object} _this Reference to this.
             * @return {ControlBase}
             */
            self.blur = function (_this) {
                var self = _this || this;

                self._onblur(self);

                self._hasFocus = false;

                //  return self._form.render();
            };

            /**
             * Calculate the mouse position based on the event callback and the elements on the page.
             * @param  {Event} e
             * @return {Object}   x & y values
             */
            self._mousePos = function (e) {
                var elm = e.target,
                    style = document.defaultView.getComputedStyle(elm, undefined),
                    paddingLeft = parseInt(style['paddingLeft'], 10) || 0,
                    paddingTop = parseInt(style['paddingLeft'], 10) || 0,
                    borderLeft = parseInt(style['borderLeftWidth'], 10) || 0,
                    borderTop = parseInt(style['borderLeftWidth'], 10) || 0,
                    htmlTop = document.body.parentNode.offsetTop || 0,
                    htmlLeft = document.body.parentNode.offsetLeft || 0,
                    offsetX = 0,
                    offsetY = 0;

                // calculate the total offset
                if (typeof elm.offsetParent !== 'undefined') {
                    do {
                        offsetX += elm.offsetLeft;
                        offsetY += elm.offsetTop;
                    } while ((elm = elm.offsetParent));
                }

                // take into account borders and padding
                offsetX += paddingLeft + borderLeft + htmlLeft;
                offsetY += paddingTop + borderTop + htmlTop;

                return {
                    x: e.pageX - offsetX,
                    y: e.pageY - offsetY
                };
            };


            /**
             * Gets the pixel width of passed text.
             * @param  {String} text The text to measure.
             * @return {Number}      The measured width.
             */
            self._textWidth = function (text) {
                var ctx = self._ctx;

                ctx.font = self._fontStyle + ' ' + self._fontWeight + ' ' + self._fontSize + 'px ' + self._fontFamily;
                ctx.textAlign = 'left';

                return ctx.measureText(text).width;
            };


            /**
             * Creates the path for a rectangle with rounded corners.
             * Must call ctx.fill() after calling this to draw the rectangle.
             * @param  {Object} ctx Canvas context.
             * @param  {Number} x   x-coordinate to draw from.
             * @param  {Number} y   y-coordinate to draw from.
             * @param  {Number} w   Width of rectangle.
             * @param  {Number} h   Height of rectangle.
             * @param  {Number} r   Border radius.
             */
            self._roundedRect = function (ctx, x, y, w, h, r) {
                if (w < 2 * r) r = w / 2;
                if (h < 2 * r) r = h / 2;

                ctx.beginPath();

                ctx.moveTo(x + r, y);
                ctx.lineTo(x + w - r, y);
                ctx.quadraticCurveTo(x + w, y, x + w, y + r);
                ctx.lineTo(x + w, y + h - r);
                ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                ctx.lineTo(x + r, y + h);
                ctx.quadraticCurveTo(x, y + h, x, y + h - r);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);

                ctx.closePath();
            };

            // setup a global mouseup to blur the input outside of the canvas
            window.addEventListener('mouseup', function (e) {
                e = e || window.event;

                if (self._hasFocus && !self._mouseDown) {
                    self.blur();
                }
            }, true);


            // setup the keydown listener
            self._canvas.addEventListener('keydown', function (e) {
                e = e || window.event;

                if (self._hasFocus) {
                    self.keydown(e, self);
                }
            });

            // setup the keypress listener
            self._canvas.addEventListener('keypress', function (e) {
                e = e || window.event;

                if (self._hasFocus && self.keypress) {
                    self.keypress(e, self);
                }
            });

            // setup the keyup listener
            self._canvas.addEventListener('keyup', function (e) {
                e = e || window.event;

                // self._form.render();

                if (self._hasFocus) {
                    self._onkeyup(e, self);
                }
            });

            // setup the paste listener
            self._canvas.addEventListener('paste', function (e) {
                if (e.clipboardData.types.indexOf('text/html') > -1) {
                    alert('You pasted : ' + e.clipboardData.getData('text/html'));
                    e.preventDefault(); // We are already handling the data from the clipboard, we do not want it inserted into the document
                }
            });
        };
    }
    catch (e) {
        alert('ControlBase ctor' + e.message);
    }
});
