/**
 * @author Andrew
 */

define([],
    function () {
        'use strict';
        try {
            return function SaveLocalStorage(options) {
                var self = this;

                self.options = options || {};

                self.create = function () {

                    $('body').append('<div id="SaveLocalStorageDIV"/>');

                    $('#SaveLocalStorageDIV').load('./html/dialogs/saveLocalStorage.html',

                        function () {

                            // open the dialog and load the HTML
                            $('#SaveLocalStorageDIV').dialog({
                                modal: true,
                                open: function () {
                                },
                                height: 'auto',
                                width: '700',
                                title: 'Save to Local Storage',
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

                                            var documentName = $('#saveUserDocumentID').val();

                                            // TODO : need to validate the document name?

                                            var userDocument = app.getActiveDocument();

                                            userDocument.name = documentName;

                                            $('#' + userDocument.tabID + 'anchor').text(userDocument.name);

                                            app.saveUserDocument(userDocument);

                                            $(this).dialog('close');
                                            self.destroy();
                                        }
                                    }
                                ]
                            });
                        });
                };

                self.destroy = function () {
                    // remove the html element from the document    
                    $('#SaveLocalStorageDIV').remove();
                };
            }
        }
        catch (e) {
            alert('SaveLocalStorage.js ' + e.name + ' ' + e.message);
        }

    });
