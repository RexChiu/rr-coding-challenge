import React, { Component } from 'react';
import { Stage, Layer, Line } from 'react-konva';

import Border from './Border';
import Stops from './Stops';
import Driver from './Driver';
import CompletedLegs from './CompletedLegs';

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
    let currentLeg = this.findCurrentLeg();
    return (
      <div className="App">
        <Stage width={window.innerWidth} height={window.innerHeight * .7}>
          <Layer>
            <Border multiplier={this.state.multiplier} offset={this.state.offset} />
            <Stops stops={this.props.stops} multiplier={this.state.multiplier} offset={this.state.offset} />
            <Driver driver={this.props.driver} multiplier={this.state.multiplier} offset={this.state.offset} />
            <CompletedLegs currentLeg={currentLeg} legs={this.props.legs} stops={this.props.stops} multiplier={this.state.multiplier} offset={this.state.offset} />
            {/* {this.drawCompletedLegs()} */}
            {this.drawCompletedLegToDriver()}
          </Layer>
        </Stage>
      </div>
    );
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