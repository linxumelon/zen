import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images", {path: "~/uploads"})]
});


