import React, { Fragment, Component } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label } from 'reactstrap';

// class responsible for handling the input fields
class DropDownButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    }
  }

  // function to render the dropdown button to display and select trip leg
  render() {
    // iterates through each leg and grabs the legID to populate drop down
    let menuItemArr = [];
    this.props.rawLegs.forEach((leg) => {
      // sets active flag on current leg
      if (leg.legID === this.props.driver.activeLegID) {
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
            {this.props.driver.activeLegID}
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
    payloadDriver.legProgress = this.props.legProgress;
    // sends payload to server
    await this.props.sendPayloadDriver(payloadDriver);
  }
}

export default DropDownButton;