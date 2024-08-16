import React, { Component } from "react";
import { HashRouter, Route, Switch, Router } from "react-router-dom";
// import { renderRoutes } from 'react-router-config';
import "./App.scss";
//import Test from './views/Pages/Login/Test';
// import PreventBack from './containers/PreventBack'; // Import the PreventBack component

import { createBrowserHistory } from "history";
// import Download from './containers/Upload/Download';

const loading = () => (
  <div className="animated fadeIn pt-3 text-center">Loading...</div>
);
const hist = createBrowserHistory();

// Containers
const DefaultLayout = React.lazy(() =>
  import("./containers/DefaultLayout/DefaultLayout")
);


 const Login = React.lazy(() => import("./views/Pages/Login/Login"));
const Register = React.lazy(() => import("./views/Pages/Register/Register"));

// const ServerMaintainanceLogin = React.lazy(() =>
//   import("./views/Pages/ServerMaintainance")
// );

// const ServerMaintainanceRegistration = React.lazy(() =>
//   import("./views/Pages/ServerMaintainanceRegistration")
// );


const LoginMaintainance = React.lazy(() =>
  import("./views/Pages/Login/LoginMaintainance")
);


const Page404 = React.lazy(() => import("./views/Pages/Page404/Page404"));
const Page500 = React.lazy(() => import("./views/Pages/Page500/Page500"));
const Download = React.lazy(() => import("./containers/Download/Download"));
const ESign_error = React.lazy(() =>
  import("./containers/Download/ESignError")
);
const ConsenteSignResp = React.lazy(() =>
  import("./containers/Consent/ConsentResponse")
);
const ConsenteSign = React.lazy(() =>
  import("./containers/Consent/ConsenteSign")
);
const LandingPage = React.lazy(() =>
  import("./containers/LandingPage/LandingPage")
);
const MultiPplSignHomePage = React.lazy(() =>
  import("./containers/MultiPplSign/MultiPplSignHomePage")
);
// const TandC = React.lazy(() => import("./views/Pages/Register/TandC"));
const TandC = React.lazy(() =>
  import("./views/Pages/Register/TermsAndConditions")
);
const PrivacyPolicy = React.lazy(() =>
  import("./views/Pages/Register/PrivacyPolicy")
);
const KYCStatusResponse = React.lazy(() =>
  import("./containers/DigiLocker/KYCStatusResponse")
);

const MultiPplSignMobilePage = React.lazy(() =>
  import("./containers/MultiPplSign/MultiPplSignMobilePage")
);




// const DemoVideoPage = React.lazy(() =>
//   import("./containers/LandingPage/DemoVideoPage")
// );
// const Test = React.lazy(() => import('./containers/Test/test'))

class App extends Component {
  render() {
    return (
      <Router history={hist}>
        <React.Suspense fallback={loading()}>
          {/* <PreventBack /> */}
          <Switch>
            <Route
              exact
              path="/login"
              name="Login Page"
              render={(props) => <Login {...props} />}
            />
            <Route
              exact
              path="/register"
              name="Register Page"
              render={(props) => <Register {...props} />}
            />
            {/* <Route
              exact
              path="/login"
              name="Login Page"
              render={(props) => <ServerMaintainanceLogin {...props} />}
            />
            <Route
              exact
              path="/register"
              name="Register Page"
              render={(props) => <ServerMaintainanceRegistration {...props} />}
            /> */}
            <Route
              exact
              path="/loginMaintainance"
              name="Login Page"
              render={(props) => <LoginMaintainance {...props} />}
            />
            <Route
              exact
              path="/404"
              name="Page 404"
              render={(props) => <Page404 {...props} />}
            />
            <Route
              exact
              path="/500"
              name="Page 500"
              render={(props) => <Page500 {...props} />}
            />
            <Route
              exact
              path="/download"
              name="Signed Doc"
              render={(props) => <Download {...props} />}
            />
            <Route
              exact
              path="/esign_error"
              name="ESign Error"
              render={(props) => <ESign_error {...props} />}
            />
            <Route
              exact
              path="/consenteSignRsep"
              name="Consent eSign Response"
              render={(props) => <ConsenteSignResp {...props} />}
            />
            <Route
              exact
              path="/consenteSign"
              name="Consent eSign NSDL Page"
              render={(props) => <ConsenteSign {...props} />}
            />
            <Route
              exact
              path="/home"
              name="Landing Page"
              render={(props) => <LandingPage {...props} />}
            />
            <Route
              exact
              path="/jsGuest"
              name="Multi Ppl Sign Guest"
              render={(props) => <MultiPplSignHomePage {...props} />}
            />

            <Route
              path="/termsandconditions"
              name="Terms and Condition"
              render={(props) => <TandC {...props} />}
            />
            <Route
              path="/privacypolicy"
              name="Privacy Policy"
              render={(props) => <PrivacyPolicy {...props} />}
            />
            <Route
              exact
              path="/KYCStatusResponse"
              name="KYCStatusResponse"
              render={(props) => <KYCStatusResponse {...props} />}
            />
             <Route
              exact
              path="/deGuest"
              name="Multi Ppl Sign Guest"
              render={(props) => <MultiPplSignMobilePage {...props} />}
            />
         
           
            {/* <Route
              exact
              path="/DemoVideoPage"
              name="DemoVideoPage"
              render={(props) => <DemoVideoPage {...props} />}
            /> */}
            {/* <Route path="/TEST" name="test" render={props => <Test {...props} />} /> */}
            <Route
              path="/"
              name="Home"
              render={(props) => <DefaultLayout {...props} />}
            />


          </Switch>
        </React.Suspense>
      </Router>
    );
  }
}

export default App;
