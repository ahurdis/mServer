/**
 * VertexControl.js
 * @author Andrew
 */

define(['javascripts/source/accordion/AccordionManager',
    'javascripts/source/control/Connector',
    'javascripts/source/control/ControlBase'],
    function (AccordionManager, Connector, ControlBase) {
        'use strict';
        try {
            return function VertexControl(options) {
                var self = this;

                // call parent constructor
                ControlBase.call(self, options);

                options = options ? options : {};



                // the vertex for which this EntityControl is the shape
                self._vertex = options.vertex || {};
                // the name of this entity control
                self._instance = self._vertex.instance;
                // the radius of the rounded rectangles corders
                self._borderRadius = options.borderRadius || 10;
                // the color of the entity control's border
                self._borderColor = options.borderColor || '#3974B1';
                // the color of the hashed selection border 
                self._selectionColor = options.selectionColor || '#b3d4fd';
                // the width of the selection border stroke
                self._selectionWidth = options.selectionWidth || 3;

                self._onclick = options.onclick || function () { };

                // the distance of the border from the control
                self._dashPadding = 10;

                // are we drawing a connector
                var _isDrawingConnector = false;

                self._handleConnector = false;

                // the candidate end point on the target control for a new connector
                var _endConnectorPoint = null;
                // 
                var _selectedControl = null;
                // 
                var _edgeHitPos = null;
                // the position of the mouse
                var mouseX, mouseY;
                // is this control being dragged?
                var _isDragging = false;
                // measure the amound of difference between the mouse and current position
                var _dragDeltaX, _dragDeltaY;
                // the animation timer, used to request an animation frame
                var _animationTimer;
                // the target position for the drag, clamped to be within bounds
                var _targetX, _targetY;
                // the amount of 'friction' that the control shows when dragging
                var _easeAmount = 0.5;
                // the minimum x position this control can be moved to
                var _minDragX = self._dashPadding;
                // the maximum x position this control can be moved to
                var _maxDragX = self._canvas.width - self._width - self._dashPadding;
                // the minimum y position this control can be moved to
                var _minDragY = self._dashPadding;
                // the maximum y position this control can be moved to
                var _maxDragY = self._canvas.height - self._height - self._dashPadding;
                // the bounding rect of the canvas to help with getting mouse position
                var _boundingClientRect = self._canvas.getBoundingClientRect();
                // the object form for this object
                // TODO: remove this
                self.objectFormDialog = null;
                // is this control selected?
                self._isSelected = false;
                // the array of Handle objects that this control
                self._handles = [];
                // the entities properties that are selected
                self._selectedProperties = [];

                /**
                * Creates the control - called by the EntityControl ctor
                * @return {EntityControl} The EntityControl created
                */
                self.create = function () {

                    self.setMouseEventHandler();

                    self.setControlSize();

                    return self;
                };

                self.setControlSize = function () {

                    // the minimum width for the control during a resize 
                    self._minWidth = options.minWidth || 70;
                    // the minimum height for the control during a resize 
                    self._minHeight = options.minHeight || 70;
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
                    return null;
                };

                /**
                 * Returns the value at a given mouse position in the control
                 * based on where the user clicks.
                 * @param  {Event}       e    The click event.
                 * @return {string}     The value at that moues click, or null
                 */
                self.getConnectorPointAlignedToEntityProperty = function (e) {
                    return null;
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

                    /*
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

                        self._render();
                    }
                    */

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
                 * Get/set the vertex.
                 * @param  {GraphData} The vertex
                 * @return {Mixed}      Get: the connector or Set: the current font size.
                 */
                self.vertex = function (data) {
                    if (typeof data !== 'undefined') {
                        self._vertex = data;
                        return self;
                    } else {
                        return self._vertex;
                    }
                };

                /**
                 * The mouse move handler for working with nodes 
                 * @param {Event} e    The mousemove event.
                 * @return {Object} The current Point and if the control is bring dragged
                 */
                self.handleNodeMouseMove = function (e) {

                    if (_isDragging) {

                        mouseX = (e.clientX - _boundingClientRect.left) * (self._canvas.width / _boundingClientRect.width);
                        mouseY = (e.clientY - _boundingClientRect.top) * (self._canvas.height / _boundingClientRect.height);

                        /* Snap to Grid (perhaps some other time)
                        var grid = 30;
                        mouseX = Math.round(mouseX / grid) * grid;
                        mouseY = Math.round(mouseY / grid) * grid;
                        */

                        //clamp x and y positions to prevent object from dragging outside of canvas
                        var posX = mouseX - _dragDeltaX;
                        posX = (posX < _minDragX) ? _minDragX : ((posX > _maxDragX) ? _maxDragX : posX);
                        var posY = mouseY - _dragDeltaY;
                        posY = (posY < _minDragY) ? _minDragY : ((posY > _maxDragY) ? _maxDragY : posY);

                        _targetX = posX;
                        _targetY = posY;

                        self._x = self._x + _easeAmount * (_targetX - self._x);
                        self._y = self._y + _easeAmount * (_targetY - self._y);

                        // now update the handle positions
                        for (var iHandle = self._handles.length - 1; iHandle >= 0; iHandle--) {
                            self._handles[iHandle]._x += (_targetX - self._x);
                            self._handles[iHandle]._y += (_targetY - self._y);
                        }
                    }

                    return { x: (_targetX - self._x), y: (_targetY - self._y), dragging: _isDragging };
                };

                /**
                 * Gets the point along the edge that is a potential endpoint connector 
                 * @param  {EntityControl} control    The control being connected to
                 * @param  {Point} mouse    The current mouse position
                 * @return {Point} A potential connector point on the target control
                 */
                var getConnectorPoint = function (control, point, mouse) {
                    //  The area around/in the rectangle is defined in terms of
                    //  several regions:
                    //
                    //  O--x
                    //  |
                    //  y
                    //
                    //        I   |    II    |  III
                    //      ======+==========+======   --yMin
                    //       VIII |  IX (in) |  IV
                    //      ======+==========+======   --yMax
                    //       VII  |    VI    |   V
                    //

                    var ctrlLeft = control.x();
                    var ctrlTop = control.y();
                    var ctrlRight = ctrlLeft + control.width();
                    var ctrlBottom = ctrlTop + control.height();


                    var y;
                    
                    if (control._textCellSize) { 
                        y = control._textCellSize * Math.floor(mouse.y / control._textCellSize) + (control._textCellSize / 2);
                    } else {
                        y = control.y() + control.height() / 2;
                    }


                    if (Math.abs(ctrlLeft - mouse.x) < Math.abs(ctrlRight - mouse.x)) {
                        /*
                        // we are closest to the left hand side) { // Region I, VIII, or VII
                        if (point.y < ctrlTop) { // I
                            return { x: ctrlLeft, y: ctrlTop };
                        }
                        else if (point.y > ctrlBottom) { // VII
                            return { x: ctrlLeft, y: ctrlBottom };
                        }
                        else { // VIII
                            return { x: ctrlLeft, y: mouse.y };
                        }
                        */
                        return { x: ctrlLeft, y: y };
                    }
                    else { // Region III, IV, or V
                        /*
                        if (point.y < ctrlTop) { // III
                            return { x: ctrlRight, y: ctrlTop };
                        }
                        else if (point.y > ctrlBottom) { // V
                            return { x: ctrlRight, y: ctrlBottom };
                        }
                        else { // IV
                            return { x: ctrlRight, y: mouse.y };
                        }
                        */
                        return { x: ctrlRight, y: y };
                    }
                };

                /**
                 * The mouse move handler for drawing connectors 
                 * @param  {Event} e    The mousemove event.
                 */
                self.handleConnectorMouseMove = function (e) {

                    var mouse = self._parent.mousePos(e);

                    if (_isDrawingConnector || self._handleConnector) {

                        // get the control(s) at the mouse
                        var controls = self._parent.getControlsAtPoint(mouse.x, mouse.y);

                        // if we've crossed into an EntityControl, _edgeHitPos has a value 
                        if (controls.length > 0 && (self._handleConnector || _edgeHitPos)) {

                            // pick the first control
                            var control = controls[0];

                            _endConnectorPoint = getConnectorPoint(control, _edgeHitPos, mouse);

                            self._ctx.beginPath();
                            // self._ctx.strokeStyle = '#AAAAAA';
                            self._ctx.arc(_endConnectorPoint.x, _endConnectorPoint.y, 5, 0, 2 * Math.PI);
                            self._ctx.stroke();
                            self._ctx.closePath();
                        }

                        self._ctx.strokeStyle = '#AAAAAA';
                        self._ctx.beginPath();
                        self._ctx.moveTo(self._x + self._width, self._y + self._height / 2);

                        self._ctx.bezierCurveTo(self._x + self._width + 30, self._y + self._height / 2,
                            mouse.x - 30, mouse.y,
                            mouse.x, mouse.y);

                        _selectedControl = self;

                        self._ctx.stroke();
                    }
                };

                /**
                 * The mouse up handler for drawing connectors 
                 * @param  {Event} e    The mouseup event.
                 */
                self.handleConnectorMouseUp = function (e) {

                    var mouse = self._parent.mousePos(e);

                    _isDrawingConnector = false;

                    if (_endConnectorPoint && _selectedControl) {

                        var controls = self._parent.getControlsAtPoint(mouse.x, mouse.y);

                        controls.forEach(function (targetControl) {

                            // get the name of the edge
                            var argumentName = targetControl.getEntityPropertyAtMouse(e) || _selectedControl._vertex.outboundType;
                            var connectorPointY = targetControl.getConnectorPointAlignedToEntityProperty(e) || _endConnectorPoint.y;

                            var filterProperties = null;

                            var arTODO = ['FunctionControl', 'FormControl'];

                            // TODO: this is a hack, and will need to be generalized
                            // once type flows are more clearly comprehended
                            if (!arTODO.includes(_selectedControl._vertex.type)) {
                                filterProperties = _selectedControl._selectedProperties;
                            }

                            var edge = self._parent.graph().addEdge(_selectedControl._vertex,
                                targetControl._vertex,
                                {
                                    argumentName: argumentName,
                                    filterProperties: filterProperties,
                                    type: 'DataFlow'
                                });

                            edge.shape = new Connector({
                                sourceControl: _selectedControl,
                                targetControl: targetControl,
                                startX: _selectedControl.x() + _selectedControl.width(),
                                startY: _selectedControl.y() + _selectedControl.height() / 2, 
                                endX: _endConnectorPoint.x,
                                endY: connectorPointY,
                                edge: edge
                            });

                            if (targetControl._vertex.type === 'SplitterControl') {
                                targetControl._values = _selectedControl._selectedProperties;
/*
                                if (_selectedControl._vertex.type === 'FunctionControl') {

                                } else {
                                }
*/
                            }

                        });
                    }

                    self._parent.render();

                    self.click(e, self);
                };

                /**
                 * The mouse up handler for working with nodes 
                 * @param  {Event} e    The mouseup event.
                 */
                self.handleNodeMouseUp = function (e) {

                    self.click(e, self);

                    if (!self._isSelected) {
                        self._isSelected = true;
                    }

                    // app.showObjectProperties(self._vertex);

                    if (self._isSelected) {
                        // save the control in the app as the selected control
                        app.selectedControl = self;

                        // updated the object properties pane
                        app.am.updateAccordion(self);

                        app.updateMenu(self);
                    }

                    if (_isDragging || _isDrawingConnector) {
                        _isDragging = false;
                        _isDrawingConnector = false;
                    }
                };

                /**
                 * Set event handlers 
                 * @param   {String} action    The current mouse action, either "node" or "edge"
                 */
                self.setMouseEventHandler = function () {

                    if (self._parent.getMouseEventHandler() === 'node') {
                        self.mousemove = self.handleNodeMouseMove;
                        self.mouseup = self.handleNodeMouseUp;
                    }
                    else {
                        self.mousemove = self.handleConnectorMouseMove;
                        self.mouseup = self.handleConnectorMouseUp;
                    }
                };

                /**
                 * Fired with the keydown event 
                 * @param  {Event} e    The keydown event.
                 */
                self.keydown = function (e) {

                    if (self._isSelected) {
                        // alert(self._vertex.id);
                    }
                };

                /**
                 * Checks if a coordinate point is over the control.
                 * @param  {Number} x x-coordinate position.
                 * @param  {Number} y y-coordinate position.
                 * @return {Boolean}   True if it is over the control
                 */


                self.mouseOverDragRegion = function (x, y) {
                    var xLeft = x >= self._x,
                        xRight = x <= self._x + self._width,
                        yTop = y >= self._y,
                        yBottom = y <= self._y + 2 * self._fontSize;

                    return xLeft && xRight && yTop && yBottom;
                };

                /**
                 * Fired with the mousedown event 
                 * @param  {Event} e    The mousedown event.
                 */
                self.mousedown = function (e) {

                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y,
                        isOver = self.mouseOverControl(x, y),
                        isOverDragRegion = self.mouseOverDragRegion(x, y);

                    // setup the 'click' event
                    self._mouseDown = isOver;

                    // are we drawing an edge
                    if (self._parent.getMouseEventHandler() === 'edge') {
                        _isDrawingConnector = true;
                        _selectedControl = self;
                    }
                    else {

                        _dragDeltaX = x - self._x;
                        _dragDeltaY = y - self._y;

                        _isDragging = isOverDragRegion;

                        if (_isDragging) {
                            // reset these in case the width or height has changed 
                            _maxDragX = self._canvas.width - self._width;
                            _maxDragY = self._canvas.height - self._height;
                            // update the bounding rect to get mouse position correctly
                            _boundingClientRect = self._canvas.getBoundingClientRect();
                        }
                    }

                    if (_isDragging || _isDrawingConnector) {
                        //start timer
                        _animationTimer = setInterval(onMouseTimer, 60);
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

                        return self.focus();
                    }
                };

                var onMouseTimer = function () {

                    //stop the timer when the target position is reached (close enough)
                    if ((!_isDragging) && (Math.abs(self._x - _targetX) < 0.1) && (Math.abs(self._y - _targetY) < 0.1)) {
                        self._x = _targetX;
                        self._y = _targetY;

                        //stop timer:
                        clearInterval(_animationTimer);
                    }

                    window.requestAnimationFrame(self._parent.render);
                };

                self.render = function (ctx, mouseDownPos) {

                    if (self._isSelected) {

                        ctx.save();

                        ctx.strokeStyle = self._selectionColor;
                        ctx.lineWidth = self._selectionWidth;

                        ctx.setLineDash([5, 15]);

                        self._roundedRect(ctx,
                            self._x - self._dashPadding,
                            self._y - self._dashPadding,
                            self._width + 2 * self._dashPadding,
                            self._height + 2 * self._dashPadding,
                            self._borderRadius);

                        ctx.stroke();

                        ctx.restore();
                    }

                    ctx.save();

                    ctx.strokeStyle = self._borderColor;

                    ctx.beginPath();

                    self._roundedRect(ctx,
                        self._x,
                        self._y,
                        self._width,
                        self._height,
                        self._borderRadius);

                    ctx.stroke();

                    ctx.closePath();

                    _edgeHitPos = mouseDownPos;
                    // detect if we have selected a path
                    if (mouseDownPos && ctx.isPointInStroke(mouseDownPos.x, mouseDownPos.y)) {
                        _edgeHitPos = mouseDownPos;
                    } else {
                        // _edgeHitPos = null;
                    }

                    ctx.restore();
                };

                self.create();

                // setup the inheritance chain
                VertexControl.prototype = ControlBase.prototype;
                VertexControl.prototype.constructor = ControlBase;
            };
        }
        catch (e) {
            alert('VertexControl ctor' + e.message);
        }
    });