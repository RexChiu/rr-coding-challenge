import React, { Fragment, Component } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, Form, FormGroup, Input, Button } from 'reactstrap';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

// class responsible for handling the input fields
class Forms extends Component {
  render() {
    return (
      <Fragment>
        <div className="d-flex justify-content-center align-items-center text-center container">
          <div className="row">
            <div className="mx-auto align-self-center col-lg-3">
              {/* {this._renderDropDownButton()} */}
            </div>
            <div className="mx-auto align-self-center col-lg-3">
              {/* {this._renderTotalTripTime()} */}
            </div>
            <div className="mx-auto align-self-center col-lg-3">
              {/* {this._renderRemainingTripTime()} */}
            </div>
            <div className="mx-auto align-self-center col-lg-3">
              {/* {this._renderBonusDriverForm()} */}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center align-items-center text-center container">
          <div className="row w-25 mb-1">
            <div className="mx-auto align-self-center col-lg-12">
              {/* {this._renderLegProgressSlider()} */}
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default Forms;