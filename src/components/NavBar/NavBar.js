import React, {Component} from "react";
import {
    Container,
  Navbar,
  NavbarToggler,
  NavbarBrand,
} from "shards-react";

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.toggleNavbar = this.toggleNavbar.bind(this);

    this.state = {
      dropdownOpen: false,
      collapseOpen: false
    };
  }

  toggleDropdown() {
    this.setState({
      ...this.state,
      ...{
        dropdownOpen: !this.state.dropdownOpen
      }
    });
  }

  toggleNavbar() {
    this.setState({
      ...this.state,
      ...{
        collapseOpen: !this.state.collapseOpen
      }
    });
  }

  render() {
    return (
        <Navbar type="dark" theme="info" expand="md">
            <Container>
            <NavbarBrand className='m-auto navbar-title' href="/new-funding-round">SYGS</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} />
            </Container>
        </Navbar>
    );
  }
}