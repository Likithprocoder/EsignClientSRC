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
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-toastify/dist/ReactToastify.css";
import { Progress } from "reactstrap";
import "./wallet.css";
import HandSign from "../HandSign/HandSign";
//import Progressbar from './Component/Progress_bar';

var Loader = require("react-loader");

export default class AccountDetails extends React.Component {
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
      dimensionArray:[],
      storageDescrip:"Storage Details",
      isFreeStorage:""
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
    var body = {
      loginname: sessionStorage.getItem("username"),
      authToken: sessionStorage.getItem("authToken"),
    };
   
    this.subscribedPlanDetails();
    sessionStorage.setItem("ud", false);
    sessionStorage.removeItem("txnrefNo");
    sessionStorage.removeItem("signedStatus");
  }

  componentDidMount() {
    var body = {
      loginname: sessionStorage.getItem("username"),
      authToken: sessionStorage.getItem("authToken"),
    };
    // this.setState({ loaded: false })
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
          sessionStorage.setItem("verifyMobile", responseJson.verifyMobile);
          sessionStorage.setItem("consenteSign", responseJson.consenteSign);
          sessionStorage.setItem(
            "is_KYC_verified",
            responseJson.is_KYC_verified
          );
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
                  onClick: () => { },
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
    var body = {
      loginname: sessionStorage.getItem("username"),
      authToken: sessionStorage.getItem("authToken"),
      // "activeStatus":1,
    };
    fetch(URL.subscribedPlanDetails, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
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
       

        if (Array.isArray(responseJson.inactiveSubscriptionPlan)) {
            console.log("inactiveSubscriptionPlan is an array.");
            var dimensionArray=responseJson.inactiveSubscriptionPlan;
            this.setState({
                dimensionArray:dimensionArray
            })
          } else if (typeof responseJson.inactiveSubscriptionPlan === "object" && responseJson.inactiveSubscriptionPlan !== null) {
            document.getElementById("NoinQueuePlan").style.display = "none";
          } else {
            console.log("inactiveSubscriptionPlan is neither an array nor a JSON object.");
          }
    
          if(resp.isFreeStorage==1){
            this.setState({
                storageDescrip:"Free Storage Plan"})
          }
          //console.log("resp " + resp);
          this.setState({
            isFreeStorage:resp.isFreeStorage,
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
            document.getElementById("storagePlan").style.display = "none";
          } else {
            document.getElementById("storagePlan").style.display = "none";
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
        }
      })
      .catch((e) => {
        alert(e);
      });
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

    if(storageUsedPercentage==0){
    return "success";
    }else if (result <= 50) {
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
          <Col xs="12" sm="6" md="5" id="NoinQueuePlan">
            <Card>
              <CardHeader>
                <span>
                  <b> Dimension Details</b>
                  <br />
                </span>
              </CardHeader>
<CardBody>
  {this.state.dimensionArray.map((plan, index) => (
    <div
      key={index}
      style={{
        // marginTop: "0px",
        // marginBottom: "7px",
        marginTop: this.state.dimensionArray.length > 1 && index > 0 ? "10px" : "0px", // Add marginTop for all but the first item
        marginBottom: this.state.dimensionArray.length > 1 ? "7px" : "0px", // Add marginBottom if more than one dimension
        border: "1px solid #ccc", // Light border
        padding: "10px", // Padding inside the box
        borderRadius: "8px", // Rounded corners
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Subtle shadow for better visuals
      }}
    >
      <div>
        {/* Dimension Details as Title */}
        <h6 style={{ marginBottom: "2px" }}>
        {plan.dimensionDetails}
        </h6>

        {/* Signs Completed Widget */}
        {plan.noSigns && plan.signedcount !== undefined ? (
          <div>
            <span>
              Signs Completed&nbsp;:&nbsp;
              <b>{plan.signedcount}/{plan.noSigns}</b>
            </span>
            <Progress multi style={{ marginTop: "0px" }}>
              <Progress
                bar
                color={this.widgetStatusColor(plan.signedcount, plan.noSigns)}
                value={this.widgetvalue(plan.signedcount, plan.noSigns)}
              >
                {/* Display percentage inside the bar */}
              </Progress>
            </Progress>
          </div>
        ) : (
          <span></span> // Fallback text
        )}

        {/* Expiry Date */}
        {plan.expiryDate && (
          <div
            style={{
              fontSize: "0.7rem", // Slightly smaller font
              color: "#666", // Grey color for a subtle look
            }}
          >
            Expires On&nbsp;:&nbsp;
            <b>{plan.expiryDate}</b>
          </div>
        )}
      </div>
    </div>
  ))}
</CardBody>
            </Card>
          </Col>

          <Col xs="12" sm="6" md="5" id="storagePlan"
          >
            <Card>
              <CardHeader>
                <b>{this.state.storageDescrip}</b>
              </CardHeader>
              <CardBody >
              <div>
        {/* Dimension Details as Title */}
  
        <div >
                  <span >
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
                  <Progress multi style={{ marginTop: "0px" }}>
              <Progress
                bar
                color={this.widgetStatusColor(this.state.usedstoragelimit, this.state.storagelimit)}
                value={this.widgetvalue(this.state.usedstoragelimit, this.state.storagelimit)}
              >
                {/* Display percentage inside the bar */}
              </Progress>
            </Progress>
                </div>
    
        {/* Expiry Date */}
        {this.state.endDate && (
          <div
            style={{
              fontSize: "0.7rem", // Slightly smaller font
              color: "#666", // Grey color for a subtle look
            }}
          >
            Expires On&nbsp;:&nbsp;
            <b>{this.state.endDate}</b>
          </div>
        )}
      </div>
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" sm="6" md="3" id="noSubscribedplans" style={{display:"none"}} >
            <Card>
              <CardHeader>
                <b>Current Plan</b>
              </CardHeader>
              <CardBody>
                <p id="noActivePlans">No Active Plans</p>

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
      </div>
    );
  }
}
