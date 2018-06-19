import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Template } from 'meteor/templating';

import App from '../imports/ui/App.js';

Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images", {path: "~/uploads"})]
});
/*
Template.App.events({
	'submit .newImage': function(event) {
		event.preventDefault();
		var image = $('#uploadedImage').get(0).files[0];
		FS.Utility.eachFile(event, function(file) {
			Images.insert(file, function(err, fileObj) {
				// Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
			});
		});
	}
});*/

Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'))
});