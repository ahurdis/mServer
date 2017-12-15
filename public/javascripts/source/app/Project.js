// @author Andrew

define([],
	function () {
		'use strict';

		var ret = function Project() {
			try {
				var self = this;

			}
			catch (e) {
				alert('Project.js ctor: ' + e.name + ' ' + e.message);
			}
		};

		return ret;
	});
