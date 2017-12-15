/**
 * CanvasBase.js
 * @author Andrew
 */

define(function () {
    'use strict';

    try {
        return function CanvasBase(options) {
            var self = this;

            self._canvas = options.canvas || null;
            self._controls = [];

            self._ctx = self._canvas ? self._canvas.getContext('2d') : null;

            self._width = options.canvas.width;
            self._height = options.canvas.height;

            self._graph = options.graph || null;

            self._fontSize = options.fontSize || 14;
            self._fontFamily = options.fontFamily || 'Arial';
            self._fontColor = options.fontColor || '#000';
            self._fontWeight = options.fontWeight || 'normal';
            self._fontStyle = options.fontStyle || 'normal';

            self._onkeydown = options.onkeydown || function () { };
            self._onkeyup = options.onkeyup || function () { };
            self._onkeypress = options.onkeypress || function () { };
            self._onfocus = options.onfocus || function () { };
            self._onblur = options.onblur || function () { };

            self.addControl = function (control) {

                if (control !== null) {

                    self._controls.push(control);

                }

                return control;
            };

            self.canvas = function (data) {
                if (typeof data !== 'undefined') {
                    self._canvas = data;
                    self._ctx = self._canvas.getContext('2d');

                    return self.render();
                } else {
                    return self._canvas;
                }
            };

            /**
             * Get/set the font size.
             * @param  {Number} data Font size.
             * @return {Mixed}      CanvasBase or current font size.
             */

            self.fontSize = function (data) {
                if (typeof data !== 'undefined') {
                    self._fontSize = data;

                    return self.render();
                } else {
                    return self._fontSize;
                }
            };

            /**
             * Get/set the font family.
             * @param  {String} data Font family.
             * @return {Mixed}      CanvasBase or current font family.
             */
            self.fontFamily = function (data) {
                if (typeof data !== 'undefined') {
                    self._fontFamily = data;

                    return self.render();
                } else {
                    return self._fontFamily;
                }
            };

            /**
             * Get/set the font color.
             * @param  {String} data Font color.
             * @return {Mixed}      CanvasBase or current font color.
             */
            self.fontColor = function (data) {
                if (typeof data !== 'undefined') {
                    self._fontColor = data;

                    return self.render();
                } else {
                    return self._fontColor;
                }
            };

            /**
             * Get/set the font weight.
             * @param  {String} data Font weight.
             * @return {Mixed}      CanvasBase or current font weight.
             */
            self.fontWeight = function (data) {
                if (typeof data !== 'undefined') {
                    self._fontWeight = data;

                    return self.render();
                } else {
                    return self._fontWeight;
                }
            };

            /**
             * Get/set the font style.
             * @param  {String} data Font style.
             * @return {Mixed}      CanvasBase or current font style.
             */
            self.fontStyle = function (data) {
                if (typeof data !== 'undefined') {
                    self._fontStyle = data;

                    return self.render();
                } else {
                    return self._fontStyle;
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
             * @param  {CanvasBase} self
             * @return {CanvasBase}
             */
            self.keydown = function (e, self) {
                var keyCode = e.which,
                    isShift = e.shiftKey,
                    key = null;

                // fire custom user event
                self._onkeydown(e, self);

                return self.render();
            };

            /**
             * Fired with the click event on the control, and puts focus on/off
             * based on where the user clicks.
             * @param  {Event}       e    The click event.
             * @param  {CanvasBase} self
             * @return {CanvasBase}
             */
            self.click = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y;

                if (self._canvas) {
                    if (self._mouseDown) {
                        self._mouseDown = false;
                        self.click(e, self);
                        //                      return self.focus();
                    }
                }
            };

            /**
             * Fired with the mousemove event
             * @param  {Event}       e    The mousemove event.
             * @param  {CanvasBase} self
             * @return {CanvasBase}
             */
            self.mousemove = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y;

            };

            /**
             * Fired with the mousedown event
             * @param  {Event} e    The mousedown event.
             * @param  {CanvasBase} self
             */
            self.mousedown = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y;

                self.render();
            };

            /**
             * Fired with the mouseup event
             * @param  {Event} e    The mouseup event.
             * @param  {CanvasBase} self
             */
            self.mouseup = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y;

                self.click(e, self);
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
                    offsetY = 0,
                    x, y;

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

            // setup main canvas events
            if (self._canvas) {
                self._canvas.addEventListener('mousemove', function (e) {
                    e = e || window.event;
                    self.mousemove(e, self);
                }, false);

                self._canvas.addEventListener('mousedown', function (e) {
                    e = e || window.event;
                    self.mousedown(e, self);
                }, false);

                self._canvas.addEventListener('mouseup', function (e) {
                    e = e || window.event;
                    self.mouseup(e, self);
                }, false);
            }

            // setup a global mouseup to blur the input outside of the canvas
            window.addEventListener('mouseup', function (e) {
                e = e || window.event;

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

                self.render();

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

            /**
             * Clears and redraws the CanvasInput on an off-DOM canvas,
             * and if a main canvas is provided, draws it all onto that.
             * @return {CanvasInput}
             */
            self.render = function () {
                var ctx = self._ctx;

                ctx.save();
                /*
                                // clear the canvas
                                ctx.clearRect(0, 0,
                                                self._width,
                                                self._height);
                                                */
                ctx.restore();

                return self;
            };
        };
    }
    catch (e) {
        alert('CanvasBase ctor' + e.message);
    }
});
