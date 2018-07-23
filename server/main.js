import { Meteor } from 'meteor/meteor';



// var createThumb = function(fileObj, readStream, writeStream) {
// 	transforms image into 300x300px thumbnail
// 	gm(readStream,fileObj.name()).resize('300','300').stream().pipe(writeStream);
// };

// var imageStore = new FS.Store.GridFS("images", {path: "/uploads/images"});
// var thumbStore = new FS.Store.GridFS("thumbs", {path:" /uploads/thumbs", transformWrite: createThumb });
// Images = new FS.Collection("images", {
//   stores: [
// 		imageStore,
// 		thumbStore
//   ],
//   filter: {
//   	allow: {
// 			maxSize: 100000,
//   		contentTypes: ['image/*'],
//   		extensions: ['png']
//   	}
//   }
// });

Images.allow({
	'insert': function () {
		return true;
  },
  'remove': function() {
    return true;
	},
	'download': function() {
		return true;
	}, 
	'update' : function () {
		return true;
},
});
/*
Feedbacks.allow({
	'insert': function () {
		return true;
  },
  'remove': function() {
    return true;
	},
	'download': function() {
		return true;
	}, 
	'update' : function () {
		return true;
},
});*/
Meteor.publish("images", function publishImage(){ 
	return Images.find(); });
//Meteor.publish("feedbacks", function publishImage(){ 
//	return Feedbacks.find(); });
Meteor.startup(() => {
  // code to run on server at startup
});
