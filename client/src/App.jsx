import React, { Fragment, Component } from 'react';
import ReactLoading from 'react-loading';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, Form, FormGroup, Input, Button } from 'reactstrap';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import './App.css';
import axios from 'axios'

import ViewPort from './components/ViewPort';
import legsParser from './helpers/legsParser';
import stopsParser from './helpers/stopsParser';
import helper from './helpers/helper';

const SliderWithTooltip = createSliderWithTooltip(Slider);

class App extends Component {
  constructor(props) {
    super(props);
    // initialized an empty bonusDriver object
    let bonusDriver = {};
    bonusDriver.x = "";
    bonusDriver.y = "";
    this.state = {
      loaded: false,
      dropdownOpen: false,
      bonusDriver
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
                {this._renderDropDownButton()}
              </div>
              <div className="mx-auto align-self-center col-lg-3">
                {this._renderTotalTripTime()}
              </div>
              <div className="mx-auto align-self-center col-lg-3">
                {this._renderRemainingTripTime()}
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
          <ViewPort legs={this.state.legs} stops={this.state.stops} driver={this.state.driver} rawLegs={this.state.rawLegs} rawStops={this.state.rawStops} bonusDriver={this.state.bonusDriver} />
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

  // function to render the dropdown button to display and select trip leg
  _renderDropDownButton = () => {
    // iterates through each leg and grabs the legID to populate drop down
    let menuItemArr = [];
    this.state.rawLegs.forEach((leg) => {
      // sets active flag on current leg
      if (leg.legID === this.state.driver.activeLegID) {
        menuItemArr.push(<DropdownItem key={leg.legID} disabled={true}>{leg.legID}</DropdownItem>)
      } else {
        menuItemArr.push(<DropdownItem onClick={this.selectDropdown} key={leg.legID}>{leg.legID}</DropdownItem>)
      }
    });
    return (
      <Fragment>
        <div>
          <Label for="dropdownToggle"><strong>Current Leg</strong></Label>
        </div>
        <ButtonDropdown id="dropdownToggle" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
          <DropdownToggle caret>
            {this.state.driver.activeLegID}
          </DropdownToggle>
          <DropdownMenu>
            {menuItemArr}
          </DropdownMenu>
        </ButtonDropdown>
      </Fragment>
    )
  }

  // function to toggle the dropdown
  toggleDropdown = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  // function to capture the selected dropdown, send 
  selectDropdown = async (event) => {
    // update the driver activeLegID based on selected dropdown
    // reconstructs the db format for driver
    let payloadDriver = {};
    payloadDriver.activeLegID = event.target.innerText;
    payloadDriver.legProgress = this.state.legProgress;
    // sends payload to server
    await this.sendPayloadDriver(payloadDriver);
  }

  // function to render the total trip time
  _renderTotalTripTime = () => {
    let head = this.state.legs.getHeadNode();
    let total = this.calculateTripTimeToEnd(head, 0);
    return (
      <div>
        <strong>Total Time</strong>
        <p>{total}</p>
      </div>
    );
  }

  // function to render the remaining trip time
  _renderRemainingTripTime = () => {
    // finds the leg node of current driver
    let currentLeg = null;
    this.state.rawLegs.forEach((leg) => {
      if (leg.legID === this.state.driver.activeLegID) {
        currentLeg = leg;
      }
    });
    let currentLegNode = this.state.legs.find(currentLeg);
    // find the distance from current driver position to current endStop
    let endStop = this.state.stops[currentLegNode.data.endStop];
    let distanceDriverToNextStop = helper.calculateDistance(this.state.driver.x, this.state.driver.y, endStop.x, endStop.y);
    let timeNeededDriverToNextStop = distanceDriverToNextStop / currentLegNode.data.speedLimit;
    let remainingTimeNeeded = this.calculateTripTimeToEnd(currentLegNode.next, timeNeededDriverToNextStop);
    return (
      <div>
        <strong>Remaining Time</strong>
        <p>{remainingTimeNeeded}</p>
      </div>
    );
  }

  // tail call recursive function to calculate the trip time from a given node to the end
  calculateTripTimeToEnd = (currLeg, tripTime) => {
    // base case
    if (currLeg === null) {
      return tripTime.toFixed(2) + " TUs";
    }
    // recursive case
    // calculates the distance, divides the distance by the speed limit
    let startStop = currLeg.data.startStop;
    let endStop = currLeg.data.endStop;
    let distance = helper.calculateDistance(this.state.stops[startStop].x, this.state.stops[startStop].y, this.state.stops[endStop].x, this.state.stops[endStop].y);
    let timeNeeded = distance / currLeg.data.speedLimit;
    return this.calculateTripTimeToEnd(currLeg.next, tripTime + timeNeeded);
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
              <Button onClick={this.resetBonusDriver}>Reset</Button>
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
