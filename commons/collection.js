
var createThumb = function(fileObj, readStream, writeStream) {
  //  transforms image into 300x300px thumbnail
  gm(readStream,fileObj.name()).resize('300','300' + '^').gravity('Center').extent('300', '300').stream().pipe(writeStream);
};

var crop = function(fileObj, readStream, writeStream) {
  //  transforms image into 700x700px square
  gm(readStream,fileObj.name()).resize('700','700' + '^').gravity('Center').extent('700', '700').stream().pipe(writeStream);
};

var imageStore = new FS.Store.GridFS("images", {transformWrite: crop });
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