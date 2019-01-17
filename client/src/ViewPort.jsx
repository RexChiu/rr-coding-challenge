import React, { Component } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';


// class responsible for drawing the viewport based on props passed down
class ViewPort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      multiplier: 2.8, // multiplier to increase the scale of the map
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
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <Layer>
            {this.drawBorder()}
            {this.generateStops()}
            {this.drawDriver()}
            {this.drawCompletedLegs()}
          </Layer>
        </Stage>
      </div>
    );
  }

  // function to draw a black border around the grid
  drawBorder = () => {
    return (<Line
      key="Cats"
      x={this.state.offset}
      y={0}
      points={[0, 0, 200 * this.state.multiplier, 0, 200 * this.state.multiplier, 200 * this.state.multiplier, 0, 200 * this.state.multiplier]}
      stroke="black"
      closed
    />);
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

  // function to draw the completed legs of the driver
  drawCompletedLegs = () => {
    // using array of the legs, finds the current leg
    let currentLeg = null;
    this.props.rawLegs.forEach((leg) => {
      if (leg.legID === this.props.driver.activeLegID) {
        currentLeg = leg;
      }
    });
    // initialize an array containing the completed lines
    let lineArr = [];
    // draw line from legStart to driver
    let legStartX = this.state.offset + this.props.stops[currentLeg.startStop].x * this.state.multiplier;
    let legStartY = this.props.stops[currentLeg.startStop].y * this.state.multiplier;
    let legEndX = this.state.offset + this.props.driver.x * this.state.multiplier;
    let legEndY = this.props.driver.y * this.state.multiplier;
    lineArr.push(
      <Line
        key={currentLeg.legID}
        x={0}
        y={0}
        points={[legStartX, legStartY, legEndX, legEndY]}
        stroke="green"
        strokeWidth={5}
      />
    )
    // using currentLeg - 1, iterate to the root using DLL
    let currentLegNode = this.props.legs.find(currentLeg);
    return lineArr.concat(this.traceBackToStart(currentLegNode.prev, []));
  }

  // tail call recursive helper function to trace route back to beginning
  traceBackToStart = (currLeg, returnArr) => {
    // base case
    if (currLeg === null) {
      return returnArr;
    }
    // recursive case
    let legStartX = this.props.stops[currLeg.data.startStop].x * this.state.multiplier;
    let legStartY = this.props.stops[currLeg.data.startStop].y * this.state.multiplier;
    let legEndX = this.props.stops[currLeg.data.endStop].x * this.state.multiplier;
    let legEndY = this.props.stops[currLeg.data.endStop].y * this.state.multiplier;
    // creates a line connecting the stops of the current leg
    returnArr.push(
      <Line
        key={currLeg.data.legID}
        x={this.state.offset}
        y={0}
        points={[legStartX, legStartY, legEndX, legEndY]}
        stroke="green"
        strokeWidth={5}
      />
    )
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
}

export default ViewPort;