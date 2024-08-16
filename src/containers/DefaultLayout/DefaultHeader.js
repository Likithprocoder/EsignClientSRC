import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
// import logo from '../../assets/img/brand/logo.svg'
import logo from '../../views/Pages/Login/logo/appLogo.png'
import sygnet from '../../views/Pages/Login/logo/logoStamp.png'
import { createBrowserHistory } from 'history';

const propTypes = {
  children: PropTypes.node,
};
const hist = createBrowserHistory();
const defaultProps = {};

class DefaultHeader extends Component {

  loadNavBasedOnRole = () => {
    let nav = ``;

    if (
      sessionStorage.getItem("roleID") == 3
   
    ) {
      return (
        <DropdownItem onClick={(e) => this.props.onLogout(e)}>
          <i className="fa fa-lock"></i> Logout
        </DropdownItem>
      );
    }else{
      return (
        <>
          <DropdownItem header tag="div" className="text-center">
            <strong>Settings</strong>
          </DropdownItem>
          <DropdownItem onClick={(e) => this.props.onProfilePage(e)}>
            <i className="fa fa-user"></i> Profile
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={(e) => this.props.onDelete(e)}>
            <i class="fa fa-user-times"></i> Delete Account
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={(e) => this.props.onLogout(e)}>
            <i className="fa fa-lock"></i> Logout
          </DropdownItem>
        </>
      );
    }

  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          // full={{ src: logo, width: 89, height: 25, alt: 'MySign Logo' }}
          // minimized={{ src: sygnet, width: 30, height: 30, alt: 'MySign Logo' }}
          full={{ src: logo, height: "95%", alt: 'DocuExec Logo' }}
          minimized={{ src: sygnet, height: "95%", alt: 'DocuExec Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          {/* <NavItem className="px-3">
            <NavLink to="/dashboard" className="nav-link" >Dashboard</NavLink>
          </NavItem> */}
          {/* <NavItem className="px-3">
            <Link to="/users" className="nav-link">Users</Link>
          </NavItem> */}
          {/* <NavItem className="px-3">
            <NavLink to="#" className="nav-link">Settings</NavLink>
          </NavItem> */}
        </Nav>
        <Nav className="ml-auto" navbar>
          {/* <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem> */}
          {/* <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-location-pin"></i></NavLink>
          </NavItem> */}
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <h6 className="username">{sessionStorage.getItem("firstName")}</h6>
            </DropdownToggle>
            <DropdownMenu right>
              {/* <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem> */}
              {this.loadNavBasedOnRole()}

              {/* <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem> */}
              {/* <DropdownItem onClick = {e =>  this.props.onPaymentPage(e) }><i className="fa fa-inr"></i> Payments</DropdownItem> */}
              {/* <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem> */}

              {/* <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem> */}

            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* <AppAsideToggler className="d-md-down-none" /> */}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
