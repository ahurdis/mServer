/**
 * @author Andrew
 */

define([],
    function () {
        'use strict';
        try {
            return function OpenLocalStorage(options) {
                var self = this;

                self.options = options || {};

                self.create = function () {

                    $('body').append('<div id="OpenLocalStorageDIV"/>');

                    $('#OpenLocalStorageDIV').load('./html/dialogs/openLocalStorage.html',

                        function () {

                            // open the dialog and load the HTML
                            $('#OpenLocalStorageDIV').dialog({
                                modal: true,
                                open: function () {
                                    populateItems();
                                    $('#localStorageTabs').tabs();
                                },
                                height: 'auto',
                                width: '700',
                                title: 'Open from Local Storage',
                                buttons: [
                                    {
                                        text: 'Cancel',
                                        click: function () {
                                            $(this).dialog('close');
                                            self.destroy();
                                        }
                                    },
                                    {
                                        text: 'OK',
                                        click: function () {

                                            var userDocumentName = $('#localStorageModelID option:selected').html();

                                            if (userDocumentName !== null) {
                                                app.openUserDocument(userDocumentName);
                                            }

                                            $(this).dialog('close');

                                            self.destroy();
                                        }
                                    }
                                ]

                            });
                        });
                };

                var populateItems = function () {

                    if (typeof (Storage) !== 'undefined') {

                        for (var key in localStorage) {

                            var index = key.indexOf('Graph');

                            if (index === -1) {
                                $('<option>' + key + '</option>').appendTo('#localStorageModelID');
                            }
                        }
                    }
                };

                self.destroy = function () {
                    // remove the html element from the document    
                    $('#OpenLocalStorageDIV').remove();
                };
            }
        }
        catch (e) {
            alert('OpenLocalStorage.js ' + e.name + ' ' + e.message);
        }

    });
