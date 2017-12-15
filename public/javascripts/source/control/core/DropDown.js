// JavaScript source code

/**
 * DropDown.js
 * @author Andrew
 */

'use strict';


define(['javascripts/source/control/ControlBase'], function (ControlBase) {
    try {
        return function DropDown(options) {
            var self = this;

            // call parent constructor
            ControlBase.call(self, options);

            options = options ? options : {};

            self._width = options.width || 150;
            self._height = options.height || self._fontSize * 2;
            self._borderRadius = options.borderRadius || 2;
            self._value = 'default';

            self._borderColor = options.borderColor || 'rgba(79, 212, 253, 1.0)';
            self._selectionColor = options.selectionColor || 'rgba(179, 212, 253, 0.6)';

            self._onsubmit = options.onsubmit || function () { };
            self._onclick = options.onclick || function () { };

            self._values = ['banana', 'apple', 'cherry', 'mahogany', 'verbena'];

            self._expanded = false;
            self._expansionTimer = function () { };
            self._expansionPadding = 10;
            self._expansionCellSize = self._fontSize + self._expansionPadding;
            self._expansionHeight = (self._values.length + 1) * self._expansionCellSize;

            self._contractionHeight = self._height;

            self._highLightedCell = 0;

            self._triangleHeight = self._height / 2;
            self._triangleWidth = self._triangleHeight;
            self._triangleInset = 5;

            /**
             * Helper method to get the off-DOM canvas.
             * @return {Object} Reference to the canvas.
             */
            self.renderCanvas = function () {
                return self._renderCanvas;
            };

            function myTimer() {

                if (self._expanded === false) {
                    if (self._height < self._expansionHeight) {
                        self._height += self._expansionCellSize / 2;
                    }
                    else {
                        self._expanded = true;
                        clearTimeout(self._expansionTimer);
                    }
                }

                if (self._expanded === true) {
                    if (self._contractionHeight < self._height) {
                        self._height -= self._expansionCellSize / 2;
                    }
                    else {
                        self._expanded = false;
                        self._height = self._contractionHeight;
                        clearTimeout(self._expansionTimer);
                        self._form.render();
                    }
                }
                self.render();
            };

            /**
             * Fired with the click event on the canvas, and puts focus on/off
             * based on where the user clicks.
             * @param  {Event}       e    The click event.
             * @param  {CheckBox} self
             * @return {CheckBox}
             */
            self.click = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y;

                if (self._canvas && self.mouseOverControl(x, y)) {
                    if (self._mouseDown) {
                        self._mouseDown = false;

                        // call the user defined onclick
                        self._onclick();

                        self._expansionTimer = setInterval(function () { myTimer() }, 5);

                        return self.focus();
                    }
                } else {
                    return self.blur();
                }
            };

            /**
             * Fired with the mousemove event to update the default cursor.
             * @param  {Event}       e    The mousemove event.
             * @param  {CheckBox} self
             * @return {CheckBox}
             */
            self.mousemove = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y,
                    isOver = self.mouseOverControl(x, y);

                if (isOver === true && self._expanded === true) {
                    // determine which cell is highlighted
                    self._highLightedCell = Math.floor((y - self._y) / self._expansionCellSize);

                    if (self._highLightedCell > self._values.length - 1) {
                        self._highLightedCell = self._values.length - 1;
                    }
                    self.render();
                }
                else {
                    self._highLightedCell = 0;
                }
            };

            /**
             * Fired with the mousedown event to start a selection drag.
             * @param  {Event} e    The mousedown event.
             * @param  {CheckBox} self
             */
            self.mousedown = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y,
                    isOver = self.mouseOverControl(x, y);

                // setup the 'click' event
                self._mouseDown = isOver;


                self.render();
            };

            /**
             * Fired with the mouseup event 
             * @param  {Event} e    The mouseup event.
             * @param  {CheckBox} self
             */
            self.mouseup = function (e, self) {
                var mouse = self._mousePos(e),
                    x = mouse.x,
                    y = mouse.y;

                self.click(e, self);

                if (self._expanded === true) {
                    self._value = self._values[self._highLightedCell];
                }

                self._highLightedCell = 0;

            };



            /**
             * Clears and redraws the CanvasInput on an off-DOM canvas,
             * and if a main canvas is provided, draws it all onto that.
             * @return {CanvasInput}
             */
            self.render = function () {
                var ctx = self._ctx;

                ctx.save();

                ctx.clearRect(self._offsetX + self._x - 1,
                    self._offsetY + self._y,
                    self._width + 5,
                    self._height + self._offsetY + (self._values.length * self._expansionCellSize));


                self._roundedRect(ctx,
                    self._offsetX + self._x,
                    self._offsetY + self._y,
                    self._width,
                    self._height,
                    self._borderRadius);
                ctx.lineWidth = 2;
                ctx.stroke();

                ctx.fillStyle = self._fontColor;
                ctx.font = self._fontStyle + ' ' + self._fontWeight + ' ' + self._fontSize + 'px ' + self._fontFamily;

                if (self._expanded === true) {
                    for (var i = 0; i < self._values.length; i++) {
                        ctx.fillText(self._values[i], self._offsetX + self._x + ((self._width - ctx.measureText(self._value).width) / 2),
                            self._offsetY + self._y + (i + 1) * self._expansionCellSize);
                    }

                    // now highlight the highlighted cell
                    ctx.fillStyle = self._selectionColor;
                    ctx.fillRect(self._offsetX + self._x,
                        self._offsetY + self._y + self._expansionPadding / 2 + self._expansionCellSize * self._highLightedCell,
                        self._width,
                        self._expansionCellSize);
                }
                else {
                    ctx.fillText(self._value, self._offsetX + self._x + ((self._width - ctx.measureText(self._value).width) / 2),
                        self._offsetY + self._y + self._height - ((self._height - self._fontSize) / 2));

                    // now draw the triangle
                    ctx.beginPath();
                    ctx.moveTo(self._x + self._width - self._triangleInset, self._y + self._triangleInset);
                    ctx.lineTo(self._x + self._width - self._triangleInset - self._triangleWidth, self._y + self._triangleInset);
                    ctx.lineTo(self._x + self._width - self._triangleInset - self._triangleWidth / 2, self._y + self._triangleInset + self._triangleWidth);
                    ctx.fill();
                }
                ctx.restore();

                return self;
            };
            /**
             * Get/set the current text box value.
             * @param  {String} data Text value.
             * @return {Mixed}      EditBox or current text value.
             */
            self.value = function (data) {
                if (typeof data !== 'undefined') {
                    self._value = data + '';

                    self.render();

                    return self;
                } else {
                    return (self._value === self._placeHolderText) ? '' : self._value;
                }
            };

            /**
             * Recalculate the outer with and height of the text box.
             */
            self._calcWH = function () {
                // calculate the full width and height with padding, borders and shadows
                self.outerW = self._width + self._offsetX * 2 + self._borderWidth * 2 + self.shadowW;
                self.outerH = self._height + self._offsetY * 2 + self._borderWidth * 2 + self.shadowH;
            };

            /**
             * Update the width and height of the off-DOM canvas when attributes are changed.
             */
            self._updateCanvasWH = function () {
                var oldW = self._renderCanvas.width,
                    oldH = self._renderCanvas.height;

                // update off-DOM canvas
                self._renderCanvas.setAttribute('width', self.outerW);
                self._renderCanvas.setAttribute('height', self.outerH);
                self._shadowCanvas.setAttribute('width', self._width + self._padding * 2);
                self._shadowCanvas.setAttribute('height', self._height + self._padding * 2);

                // clear the main canvas
                if (self._ctx) {
                    self._ctx.clearRect(self._x, self._y, oldW, oldH);
                }
            };


            // setup the off-DOM canvas
            self._renderCanvas = document.createElement('canvas');
            self._renderCanvas.setAttribute('width', self.outerW);
            self._renderCanvas.setAttribute('height', self.outerH);
            self._renderCtx = self._renderCanvas.getContext('2d');

            // draw the text box
            self.render();

            // setup the inheritance chain
            DropDown.prototype = ControlBase.prototype;
            DropDown.prototype.constructor = ControlBase;
        }
    }
    catch (e) {
        alert('DropDown ctor' + e.message);
    }
});
