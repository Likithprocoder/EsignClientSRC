import React, { Component, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import Notifications, { notify } from "react-notify-toast";
import mySignLogo from "./logo/appLogo.png";
import { URL } from "../../../containers/URLConstant";
import $ from "jquery";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { AppFooter } from "@coreui/react";
const DefaultFooter = React.lazy(() =>
  import("../../../containers/DefaultLayout/DefaultFooter")
);

var Loader = require("react-loader");
const publicIp = require("public-ip");

let myColor = {
  background: "#ff7675",
  text: "#FFFFFF",
};
var timerEvent = null;
class Login extends Component {
  constructor() {
    super();
    this.state = {
      passwordSuggestionMessage: "",
      username: "",
      password: "",
      repassword: "",
      otp: "",
      loaded: true,
      emailRefNo: "",
      mobRefNo: "",
      mobileNumOtp: "",
      emailOtp: "",
      disabled: "true",
      timeleft: 30,
      backToLogin: false,
     
      userIPCount:0,
    };
    this.login = this.login.bind(this);
    this.keypressed = this.keypressed.bind(this);
    this.keypressedMoveToOTPFiled = this.keypressedMoveToOTPFiled.bind(this);
    this.keypressedResetCall = this.keypressedResetCall.bind(this);
  }

  setInput = (e) => {
    // let regExp = new RegExp(/^[ A-Za-z0-9_ ]*$/);
    let regExp = new RegExp(/^[ A-Za-z0-9!@#\$%\^& .]*$/);
    let regExp1 = new RegExp(/^[ A-Za-z0-9!@#\$%\^& ]*$/);
    let regNum = new RegExp(/^[0-9]*$/);
    let value = e.target.value;
    let name = e.target.name;
    if (name === "username") {
      if (regExp.test(e.target.value)) {
        this.setState({ username: value });
      } else {
        return false;
      }
    }
    if (name === "password") {
      if (regExp1.test(e.target.value)) {
        this.setState({ password: value });
      } else {
        return false;
      }
    }
    if (name === "otp") {
      if (regNum.test(e.target.value)) {
        this.setState({ otp: value });
      } else {
        return false;
      }
    }
    if (name === "otp") {
      if (regNum.test(e.target.value)) {
        this.setState({ emailOtp: value, mobileNumOtp: value });
      } else {
        return false;
      }
    }
    if (name === "repassword") {
      if (regExp1.test(e.target.value)) {
        this.setState({ repassword: value });
      } else {
        return false;
      }
    }
  };

  componentDidMount() {
    $(document).keypress(function (event) {
      if (event.which == "13") {
        event.preventDefault();
      }
    });
     var userip = "";
    //  $.getJSON("https://api.ipify.org?format=json", function (data) {
    //   userip = data.ip;
    //   sessionStorage.setItem("userIP", userip);
    // });
    this.fetchIP();
  }


  fetchIP = () => {
    $.getJSON("https://api.ipify.org?format=json", (data) => {
      var userip=data.ip;
      let userIPPresent = this.checkUserIP(userip);
      if (userIPPresent==true) {
        sessionStorage.setItem("userIP", userip);
        return userip;
      }else{
        this.fetchIP();
      }
    });
  }
  
  checkUserIP = (userip) => {
   
    if (userip == null || userip == undefined ||userip=="" ) {   
        return false;
    } else {
      return true;
    }
  }
  showPasswordSuggestion = () => {
    this.setState({
      passwordSuggestionMessage:
        "Note: Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special character",
    });
  };
  showPasswordSuggestionReset = () => {
    this.setState({ passwordSuggestionMessage: "" });
  };

  login = () => {
    if (this.state.username.length !== 0) {
      if (this.state.password.length !== 0) {
        if(sessionStorage.getItem("userIP")!= null || sessionStorage.getItem("userIP")!= undefined){
         console.log("userIp:"+sessionStorage.getItem("userIP"))
        this.setState({ loaded: false });
        var body = {
          username: btoa(this.state.username),
          password: btoa(this.state.password),
          userIP: sessionStorage.getItem("userIP"),
        };

        fetch(URL.login, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // 'Accept': 'application/json'
          },
          body: JSON.stringify(body),
        })
          .then((response) => {
            return response.json();
          })
          .then((responseJson) => {
            if (responseJson.status === "SUCCESS") {
              let isAuthenticated = true;
              sessionStorage.setItem("isAuthenticated", isAuthenticated);
              this.setState({ loaded: true });
              sessionStorage.setItem("authToken", responseJson.authToken);
              sessionStorage.setItem("username", responseJson.name);
              sessionStorage.setItem("firstName", responseJson.firstName);
              // sessionStorage.setItem("verifyMobile", responseJson.verifyMobile)
              sessionStorage.setItem("roleID", responseJson.roleId);
              var menus = JSON.stringify(responseJson.menu);
              sessionStorage.setItem("items", menus);
              this.props.history.push("/");
            } else {
              this.setState({ loaded: true });
              notify.show(responseJson.statusDetails, "custom", 5000, myColor);
            }
          })
          .catch((e) => {
            this.setState({ loaded: true });
            notify.show("Failed to connect to server", "custom", 5000, myColor);
          });
        } else {
         // notify.show("Failed to fetch User IP, Refresh the page and try again", "custom", 5000, myColor);
        
          if(this.state.userIPCount>=3){
              notify.show("Failed to fetch User IP, Refresh the page and try again", "custom", 5000, myColor);
            }else{
              this.setState((prevState) => ({
                userIPCount: prevState.userIPCount + 1,
              }));
              {this.fetchIP()}
            }
        }
      } else {
        notify.show("please enter your password!", "custom", 5000, myColor);
      }
    } else {
      notify.show("please enter your login name!", "custom", 5000, myColor);
    }
  };

  resetPassword = () => {
    let passwordLetters = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
    );
    if (this.state.otp !== 0 && this.state.otp.trim() !== "") {
      if (this.state.password !== 0 && this.state.password.trim() !== "") {
        if (
          this.state.repassword !== 0 &&
          this.state.repassword.trim() !== ""
        ) {
          if (this.state.password === this.state.repassword) {
            if (passwordLetters.test(this.state.password)) {
              this.setState({ passwordSuggestionMessage: "" });
              var body = {
                loginname: btoa(this.state.username),
                emailOtp: btoa(this.state.otp),
                emailRefNo: btoa(this.state.emailRefNo),
                mobRefNo: btoa(this.state.mobRefNo),
                mobileNumOtp: btoa(this.state.mobileNumOtp),
                password: btoa(this.state.password),
                userIP: btoa(sessionStorage.getItem("userIP")),
                optnType: "FGTPAS",
              };
              this.setState({ loaded: false });
              fetch(URL.forgotPassword, {
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
                  if (responseJson.status === "SUCCESS") {
                    document.getElementById("resendOtpbtn").style.display =
                      "none";
                    document.getElementById("timer").style.display = "none";
                    this.startResendOtpTimer.bind(this).timeleft = 0;
                    document.getElementById("timer").innerHTML =
                      "Resend OTP in " + 30 + " Secs";

                    clearInterval(timerEvent);
                    this.setState({ loaded: true });
                    confirmAlert({
                      message: responseJson.statusDetails,
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn",
                          onClick: () => {
                            this.props.history.push("/");
                          },
                        },
                      ],
                    });
                  } else {
                    this.setState({ loaded: true });
                    confirmAlert({
                      message:
                        responseJson.statusDetails ===
                        "Validation Failed.Enter Correct OTP"
                          ? "Invalid OTP, Enter Correct OTP"
                          : responseJson.statusDetails,
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn",
                          onClick: () => {},
                        },
                      ],
                    });
                  }
                })
                .catch((e) => {
                  this.setState({ loaded: true });
                  alert(e);
                });
            } else {
              notify.show(
                "Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special character",
                "custom",
                5000,
                myColor
              );
            }
          } else {
            notify.show(
              "Password and Confirm Password Should match",
              "custom",
              5000,
              myColor
            );
          }
        } else {
          notify.show(
            "Please enter Confirm Password!",
            "custom",
            5000,
            myColor
          );
        }
      } else {
        notify.show("Please enter Password!", "custom", 5000, myColor);
      }
    } else {
      notify.show("Please enter OTP!", "custom", 5000, myColor);
    }
  };

  getOTP = () => {
    this.setState({ password: ""});
    this.setState({ repassword: ""});
    if (this.state.username.length !== 0 && this.state.username.trim() !== "") {
      var body = {
        loginname: btoa(this.state.username),
        optnType: "FGTPAS",
      };
      fetch(URL.getOtpForgotPassword, {
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
          if (responseJson.status === "SUCCESS") {
            confirmAlert({
              message: "OTP sent to registered email ID and mobile number.",
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {
                    document.getElementById("getOTPForm").style.display =
                      "none";
                    document.getElementById("resetOTPForm").style.display = "";
                    this.setState({ loaded: true });
                    this.setState({
                      emailRefNo: responseJson.emailRefNo,
                      mobRefNo: responseJson.mobRefNo,
                    });
                  },
                },
              ],
            });
            this.startResendOtpTimer();
          } else {
            if (responseJson.statusDetails === "Invalid LoginName") {
              this.setState({ loaded: true });
              confirmAlert({
                message: "Invalid credentials",
                buttons: [
                  {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {},
                  },
                ],
              });
            } else {
              this.setState({ loaded: true });
              confirmAlert({
                message: responseJson.statusDetails,
                buttons: [
                  {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {},
                  },
                ],
              });
            }
          }
        })
        .catch((e) => {
          this.setState({ loaded: true });
          alert(e);
        });
    } else {
      notify.show("Please enter your Login name!", "custom", 5000, myColor);
    }
  };

  forgetPassword = () => {
    this.setState({ backToLogin: true});
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("forgotPasswordForm").style.display = "";
    document.getElementById("getOTPForm").style.display = "";//
    document.getElementById("resetOTPForm").style.display = "none";//
  };

  // Function to go back to the Login form
  goBackToLogin = () => {
    this.setState({ otp: ""});
    this.setState({ password: ""});
    this.setState({ backToLogin: false});
    const loginForm = document.getElementById("loginForm"); // Show the Login form
    const forgotPasswordForm = document.getElementById("forgotPasswordForm"); // Hide the Forgot Password form

    // Reset the Forgot Password form and clear validation errors
    forgotPasswordForm.reset();

    // Show the Login form
    loginForm.style.display = "";
  
    // Hide the Forgot Password form
    forgotPasswordForm.style.display = "none";
  };

  goBack() {
    this.props.history.push("/");
  }
  keypressed(target) {
    if (target.charCode === 13) {
      target.preventDefault();
      // console.log(target);
      this.login();
    }
  }
  keypressedMoveToOTPFiled(target) {
    if (target.charCode === 13) {
      target.preventDefault();
      // console.log(target);
      this.getOTP();
    }
  }
  keypressedResetCall(target) {
    if (target.charCode === 13) {
      target.preventDefault();
      // console.log(target);
      this.resetPassword();
    }
  }

  passwordoverPass = (obj) => {
    var obj = document.getElementById("myPassword");
    obj.type = "text";
  };
  passwordoutPass = (obj) => {
    var obj = document.getElementById("myPassword");
    obj.type = "password";
  };

  mouseoverPass = (obj) => {
    var obj = document.getElementById("repassword");
    obj.type = "text";
  };
  mouseoutPass = (obj) => {
    var obj = document.getElementById("repassword");
    obj.type = "password";
  };

  newPasswordOver = (obj) => {
    var obj = document.getElementById("newPassword");
    obj.type = "text";
  };
  newPasswordOUT = (obj) => {
    var obj = document.getElementById("newPassword");
    obj.type = "password";
  };

    // resend otp counter
    startResendOtpTimer = () => {
      this.setState({ timeleft: 30 });
      let timerElement = document.getElementById("timer");
      let resendOtpBtn = document.getElementById("resendOtpbtn");
    
      if (timerElement && resendOtpBtn) {
        resendOtpBtn.style.display = "none";
        timerElement.style.display = "";
    
        let timeleftSec = this.state.timeleft;
        // Clear any existing timer event
        this.stopResendOtpTimer();
        timerEvent = setInterval(() => {
          if (timeleftSec < 0) {
            clearInterval(timerEvent);
            resendOtpBtn.style.display = "";
            timerElement.style.display = "none";
          } else {
            timerElement.innerHTML = "Resend OTP in " + timeleftSec + " Secs";
          }
    
          timeleftSec -= 1;
        }, 1000);
      }
    };

  // resend otp counter for ending the timer
  stopResendOtpTimer = () => {
    if (timerEvent) {
      clearInterval(timerEvent);
      timerEvent = null; // Set timerEvent to null after clearing it
    }
  };

  // // resend otp counter

  // resendOtpTimer = () => {
  //    document.getElementById("resendOtpbtn").style.display = "none";
  //    document.getElementById("timer").style.display = "";
  //   var timeleft = 30;
  //   var downloadTimer = setInterval(function () {
  //     //console.log(timeleft);
  //     if (timeleft < 0) {
  //       clearInterval(downloadTimer);
  //       document.getElementById("resendOtpbtn").style.display = "";
  //       document.getElementById("timer").style.display = "none";
  //     } else {
  //       document.getElementById("timer").innerHTML =
  //         "Resend OTP in " + timeleft+" Secs";
  //     }
  //     timeleft -= 1;
  //   }, 1000);
  // };
  // resend otp counter
  // resendOtpTimer = () => {
  //   this.setState({ timeleft: 30 });
  //   document.getElementById("resendOtpbtn").style.display = "none";
  //   document.getElementById("timer").style.display = "";

  //   var timeleft = this.state.timeleft;
  //   timerEvent = setInterval(function () {
  //     if (timeleft < 0) {
  //       clearInterval(timerEvent);
  //       document.getElementById("resendOtpbtn").style.display = "";
  //       document.getElementById("timer").style.display = "none";
  //     } else {
  //       document.getElementById("timer").innerHTML =
  //         "Resend OTP in " + timeleft + " Secs";
  //     }
  //     timeleft -= 1;
  //   }, 1000);
  // };

  render() {
    return (
      <div className="app flex-row align-items-center" id="loginAppBlock">
        <Notifications />
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
        <Container>
          <div className="isign-logo">
            <img style={{ height: "100%" }} src={mySignLogo}></img>
          </div>
          <br></br>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  {(this.state.backToLogin) && (<Button style={{ color: "black", background: "#f0f3f5", height: "30px", width: "60px" }} onClick={this.goBackToLogin}>
                    <div style={{ marginTop: "-12px", fontSize: "x-large", color: "grey"}}>&larr;</div>
                  </Button>)}
                  <CardBody>
                    <Form id="loginForm">
                      <h1>Login</h1>
                      <br></br>
                      {/* <p className="text-muted">Sign In to your account</p> */}
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Email/Mobile"
                          name="username"
                          onChange={this.setInput}
                          value={this.state.username}
                          onKeyPress={this.keypressed}
                          autoComplete="off"
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          id="myPassword"
                          type="password"
                          placeholder="Password"
                          name="password"
                          value={this.state.password}
                          onKeyPress={this.keypressed}
                          onChange={this.setInput}
                          autoComplete="off"
                        />
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i
                              className="fa fa-unlock"
                              onMouseOver={this.passwordoverPass}
                              onMouseOut={this.passwordoutPass}
                            ></i>
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="primary"
                            className="px-4"
                            onClick={this.login}
                          >
                            Login
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button
                            color="link"
                            className="px-0"
                            title="OTP based Reset Password"
                            onClick={this.forgetPassword}
                          >
                            Forgot password?
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                    <Form id="forgotPasswordForm" style={{ display: "none" }}>
                      <h2>Forgot Password</h2>
                      <div id="getOTPForm">
                        <p className="text-muted">
                          OTP will be sent to registered mobile
                        </p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            placeholder="Email/Mobile"
                            name="username"
                            onChange={this.setInput}
                            value={this.state.username}
                            onKeyPress={this.keypressedMoveToOTPFiled}
                            autoComplete="off"
                          />
                        </InputGroup>
                        <Row>
                          <Col xs="8">
                            <Button
                              color="primary"
                              className="px-4"
                              onClick={this.getOTP}
                            >
                              Get OTP
                            </Button>
                          </Col>
                        </Row>
                      </div>
                      {/* <div id="resetOTPForm" style={{ display: "none" }}>
                        <p className="text-muted">Enter OTP and new Password</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            placeholder="Enter OTP"
                            onClick={this.showPasswordSuggestionReset}
                            name="otp"
                            maxLength={6}
                            onChange={this.setInput}
                            value={this.state.otp}
                            autoComplete="off"
                          />
                        </InputGroup>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={this.state.password}
                            title="Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special character"
                            onKeyPress={this.keypressed}
                            onClick={this.showPasswordSuggestion}
                            onChange={this.setInput}
                            autoComplete="off"
                            required={true}
                          />
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i
                                className="fa fa-unlock"
                                onMouseOver={this.newPasswordOver}
                                onMouseOut={this.newPasswordOUT}
                              ></i>
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            id="repassword"
                            type="password"
                            placeholder="Confirm Password"
                            name="repassword"
                            value={this.state.repassword}
                            title="Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special character"
                            onKeyPress={this.keypressed}
                            onClick={this.showPasswordSuggestion}
                            onChange={this.setInput}
                            autoComplete="off"
                            required={true}
                          />
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i
                                className="fa fa-unlock"
                                onMouseOver={this.mouseoverPass}
                                onMouseOut={this.mouseoutPass}
                              ></i>
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        <p style={{ fontSize: "12px" }}>
                          {this.state.passwordSuggestionMessage}
                        </p>
                        <Row>
                          <Col xs="8">
                            <Button
                              color="primary"
                              className="px-3"
                              onClick={this.resetPassword}
                            >
                              Reset Password
                            </Button>
                          </Col>

                          <Col xs="8" className="text-right">
                            <Button
                              id="resendOtpbtn"
                              style={{
                                marginRight: "-95px",
                                float: "right",
                                // display: "none",
                              }}
                              color="link"
                              className="px-1"
                              // title="OTP based Reset Password"
                              onClick={this.getOTP}
                            >
                              Resend OTP
                            </Button>
                          </Col>
                        </Row>
                        <p>
                          <span id="timer" style={{ display: "" }}></span>{" "}
                        </p>
                      </div> */}
                      <div id="resetOTPForm" style={{ display: "none" }}>
                        <p className="text-muted">Enter OTP and new Password</p>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            placeholder="Enter OTP"
                            name="otp"
                            onChange={this.setInput}
                            value={this.state.otp}
                            autoComplete="off"
                            onKeyPress={this.keypressedResetCall}
                            maxLength={6}
                            minLength={6}
                          />
                        </InputGroup>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={this.state.password}
                            title="Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special character"
                            onKeyPress={this.keypressedResetCall}
                            onChange={this.setInput}
                            autoComplete="off"
                            required={true}
                          />
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i
                                className="fa fa-unlock"
                                onMouseOver={this.newPasswordOver}
                                onMouseOut={this.newPasswordOUT}
                              ></i>
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            id="repassword"
                            type="password"
                            placeholder="Confirm Password"
                            name="repassword"
                            value={this.state.repassword}
                            title="Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special character"
                            onKeyPress={this.keypressedResetCall}
                            onChange={this.setInput}
                            autoComplete="off"
                            required={true}
                          />
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i
                                className="fa fa-unlock"
                                onMouseOver={this.mouseoverPass}
                                onMouseOut={this.mouseoutPass}
                              ></i>
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        <Row>
                          <Col xs="6">
                            <Button
                              color="primary"
                              className="px-2"
                              onClick={this.resetPassword}
                            >
                              Reset Password
                            </Button>
                          </Col>
                          <Col xs="6" className="text-center">
                            <span
                              id="timer"
                              style={{
                                verticalAlign: "-webkit-baseline-middle",

                                marginLeft: "-5px",
                                marginTop: "3%",
                                display: "",
                                color: "#73818f",
                                fontSize: "0.875rem",
                              }}
                            ></span>{" "}
                            <Button
                              style={{
                                // marginRight: "-95px",
                                float: "right",
                                display: "none",
                              }}
                              color="link"
                              className="px-0"
                              id="resendOtpbtn"
                              // title="OTP based Reset Password"
                              onClick={this.getOTP}
                            >
                              Resend OTP
                            </Button>
                          </Col>
                          <Col xs="8" className="text-right">
                            {/* <Button
                              style={{
                                marginRight: "-95px",
                                float: "right",
                                display: "none",
                              }}
                              color="link"
                              className="px-0"
                              id="resendOtpbtn"
                              // title="OTP based Reset Password"
                              onClick={this.getOTP}
                            >
                              Resend OTP
                            </Button> */}
                          </Col>
                        </Row>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white bg-primary py-5 ">
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <h6>
                        Sign your document with Aadhaar eSign/Electronic
                        Sign/DSC Token/OTP Based Sign
                      </h6>
                      {/* <h6>Signing the documents with Aadhaar is now at your fingertips!</h6> */}
                      <Link to="/register">
                        <Button
                          color="primary"
                          className="mt-3"
                          active
                          tabIndex={-1}
                        >
                          Register Now
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
              {/* <p style={{textAlign:"center",marginTop:"2%"}}>
                Best viewed in Google Chrome (with resolution 1024x768 or
                higher)
              </p> */}
            </Col>
          </Row>
        </Container>

        <div className="fixed-bottom">
          <footer className="app-footer">
            <span id="footer">
              <a href="https://www.integramicro.com/" target="_blank">
                <img
                  src="/static/media/IntegraLogo.50ad4a4c.png"
                  width="45px"
                />
              </a>{" "}
              {URL.footerContent}
            </span>
          </footer>
        </div>
      </div>
    );
  }
}

export default Login;
