import React, { Fragment, Component } from 'react';
import ReactLoading from 'react-loading';
import axios from 'axios'
import Konva from 'konva';
import { Stage, Layer, Rect, Text } from 'react-konva';

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
      // retrieves legs/stops data and parses array results into a hashmap
      let legs = await axios.get('/legs');
      let stops = await axios.get('/stops');
      let parsedLegs = legsParser(legs.data);
      let parsedStops = stopsParser(stops.data);
      // retrieves the driver data
      let driver = await axios.get('/driver');
      driver.data.start = parsedLegs[driver.data.activeLegID].startStop;
      driver.data.end = parsedLegs[driver.data.activeLegID].endStop;
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
      stopsArr.push(
        <Rect
          /* scaling the coordintes by x5*/
          x={stop.x * 5}
          y={stop.y * 5}
          width={10}
          height={10}
          fill="red"
          key={stop.name}
        />
      )
    });
    return stopsArr;
  }

  // function to draw the driver
  drawDriver = () => {
    // interpolates the position of the driver
    let driverX = this.state.stops[this.state.driver.start].x + (this.state.stops[this.state.driver.end].x - this.state.stops[this.state.driver.start].x) * (Number(this.state.driver.legProgress) * 0.01);
    let driverY = this.state.stops[this.state.driver.start].y + (this.state.stops[this.state.driver.end].y - this.state.stops[this.state.driver.start].y) * (Number(this.state.driver.legProgress) * 0.01);
    return (
      <Rect
        /* scaling the coordintes by x5*/
        x={driverX * 5}
        y={driverY * 5}
        width={10}
        height={10}
        fill="blue"
      />
    )
  }

  // function to draw the completed legs of the driver

}

export default ViewPort;