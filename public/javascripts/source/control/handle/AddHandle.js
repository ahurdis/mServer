define(['javascripts/source/control/handle/Handle',
        'javascripts/source/canvas/Icon'],
    function (Handle, Icon) {
        'use strict';
        try {
            return function AddHandle(options) {

                var self = this;

                // call parent constructor
                Handle.call(self, options);

                options = options ? options : {};

                self._iconRenderer = options.iconRenderer || Icon.drawAdd;
                
                self._x = self._control.x() + self._control.width(); //+ self._xOffset;
                self._y = self._control.y() - self._yOffset;;
                
                var _createdControl = null;

                /**
                 * Fired with the click event on the canvas, and puts focus on/off
                 * based on where the user clicks.
                 * @param  {Event}       e    The click event.
                 * @param  {AddHandle} self
                 * @return {AddHandle}
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
                 * @param  {AddHandle} self
                 * @return {AddHandle}
                 */
                self.mousemove = function (e) {
                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y,
                        isOver = self.mouseOverControl(x, y);

                    _createdControl.mousemove(e);
                };

                /**
                 * Fired with the mousedown event to start a selection drag.
                 * @param  {Event} e    The mousedown event.
                 * @param  {AddHandle} self
                 */
                self.mousedown = function (e) {
                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y,
                        isOver = self.mouseOverControl(x, y);

                    self._mouseDown = !self._mouseDown;

                    var options = {
                        instance : 'New',
                        type : self._control._vertex.type
                    };
                    
                    // now do what add handles are built to do
                    _createdControl = self._parent.addNewControl(e, options);
                    
                   // control.mousedown(e);
                };

                /**
                 * Fired with the mouseup event 
                 * @param  {Event} e    The mouseup event.
                 * @param  {AddHandle} self
                 */
                self.mouseup = function (e) {
                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y;

                    self.click(e, self);
                };

                // setup the inheritance chain
                AddHandle.prototype = Handle.prototype;
                AddHandle.prototype.constructor = Handle;
            }
        }
        catch (e) {
            alert('AddHandle ctor' + e.message);
        }
    });