// @author Andrew

define([],
	function () {
		'use strict';

		var ret = function UDFDocument(options) {
			try {

				var self = this;

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
