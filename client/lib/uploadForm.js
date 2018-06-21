import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.uploadForm.helpers({
	"submitNewUpload": function(event) {
		const isPublic = document.getElementById("shareSettings").checked;
		const file = $('#uploadedImage').get(0).files[0];
		if (isPublic) {
			Images.insert(fsFile, function(err, fileObj) {
				if (err) {
					console.log("error:" + err);
				} else {
					FlowRouter.go('/color');
				}
			});
		} else {
			FlowRouter.go('/color');
		}
	}
})

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