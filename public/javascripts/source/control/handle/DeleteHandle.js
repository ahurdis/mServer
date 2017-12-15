define(['javascripts/source/control/handle/Handle',
        'javascripts/source/canvas/Icon'],
    function (Handle, Icon) {
        'use strict';
        try {
            return function DeleteHandle(options) {

                var self = this;

                // call parent constructor
                Handle.call(self, options);

                options = options ? options : {};

                self._iconRenderer = options.iconRenderer || Icon.drawX;
                
                self._x = self._control.x() - self._xOffset;
                self._y = self._control.y() - self._yOffset;

                /**
                 * Fired with the click event on the canvas, and puts focus on/off
                 * based on where the user clicks.
                 * @param  {Event}       e    The click event.
                 * @param  {DeleteHandle} self
                 * @return {DeleteHandle}
                 */
                self.click = function (e) {
                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y;

                    if (self._canvas && self.mouseOverControl(x, y)) {
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
                 * @param  {DeleteHandle} self
                 * @return {DeleteHandle}
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
                 * @param  {DeleteHandle} self
                 */
                self.mousedown = function (e) {
                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y,
                        isOver = self.mouseOverControl(x, y);

                    // // setup the 'click' event
                    self._mouseDown = !self._mouseDown;
                    self._parent.removeEntityControls();
                    //    self.render();
                };

                /**
                 * Fired with the mouseup event 
                 * @param  {Event} e    The mouseup event.
                 * @param  {DeleteHandle} self
                 */
                self.mouseup = function (e) {
                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y;

                    self.click(e, self);
                };

                // setup the inheritance chain
                DeleteHandle.prototype = Handle.prototype;
                DeleteHandle.prototype.constructor = Handle;
            }
        }
        catch (e) {
            alert('DeleteHandle ctor' + e.message);
        }
    });