import React, { Component } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';

import Border from './Border';

// class responsible for drawing the viewport based on props passed down
class ViewPort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      multiplier: 2.5, // multiplier to increase the scale of the map
      offset: 0 // used to push viewport to the middle
    };
  }

  componentDidMount() {
    // adds event listener to catch resizing
    window.addEventListener('resize', this.updateWindow);
    this.updateWindow();
  }

  render() {
    return (
      <div className="App">
        <Stage width={window.innerWidth} height={window.innerHeight * .7}>
          <Layer>
            <Border multiplier={this.state.multiplier} offset={this.state.offset} />
            {this.generateStops()}
            {this.drawDriver()}
            {this.drawCompletedLegs()}
            {this.drawCompletedLegToDriver()}
          </Layer>
        </Stage>
      </div>
    );
  }



  // function to generates a rect for every stop
  generateStops = () => {
    let stopsArr = [];
    Object.values(this.props.stops).forEach((stop) => {
      let length = 10;
      stopsArr.push(
        <Rect
          /* scaling the coordintes by x5 and shifting to center*/
          x={this.state.offset + stop.x * this.state.multiplier - length / 2}
          y={stop.y * this.state.multiplier - length / 2}
          width={length}
          height={length}
          fill="red"
          key={stop.name}
        />
      )
    });
    return stopsArr;
  }

  // function to draw the driver
  drawDriver = () => {
    let length = 15;
    return (
      <Rect
        /* scaling the coordintes by x5 and shifting to center*/
        x={this.state.offset + this.props.driver.x * this.state.multiplier - length / 2}
        y={this.props.driver.y * this.state.multiplier - length / 2}
        width={length}
        height={length}
        fill="blue"
      />
    )
  }

  // function to draw the line from the last completed leg to driver
  drawCompletedLegToDriver = () => {
    let currentLeg = this.findCurrentLeg();
    // draw line from legStart to driver
    let legStartX = this.state.offset + this.props.stops[currentLeg.startStop].x * this.state.multiplier;
    let legStartY = this.props.stops[currentLeg.startStop].y * this.state.multiplier;
    let legEndX = this.state.offset + this.props.driver.x * this.state.multiplier;
    let legEndY = this.props.driver.y * this.state.multiplier;
    return (
      <Line
        key={currentLeg.legID}
        x={0}
        y={0}
        points={[legStartX, legStartY, legEndX, legEndY]}
        stroke="green"
        strokeWidth={5}
      />
    )
  }

  // function to draw the completed legs of the driver
  drawCompletedLegs = () => {
    // find the current leg node
    let currentLeg = this.findCurrentLeg();
    let currentLegNode = this.props.legs.find(currentLeg);
    // create an array containing the completed lines
    let lineArr = [];
    lineArr = lineArr.concat(this.traceBackToStart(currentLegNode, []));
    return (
      <Line
        key={"LineCats"}
        x={this.state.offset}
        y={0}
        points={lineArr}
        stroke="green"
        strokeWidth={5}
      />
    )
  }

  // tail call recursive helper function to trace route back to beginning
  traceBackToStart = (currLeg, returnArr) => {
    // base case
    if (currLeg === null) {
      return returnArr;
    }
    // recursive case
    let legEndX = this.props.stops[currLeg.data.startStop].x * this.state.multiplier;
    let legEndY = this.props.stops[currLeg.data.startStop].y * this.state.multiplier;
    // creates a line connecting the stops of the current leg
    returnArr = returnArr.concat([legEndX, legEndY]);
    return this.traceBackToStart(currLeg.prev, returnArr);
  }

  // function to get the current dimensions of the window
  updateWindow = () => {
    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      offset: window.innerWidth / 2 - (200 * this.state.multiplier / 2)
    })
  }

  // function to find the current leg the driver is on
  findCurrentLeg = () => {
    for (let leg of this.props.rawLegs) {
      if (leg.legID === this.props.driver.activeLegID) {
        return leg;
      }
    }
  }
}

export default ViewPort;