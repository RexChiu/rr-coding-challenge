import React, { Fragment, Component } from 'react';
import ReactLoading from 'react-loading';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, Form, FormGroup, Input, Button } from 'reactstrap';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import './App.css';
import axios from 'axios'

import ViewPort from './components/ViewPort';
import DropDownButton from './components/DropDownButton'
import TotalTripTime from './components/TotalTripTime'
import RemainingTime from './components/RemainingTime'

import legsParser from './helpers/legsParser';
import stopsParser from './helpers/stopsParser';
import helper from './helpers/helper';

const SliderWithTooltip = createSliderWithTooltip(Slider);

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
                {this._renderBonusDriverForm()}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center align-items-center text-center container">
            <div className="row w-25 mb-1">
              <div className="mx-auto align-self-center col-lg-12">
                {this._renderLegProgressSlider()}
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

  // function to render the form for the bonus driver
  _renderBonusDriverForm = () => {
    return (
      <div>
        <strong>Bonus Driver</strong>
        <Form className="d-flex justify-content-center align-items-center text-center">
          <FormGroup className="row my-0">
            <div className="col-lg-6 px-0">
              <Input className="text-center" type="text" name="x" id="bonusDriverX" placeholder={this.state.bonusDriver.x ? this.state.bonusDriver.x : "X"} onChange={this.changeBonusDriverX} />
              <Input className="text-center" type="text" name="y" id="bonusDriverY" placeholder={this.state.bonusDriver.y ? this.state.bonusDriver.y : "Y"} onChange={this.changeBonusDriverY} />
            </div>
            <div className="col-lg-6 px-2 my-auto">
              <Button onClick={this.submitBonusDriver}>Submit</Button>
              <Button onClick={this.toggleBonusDriver}>{this.state.showBonusDriver ? "Hide" : "Show"}</Button>
            </div>
          </FormGroup>
        </Form>
      </div>
    )
  }

  // controlled inputs for Bonus Driver X
  changeBonusDriverX = (event) => {
    let bonusDriver = JSON.parse(JSON.stringify(this.state.bonusDriver));
    bonusDriver.x = Number(event.target.value);
    // keeps bonusDriverX within 0 and 200
    bonusDriver.x = Math.min(Math.max(bonusDriver.x, 0), 200);
    this.setState({
      bonusDriver
    })
  }
  // controlled inputs for Bonus Driver Y
  changeBonusDriverY = (event) => {
    let bonusDriver = JSON.parse(JSON.stringify(this.state.bonusDriver));
    bonusDriver.y = Number(event.target.value);
    // keeps bonusDriverY within 0 and 200
    bonusDriver.y = Math.min(Math.max(bonusDriver.y, 0), 200);
    this.setState({
      bonusDriver
    })
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

  // function to render a slider for legProgress
  _renderLegProgressSlider = () => {
    return (
      <div>
        <strong>Leg Progress</strong>
        <SliderWithTooltip className="w-100 mt-1"
          tipFormatter={this.percentFormatter}
          min={0}
          max={100}
          value={Number(this.state.legProgress)}
          onChange={this.onSliderChange}
          onAfterChange={this.onAfterChange}
        />
      </div>
    )
  }

  // function to have a custom tooltip for slider
  percentFormatter = (v) => {
    return `${v}%`;
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
    let payloadDriver = this.makePayloadDriver();
    // sends payload to server
    await this.sendPayloadDriver(payloadDriver);
  }

  // function to construct legProgress payload
  makePayloadDriver = () => {
    // reconstructs the db format for driver
    let payloadDriver = {};
    payloadDriver.activeLegID = this.state.driver.activeLegID;
    payloadDriver.legProgress = this.state.legProgress;
    return payloadDriver;
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
