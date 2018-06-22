var imageStore = new FS.Store.GridFS("images", {path: "/uploads/images"});
// var thumbStore = new FS.Store.GridFS("thumbs", {path:" /uploads/thumbs", transformWrite: createThumb });
Images = new FS.Collection("images", {
  stores: [
		imageStore,
		// thumbStore
  ],
  filter: {
  	allow: {
			maxSize: 100000,
  		contentTypes: ['image/*'],
  		extensions: ['png']
  	}
  }
});