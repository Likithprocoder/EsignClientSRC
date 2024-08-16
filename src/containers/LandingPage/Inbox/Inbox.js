// material ui table ref link-----------------https://blog.logrocket.com/material-table-react-tutorial-with-examples/
import React from "react";
import { Row } from "reactstrap";
import { URL } from "../URLConstant";
import "./inbox.css";

import "../../scss/jquery.dataTables.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import MaterialTable, { MTableToolbar } from "material-table";
import $ from "jquery";
import tableIcons from "./MaterialTableIcons";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { Add } from "@material-ui/icons";
import { MoreVert, MoreHoriz, BorderColor } from "@material-ui/icons";
import Remove from "@material-ui/icons/Remove";
import "../Profile/ProfileDetails";
import "./StepProgressBar.css";

var Loader = require("react-loader");

export default class Inbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      inboxDataList: [],
      rowData: "",
      fileName: "",
    };
  }

  componentDidMount() {
    this.getInbocDocDetails();
  }
  //------------------Inbox Table API--------------
  getInbocDocDetails = () => {
    var body = {
      authToken: sessionStorage.getItem("authToken"),
    };
    this.setState({ loaded: false });
    fetch(URL.getInboxDocDetails, {
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
          var inboxDetails = responseJson.data;

          this.setState({
            loaded: true,
            inboxDataList: inboxDetails,
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
            //alert(responseJson.statusDetails)
          }
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
  };
  //-----------------Sign Draft File from inbox---
  //downloading PDF file
  async createFile(doc) {
    let rowData = doc;
    let response = await fetch(
      URL.viewStoredFile +
        "?at=" +
        btoa(sessionStorage.getItem("authToken")) +
        "&docID=" +
        btoa(doc.DOC_ID)
    );
    let data = await response.blob();

    let testResponse = await this.test(data, doc.DOC_NAME);
  }
  //routing to preview page
  test(data, fileName) {
    let metadata = {
      type: "application/pdf",
    };

    var file = new File([data], fileName, metadata);

    let data1 = {
      files: file,
      docId: this.state.rowData.DOC_ID,
      width: "612",
      height: "792",
    };
    //clearing the values because those values will be true only when we perform aadhar signing and to come out of iFrame
    sessionStorage.setItem("ud", false);
    sessionStorage.removeItem("txnrefNo");
    sessionStorage.removeItem("signedStatus");

    this.setState({ loaded: true });
    this.props.history.push({
      pathname: "/preview",
      frompath: "inbox",
      state: {
        details: data1,
      },
    });
  }

  //-----------------View File--------------------
  viewStoredFile = (e) => {
    // e.preventDefault();

    let pdfurl =
      URL.viewStoredFile +
      "?at=" +
      btoa(sessionStorage.getItem("authToken")) +
      "&docID=" +
      btoa(e.DOC_ID);
    //   let disable= "#toolbar=0&zoom=130"
    //   let disable1= controlsList="nodownload"
    var win = window.open();
    win.document.write("<title>" + e.DOC_NAME + "</title>");
    win.document.write(
      '<embed title="PDF preview" type="application/pdf"  src= ' +
        pdfurl +
        ' width="100%" height="100%" />'
    );
  };
  //-----------------Cancel Job--------------------
  cancelJob(data) {
    var unSignedCount = 0;
    var unSigned = "" + data.PENDING_LIST + "";
    var unSignedList = unSigned.split(",");
    unSignedCount = unSignedList.length;
    var msg;
    var signMsg;
    if (unSignedCount == 1) {
      signMsg = "sign";
    } else {
      signMsg = "signs";
    }
    if (unSigned === "undefined" || data.IS_OWNER == 1) {
      msg = (
        <div>
          <p>File Name: {data.DOC_NAME}</p>
          <Row>
            <i className="fa fa-exclamation-triangle" id="warningIcon"></i>
            <p style={{ color: "red" }}>
              {unSignedCount + " pending " + signMsg + " will be cancelled"}
            </p>
          </Row>
        </div>
      );
    }

    confirmAlert({
      title: "Cancel Signing",
      message: msg,
      buttons: [
        {
          label: "Confirm",
          className: "confirmBtn",
          onClick: () => {
            var body = {
              authToken: sessionStorage.getItem("authToken"),
              docId: data.DOC_ID,
              refNo: data.REF_NO,
              userId: data.USER_ID,
            };
            fetch(URL.cancelSigningJob, {
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
                    message: "Signing request cancelled.",
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
  //----------------send reminder-----------------
  sendReminder(data) {
    var unSignedCount = 0;
    var unSigned = "" + data.PENDING_LIST + "";
    var unSignedList = unSigned.split(",");
    unSignedCount = unSignedList.length;
    var msg;
    var signMsg;
    if (unSignedCount == 1) {
      signMsg = "signer";
    } else {
      signMsg = "signers";
    }
    if (unSigned === "undefined" || data.IS_OWNER == 1) {
      msg = (
        <div>
          <p>File Name: {data.DOC_NAME}</p>
          <Row>
            <p>
              {unSignedCount + " pending " + signMsg + " will be sent reminder"}
            </p>
          </Row>
        </div>
      );
    }

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
              docId: data.DOC_ID,
              refNo: data.REF_NO,
              userId: data.USER_ID,
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
  //-------File Delete----------------------------
  fileDelete = (data) => {
    var data = data;
    var unSignedCount = 0;
    var unSigned = "" + data.PENDING_LIST + "";
    var unSignedList = unSigned.split(",");
    unSignedCount = unSignedList.length;
    var msg;
    var signMsg;
    if (unSignedCount == 1) {
      signMsg = "sign";
    } else {
      signMsg = "signs";
    }
    if (unSigned === "undefined" || data.IS_OWNER == 0) {
      msg = (
        <div>
          <p>File Name: {data.DOC_NAME}</p>
          <Row>
            <i className="fa fa-exclamation-triangle" id="warningIcon"></i>
            <p style={{ color: "red" }}>Document will be deleted permanently</p>
          </Row>
        </div>
      );
    } else {
      msg = (
        <div>
          <p>File Name: {data.DOC_NAME}</p>
          <Row>
            <i className="fa fa-exclamation-triangle" id="warningIcon"></i>
            <p style={{ color: "red" }}>
              {unSignedCount + " pending " + signMsg + " will be cancelled and"}
            </p>
            <span style={{ color: "red", margin: "-12px 0px 0px 14px" }}>
              document will be deleted permanently
            </span>
          </Row>
        </div>
      );
    }
    confirmAlert({
      title: "Confirm Delete",
      message: msg,
      buttons: [
        {
          label: "Confirm",
          className: "confirmBtn",
          onClick: () => {
            var body = {
              authToken: sessionStorage.getItem("authToken"),
              docId: data.DOC_ID,
              refNo: data.REF_NO,
              selfsign: data.SELF_SIGN,
              userIP: sessionStorage.getItem("userIP"),
              username: sessionStorage.getItem("username"),
            };
            fetch(URL.deleteStoredFile, {
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
                    message: "Document deleted",
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
                  //alert("Document deleted")
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
                }
              });
          },
        },
        {
          label: "Cancel",
          className: "cancelBtn",
          onClick: () => {
            // this.props.history.push("/docUpload")
          },
        },
      ],
    });
  };
  //------------File Download----------------------
  fileDownload(data) {
    var data = data;
    var DocId = data.DOC_ID;
    window.location.href =
      URL.downloadStoredFile +
      "?at=" +
      btoa(sessionStorage.getItem("authToken")) +
      "&docID=" +
      btoa(DocId);
  }

  render() {
    const columns = [
      {
        title: "",
        field: "JOB_STATUS",
        cellStyle: {
          width: "4%",
          padding: "0px",
          paddingRight: "0%",
          paddingLeft: "1%",
          textAlign: "center",
          // backgroundColor: "#039be5",
          // color: "#fff",
          // "&:hover": {
          //   color: "red",
          // },
        },

        render: (rowData) => {
          if (rowData.JOB_STATUS === "S") {
            return (
              <i
                class="fa fa-times"
                style={{ color: "#F32E2E", fontSize: "25px", padding: "0px" }}
              ></i>
            );
          } else if (rowData.DOC_STATUS == -1) {
            return <i></i>;
          } else if (!rowData.hasOwnProperty("PENDING_LIST")) {
            return (
              <i
                class="fa fa-check"
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
        title: "",
        field: "DOC_NAME",
        cellStyle: {
          width: "1%",
          padding: "0px",
          paddingRight: "0%",
          textAlign: "left",
          marginBottom: "4px",
        },

        render: (rowData) => {
          return (
            <i
              id="pdfIcon"
              // title="Click Here to View File"
              class="fa fa-file-pdf-o fa-lg"
              // style={{
              //   paddingLeft: "0px",
              //   color: "#bf1515",
              //   width: "0%",
              // }}
              // onclick=(event,rowData)={{this.viewStoredFile(rowData)}}
            ></i>
          );
        },
      },
      {
        title: "File Name",
        field: "DOC_NAME",
        cellStyle: {
          width: "43%",
          padding: "0px",
          paddingLeft: "-5%",
        },
        render: (rowData) => {
          return (
            <span
              id="doc_name_td"
              //title="Click Here to View File"
            >
              {rowData.DOC_NAME}
              <br></br>
              <span
                style={{ color: "#8d8282" }}
                // title="Click Here to View File"
              >
                From: {"" + rowData.DOC_OWNER}
              </span>
            </span>
          );
        },
      },
      {
        title: "Size",
        field: "DOC_SIZE",
        type: "string",
        cellStyle: {
          width: "9%",
          paddingLeft: "0px",
        },
        render: (rowData) => {
          var stroagelimtvalue = "KB";
          var filesize;
          var filesizeinMB = rowData.DOC_SIZE;
          if (filesizeinMB >= 1024.0) {
            stroagelimtvalue = " MB";
            filesize = filesizeinMB / 1024;
            filesizeinMB = Math.round(filesize * 100) / 100.0;
            filesize = filesizeinMB + stroagelimtvalue;
          } else {
            filesize = filesizeinMB + stroagelimtvalue;
          }
          return filesize;
        },
      },
      {
        title: "Status",
        field: "DOC_STATUS",
        type: "string",
        cellStyle: {
          width: "17%",
          paddingLeft: "0px",
        },
        render: (rowData) => {
          var signed = "" + rowData.SIGNED_LIST;
          var unSigned = "" + rowData.PENDING_LIST + "";
          var signedCount = 0;
          var unSignedCount = 0;
          if (rowData.DOC_STATUS == -1 && rowData.SELF_SIGN == 1) {
            return <span style={{ color: "blue" }}>Unsigned</span>;
            //  <span style={{ color: "red" }}>{rowData.DOC_STATUS}</span>;
          } else if (rowData.SELF_SIGN == 1) {
            return <span style={{ color: "green" }}>Self signed</span>;
          } else if (rowData.JOB_STATUS === "S") {
            return <span style={{ color: "#F32E2E" }}>Signing cancelled</span>;
          } else {
            if (rowData.hasOwnProperty("SIGNED_LIST")) {
              var signedList = signed.split(",");
              signedCount = signedList.length;
            }
            if (rowData.hasOwnProperty("PENDING_LIST")) {
              var unSignedList = unSigned.split(",");
              unSignedCount = unSignedList.length;
            }
            //Sign list completed
            if (unSignedCount == 0) {
              var tootltipMsg = `Signed: &#013;${signed.replaceAll(
                ",",
                "&#013"
              )}`;
              return (
                <span style={{ color: "green", title: { tootltipMsg } }}>
                  Signed({signedCount})
                </span>
              );
            }
            //sign pending list
            else {
              var signedList = "";
              var tootltipMsg = "";
              if (signedCount > 0 && unSignedCount > 0) {
                tootltipMsg = `Signed: &#013;${signed.replaceAll(
                  ",",
                  "&#013"
                )} &#013;&#013;Pending: &#013;${unSigned.replaceAll(
                  ",",
                  "&#013"
                )}`;
              } else if (signedCount == 0 && unSignedCount > 0) {

                tootltipMsg = `Pending: &#013;${unSigned.replaceAll(
                  ",",
                  "&#013"
                )}`;
              }
              return (
                <span style={{ color: "#da8302", title: { tootltipMsg } }}>
                  Signed({signedCount}), Pending({unSignedCount})
                </span>
              );
            }
          }
        },
      },
      {
        title: "Last Updated",
        field: "LAST_UPDATED_ON",
        type: "datetime",
        cellStyle: {
          paddingLeft: "0px",
          width: "18%",
        },
      },
    ];
    const inboxData = this.state.inboxDataList;
    const actions = [
      {
        icon: BorderColor,
        tooltip: "Sign",
        onClick: (event, rowData) => this.createFile(rowData),
        isFreeAction: false,
      },
      {
        icon: ArrowDownward,
        tooltip: "Download",
        onClick: (event, rowData) => this.fileDownload(rowData),
        isFreeAction: false,
      },
      {
        icon: tableIcons.Delete,
        id: "deleteIcon",
        tooltip: "Delete",
        onClick: (event, rowData) => this.fileDelete(rowData),
        isFreeAction: false,
        cellStyle: {
          padding: "0px",
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

        <MaterialTable
          columns={columns}
          icons={tableIcons}
          data={inboxData}
          options={{
            detailPanelColumnAlignment: "right", //-------Align detailPanel column at right side of the Table
            actionsColumnIndex: -1, //-----------Align actions column at right side of the Table--------------
            // searchFieldAlignment: "left", //-----Search bar alignement----------------------------------------
            padding: "dense", //-----------Adjust table row height------------------------------------
            sorting: true, //-----------In-built Sorting operation enabled------------------------
            showTitle: false, //-----------make table title invisible--------------------------------
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
            //"#36485e",
            searchFieldStyle: {
              marginTop: "0px",
              paddingTop: "0px",
              paddingRight: "0px",
              color: "Black",
              top: "0px",
              marginBottom: "20px",
              border: "outset",
            },
          }}
          actions={actions}
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
          detailPanel={[
           
            {
              icon: MoreVert,
              openIcon: MoreHoriz,
              textAlign: "right",
              tooltip: "More Info",
              render: (rowData) => {
                var unSigned = rowData.PENDING_LIST;
                var signed = rowData.SIGNED_LIST;
                var signedCount = 0;
                var unSignedCount = 0;
                var docStatus;

                onclick = this.state.rowData = rowData; //---------------setting row data to state variable-----------------------
                if (
                  rowData.hasOwnProperty("PENDING_LIST") &&
                  rowData.hasOwnProperty("SIGNED_LIST")
                ) {
              
                  var unSignedList = unSigned.split(",");
                  unSignedCount = unSignedList.length;
                  var Signed = signed.split(",");
                  return (
                    <div class="MultiSignBtn">
                      <div id="fileName">
                        <table>
                          <tr>
                            <td>Sender</td>
                            <td>:</td>
                            <td>{rowData.DOC_OWNER}</td>
                          </tr>
                          <tr>
                            <td>Signed</td>
                            <td>:</td>
                            <td>{rowData.SIGNED_LIST.replaceAll(",", ", ")}</td>
                          </tr>
                          <tr id="pendingRow">
                            <td>Pending</td>
                            <td>:</td>
                            <td>{unSigned.replaceAll(",", ", ")} </td>
                          </tr>
                        </table>
                      </div>
                      <div id="moreOptions">
                        {" "}
                        <button
                          id="viewBtn"
                          className="btn btn-primary rounded-pill"
                          style={{ color: "white" }}
                          onClick={(event) =>
                            this.viewStoredFile(this.state.rowData)
                          }
                        >
                          View
                        </button>
                      
                        <button
                          className="btn btn-warning rounded-pill"
                          style={{ color: "white", marginLeft: "10px" }}
                          id="sendReminderBtn"
                          onClick={(event) =>
                            this.sendReminder(this.state.rowData)
                          }
                        >
                          Send Reminder
                        </button>
                        <button
                          className="btn btn-danger rounded-pill"
                          id="cancelBtn"
                          style={{ marginLeft: "10px" }}
                          onClick={(event) =>
                            this.cancelJob(this.state.rowData)
                          }
                        >
                          Cancel Signing
                        </button>
                      </div>
                    </div>
                  );
                } else if (rowData.hasOwnProperty("SIGNED_LIST")) {
                  var Signed = signed.split(",");
                  return (
                    <div class="MultiSignBtn">
                      <table>
                        <tr>
                          <td>Sender</td>
                          <td>:</td>
                          <td>{rowData.DOC_OWNER}</td>
                        </tr>
                        <tr>
                          <td>Signed</td>
                          <td>:</td>
                          <td>{signed.replaceAll(",", ", ")} </td>
                        </tr>
                      </table>
                      <div id="viewButtonSigned">
                        {" "}
                        <button
                          id="viewBtn"
                          className="btn btn-primary rounded-pill"
                          style={{ color: "white" }}
                          onClick={(event) =>
                            this.viewStoredFile(this.state.rowData)
                          }
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                } else if (rowData.hasOwnProperty("PENDING_LIST")) {
                  return (
                    <div class="MultiSignBtn">
                      <table>
                        <tr>
                          <td>Sender</td>
                          <td>:</td>
                          <td>{rowData.DOC_OWNER}</td>
                        </tr>

                        <tr id="pendingRow">
                          <td>Pending</td>
                          <td>:</td>
                          <td>{unSigned.replaceAll(",", ", ")} </td>
                        </tr>
                      </table>
                      <div id="moreOptions">
                        {" "}
                        <button
                          id="viewBtn"
                          className="btn btn-primary rounded-pill"
                          style={{ color: "white" }}
                          onClick={(event) =>
                            this.viewStoredFile(this.state.rowData)
                          }
                        >
                          View
                        </button>
                      
                        <button
                          className="btn btn-warning rounded-pill"
                          style={{ color: "white", marginLeft: "10px" }}
                          id="sendReminderBtn"
                          onClick={(event) =>
                            this.sendReminder(this.state.rowData)
                          }
                        >
                          Send Reminder
                        </button>
                        <button
                          className="btn btn-danger rounded-pill"
                          id="cancelBtn"
                          style={{ marginLeft: "10px" }}
                          onClick={(event) =>
                            this.cancelJob(this.state.rowData)
                          }
                        >
                          Cancel Signing
                        </button>
                      </div>
                    </div>
                  );
                } else if (rowData.DOC_STATUS == 3) {
                  return (
                    <div class="MultiSignBtn">
                      <table>
                        <tr>
                          <td>Sender</td>
                          <td>:</td>
                          <td>{rowData.DOC_OWNER}</td>
                        </tr>
                        <tr>
                          <td>Status</td>
                          <td>:</td>
                          <td>Signing Cancelled </td>
                        </tr>
                      </table>
                      <div id="viewButtonCancel">
                        {" "}
                        <button
                          id="viewBtn"
                          className="btn btn-primary rounded-pill"
                          style={{ color: "white" }}
                          onClick={(event) =>
                            this.viewStoredFile(this.state.rowData)
                          }
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                } else if (rowData.DOC_STATUS == -1 && rowData.SELF_SIGN == 1) {
                  return (
                    <div class="MultiSignBtn">
                      <table>
                        <tr>
                          <td>Owner</td>
                          <td>:</td>
                          <td>{rowData.DOC_OWNER}</td>
                        </tr>
                        <tr>
                          <td>Status</td>
                          <td>:</td>
                          <td>Unsigned </td>
                        </tr>
                      </table>
                      <div id="viewButtonUnsigned">
                        {" "}
                        <button
                          id="viewBtn"
                          className="btn btn-primary rounded-pill"
                          style={{ color: "white" }}
                          onClick={(event) =>
                            this.viewStoredFile(this.state.rowData)
                          }
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                } else if (rowData.SELF_SIGN == 1) {
                  return (
                    <div class="MultiSignBtn">
                      <table>
                        <tr>
                          <td>Owner</td>
                          <td>:</td>
                          <td>{rowData.DOC_OWNER}</td>
                        </tr>
                        <tr>
                          <td>Status</td>
                          <td>:</td>
                          <td>Self Signed </td>
                        </tr>
                      </table>
                      <div id="viewButton">
                        {" "}
                        <button
                          id="viewBtn"
                          className="btn btn-primary rounded-pill"
                          style={{ color: "white" }}
                          onClick={(event) =>
                            this.viewStoredFile(this.state.rowData)
                          }
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                }
              },
            },
          ]}
        ></MaterialTable>
      </div>
    );
  }
}
