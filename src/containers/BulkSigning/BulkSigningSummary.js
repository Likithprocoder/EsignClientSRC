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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Delete, MoreVert, MoreHoriz, BorderColor } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import GetApp from "@material-ui/icons/GetApp";
import Modal from "react-responsive-modal";

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
      openModal: false,
      UptedSignerMobileNo: "",
      UptedsignerEmailID: "",
      signerData: null,
      openCancelSigningModal: false,
      cancelReason: "",
      cancelMsg: "",
      disableRemindr: false
    };
  }

  componentDidMount() {
    let rowData = "";
    this.getBulkSigningDetails(rowData);

  }

  onCloseCancelSigningModal = () => {
    this.setState({ openCancelSigningModal: false })

  };

  onOpenCancelSigningModal = (e) => {
    var unSignedCount = "" + this.state.pendingCount + "";
    var msg;
    var signMsg;
    if (unSignedCount == 1) {
      signMsg = "signature";
    } else {
      signMsg = "signnatures";
    }

    this.setState({
      openCancelSigningModal: true,
      cancelMsg: unSignedCount + " pending " + signMsg + " will be canceled, and all the signers on the list will receive a notification regarding the cancellation."
    })

  };

  getBulkSigningDetails = (rowData) => {
    this.setState({ loaded: false });
    let bulkSigningInfoArr = [];
    let body = {};
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    //If rowdata is empty it will make a summary call
    if (rowData == "") {
      body = {
      };
    } else { //this will fetching bulkSigningInfo details
      body = {
        "batchNo": rowData.batchNo,
      };
    }
    fetch(URL.getbulkSigningdetails, {
      // fetch(URL.subscribedPlanDetails, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jsonWebToken}`
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
    confirmAlert({
      title: "",
      message: `The signing reminder notification will be sent to the signer, ${data.signerName}.`,
      buttons: [
        {
          label: "Confirm",
          className: "confirmBtn",
          onClick: () => {
            this.setState({ loaded: false });
            var body = {
              authToken: sessionStorage.getItem("authToken"),
              batchNumber: data.batchNo,
              sequenceNumber: data.sequenceNumber
            };
            fetch(URL.notifyBulkSigners, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${jsonWebToken}`
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
                          this.setState({ loaded: true });
                        }
                      },
                    ], closeOnClickOutside: false
                  });
                }
                else if (responseJson.statusDetails === "Session Expired!!") {
                  confirmAlert({
                    message: responseJson.statusDetails,
                    buttons: [
                      {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => { this.props.history.push('/login') }
                      },
                    ], closeOnClickOutside: false
                  });
                }
                else {
                  this.setState({ loaded: true });
                  confirmAlert({
                    message: responseJson.statusDetails,
                    buttons: [
                      {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => { this.props.history.push('/') }
                      },
                    ], closeOnClickOutside: false
                  });
                }
              }).catch((e) => {
                this.setState({ loaded: true });
                confirmAlert({
                  message: 'Technical issues! Please try later.',
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => { this.props.history.push('/') }
                    },
                  ], closeOnClickOutside: false
                });
              });
          },
        },
        {
          label: "Cancel",
          className: "cancelBtn"
        },
      ], closeOnClickOutside: false
    });
  }

  //------------File Download----------------------
  fileDownload(data) {
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
    if (data.status === 2 || data.pendingCount === 0) {
      this.setState({
        disableRemindr: true
      });
    } else {
      this.setState({
        disableRemindr: false
      });
    }
    this.setState({
      loaded: false,
      batchNo: data.batchNo,
      pendingCount: data.pendingCount,
      cancelReason: ""
    });
    this.getBulkSigningDetails(data);
    this.setState(prevState => ({
      showSubListTable: !prevState.showSubListTable
    }));
  }

  exportToCSV = async (e) => {
    e.preventDefault();
    const url = `${URL.exportSignerStatusReport}?batchNumber=${this.state.batchNo}`;
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    try {
      // Show a loading indicator
      this.setState({ loaded: false });

      const response = await fetch(url, {
        method: 'GET',  headers: {
          'Authorization': `Bearer ${jsonWebToken}`
        }
      });


      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `SignerStatusReport_${this.state.batchNo}.csv`;
      link.click();

      // Hide the loading indicator
      this.setState({ loaded: true });
    } catch (error) {
      console.error('Error exporting CSV:', error);

      // Hide the loading indicator and show error
      this.setState({ loaded: true });
    }
  };

  cancelJob = async (e) => {

    // var unSignedCount = 0;
    var unSignedCount = "" + this.state.pendingCount + "";
    // unSignedCount = unSignedList.length;
    var msg;
    var signMsg;
    if (unSignedCount == 1) {
      signMsg = "sign";
    } else {
      signMsg = "signs";
    }
    // if (unSigned === "undefined" || data.IS_OWNER == 1) {
    msg = (
      <div>
        {/* <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>File Name: {data.DOC_NAME}</p> */}
        <Row>
          <i className="fa fa-exclamation-triangle" id="warningIcon"></i>
          <p style={{ color: "red" }}>
            {unSignedCount + " pending " + signMsg + " will be cancelled"}
          </p>
        </Row>
      </div>
    );

  }


  CancelSigning = async (e) => {
    this.onCloseCancelSigningModal();

    this.setState({ loaded: false });
    var body = {
      authToken: sessionStorage.getItem("authToken"),
      batchNumber: this.state.batchNo,
      cancelReason: this.state.cancelReason,
    };

    fetch(URL.cancelBulkSigning, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          this.setState({ loaded: true });
          // this.setState({cancelReason:""});
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
          this.setState({ loaded: true });
          //this.setState({cancelReason:""});
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
        }
      });
  }

  sendBulkReminder = (e) => {
    // Logic to take a count of number of unSigned users count.
    let unSigndCunt = this.state.bulkSigningInfo.filter((data) => (data.status === 0));
    let batchNumber = this.state.bulkSigningInfo[0]["batchNo"];
    if (unSigndCunt.length > 0) {
      confirmAlert({
        title: "",
        message: `The signing reminder notification will be sent to ${unSigndCunt.length} unsigned signers.`,
        buttons: [
          {
            label: "Confirm",
            className: "confirmBtn",
            onClick: () => {
              this.setState({ loaded: false });
              var body = {
                authToken: sessionStorage.getItem("authToken"),
                batchNumber: batchNumber
              };
              fetch(URL.notifyBulkSigners, {
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
                            this.setState({ loaded: true });
                          }
                        },
                      ], closeOnClickOutside: false
                    });
                  }
                  else if (responseJson.statusDetails === "Session Expired!!") {
                    confirmAlert({
                      message: responseJson.statusDetails,
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn",
                          onClick: () => { this.props.history.push('/login') }
                        },
                      ], closeOnClickOutside: false
                    });
                  }
                  else {
                    this.setState({ loaded: true });
                    confirmAlert({
                      message: responseJson.statusDetails,
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn",
                          onClick: () => { this.props.history.push('/') }
                        },
                      ], closeOnClickOutside: false
                    });
                  }
                }).catch((e) => {
                  this.setState({ loaded: true });
                  confirmAlert({
                    message: 'Technical issues! Please try later.',
                    buttons: [
                      {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => { this.props.history.push('/') }
                      },
                    ], closeOnClickOutside: false
                  });
                });
            },
          },
          {
            label: "Cancel",
            className: "cancelBtn"
          },
        ], closeOnClickOutside: false
      });
    } else {
      confirmAlert({
        message: 'Signings completed!',
        buttons: [
          {
            label: "OK",
            className: "confirmBtn"
          },
        ], closeOnClickOutside: false
      });
    }

  }

  setCancelReason = (e) => {
    const { name, value } = e.target;
    if (name === "cancelReason") {
      this.setState({
        cancelReason: value.replace(/[^\w\s@#_,'":.\\-]/gi, ""),
      });
    }
  };


  render() {
    const { bulkSigningInfo, bulkSigningSummary } = this.state;

    const columns = [
      {
        title: "",
        field: "",
        render: (rowData) => {
          if (rowData.status === 2) {
            return (
              <i class="fa fa-times"
                style={{ color: "#f86c6b", fontSize: "25px", padding: "0px" }}
              ></i>
            );
          }
          else if (rowData.pendingCount == 0) {
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
                style={{ fontSize: "25px", padding: "0px" }}
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
          padding: "0px"
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

          if (rowdata.status == 2) {
            statusText = "Signing cancelled";
            statusClass = "cancelled";
          } else if (pendingCount == 0) {
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


    const subTableColumns = [
      {
        title: "Signer Name",
        field: "signerName",
        type: "string",
        cellStyle: {
          width: "26%",
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
            case 2:
              statusText = "Cancelled";
              statusClass = "cancelled";
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
      }
    ];



    const updateSignerData = (e) => {
      // Validate if any of the values the enduser has edited.
      if (this.state.signerData["signerMobile"] === document.getElementById("blkSignEdtMoblNum").value &&
        this.state.signerData["signerEmail"] === document.getElementById("bkSgnEdtEmlId").value) {
        confirmAlert({
          message: 'Edit any of the fields to make an update!',
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
            },
          ], closeOnClickOutside: false
        });
      } else {
        this.setState({ loaded: false });
        // Update API Call.
        var signerIntsFrUpdt = {
          authToken: sessionStorage.getItem("authToken"),
          batchNumber: this.state.signerData["batchNo"],
          sequenceNumber: this.state.signerData["sequenceNumber"],
          ...(this.state.signerData["signerMobile"] !== document.getElementById("blkSignEdtMoblNum").value && {
            upatdMobileNo: document.getElementById("blkSignEdtMoblNum").value
          }),
          ...(this.state.signerData["signerEmail"] !== document.getElementById("bkSgnEdtEmlId").value && {
            upatdEmailId: document.getElementById("bkSgnEdtEmlId").value
          })
        };
        // Check for the edited fields, the edited fields shall be added to body and passed to server.
        fetch(URL.updateBulkSignerData, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(signerIntsFrUpdt)
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
                      this.setState({ loaded: true });
                      window.location.reload();
                    }
                  },
                ], closeOnClickOutside: false
              });
            }
            else if (responseJson.statusDetails === "Session Expired!!") {
              confirmAlert({
                message: responseJson.statusDetails,
                buttons: [
                  {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => { this.props.history.push('/login') }
                  },
                ], closeOnClickOutside: false
              });
            }
            else {
              confirmAlert({
                message: responseJson.statusDetails,
                buttons: [
                  {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => { this.props.history.push('/') }
                  },
                ], closeOnClickOutside: false
              });
            }
          }).catch((e) => {
            confirmAlert({
              message: 'Technical issues! Please try later.',
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => { this.props.history.push('/') }
                },
              ], closeOnClickOutside: false
            });
          });
      }
    };

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
        <Modal
          className="modal-container"
          open={this.state.openCancelSigningModal}
          onClose={this.onCloseCancelSigningModal}
          center={true}
          closeOnOverlayClick={false}
        >
          <div className="para-text" id="addCommentsModalpara-text">
            <div className="para-content">
              <Row id="otpmodalrow1">
                <label style={{ Color: "Blue" }} id="addcommentsLabel">
                  Add cancel reason
                  <i
                    style={{ marginLeft: "10px" }}
                    class="fa fa-comment-o"
                  ></i>
                </label>
                <textarea
                  style={{ marginLeft: "0px", fontSize: "13px" }}
                  class="cancelReason"
                  id="cancelReasonid"
                  name="cancelReason"
                  placeholder="maximum 255 characters allowed"
                  title="maximum 255 characters allowed"
                  rows="3"

                  onChange={this.setCancelReason}

                  value={this.state.cancelReason}
                  required={true}
                  minLength={0}
                  maxLength={455}
                  autoComplete="off"
                ></textarea>
                <div>
                  <label
                    for="acceptance"
                    id="makeprivatecommentlabel"
                    style={{ fontSize: "15px", marginLeft: "5px" }}
                  >
                    Note:{this.state.cancelMsg}
                  </label>
                </div>
                <Button
                  id="addcommentsOkbutton"
                  style={{
                    float: "right",
                    marginLeft: "auto",
                    marginTop: "15px",
                    marginBottom: "-10px",
                  }}
                  color="primary"

                  onClick={(e) =>
                    // this.cancelJob(e)
                    this.CancelSigning(e)
                  }
                >
                  OK
                </Button>
              </Row>
            </div>
          </div>
        </Modal>
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
              paddingLeft: "16px",
              paddingRight: "12px",
              borderBottom: "2px inset ",
            },
            searchFieldStyle: {
              color: "Black",
              border: "outset"
            },
            pageSize: 10,
            pageSizeOptions: [10, 15, 20],
          }}
          actions={[
            (rowData) => {
              // console.log(rowData);
              if (rowData.status === 0) {
                return {
                  icon: () => (
                    <div style={{ display: "inline-flex", marginLeft: "30%" }}>
                      <div title="Send Reminder!" className="sendReminder">
                        <AccessAlarm
                          style={{ color: "#ffc107", marginRight: "10px", cursor: "pointer" }}
                          onClick={(event) => {
                            event.stopPropagation(); // Prevent row click
                            this.sendReminder(rowData); // Function for AccessAlarm
                          }}
                        />
                      </div>
                      <div title="Edit Signer Data!" className="editSignData">
                        <FontAwesomeIcon onClick={event => {
                          event.stopPropagation(); // Prevent row click 
                          this.setState({
                            openModal: true,
                            signerData: rowData
                          })
                        }} icon={faPenToSquare} />
                      </div>
                    </div>
                  ),
                  id: "accessAlarmAndEDitIcon",
                  isFreeAction: false,
                  hidden: false
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
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#e8eaf5",
                  padding: "8px 16px",
                  height: "65px"
                }}
              >
                {/* Original Toolbar (search box, etc.) */}
                <MTableToolbar {...props} />
                <div>
                  <Button style={{ color: "white", display: (this.state.disableRemindr ? "none" : "") }} onClick={(e) => this.sendBulkReminder(e)} title="Signing reminder notification" color="warning"   >Reminder</Button>
                  <Button style={{ marginLeft: "10px" }} title="Export" onClick={(e) => this.exportToCSV(e)} color="primary"   >Export as CSV</Button>
                  <Button style={{ marginLeft: "10px", display: (this.state.disableRemindr ? "none" : "") }} id="cancelSigningBulkSigningBtn" title="Cancel Signing" onClick={(e) => this.onOpenCancelSigningModal(e)} color="danger"> Cancel Signing</Button>

                </div>
              </div>
            )
          }
          }
        ></MaterialTable>}
        {
          this.state.openModal && (
            <>
              <div className="custom-modal">
                <div className="CustomModal-contentBLKSIGNSUM">
                  <span style={{ cursor: "pointer" }} className="close" onClick={e => this.setState({ openModal: false })}>&times;</span>
                  <div>
                    <div className="DetailsHeadingSum">
                      <span>Bulk Signing: Update Signer Data</span>
                    </div>
                    <div className="notificationContent">
                      <div className="notifyIntFild" >
                        <div className="FldDIV">
                          <span>Signer Name: </span>
                        </div>
                        <div className="signerNme" >
                          <span>{this.state.signerData["signerName"]}</span>
                        </div>
                      </div>

                      {/* <div className="notifyIntFild" >
                        <div className="FldDIV" style={{ width: "100%", justifyContent: "end" }}>
                          <span>{this.state.signerData["signerName"]}</span>
                        </div>
                      </div> */}

                      <div className="notifyIntFild" >
                        <div className="FldDIV">
                          <span>Mobile Number: </span>
                        </div>
                        <div style={{ width: "68%" }}>
                          <input id="blkSignEdtMoblNum" onChange={e => { this.setState({ UptedSignerMobileNo: e.target.value }) }} maxLength={10} className="inputCss" defaultValue={this.state.signerData["signerMobile"]} type="number" />
                        </div>
                      </div>
                      <div className="notifyIntFild" >
                        <div className="FldDIV">
                          <span>Email ID: </span>
                        </div>
                        <div style={{ width: "68%" }}>
                          <input id="bkSgnEdtEmlId" onChange={e => { this.setState({ UptedsignerEmailID: e.target.value }) }} maxLength={40} defaultValue={this.state.signerData["signerEmail"]} className="inputCss"
                            type="text" />
                        </div>
                      </div>
                    </div>
                    <div className="confirmAlrt">
                      <span>
                        <span style={{ fontWeight: "600", color: "red" }}>Note:</span> The current singer details ({this.state.signerData["signerMobile"]},
                        <span style={{ color: "lightskyblue" }}>{this.state.signerData["signerEmail"]}</span>)
                        will be replaced with ({this.state.UptedSignerMobileNo}, <span style={{ color: "lightskyblue" }}>{this.state.UptedsignerEmailID}</span>),
                        and a signing notification will be sent to the above edited fields.
                      </span>
                    </div>
                    <div className="UTDBTN">
                      <button onClick={e => updateSignerData(e)} type="button" class="btn btn-primary">Update</button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        }
      </div>
    );
  }
}
