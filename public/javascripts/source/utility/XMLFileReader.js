/**
 * XMLFileReader.js
 * @author Andrew
 */

define([], function () {

    'use strict';

    try {

        return function XMLFileReader(options) {

            var self = this;

            options ? self.options = options : options = {};

            self.mergeCDATA = typeof(options.mergeCDATA) !== 'undefined' ? options.mergeCDATA : true; // extract cdata and merge with text
            self.grokAttr = typeof(options.grokAttr) !== 'undefined' ? options.grokAttr : true; // convert truthy attributes to boolean, etc
            self.grokText = typeof(options.grokText) !== 'undefined' ? options.grokText : true; // convert truthy text/attr to boolean, etc
            self.normalize = typeof(options.normalize) !== 'undefined' ? options.normalize : true; // collapse multiple spaces to single space
            self.xmlns = typeof(options.xmlns) !== 'undefined' ? options.xmlns : true; // include namespaces as attribute in output
            self.namespaceKey = options.namespaceKey || '_ns'; // tag name for namespace objects
            self.textKey = options.textKey || '_text'; // tag name for text nodes
            self.valueKey = options.valueKey || '_value'; // tag name for attribute values
            self.attrKey = options.attrKey || '_attr'; // tag for attr groups
            self.cdataKey = options.cdataKey || '_cdata'; // tag for cdata nodes (ignored if mergeCDATA is true)
            self.attrsAsObject = typeof(options.attrsAsObject) !== 'undefined' ? options.attrsAsObject : true; // if false, key is used as prefix to name, set prefix to '' to merge children and attrs.
            self.stripAttrPrefix = typeof(options.stripAttrPrefix) !== 'undefined' ? options.stripAttrPrefix : true; // remove namespace prefixes from attributes
            self.stripElemPrefix = typeof(options.stripElemPrefix) !== 'undefined' ? options.stripElemPrefix : true; // for elements of same name in diff namespaces, you can enable namespaces and access the nskey property
            self.childrenAsArray = typeof(options.childrenAsArray) !== 'undefined' ? options.childrenAsArray : true; // force children into arrays
//            self.rootPath = options.rootPath || null;

            var prefixMatch = new RegExp(/(?!xmlns)^.*:/);
            var trimMatch = new RegExp(/^\s+|\s+$/g);

            self.handleFiles = function (files, rootPath) {

                self.rootPath = rootPath;

                // Check for the various File API support.
                if (window.FileReader && files && files.length > 0) {
                    // FileReader is supported.

                    var reader = new FileReader();
                    // Read file into memory as UTF-8      
                    reader.readAsText(files[0]);
                    // Handle errors load
                    reader.onload = self.loadHandler;
                    reader.onerror = self.errorHandler;
                } else {
                    alert('FileReader is not supported in this browser.');
                }
            };

            self.loadHandler = function (event) {

                var fileData = event.target.result;
                app.xmlFragment = self.parseString(fileData);
            };

            self.errorHandler = function (evt) {

                if (evt.target.error.name == 'NotReadableError') {
                    alert('Cannot read file !');
                }
            };

            self.grokType = function (sValue) {
                if (/^\s*$/.test(sValue)) {
                    return null;
                }
                if (/^(?:true|false)$/i.test(sValue)) {
                    return sValue.toLowerCase() === "true";
                }
                if (isFinite(sValue)) {
                    return parseFloat(sValue);
                }
                return sValue;
            };

            self.parseString = function (xmlString, opt) {
                return self.parseXML(self.stringToXML(xmlString), opt);
            }

            self.parseXML = function (oXMLParent, opt) {

                var vResult = {},
                    nLength = 0,
                    sCollectedTxt = "";

                // parse namespace information
                if (self.xmlns && oXMLParent.namespaceURI) {
                    vResult[self.namespaceKey] = oXMLParent.namespaceURI;
                }

                // parse attributes
                // using attributes property instead of hasAttributes method to support older browsers
                if (oXMLParent.attributes && oXMLParent.attributes.length > 0) {
                    var vAttribs = {};

                    for (nLength; nLength < oXMLParent.attributes.length; nLength++) {
                        var oAttrib = oXMLParent.attributes.item(nLength);
                        vContent = {};
                        var attribName = '';

                        if (self.stripAttrPrefix) {
                            attribName = oAttrib.name.replace(prefixMatch, '');

                        } else {
                            attribName = oAttrib.name;
                        }

                        if (self.grokAttr) {
                            vContent[self.valueKey] = self.grokType(oAttrib.value.replace(trimMatch, ''));
                        } else {
                            vContent[self.valueKey] = oAttrib.value.replace(trimMatch, '');
                        }

                        if (self.xmlns && oAttrib.namespaceURI) {
                            vContent[self.namespaceKey] = oAttrib.namespaceURI;
                        }

                        if (self.attrsAsObject) { // attributes with same local name must enable prefixes
                            vAttribs[attribName] = vContent;
                        } else {
                            vResult[self.attrKey + attribName] = vContent;
                        }
                    }

                    if (self.attrsAsObject) {
                        vResult[self.attrKey] = vAttribs;
                    } else { }
                }

                // iterate over the children
                if (oXMLParent.hasChildNodes()) {
                    for (var oNode, sProp, vContent, nItem = 0; nItem < oXMLParent.childNodes.length; nItem++) {
                        oNode = oXMLParent.childNodes.item(nItem);

                        if (oNode.nodeType === 4) {
                            if (self.mergeCDATA) {
                                sCollectedTxt += oNode.nodeValue;
                            } else {
                                if (vResult.hasOwnProperty(self.cdataKey)) {
                                    if (vResult[self.cdataKey].constructor !== Array) {
                                        vResult[self.cdataKey] = [vResult[self.cdataKey]];
                                    }
                                    vResult[self.cdataKey].push(oNode.nodeValue);

                                } else {
                                    if (self.childrenAsArray) {
                                        vResult[self.cdataKey] = [];
                                        vResult[self.cdataKey].push(oNode.nodeValue);
                                    } else {
                                        vResult[self.cdataKey] = oNode.nodeValue;
                                    }
                                }
                            }
                        } /* nodeType is "CDATASection" (4) */
                        else if (oNode.nodeType === 3) {
                            sCollectedTxt += oNode.nodeValue;
                        } /* nodeType is "Text" (3) */
                        else if (oNode.nodeType === 1) { /* nodeType is "Element" (1) */

                            if (nLength === 0) {
                                vResult = {};
                            }

                            // using nodeName to support browser (IE) implementation with no 'localName' property
                            if (self.stripElemPrefix) {
                                sProp = oNode.nodeName.replace(prefixMatch, '');
                            } else {
                                sProp = oNode.nodeName;
                            }

                            vContent = self.parseXML(oNode);

                            if (vResult.hasOwnProperty(sProp)) {
                                if (vResult[sProp].constructor !== Array) {
                                    vResult[sProp] = [vResult[sProp]];
                                }
                                vResult[sProp].push(vContent);

                            } else {
                                if (self.childrenAsArray) {
                                    vResult[sProp] = [];
                                    vResult[sProp].push(vContent);
                                } else {
                                    vResult[sProp] = vContent;
                                }
                                nLength++;
                            }
                        }
                    }
                } else if (!sCollectedTxt) { // no children and no text, return null
                    if (self.childrenAsArray) {
                        vResult[self.textKey] = [];
                        vResult[self.textKey].push(null);
                    } else {
                        vResult[self.textKey] = null;
                    }
                }

                if (sCollectedTxt) {
                    if (self.grokText) {
                        var value = self.grokType(sCollectedTxt.replace(trimMatch, ''));
                        if (value !== null && value !== undefined) {
                            vResult[self.textKey] = value;
                        }
                    } else if (self.normalize) {
                        vResult[self.textKey] = sCollectedTxt.replace(trimMatch, '').replace(/\s+/g, " ");
                    } else {
                        vResult[self.textKey] = sCollectedTxt.replace(trimMatch, '');
                    }
                }

                return vResult;
            }


            // Convert xmlDocument to a string
            // Returns null on failure
            self.xmlToString = function (xmlDoc) {
                try {
                    var xmlString = xmlDoc.xml ? xmlDoc.xml : (new XMLSerializer()).serializeToString(xmlDoc);
                    return xmlString;
                } catch (err) {
                    return null;
                }
            }

            // Convert a string to XML Node Structure
            // Returns null on failure
            self.stringToXML = function (xmlString) {
                try {
                    var xmlDoc = null;

                    if (window.DOMParser) {

                        var parser = new DOMParser();
                        xmlDoc = parser.parseFromString(xmlString, "text/xml");

                        return xmlDoc;
                    } else {
                        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                        xmlDoc.async = false;
                        xmlDoc.loadXML(xmlString);

                        return xmlDoc;
                    }
                } catch (e) {
                    return null;
                }
            }
        };
    }
    catch (e) {
        alert('XMLFileReader ctor: ' + e.message);
    }
});