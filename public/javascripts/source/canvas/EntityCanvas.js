// JavaScript source code

/**
 * EntityCanvas.js
 * @author Andrew
 */

define(['javascripts/source/control/handle/AddHandle',
    'javascripts/source/canvas/CanvasBase',
    'javascripts/source/control/Connector',
    'javascripts/source/app/ControlLibrary',
    'javascripts/source/control/handle/DeleteHandle',
    'javascripts/source/control/handle/ConnectorHandle'],
    function (AddHandle, CanvasBase, Connector, ControlLibrary, DeleteHandle, ConnectorHandle) {
        'use strict';
        try {
            return function EntityCanvas(options) {
                var self = this;

                // call parent constructor
                CanvasBase.call(self, options);

                var _canvas = options.canvas || null;

                var _ctx = _canvas ? _canvas.getContext('2d') : null;

                var _userDocument = options.userDocument || null;

                // the graph that defines the Entity nodes and relationships
                var _graph = options.graph || null;

                // the list of EntityControls that this canvas is parent of
                var _controls = [];

                // the list of controls that mouse/touch events are applied to
                var _eventControls = [];

                // the active object to be drawn - node or edges
                var _mouseEventHandler = 'node';

                // store mouse down positions to use for edge and node pointInStroke/pointInPath hit testing
                var _mouseDownPos = null;

                // the array of handles that decorate a selected EntityContol
                var _handles = [];

                // store the active handle to manage the event lifecycle of the handle                 
                var _activeHandle = null;

                /**
                 * Creates the entity canvas.
                 */
                self.create = function () {

                    if (_canvas) {

                        // set up the event handlers for the canvas
                        _canvas.addEventListener('touchstart', function (event) {

                            var touch = event.touches[0];
                            if (touch) {
                                event.clientX = touch.pageX;
                                event.clientY = touch.pageY;
                                handleMouseDown(event);
                            }

                            event.preventDefault();

                        }, false);

                        _canvas.addEventListener('touchmove', function (event) {

                            var touch = event.touches[0];

                            if (touch) {
                                event.clientX = touch.pageX;
                                event.clientY = touch.pageY;
                                handleMouseMove(event);
                            }
                            event.preventDefault();

                        }, false);

                        _canvas.addEventListener('touchend', function (event) {

                            var touch = event.touches[0];
                            if (touch) {
                                event.clientX = touch.pageX;
                                event.clientY = touch.pageY;
                                handleMouseUp(event);
                            }
                            event.preventDefault();
                        }, false);


                        _canvas.addEventListener('mousedown', handleMouseDown, false);
                        _canvas.addEventListener('mousemove', handleMouseMove, false);
                        _canvas.addEventListener('mouseup', handleMouseUp, false);

                        // set the tabindex property so that canvas receives keyboard events
                        _canvas.setAttribute('tabindex', '0');
                        _canvas.addEventListener('keydown', handleKeyDown, false);

                        // get rid of any browser specific outlines/borders of the canvas
                        _canvas.style.outline = 'none';

                        // create the controls passed in through the constructor
                        createControls();

                        self.render();
                    }
                };

                var createControls = function () {

                    // for all of the vertices, create a EntityControl
                    var vertices = _graph.getVertices();

                    for (var i = 0; i < vertices.length; i++) {
                        createControl(vertices[i]);
                    }

                    // now loop through all the vertices again 
                    // and for all the edges, create a Connector
                    for (i = 0; i < vertices.length; i++) {
                        var edges = _graph.getEdges(vertices[i]);
                        for (var edge in edges) {
                            for (var iTarget = 0; iTarget < edges[edge].length; iTarget++) {
                                if (edges[edge][iTarget]) {

                                    delete edges[edge][iTarget].shape;

                                    createEdge(edges[edge][iTarget]);

                                }
                            }
                        }
                    }

                    self.render();
                };

                /**
                * Adds an EntityControl to the Canvas
                * @param  {Event} event The drag and drop event that create a new entity.
                * @param  {Object} options The options for the Vertex of the create a new entity.
                * @return {ControlBase} The EntityControl that has been created.
                */
                self.addNewControl = function (event, ctrlOptions) {

                    var control = null;

                    var mouse = self.mousePos(event);

                    // add on the mouse x and mouse y from the event
                    ctrlOptions.x = mouse.x;
                    ctrlOptions.y = mouse.y;

                    var vertex = _graph.addVertex(ctrlOptions);

                    control = createControl(vertex);

                    self.render();

                    return control;
                };

                /**
                 * Creates a control for a given vertex with a specified type
                 * @param  {Object} vertex A graph vertex with a specified type.
                 * @return {ControlBase} The EntityControl that has been created.
                 */
                var createControl = function (vertex) {

                    var ctrlOptions = vertex.getState();

                    ctrlOptions.canvas = _canvas;
                    ctrlOptions.parent = self;

                    var vertexOptions = null;

                    if (_userDocument !== null && typeof (Storage) !== 'undefined') {
                        vertexOptions = JSON.parse(localStorage.getItem(_userDocument.name + ' Graph Vertex ' + vertex.id));
                    }

                    if (vertexOptions !== null) {
                        // merge the vertex options with the base options
                        Object.keys(vertexOptions).forEach(function (key) { ctrlOptions[key] = vertexOptions[key]; });
                    } else {
                        // else add some default parameters
                        ctrlOptions.fontSize = 14;
                        ctrlOptions.fontFamily = 'Verdana, Geneva, sans-serif';
                        ctrlOptions.fontColor = '#EEEEEE';
                        ctrlOptions.textPadding = 2;
                    }

                    ctrlOptions.vertex = vertex;

                    var control = addNewControl(ctrlOptions);

                    if (control !== null) {
                        _graph.addVertexProperty(vertex, 'shape', control);
                    }

                    return control;
                };

                /**
                 * Adds an Control to the canvas
                 * @param  {Object} options The constructor options for the EditBox.
                 * @param  {Function} fn The function that will call the actual controls constructor
                 * @return {ControlBase} The control that has been added
                 */
                var addNewControl = function (ctrlOptions) {

                    var control = null;

                    try {
                        control = new app.lib[ctrlOptions.type].ctor(ctrlOptions);
                    } catch (e) {
                        console.dir(e);
                        alert('Control type ' + ctrlOptions.type + ' not in ControlLibrary');
                    }

                    if (control !== null) {

                        _controls.push(control);

                        /*
                        if (typeof control.value !== 'undefined' && typeof self._data !== 'undefined') {
                            control.value(self._data[control.id()]);
                        }
                        */

                        control._parent = self;
                    }

                    return control;
                };

                /**
                 * Creates a control for a given vertex with a specified type
                 * @param  {Object} vertex A graph vertex with a specified type.
                 * @return {ControlBase} The EntityControl that has been created.
                 */
                var createEdge = function (edge) {

                    var controlOptions = {}; // edge.getState();

                    var storedOptions = null;

                    if (_userDocument !== null && typeof (Storage) !== 'undefined') {
                        storedOptions = JSON.parse(localStorage.getItem(_userDocument.name + ' Graph Edge ' + edge.id));
                    }

                    var connector = null;
                    var source = null;
                    var target = null;

                    if (storedOptions !== null) {
                        // merge the vertex options with the base options
                        Object.keys(storedOptions).forEach(function (key) { controlOptions[key] = storedOptions[key]; });
                        source = getControlById(controlOptions.sourceControl);
                        target = getControlById(controlOptions.targetControl);
                    } else {
                        // else add some default parameters
                        source = getControlById(edge.sourceId);
                        target = getControlById(edge.targetId);
                        controlOptions.isSelected = false;
                    }

                    controlOptions.sourceControl = source;
                    controlOptions.targetControl = target;

/*
                    controlOptions._startX = _source.x() + _source.width();
                    controlOptions._startY = _source.y() + _source.height() / 2;
                    controlOptions._endX = _target.x();
                    controlOptions._endY = _target.y() + _target.height() / 2;
*/
                    controlOptions.type = 'DataFlow';
                    controlOptions.edge = edge;

                    connector = new Connector(controlOptions);

                    if (connector !== null) {
                        _graph.addEdgeProperty(edge, 'shape', connector);
                    }

                    return connector;
                };


                /**
                 * Get/set the graph.
                 * @param  {Object} data    The graph for this canvas.
                 * @return {Mixed}          The graph for this canvas.
                 */
                self.graph = function (data) {

                    if (typeof data !== 'undefined') {

                        _graph = data;

                        _canvas.removeEventListener('mousedown', handleMouseDown);
                        _canvas.removeEventListener('mousemove', handleMouseMove);
                        _canvas.removeEventListener('mouseup', handleMouseUp);
                        _canvas.removeEventListener('keydown', handleKeyDown);

                        self.create();

                    } else {
                        return _graph;
                    }
                };
                /**
                   * Gets the list of controls that are part of this Canvas to the Form
                   * @return {ControlBase []} The controls that are part of this canvas
                   */

                self.getControls = function () {
                    return _controls;
                };

                var getControlById = function (id) {

                    var controlRet = null;

                    for (var i = _controls.length - 1; i >= 0; i--) {
                        if (id === _controls[i]._vertex.id) {
                            controlRet = _controls[i];
                            break;
                        }
                    }

                    return controlRet;
                };

                /**
                  * Gets the list of controls that are at the coordinates passed in
                  * @param  {x} int The x coordinate to check.
                  * @param  {x} int The y coordinate to check.
                  * @return {ControlBase []} The controls that are at the x,y coordinate
                */
                self.getControlsAtPoint = function (x, y) {

                    var arRet = [];

                    var controls = self.getControls();

                    controls.forEach(function (control) {
                        if (control.mouseOverControl(x, y)) {
                            arRet.push(control);
                        }
                    });

                    return arRet;
                };


                /**
                  * Gets the handle that are at the coordinates passed in
                  * @param  {x} int The x coordinate to check.
                  * @param  {x} int The y coordinate to check.
                  * @return {Handle} The handle that is at the x,y coordinate
                */
                self.getHandleAtPoint = function (x, y) {

                    _handles.forEach(function (handle) {
                        if (handle.mouseOverControl(x, y)) {
                            return handle;
                        }
                    });

                    return null;
                };
                /**
                  * Gets the list of controls that are selected
                  * @return {ControlBase []} The controls that are part of this canvas
                */
                self.getSelectedControls = function () {

                    var arRet = [];

                    var controls = self.getControls();

                    controls.forEach(function (control) {
                        if (control._isSelected) {
                            arRet.push(control);
                        }
                    });

                    return arRet;
                };

                /**
                 * Calculate the mouse position based on the event callback and the elements on the page.
                 * @param  {Event} e
                 * @return {Object}   x & y values
                 */
                self.mousePos = function (e) {

                    var elm = e.target,
                        style = document.defaultView.getComputedStyle(elm, undefined),
                        paddingLeft = parseInt(style.paddingLeft, 10) || 0,
                        paddingTop = parseInt(style.paddingLeft, 10) || 0,
                        borderLeft = parseInt(style.borderLeftWidth, 10) || 0,
                        borderTop = parseInt(style.borderLeftWidth, 10) || 0,
                        htmlTop = document.body.parentNode.offsetTop || 0,
                        htmlLeft = document.body.parentNode.offsetLeft || 0,
                        offsetX = 0,
                        offsetY = 0;

                    // calculate the total offset
                    if (typeof elm.offsetParent !== 'undefined') {
                        do {
                            offsetX += elm.offsetLeft;
                            offsetY += elm.offsetTop;
                        } while ((elm = elm.offsetParent));
                    }

                    // take into account borders and padding
                    offsetX += paddingLeft + borderLeft + htmlLeft;
                    offsetY += paddingTop + borderTop + htmlTop;

/*
                    offsetX += window.pageXOffset;
                    offsetY += window.pageYOffset;

const getScrollPosition = (el = window) => ({
  x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
  y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
});
*/

                    // add in the effect of scrolling
                    // alert(elm.scrollLeft);
                    //offsetX += elm.scrollLeft;
                    // offsetY += elm.scrollTop;
                    
                    var ret;

                    if (e.touches) {
                        ret = {
                            x: e.clientX - offsetX,
                            y: e.clientY - offsetY
                        };
                    }
                    else {
                        ret = {
                            x: e.pageX - offsetX,
                            y: e.pageY - offsetY
                        };
                    }

                    return ret;
                };

                /**
                 * Called to render the form and retreive an object with its values
                 */
                self.render = function () {

                    _ctx.clearRect(0, 0, _canvas.width, _canvas.height);

                    // render every node in the graph
                    var vertices = _graph.getVertices();

                    for (var i = vertices.length - 1; i >= 0; i--) {
                        var control = vertices[i].shape;

                        if (typeof control !== 'undefined') {
                            control.render(_ctx, _mouseDownPos);

                            // if the control is selected, draw the handles
                            if (control._isSelected) {
                                for (var iHandle = _handles.length - 1; iHandle >= 0; iHandle--) {
                                    _handles[iHandle].render(_ctx);
                                }
                            }
                        }

                        // get the edges from each vertex
                        var edges = _graph.getEdges(vertices[i]);

                        // for each edge, draw a curve between the source and the target
                        for (var edge in edges) {
                            for (var iTarget = edges[edge].length - 1; iTarget >= 0; iTarget--) {
                                if (edges[edge][iTarget] && edges[edge][iTarget].shape) {
                                    edges[edge][iTarget].shape.render(_ctx, _mouseDownPos);
                                }
                            }
                        }
                    }
                };

                self.setMouseEventHandler = function (mouseEventHandler) {
                    _mouseEventHandler = mouseEventHandler;

                    for (var i = 0; i < _controls.length; i++) {
                        _controls[i].setMouseEventHandler(mouseEventHandler);
                    }
                };

                self.getMouseEventHandler = function () {
                    return _mouseEventHandler;
                };

                /**
                * Handles mouse down event for the canvas, passing it to the effected child controls
                * @param  {Event} e The event object.
                */
                var handleKeyDown = function (e) {

                    e = e || window.event;

                    // delete key
                    if (e.keyCode === 46) {

                        self.removeEntityControls();

                        var edges = _graph.getAllEdges();

                        for (var i = edges.length - 1; i >= 0; i--) {

                            var edgeShape = edges[i].shape;

                            if (edgeShape.isSelected()) {
                                _graph.removeEdge(edges[i]);
                            }

                            edgeShape = null;
                        }

                        self.render();
                    }
                };

                self.removeEntityControls = function () {

                    for (var i = _controls.length - 1; i >= 0; i--) {
                        if (_controls[i]._isSelected) {

                            // remove the vertex and associated edges from the graph
                            _graph.removeVertex(_controls[i]._vertex);

                            // remove the entity from the canvas
                            _controls[i]._vertex._shape = null;

                            _controls.splice(i, 1);
                        }
                    }
                };

                /**
                 * Creates the array of handles that adorn the selected control 
                 * @param  {ControlBase} control The control object.
                 * @return {Handle []} The handles that have been created.
                 */
                var createHandles = function (control) {

                    _handles = [];

                    _handles.push(new DeleteHandle({
                        canvas: _canvas,
                        parent: self,
                        control: control
                    }));

                    _handles.push(new ConnectorHandle({
                        canvas: _canvas,
                        parent: self,
                        control: control
                    }));

                    _handles.push(new AddHandle({
                        canvas: _canvas,
                        parent: self,
                        control: control
                    }));

                    control._handles = _handles;

                    return _handles;
                };

                /**
                 * Gets the controls that have been clicked on and need a mouse down event 
                 * @param  {Event} e The event object.
                 * @return {Control []} The controls that have been clicked.
                 */
                var getMouseDownControls = function (e) {

                    var mouse = self.mousePos(e);

                    _eventControls = [];

                    var length = _controls.length;

                    for (var i = 0; i < length; i++) {
                        if (_controls[i].mouseOverControl(mouse.x, mouse.y)) {
                            _eventControls.push(_controls[i]);

                            createHandles(_controls[i]);
                            // only select one control, for now
                            break;
                        }
                    }

                    var handleControl = null;

                    for (var iHandle = _handles.length - 1; iHandle >= 0; iHandle--) {
                        if (_handles[iHandle].mouseOverControl(mouse.x, mouse.y)) {
                            // get the control with this handle
                            handleControl = _handles[iHandle]._control;
                        }
                    }

                    // unselect all the controls that aren't themselves or their handles being selected
                    // 
                    for (i = 0; i < length; i++) {
                        if (_eventControls.indexOf(_controls[i]) === -1 && _controls[i] !== handleControl) {
                            _controls[i]._isSelected = false;
                        }
                    }

                    // unselect all the edges
                    var edges = _graph.getAllEdges();

                    for (i = edges.length - 1; i >= 0; i--) {
                        edges[i].shape._isSelected = false;
                    }

                    return _eventControls;
                };

                /**
                * Handles mouse down event for the canvas, passing it to the effected child controls
                * @param  {Event} e The event object.
                */
                var handleMouseDown = function (e) {

                    var mouse = self.mousePos(e);

                    e = e || window.event;

                    _mouseDownPos = self.mousePos(e);

                    getMouseDownControls(e).forEach(function (element) {
                        element.mousedown(e, self);
                    }, this);

                    for (var iHandle = _handles.length - 1; iHandle >= 0; iHandle--) {
                        if (_handles[iHandle].mouseOverControl(mouse.x, mouse.y)) {
                            _activeHandle = _handles[iHandle];
                            _activeHandle.mousedown(e, self);
                        }
                    }

                    self.render();
                };

                /**
                * Handles mouse move event for the canvas, passing it to the effected child controls
                * @param  {Event} e The event object.
                */
                var handleMouseMove = function (e) {

                    e = e || window.event;

                    _eventControls.forEach(function (element) {
                        var delta = element.mousemove(e, self);

                        // now update the edges attached to this control

                        if (delta && delta.dragging) {
                            // get the adjacency list for this vertex
                            var edges = _graph.getEdges(element.vertex());
                            for (var edge in edges) {
                                for (var iTarget = 0; iTarget < edges[edge].length; iTarget++) {
                                    if (edges[edge][iTarget]) {

                                        var cntlShape = _graph.getVertexById(edges[edge][iTarget].sourceId).shape;
                                        var edgeShape = edges[edge][iTarget].shape;

                                        edgeShape.startX(cntlShape.x() + cntlShape.width());
                                        edgeShape.startY(cntlShape.y() + cntlShape.height() / 2);
                                        edgeShape.controlPointOneX(cntlShape.x() + cntlShape.width() + 30);
                                        edgeShape.controlPointOneY(cntlShape.y() + cntlShape.height() / 2);
                                    }
                                }
                            }

                            var edgesTo = _graph.getEdgesTo(element.vertex());
                            for (var i = 0; i < edgesTo.length; i++) {
                                var inputEdge = edgesTo[i];

                                inputEdge.shape.endX(inputEdge.shape.endX() + delta.x);
                                inputEdge.shape.endY(inputEdge.shape.endY() + delta.y);

                                inputEdge.shape.controlPointTwoX(inputEdge.shape.endX() - 30);
                                inputEdge.shape.controlPointTwoY(inputEdge.shape.endY());
                            }
                        }

                    }, this);

                    if (_activeHandle) {
                        _activeHandle.mousemove(e);
                    }
                };

                /**
                * Handles mouse up event for the canvas, passing it to the effected child controls
                * @param  {Event} e The event object.
                */
                var handleMouseUp = function (e) {

                    e = e || window.event;

                    _mouseDownPos = null;

                    _eventControls.forEach(function (element) {
                        element.mouseup(e, self);
                    }, this);

                    if (_activeHandle) {
                        _activeHandle.mouseup(e);
                        _activeHandle = null;
                    }
                };

                _canvas.addEventListener('dblclick', function (e) {

                    e = e || window.event;

                    getMouseDownControls(e).forEach(function (element) {
                        element.dblclick(e, self);
                    }, this);
                }, false);

                self.create();

                // setup the inheritance chain
                EntityCanvas.prototype = CanvasBase.prototype;
                EntityCanvas.prototype.constructor = CanvasBase;
            };
        }
        catch (e) {
            alert('EntityCanvas ctor' + e.message);
        }
    });
