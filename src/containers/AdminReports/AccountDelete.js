import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { URL } from "../URLConstant";
import "./BulkRegistration.css";
import $ from "jquery";

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
var Loader = require("react-loader");
var timerEvent = null;

export default class AccountDelete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      otp: "",
      mobNo: "",
      mobotpref: "",
      timeleft: 30,
      noOfDays: "",

      daysLeft: "",
      startDate: "",
      endDate: "",
      noSigns: "",
      signedcount: "",
      storagelimit: "",
      usedstoragelimit: "",
      noOfDaysLeft: "",
      consentData: ""
    };
  }

  componentDidMount() {
    // console.log(sessionStorage);

    this.setState({
      noOfDays: sessionStorage.getItem("noOfDays"),
      daysLeft: sessionStorage.getItem("daysleft"),
      startDate: sessionStorage.getItem("startDate"),
      endDate: sessionStorage.getItem("endDate"),
      noSigns: sessionStorage.getItem("noSigns"),
      signedcount: sessionStorage.getItem("signedcount"),
      storagelimit: sessionStorage.getItem("storagelimit"),
      usedstoragelimit: sessionStorage.getItem("usedstoragelimit"),
      noOfDaysLeft: sessionStorage.getItem("noOfDaysLeft"),
    });
    this.setState({

    });
  }
  setInput = (e) => {
    let regNum = new RegExp(/^[0-9]*$/);

    let value = e.target.value;
    let name = e.target.name;
    if (name === "otp") {
      if (regNum.test(e.target.value)) {
        this.setState({ otp: value });
      } else {
        return false;
      }
    }
  };
  getOtp = (event) => {

    if (!$("#agreed").not(':checked').length) {

      this.setState({ loaded: false });
      var body = {
        loginname: btoa(sessionStorage.getItem("username")),
        optnType: "UADEL",
      };
      let jsonWebToken = sessionStorage.getItem("jsonWebToken");
      fetch(URL.getOtp, {
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
          this.setState({ loaded: true });

          if (responseJson.status === "SUCCESS") {
            this.setState({
              loaded: true,
              mobotpref: responseJson.mobRefNo,
              mobNo: responseJson.mobileNum.replace(/\d(?=\d{4})/g, "*"),
            });
            confirmAlert({
              message: "OTP Sent to registered mobile number.",
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {
                    document.getElementById("deleteDiv").style.display = "none";
                    document.getElementById("getOTPForm").style.display = "";
                    this.startResendOtpTimer();
                    //this.otpModal();                },
                  }
                }
              ]
            });
          } else if (
            responseJson.status === "FAILURE" &&
            responseJson.statusDetails ===
            "Invalid Authentication key or key Expired!!"
          ) {
            confirmAlert({
              message: "Session Expired!!",
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {
                    localStorage.clear();
                    sessionStorage.clear();
                    this.props.history.push("/login");
                    window.location.reload(false);
                    window.location.reload(false);
                  },
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
                  onClick: () => { },
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
      confirmAlert({
        message: "Kindly confirm to delete your account.",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => { },
          },
        ],
      });
    }
  };
  validateOtp = () => {
    if (this.state.otp.length == 0 || this.state.otp.length != 6) {
      confirmAlert({
        message: "Enter 6 digit valid OTP",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => { },
          },
        ],
      });
    } else {
      this.deleteUser();
    }
  };
  deleteUser = () => {
    this.setState({ loaded: false });

    var body = {
      optnType: "UADEL",
      mobileNumOtp: btoa(this.state.otp),
      mobRefNo: btoa(this.state.mobotpref),
      loginname: sessionStorage.getItem("username"),
      userIP: sessionStorage.getItem("userIP"),
      consentType: "deleteAccount",
      consentData: this.state.consentData
    };
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    fetch(URL.DeleteUser, {
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
        this.setState({ loaded: true });
        if (responseJson.status === "SUCCESS") {
          confirmAlert({
            message: responseJson.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  localStorage.clear();
                  sessionStorage.clear();
                  clearInterval(timerEvent);
                  this.props.history.push("/login");
                  window.location.reload(false);
                  window.location.reload(false);
                },
              },
            ],
          });
        } else {
          if (responseJson.statusDetails === "Session Expired!!") {
            confirmAlert({
              message: responseJson.statusDetails,
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {
                    this.props.history.push("/login");
                  },
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
                  onClick: () => {
                    clearInterval(timerEvent);
                    document.getElementById("resendotpbtn").style.display = "";
                    document.getElementById("timer").style.display = "none";
                  },
                },
              ],
            });
          }
        }
      })
      .catch((e) => {
        sessionStorage.clear();
        localStorage.clear();
        this.props.history.push("/login");
        window.location.reload(false);
        window.location.reload(false);
      });
  };

  checkInnerText = () => {
    this.setState({ consentData: document.getElementById("accDleteInfo").innerText });
  }
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
  //   this.setState({ timeleft: 30 });
  //   document.getElementById("resendotpbtn").style.display = "none";

  //   document.getElementById("timer").style.display = "";

  //   var timeleft = this.state.timeleft;
  //   timerEvent = setInterval(function () {
  //     if (timeleft < 0) {
  //       clearInterval(timerEvent);
  //       document.getElementById("resendotpbtn").style.display = "";
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
        <div
          id="deleteDiv"
          style={{
            fontFamily: "Times New Roman",
            display: "",
            marginTop: "5%",
          }}
        >
          <table
            id="deleteTable"
            style={{
              fontSize: "16px",
              borderCollapse: "collapse",
              border: "5px solid grey",
              margin: "auto",
              backgroundColor: "#F5F5F5",
              fontFamily: "serif",
            }}
          >
            <tbody>
              <tr>
                <td style={{ textAlign: "center" }}>
                  <span
                    style={{
                      fontSize: "25px",
                      paddingTop: "10px",
                      color: "#f86c6b",
                    }}
                  >
                    &#9888; Delete My Account
                  </span>
                </td>
              </tr>

              <tr>
                <th style={{ textAlign: "center", fontSize: "18px" }}>
                  <span>
                    Do you really want to delete your account? This process
                    cannot be undone. Kindly verify and click on Proceed to
                    continue.
                    <br />
                  </span>
                </th>
              </tr>
              <tr hidden={(sessionStorage.getItem("units") === "0.00 units" && sessionStorage.getItem("planID") === "P000")}>
                &nbsp; Note
                <ul>
                  <li hidden={sessionStorage.getItem("units") === "0.00 units"}>
                    Aadhaar sign units : {sessionStorage.getItem("units")}
                  </li>
                  <li hidden={sessionStorage.getItem("planID") === "P000"}>
                    Subscription Details
                    <ul>
                      <li>Electronic sign validity : {this.state.endDate}</li>
                      {/* <li>
                        No.of signs available :{" "}
                        {this.state.noSigns - this.state.signedcount}
                      </li> */}
                    </ul>
                  </li>
                  {/* <li>
                    All the transaction history related to payment and signing
                    will be deleted.
                  </li> */}
                </ul>

              </tr>
              <div style={{ display: "flex" }}>
                <div>
                  <input
                    type="checkbox"
                    id="agreed"
                    name="agreed"
                    value="agreed"
                    onClick={this.checkInnerText}
                    style={{
                      marginLeft: "5px",
                      marginRight: "2px",
                      verticalAlign: "middle",
                    }}
                  />
                </div>
                <div style={{ paddingLeft: "4px", textAlign: "justify", paddingRight: "6px" }}>
                  <span id="accDleteInfo" style={{ textAlign: "center", fontSize: "18px" }}>
                    If any Aadhaar sign units and subscription package are available,
                    those associated resources will be deleted. All documents from the
                    DocuExec account will be permanently deleted. I have read and agree to
                    the permanent removal of my account.
                  </span>
                </div>
              </div>
              <tr>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <button
                    id="delBtn"
                    class="btn btn-primary btn-lg"
                    onClick={() => this.getOtp()}
                  >
                    Proceed
                  </button>
                </div>
                {/* <span >OTP will be sent to registered mobile number.</span> */}
              </tr>
            </tbody>
          </table>
        </div>
        <div
          id="getOTPForm"
          style={{
            fontFamily: "Times New Roman",
            display: "none",
            marginTop: "10%",
          }}
        >
          {" "}
          <table
            style={{
              fontSize: "16px",
              borderCollapse: "collapse",
              width: "50%",
              border: "5px solid grey",
              margin: "auto",
              backgroundColor: "#F5F5F5",
            }}
          >
            <tbody>
              <tr style={{ marginBottom: "40px" }}>
                <td style={{ textAlign: "center" }}>
                  <b
                    className="modal-head-1"
                    style={{ fontSize: "25px", paddingTop: "10px", color: "#c79807" }}
                  >
                    Delete Account Authentication{" "}
                  </b>
                </td>
              </tr>

              <tr
                style={{
                  textAlign: "left",
                  display: "flex",
                  marginTop: "30px",
                }}
              >
                <td style={{ width: "30%" }}>
                  {/* <InputGroup> */}
                  <label
                    id="fullname"

                    style={{
                      marginLeft: "70%",
                      width: "100%",
                    }}
                  >
                    Full Name
                  </label>
                </td>
                <td
                  style={{
                    width: "1%",
                    marginLeft: "50px",
                    marginRight: "30px",

                    verticalAlign: "sub",
                  }}
                >
                  :
                </td>
                <td style={{ width: "70%", marginRight: "20px" }}>
                  <input
                    style={{
                      width: "80%",
                      marginRight: "20px",
                      fontSize: "16px",
                      marginBottom: "5px",
                    }}
                    type="text"
                    name="fullname"
                    id="fullname"
                    required={true}
                    value={sessionStorage.getItem("firstName")}
                    readOnly={true}
                  />
                </td>
              </tr>
              <tr style={{ textAlign: "left", display: "flex" }}>
                <td style={{ width: "30%" }}>
                  {/* <InputGroup> */}
                  <label
                    id="otp"

                    style={{
                      marginLeft: "70%",
                      width: "100%",
                    }}
                  >
                    OTP
                  </label>
                </td>
                <td
                  style={{
                    width: "1%",
                    marginLeft: "50px",
                    marginRight: "30px",

                    verticalAlign: "sub",
                  }}
                >
                  :
                </td>
                <td style={{ width: "70%", marginRight: "20px" }}>
                  <input
                    style={{
                      width: "80%",
                      marginRight: "20px",
                      fontSize: "16px",
                      marginBottom: "5px",
                    }}
                    placeholder="Enter OTP"
                    type="text"
                    name="otp"
                    id="otp"
                    maxLength={6}
                    onChange={this.setInput}
                    autoComplete="off"
                    value={this.state.otp}
                  />
                </td>
              </tr>
              <tr>
                <span id="mobilemsg" style={{ marginLeft: "17%" }}>
                  OTP Sent to Mobile No. {this.state.mobNo}.
                </span>
              </tr>
              <tr>
                <span
                  id="timer"
                  style={{
                    verticalAlign: "-webkit-baseline-middle",

                    marginLeft: "17%",
                    marginTop: "3%",
                    display: "",
                    color: "#73818f",
                    fontSize: "0.875rem",
                  }}
                ></span>{" "}
                <Button
                  color="link"
                  id="resendotpbtn"
                  style={{
                    display: "none",
                    marginTop: "5px",
                    marginLeft: "45%",
                  }}
                  title="OTP based Resend OTP"
                  onClick={this.getOtp}
                >
                  {" "}
                  Resend OTP
                </Button>
              </tr>
              <tr>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <button
                    id="delBtn"
                    style={{
                      backgroundColor: " #04AA6D",
                      color: " white",
                      fontFamily: "Source Sans Pro",
                      fontSize: "18px",
                      padding: "6px 25px",
                      marginTop: "4px",
                      borderRadius: "5px",
                      wordSpacing: "10px",
                    }}
                    onClick={() => this.validateOtp()}
                  >
                    Submit
                  </button>
                </div>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
