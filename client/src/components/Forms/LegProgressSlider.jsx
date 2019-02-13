import React, { Component } from 'react';

import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const SliderWithTooltip = createSliderWithTooltip(Slider);

// function to render the Leg Progress slider bar
class LegProgressSlider extends Component {
  render() {
    return (
      <div>
        <strong>Leg Progress</strong>
        <SliderWithTooltip className="w-100 mt-1"
          tipFormatter={this.percentFormatter}
          min={0}
          max={100}
          value={Number(this.props.legProgress)}
          onChange={this.props.onSliderChange}
          onAfterChange={this.props.onAfterChange}
        />
      </div>
    )
  }

  // function to have a custom tooltip for slider
  percentFormatter = (v) => {
    return `${v}%`;
  }
}

export default LegProgressSlider;