import React from "react";
import { Component, Fragment } from "react";

import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { Nav, Navbar, NavItem } from "react-bootstrap";
import Cookies from "universal-cookie";

class App extends Component {
  componentDidMount() {
    if (window.cookies.get("userId")) {
      this.setState({ isAuthenticated: true });
    }
  }

  constructor(props) {
    super(props);
    window.cookies = new Cookies();
    this.state = {
      isAuthenticated: false,
      userId: window.cookies.get("userId"),

      userMail: null
    };
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  };

  setUserMail = userMail => {
    this.setState({ userMail: userMail });
  };

  handleLogout = () => {
    if (window.cookies.get("userId")) {
      window.cookies.remove("userId");
    }

    this.setState({ isAuthenticated: false });
  };

  setUserId = id => {
    this.setState({ userId: id });
    window.cookies.set("userId", id, { path: "/" });
  };

  getAProp = () => {
    if (this.state.isAuthenticated) {
      return (
        <Nav pullRight>
          <NavItem onClick={this.handleLogout}>Logout</NavItem>
        </Nav>
      );
    } else {
      return (
        <Nav pullRight>
          <NavItem href="/signup">Signup</NavItem>
          <NavItem href="/login">Login</NavItem>
        </Nav>
      );
    }
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated,
      userId: this.state.userId,
      setUserId: this.setUserId,
      userMail: this.state.userMail,
      setUserMail: this.setUserMail
    };

    return (
      <div>
        <Navbar fluid collapseOnSelect>
          <Navbar.Header>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>{this.getAProp()}</Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default App;
