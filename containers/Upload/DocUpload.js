import React from "react";
import Dropzone from "react-dropzone";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import PDF1 from "../Download/PDF1";
import HandSign from "../HandSign/HandSign";
import "./upload.css";

var Loader = require("react-loader");
var jsPDF = require("jspdf");//For generating PDF's in Javascript

const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js`;
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.min.js`;

export default class DocUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "value",
      file: "",
      numPages: null,
      files: [],
      isdisable: true,
      isConsentdisable: true,
      username: "",
      width: null,
      height: null,
      TandC: "",
      loaded: true,
      openFirstModal: false,
      loadUploadComponent: false,
      uploadedFileName: "",
      uploadedFileSize: "",
      pageDimensions: "",
      equalPageDimensions: true,
    };
  }

  componentWillMount() {
    let username = sessionStorage.getItem("username");
    sessionStorage.removeItem("handSignImg");
    sessionStorage.setItem("ud", false);
    sessionStorage.removeItem("txnrefNo");
    sessionStorage.removeItem("signedStatus");
    sessionStorage.removeItem("fileName");
    sessionStorage.removeItem("canvas_width");
    sessionStorage.removeItem("canvas_height");

    this.setState({ username: username });
    if (sessionStorage.getItem("consenteSign") === "true") {
      if (sessionStorage.getItem("consentFlag") === "N") {
        // this.onOpenFirstModel();
      } else {
        this.setState({ loadUploadComponent: true });
      }
    } else {
      this.setState({ loadUploadComponent: true });
    }
    this.subscribedPlanDetails();
  }

  componentDidMount() {
    if (this.state.loadUploadComponent) {
      if (this.state.isdisable) {
        let element = document.getElementById("next-button");
        element.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
        element.style.cursor = "no-drop";
        let element1 = document.getElementById("create-job");
        element1.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
        element1.style.cursor = "no-drop";
      }
    } else {
      if (this.state.isConsentdisable) {
        let element = document.getElementById("submitConsentbutton");
        element.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
        element.style.cursor = "no-drop";
      }
    }
  }

  next() {
    let data = {
      files: this.state.files[0],
      height: this.state.height,
      width: this.state.width,
      pageDimensions: this.state.pageDimensions,
      equalPageDimensions: this.state.equalPageDimensions,
    };
    console.log(data);
    // sessionStorage.setItem("data", JSON.stringify(data));
    // var file2 = new File([""], "", { type: "application/pdf" });
    // var objectURL = URL.createObjectURL(file2);
    // console.log(objectURL);
    // console.log(sessionStorage.getItem("data"));
    // window.location = "/preview"
    // <Preview data="data"/>
    if (data.height != null && data.width != null) {
    this.props.history.push({
      pathname: "/preview",
      frompath: "dropdoc",
      state: {
        details: data,
      },
    });
    } else {
      alert("Error reading PDF file. Please upload file and try again.");
    }
  }

  imageToPDF(files) {
    if (files.length > 0) {
      this.setState({ loaded: true });
      var fileToLoad = files[0];
      // console.log(fileToLoad);
      var fileName = files[0].name;
      var name = fileName.split(".", 1);
      var srcData;
      var fileReader = new FileReader();
      fileReader.readAsDataURL(fileToLoad);
      fileReader.onload = function (fileLoadedEvent) {
        srcData = fileLoadedEvent.target.result; // <--- data: base64
        // console.log(srcData);
        let imgHeigth;
        let imgWidth;
        var pdfWidth = 793;
        var pdfHeight = 841;
        var pdfType = "p"; //p->potrate, l->landsacpe
        var image = new Image();
        //Set the Base64 string return from FileReader as source.
        image.src = srcData;
        //Validate the File Height and Width.
        image.onload = function () {
          imgHeigth = this.height;
          imgWidth = this.width;
          if (imgWidth > pdfWidth && imgHeigth < imgWidth) {
            pdfType = "l";
          }
          const pdf = new jsPDF(pdfType, "mm", "a4");
          var width = pdf.internal.pageSize.getWidth();
          var height = pdf.internal.pageSize.getHeight();
          if (imgWidth > pdfWidth && imgHeigth > pdfHeight) {
            pdf.addImage(srcData, "JPEG", 0, 0, width, height);
          } else if (imgWidth > pdfWidth && imgHeigth < pdfHeight) {
            pdf.addImage(srcData, "JPEG", 0, 0, width, imgHeigth / 2.83465);
          } else {
            pdf.addImage(srcData, "JPEG", 0, 0);
          }
          pdf.save(name[0] + ".pdf");
        };
      };

      let element = document.getElementById("next-button");
      element.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
      element.style.cursor = "no-drop";

      let element1 = document.getElementById("create-job");
      element1.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
      element1.style.cursor = "no-drop";
      this.setState({ isdisable: true });
      document.getElementById("img2pdfmsg").style.display = "";
    } else {
      confirmAlert({
        message: "Enter valid Image file.",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
      // alert("Enter valid Image file.")
    }
  }

  onDrop(files) {
    this.setState({ loaded: false });
    // if(sessionStorage.getItem('verifyMobile') === "Y"){
    // console.log(files);
    var file = files[0];
    // console.log(file);
    var filesize = files[0].size;
    var filesizeinKB = filesize / 1024;
    if (files.length > 0) {
      if ((filesizeinKB / 1024) < 25) {       
        if (files[0].name.length < 128) {
          var fileName = files[0].name;
          var name1 = fileName.split(".pdf");
          if (name1.length > 2) {
            confirmAlert({
              message: "Invalid File name ",
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {},
                },
              ],
            });
            return null;
          }

          this.setState({
            files: files,
            isdisable: false,
            uploadedFileName: fileName,
            uploadedFileSize: filesizeinKB.toFixed(2) + " KB",
          });

          var filesizeinKB = filesize / 1024 + 50;

          // if (filesizeinKB < sessionStorage.getItem("availableStorage")) {
          var reader = new FileReader();

          // reader.onload = function() {

          //   var typedarray = new Uint8Array(this.result);
          reader.onloadend = async function (e) {
            var typedarray = reader.result;
            console.log({typedarray});

            if (
              files[0].name.includes(".jpg") ||
              files[0].name.includes(".png")
            ) {
              this.imageToPDF(files);
            } else {
              document.getElementById("img2pdfmsg").style.display = "none";
            //replaced the old function with the new api
            const loadingTask = pdfjs.getDocument(typedarray);
            const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            const pageDimensions = [];
            for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
              const page = await pdf.getPage(pageNumber);
              const viewport = page.getViewport({ scale: 1 });

              pageDimensions.push({
                  pageNumber: pageNumber,
                  width: viewport.width,
                  height: viewport.height,
              });
          }
          this.setState({ pageDimensions: pageDimensions });

          // Iterate through the array and compare dimensions
          for (let i = 1; i < pageDimensions.length; i++) {
            if (pageDimensions.length != 1) {

              if (pageDimensions[i].width !== pageDimensions[0].width || 
                pageDimensions[i].height !== pageDimensions[0].height) {
                  this.setState({ equalPageDimensions: false});
                  break;
              }
            }
          }

                loadingTask.promise.then(
                  function(a) {a.getPage(1).then(
                                function (b) {
                                  var viewport = b.getViewport({ scale: 1 });
                                  if (viewport.height != null && viewport.width != null) {
                                  this.setState({ loaded: true });
                                  this.setState({
                                    width: viewport.width,
                                    height: viewport.height,
                                  });
                                } else {
                                  alert("Error reading PDF file. Please upload and try again.");
                                }
                                }.bind(this))
                                .catch(function (error) {
                                  // Handle errors while getting the page
                                  // console.error("Error getting PDF page:", error);
                                  // Display an error message and handle the case appropriately
                                  this.setState({ isdisable: true });
                                  let element = document.getElementById("next-button");
                                  element.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
                                  element.style.cursor = "no-drop";
                                  let element1 = document.getElementById("create-job");
                                  element1.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
                                  element1.style.cursor = "no-drop";
                                  alert("Error reading PDF file. Please verify and upload.");
                                }.bind(this));
                              }.bind(this))
                          .catch((e) => {
                            // Handle errors while loading the PDF
                            // console.error("Error loading PDF:", error);
                            // Display an error message and handle the case appropriately
                            this.setState({ isdisable: true });
                            let element = document.getElementById("next-button");
                            element.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
                            element.style.cursor = "no-drop";
                            let element1 = document.getElementById("create-job");
                            element1.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
                            element1.style.cursor = "no-drop";
                            alert("Error reading PDF file. Please verify and upload.");
                          });
                      }
                    }.bind(this);

          // this.setState({ loaded: true });
          console.log(file);
          reader.readAsArrayBuffer(file);

          if (this.state.isdisable === false) {
            let element = document.getElementById("next-button");
            element.style.backgroundColor = "#1DD1A1";
            element.style.cursor = "pointer";

            let element1 = document.getElementById("create-job");
            element1.style.backgroundColor = "#1DD1A1";
            element1.style.cursor = "pointer";
          }
        } else {
          confirmAlert({
            message: "File name cannot be more than 128 characters",
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {},
              },
            ],
          });
          //alert("File name cannot be more than 50 characters")
        }
      } else {
        confirmAlert({
          message: "Uploaded file can't exceed 25 MB",
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
              onClick: () => {
                this.setState({ loaded: true });
              },
            },
          ],
        });
      }
    } else {
      confirmAlert({
        message: "Please select PDF File only...",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
      // alert("Please select PDF File only...")
    }
    // }else{
    //   alert("Please Verify Mobile Number to ESign")
    //   this.props.history.push('/wallet')
    // }
  }

  logout() {
    let isAuthenticated = false;
    sessionStorage.setItem("isAuthenticated", isAuthenticated);
    this.props.history.push("./login");
  }

  isPdfSelected() {
    if (this.state.isdisable) {
      return (
        <div>
          <span className="drop-pdf">Drop PDF here </span>
          <i className="fa fa-file-pdf-o" style={{ color: "#cc0004" }}></i>
          <br />
          <span className="drop-pdf">OR</span>
          <br />
          <span className="drop-pdf">
            <input
              // type="button"
              className="btn btn rounded-pill"
              style={{
                width: "112px",
                fontSize: "inherit",
                backgroundColor: "gray",
                color: "white",
              }}
              defaultValue="Upload PDF"
            />
          </span>
        </div>
      );
    } else {
      document.getElementById("droppedFile").style.display = "";
      document.getElementById("droppedFileNameSize").style.display = "";
      return <span className="drop-pdf">{this.state.files[0].name}</span>;
    }
  }

  consenteSign = () => {
    let response_data = {};
    var body = {
      loginname: sessionStorage.getItem("username"),
      authToken: sessionStorage.getItem("authToken"),
      userIP: sessionStorage.getItem("userIP"),
      consentTnC: "consentTnC",
      docCode: "DOEXCONSENT",
    };
    this.setState({ loaded: false });
    fetch(URL.consenteSign, {
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
        response_data = responseJson;
        if (responseJson.status === "SUCCESS") {
          this.setState({ loaded: true });
          sessionStorage.setItem(
            "download_data",
            JSON.stringify(response_data)
          );
          //for different signing mode different response component
          //1-Aadhaar eSign, 2-electronic
          // if (this.state.selectedMode === "1")
          // this.props.history.push({
          //   pathname: '/esign',
          //   frompath: '/preview',
          //   state: {
          //     data: response_data
          //   }
          // })
          // }
          //  if (this.state.selectedMode === "2") {
          let data = {
            mode: this.state.selectedMode,
            docId: responseJson.docid,
          };
          sessionStorage.setItem("consentFlag", "Y");
          this.props.history.push({
            pathname: "/download/tokenSignDownload",
            frompath: "/preview",
            state: {
              details: data,
            },
          });
          // }
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
          //alert(responseJson.statusDetails)
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
  };

  clientInfoPage() {
    let data = {
      files: this.state.files[0],
      height: this.state.height,
      width: this.state.width,
      pageDimensions: this.state.pageDimensions,
      equalPageDimensions: this.state.equalPageDimensions,
    };
    // console.log(data);
    if (data.height != null && data.width != null) {
      this.props.history.push({
        pathname: "/signerInfo",
        frompath: "dropdoc",
        state: {
          details: data,
        },
      });
    } else {
      alert("Error reading PDF file. Please upload file and try again5.");
    }
  }

  //checking whether consent signing checkboc is enabled or not
  onConsentChecked = () => {
    var checkedbox = document.getElementById("consentSigningCheckbox");
    let element1 = document.getElementById("submitConsentbutton");

    if (checkedbox.checked) {
      this.setState({ isConsentdisable: false });
      element1.style.backgroundColor = "#1DD1A1";
      element1.style.cursor = "pointer";
    } else {
      this.setState({ isConsentdisable: true });
      element1.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
      element1.style.cursor = "no-drop";
    }
  };

  subscribedPlanDetails = () => {
    var body = {
      loginname: sessionStorage.getItem("username"),
      authToken: sessionStorage.getItem("authToken"),
      // "activeStatus":1,
    };
    fetch(URL.subscribedPlanDetails, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          this.setState({ loaded: true });
        } else {
          if (responseJson.statusDetails === "Session Expired!!") {
            sessionStorage.clear();
            this.props.history.push("/login");
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
      .catch((e) => {
        alert(e);
      });
  };

  render() {
    if (this.state.loadUploadComponent) {
      return (
        <div
          className="main-profile-container animated fadeIn"
          style={{ marginTop: "-20px" }}
        >
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

          {/* <div style={{ display: "none" }}>
            <canvas className="xx" id="textCanvas" height="60"></canvas>
            <img id="image" hidden={true} />
          </div>
          <div id="handSignContainer" style={{ display: "none" }}>
            <HandSign  data={"dxgfx"} />
          </div> */}

          <div style={{ marginTop:"40px", marginBottom:"-5px"}}>
            
            {/* <p>Make sure all the pages of the document are in same page layout.</p> */}
            <p> <b class="blink_me">Note: </b>Make sure all pages of the document are in either landscape or portrait orientation only.</p>
            {/* <p>Please upload a PDF document with all pages in either landscape or portrait orientation only.</p> */}
          </div>
          
          <div className="pdf-lg-container">
            <div className="pdf-container" id="pdf-container1">
              <section className="">
                <div className="dropzone">
                  <h5>Upload PDF file to Sign</h5>
                  <Dropzone
                    type="file"
                    accept={[".jpg", ".gif", ".png", ".pdf"]}
                    className="inner-content"
                    onDrop={this.onDrop.bind(this)}
                  >
                    <div className="text-container">{this.isPdfSelected()}</div>
                  </Dropzone>
                </div>
              </section>
            </div>
            <h5 id="img2pdfmsg" style={{ display: "none" }}>
              Verify and Upload converted Image to PDF for Signing.
            </h5>
            <div className="dropped-files">
              <aside>
                <h2
                  className="dropped-files-name"
                  id="droppedFile"
                  style={{ display: "none" }}
                >
                  Uploaded file
                </h2>
                <span id="droppedFileNameSize" style={{ display: "none" }}>
                  {this.state.uploadedFileName}-{this.state.uploadedFileSize}
                  {/* {this.state.files.map((f) => (
                    <span className="file-name-style" key={f.name}>
                      {f.name}- {f.size} bytes
                    </span>
                  ))} */}
                </span>
              </aside>
            </div>
            <div className="next-nav">
              <button
                className="upload-button"
                id="next-button"
                disabled={this.state.isdisable}
                onClick={this.next.bind(this)}
              >
                <span>Sign by me &#8594;</span>
              </button>
              <br></br>
            </div>
            <div className="next-nav">
              <button
                className="upload-button"
                id="create-job"
                disabled={this.state.isdisable}
                onClick={this.clientInfoPage.bind(this)}
              >
                <span>Send for signing &#8594;</span>
              </button>
            </div>
          </div>
        </div>
      );
    } else {
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
          <div id="pdfContainerdiv" style={{ height: "80vh" }}>
            {/* <div
              className="embedtag-container"
              id="viewaftersigning"
              style={{ height: "100%" }}
            > */}
              {/* <embed
                title="PDF preview"
                type="application/pdf"
                src={
                  URL.viewConsentFile +
                  "?at=" +
                  btoa(sessionStorage.getItem("authToken"))
                }
                width="100%"
                height="100%"
              /> */}
              {/* <br id="1" />
              <br id="2" /> */}
              <PDF1
                /* title="PDF preview"
                ref="iframe"
                type="application/pdf" */
                url={
                  URL.viewConsentFile +
                  "?at=" +
                  btoa(sessionStorage.getItem("authToken"))
                }
                /* width="100%"
                height="100%"
                hidden */
              />
              <div style={{marginTop: "20px"}}>
            <input
              type="checkbox"
              name="acceptance"
              id="consentSigningCheckbox"
              onChange={this.onConsentChecked}
            ></input>
            <label id="consentSigningLable" style={{ fontSize: "16px" }}>
              &nbsp; I agree with all the terms and conditions of DocuExec
            </label>
          </div>
            {/* </div> */}
          </div>
          {/* <br></br> */}
          {/* <div>
            <input
              type="checkbox"
              name="acceptance"
              id="consentSigningCheckbox"
              onChange={this.onConsentChecked}
            ></input>
            <label id="consentSigningLable" style={{ fontSize: "16px" }}>
              &nbsp; I agree with all the terms and conditions of DocuExec
            </label>
          </div> */}

          <div className="next-nav">
            <button
              className="upload-button"
              id="submitConsentbutton"
              disabled={this.state.isConsentdisable}
              onClick={this.consenteSign.bind(this)}
              style={{ margin: "auto" }}
            >
              <span>Submit &#8594;</span>
            </button>
          </div>
        </div>
      );
    }
  }
}
