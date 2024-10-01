import React from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
} from "reactstrap";
import { URL } from "../URLConstant";
import $ from "jquery";
import "../../scss/jquery.dataTables.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

var Loader = require("react-loader");
var dt = require("datatables.net");
var datetime = require("datetime-moment");

let txnData = [];

export default class PaymentDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
    };
  }

  componentDidMount() {
    var body = {
      loginname: sessionStorage.getItem("username"),
      authToken: sessionStorage.getItem("authToken"),
    };
    this.setState({ loaded: false });
    fetch(URL.getPaymentHistory, {
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
          txnData = responseJson.txnHistory;
          this.setState({ loaded: true });
          $(document).ready(function () {
            $.fn.dataTable.moment("DD-MM-YYYY HH:mm:ss");
            $("#paymentList").dataTable({
              pagingType: "full_numbers",
              columnDefs: [{ orderable: false, targets: 0 }],
            });
          });
        } else {
          this.setState({ loaded: true });
          if (responseJson.statusDetails === "Session Expired!!") {
            sessionStorage.clear();
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
            this.props.history.push("/");
          }
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
  }

  renderTableData() {
    return txnData.map((data, i) => {
      return (
        <tr key={i}>
          <td>{data.slNo}</td>
          <td>{data.date}</td>
          <td>{data.formattedAmount}</td>
          <td>{data.description}</td>
          <td>{data.txnId}</td>
          <td>{data.units}</td>
          <td><button onClick={e => this.downloadInvoiceReport(e, data.txnId)} className="btn btn-link">Download</button></td>
        </tr>
      );
    });
  }

  // Fetch call to download invoice report
  downloadInvoiceReport = (event, tansactionID) => {      
    this.setState({ loaded: false });
    let downloadInvoice =
      "?at=" + sessionStorage.getItem("authToken") +
      "&loginname=" +
      btoa(sessionStorage.getItem("username")) +
      "&transitionID=" +
      btoa(tansactionID);
    fetch(URL.downloadInvoice + downloadInvoice, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 204) {
        confirmAlert({
          message: "No data found for the selected transaction!",
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
              onClick: () => {
                window.location.reload(false);
              },
            },
          ], closeOnClickOutside: false
        });
      } else if (response.status === 401) {
        confirmAlert({
          message: "Session Expired!",
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
              onClick: () => {
                sessionStorage.clear();
                this.props.history.push("/login");
              },
            },
          ], closeOnClickOutside: false
        });
      } else if (response.status === 409) {
        confirmAlert({
          message: "Failed to download the invoice!",
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
              onClick: () => {
                window.location.reload(false);
              },
            },
          ], closeOnClickOutside: false
        });
      } else {
        return response.blob();
      }
    })
      .then((blob) => {
        const href = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", `${tansactionID}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((e) => {
        confirmAlert({
          message: "Failed to download the invoice!",
          buttons: [
            {
              label: "OK",
              className: "confirmBtn"
            },
          ], closeOnClickOutside: false
        });
      });
      this.setState({ loaded: true });
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
        <Table
          hover
          bordered
          striped
          responsive
          id="paymentList"
          style={{ textAlign: "center" }}
        >
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Date Time</th>
              <th>Amount({URL.rupeeSymbol})</th>
              <th>Transfer Type</th>
              <th>Transaction Ref. No.</th>
              <th>Units</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>{this.renderTableData()}</tbody>
        </Table>
      </div>
    );
  }
}