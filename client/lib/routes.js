import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route( '/', {
	action: function() {
		BlazeLayout.render( 'applicationLayout', {
			header: 'headerTemplate',
			main: 'homePage'
		});
	},
	name: 'home'
});

FlowRouter.route( '/choose-templates', {
	action: function() {
		BlazeLayout.render( 'applicationLayout', {
			header: 'headerTemplate',
			main: 'choosePage'
		});
	},
	name: 'choosePage'
});

FlowRouter.route( '/upload', {
	action: function() {
		BlazeLayout.render( 'applicationLayout', {
			header: 'headerTemplate',
			main: 'uploadForm'
		});
	},
	name: 'upload'
});

FlowRouter.route( '/color', {
	action: function() {
		BlazeLayout.render( 'applicationLayout', {
			header: 'headerTemplate',
			main: 'colorPage'
		});
	},
	name: 'colorPage'
});