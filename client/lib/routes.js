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
	waitOn: function() {
		return Meteor.subscribe('images');
	},
	action: function() {
		BlazeLayout.render( 'applicationLayout', {
			header: 'headerTemplate',
			main: 'uploadForm',
			// area: 'display'
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

FlowRouter.route( '/tutorial', {
	action: function() {
		BlazeLayout.render( 'applicationLayout', {
			header: 'headerTemplate',
			main: 'tutorial'
		});
	},
	name: 'tutorial'
});

FlowRouter.route( '/reportPage', {
	action: function() {
		BlazeLayout.render( 'applicationLayout', {
			header: 'headerTemplate',
			main: 'reportPage'
		});
	},
	name: 'reportPage'
});

FlowRouter.route( '/admin', {
	action: function() {
		BlazeLayout.render( 'applicationLayout', {
			header: 'headerTemplate',
			main: 'admin'
		});
	},
	name: 'admin'
});

FlowRouter.route( '/gallery', {
	action: function() {
		BlazeLayout.render( 'applicationLayout', {
			header: 'headerTemplate',
			main: 'coloredArt'
		});
	},
	name: 'gallery'
});
