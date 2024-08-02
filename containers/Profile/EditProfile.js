import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Row,
  CardHeader,
} from "reactstrap";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import InputGroupAddon from "reactstrap/lib/InputGroupAddon";
import InputGroup from "reactstrap/lib/InputGroup";
import { notify } from "react-notify-toast";
import { green, yellow } from "@material-ui/core/colors";
import { ThreeSixty } from "@material-ui/icons";
import $ from "jquery";

var Loader = require("react-loader");
var timerEvent = null;

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      loginname: "",
      email: "",
      mobile: "",
      otp: "",
      loaded: true,
      mobRefNo: "",
      emailRefNo: "",
      optnType: "",
      mobileNumOtp: "",
      emailOtp: "",
      editJsondata: {},
      prevusername: "",
      prevmobile: "",
      prevemail: "",
      timeleft: 30,
      backToProfileDetails: true,
    };
  }

  componentWillMount() {
    var body = {
      loginname: sessionStorage.getItem("username"),
      authToken: sessionStorage.getItem("authToken"),
    };
    this.setState({ loaded: false });
    fetch(URL.getProfileDetails, {
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
          this.setState({
            username: responseJson.username,
            loginname: sessionStorage.getItem("username"),
            email: responseJson.email,
            mobile: responseJson.mobile,
            loaded: true,
            prevusername: responseJson.username,
            prevemail: responseJson.email,
            prevmobile: responseJson.mobile,
          });
        } else {
          if (responseJson.statusDetails === "Session Expired!!") {
            this.setState({ loaded: true });
            sessionStorage.clear();
            this.props.history.push("/login");
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
  }

  setInput = (e) => {
    let regName = new RegExp(/^[A-Za-z0-9_ ]*$/);
    let regPassword = new RegExp(/^[A-Za-z0-9!.@#\$%\^&_ ]*$/);
    let regNum = new RegExp(/^[0-9]*$/);
    let value = e.target.value;
    let name = e.target.name;
    let mobileNumberDigits =
      /^(?:(?:\\+|0{0,2})91(\s*[\\-]\s*)?|[0]?)?[6789]\d{9}$/;
    $("#mobile").change(function () {
      document.getElementById("submitBtn").style.display = "";
      // alert("Handler for .change() called.");
    });
    $("#email").change(function () {
      document.getElementById("submitBtn").style.display = "";
      // alert("Handler for .change() called.");
    });
    $("#username").change(function () {
      document.getElementById("submitBtn").style.display = "";
      // alert("Handler for .change() called.");
    });
    if (name === "username") {
      if (regName.test(e.target.value)) {
        this.setState({ username: value });
      } else {
        return false;
      }
    }
    if (name === "loginname") {
      if (regName.test(e.target.value)) {
        this.setState({ loginname: value });
      } else {
        return false;
      }
    }
    if (name === "email") {
      if (regPassword.test(e.target.value)) {
        this.setState({ email: value });
      } else {
        return false;
      }
    }
    if (name === "mobile") {
      value = e.target.value;

      if (regNum.test(value)) {
          this.setState({ mobile: value });
      } else {
        return false;
      }
    }
    if (name === "emailOtp") {
      if (regNum.test(e.target.value)) {
        this.setState({ emailOtp: value });
      } else {
        return false;
      }
    }
    if (name === "mobileNumOtp") {
      if (regNum.test(e.target.value)) {
        this.setState({ mobileNumOtp: value });
      } else {
        return false;
      }
    }
  };
  profileEdit = () => {
    // let json1 = {
    //   loginname: this.state.loginname,
    //   username: this.state.username,
    //   authToken: sessionStorage.getItem("authToken"),
    //   mobile: this.state.mobile,
    //   email: this.state.email.toLowerCase(),
    //   // password: btoa(this.state.password),
    //   userIP: sessionStorage.getItem("userIP"),
    // };
    // console.log(json1, this.state.optnType);
    let json = {
      loginname: this.state.loginname,
      username: this.state.username,
      authToken: sessionStorage.getItem("authToken"),
      // mobile: btoa(this.state.mobile),
      // email: btoa(this.state.email.toLowerCase()),
      mobile: this.state.mobile,
      email: this.state.email.toLowerCase(),
      // password: btoa(this.state.password),
      userIP: sessionStorage.getItem("userIP"),
    };
    if (this.state.optnType === "USREDM"  || this.state.optnType === "USREDE" ||this.state.optnType === "USREDU") {
    //   if (
    //     this.state.mobileNumOtp.length !== 0 &&
    //     this.state.mobileNumOtp.length == 6 &&
    //     this.state.mobileNumOtp.trim() !== ""
    //   ) {
    //     json.mobileNumOtp = btoa(this.state.mobileNumOtp);
    //     json.mobRefNo = btoa(this.state.mobRefNo);
    //     json.optnType = this.state.optnType;
    //     this.editProfileCall(json);
    //   } else {
    //     confirmAlert({
    //       message: "Enter a Valid Mobile OTP",
    //       buttons: [
    //         {
    //           label: "OK",
    //           className: "confirmBtn",
    //           onClick: () => {},
    //         },
    //       ],
    //     });
    //   }
    // } 
    // else if (this.state.optnType === "USREDE") {
    //   if (
    //     this.state.emailOtp.length !== 0 &&
    //     this.state.emailOtp.length == 6 &&
    //     this.state.emailOtp.trim() !== ""
    //   ) {
    //     json.emailRefNo = btoa(this.state.emailRefNo);
    //     json.emailOtp = btoa(this.state.emailOtp);
    //     json.optnType = btoa(this.state.optnType);

    //     this.editProfileCall(json);
    //   } else {
    //     confirmAlert({
    //       message: "Enter a Valid Email OTP",
    //       buttons: [
    //         {
    //           label: "OK",
    //           className: "confirmBtn",
    //           onClick: () => {},
    //         },
    //       ],
    //     });
    //   }
    // } 
    // else if (this.state.optnType === "USREDU") {
      if (
        this.state.mobileNumOtp.length !== 0 &&
        this.state.mobileNumOtp.length == 6 &&
        this.state.mobileNumOtp.trim() !== ""
      ) {
        if (
          this.state.emailOtp.length !== 0 &&
          this.state.emailOtp.length == 6 &&
          this.state.emailOtp.trim() !== ""
        ) {
          json.emailOtp = btoa(this.state.emailOtp);
          json.mobileNumOtp = btoa(this.state.mobileNumOtp);
          json.optnType = btoa(this.state.optnType);
          json.emailRefNo = btoa(this.state.emailRefNo);
          json.mobRefNo = btoa(this.state.mobRefNo);
          // json.emailOtp = this.state.emailOtp;
          // json.mobileNumOtp = this.state.mobileNumOtp;
          // json.optnType = this.state.optnType;
          // json.emailRefNo = this.state.emailRefNo;
          // json.mobRefNo = this.state.mobRefNo;

          this.editProfileCall(json);
        } else {
          confirmAlert({
            message: "Enter a Valid Email OTP",
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {},
              },
            ],
          });
        }
      } else {
        confirmAlert({
          message: "Enter a Valid Mobile OTP",
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

    let myColor = {
      background: "#ff7675",
      text: "#FFFFFF",
    };
  };
  editProfileCall = (data) => {
    let json = data;
    let myColor = {
      color: yellow,
    };
    fetch(URL.editProfile, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          document.getElementById("resentOTPBtn").style.display = "none";
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
                onClick: () => {},
              },
            ],
          });
          this.props.history.push("/profileDetails");
        } else {
          this.setState({ loaded: true });
          confirmAlert({
            message:
              responseJson.statusDetails ===
              "Validation Failed.Enter Correct OTP"
                ? "Enter the correct OTP"
                : responseJson.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {},
              },
            ],
          });
          // alert(responseJson.statusDetails)
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert("Failed to connect to server", "custom", 5000, myColor);
      });
  };
  // };

  //------------------------------Update API calls---------------------------------------
  //------------updateUserName---------------
  updateUserName = () => {
    document.getElementById("username").readOnly = false;
    document.getElementById("userEdit").disabled = true;
    this.setState({ disabled: "" });
    document.getElementById("submitBtn").style.display = "";
    // $("#username").on(function () {
    //   document.getElementById("submitBtn").style.display = "";
    //   // alert("Handler for .change() called.");
    // });
    document.getElementById("mobile").readOnly = true;
    document.getElementById("email").readOnly = true;
    // document.getElementById("emailEdit").disabled = false;
    // document.getElementById("mobileEdit").disabled = false;
    //k------------making userEdit,mobileEdit,emailEdit icons disable-------------

    document.getElementById("mobileEdit").style.pointerEvents = "none";
    document.getElementById("emailEdit").style.pointerEvents = "none";
    // document.getElementById("userEdit").style.pointerEvents = "none";

    this.setState({ optnType: "USREDU" });
    // this.userUpdateAPI(json);
  };
  //----------UpdateMobileNo------------------

  updateMobileNo = () => {
    document.getElementById("mobile").readOnly = false;
    document.getElementById("mobileEdit").disabled = true;
    //k------------making userEdit,mobileEdit,emailEdit icons disable-------------
    // document.getElementById("mobileEdit").style.pointerEvents = "none";
    document.getElementById("emailEdit").style.pointerEvents = "none";
    document.getElementById("userEdit").style.pointerEvents = "none";
    document.getElementById("submitBtn").style.display = "";
    // $("#mobile").change(function () {
    //   document.getElementById("submitBtn").style.display = "";
    //   // alert("Handler for .change() called.");
    // });
    document.getElementById("username").readOnly = true;
    document.getElementById("email").readOnly = true;

    this.setState({ optnType: "USREDM" });
  };
  //---------update Email Id--------------
  updateEmail = () => {
    document.getElementById("email").readOnly = false;
    document.getElementById("emailEdit").disabled = true;
    // document.getElementById("userEdit").disabled = false;
    // document.getElementById("mobileEdit").disabled = false;
    //k------------making userEdit,mobileEdit,emailEdit icons disable-------------
    document.getElementById("mobileEdit").style.pointerEvents = "none";
    // document.getElementById("emailEdit").style.pointerEvents = "none";
    document.getElementById("userEdit").style.pointerEvents = "none";
    document.getElementById("submitBtn").style.display = "";
    // $("#email").change(function () {
    //   document.getElementById("submitBtn").style.display = "";
    //   // alert("Handler for .change() called.");
    // });
    document.getElementById("username").readOnly = true;
    document.getElementById("mobile").readOnly = true;
    // let editJsondata = {
    //   optnType: "USREDE",
    //   // emailId: this.state.email,
    //   // loginname: this.state.loginname,
    //   authToken: sessionStorage.getItem("authToken"),
    // };
    this.setState({ optnType: "USREDE" });
  };
  //  username: responseJson.username,
  //             loginname: sessionStorage.getItem("username"),
  //             email: responseJson.email,
  //             mobile: responseJson.mobile,
  //--------------Update Fetch API----------
  userUpdateAPI = () => {
    let editJsondata;
    // email update json
    if (this.state.optnType == "USREDE") {
      editJsondata = {
        optnType: "USREDE",
        emailId: this.state.email.toLowerCase(),
        loginname: this.state.loginname,
        authToken: sessionStorage.getItem("authToken"),
      };
      this.setState({ editJsondata: editJsondata });
    } else if (this.state.optnType == "USREDM") {
        var mobNumFirstDigit= this.state.mobile.charAt(0);
        if(mobNumFirstDigit<6){
          confirmAlert({
            message: "Invalid mobile number, please verify",
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {},
              },
            ],
          });
          return;
        }
      editJsondata = {
        optnType: "USREDM",
        mobileNum: this.state.mobile,
        loginname: this.state.loginname,
        authToken: sessionStorage.getItem("authToken"),
      };
    } else if (this.state.optnType === "USREDU") {
      editJsondata = {
        optnType: "USREDU",
        emailId: this.state.email.toLowerCase(),
        mobileNum: this.state.mobile,
        loginname: this.state.loginname,
        authToken: sessionStorage.getItem("authToken"),
      };
    }
    // console.log(this.state.prevusername, this.state.username);
    if (
      this.state.prevusername === this.state.username &&
      this.state.optnType === "USREDU"
    ) {
      confirmAlert({
        message: "No changes to update",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
    } else if (
      this.state.prevemail === this.state.email &&
      this.state.optnType === "USREDE"
    ) {
      confirmAlert({
        message: "No changes to update",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
    } else if (
      this.state.prevmobile === this.state.mobile &&
      this.state.optnType == "USREDM"
    ) {
      confirmAlert({
        message: "No changes to update",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
    } else {
      let data = editJsondata;
      let myColor = {
        color: yellow,
      };
      let regEmail = new RegExp(/[\w-]+@([\w-]+\.)+[\w-]+/);
      if (
        this.state.username.length !== 0 &&
        this.state.username.trim() !== ""
      ) {
        if (
          this.state.email.length !== 0 &&
          regEmail.test(this.state.email) &&
          this.state.email.trim() !== ""
        ) {
          if (
            this.state.mobile.length !== 0 &&
            this.state.mobile.length == 10 &&
            this.state.mobile.trim() !== ""
          ) {
            fetch(URL.getOtpforEditProfileVerftn, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            })
              .then((response) => {
                return response.json();
              })
              .then((responseJson) => {
                this.setState({
                  emailRefNo: responseJson.emailRefNo,
                  mobRefNo: responseJson.mobRefNo,
                });

                if (responseJson.status === "SUCCESS") {
                 
                  if (
                    JSON.stringify(responseJson).includes("mobRefNo") ||
                    JSON.stringify(responseJson).includes("emailRefNo")
                  ) {
                    if (
                      JSON.stringify(responseJson).includes("mobRefNo") &&
                      JSON.stringify(responseJson).includes("emailRefNo")
                    ) {
                      this.mobRefNo = responseJson.mobRefNo;
                      this.emailRefNo = responseJson.emailRefNo;
                       confirmAlert({
                         message: "OTP sent to registered email ID and mobile number.",
                         buttons: [
                           {
                             label: "OK",
                             className: "confirmBtn",
                             onClick: () => {
                               this.startResendOtpTimer();
                               document.getElementById(
                                 "mobileOtpContainer"
                               ).style.display = "";
                               document.getElementById(
                                 "emailOtpContainer"
                               ).style.display = "";
                               document.getElementById(
                                 "username"
                               ).readOnly = true;
                               document.getElementById("email").readOnly = true;
                               document.getElementById(
                                 "mobile"
                               ).readOnly = true;
                               //k------------making userEdit,mobileEdit,emailEdit icons disable-------------
                               document.getElementById(
                                 "mobileEdit"
                               ).style.pointerEvents = "none";
                               document.getElementById(
                                 "emailEdit"
                               ).style.pointerEvents = "none";
                               document.getElementById(
                                 "userEdit"
                               ).style.pointerEvents = "none";
                               document.getElementById(
                                 "submitBtn"
                               ).style.display = "none";
                               document.getElementById(
                                 "submitchangesBtn"
                               ).style.display = "";
                               // document.getElementById("resentOTPBtn").style.display = "";
                             },
                           },
                         ],
                       });
                      
                    } else if (
                      JSON.stringify(responseJson).includes("emailRefNo")
                    ) {
                      this.emailRefNo = responseJson.emailRefNo;
                      confirmAlert({
                        message:
                          "OTP sent to registered email ID and mobile number.",
                        buttons: [
                          {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => {
                               document.getElementById("mobile").readOnly = true;
                            document.getElementById("email").readOnly = true;
                            // document.getElementById("mobileEdit").disabled = true;
                            document.getElementById("username").readOnly = true;
                            // document.getElementById("userEdit").disabled = true;
                            //k------------making userEdit,mobileEdit,emailEdit icons disable-------------
                            document.getElementById(
                              "mobileEdit"
                            ).style.pointerEvents = "none";
                            document.getElementById(
                              "emailEdit"
                            ).style.pointerEvents = "none";
                            document.getElementById(
                              "userEdit"
                            ).style.pointerEvents = "none";
                            document.getElementById(
                              "mobileOtpContainer"
                            ).style.display = "none";
                            document.getElementById(
                              "emailOtpContainer"
                            ).style.display = "";
                            document.getElementById("submitBtn").style.display =
                              "none";
                            document.getElementById(
                              "submitchangesBtn"
                            ).style.display = "";

                            },
                          },
                        ],
                      });
                     
                      // document.getElementById("resentOTPBtn").style.display = "";
                    } else if (
                      JSON.stringify(responseJson).includes("mobRefNo")
                    ) {
                      confirmAlert({
                        message:
                          "OTP sent to registered email ID and mobile number.",
                        buttons: [
                          {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => {
                              this.mobRefNo = responseJson.mobRefNo;
                              document.getElementById("email").readOnly = true;
                              document.getElementById("mobile").readOnly = true;
                              // document.getElementById("emailEdit").disabled = true;

                              document.getElementById(
                                "username"
                              ).readOnly = true;
                              // document.getElementById("userEdit").disabled = true;
                              document.getElementById(
                                "emailOtpContainer"
                              ).style.display = "none";
                              //k------------making userEdit,mobileEdit,emailEdit icons disable-------------
                              document.getElementById(
                                "mobileEdit"
                              ).style.pointerEvents = "none";
                              document.getElementById(
                                "emailEdit"
                              ).style.pointerEvents = "none";
                              document.getElementById(
                                "userEdit"
                              ).style.pointerEvents = "none";
                              document.getElementById(
                                "mobileOtpContainer"
                              ).style.display = "";
                              document.getElementById(
                                "submitBtn"
                              ).style.display = "none";
                              document.getElementById(
                                "submitchangesBtn"
                              ).style.display = "";
                              // document.getElementById("resentOTPBtn").style.display = "";
                            },
                          },
                        ],
                      });
                    
                    }
                  }
                } else {
                  if (responseJson.statusDetails === "Session Expired!!") {
                    sessionStorage.clear();
                    this.props.history.push("/login");
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
                  } else {
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
            confirmAlert({
              message: "Please Enter Valid Mobile Number!",
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {},
                },
              ],
            });
          }
        } else {
          confirmAlert({
            message: "Please Enter Your Email!",
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {},
              },
            ],
          });
        }
      } else {
        confirmAlert({
          message: "Please Enter Your Full Name!",
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
  };
  // resend otp counter
  startResendOtpTimer = () => {
    this.setState({ timeleft: 30 });
    let timerElement = document.getElementById("timer");
    let resendOtpBtn = document.getElementById("resentOTPBtn");
  
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

  // resend otp counter
  // resendOtpTimer = () => {
  //   this.setState({ timeleft: 30 });
  //   document.getElementById("resentOTPBtn").style.display = "none";
  //   document.getElementById("timer").style.display = "";

  //   var timeleft = this.state.timeleft;
  //   timerEvent = setInterval(function () {
  //     if (timeleft < 0) {
  //       clearInterval(timerEvent);
  //       document.getElementById("resentOTPBtn").style.display = "";
  //       document.getElementById("timer").style.display = "none";
  //     } else {
  //       document.getElementById("timer").innerHTML =
  //         "Resend OTP in " + timeleft + " Secs";
  //     }
  //     timeleft -= 1;
  //   }, 1000);
  // };

  goBackToProfileDetails = () => {
    this.setState({ backToProfileDetails: false});
    this.props.history.push("/profileDetails");
    document.getElementById("timer").style.display = "none";
    document.getElementById("resentOTPBtn").style.display = "none";
    this.stopResendOtpTimer();
  };  

  render() {
    return (
      <div>
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
        <Row>
          <Col xs="12" sm="6" md="5" style={{ marginLeft: "-25px" }}>
          {(this.state.backToProfileDetails) && (<Button style={{ color: "black", background: "#f0f3f5", height: "30px", width: "60px", margin: "0% 6% 2% 6%" }} onClick={this.goBackToProfileDetails}>
                    <div style={{ marginTop: "-12px", fontSize: "x-large", color: "grey"}}>&larr;</div>
                  </Button>)}
            <Card className="mx-4">
              <CardHeader>
                <b>Edit Profile</b>
              </CardHeader>
              <CardBody className="p-4">
                <table style={{ width: "100%" }}>
                  <tbody>
                    {/* <tr style={{ height: "30px" }}>
                      <td>Login Name</td>
                      <td>:</td>
                      <td>
                        <InputGroup>
                          <Input
                            id="loginname"
                            type="text"
                            name="loginname"
                            placeholder="User Name"
                            autoComplete="off"
                            onChange={this.setInput}
                            value={this.state.loginname}
                            maxLength="25"
                            readOnly={true}
                          />
                        </InputGroup>
                      </td>
                      <td></td>
                    </tr> */}
                    <tr style={{ height: "30px" }}>
                      <td style={{ width: "25%", height: "25px" }}>
                        Full Name
                      </td>
                      <td>:</td>
                      <td>
                        <InputGroup>
                          <Input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Full Name"
                            autoComplete="off"
                            onChange={this.setInput}
                            value={this.state.username}
                            maxLength="25"
                            readOnly={true}
                          />
                        </InputGroup>
                      </td>
                      <td>
                        <div
                          id="userEdit"
                          style={{
                            marginTop: "auto",
                            cursor: "pointer",
                            marginLeft: "3px",
                          }}
                        >
                          <i
                            onClick={this.updateUserName}
                            class="fa fa-pencil-square-o fa-2x "
                            style={{ color: " #3b4369" }}
                          ></i>{" "}
                        </div>
                      </td>
                    </tr>

                    <tr style={{ height: "30px" }}>
                      <td>Email-ID</td>
                      <td>:</td>
                      <td>
                        <InputGroup>
                          <Input
                            id="email"
                            type="text"
                            name="email"
                            placeholder="Email"
                            autoComplete="off"
                            onChange={this.setInput}
                            value={this.state.email}
                            maxLength="60"
                            readOnly={true}
                          />
                          {/* <InputGroupAddon addonType={"prepend"}>
                            <button
                              id="emailEdit"
                              onClick={this.updateEmail}
                              className="btn btn-info"
                            >
                              Edit
                            </button>
                          </InputGroupAddon> */}
                        </InputGroup>
                      </td>
                      <td>
                        <div
                          id="emailEdit"
                          style={{
                            marginTop: "auto",
                            cursor: "pointer",
                            marginLeft: "3px",
                          }}
                        >
                          <i
                            onClick={this.updateEmail}
                            class="fa fa-pencil-square-o fa-2x"
                            style={{ color: " #3b4369" }}
                          ></i>{" "}
                        </div>
                      </td>
                    </tr>
                    <tr style={{ height: "30px" }}>
                      <td>Mobile</td>
                      <td>:</td>
                      <td>
                        {" "}
                        <InputGroup>
                          <Input
                            id="mobile"
                            type="text"
                            name="mobile"
                            placeholder="Mobile No."
                            autoComplete="off"
                            onChange={this.setInput}
                            value={this.state.mobile}
                            maxLength="10"
                            readOnly={true}
                          />
                          {/* <InputGroupAddon addonType={"prepend"}>
                            <button
                              id="mobileEdit"
                              onClick={this.updateMobileNo}
                              className="btn btn-info"
                            >
                              Edit
                            </button>
                          </InputGroupAddon> */}
                        </InputGroup>
                      </td>
                      <td>
                        <div
                          id="mobileEdit"
                          style={{
                            marginTop: "auto",
                            cursor: "pointer",
                            marginLeft: "3px",
                          }}
                        >
                          <i
                            onClick={this.updateMobileNo}
                            class="fa fa-pencil-square-o fa-2x"
                            style={{ color: " #3b4369" }}
                          ></i>{" "}
                        </div>
                      </td>
                    </tr>
                    <tr
                      style={{ height: "30px", display: "none" }}
                      id="mobileOtpContainer"
                    >
                      <td>Mobile OTP</td>
                      <td>:</td>
                      <td>
                        {" "}
                        <Input
                          type="text"
                          name="mobileNumOtp"
                          placeholder="Enter OTP"
                          autoComplete="off"
                          onChange={this.setInput}
                          value={this.state.mobileNumOtp}
                          maxLength="6"
                          minLength="6"
                        />
                      </td>
                    </tr>
                    <tr
                      style={{ height: "30px", display: "none" }}
                      id="emailOtpContainer"
                    >
                      <td>Email OTP</td>
                      <td>:</td>
                      <td>
                        {" "}
                        <Input
                          type="text"
                          name="emailOtp"
                          placeholder="Enter OTP"
                          autoComplete="off"
                          onChange={this.setInput}
                          value={this.state.emailOtp}
                          maxLength="6"
                          minLength="6"
                        />
                      </td>
                    </tr>
                    <tr style={{ marginTop: "4px" }}>
                      <td>
                        {/* {" "}
                          <Button
                            color="primary"
                            className="px-4"
                            style={{ display: "none", margin: "0% 0% 0% 0%" }}
                            id="submitBtn"
                            onClick={this.changePassword}
                          >
                            Save Changes
                          </Button> */}
                      </td>
                      <td></td>

                      <td>
                        <span
                          id="timer"
                          style={{
                            verticalAlign: "-webkit-baseline-middle",
                            marginLeft: "2%",
                            display: "",
                            color: "#73818f",
                            fontSize: "0.875rem",
                          }}
                        ></span>{" "}
                        <Button
                          // color="primary"
                          // className="px-4"
                          color="link"
                          className="px-0"
                          style={{ display: "none", margin: "0% 0% 0% 2%" }}
                          id="resentOTPBtn"
                          onClick={this.userUpdateAPI}
                          // onClick={this.verify}
                        >
                          Resend OTP
                        </Button>{" "}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <div>
          <Button
            color="primary"
            className="px-2"
            style={{
              display: "none",
              // margin: "0% 0% 0% 0%",
              // marginInlineStart: "37%",
              float: "right",
              marginRight: "60%",
            }}
            id="submitBtn"
            onClick={this.userUpdateAPI}

            // onClick={this.profileEdit}
          >
            Save Changes &#8594;
          </Button>
          <Button
            color="primary"
            className="px-2"
            style={{
              display: "none",
              // margin: "0% 0% 0% 2%",
              // marginInlineStart: "47%",
              float: "right",
              marginRight: "60%",
            }}
            id="submitchangesBtn"
            onClick={this.profileEdit}
          >
            Submit Changes
          </Button>
          {/* <span
            id="timer"
            style={{
              verticalAlign: "-webkit-baseline-middle",
              marginLeft: "2%",
              display: "",
              color: "#73818f",
              fontSize: "0.875rem",
            }}
          ></span>{" "}
          <Button
            // color="primary"
            // className="px-4"
            color="link"
            className="px-0"
            style={{ display: "none", margin: "0% 0% 0% 2%" }}
            id="resentOTPBtn"
            onClick={this.userUpdateAPI}
            // onClick={this.verify}
          >
            Resend OTP
          </Button> */}
        </div>
      </div>
    );
  }
}
export default EditProfile;
