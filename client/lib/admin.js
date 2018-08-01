import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

Template.admin.helpers({
    images: function() {
    return Images.find({"metadata.isFeedback": "true"});
    },
    allimages: function() {
    	return Images.find();
    }
});

Template.admin.events({
	'click .img': function() {
		
		Images.remove(this._id);
	}
})