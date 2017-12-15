/*
 * RestHelper.js
 * @author Andrew
 */

var AppConfig = require(['javascripts/source/app/AppConfig']);

define(function () {
    'use strict';
    try {
        var RestHelper = function RestHelper() {

        };
        
        /*
        Makes a GET request to the server with JSON data
        JSONP callback returns the status of the request 
        */
        RestHelper.postJSON = function (callbackName, options, callback) {

            try {
                // now we call the rest service
                $.ajax({
                    url: AppConfig.Ajax.serverURL + options.method,
                    dataType: "jsonp",
                    jsonpCallback: callbackName,
                    data: 'jsonData=' + JSON.stringify(options.data),
                    contentType: 'application/json',
                    cache: options.cache || false,
                    timeout: options.timeout || 5000,
                    success: callback,
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert('error ' + textStatus + " " + errorThrown);
                    }
                });
            }
            catch (e) {
                alert(e);
            }
        };

        RestHelper.makeRequest = function (that, options, callback) {

            try {
                $.support.cors = true;
                // now we call the rest service
                $.ajax({
                    url: AppConfig.Ajax.serverURL + options.method,
                    dataType: "jsonp",
                    jsonpCallback: "_testcb",
                    async: false,
                    cache: false,
                    timeout: 5000,
                    success: callback,
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert('error ' + textStatus + " " + errorThrown);
                    }
                });
            }
            catch (e) {
                alert(e);
            }
        };

        /*        
        sendRequest('file.txt',handleRequest);
        
        function handleRequest(req) {
            var writeroot = [some element];
            writeroot.innerHTML = req.responseText;
        }
        */

/*
The readyState attribute must return the current state, which must be one of the following values:

UNSENT (numeric value 0)
The object has been constructed.

OPENED (numeric value 1)
The open() method has been successfully invoked. During this state request headers can be set using setRequestHeader() and the request can be made using the send() method.

HEADERS_RECEIVED (numeric value 2)
All redirects (if any) have been followed and all HTTP headers of the final response have been received. Several response members of the object are now available.

LOADING (numeric value 3)
The response entity body is being received.

DONE (numeric value 4)
The data transfer has been completed or something went wrong during the transfer (e.g. infinite redirects).
*/
        RestHelper.sendRequest = function(url, callback, postData) {
            var req = new XMLHttpRequest();
            if (!req) return;
            var method = (postData) ? "POST" : "GET";
            req.open(method, url, true);
            req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
            if (postData)
            {
                req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            }
            req.onreadystatechange = function () {
                if (req.readyState != 4) return;
                if (req.status != 200 && req.status != 304) {
                    //			alert('HTTP error ' + req.status);
                    return;
                }
                callback(req);
            };
            if (req.readyState == 4) return;
            req.send(postData);
        };

        var XMLHttpFactories = [
            function () { return new XMLHttpRequest(); },
            function () { return new ActiveXObject("Msxml2.XMLHTTP"); },
            function () { return new ActiveXObject("Msxml3.XMLHTTP"); },
            function () { return new ActiveXObject("Microsoft.XMLHTTP"); }
        ];

        var createXMLHTTPObject = function () {
            var xmlhttp = false;
            for (var i = 0; i < XMLHttpFactories.length; i++) {
                try {
                    xmlhttp = XMLHttpFactories[i]();
                }
                catch (e) {
                    continue;
                }
                break;
            }
            return xmlhttp;
        };

        return RestHelper;
    } catch (e) {
        alert("RestHelper c'tor " + e.name + " " + e.message);
    }
});