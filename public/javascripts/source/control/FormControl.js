// JavaScript source code

/**
 * Form.js
 * @author Andrew
 */

define(['javascripts/source/control/core/Button',
    'javascripts/source/control/core/CheckBox',
    'javascripts/source/control/core/DropDown',
    'javascripts/source/control/core/EditBox',
    'javascripts/source/control/core/Label',
    'javascripts/source/control/core/RadioButton',
    'javascripts/source/control/VertexControl'],
    function (Button, CheckBox, DropDown, EditBox, Label, RadioButton, VertexControl) {
        'use strict';
        try {
            return function FormControl(options) {

                var self = this;
                // call parent constructor
                VertexControl.call(self, options);
                // the options passed into the ctor
                options = options ? options : {};

                self._controls = [];

                self._data = options.data;

                var _autoLayout = options.autoLayout || true;

                var _paddingX = 30;
                var _paddingY = 30;

                var _nextX = self._x + _paddingX;
                var _nextY = self._y + _paddingY;

                var _minWidth = 2 * _paddingX;
                var _minHeight = 2 * _paddingY;

                var _controlPaddingY = 30;

                var _parentRender = self.render;
                var _parentHandleNodeMouseMove = self.handleNodeMouseMove;
                var _parentMouseDown = self.mousedown;

                self.create = function () {

                    self.setMouseEventHandler();

                    /*
                    self.addLabel({
                        canvas: self._canvas,
                        form: self,
                        id: 'ID_NAME_LABEL',
                        fontSize: 10,
                        fontFamily: 'Verdana',
                        fontColor: '#FFFFFF',
                        value: 'Name:'
                    });
                    */

                    self.addEditBox({
                        canvas: self._canvas,
                        form: self,
                        id: 'ID_NAME_EDIT',
                        fontSize: 12,
                        fontFamily: 'Verdana',
                        fontColor: '#212121',
                        fontWeight: 'bold',
                        width: 120,
                        placeHolderText: 'Enter value.',
                        onblur: function (parent) {
                            if (typeof self._vertex.value === 'undefined') {
                                self._vertex.insertProperty('value', self.onsubmit());
                            } else {
                                self._vertex.value = self.onsubmit();
                            }
                        }
                    });

                    self.addButton({
                        canvas: self._canvas,
                        form: self,
                        id: 'ID_BUTTON',
                        fontSize: 12,
                        fontFamily: 'Verdana',
                        fontColor: '#212121',
                        fontWeight: 'bold',
                        width: 80,
                        height: 40
                    });

                    self.addCheckBox({
                        canvas: self._canvas,
                        form: self,
                        id: 'ID_CHECKBOX',
                        label: 'Greenish',
                        fontSize: 14,
                        fontStyle: 'oblique',
                        fontFamily: 'Verdana',
                        fontColor: '#22FF22',
                        textPadding: 2,
                        boxSize: 18
                    });

                    self.addLabel({
                        canvas: self._canvas,
                        form: self,
                        id: 'ID_NAME_LABEL',
                        fontSize: 14,
                        fontFamily: 'Verdana',
                        fontColor: '#FFFFFF',
                        value: 'Some Label Text'
                    });

                    self.addDropDown({
                        canvas: self._canvas,
                        form: self,
                        id: 'ID_DROPDOWN',
                        fontSize: 12,
                        fontFamily: 'Verdana',
                        fontColor: '#FFFFFF',
                        fontWeight: 'bold',
                        value: 'DropDown'
                    });

                    // set the width and height of the control
                    self.height(_minHeight);

                    self.width(_minWidth);

                    if (typeof (self._vertex.value) !== 'undefined') {
                        self.update(self._vertex.value);
                    }
                };

                /**
                 * The mouse move handler for working with nodes 
                 * @param {Event} e    The mousemove event.
                 * @return {Object} The current Point and if the control is bring dragged
                 */
                self.handleNodeMouseMove = function (e) {

                    var ret = _parentHandleNodeMouseMove(e);
                    // { x: (_targetX - self._x), y: (_targetY - self._y), dragging: _isDragging }

                    if (ret.dragging) {
                        for (var iControl = self._controls.length - 1; iControl >= 0; iControl--) {
                            self._controls[iControl]._x += ret.x;
                            self._controls[iControl]._y += ret.y;
                        }
                    }

                    self._controls.forEach(function (control) {
                        control.mousemove(e, self);
                    }, this);

                    return ret;
                };

                /**
                 * Updates the position of the control baesd on the next available Form position
                 * @param  {Object} options The options for the VertexControl.
                 * @return {Object} The VertexControl options with an updated position
                 */
                var getNextPosition = function (options) {

                    if (_autoLayout === true) {
                        options.x = _nextX;
                        options.y = _nextY;
                    }

                    return options;
                };

                /**
                 * Adds an Control to the FormControl
                 * @param  {Object} options The constructor options for the EditBox.
                 * @param  {Function} fn The function that will call the actual controls constructor
                 * @return {VertexControl} The control that has been added
                 */
                var addControl = function (options, fn) {

                    getNextPosition(options);

                    var control = fn(options);

                    if (control !== null) {

                        self._controls.push(control);

                        if (typeof control.value !== 'undefined' && typeof self._data !== 'undefined') {
                            control.value(self._data[control.id()]);
                        }
                    }

                    // determine the next position to add the control
                    _nextY += control.height() + _controlPaddingY;

                    // determine the extent of the form control based on the child layout
                    if (_minWidth < 2 * _paddingX + control.width()) {
                        _minWidth = 2 * _paddingX + control.width();
                    }

                    _minHeight = _nextY - self._y + _controlPaddingY;

                    return control;
                };

                /**
                 * Adds a Button to the FormControl
                 * @param  {Object} options The constructor options for the Button.
                 * @return {Button} The Button that has been created.
                 */
                self.addButton = function (options) {
                    return addControl(options, function (options) { return new Button(options); });
                };

                /**
                 * Adds a CheckBox to the FormControl
                 * @param  {Object} options The constructor options for the Button.
                 * @return {CheckBox} The CheckBox that has been created.
                 */
                self.addCheckBox = function (options) {
                    return addControl(options, function (options) { return new CheckBox(options); });
                };

                /**
                 * Adds an DropDown to the FormControl
                 * @param  {Object} options The constructor options for the EditBox.
                 * @return {DropDown} The DropDown that has been created.
                 */
                self.addDropDown = function (options) {
                    return addControl(options, function (options) { return new DropDown(options); });
                };

                /**
                 * Adds an EditBox to the FormControl
                 * @param  {Object} options The constructor options for the EditBox.
                 * @return {EditBox} The EditBox that has been created.
                 */
                self.addEditBox = function (options) {
                    return addControl(options, function (options) { return new EditBox(options); });
                };

                /**
                 * Adds a Label to the FormControl
                 * @param  {Object} options The constructor options for the Label.
                 * @return {Label} The Label that has been created.
                 */
                self.addLabel = function (options) {
                    return addControl(options, function (options) { return new Label(options); });
                };

                /**
                 * Adds a RadioButton to the FormControl
                 * @param  {Object} options The constructor options for the Label.
                 * @return {RadioButton} The Label that has been created.
                 */
                self.addRadioButton = function (options) {
                    return addControl(options, function (options) { return new RadioButton(options); });
                };

                /**
                 * Adds a submit button to the FormControl, linking it to the FormControl's onsubmit function
                 * @param  {Object} options The constructor options for the Button.
                 * @return {Button} The submit Button.
                 */
                self.addSubmitButton = function (options) {
                    options.onsubmit = self.onsubmit;
                    return addControl(options, function (options) { return new Button(options); });
                };

                /**
                 * Removes the focus from all of the the FormControl's controls
                 */
                self.removeFocus = function () {
                    for (var i = 0; i < self._controls.length; i++) {
                        if (self._controls[i].hasFocus()) {
                            self._controls[i].blur();
                        }
                    }
                };

                /**
                 * Moves the focus "up" the form
                 * @param  {control} VertexControl The VertexControl that has the focus
                 * @return {ControlBase} The ControlBase object that now has the focus.
                 */
                self.rewindFocus = function (control) {
                    return moveFocus(control, -1);
                };

                /**
                * Moves the focus "down" the form
                * @param  {control} ControlBase The ControlBase that has the focus
                * @return {ControlBase} The ControlBase object that now has the focus.
                */
                self.advanceFocus = function (control) {
                    moveFocus(control, 1);
                };

                /**
                * Moves the focus up or down the form
                * @param  {ControlBase} control The ControlBase that has the focus
                * @param  {number} control The ControlBase that has the focus
                * @return {ControlBase} The ControlBase object that now has the focus.
                */
                var moveFocus = function (control, direction) {

                    var next = 0;

                    if (self._controls.length > 1) {
                        var inputIndex = self._controls.indexOf(control);


                        if (self._controls[inputIndex + direction]) {
                            next = inputIndex + direction;
                        }
                        else {
                            if (inputIndex + direction < 0) {
                                next = self._controls.length - 1;
                            }
                        }
                        control.blur();
                        setTimeout(function () {
                            self._controls[next].focus();
                        }, 10);
                    }
                    return self._controls[next];
                };

                /**
                * Gets the control by its id
                * @param  {number} id The ControlBase.id() that has the focus
                * @return {ControlBase} The ControlBase object with that id, or null
                */
                var getControlById = function (id) {
                    for (var i = 0; i < self._controls.length; i++) {
                        var control = self._controls[i];

                        if (control.id() === id)
                            return control;
                    }
                    return null;
                };

                /**
                 * Fired with the mousedown event
                 * @param  {Event} e    The mousedown event.
                 * @param  {ControlBase} self
                 */


                self.mousedown = function (e, parent) {
                    var mouse = self._mousePos(e),
                        x = mouse.x,
                        y = mouse.y,
                        isOver = self.mouseOverControl(x, y);



                    self._controls.forEach(function (control) {
                        control.mousedown(e, self);
                    }, this);

                    _parentMouseDown(e);
                };


                self.mouseup = function (e, parent) {
                    var mouse = self._mousePos(e),
                        x = mouse.x,
                        y = mouse.y;

                    self._controls.forEach(function (control) {
                        control.mouseup(e, self);
                    }, this);
                };


                self.click = function (e, parent) {
                    var mouse = self._mousePos(e),
                        x = mouse.x,
                        y = mouse.y;

                    self._controls.forEach(function (control) {
                        control.click(e, self);
                    }, this);
                };



                /**
                 * Called to submit the form and retreive an object with its values
                 * @return {Object} An object that contains the id/value pairs of the Form's controls for those with a value
                 */
                self.onsubmit = function () {
                    var objRet = {};

                    for (var i = 0; i < self._controls.length; i++) {
                        var control = self._controls[i];

                        if (typeof control.value !== 'undefined') {
                            objRet[control.id()] = control.value();
                        }
                    }

                    return objRet;
                };

                /**
                 * Called to submit the form and retreive an object with its values
                 * @return {Object} An object that contains the id/value pairs of the Form's controls for those with a value
                 */
                self.render = function (ctx, mouseDownPos) {

                    _parentRender(ctx, mouseDownPos);

                    for (var i = 0; i < self._controls.length; i++) {
                        var control = self._controls[i];

                        if (typeof control !== 'undefined' && typeof ctx !== 'undefined') {
                            control.render(ctx);
                        }
                    }
                };

                /**
                * Updates the Form control values 
                * @param  {Object} data The object that maps the VertexControl.id() to it's value
                */
                self.update = function (data) {

                    self._data = data;

                    if (typeof self._data !== 'undefined') {

                        for (var element in self._data) {
                            var control = getControlById(element);

                            if (control !== null && typeof control.value !== 'undefined') {
                                control.value(self._data[element]);
                            }
                        }
                    }
                };

                self.create();

                // setup the inheritance chain
                FormControl.prototype = VertexControl.prototype;
                FormControl.prototype.constructor = VertexControl;
            };
        }
        catch (e) {
            alert('Form ctor' + e.message);
        }
    });
