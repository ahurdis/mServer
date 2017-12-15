define(['javascripts/source/control/handle/Handle',
    'javascripts/source/canvas/Icon'],
    function (Handle, Icon) {
        'use strict';
        try {
            return function ConnectorHandle(options) {

                var self = this;

                // call parent constructor
                Handle.call(self, options);

                options = options ? options : {};

                self._iconRenderer = options.iconRenderer || Icon.drawLink;

                self._x = self._control.x() + self._control.width();
                self._y = self._control.y() + self._control.height() / 3;

                /**
                 * Fired with the click event on the canvas, and puts focus on/off
                 * based on where the user clicks.
                 * @param  {Event}       e    The click event.
                 * @param  {ConnectorHandle} self
                 * @return {ConnectorHandle}
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
                 * @param  {ConnectorHandle} self
                 * @return {ConnectorHandle}
                 */
                self.mousemove = function (e) {
                                        
                    if (self._control._handleConnector === true) {
                        self._control.mousemove(e, self);
                    }
                };

                /**
                 * Fired with the mousedown event to start a selection drag.
                 * @param  {Event} e    The mousedown event.
                 * @param  {ConnectorHandle} self
                 */
                self.mousedown = function (e) {

                    self._mouseDown = !self._mouseDown;
                    
                    // now do what edge handles are built to do
                    self._parent.setMouseEventHandler('edge');

                    self._control._handleConnector = true;
               
                    self._control.mousedown(e, self);
                };

                /**
                 * Fired with the mouseup event 
                 * @param  {Event} e    The mouseup event.
                 * @param  {ConnectorHandle} self
                 */
                self.mouseup = function (e) {

                    self._control.handleConnectorMouseUp(e);

                    self._parent.setMouseEventHandler('node');
                    
                    self._control._handleConnector = false;
               
                    self.click(e, self);
                };

                // setup the inheritance chain
                ConnectorHandle.prototype = Handle.prototype;
                ConnectorHandle.prototype.constructor = Handle;
            }
        }
        catch (e) {
            alert('ConnectorHandle ctor' + e.message);
        }
    });