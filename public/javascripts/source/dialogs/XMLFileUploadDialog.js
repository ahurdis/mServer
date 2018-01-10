/**
 * @author Andrew
 */

define(['javascripts/source/utility/RestHelper',
    'javascripts/source/utility/XMLFileReader',
    'javascripts/source/utility/TreeManager'],
    function (RestHelper, XMLFileReader, TreeManager) {
        'use strict';
        try {
            return function XMLFileUploadDialog(options) {
                var self = this;

                self.options = options || {};

                self.create = function () {

                    $('body').append('<div id="XMLFileUploadDialogDIV"/>');

                    $('#XMLFileUploadDialogDIV').load('./html/dialogs/xmlFileUploadDialog.html',

                        function () {

                            // open the dialog and load the HTML
                            $('#XMLFileUploadDialogDIV').dialog({
                                modal: true,
                                open: function () {
                                    initDialog();
                                },
                                height: 'auto',
                                width: '500',
                                title: 'Add a XML File Source',
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

                                            // get the header information from the file prior to uploading
                                            var sourceFile = document.getElementById('sourceFileID').files[0];


                                            var sourceName = $('#sourceNameID').val();
                                            var rootPath = $('#rootPathID').val();

                                            var xmlFragment = app.xmlFragment;

                                            var select = (from, selector) =>
                                                selector.split('.').reduce((prev, cur) => prev && prev[cur], from);

                                            if (rootPath) {
                                                xmlFragment = select(xmlFragment, rootPath);
                                            }

                                            if (xmlFragment && xmlFragment.length > 0) {
                                                app.attributeArray = Object.keys(xmlFragment[0]);
                                            }
                
                                            var myFormData = new FormData();
                                            myFormData.append('userName', app.userName);
                                            myFormData.append('sourceFile', sourceFile);
                                            myFormData.append('sourceName', sourceName);
                                            myFormData.append('rootPath', rootPath);

                                            // the attributeArray is captured on the onchange event of the file input
                                            // and is saved into an application variable
                                            myFormData.append('attributes', app.attributeArray);

                                            $.ajax({
                                                url: AppConfig.Ajax.serverURL + 'fileUpload/xml',
                                                //             jsonpCallback: 'fileDialogCallback',
                                                type: 'POST',
                                                processData: false, // important
                                                contentType: false, // important
                                                dataType: 'json',
                                                data: myFormData,
                                                success: function (data) {
                                                    // app.sourceSchema[data.sourceName] = data[0];
                                                    console.log('worked');
                                                },
                                                error: function (data) {
                                                    // TODO: why does error get called when it succeeds??
                                                    // add the file data to the app's sourceSchema 
                                                    RestHelper.postJSON('fileSchemaByNameCallback', { method: 'sourceMetadata/fileSchemaByName', timeout: 20000, data: { sourceName: sourceName } }, function (data) {
                                                        app.sourceSchema[data[0].sourceName] = data[0];
                                                    });
                                                }

                                            });

                                            // finally, update the source tree
                                            TreeManager.addFileSource({
                                                sourceName: sourceName,
                                                attributes: app.attributeArray.toString()
                                            }, 'XML File');

                                            $(this).dialog('close');
                                            self.destroy();
                                        }
                                    }
                                ]
                            });
                        });
                };

                var initDialog = function () {

                };

                self.destroy = function () {
                    // remove the html element from the document    
                    $('#XMLFileUploadDialogDIV').remove();
                };
            }
        }
        catch (e) {
            alert('XMLFileUploadDialog.js ' + e.name + ' ' + e.message);
        }

    });
