define(['javascripts/source/control/ControlBase'],
    function (ControlBase) {
        'use strict';
        try {
            return function Handle(options) {

                var self = this;

                // call parent constructor
                ControlBase.call(self, options);

                options = options ? options : {};

                self._width = options.width || 24;
                self._height = options.height || 24;
                self._borderRadius = options.borderRadius || 4;
                self._iconRenderer = options.iconRenderer || function () { };
                self._onclick = options.onclick || function () { };
                self._control = options.control || null;
                
                self._xOffset = options.xOffet || 30;
                self._yOffset = options.yOffset || 30;

                /**
                 * Fired with the click event on the canvas, and puts focus on/off
                 * based on where the user clicks.
                 * @param  {Event}       e    The click event.
                 * @param  {Handle} self
                 * @return {Handle}
                 */
                self.click = function (e) {
                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y;

                    if (self.mouseOverControl(x, y)) {
                        if (self._mouseDown) {
                            self._mouseDown = false;

                            // call the user defined onclick
                            self._onclick();

                            return self.focus();
                        }
                    } else {
                        return self.blur();
                    }
                };

                /**
                 * Fired with the mousemove event to update the default cursor.
                 * @param  {Event}       e    The mousemove event.
                 * @param  {Handle} self
                 * @return {Handle}
                 */
                self.mousemove = function (e) {
                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y,
                        isOver = self.mouseOverControl(x, y);

                };

                /**
                 * Fired with the mousedown event to start a selection drag.
                 * @param  {Event} e    The mousedown event.
                 * @param  {Handle} self
                 */
                self.mousedown = function (e) {
                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y,
                        isOver = self.mouseOverControl(x, y);

                    // // setup the 'click' event
                    self._mouseDown = !self._mouseDown;
                    
                    //    self.render();
                };

                /**
                 * Fired with the mouseup event 
                 * @param  {Event} e    The mouseup event.
                 * @param  {Handle} self
                 */
                self.mouseup = function (e) {
                    var mouse = self._parent.mousePos(e),
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

                    self._iconRenderer(ctx, self._x, self._y);
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
                /*
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
                */
                
                /**
                 * Helper method to get the off-DOM canvas.
                 * @return {Object} Reference to the canvas.
                 */
                /*
                self.renderCanvas = function () {
                    return self._renderCanvas;
                };
                */
                
                // setup the inheritance chain
                Handle.prototype = ControlBase.prototype;
                Handle.prototype.constructor = ControlBase;
            }
        }
        catch (e) {
            alert('Handle ctor' + e.message);
        }
    });