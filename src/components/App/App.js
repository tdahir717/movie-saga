import React, { Component } from 'react';
import './App.css';
import Header from '../Header/Header';

class App extends Component {
  // Renders the entire app on the DOM
  render() {
    return (
      <div className="App">
        <Header />
        <p>Empty Page</p>
      </div>
    );
  }
}

export default App;