// material ui table ref link-----------------https://blog.logrocket.com/material-table-react-tutorial-with-examples/
import React from "react";
import { URL } from "../URLConstant";
import "../../scss/jquery.dataTables.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import MaterialTable, { MTableToolbar } from "material-table";
import tableIcons from "../Inbox/MaterialTableIcons";
import { Table, Button } from 'reactstrap';
import './bulkSigning.css';
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import AccessAlarm from "@material-ui/icons/AccessAlarm";
import { Delete, MoreVert, MoreHoriz, BorderColor } from "@material-ui/icons";
var Loader = require("react-loader");

export default class BulkSigningSummary extends React.Component {
  constructor(props) {
    super(props);
    this.toggleSubListTable = this.toggleSubListTable.bind(this);
    this.state = {
      loaded: true,
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
    this.setState({ loaded: false});
    console.log(rowData);
    let bulkSigningInfoArr = [];
    // let body = {};
    if (rowData == "") {
        // body = {
        //     "authToken": sessionStorage.getItem("authToken")
        // };
    } else {
        // body = {
        //     "authToken": sessionStorage.getItem("authToken"),
        //     "batchNo": 
        // };
    }

    var body = {
        "authToken": sessionStorage.getItem("authToken"),
        "loginname": "usr78"
    };
    // this.setState({ loaded: false })
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
                if (this.state.showSubListTable) {
                    bulkSigningInfoArr = [
                        // {"signerName":"Harshith","emailId":"harshith.hv97@gmail.com","mobileNo":"6361579075","status":1,"signedOn":"20-03-2024","docId":"8JSNDOC1707975726924"},
                        // {"signerName":"Suman","emailId":"sumanmog@gmail.com","mobileNo":"6361631234","status":1,"signedOn":"15-03-2024","docId":"8JSNDOC1707975726920"},
                        {"signerName":"Lavanya","emailId":"lavanyapriya@gmail.com","mobileNo":"6374899434","status":0,"signedOn":"-","docId":"8JSNDOC1707975726924"},
                        {"signerName":"Suman","emailId":"sumanchowdary@gmail.com","mobileNo":"6361631230","status":1,"signedOn":"11-03-2024","docId":"8JSNDOC1707975726920"},
                        {"signerName":"Likith","emailId":"likithm@gmail.com","mobileNo":"6362222222","status":1,"signedOn":"10-03-2024","docId":"8JSNDOC1707975726920"},
                        {"signerName":"Abhijeet","emailId":"abhijeet@gmail.com","mobileNo":"6374111114","status":1,"signedOn":"20-03-2024","docId":"8JSNDOC1707975726920"},
                        {"signerName":"Hema","emailId":"heman@gmail.com","mobileNo":"6374444444","status":1,"signedOn":"05-03-2024","docId":"8JSNDOC1707975726920"},
                    ]
                } else {
                    bulkSigningInfoArr =  
                    [ 
                        {"batchNo":"1670939161111","Status":1,"totalSignersCount":"10","completedSignersCount":"10","uploadedOn":"2024-03-20","fileName":"Rental Agreement.pdf"}, 
                        {"batchNo":"1670939161222","Status":0,"totalSignersCount":"20","completedSignersCount":"10","uploadedOn":"2024-03-17","fileName":"Employee Details.pdf"}, 
                        {"batchNo":"1670939161333","Status":0,"totalSignersCount":"30","completedSignersCount":"0","uploadedOn":"2024-03-12","fileName":"Task_Details.pdf"}, 
                        {"batchNo":"1670939161444","Status":0,"totalSignersCount":"5","completedSignersCount":"4","uploadedOn":"2024-03-05","fileName":"BC Template.pdf"}, 
                        {"batchNo":"1670939161555","Status":1,"totalSignersCount":"2","completedSignersCount":"2","uploadedOn":"2024-03-05","fileName":"Rental Agreement.pdf"}, 
                        {"batchNo":"1670939161666","Status":0,"totalSignersCount":"1","completedSignersCount":"0","uploadedOn":"2024-03-01","fileName":"Application.pdf"}, 
                    ]
                }
            this.setState({ bulkSigningInfo: bulkSigningInfoArr});
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
        console.log(e);
        let pdfurl =
          URL.viewStoredFile +
          "?at=" +
          btoa(sessionStorage.getItem("authToken")) +
          "&docID=" +
        //   btoa(e.DOC_ID);
          this.setState({ fileUrl: pdfurl });
        //   this.setState({ fileName: e.DOC_NAME });
          // console.log(pdfurl);
          this.setState({ shown: true})
      };

    //----------------send reminder-----------------
    sendReminder(data) {
        console.log(data);
        var unSignedCount = 0;
        // var unSigned = "" + data.PENDING_LIST + "";
        // var unSignedList = unSigned.split(",");
        // unSignedCount = unSignedList.length;
        var msg;
        var signMsg;
        // if (unSignedCount == 1) {
        //   signMsg = "signer";
        // } else {
        //   signMsg = "signers";
        // }
        // if (unSigned === "undefined" || data.IS_OWNER == 1) {
        //   msg = (
        //     <div>
        //       <p style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>File Name: {data.DOC_NAME}</p>
        //       <Row id="sendReminderAlert">
        //         <p>
        //           {unSignedCount + " pending " + signMsg + " will be sent reminder"}
        //         </p>
        //       </Row>
        //     </div>
        //   );
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
                            onClick: () => {},
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
              onClick: () => {},
            },
          ],
        });
      }

  //------------File Download----------------------
  fileDownload(data) {
    console.log(data);
    var DocId = data.docId;
    // window.location.href =
    //   URL.downloadStoredFile +
    //   "?at=" +
    //   btoa(sessionStorage.getItem("authToken"))
    //    +
    //   "&docID=" +
    //   btoa(DocId);
  }

    toggleSubListTable = (data) => {
        this.setState({ loaded: false });
        this.setState({ batchNo: data.batchNo});
        this.getBulkSigningDetails(data);
        this.setState(prevState => ({
            showSubListTable: !prevState.showSubListTable
        }));
    }

  render() {
    const { bulkSigningInfo } = this.state;

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
            if (rowData.Status == 1) {
              return (
                <i
                  className="fa fa-check"
                  style={{ color: "green", fontSize: "25px", padding: "0px" }}
                ></i>
              );
            } else if (rowData.Status == 0) {
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
      },
      {
        title: "Batch No.",
        field: "batchNo",
        type: "string",

        cellStyle: {
          width: "15%",
          paddingLeft: "0px",
        },
      },
      {
        title: "Initiated On",
        field: "uploadedOn",
        // type: "datetime",

        cellStyle: {
          width: "15%",
          paddingLeft: "3px",
        },
      },
      {
        title: "Signing(s)",
        field: "totalSignersCount",
        cellStyle: {
          paddingLeft: "25px",
          width: "7%",
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
            width: "28%",
            padding: "0px",
          //   paddingLeft: "15%",
          //   fontSize: "15px",
          },
        },
        {
          title: "Email ID",
          field: "emailId",
          type: "string",
  
          cellStyle: {
            width: "28%",
            paddingLeft: "2px",
          },
        },
        {
          title: "Mobile No.",
          field: "mobileNo",
          cellStyle: {
            width: "14%",
            paddingLeft: "2px",
          },
        },
        {
          title: "Status",
          field: "Status",
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
            }
            return <span class={statusClass}>{statusText}</span>;
          }
        },
        {
          title: "Signed On",
          field: "signedOn",
          cellStyle: {
            paddingLeft: "2px",
            width: "14%",
          },
        },
      ];

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
        {this.state.showSubListTable && <div style={{ marginBottom: "10px"}}>
            <Button  title="back" style={{ color: "black", background: "#f0f3f5", height: "30px", width: "60px" }} onClick={this.toggleSubListTable}>
                <div style={{ marginTop: "-12px", fontSize: "x-large", color: "grey"}}>&larr;</div>
            </Button>
            <span style={{ float: "right"}}><b>Batch No. :</b> &nbsp; {this.state.batchNo}</span>
        </div>}
        {!this.state.showSubListTable && <MaterialTable
          columns={columns}
          icons={tableIcons}
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
          icons={tableIcons}
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
                console.log(rowData);
              return rowData.status == 0
                ? {
                    icon: () => <AccessAlarm style={{ color: "#ffc107" }} />,
                    id: "accessAlarmIcon",
                    tooltip: "Send Reminder",
                    onClick: (event, rowData) => this.sendReminder(rowData),
                    isFreeAction: false,
                    hidden: false,
                  }
                : {
                    icon: () => <ArrowDownward />,
                    tooltip: "Download",
                    onClick: (event, rowData) => this.fileDownload(rowData),
                    isFreeAction: false,
                    hidden: false,
                  }
            },
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
