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
                  onClick: () => {},
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
        </tr>
      );
    });
  }

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
            </tr>
          </thead>
          <tbody>{this.renderTableData()}</tbody>
        </Table>
      </div>
    );
  }
}
