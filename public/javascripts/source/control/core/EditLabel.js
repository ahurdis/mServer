'use strict';


define(['source/control/ControlBase', 'source/control/EditBox', 'source/control/Label'], function (ControlBase, EditBox, Label) {
    try {
        return function EditLabel(options) {
            var self = this;

            // call parent constructor
            ControlBase.call(self, options);

            options = options ? options : {};

            self._width = options.width || 150;
            self._height = options.height || 200;
            self._borderRadius = options.borderRadius || 4;
            self._value = options.value;


            var isEditing = false;
            var activeControl = new Label(options);

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
             * @param  {EditLabel} self
             * @return {EditLabel}
             */
            self.click = function (e, self) {
                var mouse = self._mousePos(e),
                              x = mouse.x,
                              y = mouse.y;

                if (self._canvas && self.mouseOverControl(x, y)) {
                    if (self._mouseDown) {


                        self._mouseDown = false;

                        isEditing = !isEditing;



                        if (isEditing) {
                            options.value = activeControl.value();
                            options.width = activeControl.width();
                            activeControl = new EditBox(options);
                            activeControl.render();

                        }
                        else {
               /*             options.value = activeControl.value();
                            options.width = activeControl.width();
                            activeControl = new Label(options);
                            activeControl.render();
                            */
                        }

                    //    setTimeout(function () { }, 50);

                        // call the user defined onclick
                   //     self._onclick();

                    //    return self.focus();
                    }
                } else {
               //     return self.blur();
                }
            };

            /**
             * Fired with the mousemove event to update the default cursor.
             * @param  {Event}       e    The mousemove event.
             * @param  {EditLabel} self
             * @return {EditLabel}
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
             * @param  {EditLabel} self
             */
            self.mousedown = function (e, self) {
                var mouse = self._mousePos(e),
                  x = mouse.x,
                  y = mouse.y,
                  isOver = self.mouseOverControl(x, y);

                    self._mouseDown = isOver;
            };

            /**
             * Fired with the mouseup event 
             * @param  {Event} e    The mouseup event.
             * @param  {EditLabel} self
             */
            self.mouseup = function (e, self) {
                var mouse = self._mousePos(e),
                  x = mouse.x,
                  y = mouse.y;

                    self.click(e, self);


            };

           

            /**
             * Clears and redraws the EditLabel on an off-DOM canvas,
             * and if a main canvas is provided, draws it all onto that.
             * @return {EditLabel}
             */
            self.render = function () {
                var ctx = self._ctx;

         //       ctx.save();



                // clear the canvas
                ctx.clearRect(activeControl.x(), activeControl.y(),
                                activeControl.width(),
                                activeControl.height());

                            
                activeControl.render();

            //    ctx.restore();

                return self;
            };

            // draw the text box
            self.render();

            // setup the inheritance chain
            EditLabel.prototype = ControlBase.prototype;
            EditLabel.prototype.constructor = ControlBase;
        }
    }
    catch (e) {
        alert('EditLabel ctor' + e.message);
    }
});