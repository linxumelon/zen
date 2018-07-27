import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

// var imageStore = new FS.Store.GridFS("images");
// Images = new FS.Collection("images", {
//     stores: [imageStore]
//   });
  
Template.coloredArt.helpers({
    coloredimages: function() {
    return Images.find({"metadata.isColored": "true"});
    }
});
