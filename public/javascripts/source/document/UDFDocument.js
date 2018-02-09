// @author Andrew

define(['javascripts/source/graph/GraphStorage',
		'javascripts/source/document/UserDocument'],
	function (GraphStorage, UserDocument) {
		'use strict';

		var ret = function UDFDocument(options) {
			try {

				var self = this;
				// call parent constructor
				UserDocument.call(self, options);

				self.udfControl = options.udfControl;

				self.getControlName = function () {
					return self.name.replace(' ', '');
				};

				self.onSave = function () {
					self.publishControl();
				};

				self.publishControl = function () {
					// add an icon 
					var userDocumentName = self.getControlName();

					if (app.lib[userDocumentName] === undefined) {
						// add it to control library 
						app.addControlIcon(userDocumentName);
						// now update the name of the control should it exist
						if (self.udfControl) {
							self.udfControl._instance = userDocumentName;
							self.udfControl._vertex.insertProperty('instance', userDocumentName);
							self.canvas.render();
						}
					} else {
						delete app.lib[userDocumentName];
					}

					app.addControlToLibrary(self);
				};

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
