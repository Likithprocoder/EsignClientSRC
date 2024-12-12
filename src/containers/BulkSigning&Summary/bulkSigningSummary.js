// material ui table ref link-----------------https://blog.logrocket.com/material-table-react-tutorial-with-examples/
import React from "react";
import { Row } from "reactstrap";
import { URL } from "../URLConstant";
import "../../scss/jquery.dataTables.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import MaterialTable, { MTableToolbar } from "material-table";
import tableIcons from "../Inbox/MaterialTableIcons";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { Delete, MoreVert, MoreHoriz, BorderColor } from "@material-ui/icons";
import {
  Button,
  Progress,
  Card,
  CardHeader,
  CardBody,
  Input,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
var Loader = require("react-loader");

export default class BulkSigningSummary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      bulkSigningInfo: [],
      rowData: "",
      fileName: "",
      authToken: "",
    };
  }

  componentDidMount() {
    this.getBulkSigningDetails();
  }

  getBulkSigningDetails = () => {
    let bulkSigningInfoArr = [];
    // var body = {
    //     "authToken": sessionStorage.getItem("authToken")
    // };
    var body = {
        "authToken": sessionStorage.getItem("authToken"),
        "loginname": "usr78"
    };
    this.setState({ loaded: false })
    // fetch(URL.getbulkSigningdetails, {
    fetch(URL.subscribedPlanDetails, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then((response) => {
        return response.json()
    }).then((responseJson) => {
        // console.log(responseJson);
        // if (responseJson.status === "SUCCESS") {
        if (true) {
            // bulkSigningInfo = responseJson.info;
            bulkSigningInfoArr =  
                [ 
                    {"batchNo":"1670939161111","Status":1,"totalSignersCount":"10","completedSignersCount":"10","uploadedOn":"2024-03-20","fileName":"Rental Agreement.pdf"}, 
                    {"batchNo":"1670939161222","Status":0,"totalSignersCount":"20","completedSignersCount":"10","uploadedOn":"2024-03-17","fileName":"Employee Details.pdf"}, 
                    {"batchNo":"1670939161333","Status":0,"totalSignersCount":"30","completedSignersCount":"0","uploadedOn":"2024-03-12","fileName":"Task_Details.pdf"}, 
                    {"batchNo":"1670939161444","Status":0,"totalSignersCount":"5","completedSignersCount":"4","uploadedOn":"2024-03-05","fileName":"BC Template.pdf"}, 
                    {"batchNo":"1670939161555","Status":1,"totalSignersCount":"2","completedSignersCount":"2","uploadedOn":"2024-03-05","fileName":"Rental Agreement.pdf"}, 
                    {"batchNo":"1670939161666","Status":0,"totalSignersCount":"1","completedSignersCount":"0","uploadedOn":"2024-03-01","fileName":"Application.pdf"}, 
                ]
            this.setState({ bulkSigningInfo: bulkSigningInfoArr});
        } else {
                this.setState({ loaded: true });
                if (responseJson.statusDetails === "Session Expired") {
                  sessionStorage.clear();
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
                  this.props.history.push("/login");
                } 
                else {
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
              this.setState({ loaded: true });
              alert(e);
            });
  };

  render() {
    const { bulkSigningInfo } = this.state;

    const columns = [
      {
        title: "",
        field: "",
        cellStyle: {
          width: "2%",
          padding: "0px",
          paddingRight: "0%",
          paddingLeft: "1%",
          textAlign: "center",
        },
      },

      {
        title: "File Name",
        field: "fileName",
        type: "string",
        cellStyle: {
          width: "35%",
          paddingLeft: "2px",
          fontSize: "15px",
        },
      },
      {
        title: "Batch No.",
        field: "batchNo",
        type: "string",

        cellStyle: {
          width: "20%",
          paddingLeft: "5px",
        },
      },
      {
        title: "Initiated On",
        field: "uploadedOn",
        type: "datetime",

        cellStyle: {
          width: "15%",
          paddingLeft: "5px",
        },
      },
      {
        title: "Total Signers",
        field: "totalSignersCount",
        cellStyle: {
          paddingLeft: "0px",
          width: "15%",
        },
      },
      {
        title: "Status",
        field: "Status",
        cellStyle: {
          paddingLeft: "0px",
          width: "7%",
        },
        render: (rowdata) => {
            let statusText;
            let statusClass;
            let pendingCount = rowdata.totalSignersCount - rowdata.completedSignersCount;

            if (pendingCount == 0) {
                statusText = "Completed";
                statusClass = "completed";
            } else {
                statusText = "Pending("+pendingCount+")";
                statusClass = "pending";
            }             
            return `<span class="${statusClass}">${statusText}</span>`;
        }
      },
      {
        title: "Actions",
        cellStyle: {
          paddingLeft: "0px",
          width: "18%",
        },
        render: function (data, type, row) {
            let rowdata = JSON.stringify(row);
            return "<div> <button   id='moreDetails' class='paddingClass moreDetails btn btn-link'  data-batchno='" + rowdata + "'>More Info</button></div>"
        }
      },
    ];

    return (
      <div>
        <MaterialTable
          columns={columns}
          icons={tableIcons}
          data={listOfTemplates}
          options={{
            search: true,
            thirdSortClick: false,
            detailPanelType: "single",
            detailPanelColumnAlignment: "right",
            actionsColumnIndex: -1,
            // searchFieldAlignment: "left",
            padding: "dense",
            sorting: true,
            showTitle: false,
            headerStyle: {
              borderTop: "2px inset ",
              top: 0,
              borderTopWidth: "2px",
              backgroundColor: "#e8eaf5",
              color: "black",
              fontWeight: "normal",
              fontSize: "16px",
              paddingLeft: "2px",
              borderBottom: "2px inset ",
            },
            searchFieldStyle: {
              marginTop: "0px",
              paddingTop: "0px",
              paddingRight: "0px",
              color: "Black",
              top: "0px",
              marginBottom: "20px",
              border: "outset",
            },
            pageSize: 10,
            pageSizeOptions: [10, 15, 20],
          }}
          components={{
            //---------Overriding the Toolbar Component and customised-----------
            Toolbar: (props) => (
              <div
                style={{
                  backgroundColor: "#e8eaf5",
                  height: "35px",
                  fontSize: "6px",
                }}
              >
                <MTableToolbar {...props} />
              </div>
            ),
          }}
        ></MaterialTable>
      </div>
    );
  }
}
