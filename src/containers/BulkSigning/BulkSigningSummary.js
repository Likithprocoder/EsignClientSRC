// material ui table ref link-----------------https://blog.logrocket.com/material-table-react-tutorial-with-examples/
import React from "react";
import { URL } from "../URLConstant";
import "../../scss/jquery.dataTables.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import MaterialTable, { MTableToolbar } from "material-table";
import tableIcons from "../Inbox/MaterialTableIcons";
import { Table, Button } from 'reactstrap';
import './bulkSigningSummary.css';
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { Row } from "reactstrap";
import AccessAlarm from "@material-ui/icons/AccessAlarm";
import { Delete, MoreVert, MoreHoriz, BorderColor } from "@material-ui/icons";
var Loader = require("react-loader");

export default class BulkSigningSummary extends React.Component {
  constructor(props) {
    super(props);
    this.toggleSubListTable = this.toggleSubListTable.bind(this);
    this.state = {
      loaded: true,
      bulkSigningSummary: [],
      bulkSigningInfo: [],
      rowData: "",
      fileName: "",
      authToken: "",
      showSubListTable: false,
      batchNo: "",
    };
  }

  componentDidMount() {
    let rowData = "";
    this.getBulkSigningDetails(rowData);
  }

  getBulkSigningDetails = (rowData) => {
    this.setState({ loaded: false });
    let bulkSigningInfoArr = [];
    let body = {};
    //If rowdata is empty it will make a summary call
    if (rowData == "") {
      body = {
        "authToken": sessionStorage.getItem("authToken")
      };
    } else { //this will fetching bulkSigningInfo details
      body = {
        "authToken": sessionStorage.getItem("authToken"),
        "batchNo": rowData.batchNo,
      };
    }
    fetch(URL.getbulkSigningdetails, {
      // fetch(URL.subscribedPlanDetails, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then((response) => {
      return response.json()
    }).then((responseJson) => {
      // console.log(responseJson);
      if (responseJson.status === "SUCCESS") {
        bulkSigningInfoArr = responseJson.bulkSigningInfo;
        //For showing bulk summary records
        if (this.state.showSubListTable) {
          this.setState({ bulkSigningInfo: bulkSigningInfoArr });
        } else {//For showing bulk signing info table records
          this.setState({ bulkSigningSummary: bulkSigningInfoArr });
        }
        this.setState({ loaded: true });
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

  //-----------------View File--------------------
  viewStoredFile = (e) => {
    let pdfurl =
      URL.viewStoredFile +
      "?at=" +
      btoa(sessionStorage.getItem("authToken")) +
      "&docID=" +
      this.setState({ fileUrl: pdfurl });
    this.setState({ shown: true })
  };

  //----------------send reminder-----------------
  sendReminder(data) {
    // var unSignedCount = 0;
    // var unSigned = "" + data.PENDING_LIST + "";
    // var unSignedList = unSigned.split(",");
    // unSignedCount = unSignedList.length;
    var msg = "";
    // "Reminder will be sent to signer(" + data.signerEmail + ")?";
    // var signMsg;
    // if (unSignedCount == 1) {
    //   signMsg = "signer";
    // } else {
    //   signMsg = "signers";
    // }
    // if (unSigned === "undefined" || data.IS_OWNER == 1) {
    msg = (
      <div>
        {/* <p style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>File Name: {data.DOC_NAME}</p> */}
        <Row id="sendReminderAlert">
          <p>
            {"Reminder will be sent to signer(" + data.signerEmail + ")"}
          </p>
        </Row>
      </div>
    );
    // }

    confirmAlert({
      title: "Send Reminder",
      message: msg,
      buttons: [
        {
          label: "Confirm",
          className: "confirmBtn",
          onClick: () => {
            var body = {
              authToken: sessionStorage.getItem("authToken"),
              docId: data.docId,
              refNo: data.batchNo,
              //   userId: data.USER_ID,
            };
            fetch(URL.sendReminder, {
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
                  confirmAlert({
                    message: responseJson.statusDetails,
                    buttons: [
                      {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => {
                          window.location.reload(false);
                        },
                      },
                    ],
                  });
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
                }
              });
          },
        },
        {
          label: "Cancel",
          className: "cancelBtn",
          onClick: () => { },
        },
      ],
    });
  }

  //------------File Download----------------------
  fileDownload(data) {
    console.log(data);
    var DocId = data.docId;
    window.location.href =
      URL.downloadStoredFile +
      "?at=" +
      btoa(sessionStorage.getItem("authToken"))
      +
      "&docID=" +
      btoa(DocId);
  }

  toggleSubListTable = (data) => {
    this.setState({ loaded: false });
    this.setState({ batchNo: data.batchNo });
    this.getBulkSigningDetails(data);
    this.setState(prevState => ({
      showSubListTable: !prevState.showSubListTable
    }));
  }

  render() {
    const { bulkSigningInfo, bulkSigningSummary } = this.state;

    // {console.log(bulkSigningInfo)}
    // {console.log(bulkSigningSummary)}

    const columns = [
      {
        title: "",
        field: "",
        cellStyle: {
          //   width: "0px",
          //   padding: "0px",
          //   paddingRight: "0%",
          //   paddingLeft: "1%",
          //   textAlign: "center",
        },
        render: (rowData) => {
          console.log(rowData);
          if (rowData.pendingCount == 0) {
            return (
              <i
                className="fa fa-check"
                style={{ color: "green", fontSize: "25px", padding: "0px" }}
              ></i>
            );
          } else {
            return (
              <i
                class="fa fa-clock-o"
                style={{ fontSize: "20px", padding: "0px" }}
              ></i>
            );
          }
        },
      },
      {
        title: "File Name",
        field: "fileName",
        type: "string",
        cellStyle: {
          width: "40%",
          padding: "0px",
          //   paddingLeft: "15%",
          //   fontSize: "15px",
        },
        render: (rowdata) => {
          let filePath = rowdata.filePath;
          let fileName = filePath.split("@");
          return fileName[1];
        }
      },
      {
        title: "Batch No.",
        field: "batchNo",
        type: "string",

        cellStyle: {
          width: "12%",
          paddingLeft: "0px",
        },
      },
      {
        title: "Initiated On",
        field: "requestedOn",
        // type: "datetime",

        cellStyle: {
          width: "20%",
          paddingLeft: "3px",
        },

        render: (rowdata) => {
          let dateTimeFully = rowdata.requestedOn;
          let dateTime = dateTimeFully.split(".");
          return dateTime[0];
        }
      },
      {
        title: "Signing(s)",
        field: "totalCount",
        cellStyle: {
          paddingLeft: "25px",
          width: "3%",
        },
      },
      {
        title: "Status",
        field: "status",
        cellStyle: {
          paddingLeft: "0px",
          width: "7%",
        },
        render: (rowdata) => {
          let statusText;
          let statusClass;
          let pendingCount = rowdata.pendingCount;
          // console.log(pendingCount);
          if (pendingCount == 0) {
            statusText = "Completed";
            statusClass = "completed";
          } else {
            statusText = "Pending(" + pendingCount + ")";
            statusClass = "pending";
          }
          return <span class={statusClass}>{statusText}</span>;
        }
      },
      {
        title: "",
        cellStyle: {
          paddingLeft: "0px",
          width: "15%",
        },
        render: (rowData) => (
          <div>
            <button
              id='moreDetails'
              className='paddingClass moreDetails btn btn-link'
              data-batchno={JSON.stringify(rowData)}
              onClick={() => this.toggleSubListTable(rowData)}
            >
              More Details
            </button>
          </div>
        )
      },
    ];

    // Custom sorting function
    const customSort = (a, b) => {
      // console.log(a);
      // console.log(b);
      // Sort by status value: 0 (top), 1 (middle), -1 (bottom)
      if (a.status < b.status) return -1;
      if (a.status > b.status) return 1;
      return 0;
    };

    const subTableColumns = [
      {
        title: "",
        field: "",
        cellStyle: {
          width: "0px",
          padding: "0px",
          // paddingRight: "0%",
          //   paddingLeft: "1%",
          //   textAlign: "center",
        },
      },
      {
        title: "Signer Name",
        field: "signerName",
        type: "string",
        cellStyle: {
          width: "26%",
          padding: "0px",
        },
      },
      {
        title: "Email ID",
        field: "signerEmail",
        type: "string",

        cellStyle: {
          width: "26%",
          paddingLeft: "2px",
        },
      },
      {
        title: "Mobile No.",
        field: "signerMobile",
        cellStyle: {
          width: "14%",
          paddingLeft: "2px",
        },
      },
      {
        title: "Status",
        field: "status",
        cellStyle: {
          paddingLeft: "2px",
          width: "7%",
        },
        render: function (data, type, rowdata) {
          // console.log(data);
          let statusText;
          let statusClass;

          switch (data.status) {
            case 0:
              statusText = "Pending";
              statusClass = "pending";
              // document.getElementById("accessAlarmIcon").style.display = "";
              break;
            case 1:
              statusText = "Signed";
              statusClass = "completed";
              // document.getElementById("accessAlarmIcon").style.display = "none";
              break;
            default:
              statusText = "Expired";
              statusClass = "expired";
          }
          return <span class={statusClass}>{statusText}</span>;
        }
      },
      {
        title: "Signed On",
        field: "signedOn",
        cellStyle: {
          paddingLeft: "2px",
          width: "20%",
        },
        // cellStyle: (rowData) => ({
        //   paddingLeft: rowData === null ? "44px" : "2px",
        //   width: "20%",
        //   // textAlign: rowData === null ? "center" : "left"
        // }),
        // cellStyle: rowData => {
        //   console.log("rowData:", rowData);
        //   return {
        //     // paddingLeft: "2px",
        //     width: "20%",
        //     paddingLeft: rowData !== null ? "2px" : "44px",
        //     textAlign: rowData === null ? "center" : "left"
        //   };
        // },
        // cellStyle: rowdata =>({
        //   paddingLeft: "2px",
        //   width: "20%",
        //   paddingLeft: rowdata.signedOn === null ? "44px" : "0px"
        // }),
        render: (rowdata) => {
          // console.log(rowdata);
          let dateTimeFully = rowdata.signedOn;
          let dateTime = dateTimeFully.split(".");
          return (rowdata.signedOn !== "null") ? dateTime[0] : "-";
        }
      },
    ];

    // Apply custom sorting to table data
    // const sortedData = [...subTableColumns].sort(customSort);

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
        {this.state.showSubListTable && <div style={{ marginBottom: "10px" }}>
          <Button title="back" style={{ color: "black", background: "#f0f3f5", height: "30px", width: "60px" }} onClick={this.toggleSubListTable}>
            <div style={{ marginTop: "-12px", fontSize: "x-large", color: "grey" }}>&larr;</div>
          </Button>
          <span style={{ float: "right" }}><b>Batch No. :</b> &nbsp; {this.state.batchNo}</span>
        </div>}
        {!this.state.showSubListTable && <MaterialTable
          columns={columns}
          icons={tableIcons}
          data={bulkSigningSummary}
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
        //   detailPanel={[
        //     {
        //       icon: MoreVert,
        //       openIcon: MoreHoriz,
        //       textAlign: "right",
        //       tooltip: "More Info",
        //       isFreeAction: false,
        //       render: (data, type, rowData) => {
        //         // console.log(rowData);
        //         console.log(data);
        //         // let unSigned = rowData.pendingList;
        //         // let signed = rowData.signedList;
        //         let pendingCount = data.totalSignersCount - data.completedSignersCount;
        //         // var signedCount = rowData.completedSignersCount;
        //         var unSignedCount = 0;
        //         onclick = this.state.rowData = rowData;

        //         if (
        //           pendingCount != 0
        //         ) {
        //             return (
        //                 <div>
        //                   <div class="MultiSignBtn">
        //                     <div id="signerInfo">
        //                       <table>
        //                         <tr>
        //                           <td style={{ verticalAlign: "text-top" }}>
        //                             {/* Sender:{" " + rowData.DOC_OWNER} */}
        //                           </td>
        //                         </tr>
        //                       </table>
        //                     </div>
        //                     <div id="moreOptions">
        //                       {" "}
        //                       <button
        //                         id="sendReminderBtn"
        //                         className="btn btn-warning rounded-pill"
        //                         // className="btn btn-primary rounded-pill"
        //                         style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
        //                         onClick={(event) =>
        //                           this.viewStoredFile(this.state.rowData)
        //                         }
        //                       >
        //                         Notify All
        //                       </button>
        //                       {/* <button
        //                         id="downloadBtn"
        //                         className="btn btn-primary rounded-pill"
        //                         style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
        //                         onClick={(event) =>
        //                           this.viewStoredFile(this.state.rowData)
        //                         }
        //                       >
        //                         Download All
        //                       </button> */}
        //                     </div>
        //                   </div>
        //                   <div style={{ backgroundColor: " #e4e5e6" }}>
        //                     {/* {this.signersInfo(rowData.PENDING_LIST, false)} */}
        //                   </div>
        //                 </div>
        //               );
        //         } else if (
        //           pendingCount == 0
        //         ) {
        //           return (
        //             <div>
        //               <div class="MultiSignBtn">
        //                 <div id="signerInfo">
        //                   <table>
        //                     <tr>
        //                       <td style={{ verticalAlign: "text-top" }}>
        //                         {/* Sender:{" " + rowData.DOC_OWNER} */}
        //                       </td>
        //                     </tr>
        //                   </table>
        //                 </div>
        //                 <div id="moreOptions">
        //                   {" "}
        //                   <button
        //                     id="sendReminderBtn"
        //                     className="btn btn-warning rounded-pill"
        //                     // className="btn btn-primary rounded-pill"
        //                     style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
        //                     onClick={(event) =>
        //                       this.viewStoredFile(this.state.rowData)
        //                     }
        //                   >
        //                     Notify All
        //                   </button>
        //                   {/* <button
        //                     id="downloadBtn"
        //                     className="btn btn-primary rounded-pill"
        //                     style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
        //                     onClick={(event) =>
        //                       this.viewStoredFile(this.state.rowData)
        //                     }
        //                   >
        //                     Download All
        //                   </button> */}
        //                 </div>
        //               </div>
        //               <div style={{ backgroundColor: " #e4e5e6" }}>
        //                 {/* {this.signersInfo(rowData.PENDING_LIST, false)} */}
        //               </div>
        //             </div>
        //           );
        //         }
        //       },
        //     },
        //   ]}
        ></MaterialTable>}
        {this.state.showSubListTable && <MaterialTable
          columns={subTableColumns}
          // columns={sortedData}
          icons={tableIcons}
          // data={sortedData}
          data={bulkSigningInfo}
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
          actions={[
            (rowData) => {              
                // console.log(rowData);
                if (rowData.status === 0) {                  
                  return {
                      icon: () => <AccessAlarm style={{ color: "#ffc107" }} />,
                      id: "accessAlarmIcon",
                      tooltip: "Send Reminder",
                      onClick: (event, rowData) => this.sendReminder(rowData),
                      isFreeAction: false,
                      hidden: true,
                  };
              } else if (rowData.status === 1) {                
                  return {
                      icon: () => <ArrowDownward />,
                      tooltip: "Download",
                      onClick: (event, rowData) => this.fileDownload(rowData),
                      isFreeAction: false,
                      hidden: false,
                  };
              } else if (rowData.status === -1) {
                  return {
                      // Define your action for status -1 here
                      // Example:
                      icon: () => "",
                      tooltip: "",
                      // onClick: (event, rowData) => this.cancelAction(rowData),
                      isFreeAction: false,
                      hidden: true,
                  };
              }
            }
          ]}
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
        ></MaterialTable>}
      </div>
    );
  }
}
