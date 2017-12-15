// @author Andrew

define([],
	function () {
		'use strict';

		var ret = function UserDocument(options) {
			try {

				var self = this;
				// when was this document created
				self.createdDate = new Date();
				// who created this document
				self.creator = options.creator || 'defaultCreator';
				// what type of document is this
				self.type = options.type || 'defaultType';
				// is the state of this document current
				self.isCurrent = options.isCurrent || false;
				// the name of this document
				self.name = options.name || 'New Document';
				// the ID of the tab's DIV item HTML control
				self.tabID = options.tabID || '';
				// the ID of the canvas HTML control
				self.canvasID = options.canvasID || '';
				// the CanvasBase object that this document represents
				self.canvas = options.canvas || null;
			}
			catch (e) {
				alert('UserDocument.js ctor: ' + e.name + ' ' + e.message);
			}
		};

		return ret;
	});
