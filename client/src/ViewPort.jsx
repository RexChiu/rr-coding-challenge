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
      loaded: false,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      multiplier: 2.8,
      offset: 0
    };
  }

  // Grabs legs, stops, and driver info once mounted
  async componentDidMount() {
    try {
      // adds event listener to 
      window.addEventListener('resize', this.updateWindow);
      this.updateWindow();
      // retrieves legs/stops data and parses array results into a suitable data structure
      let legs = await axios.get('/legs');
      let stops = await axios.get('/stops');
      let parsedLegs = legsParser(legs.data); // parses into doubly linked list
      let parsedStops = stopsParser(stops.data); //parses into hashmap
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
        rawLegs: legs,
        rawStops: stops,
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
              {this.drawBorder()}
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
    Object.values(this.state.stops).forEach((stop) => {
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
        x={this.state.offset + this.state.driver.x * this.state.multiplier - length / 2}
        y={this.state.driver.y * this.state.multiplier - length / 2}
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
    let legStartX = this.state.offset + this.state.stops[currentLeg.startStop].x * this.state.multiplier;
    let legStartY = this.state.stops[currentLeg.startStop].y * this.state.multiplier;
    let legEndX = this.state.offset + this.state.driver.x * this.state.multiplier;
    let legEndY = this.state.driver.y * this.state.multiplier;
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
    let legStartX = this.state.stops[currLeg.data.startStop].x * this.state.multiplier;
    let legStartY = this.state.stops[currLeg.data.startStop].y * this.state.multiplier;
    let legEndX = this.state.stops[currLeg.data.endStop].x * this.state.multiplier;
    let legEndY = this.state.stops[currLeg.data.endStop].y * this.state.multiplier;
    // creates a line connecting the stops of the current leg
    returnArr.push(
      <Line
        key={currLeg.data.legID}
        x={this.state.offset}
        y={0}
        points={[legStartX, legStartY, legEndX, legEndY]}
        stroke="green"
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