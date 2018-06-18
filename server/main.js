import { Meteor } from 'meteor/meteor';

import '../imports/api/colorTemplates.js';

Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
});
Meteor.startup(() => {
  // code to run on server at startup
});
