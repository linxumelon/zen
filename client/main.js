import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import App from '../imports/ui/App.js';

Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images", {path: "~/upload"})]
});

Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'))
});