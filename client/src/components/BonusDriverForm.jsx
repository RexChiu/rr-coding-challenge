import React, { Component } from 'react';
import { Form, FormGroup, Input, Button } from 'reactstrap';

// function to render the Bonus Driver forms
class BonusDriverForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bonusDriver: this.props.bonusDriver
    }
  }

  render() {
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
              <Button onClick={this.props.submitBonusDriver}>Submit</Button>
              <Button onClick={this.props.toggleBonusDriver}>{this.props.showBonusDriver ? "Hide" : "Show"}</Button>
            </div>
          </FormGroup>
        </Form>
      </div>
    );
  };

  // controlled inputs for Bonus Driver X
  changeBonusDriverX = (event) => {
    let bonusDriver = JSON.parse(JSON.stringify(this.state.bonusDriver));
    bonusDriver.x = Number(event.target.value);
    // keeps bonusDriverX within 0 and 200
    bonusDriver.x = Math.min(Math.max(bonusDriver.x, 0), 200);
    // updates the bonusDriver in App.jsx
    this.props.changeBonusDriver(bonusDriver);
  }
  // controlled inputs for Bonus Driver Y
  changeBonusDriverY = (event) => {
    let bonusDriver = JSON.parse(JSON.stringify(this.state.bonusDriver));
    bonusDriver.y = Number(event.target.value);
    // keeps bonusDriverY within 0 and 200
    bonusDriver.y = Math.min(Math.max(bonusDriver.y, 0), 200);
    // updates the bonusDriver in App.jsx
    this.props.changeBonusDriver(bonusDriver);
  }
}

export default BonusDriverForm;