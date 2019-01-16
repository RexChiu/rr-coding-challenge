import React, { Component } from 'react';
import './App.css';
import ViewPort from './ViewPort';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div>
          <h1>Rose Rocket Coding Challenge</h1>
        </div>
        <ViewPort />
      </div>
    );
  }
}

export default App;
