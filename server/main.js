import { Meteor } from 'meteor/meteor';

var createThumb = function(fileObj, readStream, writeStream) {
	//transforms image into 300x300px thumbnail
	gm(readStream,fileObj.name()).resize('300','300').stream().pipe(writeStream);
};

var imageStore = new FS.Store.GridFS("images", {path: "/uploads/images"});
var thumbStore = new FS.Store.GridFS("thumbs", {path:" /uploads/thumbs", transformWrite: createThumb });
Images = new FS.Collection("images", {
  stores: [
		imageStore,
		thumbStore
  ],
  filter: {
  	allow: {
			maxSize: 100000,
  		contentTypes: ['image/*'],
  		extensions: ['png']
  	}
  }
});

Images.allow({
	'insert': function (userId, file) {
		return true;
  },
  'remove': function(unserId, file) {
    return true;
	},
	'download': function(userId, file) {
		return true;
	}
});

Meteor.startup(() => {
  // code to run on server at startup
});
