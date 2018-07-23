import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

Template.admin.helpers({
    images: function() {
    return Images.find({"metadata.isFeedback": "true"});
    },

    privateImages: function() {
    	console.log(Meteor.userId());
    return Images.find({"metadata.ownerId": Meteor.userId()});
    }
});