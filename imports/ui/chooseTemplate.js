import { Template } from 'meteor/templating';
import './chooseTemplate.html';
import Images from '../../client/main.js';

Template.body.helpers({
    images:Images.find()
});