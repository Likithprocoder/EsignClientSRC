import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Input,
  Collapse,
  Tooltip
} from "reactstrap";
import { URL } from "../URLConstant";
import { Modal } from 'antd';
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import { NotificationOutlined } from '@ant-design/icons';
import Notifications from "@material-ui/icons/Notifications";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-toastify/dist/ReactToastify.css";
import { Progress } from "reactstrap";
import "./wallet.css";
import HandSign from "../HandSign/HandSign";
//import Progressbar from './Component/Progress_bar';

var Loader = require("react-loader");

export default class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      loaded: true.valueOf,
      endDate: "",
      noSigns: "",
      signedcount: "",
      storagelimit: "",
      usedstoragelimit: "",
      noOfDays: "",
      startDate: "",
      daysLeft: "",
      noOfDaysLeft: "",
      inQueuenoSigns: "",
      inQueuestoragelimit: "",
      inQueuenoOfDays: "",
      inQueuePlanID: "",
      storageExceededMsg: " ",
      isOpen: false,
      tooltipOpen: false,
      isHovered: false,
      planDescrip:"Current Plan",
       isModalVisible: false, // State to control modal visibility
    };
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

  componentWillMount() {
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    var body = {
      loginname: sessionStorage.getItem("username"),
      userIP: sessionStorage.getItem("userIP")
    };
    this.setState({ loaded: false });
    fetch(URL.getWalletInfo, {
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
        if (responseJson.status === "SUCCESS") {
          document.getElementById("name").innerHTML =
            sessionStorage.getItem("firstName");
          document.getElementById("units").innerHTML = responseJson.units;
          document.getElementById("email").innerHTML = responseJson.email;
          document.getElementById("mobile").innerHTML = responseJson.mobile;
          sessionStorage.setItem("units", responseJson.units);
          this.setState({ loaded: true });
        } else {
          if (responseJson.statusDetails === "Session Expired!!") {
            sessionStorage.clear();
            this.setState({ loaded: true });
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
            this.setState({ loaded: true });
          }
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
    this.subscribedPlanDetails();
    sessionStorage.setItem("ud", false);
    sessionStorage.removeItem("txnrefNo");
    sessionStorage.removeItem("signedStatus");
  }

  componentDidMount() {
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    var body = {
      loginname: sessionStorage.getItem("username"),
    };
    fetch(URL.getFlags, {
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
        if (responseJson.status === "SUCCESS") {
          sessionStorage.setItem("verifyMobile", responseJson.verifyMobile);
          sessionStorage.setItem("consenteSign", responseJson.consenteSign);
          sessionStorage.setItem(
            "is_KYC_verified",
            responseJson.is_KYC_verified
          );
          // responseJson.pendingDocs = 1;//For testing purpose
          if (responseJson.pendingDocs !== 0 &&  sessionStorage.getItem("actionExists") === "true") {
            this.setState({ isModalVisible: true });
          } else {
            sessionStorage.setItem("actionExists", false); 
          }
          sessionStorage.setItem("maxFilesize", responseJson.maxFilesize);
          //to check the role of the user to make the template groups visible(if corp admin) for voucher purchase
          sessionStorage.setItem("roleId", responseJson.roleId);
          if (responseJson.verifyMobile === "N") {
            document.getElementById("verifyBtnContainer").style.display = "";
          }
          if (responseJson.consenteSign === "true") {
            sessionStorage.setItem("consentFlag", responseJson.consentFlag);
            if (responseJson.consentFlag === "N") {
              document.getElementById("consenteSignLink").style.display = "";
            }
          }
          // this.setState({ loaded: true })
        } else {
          if (responseJson.statusDetails === "Session Expired!!") {
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
        alert(e);
      });
  }

  subscribedPlanDetails = () => {
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    var body = {
      loginname: sessionStorage.getItem("username"),
    };
    fetch(URL.subscribedPlanDetailsV2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        'Authorization': `Bearer ${jsonWebToken}`
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        let uatsetupenabled = responseJson.uatsetupenabled;
        sessionStorage.setItem("uatsetupenabled", uatsetupenabled);
        if (responseJson.status === "SUCCESS") {
          sessionStorage.setItem("planActive", true);

          var resp = responseJson.activeSubscriptionPlan;
          var inQueue = responseJson.inactiveSubscriptionPlan;
          if (inQueue.status === "SUCCESS") {
            document.getElementById("NoinQueuePlan").style.display = "";
            document.getElementById("noSubscribedplans").style.display = "none";
            this.setState({
              inQueuenoSigns: inQueue.noSigns,
              inQueuestoragelimit: inQueue.storagelimit,
              inQueuenoOfDays: inQueue.noOfDays,
              inQueuePlanID: inQueue.planDesc,
            });
          } else {
            // Not subscribed with any plan
            document.getElementById("NoinQueuePlan").style.display = "none";
            document.getElementById("noSubscribedplans").style.display = "none";
          }
          if(resp.planType==0){
            this.setState({
              planDescrip:"Free Storage Plan",})
          }
          //console.log("resp " + resp);
          this.setState({
            noOfDays: resp.noOfDays,
            daysLeft: resp.daysleft,
            startDate: resp.startDate,
            endDate: resp.endDate,
            noSigns: resp.noSigns,
            signedcount: resp.signedcount,
            storagelimit: resp.storagelimit,
            usedstoragelimit: resp.usedstoragelimit,
            noOfDaysLeft: resp.noOfDaysLeft,
          });
          sessionStorage.setItem("noOfDays", resp.noOfDays);
          sessionStorage.setItem("daysLeft", resp.daysleft);

          sessionStorage.setItem("startDate", resp.startDate);

          sessionStorage.setItem("endDate", resp.endDate);

          sessionStorage.setItem("noSigns", resp.noSigns);

          sessionStorage.setItem("signedcount", resp.signedcount);

          sessionStorage.setItem("storagelimit", resp.storagelimit);

          sessionStorage.setItem("usedstoragelimit", resp.usedstoragelimit);
          sessionStorage.setItem("noOfDaysLeft", resp.noOfDaysLeft);

      

          let defaultlimit = resp.storagelimit.split(" ")[0];
          let usedlimt = resp.usedstoragelimit.split(" ")[0];
          let availableStorage = (defaultlimit - usedlimt) * 1024;

          sessionStorage.setItem("availableStorage", availableStorage);
        } else {
          sessionStorage.setItem("planActive", false);
          sessionStorage.setItem(
            "planActiveDetails",
            responseJson.statusDetails
          );
          if (responseJson.statusDetails == "Not subscribed with any plan") {
            document.getElementById("noSubscribedplans").style.display = "";
            document.getElementById("NoinQueuePlan").style.display = "none";
            document.getElementById("subscribedplans").style.display = "none";
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
        alert(e);
      });
  };
  submitOtp = () => {
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    var body = {
      loginname: btoa(sessionStorage.getItem("username")),
      otp: btoa(this.state.otp),
    };
    fetch(URL.validateOtp, {
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
        if (responseJson.status === "SUCCESS") {
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

          sessionStorage.setItem("verifyMobile", responseJson.varifyMobile);
          document.getElementById("verifyBtnContainer").style.display = "none";
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
        }
      })
      .catch((e) => {
        confirmAlert({
          message: e,
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
              onClick: () => {},
            },
          ],
        });
        //alert(e)
      });
  };

  verifyMobile = () => {
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    var body = {
      loginname: btoa(sessionStorage.getItem("username")),
    };
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
        if (responseJson.smsStatus === "SUCCESS") {
          document.getElementById("verifyBtn").style.display = "none";
          document.getElementById("otpRespContainer").style.display = "";
        } else {
          confirmAlert({
            message: responseJson.otpStatusDescription,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {},
              },
            ],
          });
          // alert(responseJson.otpStatusDescription)
        }
      })
      .catch((e) => {
        confirmAlert({
          message: "Please Sign or upload signature",
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
              onClick: () => {},
            },
          ],
        });
        //alert(e)
      });
  };

  consenteSignLink = () => {
    this.props.history.push("/docUpload");
  };

  widgetvalue = (usedlimt, defaultlimit) => {
    var result = (usedlimt / defaultlimit) * 100;
    return result.toFixed(2);
  };

  widgetvalueforStorage = (usedlimt, defaultlimit) => {
    // console.log(usedlimt, defaultlimit);
    var storageUsedPercentage;
    // GB package calculation
    if (defaultlimit.includes("GB") && usedlimt.includes("GB")) {
      storageUsedPercentage =
        usedlimt.split(" ")[0] / 1024 / defaultlimit.split(" ")[0];
      // console.log(storageUsedPercentage.toFixed(2));
    } else if (defaultlimit.includes("GB") && usedlimt.includes("MB")) {
      storageUsedPercentage =
        usedlimt.split(" ")[0] / 1024 / defaultlimit.split(" ")[0];
      // console.log(storageUsedPercentage.toFixed(2));
    }
    // MB package calculation
    if (defaultlimit.includes("MB") && usedlimt.includes("MB")) {
      storageUsedPercentage =
        usedlimt.split(" ")[0] / defaultlimit.split(" ")[0];
      // console.log(storageUsedPercentage.toFixed(2));
    } else if (defaultlimit.includes("MB") && usedlimt.includes("KB")) {
      storageUsedPercentage =
        usedlimt.split(" ")[0] / 1024 / defaultlimit.split(" ")[0];
      // console.log(storageUsedPercentage.toFixed(2));
    }
    var data = storageUsedPercentage * 100;
    // console.log(data.toFixed(2));

    return (storageUsedPercentage * 100).toFixed(2);
  };

  widgetStatusValuefroStorage = (usedlimt, defaultlimit) => {
    var storageUsedPercentage;
    // GB package calculation
    if (defaultlimit.includes("GB") && usedlimt.includes("GB")) {
      storageUsedPercentage =
        (usedlimt.split(" ")[0] / 1024).toFixed(2) + " GB";
    } else if (defaultlimit.includes("GB") && usedlimt.includes("MB")) {
      storageUsedPercentage = (usedlimt.split(" ")[0] / 1).toFixed(2) + " MB";
    }

    if (defaultlimit.includes("MB") && usedlimt.includes("MB")) {
      storageUsedPercentage = usedlimt.split(" ")[0] + " MB";
    } else if (defaultlimit.includes("MB") && usedlimt.includes("KB")) {
      storageUsedPercentage =
        (usedlimt.split(" ")[0] / 1024).toFixed(2) + " MB";
    }

    return storageUsedPercentage;
  };
  widgetStatusColorfroStorage = (usedlimt, defaultlimit) => {
    // var defaultlimit;
    // var usedlimt = usedlimt.split(" ")[0];
    // if (defaultlimit.includes("GB")) {
    //   defaultlimit = "1024";
    // } else {
    //   defaultlimit = defaultlimit.split(" ")[0];
    // }
    // var result = usedlimt / defaultlimit;
    var storageUsedPercentage;
    // GB package calculation
    if (defaultlimit.includes("GB") && usedlimt.includes("GB")) {
      storageUsedPercentage =
        usedlimt.split(" ")[0] / 1024 / defaultlimit.split(" ")[0];
      // console.log(storageUsedPercentage.toFixed(2));
    } else if (defaultlimit.includes("GB") && usedlimt.includes("MB")) {
      storageUsedPercentage =
        usedlimt.split(" ")[0] / 1024 / defaultlimit.split(" ")[0];
      // console.log(storageUsedPercentage.toFixed(2));
    }
    // MB package calculation
    if (defaultlimit.includes("MB") && usedlimt.includes("MB")) {
      storageUsedPercentage =
        usedlimt.split(" ")[0] / defaultlimit.split(" ")[0];
      // console.log(storageUsedPercentage.toFixed(2));
    } else if (defaultlimit.includes("MB") && usedlimt.includes("KB")) {
      storageUsedPercentage =
        usedlimt.split(" ")[0] / 1024 / defaultlimit.split(" ")[0];
      // console.log(storageUsedPercentage.toFixed(2));
    }

    var result = (storageUsedPercentage * 100).toFixed(2);

    if (result <= 50) {
      return "success";
    } else if (result >= 50 && result <= 80) {
      return "warning";
    } else {
      return "danger";
    }
  };

  widgetStatusColor = (usedlimt, defaultlimit) => {
    var result = (usedlimt / defaultlimit) * 100;
    if (result <= 50) {
      return "success";
    } else if (result >= 50 && result <= 80) {
      return "warning";
    } else {
      return "danger";
    }
  };

  custUnitstoQrCode = () => {
    this.props.history.push("/payments/subscriptions");
  };

  toggleCollapse = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  }

  handleMouseEnter = (event) => {
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // console.log(event);
      if (event.target.id === "collapseCard") {
        this.setState({ tooltipOpen: true });
        this.setState({ isHovered: true });
      }
    }
  };

  handleMouseLeave = (event) => {
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // console.log(event);
      if (event.target.id === "collapseCard") {
        this.setState({ tooltipOpen: false });
        this.setState({ isHovered: false });
      }
    }
  };
  
  // Function to handle button click
  handleButtonClick = () => {
    sessionStorage.setItem("actionExists", false);
    this.setState({ isModalVisible: false });
  };

  handleButtonClick1 = () => {
    sessionStorage.setItem("actionExists", false);
    confirmAlert({
      // message: "Sign pending document will be available in pending actions inbox.",
      message: "You can complete the signing later from the 'Pending Signatures' menu.",
      buttons: [
        {
          label: "OK",
          className: "confirmBtn",
          onClick: () => {},
        },
      ],
    });
    this.setState({ isModalVisible: false });
  }

  handleActionClick = () => {
    sessionStorage.setItem("actionExists", false);
    this.setState({ isModalVisible: false });
    this.props.history.push("/pendingSignsInbox");
  };

  render() {
    const { openFirstModal } = this.state;
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
        <div style={{ display: "none" }}>
          <canvas className="xx" id="textCanvas" height="60"></canvas>
          <img id="image" hidden={true} />
        </div>
        <div id="handSignContainer" style={{ display: "none" }}>
          <HandSign frompath="accountInfo" data={"dxgfx"} />
        </div>
        <Row>
          <Col xs="12" sm="6" md="5">
            <Card>
              <CardHeader>
                <b>Account Details</b>
              </CardHeader>
              <CardBody>
                <table>
                  <tbody>
                    <tr style={{ height: "30px" }}>
                      <td style={{ width: "50%", height: "25px" }}>
                        Full Name
                      </td>
                      <td style={{ width: "5%" }}>:</td>
                      <td style={{ width: "45%" }} id="name"></td>
                    </tr>
                    <tr style={{ height: "30px" }}>
                      <td>Aadhaar sign units</td>
                      <td>:</td>
                      <td id="units"></td>
                    </tr>
                    <tr style={{ height: "30px" }}>
                      <td>Email-ID</td>
                      <td>:</td>
                      <td id="email"></td>
                    </tr>
                    <tr style={{ height: "30px" }}>
                      <td>Mobile</td>
                      <td>:</td>
                      <td id="mobile"></td>
                    </tr>
                  </tbody>
                </table>
              </CardBody>
            </Card>
            <div id="verifyBtnContainer" style={{ display: "none" }}>
              <Button
                id="verifyBtn"
                color="primary"
                className="px-4"
                onClick={this.verifyMobile}
              >
                Verify Mobile
              </Button>
              <br></br>
              <br></br>
              <div id="otpRespContainer" style={{ display: "none" }}>
                <Input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  autoComplete="off"
                  onChange={this.setInput}
                  value={this.state.otp}
                  maxLength="6"
                />
                <br></br>
                <Button
                  color="primary"
                  className="px-4"
                  onClick={this.submitOtp}
                >
                  Submit OTP
                </Button>
              </div>
            </div>
          </Col>

          <Col xs="12" sm="6" md="5" id="subscribedplans">
            <Card>
              <CardHeader>
                <span>
                  <b>{this.state.planDescrip}</b>
                  <br />
                </span>
              </CardHeader>
              <CardBody>
                {/* <Row > */}
                {this.state.noSigns !== 0 &&(
                <div>
                  <span style={{ marginBottom: "0px" }}>
                    Signs Completed &nbsp;:&nbsp;
                    <b>{this.state.signedcount + "/" + this.state.noSigns}</b>
                  </span>
                  <Progress multi>
                    <Progress
                      bar
                      style={{ color: "black" }}
                      color={this.widgetStatusColor(
                        this.state.signedcount,
                        this.state.noSigns
                      )}
                      progress={this.widgetvalue(
                        this.state.signedcount,
                        this.state.noSigns
                      )}
                      value={this.widgetvalue(
                        this.state.signedcount,
                        this.state.noSigns
                      )}
                    >
                      {/* {this.widgetvalue(
                        this.state.signedcount,
                        this.state.noSigns
                      )}{" "} */}
                    </Progress>
                  </Progress>
                </div>
                 )}
                <div style={{ marginTop: "13px" }}>
                  <span style={{ marginBottom: "0px" }}>
                    Storage Used &nbsp;:&nbsp;
                    <b>
                      {this.widgetStatusValuefroStorage(
                        this.state.usedstoragelimit,
                        this.state.storagelimit
                      ) +
                        "/" +
                        this.state.storagelimit}
                    </b>
                  </span>
                  <Progress multi>
                    <Progress
                      bar
                      color={this.widgetStatusColorfroStorage(
                        this.state.usedstoragelimit,
                        this.state.storagelimit
                      )}
                      value={this.widgetvalueforStorage(
                        this.state.usedstoragelimit,
                        this.state.storagelimit
                      )}
                    >
                    </Progress>
                  </Progress>
                </div>
                {this.state.endDate && (
                <div style={{ marginTop: "13px" }}>
                  <span>
                    Subscription Expires On&nbsp;:&nbsp;
                    <b>{this.state.endDate}</b>
                  </span>
                </div>
                )}
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" sm="6" md="5" id="NoinQueuePlan">
            <Card>
              <CardHeader style={!this.state.isOpen ? { background: "center" } : {}}>
                <b>Upcoming Plan</b>{!this.state.isOpen && ` - ${this.state.inQueuePlanID}`}
                <Button onClick={this.toggleCollapse} style={{ fontSize:"6px", float: "right" }} id="collapseCard" onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
                  {this.state.isOpen ? <i class="fa fa-chevron-up" aria-hidden="true" style={{ fontSize: "10px"}}></i> : <i class="fa fa-chevron-down" aria-hidden="true" style={{ fontSize: "10px"}}></i>}
                </Button>
                {this.state.isHovered ? (<Tooltip
                    isOpen={this.state.tooltipOpen}
                    target="collapseCard"
                    placement="bottom"
                    id="tooltip"
                    hideArrow
                  >
                    {!this.state.isOpen ? "More info" : "Show less"}
                </Tooltip>
                ) : null}
              </CardHeader>
              <Collapse
                isOpen={this.state.isOpen}
              >
                <CardBody>
                  <table>
                    <tbody>
                      <tr style={{ height: "30px" }}>
                        <td style={{ width: "30%", height: "25px" }}>
                          Plan Description
                        </td>
                        <td style={{ width: "5%" }}>:</td>
                        <td style={{ width: "65%" }}>
                          {this.state.inQueuePlanID}
                        </td>
                      </tr>
                      <tr style={{ height: "30px" }}>
                        <td>No. of signs</td>
                        <td>:</td>
                        <td>{this.state.inQueuenoSigns}</td>
                      </tr>
                      <tr style={{ height: "30px" }}>
                        <td>Storage Limit</td>
                        <td>:</td>
                        <td>{this.state.inQueuestoragelimit}</td>
                      </tr>
                      <tr style={{ height: "30px" }}>
                        <td>No. of Days</td>
                        <td>:</td>
                        <td>{this.state.inQueuenoOfDays}</td>
                      </tr>
                    </tbody>
                  </table>
                </CardBody>
              </Collapse>
            </Card>
          </Col>

          <Col xs="12" sm="6" md="3" id="noSubscribedplans">
            <Card>
              <CardHeader>
                <b>Current Plan</b>
              </CardHeader>
              <CardBody>
                <p id="noActivePlans">No Active Plans</p>
                <button
                  // id="subscribeDiv"
                  className="aggree-button"
                  onClick={this.custUnitstoQrCode.bind()}
                  id="subsbtn"
                >
                  <div>Subscribe</div>
                </button>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div id="displaytextMsg">
          <p>
            {URL.appName} supports digital signing of documents with Aadhaar
            eSign, Electronic Sign, DSC Token and OTP Based Sign. Use the menu
            to top up the account and continue signing. {URL.appName} also
            supports uploading document for third party signing.
          </p>
          <p>
            Please verify that your name is registered as per Aadhaar before
            signing the document with Aadhaar eSign.
          </p>
        </div>
        <h5
          className="consenteSignLink"
          id="consenteSignLink"
          style={{ display: "none" }}
          onClick={this.consenteSignLink}
        >
          <i>
            Click here to read and accept the Terms & Conditions on using
            DocuExec
          </i>
        </h5>
        <Modal
          open={this.state.isModalVisible}
          onCancel={this.handleButtonClick}
          maskClosable={false}
          footer={[
            <Button key="cancel" type="link" color="primary" onClick={this.handleButtonClick1} style={{ marginRight: "10px"}} outline>
              I'll do it later
            </Button>,
            <Button key="submit" type="primary" color="primary" onClick={this.handleActionClick}>
              Review and Sign
            </Button>,
          ]}
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {/* <ExclamationCircleOutlined style={{ color: '#faad14', marginRight: '10px' }} /> */}
            <Notifications style={{ color: '#faad14', marginRight: '10px', fontSize: '65px', border: '1px solid rgb(255, 220, 150)' }} />
            {/* You have sign pending action from your previous session(s). Please review and complete. */}
            It looks like you haven't completed the signing process from your previous session(s). Please review and complete.
          </span>
        </Modal>
      </div>
    );
  }
}
