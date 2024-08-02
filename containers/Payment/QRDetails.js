import React, { Component } from "react";
import { Alert, Button, Input } from "reactstrap";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../Subscription/subscription.css";

var Loader = require("react-loader");

class QRDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      qrImg: "",
      addCharge: "",
      totalAmount: "",
      upiId: "",
      txnId: "",
      statusMs: "",
      uuid: "",
      upiName: "",
      amount: "",
      netAmount: "",
      gstAmount: "",
      statusCheckCount: 1,
      bankTxnId: "",
      respAmount: "",
      paymentType: "",
      planID: "",
      amount: "",
      qrUrl: "",
      isMobileDevice: "none",
    };
  }

  componentDidMount() {
    // pay using UPI app button should be visible to only mobile apps
    var isMobile = this.detectMob();
    if (isMobile) {
      this.setState({ isMobileDevice: "" });
    }
    // console.log(sessionStorage);
    var paymentType = "";
    if (sessionStorage.hasOwnProperty("paymentType")) {
      paymentType = sessionStorage.getItem("paymentType");
    }

    let additional_data = sessionStorage.getItem("additional_data");

    let jsonObject = {};
    if (additional_data) {
      console.log('Content of additional_data:', additional_data);

      try {
        jsonObject = JSON.parse(additional_data);
        console.log('Parsed JSON object:', jsonObject);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    } else {
      console.error('additional_data is null or undefined');
    }

    // console.log('additional_data:', typeof additional_data);
    let add_data = jsonObject;

    let body = {};
    if (sessionStorage.getItem("paymentType") === "VOUC") {
      body = {
        authToken: sessionStorage.getItem("authToken"),
        loginname: sessionStorage.getItem("username"),
        amount: sessionStorage.getItem("amount"),
        paymentType: paymentType,
        additional_data: add_data,//
      };
    } else {
      body = {
        authToken: sessionStorage.getItem("authToken"),
        loginname: sessionStorage.getItem("username"),
        amount: sessionStorage.getItem("amount"),
        paymentType: paymentType,
      };
    }

    console.log(body);
    this.setState({ loaded: false });
    fetch(URL.getQR, {
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
          sessionStorage.removeItem("paymentType");

          if (sessionStorage.hasOwnProperty("additional_data")) {
            sessionStorage.removeItem("additional_data");
          }

          this.setState({
            loaded: true,
            qrImg: "data:image/png;base64," + responseJson.qrImg,
            upiId: responseJson.upiId,
            totalAmount: responseJson.totalAmount,
            addCharge: responseJson.addCharge,
            uuid: responseJson.uuid,
            upiName: responseJson.upiName,
            gstAmount: responseJson.gstAmount,
            netAmount: responseJson.netAmount,
            amount: responseJson.amount,
            statusCheckLoop: true,
            qrUrl: responseJson.qrUrl,
          });
          sessionStorage.setItem("mysignTxnId", this.state.uuid);
          //after 20 sec autoPaymentCheck call will start
          setTimeout(() => {
            this.autoPaymentCheck();
          }, 20000);
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
                  onClick: () => { },
                },
              ],
            });
            //alert(responseJson.statusDetails)
            this.setState({ loaded: true });
          }
        }
      });
  }

  //fro auto payment check
  autoPaymentCheck = () => {
    const body = {
      authToken: sessionStorage.getItem("authToken"),
      loginname: sessionStorage.getItem("username"),
      mysignTxnId: this.state.uuid,
      bankTxnId: this.state.txnId,
    };
    if (this.state.statusCheckCount <= 30) {
      fetch(URL.getPaymentStatus, {
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
              loaded: true,
            });
            if (responseJson.statusDetails.includes("No")) {
              setTimeout(() => {
                this.autoPaymentCheck();
              }, 10000);
              this.setState({
                statusCheckCount: this.state.statusCheckCount + 1,
              });
            } else {
              const successMsg = document.getElementById("successMsg");
              const failureMsg = document.getElementById("failureMsg");
              const googleVoiceBtn = document.getElementById("googleVoiceBtn");

              if (successMsg || failureMsg) {
                document.getElementById("successMsg").style.display = "";
                document.getElementById("failureMsg").style.display = "none";
              }
              this.setState({
                statusCheckCount: 31,
                bankTxnId: responseJson.bankTxnID,
                respAmount: responseJson.amount + " Rupees",
                txnId: responseJson.bankTxnID,
                statusMs:
                  responseJson.statusDetails +
                  `. Received payment of ${URL.rupeeSymbol} ` +
                  responseJson.amount +
                  "</br>From: " +
                  responseJson.PayerVirAddr +
                  "</br>To: " +
                  responseJson.PayeeVirAddr,
              });
              //click for google voice
              // document.getElementById("checkStatusInp").value = responseJson.bankTxnID
              if (googleVoiceBtn) {
                document.getElementById("googleVoiceBtn").click(); //
              }
              // this.tts_voice(this.state.totalAmount, responseJson.bankTxnID)
            }
          }
        });
    }
  };

  tts_voice = (amount, txnID) => {
    //amount = '5'
    var amount = amount;
    //t_id = '1230456078'
    var t_id = txnID;
    var text1 = "Received payment of ";
    // var text2 = " with transaction ID "

    var msg1 = new SpeechSynthesisUtterance(text1 + amount);
    var new_t_id = t_id.toString().split("").join(" ");
    // var msg2 = new SpeechSynthesisUtterance(text2 + new_t_id.toString());
    window.speechSynthesis.speak(msg1);
    // window.speechSynthesis.speak(msg2);
  };

  setInput = (e) => {
    let regExp1 = new RegExp(/^[ A-Za-z0-9!@#\$%\^& ]*$/);
    let value = e.target.value;
    let name = e.target.name;
    if (name === "txnId") {
      if (regExp1.test(e.target.value)) {
        this.setState({ txnId: value });
      } else {
        return false;
      }
    }
  };

  checkPaymentStatus = () => {
    if (this.state.txnId.length !== 0 && this.state.txnId.trim() !== "") {
      let body = {
        authToken: sessionStorage.getItem("authToken"),
        loginname: sessionStorage.getItem("username"),
        mysignTxnId: "",
        bankTxnId: this.state.txnId,
      };
      this.setState({ loaded: false });
      fetch(URL.getPaymentStatus, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(body),
      })
        .then((response) => {
          return response.json();
        })
        .then((responseJson) => {
          if (responseJson.status == "SUCCESS") {
            if (responseJson.statusDetails.includes("No")) {
              document.getElementById("failureMsg").style.display = "";
              document.getElementById("successMsg").style.display = "none";
              this.setState({
                loaded: true,
                statusMs: responseJson.statusDetails,
              });
            } else {
              document.getElementById("successMsg").style.display = "";
              document.getElementById("failureMsg").style.display = "none";
              this.setState({
                bankTxnId: responseJson.bankTxnID,
                respAmount: responseJson.amount + " Rupees",
                loaded: true,
                statusMs:
                  responseJson.statusDetails +
                  `. Received payment of ${URL.rupeeSymbol}. ` +
                  responseJson.amount +
                  "</br>From: " +
                  responseJson.PayerVirAddr +
                  "</br>To: " +
                  responseJson.PayeeVirAddr,
              });
              this.tts_voice(this.state.respAmount, this.state.txnId);
            }
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
                    onClick: () => { },
                  },
                ],
              });
              this.props.history.push("/accountInfo");
              this.setState({ loaded: true });
            }
          }
        });
    } else {
      confirmAlert({
        message: "Enter Transaction ID",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
    }
  };
  // checking login browser is mobile or web.
  detectMob() {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
  }

  render() {
    const QrURL = this.state.qrUrl;
    const loaded = this.state.loaded;
    const statusMs = this.state.stateMs;
    
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

        <img
          src={this.state.qrImg}
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
          height="auto"
        />
        <div className="qrmsg">
          <b>Scan to Pay</b>
        </div>
        <table id="tableq" align="center" width="85%">
          <tbody>
            <tr style={{ height: "25px" }}>
              <td style={{ width: "30%" }}>User Name </td>
              <td style={{ width: "4%" }}>:</td>
              <td style={{ width: "66%" }}>
                {sessionStorage.getItem("firstName")}
              </td>
            </tr>
            <tr style={{ height: "25px" }}>
              <td>Net Amount</td>
              <td>:</td>
              <td>{URL.rupeeSymbol+" "}{this.state.netAmount}</td>
            </tr>
            <tr style={{ height: "25px" }}>
              <td>GST Amount</td>
              <td>:</td>
              <td>{URL.rupeeSymbol+" "}{this.state.gstAmount}</td>
            </tr>
            <tr style={{ height: "25px" }}>
              <td>Other Charges</td>
              <td>:</td>
              <td>{URL.rupeeSymbol+" "}{this.state.addCharge}</td>
            </tr>
            <tr style={{ height: "25px" }}>
              <td>Total Amount</td>
              <td>:</td>
              <td>{URL.rupeeSymbol+" "}{this.state.totalAmount}</td>
            </tr>

            <tr style={{ height: "25px" }}>
              <td>UPI Name</td>
              <td>:</td>
              <td>{this.state.upiName}</td>
            </tr>
            {/* <tr style={{ height: "25px" }}>
              <td></td>
              <td></td>
              <td></td>
            </tr> */}
          </tbody>
        </table>
        <br></br>

        <p
          id="upiPaymentBtn"
          style={{ marginLeft: "8%", display: this.state.isMobileDevice }}
        >
          {/* For Mobile Payments{" "} */}
          <a href={QrURL} class="upi-pay">
            <Button id="invoicepayBtn" color="primary" onClick={() => {}}>
              Pay Using UPI App
            </Button>
          </a>{" "}
        </p>
        <br></br>
        <table width="85%" style={{ marginLeft: "8%" }}>
          <tbody>
            <tr>
              <td>
                <Input
                  id="checkStatusInp"
                  type="text"
                  placeholder="Enter Transaction ID"
                  name="txnId"
                  onChange={this.setInput}
                  value={this.state.txnId}
                  autoComplete="off"
                />
              </td>
              <td>
                <Button
                  color="primary"
                  className="px-6"
                  onClick={this.checkPaymentStatus}
                >
                  Check Status
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
        <br></br>
        <Alert
          color="success"
          id="successMsg"
          style={{ marginLeft: "8%", width: "75%", display: "none" }}
        >
          <div dangerouslySetInnerHTML={{ __html: this.state.statusMs }} />
        </Alert>
        <Alert
          color="danger"
          id="failureMsg"
          style={{
            marginLeft: "8%",
            width: "75%",
            display: "none",
            textAlign: "center",
          }}
        >
          {this.state.statusMs}
        </Alert>
        <Button
          style={{ display: "none" }}
          color="primary"
          id="googleVoiceBtn"
          className="px-6"
          onClick={() =>
            this.tts_voice(this.state.respAmount, this.state.bankTxnId)
          }
        >
          Voice Message
        </Button>
      </div>
    );
  }
}
export default QRDetails;
