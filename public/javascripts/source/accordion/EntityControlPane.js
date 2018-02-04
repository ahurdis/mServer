/**
 * @author Andrew
 */

define(['javascripts/source/accordion/AccordionPane',
        'javascripts/source/utility/ObjectProperties'],
    function (AccordionPane, ObjectProperties) {
        'use strict';
        try {
            return function EntityControlPane(options) {
                var self = this;

                options.htmlPath = './html/panes/entityControlPane.html';
                options.paneName = 'Attributes';

                // call parent constructor
                AccordionPane.call(self, options);

                self.updateHTMLControls = function () {
                    new ObjectProperties({ vertex: app.selectedControl._vertex }).create();
                };

                AccordionPane.prototype.constructor = EntityControlPane;
                AccordionPane.prototype = EntityControlPane.prototype;
            };
        }
        catch (e) {
            alert('EntityControlPane.js ' + e.name + ' ' + e.message);
        }
    });
