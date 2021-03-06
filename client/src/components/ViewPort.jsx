import React, { Fragment, Component } from 'react';
import { Stage, Layer } from 'react-konva';

import Border from './Border';
import Stops from './Stops';
import Driver from './Driver';
import CompletedLegs from './CompletedLegs';
import CompletedLegToDriver from './CompletedLegToDriver';
import BonusDriver from './BonusDriver';
import BonusDriverToEnd from './BonusDriverToEnd';

// class responsible for drawing the viewport based on props passed down
class ViewPort extends Component {
  constructor(props) {
    super(props);
    let multiplier = 2.5;
    this.state = {
      multiplier, // multiplier to increase the scale of the map
      offset: window.innerWidth / 2 - (200 * multiplier / 2) // used to push viewport to the middle
    };
  }

  componentDidMount() {
    // adds event listener to catch resizing
    window.addEventListener('resize', this.updateWindow);
    this.updateWindow();
  }

  render() {
    let currentLeg = this.findCurrentLeg();
    return (
      <div className="App">
        <Stage width={window.innerWidth} height={window.innerHeight * .7}>
          <Layer>
            <Border multiplier={this.state.multiplier} offset={this.state.offset} />
            <Stops stops={this.props.stops} multiplier={this.state.multiplier} offset={this.state.offset} />
            <Driver driver={this.props.driver} multiplier={this.state.multiplier} offset={this.state.offset} />
            <CompletedLegs currentLeg={currentLeg} legs={this.props.legs} stops={this.props.stops} multiplier={this.state.multiplier} offset={this.state.offset} />
            <CompletedLegToDriver currentLeg={currentLeg} driver={this.props.driver} stops={this.props.stops} multiplier={this.state.multiplier} offset={this.state.offset} />
            {this._renderBonusDriver()}
          </Layer>
        </Stage>
      </div>
    );
  }

  // renders bonus driver only if showBonusDriver is true
  _renderBonusDriver = () => {
    if (this.props.showBonusDriver) {
      return (
        <Fragment>
          <BonusDriver bonusDriver={this.props.bonusDriver} multiplier={this.state.multiplier} offset={this.state.offset} />
          <BonusDriverToEnd bonusDriver={this.props.bonusDriver} legs={this.props.legs} rawLegs={this.props.rawLegs} stops={this.props.stops} rawStops={this.props.rawStops} multiplier={this.state.multiplier} offset={this.state.offset} />
        </Fragment>
      )
    } else {
      return (null);
    }
  }

  // function to get the current dimensions of the window
  updateWindow = () => {
    this.setState({
      offset: window.innerWidth / 2 - (200 * this.state.multiplier / 2)
    })
  }

  // function to find the current leg the driver is on
  findCurrentLeg = () => {
    for (let leg of this.props.rawLegs) {
      if (leg.legID === this.props.driver.activeLegID) {
        return leg;
      }
    }
  }
}

export default ViewPort;