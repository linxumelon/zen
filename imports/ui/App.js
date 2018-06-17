import React, { Component } from 'react';

export default class App extends Component {
  constructor() {
    super();
  }

  handleClickOnStartButton() {
    return (
      <div>
        <h1>
          <div class = "theme">
            ZEN COLORING
          </div>
        </h1>
        
        <div class="coloringBody">
          <div class="vert-bar">
            <canvas id="picker"></canvas>
              <br></br>
              <input id="color" value="54aedb"></input>

                const KellyColorPicker = {
                  place: 'picker'，
                  input: 'color',
                  size : 150
                
            </div>
  
            <div class="pickButton">
              <button>Brush</button>
              <button>Fill</button>
            </div>
               
            <div class="sizeSlider">
              <p> Brush size </p>
                <input type="range" min="1" max="100" value="50" class="slider" id="myRange"></input>
            </div>

            <div class="opacitySlider">
              <p> Brush opacity </p>
              <input type="range" min="1" max="100" value="50" class="slider" id="myRange"></input>
            </div>
         
            <p> Color Lineart </p>
            <div class="pickButton">
              <button>On</button>
              <button>Off</button>
            </div>
          </div>
  
          <div class="horiz-bar">
            <button><img src="https://d30y9cdsu7xlg0.cloudfront.net/png/177491-200.png" style="width:50px;height:50px;-webkit-filter: invert(100%);"/></button>
            <button><img src="https://d30y9cdsu7xlg0.cloudfront.net/png/189086-200.png" style="width:52px;height:50px;-webkit-filter: invert(100%);"/></button>
            <button><img src="https://d30y9cdsu7xlg0.cloudfront.net/png/189086-200.png" style="width:52px;height:50px;-webkit-transform: scaleX(-1);
            transform: scaleX(-1);-webkit-filter: invert(100%);"/></button>
            <button><img src="http://simpleicon.com/wp-content/uploads/zoom-in.png" style="width:30px;height:30px;-webkit-filter: invert(100%); margin: 10px;"/>	 </button>
            <button><img src="http://simpleicon.com/wp-content/uploads/zoom-out.png" style="width:30px;height:30px;-webkit-filter: invert(100%); margin: 10px;"/></button>
            <div class="pickButton" style="float:left;">
              <button> Select </button>
              <button> De-select </button>
            </div>
            <button style="height:53px;padding-left:10px;padding-right:10px;"> Save </button>
            </div>
    </div>
    )
   
  }
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
              <button onClick={this.handleClickOnStartButton.bind(this)}>
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

 