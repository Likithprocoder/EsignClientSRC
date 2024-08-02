// material ui table ref link-----------------https://blog.logrocket.com/material-table-react-tutorial-with-examples/
import React from "react";
import { Row } from "reactstrap";
import { URL } from "../URLConstant";
import "./inbox.css";
import "../../scss/jquery.dataTables.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import MaterialTable, { MTableToolbar } from "material-table";
import tableIcons from "./MaterialTableIcons";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { Delete, MoreVert, MoreHoriz, BorderColor } from "@material-ui/icons";
import "../Profile/ProfileDetails";
import "./stepProgressBars.scss";
import Modal from "react-responsive-modal";
import UserDetailValidation from "../Templates/UserDetailValidation";

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
//import { indexOf } from "core-js/core/array";
var Loader = require("react-loader");
var jsPDF = require("jspdf");

const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.min.js`;

export default class ApplicationInbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      inboxDataList: [],
      rowData: "",
      fileName: "",
      docId: "",
      username: "",
      firstName: "",
      email: "",
      userId: "",
      mobileNo: "",
      senderName: "",
      requestedTime: "",
      openEmailModal: false,

      authToken: "",
      canvas_width: "",
      canvas_height: "",
      data1: {},
      to: "",
      cc: "",
      array_emailTo: [],
      array_emailCc: [],
      subject: "",
      ebody: "",
      emailValidation: {},
      documentId: "",
      attachment: "",
      maxUploadFileSize: "",
      signerListDetails: [],
      opensignersCommentsModal: false,
      CommentsHeading: " ",
      GroupNameAndCode: "",
      FirstGroupAndCode: "",
      listOfDocIdToCsv: [],
      TemplateBasedOnTempCode: "",
      templateCode: "",
      templateName: "",
      customFieldInputs: [],
      allowModal: false,
      customDataToServer: []
    };
  }

  componentDidMount() {
    // this.getInbocDocDetails();
    this.getEmailValidation();
    this.setState({ maxUploadFileSize: sessionStorage.getItem("maxFilesize") });
    fetch(URL.getAllTemplateGrps, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authToken: sessionStorage.getItem("authToken"),
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {

        if (responseJson.status == "SUCCESS") {
          this.setState({ GroupNameAndCode: responseJson.details });
          this.setState({ FirstGroupAndCode: responseJson.details[0] })
          let today = new Date();
          let firstDay = new Date();
          firstDay.setDate(1)
          let dd = String(today.getDate()).padStart(2, '0');
          let firstDate = String(firstDay.getDate()).padStart(2, '0');
          let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          let yyyy = today.getFullYear();
          let toDate = yyyy + '-' + mm + '-' + dd
          let fromDate = yyyy + '-' + mm + '-' + firstDate;
          let startDate = document.getElementById("fromDateContainer").defaultValue = fromDate;
          let endDate = document.getElementById("toDateContainer").defaultValue = toDate;
          let subGroup = "";
          let grp_code = responseJson.details[0].code;
          let gro_name = responseJson.details[0].name;
          fetch(URL.getTempsForThatGroupCode, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              authToken: sessionStorage.getItem("authToken"),
              grpCode: grp_code
            }),
          })
            .then((response) => {
              return response.json();
            })
            .then((responseJson) => {
              if (responseJson.status == "success") {
                if (responseJson.data.length !== 0) {
                  this.setState({
                    TemplateBasedOnTempCode: responseJson.data,
                    templateCode: responseJson.data[0].code,
                    templateName: responseJson.data[0].name
                  })
                  this.getInbocDocDetails(grp_code, subGroup, startDate, endDate, responseJson.data[0].code, "");
                } else {
                  this.setState({
                    TemplateBasedOnTempCode: []
                  })
                  confirmAlert({
                    message: `No templates are avialable under the group '${gro_name}!'`,
                    buttons: [
                      {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => {
                          this.props.history.push("/applications");
                        },
                      },
                    ],
                  });
                  return;
                }
              }
              else if (responseJson.statusDetails == "Session Expired") {
                confirmAlert({
                  message: "Session Expired!",
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => {
                        this.props.history.push("/");
                      },
                    },
                  ],
                });
              }
              else {
                confirmAlert({
                  message: responseJson.statusDetail,
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => { },
                    },
                  ],
                });
              }
            })

        }
        else if (responseJson.statusDetails == "Session Expired") {
          confirmAlert({
            message: "Session Expired!",
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  this.props.history.push("/");
                },
              },
            ],
          });
        }
        else {

          this.props.history.push({
            pathname: "/login",
          });
          this.setState({ loaded: true });
        }
      });

    // this.getTemplateReports();
  }

  onCloseSignersCommentsModal = () => {
    this.setState({ opensignersCommentsModal: false });
  };



  //------------------Inbox Table API--------------
  getInbocDocDetails = (groupCode, subGroup, startDate, endDate, templateCode, searchValue) => {
    var body = {};
    if (searchValue != "") {
      // alert("search value is present")
      body = {
        authToken: sessionStorage.getItem("authToken"),
        groupCode: groupCode,
        subGroup: subGroup,
        startDate: startDate,
        endDate: endDate,
        templateCode: templateCode,
        searchValue: searchValue
      };
    }
    else {
      body = {
        authToken: sessionStorage.getItem("authToken"),
        groupCode: groupCode,
        subGroup: subGroup,
        startDate: startDate,
        endDate: endDate,
        templateCode: templateCode
      };
    }
    this.setState({ loaded: false });
    fetch(URL.getTemplateApplnList, {
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
          if (responseJson.statusDetails === "searchValue") {
            this.setState({
              loaded: true,
            });
          }

          //-------------Hiding sign icon based on DOC_STATUS and displaying sign icon based on acesskey keyword present or not--------------
          var isSignEnable;
          for (var i = 0; i < inboxDetails.length; i++) {
            var rowData = inboxDetails[i];
            if (
              rowData.DOC_STATUS === -1 ||
              rowData.hasOwnProperty("ACCESS_KEY")
            ) {
              isSignEnable = true;
            } else {
              isSignEnable = false;
            }
            rowData.isSignEnable = isSignEnable;
            inboxDetails[i] = rowData;
          }

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

  //------------------Signing from inbox call(self signing or third party signing)------------------
  CheckSigningMode = (rowData) => {
    if (rowData.hasOwnProperty("ACCESS_KEY")) {
      this.signFromInboxForThirdPart(rowData.ACCESS_KEY);
    } else {
      this.createFile(rowData);
    }
  };

  async createFileforSigningasSender(filename, docID) {
    let response = await fetch(
      URL.downloadStoredFile +
      "?at=" +
      btoa(sessionStorage.getItem("authToken")) +
      "&docID=" +
      btoa(docID)
    );
    let data = await response.blob();
    let testResponse = await this.routetoPreviewPage(data);
  }

  //routing to preview page
  routetoPreviewPage(data) {
    let metadata = {
      type: "application/pdf",
    };
    var file = new File([data], this.state.fileName.split("@")[1], metadata);

    let data1 = {
      files: file,
      sendername: this.state.senderName,
      requestedTime: this.state.requestedTime,
      externalSigner: true,
      signCoordinates: this.state.signCoordinates,
      signMode: this.state.signMode,
      height: this.state.signCoordinates.totHeight,
      width: this.state.signCoordinates.totWidth,
      docId: this.state.docId,
      username: this.state.username,
      firstName: this.state.firstName,
      email: this.state.email,
      userId: this.state.userId,
      mobileNo: this.state.mobileNo,
      ownerloginName: this.state.ownerloginName,
      loginMode: true,
      authToken: this.state.authToken,
      signerListDetails: this.state.signerListDetails,
    };
    this.setState({ loaded: true });
    this.props.history.push({
      pathname: "/preview",
      frompath: "inbox",
      state: {
        details: data1,
      },
    });
  }

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
    let testResponse = await this.test(data, doc.DOC_NAME, doc.DOC_ID);
    //this.imageToPDF(data)
  }

  //routing to preview page
  test(data, fileName, documentId) {
    let metadata = {
      type: "application/pdf",
    };
    var file = new File([data], fileName.trim(), metadata); //------------file name construction-----------
    this.onDrop(file, documentId);
  }

  onDrop(files, docId) {
    var file = files;
    var reader = new FileReader();
    reader.onloadend = function (e) {
      var data = reader.result;
      console.log("data" + data);
      if (files.name.includes(".jpg") || files.name.includes(".png")) {
        //  this.imageToPDF(files);
      } else {
        var pdf = pdfjs
          .getDocument({ data: data })
          .then(
            function (a) {
              a.getPage(1).then(
                function (b) {
                  var viewport = b.getViewport({ scale: 1 });
                  let data1 = {
                    files: files,
                    docId: docId,
                    width: viewport.width, //-----------------hard coded width need to change (blocker for A3) -------------------
                    height: viewport.height, //-----------------hard coded height need to change (blocker for A3)-------------------
                  };

                  this.setState({ loaded: true });
                  this.props.history.push({
                    pathname: "/preview",
                    frompath: "inbox",
                    state: {
                      details: data1,
                    },
                  });
                  // this.setState({
                  //   width: viewport.width,
                  //   height: viewport.height,
                  // });
                }.bind(this)
              );
            }.bind(this)
          )
          .catch((e) => { });
      }
    }.bind(this);
    reader.readAsArrayBuffer(file);
  }

  //---------------Send Email--------------------------

  //--Check the file size and opening the modal to collect email details
  emailNotification = (e) => {
    this.setState({ documentId: e.DOC_ID });

    var stroagelimtvalue = "KB";
    var filesize;
    var filesizeinMB = e.DOC_SIZE;
    if (filesizeinMB >= 1024.0) {
      stroagelimtvalue = "MB";
      filesize = filesizeinMB / 1024;
      filesizeinMB = Math.round(filesize * 100) / 100.0;
      filesize = filesizeinMB + stroagelimtvalue;
      this.setState({ attachment: e.DOC_NAME + " (" + filesize + ")" });
    } else {
      filesize = filesizeinMB + stroagelimtvalue;
      this.setState({ attachment: e.DOC_NAME + " (" + filesize + ")" });
    }

    var fSize = (e.DOC_SIZE / 1024).toFixed(2);

    // console.log("SessionFilesize: "+this.state.maxUploadFileSize/1)
    if (fSize < this.state.maxUploadFileSize / 1) {
      this.setState({
        openEmailModal: true,
      });
    } else {
      confirmAlert({
        message: "Attached file to email can't exceed 25 MB",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => { },
          },
        ],
      });
    }
  };

  unHideCcField = () => {
    document.getElementById("unHideCc").style.display = "";
    document.getElementById("unHide").style.display = "none";
  };

  //--To collect the Email details from user---------
  setInput = (e) => {
    let value = e.target.value;
    let name = e.target.name;
    if (name === "sendTo") {
      this.setState({
        to: value,
      });
    }
    if (name === "sendCc") {
      this.setState({
        cc: value,
      });
    }
    if (name === "sendSubject") {
      // value = value = e.keyCode : value = e.which;
      this.setState({ subject: value.replace(/[^\w\s@#_,'":.\\-]/gi, "") });
    }
    if (name === "sendBody") {
      this.setState({ ebody: value.replace(/[^\w\s@#_,'":.\\-]/gi, "") });
    }
  };

  //--API Call For getting the Template Validations from server-----------
  getEmailValidation = () => {
    var authToken = "?authToken=" + sessionStorage.getItem("authToken");
    fetch(URL.getEmailTemplateValidation + authToken, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          // console.log(responseJson.statusDetails)
          var resData = responseJson.valdtnResp;
          // console.log(resData);
          this.setState({ emailValidation: resData, loaded: true });
          // console.log(sessionStorage.getItem("minToEmail"));
        } else {
          if (responseJson.statusDetails === "Session Expired!!") {
            sessionStorage.clear();
            this.setState({ loaded: true, openEmailModal: false });
            this.props.history.push("/login");
          } else {
            this.setState({ loaded: true, openEmailModal: false });
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
            this.props.history.push("/inbox");
          }
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
    // console.log(sessionStorage);
  };

  //--API for Sending the Email request with attachment-----------
  getEmailDetails = () => {
    let emailTo = this.state.to;
    let emailCc = this.state.cc;
    let charTwice = /(@).*\1/i;
    // let consecutiveChar = /(.)\1+/g;
    // let regMail = /[\w. ]+@([\w-]+\.)+[\w-]+/;
    let regMail = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[a-zA-Z]{2,6}$/;

    var emailArrayTo = [];
    var emailArrayCc = [];
    var combinedEmailList = [];

    if (emailTo.trim()) {
      if (emailTo.includes(";")) {
        var resultTo = emailTo.replaceAll(";", ",").split(",");
      } else {
        var resultTo = emailTo.split(",");
      }
      for (var i = 0; i < resultTo.length; i++) {
        if (resultTo[i].trim() !== "") {
          if (resultTo[i].includes("@")) {
            var emailPart = resultTo[i].split("@");
            if (
              emailPart[0].trim().length !== 0 &&
              emailPart[1].trim().length !== 0
            ) {
              if (
                emailPart[0].trim().length <= 64 &&
                emailPart[1].trim().length <= 255
              ) {
                if (
                  regMail.test(resultTo[i].trim()) &&
                  !charTwice.test(resultTo[i].trim())
                ) {
                  emailArrayTo.push(resultTo[i].trim());
                } else {
                  alert("Entered Email ID in the 'To' field is invalid");
                  return;
                }
              } else {
                alert("Entered Email ID in the 'To' field is invalid");
                return;
              }
            } else {
              alert("Entered Email ID in the 'To' field is invalid");
              return;
            }
          } else {
            alert("Entered Email ID in the 'To' field is invalid");
            return;
          }
        } else {
          continue;
        }
      }

      if (!emailArrayTo.length > 0) {
        alert("Please enter the Email ID");
        return;
      }

      if (emailCc.trim()) {
        if (emailCc.includes(";")) {
          var resultCc = emailCc.replaceAll(";", ",").split(",");
        } else {
          var resultCc = emailCc.split(",");
        }
        for (var i = 0; i < resultCc.length; i++) {
          if (resultCc[i].trim() !== "") {
            if (resultCc[i].includes("@")) {
              var emailPart = resultCc[i].split("@");
              if (
                emailPart[0].trim().length !== 0 &&
                emailPart[1].trim().length !== 0
              ) {
                if (
                  emailPart[0].trim().length <= 64 &&
                  emailPart[1].trim().length <= 255
                ) {
                  if (
                    regMail.test(resultCc[i].trim()) &&
                    !charTwice.test(resultCc[i].trim())
                  ) {
                    emailArrayCc.push(resultCc[i].trim());
                  } else {
                    alert("Entered Email ID in the 'Cc' field is invalid");
                    return;
                  }
                } else {
                  alert("Entered Email ID in the 'Cc' field is invalid");
                  return;
                }
              } else {
                alert("Entered Email ID in the 'Cc' field is invalid");
                return;
              }
            } else {
              alert("Entered Email ID in the 'Cc' field is invalid");
              return;
            }
          } else {
            continue;
          }
        }
      }
      combinedEmailList = emailArrayTo.concat(emailArrayCc);

      if (emailArrayTo.length > this.state.emailValidation.maxEmail) {
        alert(
          "Can't exceed more than " +
          this.state.emailValidation.maxEmail +
          " Email IDs"
        );
        return;
      } else if (
        combinedEmailList.length > this.state.emailValidation.maxEmail
      ) {
        alert(
          "Can't exceed more than " +
          this.state.emailValidation.maxEmail +
          " Email IDs"
        );
        return;
      } else if (new Set(combinedEmailList).size !== combinedEmailList.length) {
        alert("Duplicate entries of Email ID found");
        return;
      } else if (
        this.state.subject.length > this.state.emailValidation.subjectLen
      ) {
        alert(
          "'Subject' has reached the maximum limit of " +
          this.state.emailValidation.subjectLen +
          " characters"
        );
        return;
      } else if (this.state.ebody.length > this.state.emailValidation.bodyLen) {
        alert(
          "'Body' has reached the maximum limit of " +
          this.state.emailValidation.bodyLen +
          " characters"
        );
        return;
      } else {
        // this.setState({
        //   to: emailArrayTo,
        // });
        // this.setState({
        //   cc: emailArrayCc,
        // });
        var obj = {
          toEmails: emailArrayTo,
          ccEmails: emailArrayCc,
          authToken: sessionStorage.getItem("authToken"),
          eSub: this.state.subject,
          eBody: this.state.ebody,
          docId: this.state.documentId,
          userIP: sessionStorage.getItem("userIP"),
        };
        fetch(URL.sendEmail, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
        })
          .then((response) => {
            return response.json();
          })
          .then((responseJson) => {
            if (responseJson.status === "SUCCESS") {
              this.onCloseEmailModal();
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
            } else {
              if (responseJson.statusDetails === "Session Expired!!") {
                sessionStorage.clear();
                this.setState({ loaded: true, openEmailModal: false });
                this.props.history.push("/login");
              } else {
                this.setState({ loaded: true, openEmailModal: false });
                this.setState({ to: "" });
                this.setState({ cc: "" });
                this.setState({ subject: "" });
                this.setState({ ebody: "" });
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
                this.props.history.push("/inbox");
              }
            }
          })
          .catch((e) => {
            this.setState({ loaded: true });
            this.setState({ to: "" });
            this.setState({ cc: "" });
            this.setState({ subject: "" });
            this.setState({ ebody: "" });
            alert(e);
          });
      }
    } else {
      alert("Please enter the Email ID");
      return;
    }
    // console.log(combinedEmailList);
    // console.log(combinedEmailList.length);
  };

  //-----------------View File--------------------
  viewStoredFile = (e) => {
    let pdfurl =
      URL.viewStoredFile +
      "?at=" +
      btoa(sessionStorage.getItem("authToken")) +
      "&docID=" +
      btoa(e.DOC_ID);
    var win = window.open();
    win.document.write("<title>" + e.DOC_NAME + "</title>");
    win.document.write(
      '<embed title="PDF preview" type="application/pdf"  src= ' +
      pdfurl +
      ' width="100%" height="100%" />'
    );
  };

  ExportTemplate = (e, docID) => {
    let authAndDocid = "?at=" + btoa(sessionStorage.getItem("authToken")) + "&docID=" + btoa(docID.DOC_ID)
    fetch(URL.getTempForCsv + authAndDocid, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response.status);
        if (response.status === 423) {
          confirmAlert({
            message: "Session Expired",
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  this.props.history.push("/login");
                },
              },
            ],
          });
        } else if (response.status === 204) {
          confirmAlert({
            message: "No data is present",
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                },
              },
            ],
          });
        }
        else {
          return response.blob();
        }
      })
      .then((blob) => {
        const href = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', `${docID.DOC_ID}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((e) => {
        this.setState({ loaded: true });
      });
  }

  closeTheModal = () => {
    this.setState({
      allowModal: false
    })
  }

  downLoadCsvFile = (event) => {
    let group = this.state.FirstGroupAndCode.code;
    let subGroup = this.state.FirstGroupAndCode.name;
    let startDate = document.getElementById("fromDateContainer").value;
    let endDate = document.getElementById("toDateContainer").value;
    let templateCode = this.state.templateCode;
    let templateName = this.state.templateName;
    let detailsForCsvDownload =
      "?at=" +
      btoa(sessionStorage.getItem("authToken")) +
      "&startDate=" +
      btoa(startDate) +
      "&endDate=" +
      btoa(endDate) +
      "&group=" +
      btoa(group) +
      "&subGroup=" +
      "" +
      "&templateCode=" +
      btoa(templateCode) +
      "&templateName=" +
      btoa(templateName);
    fetch(URL.getTempDetForMultiCsv + detailsForCsvDownload, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 404) {
          confirmAlert({
            message: "No Documents are present!",
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
          return response.blob();
        }
      })
      .then((blob) => {
        const href = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", `${this.state.templateName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((e) => {
        this.setState({ loaded: true });
      });
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
          <p style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
            File Name: {data.DOC_NAME}
          </p>
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
          <p style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
            File Name: {data.DOC_NAME}
          </p>
          <Row id="sendReminderAlert">
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
          <p style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
            File Name: {data.DOC_NAME}
          </p>
          <Row>
            <i className="fa fa-exclamation-triangle" id="warningIcon"></i>
            <p style={{ color: "red" }}>Document will be deleted permanently</p>
          </Row>
        </div>
      );
    } else {
      msg = (
        <div>
          <p style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}>
            File Name: {data.DOC_NAME}
          </p>
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
  //-----------Step Progress Bar SignersInfo-------
  signersInfo(signerList, isSignedList) {
    var signerArray = signerList.split(",");
    var type = -1; // default value
    if (isSignedList) {
      type = 1; // indicates signed list
    } else {
      type = 2; // indicates pending list
    }
    return (
      <span>
        {(() => {
          const signerContainer = [];
          for (let i = 0; i < signerArray.length; i++) {
            signerContainer.push(
              <span>{this.stepprogressBar(signerArray[i], type)}</span> // type=1 complete signed list; type=2 complete pending list;
            );
          }
          return signerContainer;
        })()}
      </span>
    );
  }
  //----------Step Progress Bar --------------
  stepprogressBar(signerInfo, type) {
    // type=1 signed list
    if (type == 1) {
      return (
        <div>
          <hr></hr>
          <span style={{ display: "inline-flex", paddingBottom: "7px" }}>
            <div
              style={{ width: "50%", paddingLeft: "5.5%", paddingTop: "7px" }}
            >
              {" "}
              Signer: {" " + signerInfo}
            </div>

            <div
              style={{
                width: "30%",
                display: "contents",
                textAlign: "center",
                paddingTop: "7px",
              }}
            >
              {" "}
              <ol class="steps" style={{ width: "30%", paddingTop: "7px" }}>
                <li class="step is-complete" data-step="1">
                  Mailed{" "}
                </li>
                <li class="step is-complete" data-step="2">
                  Signed{" "}
                </li>
              </ol>
            </div>
          </span>
        </div>
      );
    }
    // type=2 pending list
    else if (type == 2) {
      return (
        <div>
          <hr></hr>

          <span style={{ display: "inline-flex", paddingBottom: "7px" }}>
            <div
              style={{ width: "50%", paddingLeft: "5.5%", paddingTop: "7px" }}
            >
              {" "}
              Signer:{""}
              {" " + signerInfo}
            </div>

            <div
              style={{
                width: "30%",
                display: "contents",
                textAlign: "center",
                paddingTop: "7px",
              }}
            >
              {" "}
              <ol class="steps" style={{ width: "30%", paddingTop: "7px" }}>
                <li class="step is-active" data-step="1">
                  Mailed{" "}
                </li>
                <li class="step" data-step="2">
                  Signed{" "}
                </li>
              </ol>
            </div>
          </span>
        </div>
      );
    }
  }

  onCloseEmailModal = () => {
    // $(".modal-container input").val("");
    this.setState({ to: "" });
    this.setState({ cc: "" });
    this.setState({ subject: "" });
    this.setState({ ebody: "" });
    this.setState({ openEmailModal: false });
    // this.componentDidMount();
  };

  commentDetails(e) {
    var obj = {
      authToken: sessionStorage.getItem("authToken"),
      docId: e.DOC_ID,
    };
    fetch(URL.getSignerComments, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          var commentsListDetails = responseJson.signerListDetails;
          this.setState({ signerListDetails: commentsListDetails });

          if (commentsListDetails == null || commentsListDetails == "") {
            confirmAlert({
              message: "No comments for the document",
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => { },
                },
              ],
            });
          } else {
            this.setState({ opensignersCommentsModal: true });
          }
        }
      })
      .catch((e) => {
        alert(e);
      });
  }



  // to convert the date formate, so that value appears to end users.. (10-nov-2023 to 10-11-2023);

  provideValue = (value) => {
    var date = `${value}`.split("-");
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (var j = 0; j < months.length; j++) {
      if (date[1] == months[j]) {
        date[1] = months.indexOf(months[j]) + 1;
      }
    }
    if (date[1] < 10) {
      date[1] = '0' + date[1];
    }
    if (date[0] < 10) {
      date[0] = "0" + date[0];
    }
    var formattedDate = date[2] + "-" + date[1] + "-" + date[0];
    return formattedDate;
  }

  // to create the input fields for custom fields..
  openModalForCustFieldDetail = () => {
    if (this.state.customFieldInputs.length !== 0) {
      return (
        <div>
          <div className='inputHolderCss scrollbarxCustomFields'>
            {
              this.state.customFieldInputs.map((data, index) => (
                <div key={index} className='Divo5Css'>
                  <div className='InputName'>
                    <span>{data.label}</span>
                  </div>
                  <div className='inputname1'>
                    <input defaultValue={data.inputType !== "date" ? data.value : this.provideValue(data.value)} disabled={data.filledBy === 0 ? true : false}
                      type={data.inputType} name={data.inputField} minLength={data.minLength}
                      maxLength={data.maxLength} min={data.minRange} max={data.maxRange} id={data.inputField}
                      placeholder={data.placeHolder} autoCapitalize='off' className='inputCss' />
                  </div>
                </div>
              ))
            }
          </div>
          <div className='Divo6Css'>
            <div className='proceedCancelCss'>
              <button className='cancelbtn' type='button' onClick={this.closeTheModal}>Cancel</button>
            </div>
            <div className='proceedCancelCss'>
              <button className='proceedbtnX' type='button' onClick={e => this.CollectInputsforDocument(e)}>Proceed</button>
            </div>
          </div>
        </div>
      )
    }
  }

  getTemplateReports = (id, event) => {
    let groupCode = this.state.FirstGroupAndCode.code;
    let groupName = this.state.FirstGroupAndCode.name;
    let startDate = document.getElementById("fromDateContainer").value;
    let endDate = document.getElementById("toDateContainer").value;
    if (startDate === "") {
      return;
    }
    if (endDate === "") {
      return;
    }
    let dd = new Date(startDate);
    dd.setDate(dd.getDate() + 1);
    this.getInbocDocDetails(
      groupCode,
      "",
      startDate,
      endDate,
      this.state.templateCode, ""
    );
  };

  filter = (event) => {
    const selectedValue = event.target.value;
    const grp_code = selectedValue.split("$")[0];
    const grp_name = selectedValue.split("$")[1];
    const subGroup = "";
    this.setState({ selectedOption: selectedValue });
    this.setState({
      FirstGroupAndCode: { code: grp_code, name: grp_name },
    });
    let startDate = document.getElementById("fromDateContainer").value;
    let endDate = document.getElementById("toDateContainer").value;
    fetch(URL.getTempsForThatGroupCode, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authToken: sessionStorage.getItem("authToken"),
        grpCode: grp_code,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.status == "success") {
          if (responseJson.data.length !== 0) {
            this.setState({
              TemplateBasedOnTempCode: responseJson.data,
              templateCode: responseJson.data[0].code,
              templateName: responseJson.data[0].name
            })
            this.getInbocDocDetails(grp_code, subGroup, startDate, endDate, responseJson.data[0].code, "");
          }
          else {
            this.setState({
              TemplateBasedOnTempCode: []
            })
            confirmAlert({
              message: `No templates are avialable under the group '${grp_name}'!`,
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {
                    this.props.history.push("/applications");
                  },
                },
              ],
            });
            return;
          }
        }
        else if (responseJson.statusDetails == "Session Expired") {
          confirmAlert({
            message: "Session Expired!",
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  this.props.history.push("/login");
                },
              },
            ],
          });
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
      })
      .catch((error) => {
        console.log(error);
      });
  };

  TemplateNameSelection = (event) => {
    let templateCodeAndName = event.target.value;
    let templateCode = templateCodeAndName.split("$")[0];
    let templateName = templateCodeAndName.split("$")[1];
    this.setState({ templateCode: templateCode, templateName: templateName });
    let startDate = document.getElementById("fromDateContainer").value;
    let endDate = document.getElementById("toDateContainer").value;
    let groupCode = this.state.FirstGroupAndCode.code;
    let groupName = this.state.FirstGroupAndCode.name;
    this.getInbocDocDetails(groupCode, "", startDate, endDate, templateCode, "");
  }


  searchKeyBasedFiltering = (event) => {
    let startDate = document.getElementById("fromDateContainer").value;
    let endDate = document.getElementById("toDateContainer").value;
    let groupCode = this.state.FirstGroupAndCode.code;
    let templateCode = this.state.templateCode;
    let searchValue = document.getElementById("searchValue").value;
    this.getInbocDocDetails(groupCode, "", startDate, endDate, templateCode, searchValue);
  }

  // getCustomFields API to fetch the customfield Inputs..
  customField = (e, docID) => {
    this.setState({
      loaded: false
    })
    var obj = {
      authToken: sessionStorage.getItem("authToken"),
      docID: docID.DOC_ID,
      templateCode: this.state.templateCode
    };
    fetch(URL.getCustomFields, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        if (responseData.status === "SUCCESS") {
          if (responseData.hasOwnProperty("customFields")) {
            this.setState({
              loaded: true,
              customFieldInputs: responseData.customFields
            })
            let custFildInpt = responseData.customFields;

            let custFildArrayToServer = [];
            for (let key in custFildInpt) {
              custFildArrayToServer.push(custFildInpt[key]);
            }
            this.setState({
              customDataToServer: custFildArrayToServer,
              allowModal: true
            })
          } else {
            this.setState({
              loaded: true
            })
            confirmAlert({
              message: responseData.statusDetails,
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {
                    e.preventDefault();
                  },
                },
              ],
            });
          }
        } else if (responseData.statusDetails === "Session Expired") {
          this.setState({
            loaded: true
          })
          confirmAlert({
            message: responseData.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  this.props.history.push("/login");
                },
              },
            ],
          });
        } else {
          this.setState({
            loaded: true
          })
          confirmAlert({
            message: responseData.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => { }
              },
            ],
          });
        }
      })
  }


  CollectInputsforDocument = (event) => {
    let customDataToServer = this.state.customDataToServer;
    for (let key in customDataToServer) {
      let value = "";
      let dataType = customDataToServer[key].inputType;
      var monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      // if (customDataToServer[key].isMandatory === 1) {
      if (dataType === "date") {
        let Datevalue = document.getElementById(customDataToServer[key].inputField).value;
        var editDate = new Date(Datevalue);
        value = editDate.getDate() + "-" + monthNames[editDate.getMonth()] + "-" + editDate.getFullYear();
      } else {
        value = document.getElementById(customDataToServer[key].inputField).value;
      }
      if (customDataToServer[key].customValidation !== "") {
        let customKey = customDataToServer[key].customValidation;
        if (value === "") {
          continue;
        }
        else {
          let result = UserDetailValidation(value + "", customKey);
          if (result === "invalidInput") {
            event.preventDefault();
            alert("Invalid date selection");
            document.getElementById(customDataToServer[key].inputField).focus();
            return;
          } else if (result === "ageProblem") {
            event.preventDefault();
            alert("age should be between 18 to 65!");
            document.getElementById(customDataToServer[key].inputField).focus();
            return;
          }
          if (!result) {
            event.preventDefault();
            alert(`Invalid inputs for the field ${customDataToServer[key].label}`);
            document.getElementById(customDataToServer[key].inputField).focus();
            return;
          }
        }
      }
      else {
        let min = "";
        let max = "";
        if (customDataToServer[key].inputType === "number") {
          min = customDataToServer[key].minRange;
          max = customDataToServer[key].maxRange;
          if (value !== "") {
            if (min === "" && max === "") {
              continue;
            } else {
              if (Number(value) < Number(min) || Number(value) > Number(max)) {
                event.preventDefault();
                alert(`Invalid inputs for the field ${customDataToServer[key].label}`);
                document.getElementById(customDataToServer[key].inputField).focus();
                return;
              }
              else {
                continue;
              }
            }
          } else {
            // if (customDataToServer[key].isMandatory === 0) {
            continue;
            // }
            // else {
            //   e.preventDefault();
            //   confirmAlert({
            //     message: `Please enter the field ${customDataToServer[key].lable}`,
            //     buttons: [
            //       {
            //         label: "OK",
            //         className: "confirmBtn",
            //         onClick: () => {
            //           document
            //             .getElementById(`${customDataToServer[key].inputField}1`)
            //             .focus();
            //         },
            //       },
            //     ],
            //   });
            //   setAllowLoader(true);
            //   return;
            // }
          }

        }
        if (customDataToServer[key].inputType === "date") {
          min = new Date(customDataToServer[key].minRange);
          max = new Date(customDataToServer[key].maxRange);
          value = new Date(document.getElementById(customDataToServer[key].inputField).value);
          if (value !== "") {
            if (value < min || value > max) {
              event.preventDefault();
              alert(`The field ${customDataToServer[key].label} should be with in range ${customDataToServer[key].minRange} to ${customDataToServer[key].maxRange} only!`);
              document.getElementById(customDataToServer[key].inputField).focus();
              return;
            }
            else {
              continue;
            }
          } else {
            event.preventDefault();
            // if (customDataToServer[key].isMandatory === 0) {
            continue;
            // }
            // else {
            //   confirmAlert({
            //     message: `Please enter the ${customDataToServer[key].lable}`,
            //     buttons: [
            //       {
            //         label: "OK",
            //         className: "confirmBtn",
            //         onClick: () => {
            //           document
            //             .getElementById(`${customDataToServer[key].inputField}1`)
            //             .focus();
            //         },
            //       },
            //     ],
            //   });
            //   setAllowLoader(true);
            //   return;
            // }
          }
        }
      }
      // }
      // else {
      //   continue;
      // }
    }
    let dataArrayToServer = [];
    for (let key in customDataToServer) {
      let valueForServer = "";
      if (customDataToServer[key].inputType === "date") {
        let Datevalue = document.getElementById(customDataToServer[key].inputField).value;
        var editDate = new Date(Datevalue);
        valueForServer = editDate.getDate() + "-" + monthNames[editDate.getMonth()] + "-" + editDate.getFullYear();
      } else {
        valueForServer = document.getElementById(customDataToServer[key].inputField).value;
      }
      dataArrayToServer.push({ [customDataToServer[key].inputField]: valueForServer });
    }


    this.setState({
      allowModal: false,
      loaded: false
    })

    var obj = {
      authToken: sessionStorage.getItem("authToken"),
      docID: this.state.rowData.DOC_ID,
      customFields: dataArrayToServer
    };
    fetch(URL.updateCustomFields, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        if (responseData.status === "SUCCESS") {
          this.setState({
            loaded: true
          })
          confirmAlert({
            message: responseData.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  event.preventDefault();
                },
              },
            ],
          });
        } else if (responseData.statusDetails === "Session Expired") {
          this.setState({
            loaded: true
          })
          confirmAlert({
            message: responseData.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  this.props.history.push("/login");
                }
              }
            ]
          });
        } else {
          this.setState({
            loaded: true
          })
          confirmAlert({
            message: responseData.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                }
              }
            ]
          });
        }
      })
  }

  render() {
    let commentsValue = this.state.signerListDetails;
    const { opensignersCommentsModal } = this.state;
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
        },
        render: (rowData) => {
          if (rowData.JOB_STATUS === "S") {
            return (
              <i
                class="fa fa-times"
                id="fafatimesid"
                style={{ fontSize: "25px", padding: "0px" }}
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
              onClick={(row) => this.viewStoredFile(rowData)}
              id="pdfIcon"
              title="PDF preview"
              class="fa fa-file-pdf-o fa-lg"
            ></i>
          );
        },
      },
      {
        title: "File Name",
        field: "DOC_NAME",
        cellStyle: {
          width: "40%",
          padding: "0px",
          paddingLeft: "-5%",
        },
        customFilterAndSearch: (term, rowData) =>
          rowData.DOC_NAME.toLowerCase().indexOf(term.toLowerCase()) > -1,

        render: (rowData) => {
          return (
            <span
              title="PDF preview"
              onClick={(row) => this.viewStoredFile(rowData)}
              id="doc_name_td"
            >
              {rowData.DOC_NAME}
              <br></br>
              <span style={{ color: "#8d8282" }}>
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
            stroagelimtvalue = "MB";
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
        //----------search field filter customization----------
        customFilterAndSearch: (term, rowData) =>
          (rowData.DOC_STATUS + "KB").indexOf(term) != -1,

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
          } else if (rowData.SELF_SIGN == 1) {
            return <span style={{ color: "green" }}>Self signed</span>;
          } else if (rowData.JOB_STATUS === "S") {
            return <span id="signingCancelledid">Signing cancelled</span>;
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
        // onClick: (event, rowData) => this.viewStoredFile(rowData),
        cellStyle: {
          paddingLeft: "0px",
          width: "18%",
        },
      },
      {
        title: "Matches",
        type: "string",
        cellStyle: {
          paddingLeft: "0px",
          width: "18%",
        },
        render: (rowData) => {
          if (rowData && rowData.SEARCH_FIELD && typeof rowData.SEARCH_FIELD === 'string') {
            if (rowData.SEARCH_FIELD.length > 13) {
              return (
                <span
                  title={rowData.SEARCH_FIELD}
                >
                  {rowData.SEARCH_FIELD.substring(0, 14)}...
                </span>
              );
            }
            else {
              return (
                <span
                  title={rowData.SEARCH_FIELD}
                >
                  {rowData.SEARCH_FIELD.substring(0, 14)}
                </span>
              );
            }

          } else {
            // Handle the case where SEARCH_FIELD is undefined or not a string
            return (
              <span id="doc_name_td"></span>
            );
          }
        },
      },

      // 

      // {
      //   title: "Search Key",
      //   field: "SEARCH_KEY",
      //   type: "string",
      //   // onClick: (event, rowData) => this.viewStoredFile(rowData),
      //   cellStyle: {
      //     paddingLeft: "0px",
      //     width: "18%",
      //   },
      // },
    ];
    const inboxData = this.state.inboxDataList;
    const { GroupNameAndCode } = this.state;
    const { TemplateBasedOnTempCode } = this.state;



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
        <div className="dateSerch01" >
          <div className="dateSerch02" ></div>
          <div className="dateSerch03" >
            <div style={{ paddingTop: "6px", marginRight: "10px" }}>From</div> <Input type="date" id="fromDateContainer" min='2020-01-01' onChange={(event) => this.getTemplateReports("fromDateContainer", event)} ></Input>
          </div>
          <div className="dateSerch03" >
            <div style={{ paddingTop: "6px", marginRight: "10px" }}>To</div><Input type="date" id="toDateContainer" min='2020-01-01' onChange={(event) => this.getTemplateReports("toDateContainer", event)} ></Input>
          </div>
          <div className="downLoadBtn04" >
            <Button block outline color="primary" className="px-4" onClick={(event => this.downLoadCsvFile(event))}  >Download as CSV</Button>
          </div>
        </div>
        {/* <table style={{ float: "right" }}>
            <tbody>
              <tr>
                <td>From</td>
                <td><Input type="date" id="fromDateContainer" min='2020-01-01' onChange={(event) => this.getTemplateReports("fromDateContainer", event)} ></Input></td>
                <td>To</td>
                <td><Input type="date" id="toDateContainer" min='2020-01-01' onChange={(event) => this.getTemplateReports("toDateContainer", event)} ></Input></td>
                <td><Button block outline color="primary" className="px-4" onClick={(event => this.downLoadCsvFile(event))}  >Download as CSV</Button></td>
              </tr>
            </tbody>
          </table> */}
        <br /><br /><br />
        <div className="searchTable">
          <div className="searchBodyCss">
            <div className="groupDiv" >
              <span>
                <b>Group: </b>
              </span>

              <select
                id="group"
                type="text"
                onChange={(e) => this.filter(e)}
              >
                {GroupNameAndCode.length ? (
                  GroupNameAndCode.map((posts, i) => (
                    <option key={posts.code} value={posts.code + "$" + posts.name}>
                      {posts.name}
                    </option>
                  ))
                ) : (
                  <>
                  </>
                )}
              </select>
            </div>
            <div className="templateNameDiv">
              <span >
                <b>Template Name: </b>
              </span>

              <select
                id="group"
                type="text"
                // align="center"
                onChange={(e) => this.TemplateNameSelection(e)}
              >
                {/* <option value="">Choose group</option> */}
                {TemplateBasedOnTempCode.length ? (
                  TemplateBasedOnTempCode.map((posts, i) => (
                    <option value={posts.code + "$" + posts.name}>
                      {posts.name}
                    </option>
                  ))
                ) : (
                  <>
                  </>
                )}
              </select>
            </div>

            <div className="searchDiv">
              <span id="searchField" style={{ paddingTop: "6px", width: "20%" }}>
                <b>Search For: </b>
              </span>
              <input type="text" name="name" id="searchValue" style={{ width: "65%", fontSize: "13px" }} /> &nbsp;
              <input type="button" color="lightblue" variant="info" value="Find" style={{ width: "15%", backgroundColor: "lightblue", fontSize: "13px" }} onClick={(e) => this.searchKeyBasedFiltering(e)} />
            </div>
            {/* </tr> */}
          </div>
        </div>
        <MaterialTable
          columns={columns}
          icons={tableIcons}
          data={inboxData}
          options={{
            search: true,
            // searchFieldVariant: "outlined",
            thirdSortClick: false, //------not to Allow unsorted state on third header click------------------
            detailPanelType: "single",
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
            {
              icon: () => <ArrowDownward style={{}} />,
              tooltip: "Download",
              onClick: (event, rowData) => this.fileDownload(rowData),
              isFreeAction: false,
              hidden: false,
            },
            // {
            //   icon: () => <Delete id="deleteIconColor" />,
            //   id: "deleteIcon",
            //   tooltip: "Delete",
            //   onClick: (event, rowData) => this.fileDelete(rowData),
            //   isFreeAction: false,
            //   hidden: false,

            //   cellStyle: {
            //     padding: "0px",
            //   },
            // },
            (rowData) => {
              return rowData.isSignEnable
                ? {
                  icon: () => <BorderColor style={{ color: "#150178" }} />,
                  tooltip: "Sign",
                  onClick: (event, rowData) => this.CheckSigningMode(rowData),
                  isFreeAction: false,
                  hidden: false,
                }
                : {
                  icon: BorderColor,
                  tooltip: "Sign",
                  onClick: (event, rowData) => this.CheckSigningMode(rowData),
                  // onClick: (event, rowData) => this.createFile(rowData),
                  isFreeAction: false,
                  hidden: true,
                };
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
          detailPanel={[
            {
              icon: MoreVert,
              openIcon: MoreHoriz,
              textAlign: "right",
              tooltip: "More Info",
              isFreeAction: false,
              render: (rowData) => {
                var unSigned = rowData.PENDING_LIST;
                var signed = rowData.SIGNED_LIST;
                var unSignedCount = 0;
                onclick = this.state.rowData = rowData;
                // stepprogressBar(rowData);

                if (
                  rowData.IS_OWNER == 0 &&
                  rowData.hasOwnProperty("PENDING_LIST") &&
                  rowData.hasOwnProperty("SIGNED_LIST")
                ) {
                  var unSignedList = unSigned.split(",");
                  unSignedCount = unSignedList.length;
                  return (
                    <div>
                      <div class="MultiSignBtn">
                        <div id="signerInfo">
                          <table>
                            <tr>
                              <td>Sender:{" " + rowData.DOC_OWNER}</td>
                            </tr>
                          </table>
                        </div>

                        <div id="moreOptions">
                          {" "}
                          <button
                            id="viewBtn"
                            className="btn btn-primary rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.viewStoredFile(this.state.rowData)
                            }
                          >
                            View
                          </button>
                          <button
                            id="viewBtn"
                            className="btn btn-warning rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.ExportTemplate(event, this.state.docId)
                            }
                          >
                            Export
                          </button>
                          <button
                            id="viewBtn"
                            className="btn btn-warning rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.customField(event, this.state.docId)
                            }
                          >
                            Custom Fields
                          </button>
                          {/* <button
                            className="btn btn-success rounded-pill"
                            id="emailNotification"
                            style={{ marginLeft: "10px" }}
                            onClick={(event) =>
                              this.emailNotification(this.state.rowData)
                            }
                          >
                            Email{" "}
                          </button> */}
                          {/* <button
                            className="btn btn-info rounded-pill"
                            id="commentsId"
                            style={{ marginLeft: "10px" }}
                            onClick={(event) =>
                              this.commentDetails(this.state.rowData)
                            }
                          >
                            Comments{" "}
                          </button> */}
                        </div>
                      </div>
                      <div style={{ backgroundColor: " #e4e5e6" }}>
                        {this.signersInfo(rowData.SIGNED_LIST, true)}
                      </div>
                      <div style={{ backgroundColor: " #e4e5e6" }}>
                        {this.signersInfo(rowData.PENDING_LIST, false)}
                      </div>
                    </div>
                  );
                } else if (
                  rowData.IS_OWNER == 0 &&
                  rowData.hasOwnProperty("PENDING_LIST")
                ) {
                  var unSignedList = unSigned.split(",");
                  unSignedCount = unSignedList.length;
                  return (
                    <div>
                      <div class="MultiSignBtn">
                        <div id="signerInfo">
                          <table>
                            <tr>
                              <td style={{ verticalAlign: "text-top" }}>
                                Sender:{" " + rowData.DOC_OWNER}
                              </td>
                            </tr>
                          </table>
                        </div>
                        <div id="moreOptions">
                          {" "}
                          <button
                            id="viewBtn"
                            className="btn btn-primary rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.viewStoredFile(this.state.rowData)
                            }
                          >
                            View
                          </button>
                          <button
                            id="viewBtn"
                            className="btn btn-warning rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.ExportTemplate(event, this.state.docId)
                            }
                          >
                            Export
                          </button>
                          <button
                            id="viewBtn"
                            className="btn btn-warning rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.customField(event, this.state.docId)
                            }
                          >
                            Custom Fields
                          </button>
                          {/* <button
                            className="btn btn-success rounded-pill"
                            id="emailNotification"
                            style={{ marginLeft: "10px" }}
                            onClick={(event) =>
                              this.emailNotification(this.state.rowData)
                            }
                          >
                            Email{" "}
                          </button> */}
                          {/* <button
                            className="btn btn-info rounded-pill"
                            id="commentsId"
                            style={{ marginLeft: "10px" }}
                            onClick={(event) =>
                              this.commentDetails(this.state.rowData)
                            }
                          >
                            Comments{" "}
                          </button> */}
                        </div>
                      </div>
                      <div style={{ backgroundColor: " #e4e5e6" }}>
                        {this.signersInfo(rowData.PENDING_LIST, false)}
                      </div>
                    </div>
                  );
                } else if (
                  rowData.IS_OWNER == 0 &&
                  rowData.hasOwnProperty("SIGNED_LIST")
                ) {
                  return (
                    <div>
                      <div class="MultiSignBtn">
                        <div id="signerInfo">
                          <table>
                            <tr>
                              <td>Sender:{" " + rowData.DOC_OWNER}</td>
                            </tr>
                          </table>
                        </div>
                        <div id="moreOptions">
                          {" "}
                          <button
                            id="viewBtn"
                            className="btn btn-primary rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.viewStoredFile(this.state.rowData)
                            }
                          >
                            View
                          </button>
                          <button
                            id="viewBtn"
                            className="btn btn-warning rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.ExportTemplate(event, this.state.docId)
                            }
                          >
                            Export
                          </button>
                          <button
                            id="viewBtn"
                            className="btn btn-warning rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.customField(event, this.state.docId)
                            }
                          >
                            Custom Fields
                          </button>
                          {/* <button
                            className="btn btn-success rounded-pill"
                            id="emailNotification"
                            style={{ marginLeft: "10px" }}
                            onClick={(event) =>
                              this.emailNotification(this.state.rowData)
                            }
                          >
                            Email{" "}
                          </button> */}
                          {/* <button
                            className="btn btn-info rounded-pill"
                            id="commentsId"
                            style={{ marginLeft: "10px" }}
                            onClick={(event) =>
                              this.commentDetails(this.state.rowData)
                            }
                          >
                            Comments{" "}
                          </button> */}
                        </div>
                      </div>
                      <div style={{ backgroundColor: " #e4e5e6" }}>
                        {this.signersInfo(rowData.SIGNED_LIST, true)}
                      </div>
                    </div>
                  );
                } else if (
                  rowData.IS_OWNER == 1 &&
                  rowData.hasOwnProperty("PENDING_LIST") &&
                  rowData.hasOwnProperty("SIGNED_LIST")
                ) {
                  return (
                    <div>
                      <div class="MultiSignBtn">
                        <div id="signerInfo">
                          <table>
                            <tr>
                              <td>
                                Sender:
                                {" " + rowData.DOC_OWNER}
                              </td>
                            </tr>
                          </table>
                        </div>
                        <div id="moreOptions">
                          {" "}
                          <button
                            id="viewBtn"
                            className="btn btn-primary rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.viewStoredFile(this.state.rowData)
                            }
                          >
                            View
                          </button>
                          <button
                            id="viewBtn"
                            className="btn btn-warning rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.ExportTemplate(event, this.state.rowData)
                            }
                          >
                            Export
                          </button>
                          <button
                            id="viewBtn"
                            className="btn btn-warning rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.customField(event, this.state.rowData)
                            }
                          >
                            Custom Fields
                          </button>
                          {/* <button
                            className="btn btn-success rounded-pill"
                            id="emailNotification"
                            style={{ marginLeft: "10px" }}
                            onClick={(event) =>
                              this.emailNotification(this.state.rowData)
                            }
                          >
                            Email{" "}
                          </button> */}
                          {/* <button
                            className="btn btn-info rounded-pill"
                            id="commentsId"
                            style={{ marginLeft: "10px" }}
                            onClick={(event) =>
                              this.commentDetails(this.state.rowData)
                            }
                          >
                            Comments{" "}
                          </button> */}
                          <button
                            className="btn btn-warning rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }}
                            id="sendReminderBtn"
                            onClick={(event) =>
                              this.sendReminder(this.state.rowData)
                            }
                          >
                            Send Reminder
                          </button>
                          <button
                            className="btn btn-danger rounded-pill"
                            id="cancelSigningInboxBtn"
                            onClick={(event) =>
                              this.cancelJob(this.state.rowData)
                            }
                          >
                            Cancel Signing
                          </button>
                        </div>
                      </div>
                      <div style={{ backgroundColor: " #e4e5e6" }}>
                        {this.signersInfo(rowData.SIGNED_LIST, true)}
                      </div>
                      <div style={{ backgroundColor: " #e4e5e6" }}>
                        {this.signersInfo(rowData.PENDING_LIST, false)}
                      </div>
                    </div>
                  );
                } else if (
                  rowData.IS_OWNER == 1 &&
                  rowData.hasOwnProperty("SIGNED_LIST")
                ) {
                  return (
                    <div>
                      <div class="MultiSignBtn">
                        <div id="signerInfo">
                          <table>
                            <tr>
                              <td>Sender:{" " + rowData.DOC_OWNER}</td>
                            </tr>
                          </table>
                        </div>
                        <div id="btnsDiv">
                          {" "}
                          <button
                            id="viewBtn"
                            className="btn btn-primary rounded-pill"
                            style={{ color: "white", marginLeft: "10px" }}
                            onClick={(event) =>
                              this.viewStoredFile(this.state.rowData)
                            }
                          >
                            View
                          </button>
                          <button
                            id="viewBtn"
                            className="btn btn-warning rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.ExportTemplate(event, this.state.rowData)
                            }
                          >
                            Export
                          </button>
                          <button
                            id="viewBtn"
                            className="btn btn-warning rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.customField(event, this.state.rowData)
                            }
                          >
                            Custom Fields
                          </button>
                          {/* <button
                            className="btn btn-success rounded-pill"
                            id="emailNotification"
                            style={{ marginLeft: "10px" }}
                            onClick={(event) =>
                              this.emailNotification(this.state.rowData)
                            }
                          >
                            Email{" "}
                          </button> */}
                          {/* <button
                            className="btn btn-info rounded-pill"
                            id="commentsId"
                            style={{ marginLeft: "10px" }}
                            onClick={(event) =>
                              this.commentDetails(this.state.rowData)
                            }
                          >
                            Comments{" "}
                          </button> */}
                        </div>
                      </div>
                      <div style={{ backgroundColor: " #e4e5e6" }}>
                        {this.signersInfo(rowData.SIGNED_LIST, true)}
                      </div>
                    </div>
                  );
                } else if (
                  rowData.IS_OWNER == 1 &&
                  rowData.hasOwnProperty("PENDING_LIST")
                ) {
                  var pendingList = rowData.PENDING_LIST.split(",");
                  var pendingListCount = pendingList.length;
                  return (
                    <div>
                      <div class="MultiSignBtn">
                        <div id="signerInfo">
                          <table>
                            <tr>
                              <td style={{ verticalAlign: "text-top" }}>
                                Sender:
                                {" " + rowData.DOC_OWNER}
                              </td>
                            </tr>
                          </table>
                        </div>
                        <div id="btnsDiv">
                          {" "}
                          <button
                            id="viewBtn"
                            className="btn btn-primary rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }}
                            onClick={(event) =>
                              this.viewStoredFile(this.state.rowData)
                            }
                          >
                            View
                          </button>
                          <button
                            id="viewBtn"
                            className="btn btn-warning rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.ExportTemplate(event, this.state.rowData)
                            }
                          >
                            Export
                          </button>
                          <button
                            id="viewBtn"
                            className="btn btn-warning rounded-pill"
                            style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                            onClick={(event) =>
                              this.customField(event, this.state.rowData)
                            }
                          >
                            Custom Fields
                          </button>
                          {/* <button
                            className="btn btn-success rounded-pill"
                            id="emailNotification"
                            style={{ marginLeft: "10px" }}
                            onClick={(event) =>
                              this.emailNotification(this.state.rowData)
                            }
                          >
                            Email{" "}
                          </button> */}
                          {/* <button
                            className="btn btn-info rounded-pill"
                            id="commentsId"
                            style={{ marginLeft: "10px" }}
                            onClick={(event) =>
                              this.commentDetails(this.state.rowData)
                            }
                          >
                            Comments{" "}
                          </button> */}
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
                            id="cancelSigningInboxBtn"
                            style={{ marginLeft: "10px" }}
                            onClick={(event) =>
                              this.cancelJob(this.state.rowData)
                            }
                          >
                            Cancel Signing
                          </button>
                        </div>
                      </div>
                      <div style={{ backgroundColor: " #e4e5e6" }}>
                        {this.signersInfo(rowData.PENDING_LIST, false)}
                      </div>
                    </div>
                  );
                } else if (rowData.DOC_STATUS == 3) {
                  return (
                    <div class="MultiSignBtn">
                      <div id="signerInfo">
                        <table>
                          <tr>
                            <td>
                              Sender:
                              {" " + rowData.DOC_OWNER}
                            </td>
                          </tr>
                          <tr>
                            <td>Status: Signing Cancelled </td>
                          </tr>
                        </table>
                      </div>

                      <div id="btnsDiv">
                        {" "}
                        <button
                          id="viewBtn"
                          className="btn btn-primary rounded-pill"
                          style={{ color: "white", marginLeft: "10px" }}
                          onClick={(event) =>
                            this.viewStoredFile(this.state.rowData)
                          }
                        >
                          View
                        </button>
                        <button
                          id="viewBtn"
                          className="btn btn-warning rounded-pill"
                          style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                          onClick={(event) =>
                            this.ExportTemplate(event, this.state.rowData)
                          }
                        >
                          Export
                        </button>
                        <button
                          id="viewBtn"
                          className="btn btn-warning rounded-pill"
                          style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                          onClick={(event) =>
                            this.customField(event, this.state.rowData)
                          }
                        >
                          Custom Fields
                        </button>
                        {/* <button
                          className="btn btn-success rounded-pill"
                          id="emailNotification"
                          style={{ marginLeft: "10px" }}
                          onClick={(event) =>
                            this.emailNotification(this.state.rowData)
                          }
                        >
                          Email{" "}
                        </button> */}
                        {/* <button
                          className="btn btn-info rounded-pill"
                          id="commentsId"
                          style={{ marginLeft: "10px" }}
                          onClick={(event) =>
                            this.commentDetails(this.state.rowData)
                          }
                        >
                          Comments{" "}
                        </button> */}
                      </div>
                    </div>
                  );
                } else if (rowData.DOC_STATUS == -1 && rowData.SELF_SIGN == 1) {
                  return (
                    <div class="MultiSignBtn">
                      <div id="signerInfo">
                        <table>
                          <tr>
                            <td>Owner:{" " + rowData.DOC_OWNER}</td>
                          </tr>
                          <tr>
                            <td>Status: Unsigned </td>
                          </tr>
                        </table>
                      </div>
                      <div id="btnsDiv">
                        {" "}
                        <button
                          id="viewBtn"
                          className="btn btn-primary rounded-pill"
                          style={{ color: "white", marginLeft: "10px" }}
                          onClick={(event) =>
                            this.viewStoredFile(this.state.rowData)
                          }
                        >
                          View
                        </button>
                        <button
                          id="viewBtn"
                          className="btn btn-warning rounded-pill"
                          style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                          onClick={(event) =>
                            this.ExportTemplate(event, this.state.rowData)
                          }
                        >
                          Export
                        </button>
                        <button
                          id="viewBtn"
                          className="btn btn-warning rounded-pill"
                          style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                          onClick={(event) =>
                            this.customField(event, this.state.rowData)
                          }
                        >
                          Custom Fields
                        </button>
                        {/* <button
                          className="btn btn-success rounded-pill"
                          id="emailNotification"
                          style={{ marginLeft: "10px" }}
                          onClick={(event) =>
                            this.emailNotification(this.state.rowData)
                          }
                        >
                          Email{" "}
                        </button> */}
                        {/* <button
                          className="btn btn-info rounded-pill"
                          id="commentsId"
                          style={{ marginLeft: "10px" }}
                          onClick={(event) =>
                            this.commentDetails(this.state.rowData)
                          }
                        >
                          Comments{" "}
                        </button> */}
                      </div>
                    </div>
                  );
                } else if (rowData.SELF_SIGN == 1) {
                  return (
                    <div class="MultiSignBtn">
                      <div id="signerInfo">
                        <table>
                          <tr>
                            <td>Signer: Self</td>
                          </tr>
                          <tr>
                            <td>Status: Self Signed </td>
                          </tr>
                        </table>
                      </div>

                      <div id="btnsDiv">
                        {" "}
                        <button
                          id="viewBtn"
                          className="btn btn-primary rounded-pill"
                          style={{ color: "white", marginLeft: "10px" }}
                          onClick={(event) =>
                            this.viewStoredFile(this.state.rowData)
                          }
                        >
                          View
                        </button>
                        <button
                          id="viewBtn"
                          className="btn btn-warning rounded-pill"
                          style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                          onClick={(event) =>
                            this.ExportTemplate(event, this.state.rowData)
                          }
                        >
                          Export
                        </button>
                        <button
                          id="viewBtn"
                          className="btn btn-warning rounded-pill"
                          style={{ color: "white", marginLeft: "2%" }} //spaing between buttons
                          onClick={(event) =>
                            this.customField(event, this.state.rowData)
                          }
                        >
                          Custom Fields
                        </button>
                        {/* <button
                          className="btn btn-success rounded-pill"
                          id="emailNotification"
                          style={{ marginLeft: "10px", marginRight: "10px" }}
                          onClick={(event) =>
                            this.emailNotification(this.state.rowData)
                          }
                        >
                          Email{" "}
                        </button> */}
                        {/* <button
                          className="btn btn-info rounded-pill"
                          id="commentsId"
                          style={{ marginLeft: "10px" }}
                          onClick={(event) =>
                            this.commentDetails(this.state.rowData)
                          }
                        >
                          Comments{" "}
                        </button> */}
                      </div>
                    </div>
                  );
                }
              },
            },
          ]}
        ></MaterialTable>
        <Row>
          <Col xs="12" sm="6" md="5">
            <Modal
              style={{ marginTop: "10%" }}
              className="modal-container"
              open={this.state.openEmailModal}
              onClose={this.onCloseEmailModal}
              center={true}
              closeOnOverlayClick={false}
            >
              <div className="modal-head-1">
                <span style={{ color: "#c79807" }}>Send By Email</span>
              </div>
              <div className="para-text" id="emailmodalpara-text">
                <div className="para-content">
                  <Row id="emailmodalrow">
                    <InputGroup className="mb-3">
                      <label id="toSigner">To: &nbsp;</label>
                      <Input
                        type="text"
                        id="eTo"
                        placeholder="abc@xxx.com, xyz@xxx.com"
                        title="Add To recipients, as suggested in the placeholder"
                        name="sendTo"
                        onChange={this.setInput}
                        required={true}
                        value={this.state.to}
                        autoComplete="off"
                      />
                      <button
                        id="unHide"
                        onClick={this.unHideCcField}
                        title="Add Cc recipients"
                      >
                        Cc
                      </button>
                      {/* <button id="unHide" onClick={this.unHideCcField} title="Add Bcc recipients">Bcc</button> */}
                    </InputGroup>
                    <InputGroup
                      className="mb-3"
                      id="unHideCc"
                      style={{ display: "none" }}
                    >
                      <label id="ccSigner">Cc: &nbsp;</label>
                      <Input
                        type="text"
                        id="eCc"
                        placeholder="abc@xxx.com, xyz@xxx.com"
                        title="Add Cc recipients, as suggested in the placeholder"
                        name="sendCc"
                        onChange={this.setInput}
                        required={true}
                        value={this.state.cc}
                        autoComplete="off"
                        display="none"
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <label id="subjectInfo" style={{ marginTop: "auto" }}>
                        Subject: &nbsp;
                      </label>
                      <Input
                        id="eSubject"
                        type="text"
                        placeholder="maximum 150 characters allowed"
                        title="maximum 150 characters allowed"
                        name="sendSubject"
                        onkeypress={this.setInput}
                        onChange={this.setInput}
                        onpaste={this.setInput}
                        required={true}
                        value={this.state.subject}
                        minLength={0}
                        maxLength={150}
                        autoComplete="off"
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <label id="bodyInfo">Body: &nbsp;</label>
                      <textarea
                        class="form-control"
                        id="eBody"
                        name="sendBody"
                        placeholder="maximum 400 characters allowed"
                        title="maximum 400 characters allowed"
                        rows="4"
                        onkeypress={this.setInput}
                        onChange={this.setInput}
                        onpaste={this.setInput}
                        value={this.state.ebody}
                        required={true}
                        minLength={0}
                        maxLength={400}
                        autoComplete="off"
                      ></textarea>
                    </InputGroup>
                    <InputGroup className="mb-3" style={{ marginLeft: "65px" }}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText
                          style={{ border: "none", backgroundColor: "unset" }}
                        >
                          <i
                            class="fa fa-paperclip"
                            aria-hidden="true"
                            style={{ fontSize: "large" }}
                          ></i>
                        </InputGroupText>
                        <Input
                          type="text"
                          class="form-control"
                          id="eAttachment"
                          name="attachment"
                          rows="4"
                          openEmailModal={true}
                          onChange={this.setInput}
                          readOnly={true}
                          value={this.state.attachment}
                          style={{
                            width: "575px",
                            height: "35px",
                            backgroundColor: "#e8eaeb",
                            borderRadius: "unset",
                          }}
                        // style={{ fontSize: "xxx-large", height: "35px"}}
                        />
                      </InputGroupAddon>
                    </InputGroup>
                    <div style={{ fontSize: "12px", marginLeft: "65px" }}>
                      Note: 1. 'To' should contain a minimum of 1 Email ID.
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2.
                      'To' and 'Cc' together can contain a maximum of 5 Email
                      IDs.
                    </div>
                  </Row>
                </div>
              </div>
              <div className="submit-details" id="submitBtn">
                <button
                  className="upload-button"
                  onClick={this.getEmailDetails}
                >
                  <span>SEND &#8594;</span>
                </button>
              </div>
            </Modal>

            <Modal
              className="modal-container"
              open={opensignersCommentsModal}
              onClose={this.onCloseSignersCommentsModal}
              center={true}
              closeOnOverlayClick={false}
            >
              <div className="modal-head-1">
                <span style={{ color: "#c79807" }}>
                  {this.state.CommentsHeading}
                </span>
              </div>
              <div className="para-text" id="opensignersCommentsModalpara-text">
                <div className="para-content">
                  <Row id="otpmodalrow">
                    <table
                      id="commentstable"
                      style={{
                        // display: "none",
                        width: "100%",
                        border: "1px solid black",
                      }}
                    >
                      <tbody style={{ fontSize: "13px" }}>
                        <tr
                          style={{
                            border: "1px solid black",
                          }}
                        >
                          <th style={{ borderBottom: "1px solid black" }}>
                            Singer
                          </th>{" "}
                          <th style={{ borderBottom: "1px solid black" }}>
                            Comments
                          </th>{" "}
                          <th style={{ borderBottom: "1px solid black" }}>
                            Commented On
                          </th>
                        </tr>
                        {commentsValue.map((items, idx) => (
                          <tr>
                            <td
                              style={{
                                width: "20%",
                                borderBottom: "1px solid black",
                              }}
                            >
                              {items.SingerName}
                            </td>
                            <td
                              style={{
                                width: "55%",
                                borderBottom: "1px solid black",
                              }}
                            >
                              {items.SingerComments}
                            </td>
                            <td
                              style={{
                                width: "25%",
                                borderBottom: "1px solid black",
                              }}
                            >
                              {items.CommentedOn}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div>
                      {/* <Button
                          id="addcommentsOkbutton"
                          style={{
                            float: "right",
                            // display: "none",
                          }}
                          color="primary"
                          onClick={this.onCloseSignersCommentsModal}
                        >
                          OK
                        </Button> */}
                    </div>
                  </Row>
                </div>
              </div>
            </Modal>
          </Col>
        </Row>
        <Modal className='inputTakingModel' onClose={this.closeTheModal} open={this.state.allowModal} center={true} closeOnOverlayClick={false}>
          <div className='WholeContent'>
            <div className='headingOfModalXcss'>
              <span style={{ fontSize: "20px" }}>Custom fields</span>
            </div>
            <form>
              {
                this.openModalForCustFieldDetail()
              }
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}
