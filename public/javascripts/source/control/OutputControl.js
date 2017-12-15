// JavaScript source code

/**
 * OutputControl.js
 * @author Andrew
 */
define(['javascripts/source/control/VertexControl'],
    function (VertexControl) {
        'use strict';
        try {
            return function OutputControl(options) {

                var self = this;
                // call parent constructor
                VertexControl.call(self, options);

                self.img = new Image();
                self.img.src = self._vertex.imageName || 'images/OpenGraph.png';

                var _edgeHitPos = null;

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

                    ctx.drawImage(self.img, 
                        self._x, 
                        self._y, 
                        self._width, 
                        self._height);

                    _edgeHitPos = mouseDownPos;
                    // detect if we have selected a path
                    if (mouseDownPos && ctx.isPointInStroke(mouseDownPos.x, mouseDownPos.y)) {
                        _edgeHitPos = mouseDownPos;
                    } else {
                        // _edgeHitPos = null;
                    }

                    ctx.restore();
                };

                self.create = function () {

                    self.setControlSize();
                };

                self.create();

                // setup the inheritance chain
                OutputControl.prototype = VertexControl.prototype;
                OutputControl.prototype.constructor = VertexControl;
            };
        }
        catch (e) {
            alert('OutputControl ctor' + e.message);
        }
    });


