/**
 * @author Andrew
 */

define([],
    function () {
        'use strict';
        try {
            return function AccordionPane(options) {
                var self = this;

          //      options = options || {};

                self.accordionId = options.accordionId || 'accordion-east';
                self.paneName = options.paneName || 'New Pane';
                self.paneId = 'accordion-east-div-' + options.paneId;
                self.htmlPath = options.htmlPath;

                self.create = function () {

                    var newDiv = '<h3 class="accordionPane"><a href="#">' + self.paneName + '</a></h3><div id="' + self.paneId + '"></div>';

                    var selector = $('#' + self.accordionId);

                    selector.append(newDiv);

                    $('#' + self.paneId).load(self.htmlPath,

                        function () {
                            selector.accordion('refresh');
                            self.updateHTMLControls();
                        }
                    );

                    // 
                    /*
                                        var foo = blat[0].baseURI;
                    
                                        debugger;
                    */
                    // alert(JSON.stringify($('#accordion-east ~ h3[role="tab"][myTag="' + tag + '"]').prop('id')));
                };

                self.destroy = function () {
                    // remove the html element from the document    
                    $('#' + self.accordionId).remove();
                };

                self.create();
            };
        }
        catch (e) {
            alert('AccordionPane.js ' + e.name + ' ' + e.message);
        }

    });
