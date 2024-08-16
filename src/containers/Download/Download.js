import React from "react";
import { URL } from "../URLConstant";
import {
  Input,
  Button,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import Modal from "react-responsive-modal";
import "./Download.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import PDF from "./PDF";
import PDF1 from "./PDF1";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
var Loader = require("react-loader");

// const pdfjs = require("pdfjs-dist");
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.min.js`;
const pdfjsforOnDrag = require("pdfjs-dist");
pdfjsforOnDrag.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js`;
export default class Download extends React.Component {
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
      loaded: true,
      msg: "The eSigned document can be downloaded from this page, or from the Inbox later.",
      docId: "",
      viewFileURl: "",
      txnrefNo: "",
      fileName: "",
      commonurl: "",
      actualFileName: "",
      height: null,
      width: null,
    };
  }

  componentWillMount() {
    var url = window.location.href;
    var commonurl = url.split("/download");
    console.log(this.props);
    this.setState({ commonurl: commonurl[0] });
    let qp = this.props.location.search;
    qp = qp.replace("?", "");
    let qp_list = qp.split("&");
    let parsed = {};
    for (let i in qp_list) {
      let kv = qp_list[i].split("=");
      parsed[kv[0]] = kv[1];
    }

    let fileName = parsed.filename;
    // console.log(fileName);
    // let initialFileName = fileName.split("@")[1];
    // let finalfileName = initialFileName.split("_")[0] + ".pdf";
    // console.log(finalfileName);

    // const dimensionsString = finalfileName.split("@")[0];
    // const dimensionsArray = dimensionsString.split("x");

    // // Extracting width and height from the array
    // const canvas_Width = parseInt(dimensionsArray[0]);
    // const canvas_Height = parseInt(dimensionsArray[1]);

    // console.log("Canvas Width:", canvas_Width);
    // console.log("Canvas Height:", canvas_Height);
    this.setState({
      docId: parsed.docid,
      txnrefNo: parsed.token,
      fileName: fileName,
    });
  }

  componentDidMount() {
    //document.getElementById("downloadEsign-btn").click()
     toast.success("Aadhaar eSign Success", { autoClose: 1000 });
    // toast.success("Aadhaar eSign Success");
    if (
      sessionStorage.getItem("externalSigner") != null &&
      sessionStorage.getItem("externalSigner") === "true"
    ) {
      if (sessionStorage.getItem("userId") === "0") {
        var username = sessionStorage.getItem("username");
        var email = sessionStorage.getItem("email");
        this.setState({
          username: username,
          //docId: sessionStorage.getItem("docId"),
          email: email,
          msg: "The eSigned document can be downloaded from this page, or enable the checkbox to register and preserve this document in your inbox.",
        });
        // document.getElementById("externalSignerRegCkBx").style.display = "";
      }
    }

    if (sessionStorage.getItem("externalSigner") === "false") {
      this.setState({ viewFileURl: URL.viewSignedFile });
      document.getElementById("discardOptionsdiv").style.display = "";
      this.setState({
        username: username,
        //docId: sessionStorage.getItem("docId"),
        email: email,
        msg: "",
      });
      // document.getElementById("previewSignAgainBtn").style.display = "";
      // document.getElementById("completeSigningBtn").style.display = "";
      // document.getElementById("cancelSigningBtn").style.display = "";
    } else {
      this.setState({ viewFileURl: URL.viewStoredFile });
    }
  }

  download(e) {
    e.preventDefault();

    let qp = this.props.location.search;
    qp = qp.replace("?", "");
    let qp_list = qp.split("&");
    let parsed = {};
    for (let i in qp_list) {
      let kv = qp_list[i].split("=");
      parsed[kv[0]] = kv[1];
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
    if (name === "email") {
      if (regPassword.test(e.target.value)) {
        this.setState({ email: value });
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
      // if (
      //   this.state.loginname.length !== 0 &&
      //   this.state.loginname.trim() !== ""
      // ) {
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
            this.setState({ alertMsg: "Please repeat password!" });
            setTimeout(this.continueExecution, 5000);
          }
        } else {
          document.getElementById("alertmsg").style.display = "";
          this.setState({ alertMsg: "Please enter your password!" });
          setTimeout(this.continueExecution, 5000);
        }
      // } else {
      //   document.getElementById("alertmsg").style.display = "";
      //   this.setState({ alertMsg: "Please enter your Login name!" });
      //   setTimeout(this.continueExecution, 5000);
      // }
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

  //------------------complete signing and link to Inbox-----------------
  completeSigning = () => {
    this.setState({ loaded: false });
    let getDocDetailsData = {
      docId: this.state.docId,
      signedStatus: 1,
      linkToInbox: "Y",
      authToken: sessionStorage.getItem("authToken"),
    };
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
    // console.log("Aadhar signing");
    this.setState({ loaded: false });
    let getDocDetailsData = {
      docId: this.state.docId,
      txnrefNo: this.state.txnrefNo,
      signedStatus: 0,
      linkToInbox: "N",
      authToken: sessionStorage.getItem("authToken"),
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
              Signing charges will be applicable for re-signing
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
    // console.log({getDocDetailsData});
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
    // console.log({responseJson});

        if (responseJson.status === "SUCCESS") {
          document.getElementById("discardOptionsdiv").style.display = "none";
          if (responseJson.statusDetails.includes("Cancelled")) {
            toast.error(responseJson.statusDetails, { autoClose: 1000 });
            // toast.error(responseJson.statusDetails);
            this.sleep(50000);
            this.routeToInboxPage();
          } else if (responseJson.statusDetails.includes("Updated")) { 
            await this.getSignCoordinateDetails(dataToGetSignCoordinateDetails);
            // await this.createFile(this.state.txnrefNo, 0);
            this.routeToPreviewPage();
          } else {
            toast.success(responseJson.statusDetails, { autoClose: 1000 });
            // toast.success(responseJson.statusDetails);
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
      } catch(error) {
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
    // console.log({responseJson});
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

  // //chnaged for encryption
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

  //   let testResponse = this.test(data);
  // }

  //routing to preview page
  async test(data) {
    // let metadata = {
    //   type: "application/pdf",
    // };
    // var file1 = new File([data], this.state.fileName.split("@")[1], metadata);
    // file1.preview = window.URL.createObjectURL(new File([data], this.state.fileName.split("@")[1], metadata));

    // let signCoordinates = {
    //   signCoordinates: this.state.signCoordinates,
    //   signInfo: this.state.signInfo,
    //   signMode: this.state.signMode,
    //   signPage: this.state.signPage,
    //   pageList: this.state.pageList
    // }
    // console.log({signCoordinates});

    // let data1 = {
    //   // files: file1,
    //   docId: this.state.docId,
    //   signCoordinates: signCoordinates,
    //   height: this.state.height,
    //   width: this.state.width,
    // };
    // console.log(data1);

    //   //---------------routing to preview page by coming out of iframe and storing the datas in the session --------------
    // if (this != window.top) {
    //   sessionStorage.setItem("txnrefNo", this.state.txnrefNo);
    //   sessionStorage.setItem("signedStatus", 0);

    //   //ud-undo signing
    //   sessionStorage.setItem("ud", true);
    //   sessionStorage.setItem(
    //     "fileName",
    //     this.state.fileName.replaceAll("$", " ")
    //   );

    //   // sessionStorage.setItem("files", file1);
    //   sessionStorage.setItem("docId", this.state.docId);
    //   sessionStorage.setItem("signCoordinates", signCoordinates);
    //   sessionStorage.setItem("height", this.state.height);
    //   sessionStorage.setItem("width", this.state.width);

    //   window.top.location.href = this.state.commonurl + "/preview";
    // }

    // this.setState({ loaded: true });
    // this.props.history.push({
    //   pathname: "/preview",
    //   frompath: "/esign",
    //   state: {
    //     details: data1,
    //   },
    // });
  }

  //---------------routing to preview page by coming out of iframe and storing the datas in the session --------------
  routeToPreviewPage() {
    if (this != window.top) {
      let signCoordinates = {
        signCoordinates: this.state.signCoordinates,
        signInfo: this.state.signInfo,
        signMode: this.state.signMode,
        signPage: this.state.signPage,
        pageList: this.state.pageList
      }
      console.log({signCoordinates});
      console.log(this.state.signCoordinates);
  
      let data1 = {
        // files: file1,
        docId: this.state.docId,
        signCoordinates: signCoordinates,
        height: this.state.signCoordinates[0].signCoordinatesValues[0].totHeight,
        width: this.state.signCoordinates[0].signCoordinatesValues[0].totWidth,
      };
      // console.log(data1);

      sessionStorage.setItem("txnrefNo", this.state.txnrefNo);
      sessionStorage.setItem("signedStatus", 0);

      //ud-undo signing
      sessionStorage.setItem("ud", true);
      sessionStorage.setItem(
        "fileName",
        this.state.fileName.replaceAll("$", " ")
      );

      // Convert the object to a string representation
      const signCoordinatesStr = JSON.stringify(signCoordinates);

      sessionStorage.setItem("docId", this.state.docId);
      sessionStorage.setItem("signCoordinates", signCoordinatesStr);
      sessionStorage.setItem("height", this.state.signCoordinates[0].signCoordinatesValues[0].totHeight);
      // sessionStorage.setItem("height", this.state.height);
      sessionStorage.setItem("width", this.state.signCoordinates[0].signCoordinatesValues[0].totWidth);
      // sessionStorage.setItem("width", this.state.width);

      // console.log(sessionStorage);
      window.top.location.href = this.state.commonurl + "/preview";
    }
  }

  routeToInboxPage() {
    if (this != window.top) {
      window.top.location.href = this.state.commonurl + "/inbox";
    }
  }
  render() {
    return (
      <div className="login-main-container">
        <ToastContainer></ToastContainer>

        <div class="" id="discardOptionsdiv" style={{ display: "none" }}>
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
        {/*  <Loader loaded={this.state.loaded} lines={13} radius={20} corners={1} rotate={0} direction={1} color="#000" speed={1} trail={60} shadow={false} hwaccel={false} className="spinner loader" zIndex={2e9} top="50%" left="50%" scale={1.00} loadedClassName="loadedContent" /> */}
        <PDF1
          url={
            this.state.viewFileURl +
            "?at=" +
            btoa(sessionStorage.getItem("authToken")) +
            "&docID=" +
            btoa(this.state.docId)
          }
        />
        <button
          id="downloadEsign-btn"
          className="upload-button download"
          onClick={this.download.bind(this)}
          hidden
        >
          <span>DOWNLOAD &#8594;</span>
        </button>

        <div style={{ marginTop: "1%", textAlign: "center" }}>
          <h4 id="multipplMsg">{this.state.msg}</h4>
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
          styles={{ marginTop: "0px" }}
        >
          <div className="modal-head-1" >
            <span style={{ color: "#c79807" }}>Register to DocuExec</span>
          </div>
          <div
            className="modal-head-2"
            style={{
              width: "auto",
              fontWeight: "normal",
              fontSize: "17px",
              height: "20px",
            }}
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
          {/* <b>Login Name</b>
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
          /> */}
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
    );
  }
}
