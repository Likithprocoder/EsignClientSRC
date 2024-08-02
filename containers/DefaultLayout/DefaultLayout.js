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

const DefaultAside = React.lazy(() => import("./DefaultAside"));
const DefaultFooter = React.lazy(() => import("./DefaultFooter"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
  constructor(props) {
    super();
    this.state = {
      pushTo: "",
      openFirstModal: false,
    };
  }

  loading() {
    if (sessionStorage.getItem("authToken") === null) {
      this.props.history.push("/home");
      window.location.reload(false);
    } else {
      return <div className="animated fadeIn pt-1 text-center">Loading...</div>;
    }
  }

  componentDidMount() {
    var roleID = sessionStorage.getItem("roleID");
    if (roleID === "1") {
      this.setState({ pushTo: "/" });
    } else if (roleID === "2") {
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
      authToken: sessionStorage.getItem("authToken"),
    };
    fetch(URL.logOut, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        localStorage.clear();
        sessionStorage.clear();
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

  render() {
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader
              onLogout={(e) => this.signOut(e)}
              onPaymentPage={(e) => this.paymentPage(e)}
              onDelete={(e) => this.deleteUserAccount(e)}
              onProfilePage={(e) => this.profilePage(e)}
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
