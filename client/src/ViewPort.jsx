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
      // saves the parsed data into ViewPort state
      this.setState({
        legs: parsedLegs,
        stops: parsedStops,
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
        />
      )
    });
    return stopsArr;
  }
}

export default ViewPort;