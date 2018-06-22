import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {$,jQuery} from 'meteor/jquery';
import imageStore from '../../commons/collection.js';

Meteor.subscribe('imageStore')
;
Template.uploadForm.events({
	'submit form': function() {
		event.preventDefault();
		const isPublic = document.getElementById("shareSettings").checked;
		var file = event.target.uploadedImage;
		console.log(isPublic);			
		console.log("change has happened to file input");
		FS.Utility.eachFile(event,function(file) {
			console.log("image being submitted");
			var newFile = new FS.file(file);
			Images.insert(newFile, function (err, fileObj) {
				if (err) {
					console.log("error" + err.reason);
				} else {
					console.log("image submitted");
					var userId = Meteor.userId();
					var imagesURL = {
						"startColoring.image": "cfs/files/images" + filOebj_.id
					};
					Meteor.users.update(userId ,{$seL: imagesURL});
				}
			});
		});
	},
	// "submit #startColoring": function(event) {
	// 	event.preventDefault();
	// 	console.log("Image submitted");
	// 	const isPublic = document.getElementById("shareSettings").checked;
	// 	const file = $('#uploadedImage').get(0).files[0];
	// 	if (isPublic) {
	// 		Images.insert(fsFile, function(err, fileObj) {
	// 			if (err) {
	// 				console.log("error:" + err.reason);
	// 			} else {
	// 				FlowRouter.go(colorPage);
	// 			}
	// 		});
	// 	} else {
	// 		FlowRouter.go(colorPage);
	// 	}
	// },
	// 'change #fileInput': function(event, template) {
	// 		event.preventDefault();
	// 		console.log("change has happened to file input");
	// 		FS.Utility.eachFile(event,function(file) {
	// 			console.log("image being submitted");
	// 			var newFile = new FS.file(file);
	// 			Images.insert(newFile, function (err, fileObj) {
	// 				if (err) {
	// 					console.log("error" + err.reason);
	// 				} else {
	// 					console.log("image submitted");
	// 					var userId = Meteor.userId();
	// 					var imagesURL = {
	// 						"startColoring.image": "cfs/files/images" + filOebj_.id
	// 					};
	// 					Meteor.users.update(userId ,{$seL: imagesURL});
	// 				}
	// 			});
	// 		});
	// 	}
});


/*
class UploadForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isPublic: false,
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleInputChange(event) {
    this.setState({
    	isPublic: !this.state.isPublic
    });
	}

	handleSubmit(event) {
		let image = event.target.files[0];
		if (this.state.isPublic) {
			fsFile = new FS.File(image);
			Images.insert(fsFile, function(err, fileObj) {
				if (!err) {
					const imageID = fileObj._id;
				}
			});
		} else {

		}
	}

	render() {
		return (
			<div>
	      <div className="uploadContainer">
	        <p> Upload a .png file with no background </p>
	        <form onSubmit={this.handleSubmit}>
	          <input type="file" name="uploadedImage" id="uploadedImage"
	          	ref={input => {
	          		this.fileInput = input;
	          	}}
	          />
	          <p><input type="checkbox" name="shareSettings" checked={this.state.isPublic} onChange={this.handleInputChange}/> Make this template public </p>      
	          <input type="submit" name="startColoring" value="Start Coloring"/>
	        </form>
	      </div>
	    </div>
	  );  
	}
}

ReactDom.render(
	<FileInput />,
	document.getElementById('root')
);*/