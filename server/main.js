import { Meteor } from 'meteor/meteor';

import '../imports/api/colorTemplates.js';

var createThumb = function(fileObj, readStream, writeStream) {
	//transforms image into 300x300px thumbnail
	gm(readStream,fileObj.name()).resize('300','300').stream().pipe(writeStream);
};

Images = new FS.Collection("images", {
  stores: [
  	new FS.Store.GridFS("images", {path: "~/uploads"}),
  	new FS.Store.GridFS("thumbs", { transformWrite: createThumb })
  ],
  filter: {
  	allow: {
  		contentTypes: ['image/*'],
  		extensions: ['png']
  	}
  }
});

Images.allow({
	'insert': function () {
		return true;
	}
});

Meteor.startup(() => {
  // code to run on server at startup
});
