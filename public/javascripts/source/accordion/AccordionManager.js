// @author Andrew

define([],
	function () {
		'use strict';

		var ret = function AccordionManager() {
			try {

				var self = this;
				var accordionSelector = $('#accordion-east');
				var currentType = null;
				var panes = [];

				self.create = function () {
					/*
					$('#accordion-east > h3[role="tab"]').remove();
					$('#accordion-east > div[role="tabpanel"]').remove();
					*/
					// alert($('#accordion-east > h3[role="tab"]').prop('id'));
				};

				self.refresh = function () {

					accordionSelector.accordion('refresh');

					accordionSelector.accordion('option', 'active', 0);
				};

				self.updateAccordion = function (control) {

					var previousConstructors,
						newConstructors,
						panesToUpdate,
						panesToAdd,
						panesToRemove;

					if (currentType) {
						previousConstructors = app.lib[currentType].allAccordionPanes;
					}

					currentType = control._vertex.type;

					if (currentType) {
						// get the difference between the current and previous type
						/*
												// remove the panes that need to be removed
												for (var i = 0; i < panesToRemove.length; i++) {
													// remove the pane
													var paneToRemove = _.where(panes, { paneConstructor: panesToRemove[i] });
						
													if (paneToRemove.length > 0) {
						
														$('#accordion-east > h3[aria-controls="accordion-east-div-' + paneToRemove[0].paneId + '"]').remove();
						
														$('#accordion-east-div-' + paneToRemove[0].paneId).remove();
						
														// update the panes array that are no longer needed
														panes = _.filter(panes, function (pane) { pane.paneId === paneToRemove[0].paneId; });
													}
												}
						*/

						$('#accordion-east > h3').remove();

						$('#accordion-east > div').remove();

						newConstructors = app.lib[currentType].allAccordionPanes;

						for (var i = 0; i < newConstructors.length; i++) {

							new newConstructors[i]({ paneId: _.uniqueId()});
						}

						accordionSelector.accordion('refresh');


						/*
						panesToUpdate = _.intersection(newConstructors, previousConstructors);

						panesToAdd = _.difference(newConstructors, panesToUpdate);

						panesToRemove = _.difference(previousConstructors, panesToUpdate);


						// add and panes that need to be added
						for (var i = 0; i < panesToAdd.length; i++) {

							var paneConstructor = panesToAdd[i];

							var paneId = _.uniqueId();

							var paneInstance = new paneConstructor({ paneId: paneId });

							panes.push({
								paneId: paneId,
								paneInstance: paneInstance,
								paneConstructor: paneConstructor
							});

							//	accordionSelector.accordion('refresh');

							//	paneInstance.updateHTMLControls();
						}


						
						// update the panes in the intersection
						for (var i = 0; i < panesToUpdate.length; i++) {
							// get the instance object for this constructor
							var paneToUpdate = _.where(panes, { paneConstructor: panesToUpdate[i] });

							if (paneToUpdate.length > 0) {
								// there should only be one
								paneToUpdate[0].paneInstance.updateHTMLControls();
							}
						}
						
						accordionSelector.accordion('refresh');

						for (i = 0; i < panes.length; i++) {

							panes[i].paneInstance.updateHTMLControls();
						}

						*/

					}

				};

				self.updateVertexControlPropertyAsInt = function (property) {

					var theInput = document.getElementById(property);
					var theValue = parseInt(theInput.value);

					var control = app.selectedControl;

					control['_' + property] = theValue;
				};

				self.updateVertexControlProperty = function (property) {

					var theInput = document.getElementById(property);
					var theValue = theInput.value;

					var control = app.selectedControl;

					control['_' + property] = theValue;
				};

				self.updateHTMLControlWithVertexProperty = function (property) {

					var control = app.selectedControl;

					var selector = document.getElementById(property);

					if (control && selector) {

						selector.value = control._vertex[property];
					}
				};

				self.updateHTMLControl = function (property) {

					var control = app.selectedControl;

					var selector = document.getElementById(property);

					console.log(property);

					if (control && selector) {

						selector.value = control['_' + property];
					}
				};

				self.create();
			}
			catch (e) {
				alert('AccordionManager.js ctor: ' + e.name + ' ' + e.message);
			}
		};

		return ret;
	});
