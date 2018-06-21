import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

var imageStore = new FS.Store.GridFS("images");
Images = new FS.Collection("images", {
    stores: [imageStore]
  });
  
Template.choosePage.helpers({
    action:function() {
    Meteor.publish("images", function(){ return Images.find();});
    }
});

Template.choosePage.events({
    'change #uploadedImage': function(event, template) {
        event.preventDefault();
        FS.Utility.eachFile(event,function(file) {
            Images.insert(file, function (err, fileObj) {

            });
        })
    }
});