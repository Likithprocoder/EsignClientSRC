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
  Input,
} from "reactstrap";
import { URL } from "../URLConstant";
import $ from "jquery";
// import "../../scss/jquery.dataTables.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

var Loader = require("react-loader");
var dt = require("datatables.net");
var datetime = require("datetime-moment");


export default class RevenueReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      totalRevenurDetails: [],
      BreakDownsubsTable: [],
      BreakDowneSignTable: [],
      BreakDowneStampTable:[],
      BreakDownVoucherTable:[],
    };
  }

  componentDidMount() {
    var today = new Date();
    var dd1 = String("01");
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    var startData = yyyy + "-" + mm + "-" + dd1;
    var endData = yyyy + "-" + mm + "-" + dd;
    document.getElementById("fromDateContainer").defaultValue = startData;
    document.getElementById("toDateContainer").defaultValue = endData;
    this.getrevenueReports();
  }

  getrevenueReports = () => {
    var fromDate = document.getElementById("fromDateContainer").value;
    var toDate = document.getElementById("toDateContainer").value;

    var body = {
      loginname: sessionStorage.getItem("username"),
      authToken: sessionStorage.getItem("authToken"),
      startDate: fromDate,
      endDate: toDate,
    };
    this.setState({ loaded: false });
    fetch(URL.getrevenueReports, {
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
             totalRevenurDetails: responseJson.totalRevenurDetails,
           });
          this.state.totalRevenurDetails.map((value) => {
            if (value.revenueType === "Subscription Revenue") {
        
              this.setState({
                BreakDownsubsTable: value.brkdownRvnueDtls,
              });
            } else if (value.revenueType === "Esign Revenue") {
         
               this.setState({
                 BreakDowneSignTable: value.brkdownRvnueDtls,
               });
            
            } else if (value.revenueType === "Estamp Revenue") {
               this.setState({
                 BreakDowneStampTable: value.brkdownRvnueDtls,
               });
              } else if (value.revenueType === "Voucher Revenue") {
                
                this.setState({
                  BreakDownVoucherTable: value.brkdownRvnueDtls,
                });
            }
          }
          );
          
          this.renderTable();
          this.renderBreakDownTable();
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
  };

  renderBreakDownTable(revenueType, revenueNetAmt) {
    if (revenueType === "Subscription Revenue") {
      
      if (
        this.state.BreakDownsubsTable.length > 0 &&
        !(revenueNetAmt === "0.00")
      ) {
        return (
          <div>
            <span>Breakdown Details </span>
            <table
              style={{
                margin: "2%",
                width: "60%",
                border: "2px solid black",
                backgroundColor: "white",
              }}
            >
              <tr>
                <td>Plan ID</td>
                <td>Amount({URL.rupeeSymbol})</td>
                <td>Net Amount({URL.rupeeSymbol})</td>
                <td>GST Amount({URL.rupeeSymbol})</td>
              </tr>

              {this.state.BreakDownsubsTable.map((val, key) => {
                if (!(val.totAmnt === "0.00")) {
                  return (
                    <tr key={key}>
                      <td>{val.planID}</td>
                      <td>{val.totAmnt}</td>
                      <td>{val.netAmt}</td>
                      <td>{val.gstAMt}</td>
                    </tr>
                  );
                }
              })}
            </table>
          </div>
        );
      }
     
    }
    if(revenueType === "Voucher Revenue"){
      if(  this.state.BreakDownVoucherTable.length > 0 &&
        !(revenueNetAmt === "0.00")){
          return (
            <div>
              <span>Breakdown Details </span>
              <table
                style={{
                  margin: "4%",
                  width: "80%",
                  border: "2px solid black",
                  backgroundColor: "white",
                }}
              >
                <tr>
                  <td>Plan ID</td>
                  <td>Plan Amount({URL.rupeeSymbol})</td>
                  <td>No. Of Vouchers</td>
                  <td>Voucher Amount({URL.rupeeSymbol})</td>
                  <td>Voucher Net Amount({URL.rupeeSymbol})</td>
                  <td>Voucher GST Amount({URL.rupeeSymbol})</td>
                  
                </tr>
  
                {this.state.BreakDownVoucherTable.map((val, key) => {
                  if (!(val.totAmnt === "0.00")) {
                    return (
                      <tr key={key}>
                        <td>{val.planID}</td>
                        <td>{val.voucherAmout}</td>
                        <td>{val.noOfVouchers}</td>
                        <td>{val.totAmnt}</td>
                        <td>{val.netAmt}</td>
                        <td>{val.gstAMt}</td>
                      
                      </tr>
                    );
                  }
                })}
              </table>
            </div>
          );
      }
    }
  }

  renderTable = () => {
    return this.state.totalRevenurDetails.map((value) => {
if (value.revenueType === "Voucher Revenue") {
  return (
    <table
      style={{
        margin: "2%",
        width: "70%",
        border: "2px solid black",
        background: "darkgrey",
        // background: "#c8ced3",
      }}
    >
      <tr>
        <th
          style={{
            fontSize: "15px",
            marginBottom: ".5 rem",
            textAlign: "center",
            background: "darkgrey",
            // background: "#c8ced3",
          }}
        >
          {value.revenueType}
        </th>
      </tr>
      <div
        style={{
          border: "2px solid grey",
          marginBottom: "5px",
          marginLeft: "20px",
          marginRight: "20px",
          background: "#c8ced3",
        }}
      >
        <tr>
          <td>Amount </td>
          <td> : </td>
          <td>{URL.rupeeSymbol} {value.totAmnt}</td>
        </tr>
        <tr>
          <td>Net Amount </td>
          <td> : </td>
          <td>{URL.rupeeSymbol} {value.netAmt}</td>
        </tr>
        <tr>
          <td>GST Amount </td>
          <td> : </td>
          <td>{URL.rupeeSymbol} {value.gstAMt}</td>
        </tr>
        <tr id="voucherCount" >
          <td>Voucher Count</td>
          <td> : </td>
          <td>{value.totalVoucherCount}</td>
        </tr>

        <tr>
          <td>Date Range </td>
          <td> : </td>
          <td>{value.dateRange}</td>
        </tr>
        <tr>
          <td>Generated On</td>
          <td> : </td>
          <td>{value.reportGeneratedON}</td>
        </tr>
        {this.renderBreakDownTable(value.revenueType, value.netAmt)}
      </div>
    </table>
  );
}else{
  return (
    <table
      style={{
        margin: "2%",
        width: "70%",
        border: "2px solid black",
        background: "darkgrey",
        // background: "#c8ced3",
      }}
    >
      <tr>
        <th
          style={{
            fontSize: "15px",
            marginBottom: ".5 rem",
            textAlign: "center",
            background: "darkgrey",
            // background: "#c8ced3",
          }}
        >
          {value.revenueType}
        </th>
      </tr>
      <div
        style={{
          border: "2px solid grey",
          marginBottom: "5px",
          marginLeft: "20px",
          marginRight: "20px",
          background: "#c8ced3",
        }}
      >
        <tr>
          <td>Amount </td>
          <td> : </td>
          <td>{URL.rupeeSymbol} {value.totAmnt}</td>
        </tr>
        <tr>
          <td>Net Amount </td>
          <td> : </td>
          <td>{URL.rupeeSymbol} {value.netAmt}</td>
        </tr>
        <tr>
          <td>GST Amount </td>
          <td> : </td>
          <td>{URL.rupeeSymbol} {value.gstAMt}</td>
        </tr>
        <tr id="signedCount" >
          <td>Signed Count</td>
          <td> : </td>
          <td>{value.signCount}</td>
        </tr>
        <tr>
          <td>Date Range </td>
          <td> : </td>
          <td>{value.dateRange}</td>
        </tr>
        <tr>
          <td>Generated On</td>
          <td> : </td>
          <td>{value.reportGeneratedON}</td>
        </tr>
        {this.renderBreakDownTable(value.revenueType, value.netAmt)}
      </div>
    </table>
  );
}
      
    });
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
        <div className="inputDateContainer">
          <Row>
            <Col xs="0.5" style={{ paddingTop: "6px" }}>
              <b>From</b>
            </Col>
            <Col xs="3">
              <Input
                type="date"
                id="fromDateContainer"
                min="2020-01-01"
                onChange={this.getrevenueReports}
              ></Input>
            </Col>
            <Col xs="0.5" style={{ paddingTop: "6px" }}>
              <b>To</b>
            </Col>
            <Col xs="3">
              <Input
                type="date"
                id="toDateContainer"
                min="2020-01-01"
                onChange={this.getrevenueReports}
              ></Input>
            </Col>

            {/* <Col xs="1.5">
              <Button
                block
                outline
                color="primary"
                className="px-4"
                onClick={this.printTableData}
              >
                Download as CSV
              </Button>
            </Col> */}
          </Row>
        </div>
        <br></br>
        <div>{this.renderTable()}</div>
        {/* <div>{this.renderBreakDownTable()}</div> */}
      </div>
    );
  }
}
