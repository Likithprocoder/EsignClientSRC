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

    bodyData = {
      authToken: sessionStorage.getItem("authToken"),
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
        "Content-Type": "application/json"
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

  pushToPriview = async () => {
    this.onDrop(this.state.files1);
    await delay(1000);
    let data = {
      files: this.state.files1,
      height: this.state.height,
      width: this.state.width,
      tempCode: this.state.tempCode,
      groupCode: this.state.groupCode,
      subGroup: this.state.subGroup,
      modeOfSignature: this.state.modeOfSignature,
      temptDrftRef: this.props.location.state.temptDrftRef,
      temptDrftRefFromServer: this.state.temptDrftRefFromServer,
      pageDimensions: this.state.pageDimensions,
      equalPageDimensions: this.state.equalPageDimensions,
    };
    this.props.history.push({
      pathname: "/preview",
      frompath: "/templatePdfPreview",
      state: {
        details: data,
      },
    });
  };

  // used to get height and width of the pdf..
  onDrop(files) {
    var file = files;
    var reader = new FileReader();
    reader.onloadend = function (e) {
      var typedarray = reader.result;

      if (files.name.includes(".jpg") || files.name.includes(".png")) {
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
                }.bind(this)
              );
            }.bind(this)
          )
          .catch((e) => { });
      }
    }.bind(this);
    reader.readAsArrayBuffer(file);
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
            onClick={(e) => this.pushToPriview()}
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
