import React from "react";
import { URL } from "../URLConstant";
import {
  Input,
  InputGroup,
  Button,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import Modal from "react-responsive-modal";
import "./TokenSignDownload.css";
import PDF from "./PDF";
import PDF1 from "./PDF1";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";

var jsPDF = require("jspdf");//For generating PDF's in Javascript

const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js`;

// import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';

export default class TokenSignDownload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: "value",
      openFirstModal: false,
      email: "",
      loginname: "",
      username: "",
      password: "",
      repassword: "",
      moble: "",
      alertMsg: "",
      msg: "The signed document can be downloaded from this page, or from the Inbox later.",
      mode: "2",
      Msg: "Electronic Signing Sucessfull",
      pdfurl: "",
      docId: "",
      viewFileURl: "",
      txnrefNo: "",
      fileName: "",
      actualFileName: "",
      url: "",
      height: null,
      width: null,
      draftRefNumber: "",
      signCoordinates: "",
      signInfo: "",
      signMode: "",
      signPage: "",
      pageList: [],
      pageDimensions: "",
      equalPageDimensions: true,
    };
  }
  componentWillMount() {
    // console.log(this.props);
    console.log(this.props.location.frompath);
    // if (this.props.location.frompath !== "" && this.props.location.frompath !== "/preview" && this.props.location.frompath !== "/docUpload" && this.props.location.frompath !== "/payments/esignTopup" && this.props.location.frompath !== "/payments/subscriptions") {
    if (this.props.location.frompath !== "" && this.props.location.frompath !== "/preview") {
      this.props.history.push({ pathname: "/accountInfo" });
    }
    this.setState({
      mode: this.props.location.state.details.mode,
      fileName: this.props.location.state.details.filename,
      docId: this.props.location.state.details.docId,
      txnrefNo: this.props.location.state.details.txnrefNo,
      height: this.props.location.state.details.canvas_height,
      width: this.props.location.state.details.canvas_width,
      draftRefNumber: sessionStorage.getItem("draftRefNumber")
    });
    sessionStorage.removeItem("draftRefNumber");
    if (this.props.location.state.details.mode === "3") {
      this.setState({ Msg: "DSC Token Signing Successful" });
    }
    if (this.props.location.state.details.mode === "4") {
      this.setState({ Msg: "OTP Signing Successful" });
    }
    // sessionStorage.removeItem("handSignImg")
  }

  componentDidMount() {
    // if (this.state.mode === "3") {
    //     this.setState({ Msg: "DSC Token Signing Successful" })
    // }
    toast.success(this.state.Msg, { autoClose: 1000 });
    // toast.success(this.state.Msg);

    if (
      sessionStorage.getItem("externalSigner") != null &&
      sessionStorage.getItem("externalSigner") === "true"
    ) {
      if (sessionStorage.getItem("userId") === "0") {
        var username = sessionStorage.getItem("username");
        var email = sessionStorage.getItem("email");
        this.setState({
          username: username,
          docId: sessionStorage.getItem("docId"),
          email: email,
          msg: "",
          // msg: "The digitally signed document can be downloaded from this page, or enable the checkbox to register and preserve this document in your inbox.",
        });
        // document.getElementById("externalSignerRegCkBx").style.display = "";
      }
    }

    if (sessionStorage.getItem("externalSigner") === "false") {
      this.setState({ viewFileURl: URL.viewSignedFile, msg: "" });
      document.getElementById("discardOptionsdiv").style.display = "";
    } else {
      this.setState({ viewFileURl: URL.viewStoredFile });
    }
  }

  setInput = (e) => {
    let regName = new RegExp(/^[A-Za-z0-9_ ]*$/);
    let loginName = new RegExp(/^[a-zA-Z0-9]*$/);
    let regPassword = new RegExp(/^[A-Za-z0-9!.@#\$%\^&_ ]*$/);
    let regNum = new RegExp(/^[0-9]*$/);
    let value = e.target.value;
    let name = e.target.name;
    if (name === "username") {
      if (regName.test(e.target.value)) {
        this.setState({ username: value });
      } else {
        return false;
      }
    }
    if (name === "loginname") {
      if (loginName.test(e.target.value)) {
        this.setState({ loginname: value });
      } else {
        return false;
      }
    }
    if (name === "password") {
      if (regPassword.test(e.target.value)) {
        this.setState({ password: value });
      } else {
        return false;
      }
    }
    if (name === "repassword") {
      if (regPassword.test(e.target.value)) {
        this.setState({ repassword: value });
      } else {
        return false;
      }
    }
    if (name === "mobile") {
      if (regNum.test(e.target.value)) {
        this.setState({ moble: value });
      } else {
        return false;
      }
    }
  };

  onCloseFirstModal = () => {
    this.setState({ openFirstModal: false });
  };

  handelChange = (e) => {
    if (e.target.checked) {
      this.setState({ openFirstModal: true });
    }
  };

  passwordoverPass = (obj) => {
    var obj = document.getElementById("myPassword");
    obj.type = "text";
  };
  passwordoutPass = (obj) => {
    var obj = document.getElementById("myPassword");
    obj.type = "password";
  };

  mouseoverPass = (obj) => {
    var obj = document.getElementById("repassword");
    obj.type = "text";
  };
  mouseoutPass = (obj) => {
    var obj = document.getElementById("repassword");
    obj.type = "password";
  };

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  register = () => {
    let response_data = {};
    let regEmail = new RegExp(/[\w-]+@([\w-]+\.)+[\w-]+/);
    let passwordLetters = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
    );
    if (this.state.username.length !== 0 && this.state.username.trim() !== "") {
      if (
        this.state.loginname.length !== 0 &&
        this.state.loginname.trim() !== ""
      ) {
        if (
          this.state.password.length !== 0 &&
          this.state.password.trim() !== ""
        ) {
          if (
            this.state.repassword.length !== 0 &&
            this.state.repassword.trim() !== ""
          ) {
            if (this.state.password === this.state.repassword) {
              if (
                this.state.moble.length !== 0 &&
                this.state.moble.length == 10 &&
                this.state.moble.trim() !== ""
              ) {
                if (passwordLetters.test(this.state.password)) {
                  let json = {
                    loginname: btoa(this.state.loginname),
                    username: btoa(this.state.username),
                    email: btoa(this.state.email),
                    password: btoa(this.state.password),
                    mobile: btoa(this.state.moble),
                    userIP: sessionStorage.getItem("userIP"),
                    externalSigner: true,
                    docId: sessionStorage.getItem("docId"),
                  };
                  this.setState({ docId: sessionStorage.getItem("docId") });
                  this.setState({ loaded: false });
                  fetch(URL.register, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(json),
                  })
                    .then((response) => {
                      return response.json();
                    })
                    .then((responseJson) => {
                      response_data = responseJson;
                      if (responseJson.status === "SUCCESS") {
                        this.setState({ loaded: true });
                        alert(responseJson.statusDetails);
                        this.onCloseFirstModal();
                        document.getElementById(
                          "externalSignerRegCkBx"
                        ).style.display = "none";
                        sessionStorage.setItem("userId", "");
                      } else {
                        this.setState({ loaded: true });
                        alert(responseJson.statusDetails);
                      }
                    })
                    .catch((e) => {
                      this.setState({ loaded: true });
                      // notify.show(e, "custom", 5000, myColor);
                      alert(e);
                    });
                } else {
                  document.getElementById("alertmsg").style.display = "";
                  this.setState({
                    alertMsg:
                      "Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special character",
                  });
                  setTimeout(this.continueExecution, 5000);
                }
              } else {
                document.getElementById("alertmsg").style.display = "";
                this.setState({
                  alertMsg: "Please enter valid mobile number!",
                });
                setTimeout(this.continueExecution, 5000);
              }
            } else {
              document.getElementById("alertmsg").style.display = "";
              this.setState({
                alertMsg: "Password and Confirm Password does not match!",
              });
              setTimeout(this.continueExecution, 5000);
            }
          } else {
            document.getElementById("alertmsg").style.display = "";
            this.setState({ alertMsg: "Please repeate password!" });
            setTimeout(this.continueExecution, 5000);
          }
        } else {
          document.getElementById("alertmsg").style.display = "";
          this.setState({ alertMsg: "Please enter your password!" });
          setTimeout(this.continueExecution, 5000);
        }
      } else {
        document.getElementById("alertmsg").style.display = "";
        this.setState({ alertMsg: "Please enter your User name!" });
        setTimeout(this.continueExecution, 5000);
      }
    } else {
      document.getElementById("alertmsg").style.display = "";
      this.setState({ alertMsg: "Please enter your Full name!" });
      setTimeout(this.continueExecution, 5000);
    }
  };

  continueExecution = () => {
    if (this.state.openFirstModal) {
      document.getElementById("alertmsg").style.display = "none";
    }
  };

  // download(e) {
  //     //     // let data = JSON.parse(sessionStorage.getItem("download_data"))
  //     //     // window.location.href = URL.download + "/" + data.filename

  // }

  // tempAlert(msg, duration) {
  //     var el = document.createElement("div");
  //     el.setAttribute("style", " position:absolute;top:15%;left:45%; margin:auto;background-color:white;font-size: 25px;");

  //     el.innerHTML = this.state.Msg;
  //     setTimeout(function () {
  //         el.parentNode.removeChild(el);
  //     }, duration);
  //     document.body.appendChild(el);
  // }

  //------------------complete signing and link to Inbox-----------------
  completeSigning = () => {
    this.setState({ loaded: false });
    let getDocDetailsData = {
      docId: this.state.docId,
      signedStatus: 1,
      linkToInbox: "Y",
      authToken: sessionStorage.getItem("authToken"),
    };
    if (this.state.draftRefNumber !== null) {
      getDocDetailsData.draftRefNumber = this.state.draftRefNumber;
    }
    this.getstoredFilefrmTempDetails(getDocDetailsData);
  };

  //-------------------cancel signing, and document will be available in Inbox---------------------------
  cancelSigning = () => {
    this.setState({ loaded: false });
    let getDocDetailsData = {
      docId: this.state.docId,
      signedStatus: 0,
      linkToInbox: "Y",
      authToken: sessionStorage.getItem("authToken"),
    };
    confirmAlert({
      message: (
        <div>
          <h5 id="discardsigningdiv">Discard Signing</h5>
          <Row>
            <p>
              <i className="fa fa-exclamation-triangle" id="warningIcon"></i>
              Unsigned document will be available in Inbox
            </p>
          </Row>
        </div>
      ),
      buttons: [
        {
          label: "OK",
          className: "confirmBtn",
          onClick: () => {
            this.setState({ loaded: true });
            this.getstoredFilefrmTempDetails(getDocDetailsData);
          },
        },
        {
          label: "Cancel",
          className: "cancelBtn",
          onClick: () => {
            this.setState({ loaded: true });
          },
        },
      ],
    });

    // this.getstoredFilefrmTempDetails(getDocDetailsData);
  };
  //----------------------take back to preview page with restoring the signing coordinates------------------------

  previewandSignAgain = () => {
    this.setState({ loaded: false });
    let getDocDetailsData = {
      docId: this.state.docId,
      txnrefNo: this.state.txnrefNo,
      signedStatus: 0,
      authToken: sessionStorage.getItem("authToken"),
      linkToInbox: "N",
    };
    confirmAlert({
      message: (
        <div>
          <h5 id="cancelandsigningdiv">Discard and re-sign</h5>
          <Row>
            <p>
              <i
                className="fa fa-exclamation-triangle"
                id="warningIconforCancel"
              ></i>
              <span>Signing charges will be applicable for</span>
              <br />
              <span>re-signing</span>
            </p>
          </Row>
        </div>
      ),
      buttons: [
        {
          label: "Proceed",
          className: "confirmBtn",
          onClick: () => {
            this.setState({ loaded: true });
            this.getstoredFilefrmTempDetails(getDocDetailsData);
          },
        },
        {
          label: "Cancel",
          className: "cancelBtn",
          onClick: () => {
            this.setState({ loaded: true });
          },
        },
      ],
    });
    // this.getstoredFilefrmTempDetails(getDocDetailsData);
  };

  //Fetch call to get the docDetails from Temp_doc_details table based on users selection
  async getstoredFilefrmTempDetails(getDocDetailsData) {
    let data = getDocDetailsData;
    let dataToGetSignCoordinateDetails = {
        docId: this.state.docId,
        authToken: sessionStorage.getItem("authToken"),
    };

    try {
        const response = await fetch(URL.getstoredFilefrmTempDetails, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const responseJson = await response.json();
        console.log({responseJson});
        if (responseJson.status === "SUCCESS") {
            document.getElementById("discardOptionsdiv").style.display = "none";

            if (responseJson.statusDetails.includes("Cancelled")) {
                toast.error(responseJson.statusDetails, { autoClose: 1000 });
                this.sleep(50000);
                this.props.history.push("/inbox");
            } else if (responseJson.statusDetails.includes("Updated")) {
                await this.getSignCoordinateDetails(dataToGetSignCoordinateDetails);
                await this.createFile(this.state.txnrefNo, 0);
            } else {
                toast.success(responseJson.statusDetails, { autoClose: 1000 });
                this.setState({
                    msg: "The signed document can be downloaded from this page, or from the Inbox later.",
                });
            }
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
    } catch (error) {
        this.setState({ loaded: true });
        alert(error);
    }
  }

  //Fetch call to get the coordinates when user selects Discard and sign again option
  async getSignCoordinateDetails(data) {
    // console.log(data);
    //getting access for external signer
    const response = await fetch(URL.getSignCoordinateDetails, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    const responseJson = await response.json();
    console.log({responseJson});
    if (responseJson.status == "SUCCESS"){
          this.setState({
            loaded: true,
            signMode: responseJson.signMode,
            signInfo: responseJson.signInfo,
            signCoordinates: responseJson.signCoordinates,
            // signCoordinates: JSON.parse(responseJson.signCoordinates),
            signPage: responseJson.signPage,
            pageList: responseJson.pageList,
          });
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
  }

  //downloading PDF file
  // async createFile(txnrefNo, signedStatus) {
  //   let response = await fetch(
  //     URL.downloadfromtemp +
  //       "?at=" +
  //       btoa(sessionStorage.getItem("authToken")) +
  //       "&txnrefNo=" +
  //       btoa(txnrefNo) +
  //       "&signedStatus=" +
  //       signedStatus
  //   );
  //   let data = await response.blob();
  //   let testResponse = await this.test(data);
  // }
  //chnaged for encryption
  async createFile(txnrefNo, signedStatus) {
    let response = await fetch(
      URL.downloadfromtemp +
        "?at=" +
        btoa(sessionStorage.getItem("authToken")) +
        "&txnrefNo=" +
        btoa(txnrefNo) +
        "&signedStatus=" +
        signedStatus
    );
    let data = await response.blob();
      console.log(data);
      let arrayBuffer = await this.blobToArrayBuffer(data);
    let testResponse = this.test(arrayBuffer);
  }

  async blobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.onerror = function (error) {
            reject(error);
        };
        reader.readAsArrayBuffer(blob);
    });
}

  //routing to preview page
  async test(data) {
    const loadingTask = pdfjs.getDocument({data});
    const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            const pageDimensionsArr = [];
            let equalPageDimensionsValue = true;
            for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
              const page = await pdf.getPage(pageNumber);
              const viewport = page.getViewport({ scale: 1 });

              pageDimensionsArr.push({
                  pageNumber: pageNumber,
                  width: viewport.width,
                  height: viewport.height,
              });
          }
          this.setState({ pageDimensions: pageDimensionsArr });
          console.log(pageDimensionsArr);

          // Iterate through the array and compare dimensions
          for (let i = 1; i < pageDimensionsArr.length; i++) {
            if (pageDimensionsArr.length != 1) {

              if (pageDimensionsArr[i].width !== pageDimensionsArr[0].width || 
                pageDimensionsArr[i].height !== pageDimensionsArr[0].height) {
                  equalPageDimensionsValue = false;
                  this.setState({ equalPageDimensions: false});
                  break;
              }
            }
          }

    let metadata = {
      type: "application/pdf",
    };
    console.log(this.state.fileName);
    var file1 = new File([data], this.state.fileName.split("@")[1], metadata);
    file1.preview = window.URL.createObjectURL(new File([data], this.state.fileName.split("@")[1], metadata));
    console.log(file1);

    let signCoordinates = {
      signCoordinates: this.state.signCoordinates,
      signInfo: this.state.signInfo,
      signMode: this.state.signMode,
      signPage: this.state.signPage,
      pageList: this.state.pageList
    }
    // console.log({signCoordinates});

    let data1 = {
      files: file1,
      docId: this.state.docId,
      signCoordinates: signCoordinates,
      height: this.state.height,
      width: this.state.width,
      pageDimensions: pageDimensionsArr,
      equalPageDimensions: equalPageDimensionsValue
    };
    this.setState({ loaded: true });
    this.props.history.push({
      pathname: "/preview",
      frompath: "/download/tokenSignDownload",
      state: {
        details: data1,
      },
    });
  }

  render() {
    let fileName = this.state.fileName;
    return (
      <div>
        <ToastContainer></ToastContainer>
        <div className="login-main-container">
          <div className="" id="discardOptionsdiv" style={{ display: "none" }}>
            {/* <nav class="" id="performActionnavid" aria-label="breadcrumb">
              <ol id="performActionBreadcrumbid" class="breadcrumb"> */}
            <Button
              className="btn btn-success rounded-pill"
              id="completeSigningBtn"
              onClick={this.completeSigning}
            >
              Finish
            </Button>
            <Button
              className="btn btn-warning rounded-pill"
              id="previewSignAgainBtn"
              onClick={this.previewandSignAgain}
            >
              Discard and sign again
            </Button>
            <Button
              // color="danger"
              className="btn btn-danger rounded-pill"
              id="cancelSigningBtn"
              onClick={this.cancelSigning}
            >
              Discard signing
            </Button>

            {/* </ol>
            </nav> */}
          </div>
          <PDF1
            url={
              this.state.viewFileURl +
              "?at=" +
              btoa(sessionStorage.getItem("authToken")) +
              "&docID=" +
              btoa(this.state.docId)
            }
            filename = {fileName}
          />
          <div style={{ marginTop: "1%", textAlign: "center" }}>
            <h5 id="multipplMsg">{this.state.msg}</h5>
          </div>
          <div id="externalSignerRegCkBx" style={{ display: "none" }}>
            <input type="checkbox" onChange={this.handelChange}></input>
            <label>
              &nbsp; <b>Register me with DocuExec</b>
            </label>
          </div>
          <Modal
            className="modal-container"
            open={this.state.openFirstModal}
            onClose={this.onCloseFirstModal}
            center={true}
          >
            <div className="modal-head-1" >
              <span style={{ color: "#c79807" }}>Register to DocuExec</span>
            </div>
            <div
              className="modal-head-2"
              style={{ width: "auto", fontWeight: "normal" }}
            >
              <span>Save the document to your account</span>
            </div>
            <b>Email</b>
            <Input
              id="email"
              type="text"
              name="email"
              placeholder="Email"
              autoComplete="off"
              onChange={this.setInput}
              value={this.state.email}
              maxLength="60"
            />
            <br></br>
            <b>User Name</b>
            <Input
              id="loginname"
              type="text"
              name="loginname"
              placeholder="Login Name"
              autoComplete="off"
              onChange={this.setInput}
              value={this.state.loginname}
              maxLength="25"
              required="true"
            />
            <br></br>
            <b>Full Name</b>
            <Input
              id="username"
              type="text"
              name="username"
              placeholder="Full Name"
              autoComplete="off"
              onChange={this.setInput}
              value={this.state.username}
              maxLength="25"
              required="true"
            />
            <br />
            <b>Mobile</b>
            <Input
              id="mobile"
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              autoComplete="off"
              onChange={this.setInput}
              value={this.state.moble}
              maxLength="10"
            />
            <br />
            <b>Password</b>
            <InputGroup className="mb-3">
              <Input
                id="myPassword"
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="off"
                title="Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special character"
                onChange={this.setInput}
                value={this.state.password}
                maxLength="25"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i
                    className="fa fa-unlock"
                    onMouseOver={this.passwordoverPass}
                    onMouseOut={this.passwordoutPass}
                  ></i>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <b>Confirm Password</b>
            <InputGroup className="mb-4">
              <Input
                id="repassword"
                type="password"
                name="repassword"
                placeholder="Confirm Password"
                autoComplete="off"
                title="Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special character"
                onChange={this.setInput}
                value={this.state.repassword}
                maxLength="25"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i
                    className="fa fa-unlock"
                    onMouseOver={this.mouseoverPass}
                    onMouseOut={this.mouseoutPass}
                  ></i>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            <div id="alertmsg" style={{ color: "red", display: "none" }}>
              {this.state.alertMsg}
            </div>
            <div className="agree-div">
              <button
                className="aggree-button"
                onClick={this.register.bind(this)}
              >
                <span>Register &#8594; </span>
              </button>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}
