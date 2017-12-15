define(['javascripts/source/control/handle/Handle',
    'javascripts/source/canvas/Icon'],
    function (Handle, Icon) {
        'use strict';
        try {
            return function ResizeHandle(options) {

                var self = this;

                // call parent constructor
                Handle.call(self, options);

                options = options ? options : {};

                self._iconRenderer = options.iconRenderer || Icon.drawLink;

                self._x = self._control.x() + self._control.width();
                self._y = self._control.y() + self._control.height();

                /**
                 * Fired with the click event on the canvas, and puts focus on/off
                 * based on where the user clicks.
                 * @param  {Event}       e    The click event.
                 * @param  {ResizeHandle} self
                 * @return {ResizeHandle}
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
                 * @param  {ResizeHandle} self
                 * @return {ResizeHandle}
                 */
                self.mousemove = function (e) {

                    var mouse = self._parent.mousePos(e);

                    var width = self._control._x + self._control._minWidth;
                    var height = self._control._y + self._control._minHeight;

                    var posHandleX = (mouse.x > width) ? mouse.x : width + 1;
                    var posHandleY = (mouse.y > height) ? mouse.y : height + 1;

                    self._control._width = (self._control._width > self._control._minWidth) ? self._control._width + posHandleX - self._x : self._control._minWidth + 1;
                    self._control._height = (self._control._height > self._control._minHeight) ? self._control._height + posHandleY - self._y : self._control._minHeight + 1;
                        
                    self._x = posHandleX;
                    self._y = posHandleY;
                    /*
                    var handles = self._control._handles;
                    
                    // update the handle positions
                    for (var iHandle = handles.length - 1; iHandle >= 0; iHandle--) {
                        handles[iHandle]._x += (posHandleX - self._control._x);
                        handles[iHandle]._y += (posHandleY - self._control._y);
                    }
                    */
                };

                /**
                 * Fired with the mousedown event to start a selection drag.
                 * @param  {Event} e    The mousedown event.
                 * @param  {ResizeHandle} self
                 */
                self.mousedown = function (e) {

                    self._mouseDown = !self._mouseDown;

                    self._parent.setMouseEventHandler('node');

                    self._control._isResizeDragging = true;

                    self._control.mousedown(e, self);
                };

                /**
                 * Fired with the mouseup event 
                 * @param  {Event} e    The mouseup event.
                 * @param  {ResizeHandle} self
                 */
                self.mouseup = function (e) {

                    self._control._isResizeDragging = false;

                    self.click(e, self);
                };

                // setup the inheritance chain
                ResizeHandle.prototype = Handle.prototype;
                ResizeHandle.prototype.constructor = Handle;
            }
        }
        catch (e) {
            alert('ResizeHandle ctor' + e.message);
        }
    });