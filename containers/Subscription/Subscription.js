import React, { Component } from "react";
import { Card, CardBody, Col, Row, CardHeader, Input, InputGroup, InputGroupAddon, InputGroupText, Button } from "reactstrap";
import { URL } from "../URLConstant";
import "./subscription.css";
import $ from "jquery";
import { confirmAlert } from "react-confirm-alert";
import PDF1 from "../Download/PDF1";
var Loader = require("react-loader");
class Subscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responsedata: [],
      inQueueplan: false,
      isConsentdisable: true,
      loadSubscriptionComponent: false,
      loaded: true,
      couponValue: "",
      // responsedata:[ {"descrip":"Weekly Limited","amount":"50","signs":"50","storage":"50 MB"},{"descrip":"Weekly Unlimited","amount":"150","signs":"75","storage":"500 MB"},{"descrip":"Monthly Limited","amount":"100","signs":"50","storage":"500 MB"},{"descrip":"Monthly Unlimited","amount":"300","signs":"150","storage":"1 GB"}]
    };
  }

  componentWillMount() {
if (sessionStorage.getItem("consenteSign") === "true") {
  if (sessionStorage.getItem("consentFlag") === "N") {
    // this.onOpenFirstModel();
  } else {
    this.setState({ loadSubscriptionComponent: true });
  }
} else {
  this.setState({ loadSubscriptionComponent: true });
}
  }
  
  componentDidMount() {
    if (this.state.loadSubscriptionComponent) {
      
    } else {
      if (this.state.isConsentdisable) {
   
        let element = document.getElementById("submitConsentbutton");
        element.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
        element.style.cursor = "no-drop";
      }
    }
   
    var body = {
      username: "",
    };
    // this.setState({ loaded: false });
    fetch(URL.getSubscriptionLists, {
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
          this.setState({ responsedata: responseJson.list });
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
  }

  custUnitstoQrCode = (e, i) => {
    const { name, value } = i.target;
    let responsedata = [...this.state.responsedata];
    if (name === "planID") {
      responsedata[i] = { ...responsedata[i], [name]: value };
      this.setState({ responsedata });
    }
    var planId = responsedata[e].planId;
    var amount = "";
    var planList = $(this)[0].state.responsedata;
    planList.forEach((element) => {
      if (element.planId == planId) {
        amount = element.amount;
      }
    });
    this.checkinQueuePlan(planId, amount);
  };

  setInput = (e) => {
    // let name = e.target.name;
    let value = e.target.value;

    let filteredValue = value.replace(/[^a-zA-Z0-9]/g, '');
    
    // if (/^\d{10}$/.test(filteredValue)) {
      this.setState({ couponValue: filteredValue });
    // }
  }

  checkinQueuePlan(planId, amount) {
    let body = {
      authToken: sessionStorage.getItem("authToken"),
      loginname: sessionStorage.getItem("username"),
    };
    this.setState({ loaded: false });
    fetch(URL.checkinQueuePlan, {
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
          let data = {
            paymentType: "SUBM",
            planID: planId,
            amount: amount,
            //ESM
          };
          this.setState({ loaded: true });
          this.props.history.push({
            pathname: "/qrcode",
            frompath: "/subscriptions",
            state: {
              details: data,
            },
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
      });
  }

  createUI() {
    return this.state.responsedata.map((el, i) => (
      <div className="align-items-center">
        <div key={i}>
          <Col xs="11" sm="4" md="3">
            <Card id="subscard">
              <CardHeader>
                <div id="discriptionspan">
                  <b>{el.descrip}</b>
                  <br />
                </div>
              </CardHeader>
              <CardBody>
                <p id="amountspan">
                  <b>₹ {el.amount}</b>
                </p>
                <p id="paratag">
                  {el.signs} Electronic Signs
                  <br />
                  &nbsp;{el.storage} Storage
                  <br />
                </p>
                <div className="purchaseBtn">
                <button
                  className="aggree-button"
                  value={el.planId || ""}
                  name="planID"
                  onClick={this.custUnitstoQrCode.bind(this, i)}
                  id="buyBtn"
                  // name={el.planId}
                >
                  <span>Subscribe </span>
                </button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </div>
      </div>
    ));
  }

  //checking whether consent signing checkboc is enabled or not
  onConsentChecked = () => {
    var checkedbox = document.getElementById("consentSigningCheckbox");
    let element1 = document.getElementById("submitConsentbutton");

    if (checkedbox.checked) {
      this.setState({ isConsentdisable: false });
      element1.style.backgroundColor = "#1DD1A1";
      element1.style.cursor = "pointer";
    } else {
      this.setState({ isConsentdisable: true });
      element1.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
      element1.style.cursor = "no-drop";
    }
  };

  consenteSign = () => {
    let response_data = {};
    var body = {
      loginname: sessionStorage.getItem("username"),
      authToken: sessionStorage.getItem("authToken"),
      userIP: sessionStorage.getItem("userIP"),
      consentTnC: "consentTnC",
      docCode: "DOEXCONSENT",
    };
    this.setState({ loaded: false });
    fetch(URL.consenteSign, {
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
        response_data = responseJson;
        if (responseJson.status === "SUCCESS") {
          this.setState({ loaded: true });
          sessionStorage.setItem(
            "download_data",
            JSON.stringify(response_data)
          );
          //for different signing mode different response component
          //1-Aadhaar eSign, 2-electronic
          // if (this.state.selectedMode === "1")
          // this.props.history.push({
          //   pathname: '/esign',
          //   frompath: '/preview',
          //   state: {
          //     data: response_data
          //   }
          // })
          // }
          //  if (this.state.selectedMode === "2") {
          let data = {
            mode: this.state.selectedMode,
            docId: responseJson.docid,
          };
          sessionStorage.setItem("consentFlag", "Y");
          this.props.history.push({
            pathname: "/download/tokenSignDownload",
            frompath: "/preview",
            state: {
              details: data,
            },
          });
          // }
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
          //alert(responseJson.statusDetails)
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
  };

  subscribeVoucher = () => {
  
    if (this.state.couponValue) {
    if (/^[a-zA-Z0-9]{10}$/.test(this.state.couponValue)) {
      console.log(this.state.couponValue);

    let data = {
      voucherCode: this.state.couponValue,
      authToken: sessionStorage.getItem("authToken"),
    }

    // this.setState({ loaded: false });
    fetch(URL.subscribeVoucher, {
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
        console.log(responseJson);
        if (responseJson.status == "SUCCESS") {
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
          this.setState({ couponValue: ""});
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
      });
    } else {
      confirmAlert({
        message: "Invalid voucher code",
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
      message: "Enter the voucher code to proceed",
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

  render() {
     if (this.state.loadSubscriptionComponent) {
    return (
      <div>
        <Row className="align-items-center">
        <div className="col-11 col-sm-4 col-md-3">
              {/* <Col xs="11" sm="4" md="4"> */}
                <Card style={{
                  height: "235px",
                  width: "250px",
                }}>
                  <CardHeader>
                    <div id="discriptionspan" style={{ color: "#c79807" }}>
                      <b>Redeem Voucher</b>
                      <br />
                    </div>
                  </CardHeader>
                  <CardBody style={{ margin: "5px"}}>

                  <Row id="redeemcodemodalrow">
                  <div style={{ marginLeft: "10px"}}>
                    Enter voucher code to redeem
                    <br/>
                    <span style={{ fontSize: "12px", color: "darkgrey" }}>Note: Voucher codes are case sensitive</span>
                  </div>
                    {/* <InputGroup className="mb-3"> */}
                    <InputGroupAddon addonType="prepend" style={{ margin: "10px 10px 12px 10px" }}>
                        <InputGroupText
                          style={{ backgroundColor: "#f0f3f5" }}
                        >
                          <i
                            className="fa fa-ticket"
                            aria-hidden="true"
                            style={{ fontSize: "large" }}
                          ></i>
                        </InputGroupText>
                      <Input
                        type="text"
                        id="redeemVoucherCode"
                        placeholder="Enter voucher code"
                        title="Enter voucher code"
                        name="redeemCodeVal"
                        onChange={this.setInput}
                        required={true}
                        maxLength="10"
                        value={this.state.couponValue}
                        autoComplete="off"
                      />
                      </InputGroupAddon>
                    {/* </InputGroup> */}
                    <div className="voucherBtn">
                      <button
                        className="aggree-button"
                        // value={el.planId || ""}
                        // name="planID"
                        onClick={this.subscribeVoucher}
                        id="redeemBtn"
                        // name={el.planId}
                      >
                        <span>Redeem</span>
                      </button>
                    </div>
                  </Row>
                  </CardBody>
                </Card>
              {/* </Col> */}
            </div>
          {/* <br></br> */}
          {/* <div className="align-items-center"> */}
            {this.createUI()}
          {/* </div> */}
        </Row>
      </div>
    );
     } else {
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
          {/* <div id="pdfContainerdiv" style={{ height: "60vh" }}> */}
          <div id="pdfContainerdiv" style={{ height: "80vh" }}>
            {/* <div
              className="embedtag-container"
              id="viewaftersigning"
              style={{ height: "100%" }}
            > */}
              {/* <embed
                title="PDF preview"
                type="application/pdf"
                src={
                  URL.viewConsentFile +
                  "?at=" +
                  btoa(sessionStorage.getItem("authToken"))
                }
                width="100%"
                height="100%"
              /> */}
              {/* <br id="1" />
              <br id="2" /> */}
              <PDF1
                /* title="PDF preview"
                ref="iframe"
                type="application/pdf" */
                url={
                  URL.viewConsentFile +
                  "?at=" +
                  btoa(sessionStorage.getItem("authToken"))
                }
                /* width="100%"
                height="100%"
                hidden */
              />
              <div style={{marginTop: "20px"}}>
            <input
              type="checkbox"
              name="acceptance"
              id="consentSigningCheckbox"
              onChange={this.onConsentChecked}
            ></input>
            <label id="consentSigningLable" style={{ fontSize: "16px" }}>
              &nbsp; I agree with all the terms and conditions of DocuExec
            </label>
          </div>
            </div>
          {/* </div> */}

            {/* <div
              className="embedtag-container"
              id="viewaftersigning"
              style={{ height: "100%" }}
            > */}
              {/* <embed
                title="PDF preview"
                type="application/pdf"
                src={
                  URL.viewConsentFile +
                  "?at=" +
                  btoa(sessionStorage.getItem("authToken"))
                }
                width="100%"
                height="100%"
              />
              <br id="1" />
              <br id="2" />
              <iframe
                title="PDF preview"
                ref="iframe"
                type="application/pdf"
                src={
                  URL.viewConsentFile +
                  "?at=" +
                  btoa(sessionStorage.getItem("authToken"))
                }
                width="100%"
                height="100%"
                hidden
              ></iframe> */}
            {/* </div> */}
          {/* </div> */}
          {/* <br></br> */}
          {/* <div>
            <input
              type="checkbox"
              name="acceptance"
              id="consentSigningCheckbox"
              onChange={this.onConsentChecked}
            ></input>
            <label id="consentSigningLable" style={{ fontSize: "16px" }}>
              &nbsp; I agree with all the terms and conditions of DocuExec
            </label>
          </div> */}

          <div className="next-nav">
            <button
              className="upload-button"
              id="submitConsentbutton"
              disabled={this.state.isConsentdisable}
              onClick={this.consenteSign.bind(this)}
              style={{ margin: "auto" }}
            >
              <span>Submit &#8594;</span>
            </button>
          </div>
        </div>
      );
              }
  }
}
export default Subscription;
