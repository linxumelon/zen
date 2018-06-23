var imageStore = new FS.Store.GridFS("images", {path: "/uploads/images"});
// var thumbStore = new FS.Store.GridFS("thumbs", {path:" /uploads/thumbs", transformWrite: createThumb });
Images = new FS.Collection("images", {
  stores: [
		imageStore,
		// thumbStore
  ],
  filter: {
  	allow: {
  		contentTypes: ['image/*'],
  		extensions: ['png']
  	}
  }
});