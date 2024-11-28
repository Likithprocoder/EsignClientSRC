import React, { Component, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import * as router from "react-router-dom";
import { Container } from "reactstrap";
import { URL } from "../URLConstant";
import items, { clearMenu } from "../../_nav";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../MultiPplSign/client.css";
import Modal from "react-responsive-modal";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalHeader from "reactstrap/lib/ModalHeader";

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from "@coreui/react";
// sidebar nav config
import navigation from "../../_nav";
// routes config
import routes from "../../routes";
var Loader = require("react-loader");

const DefaultAside = React.lazy(() => import("./DefaultAside"));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushTo: "",
      openFirstModal: false,
      loaded: true,
    };
  }

  loading() {
    if (sessionStorage.getItem("jsonWebToken") === null && this.props.location.frompath !== "deGuest" && this.props.location.frompath !== "jsguest" && this.props.location.frompath !== "/preview") {

      this.props.history.push("/home");
      window.location.reload(false);



    } else {
      return <div className="animated fadeIn pt-1 text-center">Loading...</div>;
    }
  }
  // loading() {
  //   if (sessionStorage.getItem("authToken") === null) {
  //     this.props.history.push("/home");
  //     window.location.reload(false);
  //   } else {
  //     return <div className="animated fadeIn pt-1 text-center">Loading...</div>;
  //   }
  // }

  componentDidMount() {
    var roleID = sessionStorage.getItem("roleID");
    if (roleID === "1") {
      this.setState({ pushTo: "/" });
    } else if (roleID === "2" || roleID === "6") {
      this.setState({ pushTo: "/accountInfo" });
    }
    // else if (roleID === "3") {
    //   this.setState({ pushTo: "/docUpload" })
    // }
  }

  signOut(e) {
    e.preventDefault();
    var body = {
      username: sessionStorage.getItem("username"),
      userIP: sessionStorage.getItem("userIP"),
    };
    this.setState({ loaded: false });
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    fetch(URL.logOut, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jsonWebToken}`
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        localStorage.clear();
        sessionStorage.clear();
        this.setState({ loaded: true });
        this.props.history.push("/login");
        window.location.reload(false);
        window.location.reload(false);
      })
      .catch((e) => {
        sessionStorage.clear();
        localStorage.clear();
        this.props.history.push("/login");
        window.location.reload(false);
        window.location.reload(false);
      });
  }
  deleteUserAccount(e) {
    e.preventDefault();

    this.props.history.push("/accountDelete");
  }

  paymentPage(e) {
    e.preventDefault();
    this.props.history.push("/payments");
  }

  profilePage(e) {
    e.preventDefault();
    this.props.history.push("/profileDetails");
  }

  APIIntegrationsPage(e) {
    e.preventDefault();
    this.props.history.push("/apiIntegrationsPage");
  }

  render() {
    return (
      <div className="app">
        <Loader
            loaded={this.state.loaded}
            lines={13}
            radius={20}
            corners={1}
            rotate={0}
            direction={1}
            color="#000"
            speed={1}
            trail={60}
            shadow={false}
            hwaccel={false}
            className="spinner loader"
            zIndex={2e9}
            top="50%"
            left="50%"
            scale={1.0}
            loadedClassName="loadedContent"
          />
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader
              onLogout={(e) => this.signOut(e)}
              onPaymentPage={(e) => this.paymentPage(e)}
              onDelete={(e) => this.deleteUserAccount(e)}
              onProfilePage={(e) => this.profilePage(e)}
              onAPIIntegrationsPage={(e) => this.APIIntegrationsPage(e)}
            />
          </Suspense>
        </AppHeader>
        <div id="defaultBackGround" className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav
                navConfig={navigation}
                {...this.props}
                router={router}
              />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={(props) => <route.component {...props} />}
                      />
                    ) : null;
                  })}
                  <Redirect from="/" to={this.state.pushTo} />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <div id="modal"></div>
        </div>
        <br></br>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
