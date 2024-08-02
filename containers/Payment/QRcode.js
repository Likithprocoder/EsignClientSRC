import React, { Component } from "react";
import { Button, Card, CardBody, CardHeader, Row } from "reactstrap";
import QRDetails from "./QRDetails";
import { URL } from "../URLConstant";
import "react-confirm-alert/src/react-confirm-alert.css";
import { confirmAlert } from "react-confirm-alert";
var Loader = require("react-loader");

class QRcode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      paymentType: "",
      planID: "",
      amount: "",
    };
  }
  componentWillMount() {
    if (
      this.props.location.frompath === "/subscriptions" ||
      this.props.location.frompath === "/rateCard" ||
      this.props.location.frompath === "/vouchers/vouchersubscription" 
    ) {
      this.setState({
        paymentType: this.props.location.state.details.paymentType,
        planID: this.props.location.state.details.planID,
        amount: this.props.location.state.details.amount,
        additional_data: this.props.location.state.details.additional_data
      });
    }
    sessionStorage.setItem(
      "paymentType",
      this.props.location.state.details.paymentType
    );
    sessionStorage.setItem("planID", this.props.location.state.details.planID);
    sessionStorage.setItem("amount", this.props.location.state.details.amount);
    sessionStorage.setItem("additional_data", JSON.stringify(this.props.location.state.details.additional_data));
  }

  componentDidMount() {
    if (sessionStorage.getItem("uatsetupenabled") === "Y") {
      document.getElementById("invoicepayBtn").style.display = "";
    }
    if(
      this.props.location.frompath === "/vouchers/vouchersubscription" ){
       document.getElementById("voucherNote").style.display = "" ;
      }
  }


  payment = () => {
    let body = {
      amount: sessionStorage.getItem("amount"),
      username: sessionStorage.getItem("username"),
      mysignTxnId: sessionStorage.getItem("mysignTxnId"),
    };


    this.setState({ loaded: false });
   // For the eStamping payments we are calling the DBS UAT Simulator
    //   let body = {
    // amount: sessionStorage.getItem("amount"),
    // txnid: sessionStorage.getItem("mysignTxnId"),
    // txntype: "IUPI"
    //   }
    //    fetch(URL.dbsUAT, {

    fetch(URL.paymenturl, {
   
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
        if (responseJson.status == "Success") {
         
          this.setState({
            loaded: true,
          });
          confirmAlert({
            message: "Request initiated successfully",
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => { },
              },
            ],
          });
        } else {
          this.setState({
            loaded: true,
          });
          let messageValue = "Request initiated successfully";
          if (
            responseJson.statusDetails == "Conversion Success"

          ) {
            messageValue = "Payment Successfull";
          }
          confirmAlert({
            message: messageValue,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => { },
              },
            ],
          });
        }
      })// handled payment application down case. 
      .catch((err) => {
        confirmAlert({
          message:
            "Temporarily payment sevice is down, kindly try after sometime",
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
              onClick: () => {
                this.props.history.push("/accountInfo");
              },
            },
          ],
        });
      });
    return;
    // }


    
  };
  render() {
    return (
      <div id="upiInvoice">
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
        <div id="voucherNote" style={{display:"none",width:"90%",marginBottom:"2%"}} >Note: Please be advised that after making the voucher payment, the generation of voucher codes necessitates a certain amount of time. Kindly check for the generated voucher codes at a later juncture. Your patience is highly appreciated.</div>
   
          <Card id="qrContainer">
            <CardHeader>
              <b>UPI Payment Details</b>

              <Button
                id="invoicePrintBtn"
                color="primary"
                onClick={() => window.print()}
              >
                Print
              </Button>
              <Button
                id="invoicepayBtn"
                style={{ float: "right", marginRight: "10px", display: "none" }}
                color="primary"
                onClick={() => this.payment()}
              >
                Pay
              </Button>
            </CardHeader>
            <CardBody style={{ padding: "0" }}>
              <QRDetails></QRDetails>
            </CardBody>
          </Card>
        </Row>
      </div>
    );
  }
}
export default QRcode;
