/**
 * @author Andrew
 */

define(['javascripts/source/accordion/AccordionPane'],
    function (AccordionPane) {
        'use strict';
        try {
            return function OutputControlPane(options) {
                var self = this;

                options.htmlPath = './html/panes/outputControlPane.html';
                options.paneName = 'Output Control';

                // call parent constructor
                AccordionPane.call(self, options);

                self.updateHTMLControls = function () {
                  //  app.am.updateHTMLControl('name');
                };

                AccordionPane.prototype.constructor = OutputControlPane;
                AccordionPane.prototype = OutputControlPane.prototype;
            };
        }
        catch (e) {
            alert('OutputControlPane.js ' + e.name + ' ' + e.message);
        }

    });
