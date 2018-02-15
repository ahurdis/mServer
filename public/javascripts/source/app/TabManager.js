// JavaScript source code

/**
 * TabManager.js
 * @author Andrew
 */

define([], function () {

    'use strict';

    try {

        var TabManager = function TabManager() {

            var self = this;

            self.addTab = function (tabName) {

                // we always add tabs to the end of the list
                var iLastTab = $('#tabs-center >ul >li').length;

                // generate a unique ID with which to name the HTML tags
                var uniqueId = _.uniqueId();

                var tabID = 'tab-panel-center-' + uniqueId;

                var canvasID = 'canvas' + uniqueId;

                // insert the tab to the list
                $('<li><a id="' + tabID + 'anchor' + '"href="#' + tabID + '">' + tabName + '<a href="#" onclick="app.tm.removeTab(\'' + tabID + '\')">x</a></a></li>').appendTo('#tabs-center .ui-tabs-nav');

                // insert the DIV and CANVAS contennt
                $('<div id="' + tabID + '" class="outline ui-tabs-panel ui-widget-content ui-corner-bottom"><canvas id="' +
                    canvasID + '" draggable="false" ondrop="drop(event, \'' + canvasID + '\')" ondragover="allowDrop(event)" width="1200" height="1200" tabindex="999"></canvas></div>').appendTo('#tabs-panel-center');

                // set the active tab
                self.setActiveTab(iLastTab);

                return { tabID: tabID, canvasID: canvasID };
            };

            self.removeTab = function (tabID) {

                var index = _.findIndex(self.activeDocuments, { tabID: tabID });

                // remove the list item that is the actual tab
                $('#tabs-center').find('.ui-tabs-nav li:eq(' + index + ')').remove();

                // remove the div that contains the tab's content div and canvas
                $('#' + tabID).remove();

                // remove the element from the active documents
                if (index > -1) {
                    self.activeDocuments.splice(index, 1);
                }

                // finally, set the active tab depending on which one has been removed
                var numberOfTabsLeft = $('#tabs-center >ul >li').length;

                var activeIndex = 0;

                numberOfTabsLeft === 1 ? activeIndex = 0 : activeIndex = index;

                self.setActiveTab(activeIndex);
            };

            self.setActiveTab = function (activeIndex) {

                $('#tabs-center').tabs('refresh');

                $('#tabs-center').tabs({ active: activeIndex });

                pageLayout.resizeAll();
            };

            self.setActiveTabByID = function (tabID) {

                var index = $('#tabs-center a[href="' + tabID + '"]').parent().index();

                $('#tabs-center').tabs('option', 'active', index);
            };

        };
        return TabManager;
    }
    catch (e) {
        alert('TabManager ctor: ' + e.message);
    }
});