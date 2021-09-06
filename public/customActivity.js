'use strict';

define(function (require) {
	var Postmonger = require('postmonger');
	var connection = new Postmonger.Session();
	var payload = {};
	var steps = [
		{ 'key': 'eventdefinitionkey', 'label': 'Event Definition Key' },
		{ 'key': 'idselection', 'label': 'ID Selection' }
	];
	var currentStep = steps[0].key;
	var eventDefinitionKey = '';
	var deFields = [];

	$(window).ready(function () {
		connection.trigger('ready');
		connection.trigger('requestInteraction');
	});

	function initialize(data) {
		if (data) {
			payload = data;
		}
		var hasInArguments = Boolean(
			payload['arguments'] &&
			payload['arguments'].execute &&
			payload['arguments'].execute.inArguments &&
			payload['arguments'].execute.inArguments.length > 0
		);
		var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};
		var idField;
		$.each(inArguments, function(index, inArgument) {
			$.each(inArgument, function(key, val) {
				if (key === 'id') {
					idField = val;
					$('#select-id').val(idField);
				}
			});
		});
		
		document.getElementById('add-branch').addEventListener('click', () => {
			const index = payload.outcomes.length + 1;
			payload.outcomes.push({
				"arguments": {
					"branchResult": "lastBranchKey"+index
				},
				"metaData": {
					"label": `<LABEL FOR PATH ${index}>`
				}
			})
		});
	}

	function onClickedNext() {
		console.log("in customeActivity.js Next button clicked");
		if (currentStep.key === 'idselection') {
			save();
			connection.trigger('updateActivity', payload);
		} else {
			connection.trigger('nextStep');
		}
	}

	function onClickedBack() {
		console.log("in customeActivity.js Back button clicked");
		connection.trigger('prevStep');
	}

	function onGotoStep(step) {
		console.log("in customeActivity.js in onGotoStep func. Step: ");
		console.log(step);
		showStep(step);
		connection.trigger('ready');
	}

	function showStep(step, stepIndex) {
		console.log("in customeActivity.js in showStep func. step: ");
		console.log(step);
		console.log("in customeActivity.js in showStep func. stepIndex: ");
		console.log(stepIndex);

		if (stepIndex && !step) {
			step = steps[stepIndex - 1];
		}

		currentStep = step;

		$('.step').hide();

		switch (currentStep.key) {
			case 'eventdefinitionkey':
				$('#step1').show();
				$('#step1 input').focus();
				break;
			case 'idselection':
				$('#step2').show();
				$('#step2 input').focus();
				break;
		}
	}

	function requestedInteractionHandler(settings) {
		console.log("in customeActivity.js in requestedInteractionHandler func. settings: ");
		console.log(settings);

		try {
			eventDefinitionKey = settings.triggers[0].metaData.eventDefinitionKey;
			$('#select-entryevent-defkey').val(eventDefinitionKey);

			$('#select-id-dropdown').hide();
			$('#select-id').show();
		} catch (e) {
			console.error(e);
			$('#select-id-dropdown').hide();
			$('#select-id').show();
		}
	}

	function save() {
		payload['arguments'] = payload['arguments'] || {};
		payload['arguments'].execute = payload['arguments'].execute || {};

		var idField = deFields.length > 0 ? $('#select-id-dropdown').val() : $('#select-id').val();
		console.log("in customeActivity.js in save func, idField: ");

		console.log("in customeActivity.js in save func, payload: ");
		console.log(JSON.stringify(payload));
		console.log("in customeActivity.js in save func, EventDefinitionKey: ");



		payload['metaData'] = payload['metaData'] || {};
		payload['metaData'].isConfigured = true;

		payload['arguments'].execute.inArguments = [{
			"id": idField,
			"EventDefinitionKey": eventDefinitionKey,
			"Email": "{{Event." + eventDefinitionKey + ".Email}}",
			"Name": "{{Event." + eventDefinitionKey + ".Name}}",
			"ContactKey": "{{Event." + eventDefinitionKey + ". ContactKey}}"
		}];
		connection.trigger('updateActivity', payload);
	}

	connection.on('initActivity', initialize);
	connection.on('clickedNext', onClickedNext);
	connection.on('clickedBack', onClickedBack);
	connection.on('gotoStep', onGotoStep);
	connection.on('requestedInteraction', requestedInteractionHandler);
});
