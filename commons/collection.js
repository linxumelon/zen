
var createThumb = function(fileObj, readStream, writeStream) {
  //  transforms image into 300x300px thumbnail
  gm(readStream,fileObj.name()).resize('300','300' + '^').gravity('Center').extent('300', '300').stream().pipe(writeStream);
};

var imageStore = new FS.Store.GridFS("images");
var thumbStore = new FS.Store.GridFS("thumbs", {path:" /uploads/thumbs", transformWrite: createThumb });
Images = new FS.Collection("images", {
  stores: [
		imageStore,
		thumbStore
  ],
  filter: {
  	allow: {
  		contentTypes: ['image/*'],
  		extensions: ['png']
  	}
  }
});