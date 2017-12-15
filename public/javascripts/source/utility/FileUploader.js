
// JavaScript source code

/**
 * FileUploader.js
 * @author Andrew
 */

define([], function () {

    'use strict';

    try {

        var FileUploader = function FileUploader()
        { };

        FileUploader.uploadFile = function (file) {

            var myFormData = new FormData();
            myFormData.append('theFile', file);

            $.ajax({
                url: AppConfig.Ajax.serverURL + 'fileUpload',
                type: 'POST',
                processData: false, // important
                contentType: false, // important
                dataType: 'json',
                data: myFormData
            });
        };

        return FileUploader;
    }
    catch (e) {
        alert('FileUploader ctor: ' + e.message);
    }
});