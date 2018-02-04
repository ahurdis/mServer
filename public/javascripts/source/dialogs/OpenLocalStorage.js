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
                                    //                                    $('#btnOKID').button('disable');
                                },
                                height: 'auto',
                                width: '700',
                                title: 'Open from Local Storage',
                                buttons: [
                                    {
                                        id: 'btnCancelID',
                                        text: 'Cancel',
                                        click: function () {
                                            $(this).dialog('close');
                                            self.destroy();
                                        }
                                    },
                                    {
                                        id: 'btnOKID',
                                        text: 'OK',
                                        disabled: true,
                                        click: function () {

                                            var selectedTabID;

                                            var selected = $("#localStorageTabs").tabs("option", "active");
                                            // var selectedTabTitle = $($("#localStorageTabs li")[selected]).text();

                                            switch (selected) {
                                                case 0:
                                                    selectedTabID = '#localStorageWorkflowID';
                                                    break;
                                                case 1:
                                                    selectedTabID = '#localStorageUDFID';
                                                    break;
                                                case 2:
                                                    selectedTabID = '#localStorageModelID';
                                                    break;
                                            }

                                            var userDocumentName = $(selectedTabID + ' option:selected').html();

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

                        var userDocument;

                        for (var key of Object.getOwnPropertyNames(localStorage)) {

                            var index = key.indexOf('Graph');

                            if (index === -1) {

                                var strJSON = localStorage.getItem(key);

                                if (strJSON !== null) {
                                    userDocument = JSON.parse(strJSON);

                                    var select;

                                    switch (userDocument.type) {
                                        case 'Workflow':
                                            select = '#localStorageWorkflowID';
                                            break;
                                        case 'UDF':
                                            select = '#localStorageUDFID';
                                            break;
                                        case 'Model':
                                            select = '#localStorageModelID';
                                            break;
                                    }

                                    $('<option>' + key + '</option>').appendTo(select);
                                }
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
