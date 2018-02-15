/**
 * @author Andrew
 */

define(['javascripts/source/utility/RestHelper',
    'javascripts/source/utility/TextFileReader',
    'javascripts/source/app/TreeManager'],
    function (RestHelper, TextFileReader, TreeManager) {
        'use strict';
        try {
            return function CSVFileUploadDialog(options) {
                var self = this;

                self.options = options || {};

                self.create = function () {

                    $('body').append('<div id="CSVFileUploadDialogDIV"/>');

                    $('#CSVFileUploadDialogDIV').load('./html/dialogs/csvFileUploadDialog.html',

                        function () {

                            // open the dialog and load the HTML
                            $('#CSVFileUploadDialogDIV').dialog({
                                modal: true,
                                open: function () {
                                    initDialog();
                                },
                                height: 'auto',
                                width: '500',
                                title: 'Add a CSV File Source',
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
                                            var delimiter = $('#delimiterID').val();
                                            var hasHeader = $('#hasHeaderID').prop('checked');

                                            var myFormData = new FormData();
                                            myFormData.append('userName', app.userName);
                                            myFormData.append('sourceFile', sourceFile);
                                            myFormData.append('sourceName', sourceName);
                                            myFormData.append('delimiter', delimiter);
                                            myFormData.append('hasHeader', hasHeader);

                                            // the attributeArray is captured on the onchange event of the file input
                                            // and is saved into an application variable
                                            myFormData.append('attributes', app.attributeArray);

                                            $.ajax({
                                                url: AppConfig.Ajax.serverURL + 'fileUpload/csv',
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
                                            }, 'CSV File');

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
                    $('#CSVFileUploadDialogDIV').remove();
                };
            }
        }
        catch (e) {
            alert('CSVFileUploadDialog.js ' + e.name + ' ' + e.message);
        }

    });
