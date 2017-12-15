'use strict';


define(['javascripts/source/control/ControlBase'], function (ControlBase) {
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
             * Helper method to get the off-DOM canvas.
             * @return {Object} Reference to the canvas.
             */
            self.renderCanvas = function () {
                return self._renderCanvas;
            };

            /**
             * Fired with the click event on the canvas, and puts focus on/off
             * based on where the user clicks.
             * @param  {Event}       e    The click event.
             * @param  {Button} self
             * @return {Button}
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

                        // call the form defined submit function
                        alert(JSON.stringify(self._onsubmit()));


                        return self.focus();
                    }
                } else {
                    return self.blur();
                }
            };

            /**
             * Fired with the mousemove event to update the default cursor.
             * @param  {Event}       e    The mousemove event.
             * @param  {Button} self
             * @return {Button}
             */
            self.mousemove = function (e, self) {
                var mouse = self._mousePos(e),
                  x = mouse.x,
                  y = mouse.y,
                  isOver = self.mouseOverControl(x, y);

            };

            /**
             * Fired with the mousedown event to start a selection drag.
             * @param  {Event} e    The mousedown event.
             * @param  {Button} self
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
             * @param  {Button} self
             */
            self.mouseup = function (e, self) {
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
            self.render = function () {
                var ctx = self._ctx;

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

                if (self._mouseDown === true)
                {
                    // first draw the background
                    ctx.fillStyle = 'white';
                    ctx.fill();

                    // then set up the text color
                    ctx.fillStyle = self._borderColor;
                }
                else
                {
                    ctx.fillStyle = self._borderColor;
                    ctx.fill();

                    ctx.fillStyle = 'white';
                }

                ctx.font = self._fontStyle + ' ' + self._fontWeight + ' ' + self._fontSize + 'px ' + self._fontFamily;
                ctx.fillText(self._value, self._offsetX + self._x + ((self._width - ctx.measureText(self._value).width) / 2),
                    self._offsetY + self._y + self._height - ((self._height - self._fontSize) / 2));

                ctx.restore();

                return self;
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
            Button.prototype = ControlBase.prototype;
            Button.prototype.constructor = ControlBase;
        }
    }
    catch (e) {
        alert('Button ctor' + e.message);
    }
});