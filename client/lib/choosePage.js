import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

// var imageStore = new FS.Store.GridFS("images");
// Images = new FS.Collection("images", {
//     stores: [imageStore]
//   });
  
Template.choosePage.helpers({
    images: function() {
    return Images.find();
    }
});

Template.choosePage.events({
	'click .pure-u-1-4': function() {
		var imageURL = this.url("cropped");
		Images.remove(this._id);
		var params = {};
		var queryParams = {image: imageURL}
		//FlowRouter.go("/color", params, queryParams);
	}
})