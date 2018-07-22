import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

// var imageStore = new FS.Store.GridFS("images");
// Images = new FS.Collection("images", {
//     stores: [imageStore]
//   });
  
Template.choosePage.helpers({
    images: function() {
    return Images.find({"metadata.public": "true"});
    },

    privateImages: function() {
    	console.log(Meteor.userId());
    return Images.find({"metadata.ownerId": Meteor.userId()});
    }
});

Template.choosePage.events({
	'click .img': function() {
		var imageURL = this.url("cropped");
		//Images.remove(this._id);
		var params = {};
		var queryParams = {image: imageURL}
		FlowRouter.go("/color", params, queryParams);
	},
	'click .deleteButton': function() {
		if (confirm("Are you sure you want to delete this template?")) {
			Images.remove(this._id);
		} else {
			
		}
	}
})