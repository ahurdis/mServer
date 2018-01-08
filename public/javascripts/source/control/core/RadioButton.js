/**
 * RadioButton.js
 * @author Andrew
 */

define(['javascripts/source/control/ControlBase'], function (ControlBase) {
    'use strict';
    try {
        return function RadioButton(options) {
            var self = this;

            // call parent constructor
            ControlBase.call(self, options);

            options = options ? options : {};

            // setup the defaults
            self._maxlength = options.maxlength || null;
            self._width = options.width || 150;
            self._height = options.height || self._fontSize;
            self._value = options.value || '';
            self._onfocus = options.onfocus || function () { };
            self._onblur = options.onblur || function () { };

            /**
             * Get/set the width of the text box.
             * @param  {Number} data Width in pixels.
             * @return {Mixed}      RadioButton or current width.
             */
            self.width = function (data) {
                if (typeof data !== 'undefined') {
                    self._width = data;
                } else {
                    return self._width;
                }
            };

            /**
             * Get/set the height of the text box.
             * @param  {Number} data Height in pixels.
             * @return {Mixed}      RadioButton or current height.
             */
            self.height = function (data) {
                if (typeof data !== 'undefined') {
                    self._height = data;
                } else {
                    return self._height;
                }
            };


            /**
             * Get/set the current radio button value.
             * @param  {String} data Text value.
             * @return {Mixed}      RadioButton or current text value.
             */
            self.value = function (data) {
                if (typeof data !== 'undefined') {
                    self._value = data + '';

                    return self;
                } else {
                    return (self._value === self._placeHolder) ? '' : self._value;
                }
            };

            /**
             * Fired with the keydown event to draw the typed characters.
             * @param  {Event}       e    The keydown event.
             * @param  {FormControl} parent
             * @return {RadioButton}
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

                // add support for Ctrl/Cmd+A selection
                if (keyCode === 9) { // tab key
                    e.preventDefault();

                    /*
                    if (inputs.length > 1) {
                        var next = (inputs[self._inputsIndex + 1]) ? self._inputsIndex + 1 : 0;
                        self.blur();
                        setTimeout(function () {
                            inputs[next].focus();
                        }, 10);
                    }*/
                }

            }

            // update the canvas input state information from the hidden input
            self._value = self._hiddenInput.value;
            self._cursorPos = self._hiddenInput.selectionStart;
            self._selection = [0, 0];
        };

        /**
         * Fired with the click event on the canvas, and puts focus on/off
         * based on where the user clicks.
         * @param  {Event}       e    The click event.
         * @param  {FormControl} parent
         * @return {RadioButton}
         */
        self.click = function (e, parent) {
            var mouse = self._mousePos(e),
                x = mouse.x,
                y = mouse.y;

            if (self._canvas && self.mouseOverControl(x, y) || !self._canvas) {
                if (self._mouseDown) {
                    self._mouseDown = false;
                    self.click(e, self);
                    return self.focus(self._clickPos(x, y));
                }
            } else {
                return self.blur();
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
         * Fired with the mousemove event to update the default cursor.
         * @param  {Event}       e    The mousemove event.
         * @param  {FormControl} parent
         * @return {RadioButton}
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
         * Clears and redraws the RadioButton on an off-DOM canvas,
         * and if a main canvas is provided, draws it all onto that.
         * @return {RadioButton}
         */
        self.render = function (ctx) {
            var w = self.outerW,
                h = self.outerH,
                br = self._borderRadius,
                bw = self._borderWidth,
                sw = self.shadowW,
                sh = self.shadowH;

            // clear the canvas
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // setup the box shadow
            ctx.shadowOffsetX = self._boxShadow.x;
            ctx.shadowOffsetY = self._boxShadow.y;
            ctx.shadowBlur = self._boxShadow.blur;
            ctx.shadowColor = self._boxShadow.color;

            // draw the text box background
            self._drawTextBox(function () {
                // make sure all shadows are reset
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 0;

                // clip the text so that it fits within the box
                var text = self._clipText();

                // draw the selection
                var paddingBorder = self._padding + self._borderWidth + self.shadowT;
                if (self._selection[1] > 0) {
                    var selectOffset = self._textWidth(text.substring(0, self._selection[0])),
                        selectWidth = self._textWidth(text.substring(self._selection[0], self._selection[1]));

                    ctx.fillStyle = self._selectionColor;
                    ctx.fillRect(paddingBorder + selectOffset, paddingBorder, selectWidth, self._height);
                }

                // draw the text
                var textX = self._padding + self._borderWidth + self.shadowL,
                    textY = Math.round(paddingBorder + self._height / 2);

                // only remove the placeholder text if they have typed something
                text = (text === '' && self._placeHolder) ? self._placeHolder : text;

                ctx.fillStyle = (self._value !== '' && self._value !== self._placeHolder) ? self._fontColor : self._placeHolderColor;
                ctx.font = self._fontStyle + ' ' + self._fontWeight + ' ' + self._fontSize + 'px ' + self._fontFamily;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, textX, textY);

                // parse inner shadow
                var innerShadow = self._innerShadow.split('px '),
                    isOffsetX = self._innerShadow === 'none' ? 0 : parseInt(innerShadow[0], 10),
                    isOffsetY = self._innerShadow === 'none' ? 0 : parseInt(innerShadow[1], 10),
                    isBlur = self._innerShadow === 'none' ? 0 : parseInt(innerShadow[2], 10),
                    isColor = self._innerShadow === 'none' ? '' : innerShadow[3];

                // draw the inner-shadow (damn you canvas, this should be easier than this...)
                if (isBlur > 0) {
                }

                // draw to the visible canvas
                if (self._ctx) {
                    self._ctx.clearRect(self._x, self._y, ctx.canvas.width, ctx.canvas.height);
                    self._ctx.drawImage(self._renderCanvas, self._x, self._y);
                }

                return self;

            });
        };

        /**
         * Draw the text box area with either an image or background color.
         * @param  {Function} fn Callback.
         */
        self._drawTextBox = function (fn) {
            var ctx = self._renderCtx,
                w = self.outerW,
                h = self.outerH,
                br = self._borderRadius,
                bw = self._borderWidth,
                sw = self.shadowW,
                sh = self.shadowH;

            // only draw the background shape if no image is being used
            if (self._backgroundImage === '') {
                ctx.fillStyle = self._backgroundColor;
                self._roundedRect(ctx, bw + self.shadowL, bw + self.shadowT, w - bw * 2 - sw, h - bw * 2 - sh, br);
                ctx.fill();

                fn();
            } else {
                var img = new Image();
                img.src = self._backgroundImage;
                img.onload = function () {
                    ctx.drawImage(img, 0, 0, img.width, img.height, bw + self.shadowL, bw + self.shadowT, w, h);

                    fn();
                };
            }
        };

        // setup the inheritance chain
        RadioButton.prototype = ControlBase.prototype;
        RadioButton.prototype.constructor = ControlBase;
    }
    catch (e) {
        alert('RadioButton ctor' + e.message);
    }
});