import React, { Fragment, Component } from 'react';
import ReactLoading from 'react-loading';
import axios from 'axios'
import { Stage, Layer, Rect, Line } from 'react-konva';

import legsParser from './helpers/legsParser';
import stopsParser from './helpers/stopsParser';

class ViewPort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  // Grabs legs and stops once mounted
  async componentDidMount() {
    try {
      // retrieves legs/stops data and parses array results into a suitable data structure
      let legs = await axios.get('/legs');
      let stops = await axios.get('/stops');
      let parsedLegs = legsParser(legs.data);
      let parsedStops = stopsParser(stops.data);
      // retrieves the driver data, and adds any useful information
      let driver = await axios.get('/driver');
      driver.data.start = driver.data.activeLegID[0];
      driver.data.end = driver.data.activeLegID[1];
      driver.data.legProgress = Number(driver.data.legProgress) * 0.01;
      // interpolates the position of the driver
      driver.data.x = parsedStops[driver.data.start].x + (parsedStops[driver.data.end].x - parsedStops[driver.data.start].x) * driver.data.legProgress;
      driver.data.y = parsedStops[driver.data.start].y + (parsedStops[driver.data.end].y - parsedStops[driver.data.start].y) * driver.data.legProgress;
      // saves the parsed data into ViewPort state
      this.setState({
        legs: parsedLegs,
        stops: parsedStops,
        driver: driver.data,
        loaded: true
      });
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    if (this.state.loaded) {
      return (
        <div className="App">
          <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
              {this.generateStops()}
              {this.drawDriver()}
              {this.drawCompletedLegs()}
            </Layer>
          </Stage>
        </div>
      );
    } else {
      return (
        <Fragment>
          <strong>Loading...</strong>
          <ReactLoading className="loading-icon" type={'spinningBubbles'} color={'#000000'} height={'10%'} width={'10%'} />
        </Fragment>
      )
    }
  }

  // function to generates a rect for every stop
  generateStops = () => {
    let stopsArr = [];
    Object.values(this.state.stops).forEach((stop) => {
      let length = 10;
      stopsArr.push(
        <Rect
          /* scaling the coordintes by x5 and shifting to center*/
          x={stop.x * 5 - length / 2}
          y={stop.y * 5 - length / 2}
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
    let length = 20;
    return (
      <Rect
        /* scaling the coordintes by x5 and shifting to center*/
        x={this.state.driver.x * 5 - length / 2}
        y={this.state.driver.y * 5 - length / 2}
        width={length}
        height={length}
        fill="blue"
      />
    )
  }

  // function to draw the completed legs of the driver
  drawCompletedLegs = () => {
    // extracts arr of legs from DLL, and finds the current leg
    let legsArr = this.state.legs.toArray();
    let currentLeg = null;
    legsArr.forEach((leg) => {
      if (leg.legID === this.state.driver.activeLegID) {
        currentLeg = leg;
      }
    });
    // initialize an array containing the completed lines
    let lineArr = [];
    // draw line from legStart to driver
    let legStartX = this.state.stops[currentLeg.startStop].x * 5;
    let legStartY = this.state.stops[currentLeg.startStop].y * 5;
    let legEndX = this.state.driver.x * 5;
    let legEndY = this.state.driver.y * 5;
    lineArr.push(
      <Line
        key={currentLeg.legID}
        x={0}
        y={0}
        points={[legStartX, legStartY, legEndX, legEndY]}
        stroke="green"
      />
    )
    // using currentLeg - 1, iterate to the root using DLL
    let currentLegNode = this.state.legs.find(currentLeg);
    return lineArr.concat(this.traceBackToStart(currentLegNode.prev, []));
  }

  // tail call recursive helper function to trace route back to beginning
  traceBackToStart = (currLeg, returnArr) => {
    // base case
    if (currLeg === null) {
      return returnArr;
    }
    // recursive case
    let legStartX = this.state.stops[currLeg.data.startStop].x * 5;
    let legStartY = this.state.stops[currLeg.data.startStop].y * 5;
    let legEndX = this.state.stops[currLeg.data.endStop].x * 5;
    let legEndY = this.state.stops[currLeg.data.endStop].y * 5;
    // creates a line connecting the stops of the current leg
    returnArr.push(
      <Line
        key={currLeg.data.legID}
        x={0}
        y={0}
        points={[legStartX, legStartY, legEndX, legEndY]}
        stroke="green"
      />
    )
    return this.traceBackToStart(currLeg.prev, returnArr);
  }
}

export default ViewPort;