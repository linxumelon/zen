import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {$,jQuery} from 'meteor/jquery';
import imageStore from '../../commons/collection.js';

Template.reportPage.events({
	'submit form': function(event) {
		event.preventDefault();
		text = document.getElementById("message").value;
		var newFile = event.target.fileInput;
		var tempFile = document.getElementById('screenshot');
		var file = tempFile.files[0];
		console.log(typeof(file));
		fsFile = new FS.File(file);
		fsFile.metadata = {
			public: "false",
			ownerId: "nil",
			isFeedback: "true",
			isColored: "false",
			message: text
		};
		console.log(fsFile.metadata.message);
		Images.insert(fsFile, function (err, result) {
				if (err) {
					console.log("error" + err.reason);
				} else {
					console.log(result);
					// var userId = Meteor.userId();
					// var imagesURL = {
					// 	"startColoring.image": "cfs/files/images" + filOebj_.id
					// };
					// Meteor.users.update(userId ,{$seL: imagesURL});
					Images.on('uploaded', function (fileObj) {
						console.log("image uploaded");
					});
				}

			});
		alert("Thank you for submitting feedback!");
	}
});
