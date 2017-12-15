// JavaScript source code

/**
 * EditBox.js
 * @author Andrew
 */

define(['javascripts/source/control/ControlBase'],
    function (ControlBase) {
        'use strict';
        try {
            return function EditBox(options) {
                var self = this;

                // call parent constructor
                ControlBase.call(self, options);

                options = options ? options : {};

                // setup the defaults
                self._placeHolderColor = options.placeHolderColor || '#bfbebd';

                self._regularExpression = options.regularExpression ? new RegExp(options.regularExpression) : null;

                self._readonly = options.readonly || false;
                self._maxlength = options.maxlength || null;
                self._width = options.width || 150;
                self._height = options.height || self._fontSize;
                self._padding = options.padding >= 0 ? options.padding : 5;
                self._borderWidth = options.borderWidth >= 0 ? options.borderWidth : 1;
                self._borderColor = options.borderColor || '#959595';
                self._borderRadius = options.borderRadius >= 0 ? options.borderRadius : 3;
                self._backgroundImage = options.backgroundImage || '';
                self._boxShadow = options.boxShadow || '1px 1px 0px rgba(255, 255, 255, 1)';
                self._innerShadow = options.innerShadow || '0px 0px 4px rgba(0, 0, 0, 0.4)';
                self._selectionColor = options.selectionColor || 'rgba(179, 212, 253, 0.8)';
                self._placeHolderText = options.placeHolderText || '';
                self._value = (options.value || self._placeHolderText) + '';
                self._cursor = false;
                self._cursorPos = 0;
                self._hasFocus = false;
                self._selection = [0, 0];
                self._wasOver = false;
                self._isRegularExpression = false;

                self.testRegExp = function () {
                    if (self._regularExpression !== null) {

                        var match = self._regularExpression.exec(self._value);
                        if (!match) {
                            self._isRegularExpression = false;
                        }
                        else {
                            self._isRegularExpression = true;
                        }
                        return self._isRegularExpression;
                    }

                    // if one isn't defined, return true
                    return true;
                };

                /**
                 * Get/set the place holder font color.
                 * @param  {String} data Font color.
                 * @return {Mixed}      EditBox or current place holder font color.
                 */
                self.placeHolderColor = function (data) {
                    if (typeof data !== 'undefined') {
                        self._placeHolderColor = data;

                        return self.render();
                    } else {
                        return self._placeHolderColor;
                    }
                };

                /**
                 * Get/set the width of the text box.
                 * @param  {Number} data Width in pixels.
                 * @return {Mixed}      EditBox or current width.
                 */
                self.width = function (data) {
                    if (typeof data !== 'undefined') {
                        self._width = data;
                        self._calcWH();
                        self._updateCanvasWH();

                        return self.render();
                    } else {
                        return self._width;
                    }
                };

                /**
                 * Get/set the height of the text box.
                 * @param  {Number} data Height in pixels.
                 * @return {Mixed}      EditBox or current height.
                 */
                self.height = function (data) {
                    if (typeof data !== 'undefined') {
                        self._height = data;
                        self._calcWH();
                        self._updateCanvasWH();

                        return self.render();
                    } else {
                        return self._height;
                    }
                };

                /**
                 * Get/set the padding of the text box.
                 * @param  {Number} data Padding in pixels.
                 * @return {Mixed}      EditBox or current padding.
                 */
                self.padding = function (data) {
                    if (typeof data !== 'undefined') {
                        self._padding = data;
                        self._calcWH();
                        self._updateCanvasWH();

                        return self.render();
                    } else {
                        return self._padding;
                    }
                };

                /**
                 * Get/set the border width.
                 * @param  {Number} data Border width.
                 * @return {Mixed}      EditBox or current border width.
                 */
                self.borderWidth = function (data) {
                    if (typeof data !== 'undefined') {
                        self._borderWidth = data;
                        self._calcWH();
                        self._updateCanvasWH();

                        return self.render();
                    } else {
                        return self._borderWidth;
                    }
                };

                /**
                 * Get/set the border color.
                 * @param  {String} data Border color.
                 * @return {Mixed}      EditBox or current border color.
                 */
                self.borderColor = function (data) {
                    if (typeof data !== 'undefined') {
                        self._borderColor = data;

                        return self.render();
                    } else {
                        return self._borderColor;
                    }
                };

                /**
                 * Get/set the border radius.
                 * @param  {Number} data Border radius.
                 * @return {Mixed}      EditBox or current border radius.
                 */
                self.borderRadius = function (data) {
                    if (typeof data !== 'undefined') {
                        self._borderRadius = data;

                        return self.render();
                    } else {
                        return self._borderRadius;
                    }
                };

                /**
                 * Get/set the background color.
                 * @param  {Number} data Background color.
                 * @return {Mixed}      EditBox or current background color.
                 */
                self.backgroundColor = function (data) {
                    if (typeof data !== 'undefined') {
                        self._backgroundColor = data;

                        return self.render();
                    } else {
                        return self._backgroundColor;
                    }
                };

                /**
                 * Get/set the background gradient.
                 * @param  {Number} data Background gradient.
                 * @return {Mixed}      EditBox or current background gradient.
                 */
                self.backgroundGradient = function (data) {
                    if (typeof data !== 'undefined') {
                        self._backgroundColor = self._renderCtx.createLinearGradient(
                            0,
                            0,
                            0,
                            self.outerH
                        );
                        self._backgroundColor.addColorStop(0, data[0]);
                        self._backgroundColor.addColorStop(1, data[1]);

                        return self.render();
                    } else {
                        return self._backgroundColor;
                    }
                };

                /**
                 * Get/set the box shadow.
                 * @param  {String} data     Box shadow in CSS format (1px 1px 1px rgba(0, 0, 0.5)).
                 * @param  {Boolean} doReturn (optional) True to prevent a premature render.
                 * @return {Mixed}          EditBox or current box shadow.
                 */
                self.boxShadow = function (data, doReturn) {
                    if (typeof data !== 'undefined') {
                        // parse box shadow
                        var boxShadow = data.split('px ');
                        self._boxShadow = {
                            x: self._boxShadow === 'none' ? 0 : parseInt(boxShadow[0], 10),
                            y: self._boxShadow === 'none' ? 0 : parseInt(boxShadow[1], 10),
                            blur: self._boxShadow === 'none' ? 0 : parseInt(boxShadow[2], 10),
                            color: self._boxShadow === 'none' ? '' : boxShadow[3]
                        };

                        // take into account the shadow and its direction
                        if (self._boxShadow.x < 0) {
                            self.shadowL = Math.abs(self._boxShadow.x) + self._boxShadow.blur;
                            self.shadowR = self._boxShadow.blur + self._boxShadow.x;
                        } else {
                            self.shadowL = Math.abs(self._boxShadow.blur - self._boxShadow.x);
                            self.shadowR = self._boxShadow.blur + self._boxShadow.x;
                        }
                        if (self._boxShadow.y < 0) {
                            self.shadowT = Math.abs(self._boxShadow.y) + self._boxShadow.blur;
                            self.shadowB = self._boxShadow.blur + self._boxShadow.y;
                        } else {
                            self.shadowT = Math.abs(self._boxShadow.blur - self._boxShadow.y);
                            self.shadowB = self._boxShadow.blur + self._boxShadow.y;
                        }

                        self.shadowW = self.shadowL + self.shadowR;
                        self.shadowH = self.shadowT + self.shadowB;

                        self._calcWH();

                        if (!doReturn) {
                            self._updateCanvasWH();

                            return self.render();
                        }
                    } else {
                        return self._boxShadow;
                    }
                };

                /**
                 * Get/set the inner shadow.
                 * @param  {String} data In the format of a CSS box shadow (1px 1px 1px rgba(0, 0, 0.5)).
                 * @return {Mixed}          EditBox or current inner shadow.
                 */
                self.innerShadow = function (data) {
                    if (typeof data !== 'undefined') {
                        self._innerShadow = data;

                        return self.render();
                    } else {
                        return self._innerShadow;
                    }
                };

                /**
                 * Get/set the text selection color.
                 * @param  {String} data Color.
                 * @return {Mixed}      EditBox or current selection color.
                 */
                self.selectionColor = function (data) {
                    if (typeof data !== 'undefined') {
                        self._selectionColor = data;

                        return self.render();
                    } else {
                        return self._selectionColor;
                    }
                };

                /**
                 * Get/set the regular expression text.
                 * @param  {String} the regular expression string.
                 * @return {Mixed}      EditBox or current RegExp object
                 */
                self.regularExpression = function (data) {
                    if (typeof data !== 'undefined') {
                        self._regularExpression = new RegExp(data);

                        return self.render();
                    } else {
                        return self._regularExpression;
                    }
                };

                /**
                 * Get/set the place holder text.
                 * @param  {String} data Place holder text.
                 * @return {Mixed}      EditBox or current place holder text.
                 */
                self.placeHolderText = function (data) {
                    if (typeof data !== 'undefined') {
                        self._placeHolderText = data;

                        return self.render();
                    } else {
                        return self._placeHolderText;
                    }
                };

                /**
                 * Get/set the current text box value.
                 * @param  {String} data Text value.
                 * @return {Mixed}      EditBox or current text value.
                 */
                self.value = function (data) {
                    if (typeof data !== 'undefined') {
                        self._value = data + '';
                        // update the cursor position
                        self._cursorPos = self._clipText().length;

                        self.render();

                        return self;
                    } else {
                        return (self._value === self._placeHolderText) ? '' : self._value;
                    }
                };

                /**
                 * Place focus on the EditBox box, placing the cursor
                 * either at the end of the text or where the user clicked.
                 * @param  {Number} pos (optional) The position to place the cursor.
                 * @return {EditBox}
                 */
                self.focus = function (pos) {
                    // if this is readonly, don't allow it to get focus
                    if (self._readonly) {
                        return;
                    }

                    // only fire the focus event when going from unfocussed
                    if (!self._hasFocus) {
                        self._onfocus(self);

                        if (self._form) {
                            self._form.removeFocus();
                        }
                    }

                    // remove selection
                    if (!self._selectionUpdated) {
                        self._selection = [0, 0];
                    } else {
                        delete self._selectionUpdated;
                    }

                    // update the cursor position
                    self._cursorPos = (typeof pos === 'number') ? pos : self._clipText().length;

                    // clear the place holder
                    if (self._placeHolderText === self._value) {
                        self._value = '';
                    }

                    self._hasFocus = true;
                    self._cursor = true;

                    // setup cursor interval
                    if (self._cursorInterval) {
                        clearInterval(self._cursorInterval);
                    }
                    self._cursorInterval = setInterval(function () {
                        self._cursor = !self._cursor;
                        self.render();
                    }, 500);

                    return self.render();
                };

                /**
                 * Removes focus from the EditBox box.
                 * @param  {Object} _this Reference to this.
                 * @return {EditBox}
                 */
                self.blur = function (_this) {

                    if (self._cursorInterval) {
                        clearInterval(self._cursorInterval);
                    }
                    self._hasFocus = false;
                    self._cursor = false;
                    self._selection = [0, 0];

                    // fill the place holder
                    if (self._value === '') {
                        self._value = self._placeHolderText;
                    }

                    self._onblur(self);

                    return self.render();
                };

                /**
                 * Checks if a coordinate point is over the input box.
                 * @param  {Number} x x-coordinate position.
                 * @param  {Number} y y-coordinate position.
                 * @return {Boolean}   True if it is over the input box.
                 */
                self.mouseOverControl = function (x, y) {
                    var xLeft = x >= self._x,
                        xRight = x <= self._x + self._width + self._padding * 2,
                        yTop = y >= self._y,
                        yBottom = y <= self._y + self._height + self._padding * 2;

                    return xLeft && xRight && yTop && yBottom;
                };

                // event.type must be keypress
                var getChar = function (e) {
                    if (e.which === null) {
                        return String.fromCharCode(e.keyCode); // IE
                    } else if (e.which !== 0 && e.charCode !== 0) {
                        return String.fromCharCode(e.which);   // the rest
                    } else {
                        return null; // special key
                    }
                };

                /**
                 * Fired with the keypress event to draw the typed characters.
                 * @param  {Event}   e    The keypress event.
                 * @param  {EditBox} self
                 * @return {EditBox}
                 */
                self.keypress = function (e, parent) {
                    var keyCode = e.keyCode,
                        isShift = e.shiftKey,
                        key = null,
                        startText, endText;

                    // make sure the correct text field is being updated
                    if (!self._hasFocus) {
                        return;
                    }

                    // fire custom user event
                    self._onkeypress(e, self);

                    switch (keyCode) {
                        default:
                            self._value += getChar(e);
                            self._cursorPos += 1;
                            e.preventDefault();
                            break;
                    }

                    self._selection = [0, 0];

                    self.testRegExp();

                    return self.render();
                };

                /**
                 * Fired with the keydown event to know which key is down.
                 * @param  {Event}   e    The keydown event.
                 * @param  {EditBox} self
                 * @return {EditBox}
                 */
                self.keydown = function (e, parent) {
                    var keyCode = e.keyCode,
                        isShift = e.shiftKey,
                        key = null,
                        startText, endText;

                    // make sure the correct text field is being updated
                    if (!self._hasFocus) {
                        return;
                    }

                    // fire custom user event
                    self._onkeydown(e, self);

                    // add support for Ctrl/Cmd+A selection
                    if (keyCode === 65 && (e.ctrlKey || e.metaKey)) {
                        self._selection = [0, self._value.length];

                        e.preventDefault();
                        return self.render();
                    }

                    // block keys that shouldn't be processed
                    if (keyCode === 17 || e.metaKey || e.ctrlKey) {
                        return self;
                    }

                    if (keyCode === 13) { // enter key
                        e.preventDefault();
                        self._onsubmit(e, self);
                    } else if (keyCode === 9) { // tab key

                        if (self._form) {
                            isShift ? self._form.rewindFocus(self) : self._form.advanceFocus(self);
                        }

                        e.preventDefault();
                        return;
                    }

                    switch (keyCode) {
                        default:
                            //         e.preventDefault();
                            break;

                        case 13: // 'Enter':
                        case 16: // 'Shift':
                        case 20: // 'CapsLock':
                        case 27: // 'Esc':
                        case 38: // 'Up':
                        case 40: // 'Down':
                            break;

                        case 8: // 'Backspace'
                            //            self._value = self._value.substr(0, self._value.length - 1);

                            self._value = self._value.substr(0, self._cursorPos - 1) + self._value.substr(self._cursorPos, self._value.length - 1);

                            (self._cursorPos === 0) ? 0 : self._cursorPos -= 1;

                            self.clearSelection();

                            e.preventDefault();
                            break;

                        case 32: // 'Spacebar'
                            self._value += ' ';
                            self._cursorPos += 1;

                            e.preventDefault();

                            break;

                        case 37: // 'Left':
                            (self._cursorPos === 0) ? 0 : self._cursorPos -= 1;
                            e.preventDefault();
                            break;

                        case 39: // 'Right':
                            self._cursorPos += 1;
                            e.preventDefault();
                            break;

                        case 46: // 'Delete':

                            //                      self._value = self._value.substr(0, self._value.length - 1);

                            // self._value = self._value.substr(0, self._cursorPos) + self._value.substr(self._cursorPos + 1, end);

                            // note, clearSelection will only clear if there is a selection
                            self.clearSelection();


                            e.preventDefault();
                            break;



                    }

                    self._selection = [0, 0];

                    return self.render();
                };


                /**
                 * Fired with the click event on the canvas, and puts focus on/off
                 * based on where the user clicks.
                 * @param  {Event}       e    The click event.
                 * @param  {EditBox} self
                 * @return {EditBox}
                 */
                self.click = function (e, parent) {
                    var mouse = self._mousePos(e),
                        x = mouse.x,
                        y = mouse.y;



                    if (self._endSelection) {
                        delete self._endSelection;
                        delete self._selectionUpdated;
                        return;
                    }

                   //  

                    if (self._canvas && self.mouseOverControl(x, y) || !self._canvas) {
                        if (self._mouseDown) {

                            self._mouseDown = false;
                            // self.click(e, self);
                            return self.focus(self._clickPos(x, y));
                        }
                    } else {
                        return self.blur();
                    }
                };

                /**
                 * Fired with the mousemove event to update the default cursor.
                 * @param  {Event}       e    The mousemove event.
                 * @param  {EditBox} self
                 * @return {EditBox}
                 */
                self.mousemove = function (e, parent) {
                    var mouse = self._mousePos(e),
                        x = mouse.x,
                        y = mouse.y,
                        isOver = self.mouseOverControl(x, y);

                    if (isOver && self._canvas) {
                        self._canvas.style.cursor = 'text';
                        self._wasOver = true;
                    } else if (self._wasOver && self._canvas) {
                        self._canvas.style.cursor = 'default';
                        self._wasOver = false;
                    }

                    if (self._hasFocus && self._selectionStart >= 0) {
                        var curPos = self._clickPos(x, y),
                            start = Math.min(self._selectionStart, curPos),
                            end = Math.max(self._selectionStart, curPos);

                        if (!isOver) {
                            self._selectionUpdated = true;
                            self._endSelection = true;
                            delete self._selectionStart;
                            self.render();
                            return;
                        }

                        if (self._selection[0] !== start || self._selection[1] !== end) {
                            self._selection = [start, end];
                            self.render();
                        }
                    }
                };

                /**
                 * Fired with the mousedown event to start a selection drag.
                 * @param  {Event} e    The mousedown event.
                 * @param  {EditBox} self
                 */
                self.mousedown = function (e, parent) {
                    var mouse = self._mousePos(e),
                        x = mouse.x,
                        y = mouse.y,
                        isOver = self.mouseOverControl(x, y);

                    // setup the 'click' event
                    self._mouseDown = isOver;

                    // start the selection drag if inside the input
                    if (self._hasFocus && isOver) {
                        self._selectionStart = self._clickPos(x, y);
                    }
                };

                /**
                 * Fired with the mouseup event to end a selection drag.
                 * @param  {Event} e    The mouseup event.
                 * @param  {EditBox} self
                 */
                self.mouseup = function (e, parent) {
                    var mouse = self._mousePos(e),
                        x = mouse.x,
                        y = mouse.y;

                    // update selection if a drag has happened
                    var isSelection = self._clickPos(x, y) !== self._selectionStart;
                    if (self._hasFocus && self._selectionStart >= 0 && self.mouseOverControl(x, y) && isSelection) {
                        self._selectionUpdated = true;
                        delete self._selectionStart;
                        self.render();
                    } else {
                        self._cursorPos = self._clickPos(x, y);
                        delete self._selectionStart;
                    }

                    self.click(e, self);
                };

                /**
                 * Helper method to get the off-DOM canvas.
                 * @return {Object} Reference to the canvas.
                 */
                self.renderCanvas = function () {
                    return this._renderCanvas;
                };

                /**
                 * Clears and redraws the EditBox on an off-DOM canvas,
                 * and if a main canvas is provided, draws it all onto that.
                 */
                self.render = function () {
                    var ctx = self._renderCtx,
                        w = self.outerW,
                        h = self.outerH,
                        br = self._borderRadius,
                        bw = self._borderWidth,
                        sw = self.shadowW,
                        sh = self.shadowH;


                    if (ctx === null) alert('null context');
                    ctx.save();

                    // clear the canvas
                    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                    // ctx.clearRect(0, 0, w, h);

                    // setup the box shadow
                    ctx.shadowOffsetX = self._boxShadow.x;
                    ctx.shadowOffsetY = self._boxShadow.y;
                    ctx.shadowBlur = self._boxShadow.blur;
                    ctx.shadowColor = self._boxShadow.color;

                    // draw the border
                    if (self._borderWidth > 0) {
                        ctx.fillStyle = self._borderColor;
                        self._roundedRect(ctx, self.shadowL, self.shadowT, w - sw, h - sh, br);
                        ctx.fill();

                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        ctx.shadowBlur = 0;
                    }

                    // draw the text box background
                    self._drawTextBox(function () {
                        // make sure all shadows are reset
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 0;
                        ctx.shadowBlur = 0;

                        // clip the text so that it fits within the box
                        var text = self._clipText();

                        // draw the selection
                        var paddingBorder = self._padding + self._borderWidth + self.shadowT;
                        if (self._selection[1] > 0) {
                            var selectOffset = self._textWidth(text.substring(0, self._selection[0])),
                                selectWidth = self._textWidth(text.substring(self._selection[0], self._selection[1]));

                            ctx.fillStyle = self._selectionColor;
                            ctx.fillRect(paddingBorder + selectOffset, paddingBorder, selectWidth, self._height);
                        }

                        // draw the cursor
                        if (self._cursor) {
                            var cursorOffset = self._textWidth(text.substring(0, self._cursorPos));
                            ctx.fillStyle = self._fontColor;
                            ctx.fillRect(paddingBorder + cursorOffset, paddingBorder, 1, self._height);
                        }

                        // draw the text
                        var textX = self._padding + self._borderWidth + self.shadowL,
                            textY = Math.round(paddingBorder + self._height / 2);

                        // only remove the placeholder text if they have typed something
                        text = (text === '' && self._placeHolderText) ? self._placeHolderText : text;

                        ctx.fillStyle = (self._value !== '' && self._value !== self._placeHolderText) ? self._fontColor : self._placeHolderColor;
                        ctx.font = self._fontStyle + ' ' + self._fontWeight + ' ' + self._fontSize + 'px ' + self._fontFamily;
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(text, textX, textY);

                        // parse inner shadow
                        var innerShadow = self._innerShadow.split('px '),
                            isOffsetX = self._innerShadow === 'none' ? 0 : parseInt(innerShadow[0], 10),
                            isOffsetY = self._innerShadow === 'none' ? 0 : parseInt(innerShadow[1], 10),
                            isBlur = self._innerShadow === 'none' ? 0 : parseInt(innerShadow[2], 10),
                            isColor = self._innerShadow === 'none' ? '' : innerShadow[3];

                        // draw the inner-shadow (damn you canvas, this should be easier than this...)
                        if (isBlur > 0) {
                            var shadowCtx = self._shadowCtx,
                                scw = shadowCtx.canvas.width,
                                sch = shadowCtx.canvas.height;

                            shadowCtx.clearRect(0, 0, scw, sch);
                            shadowCtx.shadowBlur = isBlur;
                            shadowCtx.shadowColor = isColor;

                            // top shadow
                            shadowCtx.shadowOffsetX = 0;
                            shadowCtx.shadowOffsetY = isOffsetY;
                            shadowCtx.fillRect(-1 * w, -100, 3 * w, 100);

                            // right shadow
                            shadowCtx.shadowOffsetX = isOffsetX;
                            shadowCtx.shadowOffsetY = 0;
                            shadowCtx.fillRect(scw, -1 * h, 100, 3 * h);

                            // bottom shadow
                            shadowCtx.shadowOffsetX = 0;
                            shadowCtx.shadowOffsetY = isOffsetY;
                            shadowCtx.fillRect(-1 * w, sch, 3 * w, 100);

                            // left shadow
                            shadowCtx.shadowOffsetX = isOffsetX;
                            shadowCtx.shadowOffsetY = 0;
                            shadowCtx.fillRect(-100, -1 * h, 100, 3 * h);

                            // create a clipping mask on the main canvas
                            self._roundedRect(ctx, bw + self.shadowL, bw + self.shadowT, w - bw * 2 - sw, h - bw * 2 - sh, br);
                            ctx.clip();

                            // draw the inner-shadow from the off-DOM canvas
                            ctx.drawImage(self._shadowCanvas, 0, 0, scw, sch, bw + self.shadowL, bw + self.shadowT, scw, sch);
                        }

                        // draw to the visible canvas
                        if (self._ctx) {
                            self._ctx.clearRect(self._x, self._y, ctx.canvas.width, ctx.canvas.height);
                            self._ctx.drawImage(self._renderCanvas, self._x, self._y);
                        }
                    });

                    ctx.restore();
                };

                /**
                 * Draw the text box area with either an image or background color.
                 * @param  {Function} fn Callback.
                 */
                self._drawTextBox = function (fn) {
                    var ctx = self._renderCtx,
                        w = self.outerW,
                        h = self.outerH,
                        br = self._borderRadius,
                        bw = self._borderWidth,
                        sw = self.shadowW,
                        sh = self.shadowH;

                    // only draw the background shape if no image is being used
                    if (self._backgroundImage === '') {
                        ctx.fillStyle = self._backgroundColor;
                        self._roundedRect(ctx, bw + self.shadowL, bw + self.shadowT, w - bw * 2 - sw, h - bw * 2 - sh, br);
                        ctx.fill();

                        fn();
                    } else {
                        var img = new Image();
                        img.src = self._backgroundImage;
                        img.onload = function () {
                            ctx.drawImage(img, 0, 0, img.width, img.height, bw + self.shadowL, bw + self.shadowT, w, h);

                            fn();
                        };
                    }
                };

                /**
                 * Returns true if there is selected text
                 * @return {Boolean} true if text is selected.
                 */
                self.isSelection = function () {
                    return self._selection[1] > 0;
                };

                /**
                 * Deletes selected text in selection range and repositions cursor.
                 * @return {Boolean} true if text removed.
                 */
                self.clearSelection = function () {
                    if (self._selection[1] > 0) {
                        // clear the selected contents
                        var start = self._selection[0],
                            end = self._selection[1];

                        self._value = self._value.substr(0, start) + self._value.substr(end);
                        self._cursorPos = start;
                        self._cursorPos = (self._cursorPos < 0) ? 0 : self._cursorPos;
                        self._selection = [0, 0];

                        return true;
                    }

                    return false;
                };

                /**
                 * Clip the text string to only return what fits in the visible text box.
                 * @param  {String} value The text to clip.
                 * @return {String} The clipped text.
                 */
                self._clipText = function (value) {
                    value = (typeof value === 'undefined') ? self._value : value;

                    var textWidth = self._textWidth(value),
                        fillPer = textWidth / (self._width - self._padding),
                        text = fillPer > 1 ? value.substr(-1 * Math.floor(value.length / fillPer)) : value;

                    return text + '';
                };

                /**
                 * Recalculate the outer with and height of the text box.
                 */
                self._calcWH = function () {
                    // calculate the full width and height with padding, borders and shadows
                    self.outerW = self._width + self._padding * 2 + self._borderWidth * 2 + self.shadowW;
                    self.outerH = self._height + self._padding * 2 + self._borderWidth * 2 + self.shadowH;
                };

                /**
                 * Update the width and height of the off-DOM canvas when attributes are changed.
                 */
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


                /**
                 * Checks if a coordinate point is over the input box.
                 * @param  {Number} x x-coordinate position.
                 * @param  {Number} y y-coordinate position.
                 * @return {Boolean}   True if it is over the input box.
                 */
                self.mouseOverControl = function (x, y) {
                    var xLeft = x >= self._x,
                        xRight = x <= self._x + self._width + self._padding * 2,
                        yTop = y >= self._y,
                        yBottom = y <= self._y + self._height + self._padding * 2;

                    return xLeft && xRight && yTop && yBottom;
                };

                /**
                 * Use the mouse's x & y coordinates to determine
                 * the position clicked in the text.
                 * @param  {Number} x X-coordinate.
                 * @param  {Number} y Y-coordinate.
                 * @return {Number}   Cursor position.
                 */
                self._clickPos = function (x, y) {
                    var value = self._value;

                    // don't count placeholder text in this
                    if (self._value === self._placeHolderText) {
                        value = '';
                    }

                    // determine where the click was made along the string
                    var text = self._clipText(value),
                        totalW = 0,
                        pos = text.length;

                    if (x - (self._x) < self._textWidth(text)) {
                        // loop through each character to identify the position
                        for (var i = 0; i < text.length; i++) {
                            totalW += self._textWidth(text[i]);
                            if (totalW >= x - (self._x)) {
                                pos = i;
                                break;
                            }
                        }
                    }

                    return pos;
                };

                // INIT 
                // parse box shadow
                self.boxShadow(self._boxShadow, true);

                // calculate the full width and height with padding, borders and shadows
                self._calcWH();

                // setup the off-DOM canvas
                self._renderCanvas = document.createElement('canvas');
                self._renderCanvas.setAttribute('width', self.outerW);
                self._renderCanvas.setAttribute('height', self.outerH);
                self._renderCtx = self._renderCanvas.getContext('2d');

                // setup another off-DOM canvas for inner-shadows
                self._shadowCanvas = document.createElement('canvas');
                self._shadowCanvas.setAttribute('width', self._width + self._padding * 2);
                self._shadowCanvas.setAttribute('height', self._height + self._padding * 2);
                self._shadowCtx = self._shadowCanvas.getContext('2d');

                // setup the background color
                if (typeof options.backgroundGradient !== 'undefined') {
                    self._backgroundColor = self._renderCtx.createLinearGradient(
                        0,
                        0,
                        0,
                        self.outerH
                    );
                    self._backgroundColor.addColorStop(0, options.backgroundGradient[0]);
                    self._backgroundColor.addColorStop(1, options.backgroundGradient[1]);
                } else {
                    self._backgroundColor = options.backgroundColor || '#fff';
                }

                // setup the inheritance chain
                EditBox.prototype = ControlBase.prototype;
                EditBox.prototype.constructor = ControlBase;
            };
        }
        catch (e) {
            alert('EditBox ctor' + e.message);
        }
    });