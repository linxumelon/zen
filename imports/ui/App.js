import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
 
import { ColorTemplates } from '../api/ColorTemplates.js';

export default class App extends Component {
  render() {
      return (
        <div>
          <h1>
            <header>
              ZEN COLORING
            </header>
          </h1>
    
          <div id="left">
            <ul>
                <img src="images/sample.jpg"/>
            </ul>
          </div>
    
          <div id="right">
            <ul>
              <p className="subTheme">
                <img src="images/IMG_multiArea.jpg"/>
                  Multi-Area Selection
              </p>

              <p className="descTheme">
                Select multiple areas to color simultaneously.
              </p> 

              <p className="subTheme">
                <img src="images/IMG_lineSelection.jpg"/>
                  Line Coloring
              </p>
              <p className="descTheme">
                The lines can be colored as well.
              </p>
          
              <p className="subTheme">
                <img src="images/IMG_upload.jpg"  />
                  Upload
              </p>
              <p className="descTheme">
                Upload your own templates; Use templates contributed by other users.
              </p>
          
              <p className="subTheme">
                <img src="images/IMG_save.jpg"/>
                  Save
              </p>
              <p className="descTheme">
                Save your art, and do whatever you want with it.
              </p>
            </ul>
          </div>
    
          <div className ="buttons">
              <a href="chooseTemplate.html">
              <button>
                <p className="buttonTop">START</p>
                <p className="buttonBottom">Choose an existing template</p>
              </button>
              </a>

              <a href="upload.html">
              <button>
                <p className="buttonTop">UPLOAD</p>
                <p className="buttonBottom">Upload your own template</p>
              </button>
              </a>
          </div>
      </div>
      )
  }

}