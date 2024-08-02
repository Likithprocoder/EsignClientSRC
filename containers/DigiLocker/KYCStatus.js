import React, { Component } from "react";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";

import "./DigiLocker.css";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  CardHeader,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import Notifications, { notify } from "react-notify-toast";

var Loader = require("react-loader");

class KYCStatus extends React.Component {
  constructor() {
    super();
    this.state = {
      isKYCVerified: 0,
      userId: "",
      loaded: true,
    };
  }

  // componentWillMount() {
  //   var body = {
  //     authToken: sessionStorage.getItem("authToken"),
  //   };
  // }
  componentDidMount() {
    // this.setState({ loaded: false });

    var body = {
      loginname: sessionStorage.getItem("username"),
      authToken: sessionStorage.getItem("authToken"),
    };
    this.setState({ loaded: false });
    fetch(URL.getFlags, {
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
            isKYCVerified: responseJson.is_KYC_verified,
            userId: responseJson.userId,
            loaded: true,
          });
          sessionStorage.setItem("KYCuserId", responseJson.userId);
          sessionStorage.setItem(
            "is_KYC_verified",
            responseJson.is_KYC_verified
          );
          if (responseJson.is_KYC_verified == 1) {
            this.setState({ loaded: true });
            this.getAdharDetails();
          } else {
            document.getElementById("KYCNotVerifiedTbl").style.display = "";
            document.getElementById("dlverifyBtn").style.display = "";
          }
          // this.setState({ loaded: true })
        } 
        else {
          if (responseJson.statusDetails === "Invalid Authentication key or key Expired!!") {
            sessionStorage.clear();
            // this.setState({ loaded: true })
            this.props.history.push("/login");
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
            // alert(responseJson.statusDetails)
            // this.setState({ loaded: true })
          }
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        //  alert(e);
        alert(e);
        this.props.history.push("/");
      });
  }

  // KYC Status check
  KYCStatus() {
    var status;
    if (this.state.isKYCVerified == 1) {
      status = "Verified";

      return (
        <React.Fragment>
          {status + " "}{" "}
          <i
            style={{ color: "green" }}
            id="dlCheckIcon"
            class="fa fa-check"
          ></i>{" "}
        </React.Fragment>
      );
    } else {
      status = "Not Verified";
      return (
        <React.Fragment>
          {status + "  "}
          <i
            style={{ color: "orange" }}
            className="fa fa-exclamation-triangle"
            id="warningIcon"
          ></i>{" "}
        </React.Fragment>
      );
    }
  }
  verifyKYCCall = () => {
    let windowFeatures = "popup";

    var user_id = sessionStorage.getItem("KYCuserId");
    var win = window.open(
      URL.digiLocker + "?user_id=" + user_id,
      "KYCStatus",
      windowFeatures
    );
  };
  getAdharDetails() {
    document.getElementById("UserDetail").style.display = "";
    var body = {
      authToken: sessionStorage.getItem("authToken"),
    };
    fetch(URL.KYCDetails, {
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
        if (responseJson.status == "SUCCESS") {
          this.setState({ loaded: true });

          document.getElementById("address").innerHTML =
            responseJson.Finaladdress;

          document.getElementById("name").innerHTML = responseJson.name;

          document.getElementById("verifiedOn").innerHTML =
            responseJson.VerifiedOn;
          this.setState({ loaded: true });
        } else if (responseJson.statusDetails === "Session Expired!!") {
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
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
  }
  render() {
    return (
      <div>
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
        <Row>
          <Col xs="12" sm="6" md="5">
            <Card>
              <CardHeader>
                <b>KYC STATUS Details</b>
              </CardHeader>
              <CardBody>
                <div>
                  <table id="KYCNotVerifiedTbl" style={{ display: "none" }}>
                    <tbody>
                      <tr style={{ height: "30px" }}>
                        <td style={{ width: "9%", height: "25px" }}>
                          KYC Status
                        </td>
                        <td style={{ width: "1%" }}>: </td>
                        <td style={{ width: "30%" }}>{this.KYCStatus()}</td>
                        <td style={{ width: "15%" }}>
                          {" "}
                          <Button
                            id="dlverifyBtn"
                            style={{ display: "none" }}
                            color="primary"
                            onClick={this.verifyKYCCall}
                          >
                            Verify KYC
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <table id="UserDetail" style={{ display: "none" }}>
                  <tbody>
                    <tr style={{ height: "30px" }}>
                      <td
                        style={{
                          width: "22%",
                          height: "25px",
                          verticalAlign: "text-top",
                        }}
                      >
                        KYC Status
                      </td>
                      <td style={{ width: "2%", verticalAlign: "text-top" }}>
                        :{" "}
                      </td>
                      <td style={{ width: "20%", verticalAlign: "text-top" }}>
                        {this.KYCStatus()}
                      </td>
                      {/* <td style={{ width: "20%", verticalAlign: "text-top" }}>
                        {" "}
                        <Button
                          id="dlverifyBtn"
                          style={{ display: "none" }}
                          color="primary"
                          onClick={this.verifyKYCCall}
                        >
                          Verify KYC
                        </Button>
                      </td> */}
                    </tr>
                    <tr style={{ height: "30px" }}>
                      <td
                        style={{
                          width: "22%",
                          height: "25px",
                          verticalAlign: "text-top",
                        }}
                        title="As per Aadhaar"
                      >
                        Full Name
                      </td>
                      <td style={{ width: "2%", verticalAlign: "text-top" }}>
                        :
                      </td>
                      <td
                        style={{ width: "60%", verticalAlign: "text-top" }}
                        id="name"
                      ></td>
                    </tr>
                    <tr style={{ height: "30px" }}>
                      <td style={{ width: "22%", verticalAlign: "text-top" }}>
                        Address
                      </td>
                      <td style={{ width: "2%", verticalAlign: "text-top" }}>
                        :
                      </td>
                      <td
                        style={{ width: "60%", verticalAlign: "text-top" }}
                        id="address"
                      >
                        {" "}
                      </td>
                    </tr>

                    <tr style={{ height: "30px" }}>
                      <td style={{ width: "22%", verticalAlign: "text-top" }}>
                        KYC Verified On
                      </td>
                      <td style={{ width: "2%", verticalAlign: "text-top" }}>
                        :
                      </td>
                      <td
                        style={{ width: "60%", verticalAlign: "text-top" }}
                        id="verifiedOn"
                      ></td>
                    </tr>
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <p>
          KYC Verification is required to carryout Aadhaar based signing. KYC
          verification connects with your Digilocker account to collect KYC
          details as per Aadhaar data. <br></br>
          This process does not collect any other details linked with your
          Digilocker account, and does not get or store your Aadhaar number. In
          case you have not signed up for Digilocker,{" "}
          <a title="DigiLocker" href="" onClick={this.verifyKYCCall}>
            Click here
          </a>{" "}
          to signup for a free national Digilocker account.
        </p>
      </div>
    );
  }
}

export default KYCStatus;
