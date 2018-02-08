// @author Andrew

define(['javascripts/source/document/UserDocument'],
	function (UserDocument) {
		'use strict';

		var ret = function UDFDocument(options) {
			try {

				var self = this;
                // call parent constructor
                UserDocument.call(self, options);

				self.udfControl = options.udfControl;
                // setup the inheritance chain
                UDFDocument.prototype = UserDocument.prototype;
                UDFDocument.prototype.constructor = UserDocument;
			}
			catch (e) {
				alert('UDFDocument.js ctor: ' + e.name + ' ' + e.message);
			}
		};

		return ret;
	});
