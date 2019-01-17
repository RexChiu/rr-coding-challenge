import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import './App.css';
import ViewPort from './ViewPort';
import axios from 'axios'
import legsParser from './helpers/legsParser';
import stopsParser from './helpers/stopsParser';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }
  // Grabs legs, stops, and driver info once mounted
  async componentDidMount() {
    try {
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
      // saves the parsed data into state
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
    return (
      <div className="App">
        <div>
          <h1>Rose Rocket Coding Challenge</h1>
        </div>
        {this._renderViewPort()}
      </div>
    );
  }

  // function to render the viewport if API calls are completed
  // passes down state as props
  _renderViewPort = () => {
    if (this.state.loaded) {
      return (
        <ViewPort rawLegs={this.state.rawLegs} rawStops={this.state.rawStops} legs={this.state.legs} stops={this.state.stops} driver={this.state.driver} />
      );
    } else {
      // display loading icon if not loaded yet
      return (
        <div className="loading container">
          <strong>Loading...</strong>
          <ReactLoading className="m-auto" type={'spinningBubbles'} color={'#000000'} height={'10%'} width={'10%'} />
        </div>
      );
    }
  }
}



export default App;
