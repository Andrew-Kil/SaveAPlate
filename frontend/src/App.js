import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import LoginContainer from "./containers/LoginContainer.js";
import SignUpContainer from "./containers/SignUpContainer.js"
import "./App.css";
import NavBar from "./components/navBar/NavBar.js";
import Landing from "./components/landing/Landing.js";
import AboutUs from "./components/navBar/navComponents/aboutUs/AboutUs.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <LoginContainer />
        <SignUpContainer />
        <div className="main-section">
          <Switch>
            <Route exact path="/welcome" component={Landing} />
            <Route exact path="/aboutus" component={AboutUs} />
            {/* <Route exact path="/" component={Feed} />
            <Route path="/vendor/:vendorName" component={VendorProfile} />
            <Route path="/client/:clientName" component={ClientProfile} /> */}
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
