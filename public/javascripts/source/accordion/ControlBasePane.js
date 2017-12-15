/**
 * @author Andrew
 */

define(['javascripts/source/accordion/AccordionPane'],
    function (AccordionPane) {
        'use strict';
        try {
            return function ControlBasePane(options) {
                var self = this;

                options.htmlPath = './html/panes/controlBasePane.html';
                options.paneName = 'Object';
                
                // call parent constructor
                AccordionPane.call(self, options);

                self.updateHTMLControls = function () {
                    app.am.updateHTMLControlWithVertexProperty('instance');
                };

                AccordionPane.prototype.constructor = ControlBasePane;
                AccordionPane.prototype = ControlBasePane.prototype;
            };
        }
        catch (e) {
            alert('ControlBasePane.js ' + e.name + ' ' + e.message);
        }

    });
