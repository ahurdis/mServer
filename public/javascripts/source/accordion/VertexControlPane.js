/**
 * @author Andrew
 */

define(['javascripts/source/accordion/AccordionPane'],
    function (AccordionPane) {
        'use strict';
        try {
            return function VertexControlPane(options) {
                var self = this;

                options.htmlPath = './html/panes/vertexControlPane.html';
                options.paneName = 'Display';

                // call parent constructor
                AccordionPane.call(self, options);

                self.updateHTMLControls = function () {
                    app.am.updateHTMLControl('borderColor');
                    app.am.updateHTMLControl('fontColor');
                    app.am.updateHTMLControl('fontFamily');
                    app.am.updateHTMLControl('fontSize');
                    app.am.updateHTMLControl('fontStyle');
                    app.am.updateHTMLControl('fontWeight');
                    app.am.updateHTMLControl('selectionColor');
                };

                AccordionPane.prototype.constructor = VertexControlPane;
                AccordionPane.prototype = VertexControlPane.prototype;
            };
        }
        catch (e) {
            alert('VertexControlPane.js ' + e.name + ' ' + e.message);
        }

    });
