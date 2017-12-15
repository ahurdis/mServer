// JavaScript source code

/**
 * EntityControl.js
 * @author Andrew
 */
define(['javascripts/source/control/VertexControl'],
    function (VertexControl) {
        'use strict';
        try {
            return function EntityControl(options) {

                var self = this;
                // call parent constructor
                VertexControl.call(self, options);
                // the options passed into the ctor
                options = options ? options : {};

                // the padding of the text 
                self._textPadding = 10;
                // the vertical size for the list of this controls display keys 
                self._textCellSize = self._fontSize + self._textPadding;

                // Save the parent's toJSON and render functions before we redefine them so we can call up the chain
                var _parentToJSON = self.toJSON;
                var _parentRender = self.render;

                /**
                 * Determine the width of the control based on the max text length.
                 * Used to determine the appropriate width of the control.
                 * @return {int} The width of the maximum text
                 */
                var getWidthFromDisplayKeys = function () {

                    var ret = 0;

                    if (self._values) {

                        self._values.forEach(function (value) {
                            var textWidth = self._ctx.measureText(value).width;

                            if (textWidth > ret) {
                                ret = textWidth;
                            }
                        });

                    }
                    return ret;
                };


                self.setControlSize = function () {

                    // the minimum width for the control during a resize 
                    self._minWidth = getWidthFromDisplayKeys() + 6 * self._textPadding;
                    // the minimum height for the control during a resize 
                    self._minHeight = self._textCellSize * (self._values.length + 2);
                    // the width of the control
                    self._width = options.width || self._minWidth;
                    // the height of the control
                    self._height = options.height || self._minHeight + 20;
                };

                /**
                 * Returns the value at a given mouse position in the control
                 * based on where the user clicks.
                 * @param  {Event}       e    The click event.
                 * @return {string}     The value at that moues click, or null
                 */
                self.getEntityPropertyAtMouse = function (e) {
                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y;

                    var iValue = Math.floor((y - self._y) / self._textCellSize);

                    if (iValue >= 1 && iValue <= self._values.length) {
                        return self._values[iValue - 1];
                    }
                    else {
                        return null;
                    }
                };

                /**
                 * Returns the value at a given mouse position in the control
                 * based on where the user clicks.
                 * @param  {Event}       e    The click event.
                 */
                self.getConnectorPointAlignedToEntityProperty = function (e) {
                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y;

                    var iValue = Math.floor((y - self._y) / self._textCellSize);

                    return self._y + ((iValue + 1) * self._textCellSize);
                };

                self.render = function (ctx, mouseDownPos) {

                    _parentRender(ctx, mouseDownPos);

                    ctx.save();

                    // draw the instance
                    ctx.fillStyle = self._fontColor;

                    // draw the name of the control
                    ctx.fillStyle = self._fontColor;
                    ctx.font = self._fontStyle + ' ' + self._fontWeight + ' ' + 2 * self._fontSize + 'px ' + self._fontFamily;
                    ctx.fillText(self._instance,
                        self._x + ((self._width - ctx.measureText(self._instance).width) / 2),
                        self._y + self._textCellSize);

                    // draw a line under the name to delineate the drag region
                    ctx.strokeStyle = self._borderColor;
                    ctx.beginPath();
                    ctx.moveTo(self._x, self._y + 2 * self._fontSize);
                    ctx.lineTo(self._x + self._width, self._y + 2 * self._fontSize);
                    ctx.stroke();
                    ctx.closePath();

                    // draw out each of the properties for the entity
                    for (var i = 0; i < self._values.length; i++) {
                        if (self._selectedProperties.includes(self._values[i])) {
                            ctx.font = self._fontStyle + ' ' + 'bold' + ' ' + self._fontSize + 'px ' + self._fontFamily;
                        } else {
                            ctx.font = self._fontStyle + ' ' + self._fontWeight + ' ' + self._fontSize + 'px ' + self._fontFamily;
                        }

                        ctx.fillText(self._values[i],
                            self._x + self._textPadding,
                            self._y + (i + 2) * self._textCellSize);
                    }

                    ctx.restore();
                };

                /**
                 * Fired with the click event on the canvas, and puts focus on/off
                 * based on where the user clicks.
                 * @param  {Event}       e    The click event.
                 * @param  {EntityControl} self
                 * @return {EntityControl}
                 */
                self.click = function (e) {
                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y;


                    var entityProperty = self.getEntityPropertyAtMouse(e);

                    if (entityProperty) {

                        // if the shift key is down, we're doing a multi-select
                        // else we are just adding this property
                        if (!e.shiftKey) {
                            self._selectedProperties = [];
                        }

                        if (!self._selectedProperties.includes(entityProperty)) {
                            self._selectedProperties.push(entityProperty);
                        }

                        // self.render();
                    }


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
                 * Fired with the double click event
                 * @param  {Event} e    The mouseup event.
                 */
                self.dblclick = function (e) {

                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y;

                    if (self.mouseOverControl(x, y)) {
                        // openDialog();
                        return self.focus();
                    }
                };

                var openDialog = function () {
                    require(["javascripts/source/utility/ObjectForm"],
                        function (ObjectForm) {
                            try {
                                var options = {};
                                options.vertex = self._vertex;

                                options.table = document.getElementById('myTable');
                                options.onClose = function () {
                                    self._values = self._vertex.displayKeys;
                                };

                                self.objectFormDialog = new ObjectForm(options);
                                self.objectFormDialog.create();
                            }
                            catch (e) {
                                alert("EntityControl: openDialog " + e.name + " " + e.message);
                            }
                        });
                };

                self.toJSON = function () {

                    var child = {
                        borderRadius: self._borderRadius,
                        //     borderColor : self._borderColor,
                        //     selectionColor : self._selectionColor,
                        selectionWidth: self._selectionWidth
                    };

                    // now call the base class
                    var parent = _parentToJSON();

                    // merge the parent with the child
                    Object.keys(parent).forEach(function (key) { child[key] = parent[key]; });

                    return child;
                };

                self.create = function () {
                    // get the keys to display, passing in the vertex's keys to exclude
                    self._values = self._vertex.displayKeys || [];

                    self.setControlSize();
                };

                self.create();

                // setup the inheritance chain
                EntityControl.prototype = VertexControl.prototype;
                EntityControl.prototype.constructor = VertexControl;
            };
        }
        catch (e) {
            alert('EntityControl ctor' + e.message);
        }
    });


