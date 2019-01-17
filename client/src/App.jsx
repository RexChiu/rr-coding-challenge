import React, { Fragment, Component } from 'react';
import ReactLoading from 'react-loading';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './App.css';
import ViewPort from './ViewPort';
import axios from 'axios'
import legsParser from './helpers/legsParser';
import stopsParser from './helpers/stopsParser';

class App extends Component {
  constructor(props) {
    super(props);
    // initialized an empty driver object
    let driver = {};
    driver.activeLegID = "";
    driver.legProgress = "";
    this.state = {
      loaded: false,
      driver,
      dropdownOpen: false,
      selectedLeg: null
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
      driver = this.calculateDriverInfo(driver.data, parsedStops);
      // saves the parsed data into state
      this.setState({
        rawLegs: legs.data,
        rawStops: stops.data,
        legs: parsedLegs,
        stops: parsedStops,
        driver,
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
        <Fragment>
          {this._renderDropDownButton()}
          <ViewPort legs={this.state.legs} stops={this.state.stops} driver={this.state.driver} />
        </Fragment>
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
      <div className="container text-center">
        <strong>
          Legs:
        </strong>
        <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
          <DropdownToggle caret>
            {this.state.driver.activeLegID}
          </DropdownToggle>
          <DropdownMenu>
            {menuItemArr}
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    )
  }

  // function to toggle the dropdown
  toggleDropdown = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }

  // function to capture the selected dropdown
  selectDropdown = (event) => {
    let driver = this.state.driver;
    driver.activeLegID = event.target.innerText;
    driver = this.calculateDriverInfo(driver, this.state.stops);
    this.setState({
      driver,
      dropdownOpen: !this.state.dropdownOpen
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
    // interpolates the position of the driver
    updatedDriver.x = parsedStops[updatedDriver.start].x + (parsedStops[updatedDriver.end].x - parsedStops[updatedDriver.start].x) * updatedDriver.legProgress;
    updatedDriver.y = parsedStops[updatedDriver.start].y + (parsedStops[updatedDriver.end].y - parsedStops[updatedDriver.start].y) * updatedDriver.legProgress;
    return updatedDriver;
  }
}

export default App;
