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
import ReactDOM, { render } from "react-dom";
import { Button, Checkbox, Select } from 'antd';
import {
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
import $ from "jquery";
// import "jquery-ui-touch-punch";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
// import PDF1 from "../Download/PDF1";
import PDF from "../Download/PDF";
//import { indexOf } from "core-js/core/array";
var Loader = require("react-loader");
// var jsPDF = require("jspdf");

const { Option } = Select;
// const pdfjs = require("pdfjs-dist");
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.min.js`;
const pdfjsforOnDrag = require("pdfjs-dist");
pdfjsforOnDrag.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

export default class Inbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
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
      totalPagesNum: null,
      signInfo: "",
      signPage: "",
      pageList: [],
      fileUrl: "",
      shown: false,
      fileName: "",
      currentPageView: 1,
      pageDimensions: "",
      equalPageDimensions: true,
      totalServerCalls: 0,
      presentTotalPages: 0,
      rowsPerPage: 10,
      totalRecordsCount: 0, // Feeded to memory, currently not in use. (Holds the total records count to be recieved from server.)
      currentPage: 0,
      currentIndex: 0,
      bulkDocumentsForDelte: [],
      docStatus: [],
      selctedFilterSrchKey: null
    };
    this.customPlugin = this.customPlugin.bind(this);
    // Initialize component properties
    // this.pageNavigationPluginInstance = pageNavigationPlugin();
    // this.GoToNextPageButton = this.pageNavigationPluginInstance.GoToNextPageButton;
    // this.GoToPreviousPageButton = this.pageNavigationPluginInstance.GoToPreviousPageButton;
  }

  buttonStyle = {
    backgroundColor: '#4285F4', // Google Drive blue
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
  };
  componentDidMount() {
    if (this.props.location.search !== "") {
      const params = new URLSearchParams(this.props.location.search);
      this.setState({ loaded: false });
      let error = params.get('error');
      if (error !== null) {
        confirmAlert({
          message: 'Google Authorization failed!',
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
              onClick: () => {
                window.location.reload();
              },
            },
          ], closeOnClickOutside: false
        });
      } else {
        var body = {
          code: params.get('code'),
          scope: params.get('scope'),
          state: params.get('state')
        }
        fetch(URL.fetchAccessToken, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        })
          .then((response) => {
            return response.json();
          })
          .then((responseJson) => {
            if (responseJson.status === "SUCCESS") {
              window.close();
              this.setState({ loaded: true });
              confirmAlert({
                message: responseJson.statusDetails,
                buttons: [
                  {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                      window.location.href = window.location.origin + window.location.pathname;;
                    }
                  }
                ], onClickOutside: false
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
                    onClick: () => {
                      window.location.href = window.location.origin + window.location.pathname;;

                    },
                  },
                ], onClickOutside: false
              });
            }
          })
          .catch((e) => {
            this.setState({ loaded: true });
            confirmAlert({
              message: "Failed to upload the document! Please try after some time.",
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {
                    window.location.href = window.location.origin + window.location.pathname;;

                  },
                },
              ], onClickOutside: false
            });
          });
      }
    } else {
      this.getInboxDocDetails({}, true);
      // this.getEmailValidation();
      this.setState({ maxUploadFileSize: sessionStorage.getItem("maxFilesize") });
    }
  }

  onCloseSignersCommentsModal = () => {
    this.setState({ opensignersCommentsModal: false });
  };

  //------------------Getting the signer details from API----------------------
  signFromInboxForThirdPart(accesskey) {
    var body = {
      accessKey: accesskey,
    };
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");

    fetch(URL.mpsGetGuestAccessV2, {
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

        if (responseJson.status == "SUCCESS") {
          this.setState({
            loaded: true,
            signMode: responseJson.signMode,
            fileName: responseJson.fileName,
            // signCoordinates: JSON.parse(responseJson.signCoordinates),
            signCoordinates: responseJson.signCoordinates,
            ownerloginName: responseJson.ownername,
            docId: responseJson.docId,
            username: responseJson.loginname,
            firstName: responseJson.loginname,
            email: responseJson.email,
            userId: JSON.stringify(responseJson.userId),
            mobileNo: responseJson.mobileNo,
            senderName: responseJson.senderName,
            requestedTime: responseJson.requestedTime,
            authToken: responseJson.authToken,
          });
          sessionStorage.setItem("customDocName", responseJson.customDocName);

          if (responseJson.hasOwnProperty("signerListDetails")) {
            this.setState({
              signerListDetails: responseJson.signerListDetails,
            });
          }

          // sessionStorage.setItem("senderName", responseJson.senderName);
          // sessionStorage.setItem("requestedTime", responseJson.requestedTime);


          // sessionStorage.setItem("firstName", responseJson.loginname);
          // sessionStorage.setItem("email", responseJson.email);

          // sessionStorage.setItem("roleID", "3");

          sessionStorage.setItem("externalSigner", true);
          // sessionStorage.setItem("userId", JSON.stringify(responseJson.userId));
          // sessionStorage.setItem("docId", responseJson.docId);
          //sessionStorage.setItem("items", JSON.stringify(responseJson.menu));
          // sessionStorage.setItem("mobileNo", responseJson.mobileNo);
          // this.createFileforSigningasSender(responseJson.fileName);
          //changed for encryption
          this.createFileforSigningasSender(
            responseJson.fileName,
            responseJson.docId
          );
        } else {
          confirmAlert({
            message: responseJson.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  // this.props.history.push("/");
                },
              },
            ],
          });
          //alert(responseJson.statusDetails)
          this.setState({ loaded: true });
        }
      });
  }

  appendArrays = (array1, array2) => {
    return [...array1, ...array2];
  };

  //------------------Inbox Table API--------------
  getInboxDocDetails = (inBoxData, boolean) => {
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    // Below if condition is added, to holder the loader to load, for the pagination server calls,
    // The main intention is to, avoid alerting users, indicating the server call has been made.. 
    // To keep UI dynamic..
    if (boolean) {
      this.setState({ loaded: false });
    }
    fetch(URL.getInboxDocDetails, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jsonWebToken}`
      },
      body: JSON.stringify(inBoxData)
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          var inboxDetails = responseJson.data;
          let newArray = null;
          let currentIndex = 0;
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
          // Appending of arrays, is only allowed for pagination server calls,
          if (boolean) {
            newArray = inboxDetails;
            currentIndex = 0;
          } else {
            newArray = this.appendArrays(this.state.inboxDataList, inboxDetails);
            currentIndex = this.state.currentIndex;
          };
          // Calculate total records count..
          let totalPagesCount = Math.ceil(newArray.length / this.state.rowsPerPage);
          this.setState({
            inboxDataList: newArray,
            loaded: true,
            presentTotalPages: totalPagesCount,
            totalServerCalls: responseJson.totalServerCalls,
            totalRecordsCount: responseJson.totalRecordsCount,
            currentIndex: currentIndex,
            bulkDocumentsForDelte: []
          });
          this.getEmailValidation();
        } else {
          this.setState({ loaded: true });
          if (responseJson.statusDetails.includes("not a string")) {
            this.props.history.push("/home");
          }
          else if (responseJson.statusDetails === "Session Expired!!") {
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

  //Fetch call to get the coordinates when user selects Discard and sign again option
  getSignCoordinateDetails(data) {
    // console.log(data);
    //getting access for external signer
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    fetch(URL.getSignCoordinateDetails, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jsonWebToken}`
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        // console.log(responseJson);
        if (responseJson.status == "SUCCESS") {

          this.setState({
            loaded: true,
            signMode: responseJson.signMode,
            signInfo: responseJson.signInfo,
            signCoordinates: responseJson.signCoordinates,
            // signCoordinates: JSON.parse(responseJson.signCoordinates),
            signPage: responseJson.signPage,
            pageList: responseJson.pageList,
          });

          // this.createFile(responseJson.fileName);
          //changed for encryption
          // this.createFile(responseJson.docId);
          // this.createFile(responseJson.docId);
        } else {
          this.setState({ openOTPModal: false });
          confirmAlert({
            message: responseJson.statusDetails,
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
          //alert(responseJson.statusDetails)
          this.setState({ loaded: true });
        }
      });
  }

  //------------------Signing from inbox call(self signing or third party signing)------------------
  CheckSigningMode = (rowData) => {
    // console.log(rowData.DOC_ID);
    let dataToGetSignCoordinateDetails = {
      docId: rowData.DOC_ID,
    }
    if (rowData.hasOwnProperty("ACCESS_KEY")) {
      this.signFromInboxForThirdPart(rowData.ACCESS_KEY);
    } else {
      this.createFile(rowData);
      // console.log(dataToGetSignCoordinateDetails);
      this.getSignCoordinateDetails(dataToGetSignCoordinateDetails);
    }
  };


  async createFileforSigningasSender(filename, docID) {
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    let response = await fetch(
      URL.downloadStoredFileV2 +
      // "?at=" +
      // btoa(sessionStorage.getItem("authToken")) +
      "?docID=" +
      btoa(docID),
      {
        headers: {
          'Authorization': `Bearer ${jsonWebToken}`
        }
      }
    );
    // console.log(response);
    let data = await response.blob();
    let testResponse = await this.routetoPreviewPage(data);
  }

  //routing to preview page
  async routetoPreviewPage(data) {
    // console.log(data);
    let metadata = {
      type: "application/pdf",
    };
    var file1 = new File([data], this.state.fileName.split("@")[1], metadata);
    file1.preview = window.URL.createObjectURL(new File([data], this.state.fileName.split("@")[1], metadata));

    let numPages = null;
    // Initialize array to store page dimensions
    const pageDimensions = [];
    let equalPageDimensionsCheck = true;
    try {
      // Load PDF document using pdf.js
      const loadingTask = pdfjsforOnDrag.getDocument(file1.preview);
      const pdf = await loadingTask.promise;

      // Get number of pages in the PDF
      numPages = pdf.numPages;

      // Loop through each page to get its dimensions
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const { width, height } = page.getViewport({ scale: 1 });

        // Add page dimensions to the array
        pageDimensions.push({
          pageNumber: i,
          width,
          height
        });
      }

      // Output page dimensions
      // Iterate through the array and compare dimensions
      for (let i = 1; i < pageDimensions.length; i++) {
        if (pageDimensions.length != 1) {

          if (pageDimensions[i].width !== pageDimensions[0].width ||
            pageDimensions[i].height !== pageDimensions[0].height) {
            equalPageDimensionsCheck = false;
            this.setState({ equalPageDimensions: false });
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
    // console.log(this.state.signCoordinates);
    let data1 = {
      files: file1,
      sendername: this.state.senderName,
      requestedTime: this.state.requestedTime,
      externalSigner: true,
      signCoordinates: this.state.signCoordinates,
      signMode: this.state.signMode,
      height: this.state.signCoordinates.signCoordinates[0].signCoordinatesValues[0].totHeight,
      width: this.state.signCoordinates.signCoordinates[0].signCoordinatesValues[0].totWidth,
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
      totalPagesNum: numPages,
      pageDimensions: pageDimensions,
      equalPageDimensions: equalPageDimensionsCheck,
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

  readFileAsArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }
  dataViewToString(dataView) {
    let str = "";
    for (let i = 0; i < dataView.byteLength; i++) {
      str += String.fromCharCode(dataView.getUint8(i));
    }
    return str;
  }

  //-----------------Sign Draft File from inbox---
  //downloading PDF file
  async createFile(doc) {
    let rowData = doc;
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    let response = await fetch(
      URL.viewStoredFile +
      // "?at=" +
      // btoa(sessionStorage.getItem("authToken")) +
      "?docID=" +
      btoa(doc.DOC_ID),
      {
        headers: {
          'Authorization': `Bearer ${jsonWebToken}`
        }
      }
    );
    let data = await response.blob();
    let testResponse = await this.test(data, doc.DOC_NAME, doc.DOC_ID);
    //this.imageToPDF(data)
  }

  //routing to preview page
  async test(data, fileName, documentId) {
    let metadata = {
      type: "application/pdf",
    };
    // var file1 = new File([data], fileName.split("@")[1], metadata);
    // file1.preview = window.URL.createObjectURL(new File([data], this.state.fileName.split("@")[1], metadata));
    var file1 = new File([data], fileName.trim(), metadata); //------------file name construction-----------
    file1.preview = window.URL.createObjectURL(new File([data], fileName.trim(), metadata));

    let numPages = null;
    // Initialize array to store page dimensions
    const pageDimensions = [];
    try {
      // Load PDF document using pdf.js
      const loadingTask = pdfjsforOnDrag.getDocument(file1.preview);
      const pdf = await loadingTask.promise;

      // Get number of pages in the PDF
      numPages = pdf.numPages;


      // Loop through each page to get its dimensions
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const { width, height } = page.getViewport({ scale: 1 });

        // Add page dimensions to the array
        pageDimensions.push({
          pageNumber: i,
          width,
          height
        });
      }
      this.setState({ pageDimensions: pageDimensions });

      // Output page dimensions
      // Iterate through the array and compare dimensions
      for (let i = 1; i < pageDimensions.length; i++) {
        if (pageDimensions.length != 1) {

          if (pageDimensions[i].width !== pageDimensions[0].width ||
            pageDimensions[i].height !== pageDimensions[0].height) {
            this.setState({ equalPageDimensions: false });
            break;
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // let numPages=null;
    // try {
    //   const response = await fetch(file1.preview);
    //   const blob = await response.blob();
    //   const arrayBuffer = await this.readFileAsArrayBuffer(blob);
    //   const dataView = new DataView(arrayBuffer);
    //   const pdfString = this.dataViewToString(dataView);
    //   const regex = /\/Type\s*\/Page[^s]/g;
    //   const matches = pdfString.match(regex);
    //   numPages = matches ? matches.length : 0;
    // } catch (error) {
    //   console.error("Error:", error);
    // }
    this.onDrop(file1, documentId, numPages);
  }

  // onDrop(files, docId) {
  //   var file = files;
  //   var reader = new FileReader();
  //   reader.onloadend = function (e) {
  //     var data = reader.result;
  //     if (files.name.includes(".jpg") || files.name.includes(".png")) {
  //       //  this.imageToPDF(files);
  //     } else {
  //       var pdf = pdfjs
  //         .getDocument({ data: data })
  //         .then(
  //           function (a) {
  //             a.getPage(1).then(
  //               function (b) {
  //                 var viewport = b.getViewport({ scale: 1 });
  //                 let data1 = {
  //                   files: files,
  //                   docId: docId,
  //                   width: viewport.width, //-----------------hard coded width need to change (blocker for A3) -------------------
  //                   height: viewport.height, //-----------------hard coded height need to change (blocker for A3)-------------------
  //                 };

  //                 this.setState({ loaded: true });
  //                 this.props.history.push({
  //                   pathname: "/preview",
  //                   frompath: "inbox",
  //                   state: {
  //                     details: data1,
  //                   },
  //                 });
  //               }.bind(this)
  //             );
  //           }.bind(this)
  //         )
  //         .catch((e) => {});
  //     }
  //   }.bind(this);
  //   reader.readAsArrayBuffer(file);
  // }

  onDrop(files, docId, numPages) {
    var file1 = files;
    var reader = new FileReader();
    reader.onloadend = function (e) {
      var typedarray = reader.result;

      if (files.name.includes(".jpg") || files.name.includes(".png")) {
        //  this.imageToPDF(files);
      } else {
        // document.getElementById("img2pdfmsg").style.display = "none";
        //replaced the old function with the new api
        const loadingTask = pdfjsforOnDrag.getDocument(typedarray);
        loadingTask.promise.then(
          function (a) {
            a.getPage(1).then(
              function (b) {
                var viewport = b.getViewport({ scale: 1 });

                let signCoordinates = {
                  signCoordinates: this.state.signCoordinates,
                  signInfo: this.state.signInfo,
                  signMode: this.state.signMode,
                  signPage: this.state.signPage,
                  pageList: this.state.pageList
                }

                let data1 = {
                  files: files,
                  docId: docId,
                  signCoordinates: signCoordinates,
                  width: viewport.width, //-----------------hard coded width need to change (blocker for A3) -------------------
                  height: viewport.height, //-----------------hard coded height need to change (blocker for A3)-------------------
                  totalPagesNum: numPages,
                  pageDimensions: this.state.pageDimensions,
                  equalPageDimensions: this.state.equalPageDimensions,
                };

                this.setState({ loaded: true });
                this.props.history.push({
                  pathname: "/preview",
                  frompath: "inbox",
                  state: {
                    details: data1,
                  },
                });
              }.bind(this)
            );
          }.bind(this)
        )
          .catch((e) => { });
      }
    }.bind(this);
    reader.readAsArrayBuffer(file1);
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
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    fetch(URL.getEmailTemplateValidation, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jsonWebToken}`
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          var resData = responseJson.valdtnResp;
          this.setState({ emailValidation: resData, loaded: true });
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
          eSub: this.state.subject,
          eBody: this.state.ebody,
          docId: this.state.documentId,
          userIP: sessionStorage.getItem("userIP"),
        };
        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
        fetch(URL.sendEmail, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${jsonWebToken}`
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
  };

  //-----------------View File--------------------
  viewStoredFile = async (e) => {
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    try {
      let response = await fetch(
        URL.viewStoredFile + "?docID=" + btoa(e.DOC_ID),
        {
          headers: {
            'Authorization': 'Bearer ' + jsonWebToken
          }
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      let blob = await response.blob();
      let blobUrl = window.URL.createObjectURL(blob);

      this.setState({ fileUrl: blobUrl, fileName: e.DOC_NAME, shown: true });
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };


  // For hiding sidebar toggler when viewing document using modal
  hideSidebarToggler() {
    document.getElementsByClassName(
      "d-lg-none navbar-toggler"
    )[0].style.display = "";
    document.getElementsByClassName(
      "d-md-down-none navbar-toggler"
    )[0].style.display = "";
    this.setState({ shown: false });
  };

  // handlePageChange = (event) => {
  //   //Storing total number of pages in session----
  //   sessionStorage.setItem("TotalPages", event.doc._pdfInfo.numPages);
  //   //Initializing a state variable currentPage----
  //   if (this.state.shown) {
  //     this.setState({currentPageView: event.currentPage + 1});
  //   }
  // };

  onRenderAnnotations(e) {
    // Find all Link annotation
    e.annotations.forEach((annotation) => {
      if (annotation.annotationType === 2) { // 2 represents 'Link' type
        // Find the anchor element associated with the annotation
        const linkElement = e.container.querySelector(`[data-annotation-id="${annotation.id}"] a`);
        if (linkElement) {
          // // Set the target attribute to '_blank' to open in a new tab
          // linkElement.setAttribute('target', '_blank');
          // Remove the href attribute to disable the link
          linkElement.removeAttribute('href');
          // Optionally, you can also prevent the default behavior of the link
          linkElement.addEventListener('click', (event) => {
            event.preventDefault();
          });
        }
      }
    });
    // };

    return {
      onAnnotationLayerRender: this.onRenderAnnotations,
    };
  };

  customPlugin() {
    return {
      onAnnotationLayerRender: this.onRenderAnnotations,
    };
  };


  modalBody() {
    $(".d-lg-none.navbar-toggler").css("display", "none");
    $(".d-md-down-none.navbar-toggler").css("display", "none");
    return (
      <div
        style={{
          backgroundColor: "#fff",
          flexDirection: "column",
          overflow: "hidden",
          left: 0,
          position: "fixed",
          top: 0,
          height: "100%",
          width: "100%",
          marginTop: "55px",
          zIndex: 1019,
        }}
      >
        <div
          style={{
            alignItems: "center",
            backgroundColor: "#000",
            color: "#fff",
            display: "flex",
            padding: ".5rem",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "0 0 auto" }}>
            {this.state.fileName}
          </div>

          <button
            style={{
              backgroundColor: "#357edd",
              border: "none",
              borderRadius: "4px",
              color: "#ffffff",
              cursor: "pointer",
              padding: "8px",
              flex: "0 0 auto",
              marginTop: "5px",
            }}
            onClick={() => this.hideSidebarToggler()}
          >
            Back
          </button>
        </div>

        <div
          style={{
            overflow: "auto",
            // height: "calc(100% - 80px)",
            height: "472px",
          }}
        >
          <Viewer
            fileUrl={this.state.fileUrl}
            defaultScale={SpecialZoomLevel.PageWidth}
            plugins={[this.customPlugin()]}
          // onPageChange={this.handlePageChange}
          />
        </div>
      </div>
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
          <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>File Name: {data.DOC_NAME}</p>
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
              docId: data.DOC_ID,
              refNo: data.REF_NO,
              userId: data.USER_ID,
            };
            let jsonWebToken = sessionStorage.getItem("jsonWebToken");
            fetch(URL.cancelSigningJob, {
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
          <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>File Name: {data.DOC_NAME}</p>
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
              docId: data.DOC_ID,
              refNo: data.REF_NO,
              userId: data.USER_ID,
            };
            let jsonWebToken = sessionStorage.getItem("jsonWebToken");
            fetch(URL.sendReminder, {
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
          <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>File Name: {data.DOC_NAME}</p>
          <Row>
            <i className="fa fa-exclamation-triangle" id="warningIcon"></i>
            <p style={{ color: "red" }}>Document will be deleted permanently</p>
          </Row>
        </div>
      );
    } else {
      msg = (
        <div>
          <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>File Name: {data.DOC_NAME}</p>
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
              docIds: [data.DOC_ID],
              userIP: sessionStorage.getItem("userIP")
            };
            let jsonWebToken = sessionStorage.getItem("jsonWebToken");
            fetch(URL.deleteStoredFile, {
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

  fileDownload = async (data) => {
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    let DocId = data.DOC_ID;
    let url = URL.downloadStoredFileV2 + "?docID=" + btoa(DocId);

    try {
      let response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jsonWebToken}`
        }
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      let blob = await response.blob();
      let blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to download the file
      let a = document.createElement('a');
      a.href = blobUrl;
      a.download = data.DOC_NAME;
      document.body.appendChild(a);
      a.click();

      // Clean up and revoke the object URL
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading file:", error);
      // Optionally, handle error accordingly
    }
  };

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
              <ol className="steps" style={{ width: "30%", paddingTop: "7px" }}>
                <li className="step is-complete" data-step="1">
                  Mailed{" "}
                </li>
                <li className="step is-complete" data-step="2">
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
              <ol className="steps" style={{ width: "30%", paddingTop: "7px" }}>
                <li className="step is-active" data-step="1">
                  Mailed{" "}
                </li>
                <li className="step" data-step="2">
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
      docId: e.DOC_ID,
    };
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    fetch(URL.getSignerComments, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jsonWebToken}`
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

  uploadDocument(event, data) {
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    var body = {
      docID: btoa(data.DOC_ID)
    };
    fetch(URL.getOAuthEndPointURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jsonWebToken}`
      },
      body: JSON.stringify(body)

    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        this.setState({ loaded: false });
        if (responseJson.status === "SUCCESS") {
          window.location.href = responseJson.authURL;
        } else {
          this.setState({ loaded: true });
          if (responseJson.statusDetails === "Session Expired") {
            sessionStorage.clear();
            this.props.history.push("/login");
          } else {
            confirmAlert({
              message: responseJson.statusDetails,
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => { }
                }
              ]
            });
          }
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
  }

  // On change of page, the below method examinates if user has been to last page.
  // If yes a new call is made to the server, to fetch next set of records..
  onChangeOfPage(pageNumber) {
    // An alert to user, if he has selected a documents for bulk deletion, and moves to next page, an alert is throwen
    // To indicate the selected rows, will be unselected.
    if (this.state.bulkDocumentsForDelte.length !== 0) {
      confirmAlert({
        message: 'The selected documents for bulk deletion, has be unselected on moving to next page!',
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: e => {
              this.setState({
                bulkDocumentsForDelte: []
              })
            }
          }
        ], closeOnClickOutside: false
      });
    };
    if (this.state.presentTotalPages === (pageNumber + 1) && this.state.currentIndex < this.state.totalServerCalls && this.state.totalServerCalls !== 0) {
      // Make a fetch call..     
      let data = {
        indexNumber: (this.state.currentIndex + 1)
      };
      // If document filter search is selected, include filter key and make pagination server calls
      if (this.state.selctedFilterSrchKey !== null) {
        data['documentStatus'] = this.state.selctedFilterSrchKey;
      };
      this.getInboxDocDetails(data, false);
      this.setState({
        currentIndex: this.state.currentIndex + 1
      });
    };

  };

  // On change of number of rows per page, a new calculation is made and updated in there respective states..
  // Which will be helpfull to make furthur server calls for next set of records..
  onChangeRowsPerPage(rowSize) {
    this.setState({
      rowsPerPage: rowSize
    });
    // Calculate new total page count..
    let totalPagesCount = Math.ceil(this.state.inboxDataList.length / rowSize);
    this.setState({
      presentTotalPages: totalPagesCount
    });
  };

  // Method which will handle, on select of checkboxs.
  delteChckBoxSelected = (rowData, event) => {
    // Once the checkBoxs are selected/unSelected by user, the respective delete icon is disabled/enabled..
    if (event.target.checked) {
      // Hidding delete icon from UI..
      document.getElementById(`deleteDocumnt${rowData.DOC_ID}`).style.display = "none";
      // Storing selected documentIds in a state variable..
      this.state.bulkDocumentsForDelte.push(rowData.DOC_ID);
    } else {
      // For unchecking of checkbox, enabling the delete icon..
      document.getElementById(`deleteDocumnt${rowData.DOC_ID}`).style.display = "";
      // Removing of unchecked documentIDs..
      const updatedArray = this.state.bulkDocumentsForDelte.filter((item) => item !== rowData.DOC_ID);
      this.setState({
        bulkDocumentsForDelte: updatedArray,
      });
    }
  };

  // Method to delete selected documents..
  deleteSelctdDocuments = (event) => {
    // Check if state contains any document Ids for deletion..
    if (this.state.bulkDocumentsForDelte.length !== 0) {
      let messageForUser = `Total of ${this.state.bulkDocumentsForDelte.length} documents has been selected for deletion. Once documents are deleted, it cannot be restored!`;
      confirmAlert({
        title: "Confirm Delete",
        message: messageForUser,
        buttons: [
          {
            label: "Confirm",
            className: "confirmBtn",
            onClick: () => {
              var body = {
                docIds: this.state.bulkDocumentsForDelte,
                userIP: sessionStorage.getItem("userIP")
              };
              let jsonWebToken = sessionStorage.getItem("jsonWebToken");
              fetch(URL.deleteStoredFile, {
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
    } else {
      confirmAlert({
        message: 'Select the documents before performing bulk deletion.',
        buttons: [
          {
            label: "OK",
            className: "confirmBtn"
          },
        ], closeOnClickOutside: false
      });
    }
  };

  render() {
    let commentsValue = this.state.signerListDetails;
    const { opensignersCommentsModal } = this.state;
    const shown = this.state.shown;
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
          if (rowData.JOB_STATUS === "S" || rowData.JOB_STATUS === "DE") {
            return (
              <i
                className="fa fa-times"
                id="fafatimesid"
                style={{ fontSize: "25px", padding: "0px" }}
              ></i>
            );
          } else if (rowData.DOC_STATUS == -1) {
            return <i></i>;
          } else if (!rowData.hasOwnProperty("PENDING_LIST")) {
            return (
              <i
                className="fa fa-check"
                style={{ color: "green", fontSize: "25px", padding: "0px" }}
              ></i>
            );
          } else {
            return (
              <i
                className="fa fa-clock-o"
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
              className="fa fa-file-pdf-o fa-lg"
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
          var declined = "" + rowData.DECLINED_LIST + "";
          var signedCount = 0;
          var unSignedCount = 0;
          var declinedCount = 0;
          if (rowData.DOC_STATUS == -1 && rowData.SELF_SIGN == 1) {
            return <span style={{ color: "blue" }}>Unsigned</span>;
          } else if (rowData.SELF_SIGN == 1) {
            return <span style={{ color: "green" }}>Self signed</span>;
          } else if (rowData.JOB_STATUS === "S") {
            return <span id="signingCancelledid">Signing cancelled</span>;
          } else if (rowData.JOB_STATUS === "DE") {
            return <span id="signingdeclinedid">Signing Declined</span>;
          } else {
            if (rowData.hasOwnProperty("SIGNED_LIST")) {
              var signedList = signed.split(",");
              signedCount = signedList.length;
            }
            if (rowData.hasOwnProperty("PENDING_LIST")) {
              var unSignedList = unSigned.split(",");
              unSignedCount = unSignedList.length;
            }
            if (rowData.hasOwnProperty("DECLINED_LIST")) {
              var declinedList = declined.split(",");
              declinedCount = declinedList.length;
            }
            //Sign list completed
            if (unSignedCount == 0 && declinedCount == 0) {
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
              //contains signed, pending and declined signers
              if (signedCount > 0 && unSignedCount > 0 && declinedCount > 0) {
                tootltipMsg = `Signed: &#013;${signed.replaceAll(
                  ",",
                  "&#013"
                )} &#013;&#013;Pending: &#013;${unSigned.replaceAll(
                  ",",
                  "&#013"
                )}&#013;&#013;Declined: &#013;${declined.replaceAll(
                  ",",
                  "&#013"
                )}
                `;
                return (
                  <span style={{ color: "#da8302", title: { tootltipMsg } }}>
                    Signed({signedCount}), Pending({unSignedCount}),Declined({declinedCount})
                  </span>
                );
                //contains only pending signers
              } else if (signedCount == 0 && unSignedCount > 0 && declinedCount == 0) {
                tootltipMsg = `Pending: &#013;${unSigned.replaceAll(
                  ",",
                  "&#013"
                )}`;
                return (
                  <span style={{ color: "#da8302", title: { tootltipMsg } }}>
                    Pending({unSignedCount})
                  </span>
                );
              }//contains only declined signers
              else if (signedCount == 0 && unSignedCount == 0 && declinedCount > 0) {
                tootltipMsg = `Declined: &#013;${declined.replaceAll(
                  ",",
                  "&#013"
                )}`;
                return (
                  <span style={{ color: "#f86c6b", title: { tootltipMsg } }}>
                    Declined({declinedCount})
                  </span>
                );
              }//only signed and pending signers
              else if (signedCount > 0 && unSignedCount > 0 && declinedCount == 0) {
                tootltipMsg = `Signed: &#013;${signed.replaceAll(
                  ",",
                  "&#013"
                )} &#013;&#013;Pending: &#013;${unSigned.replaceAll(
                  ",",
                  "&#013"
                )}`;
                return (
                  <span style={{ color: "#da8302", title: { tootltipMsg } }}>
                    Signed({signedCount}), Pending({unSignedCount})
                  </span>
                );
              }//only signed and declined signers
              else if (signedCount > 0 && unSignedCount == 0 && declinedCount > 0) {
                tootltipMsg = `Signed: &#013;${signed.replaceAll(
                  ",",
                  "&#013"
                )} &#013;&#013;Declined: &#013;${declined.replaceAll(
                  ",",
                  "&#013"
                )}`;
                return (
                  <span style={{ color: "#da8302", title: { tootltipMsg } }}>
                    Signed({signedCount}), Declined({declinedCount})
                  </span>
                );
              }
              //only pending and declined signers
              else if (signedCount == 0 && unSignedCount > 0 && declinedCount > 0) {
                tootltipMsg = `Pending: &#013;${unSigned.replaceAll(
                  ",",
                  "&#013"
                )} &#013;&#013;Declined: &#013;${declined.replaceAll(
                  ",",
                  "&#013"
                )}`;
                return (
                  <span style={{ color: "#da8302", title: { tootltipMsg } }}>
                    Pending({unSignedCount}), Declined({declinedCount})
                  </span>
                );
              }

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
    ];
    const inboxData = this.state.inboxDataList;

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
        {this.state.loaded &&
          <React.Fragment>
            <div className="DelAndFltrOpt" >
              <div style={{ width: "80%" }}>
                <Select onChange={value => {
                  if (value !== null) {
                    this.getInboxDocDetails({ documentStatus: value }, true);
                  } else {
                    this.getInboxDocDetails({}, true);
                  }
                  this.setState({
                    selctedFilterSrchKey: value
                  });
                }} title="Document status based search" defaultValue={this.state.selctedFilterSrchKey === null ? 'Select Document Status' : this.state.selctedFilterSrchKey} style={{ width: "15%" }}>
                  <Option value={1}>Signed</Option>
                  <Option value={-1}>Unsigned</Option>
                  <Option value={0}>Pending</Option>
                  <Option value={5}>Cancelled</Option>
                  <Option value={null}>None</Option>
                </Select>
              </div>
              <div style={{ width: "20%" }}>
                <Button type="primary" danger style={{ marginBottom: "5px" }}
                  onClick={e => this.deleteSelctdDocuments(e)}>
                  Delete
                </Button>
              </div>
            </div>
            <MaterialTable
              columns={columns}
              icons={tableIcons}
              data={inboxData}
              onChangePage={page => this.onChangeOfPage(page)}
              onChangeRowsPerPage={rowSize => this.onChangeRowsPerPage(rowSize)}
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
                initialPage: this.state.currentPage
              }}
              actions={[
                {
                  icon: () => <ArrowDownward style={{}} />,
                  tooltip: "Download",
                  onClick: (event, rowData) => this.fileDownload(rowData),
                  isFreeAction: false,
                  hidden: false,
                },
                (rowData) => {
                  return {
                    icon: () => <Delete className="deleteIconColor" id={`deleteDocumnt${rowData.DOC_ID}`} />,
                    tooltip: "Delete",
                    onClick: (event, rowData) => this.fileDelete(rowData),
                    isFreeAction: false,
                    hidden: false,
                    cellStyle: {
                      padding: "0px"
                    }
                  }
                },
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
                (rowData) => {
                  return {
                    icon: () => <Checkbox />,
                    tooltip: "Select Row For Bulk Deletion.",
                    onClick: (e) => this.delteChckBoxSelected(rowData, e)
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
                    //If the inbox is not for owener
                    //has only declined
                    if (
                      rowData.IS_OWNER == 0 &&
                      (rowData.hasOwnProperty("DECLINED_LIST") &&
                        !((rowData.hasOwnProperty("PENDING_LIST") ||
                          rowData.hasOwnProperty("SIGNED_LIST")))
                      )) {
                      // var unSignedList = unSigned.split(",");
                      // unSignedCount = unSignedList.length;
                      return (
                        <div>
                          <div className="MultiSignBtn">
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
                              </button>
                            </div>
                          </div>
                          <div style={{ backgroundColor: " #f57e7d" }}>
                            {this.signersInfo(rowData.DECLINED_LIST, false)}
                          </div>
                        </div>
                      );
                    }
                    //has only pending
                    else if (
                      rowData.IS_OWNER == 0 &&
                      (rowData.hasOwnProperty("PENDING_LIST") &&
                        !(rowData.hasOwnProperty("DECLINED_LIST") ||
                          rowData.hasOwnProperty("SIGNED_LIST")))
                    ) {
                      // var unSignedList = unSigned.split(",");
                      // unSignedCount = unSignedList.length;
                      return (
                        <div>
                          <div className="MultiSignBtn">
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
                              </button>
                            </div>
                          </div>
                          <div style={{ backgroundColor: " #e4e5e6" }}>
                            {this.signersInfo(rowData.PENDING_LIST, false)}
                          </div>
                        </div>
                      );
                    }
                    //has only signed
                    else if (
                      rowData.IS_OWNER == 0 &&
                      (rowData.hasOwnProperty("SIGNED_LIST") &&
                        !(rowData.hasOwnProperty("PENDING_LIST") ||
                          rowData.hasOwnProperty("DECLINED_LIST")))
                    ) {
                      // var unSignedList = unSigned.split(",");
                      // unSignedCount = unSignedList.length;
                      return (
                        <div>
                          <div className="MultiSignBtn">
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
                              </button>
                            </div>
                          </div>
                          <div style={{ backgroundColor: " #e4e5e6" }}>
                            {this.signersInfo(rowData.SIGNED_LIST, true)}
                          </div>
                        </div>
                      );
                    }
                    //has  signed,declined and pending
                    else if (
                      rowData.IS_OWNER == 0 &&
                      rowData.hasOwnProperty("DECLINED_LIST") &&
                      rowData.hasOwnProperty("PENDING_LIST") &&
                      rowData.hasOwnProperty("SIGNED_LIST")
                    ) {
                      // var unSignedList = unSigned.split(",");
                      // unSignedCount = unSignedList.length;
                      return (
                        <div>
                          <div className="MultiSignBtn">
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
                              </button>
                            </div>
                          </div>
                          <div style={{ backgroundColor: " #e4e5e6" }}>
                            {this.signersInfo(rowData.SIGNED_LIST, true)}
                          </div>
                          <div style={{ backgroundColor: " #e4e5e6" }}>
                            {this.signersInfo(rowData.PENDING_LIST, false)}
                          </div>
                          <div style={{ backgroundColor: " #f57e7d" }}>
                            {this.signersInfo(rowData.DECLINED_LIST, false)}
                          </div>
                        </div>
                      );
                    }
                    //only pending and declined
                    else if (
                      rowData.IS_OWNER == 0 &&
                      (rowData.hasOwnProperty("PENDING_LIST") && rowData.hasOwnProperty("DECLINED_LIST") &&
                        !(rowData.hasOwnProperty("SIGNED_LIST")))

                    ) {

                      // var unSignedList = unSigned.split(",");
                      // unSignedCount = unSignedList.length;
                      return (
                        <div>
                          <div className="MultiSignBtn">
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
                              </button>
                            </div>
                          </div>

                          <div style={{ backgroundColor: " #e4e5e6" }}>
                            {this.signersInfo(rowData.PENDING_LIST, false)}
                          </div>
                          <div style={{ backgroundColor: " #f57e7d" }}>
                            {this.signersInfo(rowData.DECLINED_LIST, false)}
                          </div>
                        </div>
                      );
                    }
                    //has only pending and signed list
                    else if (
                      rowData.IS_OWNER == 0 &&
                      (rowData.hasOwnProperty("SIGNED_LIST") && rowData.hasOwnProperty("PENDING_LIST") &&
                        !(rowData.hasOwnProperty("DECLINED_LIST")))

                    ) {
                      return (
                        <div>
                          <div className="MultiSignBtn">
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
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
                    }
                    //has only signed and declined
                    else if (
                      rowData.IS_OWNER == 0 &&
                      (rowData.hasOwnProperty("SIGNED_LIST") && rowData.hasOwnProperty("DECLINED_LIST")) && !(rowData.hasOwnProperty("PENDING_LIST"))
                    ) {
                      return (
                        <div>
                          <div className="MultiSignBtn">
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
                              <span
                                title="Upload to google drive"
                                id="viewBtn"
                                style={{ color: "white", marginLeft: "4%" }} //spaing between buttons
                                onClick={event => this.uploadDocument(event, this.state.rowData)}
                              >
                                <img
                                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Google_Drive_logo.png/600px-Google_Drive_logo.png"
                                  alt="Google Drive Logo"
                                  style={{ width: '27px' }}
                                />
                              </span>
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
                              </button>
                            </div>
                          </div>
                          <div style={{ backgroundColor: " #e4e5e6" }}>
                            {this.signersInfo(rowData.SIGNED_LIST, true)}
                          </div>
                          <div style={{ backgroundColor: " #f57e7d" }}>
                            {this.signersInfo(rowData.DECLINED_LIST, false)}
                          </div>
                        </div>
                      );
                    }
                    //has only declined list and is owner
                    else if (
                      rowData.IS_OWNER == 1 &&
                      rowData.hasOwnProperty("DECLINED_LIST") && (!(
                        rowData.hasOwnProperty("PENDING_LIST") ||
                        rowData.hasOwnProperty("SIGNED_LIST")
                      ))
                    ) {
                      return (
                        <div>
                          <div className="MultiSignBtn">
                            <div id="signerInfo">
                              <table>
                                <tr>
                                  <td>
                                    Sender:
                                    {" " + rowData.DOC_OWNER}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Status: Signing Declined </td>
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
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
                          <div style={{ backgroundColor: " #f57e7d" }}>
                            {this.signersInfo(rowData.DECLINED_LIST, false)}
                          </div>
                        </div>
                      );
                    }// contains only signed list and pending list
                    else if (
                      rowData.IS_OWNER == 1 &&
                      (rowData.hasOwnProperty("PENDING_LIST") && rowData.hasOwnProperty("SIGNED_LIST")
                        && !(rowData.hasOwnProperty("DECLINED_LIST")))
                    ) {
                      return (
                        <div>
                          <div className="MultiSignBtn">
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
                              </button>
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
                    }
                    //contains all three list
                    else if (
                      rowData.IS_OWNER == 1 &&
                      rowData.hasOwnProperty("PENDING_LIST") &&
                      rowData.hasOwnProperty("SIGNED_LIST") &&
                      rowData.hasOwnProperty("DECLINED_LIST")
                    ) {
                      return (
                        <div>
                          <div className="MultiSignBtn">
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
                              </button>
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
                          <div style={{ backgroundColor: " #f57e7d" }}>
                            {this.signersInfo(rowData.DECLINED_LIST, false)}
                          </div>
                        </div>
                      );
                    } //contains only signed and declined list
                    else if (
                      rowData.IS_OWNER == 1 &&
                      (rowData.hasOwnProperty("SIGNED_LIST") && rowData.hasOwnProperty("DECLINED_LIST") &&
                        !(rowData.hasOwnProperty("PENDING_LIST")))
                    ) {
                      return (
                        <div>
                          <div className="MultiSignBtn">
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
                              </button>
                            </div>
                          </div>
                          <div style={{ backgroundColor: " #e4e5e6" }}>
                            {this.signersInfo(rowData.SIGNED_LIST, true)}
                          </div>
                          <div style={{ backgroundColor: " #f57e7d" }}>
                            {this.signersInfo(rowData.DECLINED_LIST, false)}
                          </div>
                        </div>
                      );
                    } //contains only signed list 
                    else if (
                      rowData.IS_OWNER == 1 &&
                      (rowData.hasOwnProperty("SIGNED_LIST") && !(rowData.hasOwnProperty("DECLINED_LIST") && rowData.hasOwnProperty("PENDING_LIST")))
                    ) {
                      return (
                        <div>
                          <div className="MultiSignBtn">
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
                              </button>
                            </div>
                          </div>
                          <div style={{ backgroundColor: " #e4e5e6" }}>
                            {this.signersInfo(rowData.SIGNED_LIST, true)}
                          </div>

                        </div>
                      );
                    }//contains only pending and declined list and the job status is declined
                    else if (
                      rowData.IS_OWNER == 1 && rowData.JOB_STATUS === "DE" &&
                      (rowData.hasOwnProperty("PENDING_LIST") && rowData.hasOwnProperty("DECLINED_LIST")
                        && !(rowData.hasOwnProperty("SIGNED_LIST")))
                    ) {
                      return (
                        <div>
                          <div className="MultiSignBtn">
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
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
                            {this.signersInfo(rowData.PENDING_LIST, false)}
                          </div>
                          <div style={{ backgroundColor: " #f57e7d" }}>
                            {this.signersInfo(rowData.DECLINED_LIST, false)}
                          </div>
                        </div>
                      );
                    }
                    //contains only pending and declined list
                    else if (
                      rowData.IS_OWNER == 1 &&
                      (rowData.hasOwnProperty("PENDING_LIST") && rowData.hasOwnProperty("DECLINED_LIST")
                        && !(rowData.hasOwnProperty("SIGNED_LIST")))
                    ) {
                      return (
                        <div>
                          <div className="MultiSignBtn">
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
                              </button>
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
                            {this.signersInfo(rowData.PENDING_LIST, false)}
                          </div>
                          <div style={{ backgroundColor: " #f57e7d" }}>
                            {this.signersInfo(rowData.DECLINED_LIST, false)}
                          </div>
                        </div>
                      );
                    }//only pending list
                    else if (
                      rowData.IS_OWNER == 1 &&
                      (rowData.hasOwnProperty("PENDING_LIST") && !(rowData.hasOwnProperty("DECLINED_LIST")
                        && rowData.hasOwnProperty("SIGNED_LIST")))
                    ) {
                      var pendingList = rowData.PENDING_LIST.split(",");
                      var pendingListCount = pendingList.length;
                      return (
                        <div>
                          <div className="MultiSignBtn">
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
                                className="btn btn-success rounded-pill"
                                id="emailNotification"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.emailNotification(this.state.rowData)
                                }
                              >
                                Email{" "}
                              </button>
                              <button
                                className="btn btn-info rounded-pill"
                                id="commentsId"
                                style={{ marginLeft: "10px" }}
                                onClick={(event) =>
                                  this.commentDetails(this.state.rowData)
                                }
                              >
                                Comments{" "}
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
                        <div className="MultiSignBtn">
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
                            <span
                              title="Upload to google drive"
                              id="viewBtn"
                              style={{ color: "white", marginLeft: "4%" }} //spaing between buttons
                              onClick={event => this.uploadDocument(event, this.state.rowData)}
                            >
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Google_Drive_logo.png/600px-Google_Drive_logo.png"
                                alt="Google Drive Logo"
                                style={{ width: '27px' }}
                              />
                            </span>
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
                              className="btn btn-success rounded-pill"
                              id="emailNotification"
                              style={{ marginLeft: "10px" }}
                              onClick={(event) =>
                                this.emailNotification(this.state.rowData)
                              }
                            >
                              Email{" "}
                            </button>
                            <button
                              className="btn btn-info rounded-pill"
                              id="commentsId"
                              style={{ marginLeft: "10px" }}
                              onClick={(event) =>
                                this.commentDetails(this.state.rowData)
                              }
                            >
                              Comments{" "}
                            </button>
                          </div>
                        </div>
                      );
                    } else if (rowData.DOC_STATUS == -1 && rowData.SELF_SIGN == 1) {
                      return (
                        <div className="MultiSignBtn">
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
                            <span
                              title="Upload to google drive"
                              id="viewBtn"
                              style={{ color: "white", marginLeft: "4%" }} //spaing between buttons
                              onClick={event => this.uploadDocument(event, this.state.rowData)}
                            >
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Google_Drive_logo.png/600px-Google_Drive_logo.png"
                                alt="Google Drive Logo"
                                style={{ width: '27px' }}
                              />
                            </span>
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
                              className="btn btn-success rounded-pill"
                              id="emailNotification"
                              style={{ marginLeft: "10px" }}
                              onClick={(event) =>
                                this.emailNotification(this.state.rowData)
                              }
                            >
                              Email{" "}
                            </button>
                            <button
                              className="btn btn-info rounded-pill"
                              id="commentsId"
                              style={{ marginLeft: "10px" }}
                              onClick={(event) =>
                                this.commentDetails(this.state.rowData)
                              }
                            >
                              Comments{" "}
                            </button>
                          </div>
                        </div>
                      );
                    } else if (rowData.SELF_SIGN == 1) {
                      return (
                        <div className="MultiSignBtn">
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
                            <span
                              title="Upload to google drive"
                              id="viewBtn"
                              style={{ color: "white", marginLeft: "4%" }} //spaing between buttons
                              onClick={event => this.uploadDocument(event, this.state.rowData)}
                            >
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Google_Drive_logo.png/600px-Google_Drive_logo.png"
                                alt="Google Drive Logo"
                                style={{ width: '27px' }}
                              />
                            </span>
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
                              className="btn btn-success rounded-pill"
                              id="emailNotification"
                              style={{ marginLeft: "10px", marginRight: "10px" }}
                              onClick={(event) =>
                                this.emailNotification(this.state.rowData)
                              }
                            >
                              Email{" "}
                            </button>
                            <button
                              className="btn btn-info rounded-pill"
                              id="commentsId"
                              style={{ marginLeft: "10px" }}
                              onClick={(event) =>
                                this.commentDetails(this.state.rowData)
                              }
                            >
                              Comments{" "}
                            </button>
                          </div>
                        </div>
                      );
                    }
                  },
                },
              ]}
            ></MaterialTable>
          </React.Fragment>
        }
        {shown && ReactDOM.createPortal(this.modalBody(), document.body)}
        <Col xs="12" sm="6" md="5">
          <Modal
            style={{ marginTop: "10%" }}
            className="modal-container"
            id="emailModalContainer"
            open={this.state.openEmailModal}
            onClose={this.onCloseEmailModal}
            center={true}
            closeOnOverlayClick={false}
          >
            <div className="modal-head-1" id="modalHeading">
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
                      className="form-control"
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
                  {/* <InputGroup className="mb-3" style={{ marginLeft: "65px" }}> */}
                  <InputGroup className="mb-3" >
                    <InputGroupAddon addonType="prepend" id="attachmentIcon">
                      <InputGroupText
                        style={{ border: "none", backgroundColor: "unset" }}
                      >
                        <i
                          className="fa fa-paperclip"
                          aria-hidden="true"
                          style={{ fontSize: "large" }}
                        ></i>
                      </InputGroupText>
                      <Input
                        type="text"
                        className="form-control"
                        id="eAttachment"
                        name="attachment"
                        rows="4"
                        openEmailModal={true}
                        onChange={this.setInput}
                        readOnly={true}
                        value={this.state.attachment}
                        style={{
                          // width: "575px",
                          width: "100%",      // Set width to 100%
                          // maxWidth: "600px",  // Add a max-width for larger screens
                          // minWidth: "254px",  // Add a min-width for smaller screens
                          height: "35px",
                          backgroundColor: "#e8eaeb",
                          borderRadius: "unset",
                        }}
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
              <span style={{ color: "#c79807" }}>{this.state.CommentsHeading}</span>
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
      </div>
    );
  }
}
