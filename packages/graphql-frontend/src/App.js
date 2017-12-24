import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Auth from './auth';

const auth = new Auth();
if (/access_token|id_token|error/.test(document.location.hash)) {
  auth.handleAuthentication();
}
window.$auth = auth;

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>Click <a onClick={() => auth.login()} href="#" title={document.location.origin}>here</a> to log in</p>
        <p><small><a onClick={() => auth.logout()}>log out</a></small></p>
      </div>
    );
  }
}

export default App;
