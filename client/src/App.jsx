import React, { Fragment, Component } from 'react';
import ReactLoading from 'react-loading';

import './App.css';
import axios from 'axios'

import ViewPort from './components/ViewPort/ViewPort';
import DropDownButton from './components/Forms/DropDownButton'
import TotalTripTime from './components/Forms/TotalTripTime'
import RemainingTime from './components/Forms/RemainingTime'
import BonusDriverForm from './components/Forms/BonusDriverForm'
import LegProgressSlider from './components/Forms/LegProgressSlider'

import legsParser from './helpers/legsParser';
import stopsParser from './helpers/stopsParser';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      dropdownOpen: false,
      showBonusDriver: true
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
      let legProgress = driver.data.legProgress;
      driver = this.calculateDriverInfo(driver.data, parsedStops);
      // retrievers the bonus driver data
      let bonusDriver = await axios.get('/bonusdriver');
      // saves the parsed data into state
      this.setState({
        rawLegs: legs.data,
        rawStops: stops.data,
        legs: parsedLegs,
        stops: parsedStops,
        driver,
        bonusDriver: bonusDriver.data,
        legProgress,
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
        {this._render()}
      </div>
    );
  }

  // function to render the forms and viewport if API calls are completed
  // passes down state as props
  _render = () => {
    if (this.state.loaded) {
      return (
        <Fragment>
          <div className="d-flex justify-content-center align-items-center text-center container">
            <div className="row">
              <div className="mx-auto align-self-center col-lg-3">
                <DropDownButton rawLegs={this.state.rawLegs} driver={this.state.driver} legProgress={this.state.legProgress} sendPayloadDriver={this.sendPayloadDriver} />
              </div>
              <div className="mx-auto align-self-center col-lg-3">
                <TotalTripTime legs={this.state.legs} stops={this.state.stops} />
              </div>
              <div className="mx-auto align-self-center col-lg-3">
                <RemainingTime rawLegs={this.state.rawLegs} driver={this.state.driver} legs={this.state.legs} stops={this.state.stops} />
              </div>
              <div className="mx-auto align-self-center col-lg-3">
                <BonusDriverForm bonusDriver={this.state.bonusDriver} showBonusDriver={this.state.showBonusDriver} submitBonusDriver={this.submitBonusDriver} toggleBonusDriver={this.toggleBonusDriver} changeBonusDriver={this.changeBonusDriver} />
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center text-center container">
            <div className="row w-25 mb-1">
              <div className="mx-auto align-self-center col-lg-12">
                <LegProgressSlider legProgress={this.state.legProgress} onSliderChange={this.onSliderChange} onAfterChange={this.onAfterChange} />
              </div>
            </div>
          </div>
          <ViewPort legs={this.state.legs} stops={this.state.stops} driver={this.state.driver} rawLegs={this.state.rawLegs} rawStops={this.state.rawStops} bonusDriver={this.state.bonusDriver} showBonusDriver={this.state.showBonusDriver} />
        </Fragment>
      );
    } else {
      // display loading icon if not loaded yet
      return (
        <div className="loading container">
          <strong>Loading...</strong>
          <ReactLoading className="mx-auto" type={'spinningBubbles'} color={'#000000'} height={'10%'} width={'10%'} />
        </div>
      );
    }
  }

  // submit bonus driver to server
  submitBonusDriver = async (event) => {
    // stops default form action
    event.preventDefault();
    // only submit if bonusDriver coords are valid
    if (this.state.bonusDriver.x >= 0 && this.state.bonusDriver.x <= 200 && this.state.bonusDriver.y >= 0 && this.state.bonusDriver.y <= 200) {
      // sends payload of bonusDriver
      let bonusDriver = await axios.put('/bonusdriver', this.state.bonusDriver);
      this.setState({
        bonusDriver: bonusDriver.data
      })
    } else {
      alert("Bonus Driver coords must be between 0 and 200");
    }
  }

  // function to toggle the bonus driver
  toggleBonusDriver = () => {
    this.setState({
      showBonusDriver: !this.state.showBonusDriver
    })
  }

  // function to update the state with a new bonusDriver
  changeBonusDriver = (bonusDriver) => {
    this.setState({
      bonusDriver
    })
  }

  // function to handle slider changes, moves driver around as it changes
  onSliderChange = (value) => {
    let tempDriver = this.state.driver;
    tempDriver.legProgress = value / 100;
    this.setState({
      legProgress: value.toString(),
      driver: this.interpolateDriver(tempDriver, this.state.stops, tempDriver.legProgress)
    })
  }

  // function to capture the changes of the slider once it is stopped
  onAfterChange = async (value) => {
    // reconstructs the db format for driver
    let payloadDriver = {};
    payloadDriver.activeLegID = this.state.driver.activeLegID;
    payloadDriver.legProgress = this.state.legProgress;
    // sends payload to server
    await this.sendPayloadDriver(payloadDriver);
  }

  // function to send a payloadDriver and sets the response as the new state
  sendPayloadDriver = async (payloadDriver) => {
    // uses axios to send a put request to update the driver, recalculates the returned driver info
    let updatedDriver = await axios.put('/driver', payloadDriver);
    let driver = this.calculateDriverInfo(updatedDriver.data, this.state.stops);
    // updates the state to propagate down to redraw the viewport
    this.setState({
      driver,
      legProgress: updatedDriver.data.legProgress
    })
  }

  // function to calculate the driver info
  calculateDriverInfo = (driver, parsedStops) => {
    let updatedDriver = {};
    updatedDriver.activeLegID = driver.activeLegID;
    updatedDriver.start = driver.activeLegID[0];
    updatedDriver.end = driver.activeLegID[1];
    // parses legProgress into a number if it isnt one
    if (typeof driver.legProgress == 'number') {
      updatedDriver.legProgress = driver.legProgress;
    } else {
      updatedDriver.legProgress = Number(driver.legProgress) * 0.01;
    }
    updatedDriver = this.interpolateDriver(updatedDriver, parsedStops, updatedDriver.legProgress)
    return updatedDriver;
  }

  // function to interpolate the driver's position given leg progress
  interpolateDriver = (driver, parsedStops, legProgress) => {
    // interpolates the position of the driver
    driver.x = parsedStops[driver.start].x + (parsedStops[driver.end].x - parsedStops[driver.start].x) * legProgress;
    driver.y = parsedStops[driver.start].y + (parsedStops[driver.end].y - parsedStops[driver.start].y) * legProgress;
    return driver;
  }
}

export default App;
