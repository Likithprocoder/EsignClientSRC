import React, { Component } from "react";
import { memo } from "react";
import "./Template.css";
import { URL as URLConstant } from "../URLConstant";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { confirmAlert } from "react-confirm-alert";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
var Loader = require("react-loader");
var jsPDF = require("jspdf");
const pdfjsforOnDrag = require("pdfjs-dist");
pdfjsforOnDrag.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js`;
// const pdfjs = require("pdfjs-dist");
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.min.js`;

class DisplayPdf1 extends Component {
  dimensiom = {
    height: "560px",
    width: "100%",
    border: "none",
  };

  constructor(props) {
    super(props);

    this.state = {
      statusDetails: "",
      PDFFile: "",
      status: "",
      files1: "",
      fileUrl: "",
      height: "",
      width: "",
      allowToRotate: false,
      templateName: "",
      groupCode: "",
      subGroup: "",
      tempCode: "",
      modeOfSignature: "",
      temptDrftRefFromServer: "",
      pageDimensions: "",
      equalPageDimensions: true,
	    flag: "",
      encodeBatchNdSequence: "",
      fromPath: ""
    };
  }

  componentDidMount() {
    let templateData = {};
    let tempCode = "";
    let bodyData = "";

    // iterating and converting the JSON Object to the JSON Array..
    let reptBlockArry = [];
    let reptBlckArrayInputs = [];
    for (let key in this.props.location.state.repeatAbleBlck) {
      reptBlockArry.push({ [key]: this.props.location.state.repeatAbleBlck[key] });
    }
    // iterating and conbverting the JSON Object to the JSON Array..
    for (let key in this.props.location.state.reptBlckOfInputs) {
      reptBlckArrayInputs.push({ [key]: this.props.location.state.reptBlckOfInputs[key] });
    }
    // checking if the states which are passed are avilable..
    if (this.props.location.state.userDetails !== null) {
      templateData = this.props.location.state.userDetails;
      tempCode = this.props.location.state.templateCode;
      this.setState({
        templateName: this.props.location.state.templateName,
        modeOfSignature: this.props.location.state.modeOfSignature,
        flag: this.props.location.state.flag,
        fromPath: this.props.location.state.frompath
      });

    }
    // converting dynamic tables data to array format and storing on server side.
    let additionalData = {};
    let reptData = { "reptDataToSveDraft": this.props.location.state.reptDataToSveDraft, "repeatAbleBlock": this.props.location.state.repeatAbleBlck };
    additionalData["repeatAbleBolckData"] = JSON.stringify(reptData);
	let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    bodyData = {
      templateCode: tempCode,
      templateData: templateData,
      templateAttachments: this.props.location.state.templateAttachments,
      temptDrftRef: this.props.location.state.temptDrftRef,
      dynaTableDataForSaveDraft: additionalData,
      repeatAbleBlock: reptBlockArry,
      reptBlckOfInputs: reptBlckArrayInputs,
      templateName: this.props.location.state.templateName
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jsonWebToken}`
      },
      body: JSON.stringify(bodyData)
    };

    // fetching the base 64 string
    fetch(URLConstant.generatePDFfromTemplate, options)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "SUCCESS") {
          if (!(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))) {
            document.getElementById("parent-div").style.width = "100%";
            document.getElementById("parent-div").style.padding = "0 75px";
          }
          this.setState({
            statusDetails: data.statusDetails,
            PDFFile: data.PDFFile,
            status: data.status,
            groupCode: data.groupCode,
            subGroup: data.subGroup,
            tempCode: tempCode,
            temptDrftRefFromServer: data.draftRefNo
          });
          // method is called which will create the pdf and add to iframe..
          this.createPDF();
          this.setState({
            allowToRotate: true,
          });
        }
        else if (data.statusDetails === "failedInValidation") {
          let displayMessage = "";
          if (`${data.fieldLabel}`.includes("custom_")) {
            displayMessage = `${data.fieldLabel}`.substring(7, `${data.fieldLabel}`.length)
          } else {
            displayMessage = data.fieldLabel;
          }
          confirmAlert({
            message: `Invalid inputs for the field ${displayMessage}`,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  this.props.history.push({
                    pathname: "/template",
                    frompath: "/templatePdfPreview",
                    state: {
                      userDetails: this.props.location.state.userDetails,
                      templateCode: this.props.location.state.templateCode,
                      templateName: this.props.location.state.templateName,
                      templateAttachments: this.props.location.state.templateAttachments,
                      temptDrftRef: this.props.location.state.temptDrftRef,
                      toPathName: this.props.location.pathname,
                      reptDataToSveDraft: this.props.location.state.reptDataToSveDraft,
                      repeatAbleBlck: this.props.location.state.repeatAbleBlck,
                    }
                  });
                },
              },
            ],closeOnClickOutside: false
          });

        }
        else if (data.statusDetails === "Session Expired!!") {
          alert("Session Expired");
          this.props.history.push("/login");
        }
        else {
          this.setState({
            allowToRotate: true,
          });
        }
      })
      .catch((error) => {
        console.log("error -> " + error);
        this.setState({
          allowToRotate: true,
        });
      });
  }

  // convert base64 string back to original binary data..
  createPDF() {
    const base64String = this.state.PDFFile;
    // convert base64 string to original binary data..
    var data = atob(base64String);
    // storing indiviual bytes of binary data..
    const uint8Array = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      uint8Array[i] = data.charCodeAt(i);
    }
    const blob = new Blob([uint8Array], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    var file = new File([blob], `${this.state.templateName}.pdf`, {
      type: "application/pdf",
      lastModified: new Date(),
    });

    pdfjsforOnDrag.getDocument(url).promise.then(pdf => {
      let promises = [];

      // Fetch dimensions for each page
      for (let i = 1; i <= pdf.numPages; i++) {
        promises.push(pdf.getPage(i).then(page => {
          return {
            pageNumber: i,
            width: page.getViewport({ scale: 1 }).width,
            height: page.getViewport({ scale: 1 }).height
          };
        }));
      }

      // Resolve all promises
      return Promise.all(promises);
    }).then(pages => {
      // Store page dimensions in state or use as needed
      this.setState({
        pageDimensions: pages
      });

      // Iterate through the array and compare dimensions
      for (let i = 1; i < pages.length; i++) {
        if (pages.length != 1) {

          if (pages[i].width !== pages[0].width ||
            pages[i].height !== pages[0].height) {
            this.setState({ equalPageDimensions: false });
            break;
          }
        }
      }
    }).catch(error => {
      console.error("Error fetching PDF dimensions:", error);
    });

    //------------file name construction-----------
    file.preview = window.URL.createObjectURL(new File([blob], `${this.state.templateName}.pdf`, {
      type: "application/pdf",
      lastModified: new Date(),
    }));
    this.setState({
      files1: file,
    });
    this.setState({
      fileUrl: file.preview,
    })
    // document.getElementsByClassName("PDFDOC")[0].src = url + "#zoom=100";
  }

  pushToPriview = (height, width, docId) => {
    // this.onDrop(this.state.files1);
    // await delay(1000);
  
    // Ensure files1 is an array with a File object
    // const filesArray = [this.state.files1];
  
    // console.log(height);
    // console.log(width);
    // console.log(this.state.height);
    // console.log(this.state.width);
    let data = {
      files: this.state.files1,
      height: height,
      width: width,
      tempCode: this.state.tempCode,
      groupCode: this.state.groupCode,
      subGroup: this.state.subGroup,
      modeOfSignature: this.state.modeOfSignature,
      temptDrftRef: this.props.location.state.temptDrftRef,
      temptDrftRefFromServer: this.state.temptDrftRefFromServer,
      pageDimensions: this.state.pageDimensions,
      equalPageDimensions: this.state.equalPageDimensions,
      docId: docId
    };

    // console.log(data);

    // Navigation logic moved here
    if (data.height != null && data.width != null) {
      this.props.history.push({
        pathname: "/preview",
        frompath: "/templatePdfPreview",
        state: {
          details: data,
        },
      });
    } else {
      alert("Error reading PDF file. Please try again after sometime.");
    }
  };

  // used to get height and width of the pdf..
  onDrop = (docId) => {
    var file = this.state.files1;
    var reader = new FileReader();
    reader.onloadend = function (e) {
      var typedarray = reader.result;

      if (file.name.includes(".jpg") || file.name.includes(".png")) {
      } else {
        const loadingTask = pdfjsforOnDrag.getDocument(typedarray);
        loadingTask.promise
          .then(
            function (a) {
              a.getPage(1).then(
                function (b) {
                  var viewport = b.getViewport({ scale: 1 });
                  this.setState({ loaded: true });
                  this.setState({
                    height: viewport.height,
                    width: viewport.width,
                  });
                  this.pushToPriview(viewport.height, viewport.width, docId);
                }.bind(this)
              );
            }.bind(this)
          )
          .catch((e) => { });
      }
    }.bind(this);
    reader.readAsArrayBuffer(file);
  }

  next = () => {
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    var body = {
        loginname: sessionStorage.getItem("username"),
        userIP: sessionStorage.getItem("userIP"),
        docType: "PDF",
    };

    this.setState({ loaded: false });
    let data1 = new FormData();

    console.log(this.state.files1);
    data1.append("file", this.state.files1);
    data1.append("inputDetails", JSON.stringify(body));

    fetch(URLConstant.uploadDocument, {
        method: "POST",
        headers: { enctype: "multipart/form-data",
          'Authorization': `Bearer ${jsonWebToken}`
         },
        body: data1,
    })
    .then(response => response.json())
    .then(responseJson => {
        if (responseJson.status === "SUCCESS") {
            this.setState({ docId: responseJson.docID });
            this.onDrop(responseJson.docID);
            this.setState({ loaded: true });
        } else {
           if (responseJson.statusDetails === "Session Expired!!") {
            sessionStorage.clear();
            this.setState({ loaded: true });
            confirmAlert({
              message: responseJson.statusDetails,
              buttons: [
                  {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => {this.props.history.push("/login")},
                  },
              ],
            });
          } else {
            this.setState({ loaded: true });
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
        }
    })
    .catch(e => {
        this.setState({ loaded: true });
        alert(e);
    });
  }

  // push to old page with the data recieved..
  oldPage = () => {
    let state = {
      userDetails: this.props.location.state.userDetails,
      templateCode: this.props.location.state.templateCode,
      templateName: this.props.location.state.templateName,
      templateAttachments: this.props.location.state.templateAttachments,
      temptDrftRef: this.props.location.state.temptDrftRef,
      toPathName: this.props.location.pathname,
      repeatAbleBlck: this.props.location.state.repeatAbleBlck,
      reptDataToSveDraft: this.props.location.state.reptDataToSveDraft,
    };
    if (!this.props.location.state.flag) {
      state.encodeBatchNdSequence = this.state.encodeBatchNdSequence;
    }

    this.props.history.push({
      pathname: "/template",
      frompath: "/templatePdfPreview",
      state: state,
    });
  };

  render() {
    let fileUrl = this.state.fileUrl;
    return (
      <>
        <Loader
          loaded={this.state.allowToRotate}
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
        {/* <div style={{ display: "flex", flexDirection: "column",}}> */}
        <div className="proceedback">
          {/* <div> */}
          <button
            style={{ marginRight: "10px" }}
            type="button"
            onClick={(e) => this.oldPage()}
            className=" btn btn-warning rounded-pill btn btn-secondary "
          >
            Edit Form Details
          </button>
          {/* </div> */}

          {/* <div className="proceedCssv"> */}
          <button
            type="button"
            onClick={(e) => this.next()}
            className=" btn btn-success rounded-pill btn btn-secondary "
          >
            Proceed With Signing
          </button>
        </div>

        <div className="parent-div" id="parent-div">
          <div
            className="rpv-core__viewer"
            style={{
              display: 'flex',
              height: '100%',
            }}
          >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js">
              {fileUrl && <Viewer fileUrl={fileUrl}
                defaultScale={SpecialZoomLevel.PageWidth}
              />}
            </Worker>
          </div>
        </div>
      </>
    );
  }
}

export default memo(DisplayPdf1);
