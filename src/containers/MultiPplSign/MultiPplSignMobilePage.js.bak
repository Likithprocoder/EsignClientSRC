import React from "react";
import { URL } from "../URLConstant";
import Modal from "react-responsive-modal";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalHeader from "reactstrap/lib/ModalHeader";
import "./client.css";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import $ from "jquery";
import { confirmAlert } from "react-confirm-alert";
import "./client.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import HandSign from "../HandSign/HandSign";
var Loader = require("react-loader");

const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js`;
var timerEvent = null;

export default class MultiPplSignMobilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      loaded: true,
      signMode: "",
      signCoordinates: "",
      fileName: "",
      ownerloginName: "",
      openOTPModal: false,
      mobNo: "",
      mobileotpvalue: "",
      accesskey: "",
      mobotpref: "",
      refid: "",
      disabled: true,
      readOnly: false,
      isCompleteUrl: true,
      signerListDetails: [],
      equalPageDimensions: true,
    };
  }

  componentWillUnmount() {
    //fetching client IP

    var userip = "";
    $.getJSON("https://api.ipify.org?format=json", function (data) {
      userip = data.ip;
      sessionStorage.setItem("userIP", userip);
    });
    // this.generateCaptcha();
  }

  componentDidMount() {
    this.setState({ loaded: false, openOTPModal: false });
    var path = null;
    let pathURL = this.props.location.search;
    var data = null;
    // console.log(pathURL.includes("mobak"));
    this.setState({ loaded: true });
    let regNum = new RegExp(/^[0-9]*$/);

    // checking the access from mobile or email.
    // if link is only with mobak param without ref number show modal with asking ref no.
    //if link is with mobak param along with ref number as a part of link validate ref no and show modal with aking otp with prefield ref no.
    // if (pathURL.includes("mobak") && !pathURL.includes("=")) {
      if (pathURL.includes("mview")) {
      console.log("inside mview")
      this.setState({ loaded: true, openOTPModal: true, isCompleteUrl: false });
    } else if (pathURL.includes("mobak=")) {
      path = pathURL.split("mobak=");
      //console.log(path[1]);
      this.setState({ refid: path[1], isCompleteUrl: true });

      if (!regNum.test(path[1])) {
        confirmAlert({
          message: "Invalid reference number",
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
        this.setState({ loaded: true, openOTPModal: true });
        // var accesskey = { accessKey: path[1] };
        // data = accesskey;
        let obj = {
          optnType: "MPSJOB",
          mobRefNo: path[1],
          //  loginname: loginName,
          userIP: sessionStorage.getItem("userIP"),
        };
        this.setState({ refid: path[1], readOnly: true });

        this.setState({ loaded: true, openOTPModal: true });
        this.generateotp(obj);
        // this.mpsSigningJob(data);
      }
    } else if (pathURL.includes("jsak=")) {
      path = pathURL.split("jsak=");
      var accesskey = { accessKey: path[1] };
      data = accesskey;
      this.mpsSigningJob(data);
    } else if (pathURL.includes("dwfl=")) {
      path = pathURL.split("dwfl=");
      var accesskey = { accessKey: path[1] };
      data = accesskey;
      this.downloadSignCmpltd(data);
    
    }else {
      confirmAlert({
        message: "Invalid url",
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

    // var timeleft = 30;
    // var downloadTimer = setInterval(function () {
    //   timeleft--;
    //   document.getElementById("countdowntimer").textContent = timeleft;
    //   if (timeleft <= 0){
    //       clearInterval(downloadTimer);
    //  document.getElementById("resendotpbtn").style.display = "";

    //   }

    // }, 1000);
  }

  // resend otp counter
  resendOtpTimer = () => {
    this.setState({ timeleft: 30 });
    document.getElementById("resendotpbtn").style.display = "none";

    document.getElementById("timer").style.display = "";

    var timeleft = this.state.timeleft;
    timerEvent = setInterval(function () {
      if (timeleft < 0) {
        clearInterval(timerEvent);
        document.getElementById("resendotpbtn").style.display = "";
        document.getElementById("timer").style.display = "none";
      } else {
        document.getElementById("timer").innerHTML =
          "Resend OTP in " + timeleft + " Secs";
      }
      timeleft -= 1;
    }, 1000);
  };
  validateOtp = () => {
    // console.log(this.state.mobileotpvalue);

    if (
      this.state.mobileotpvalue.length == 0 ||
      this.state.mobileotpvalue.length != 6
    ) {
      alert("Enter 6 digit valid OTP");
    } else {
      // console.log(this.state.accesskey.mobRefNo);
      let obj = {
        optnType: "MPSJOB",
        mobileNumOtp: btoa(this.state.mobileotpvalue),
        mobAK: btoa(this.state.refid),
        mobRefNo: btoa(this.state.mobotpref),
        loginname: btoa(sessionStorage.getItem("username")),
       userIP: sessionStorage.getItem("userIP"),
       
      };

      this.setState({ loaded: true });
      this.mpsSigningJob(obj);
    }
  };
  mpsSigningJob(data) {
    //getting access for external signer
    // fetch(URL.mpsGetGuestAccess, {
    fetch(URL.mpsGetGuestAccessV2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.status == "SUCCESS") {

          clearInterval(timerEvent);
    
          this.setState({
            loaded: true,
            signMode: responseJson.signMode,
            fileName: responseJson.fileName,
            signCoordinates: responseJson.signCoordinates,
            // signCoordinates: JSON.parse(responseJson.signCoordinates),
            ownerloginName: responseJson.ownername,
            openOTPModal: false,
          });

          sessionStorage.setItem("senderName", responseJson.senderName);
          sessionStorage.setItem("requestedTime", responseJson.requestedTime);
          sessionStorage.setItem("authToken", responseJson.authToken);
          sessionStorage.setItem("username", responseJson.loginname);
          sessionStorage.setItem("firstName", responseJson.loginname);
          sessionStorage.setItem("email", responseJson.email);
          sessionStorage.setItem("roleID", "3");
          sessionStorage.setItem("externalSigner", true);
          sessionStorage.setItem("userId", responseJson.userId);
          sessionStorage.setItem("docId", responseJson.docId);
          sessionStorage.setItem("items", JSON.stringify(responseJson.menu));
          sessionStorage.setItem("mobileNo", responseJson.mobileNo);
          sessionStorage.setItem("customDocName", responseJson.customDocName);
          sessionStorage.setItem("senderComments", responseJson.senderComments);
          sessionStorage.setItem(
            "signerListDetails",
            JSON.stringify(responseJson.signerListDetails)
            // responseJson.signerListDetails
          );

          //   this.createFile(responseJson.fileName);
          //changed for encryption
          this.createFile(responseJson.docId);
        } else {
          if(responseJson.statusDetails=="Validation Failed.Enter Correct OTP"){
            alert(responseJson.statusDetails);
    
          }else{
          this.setState({ openOTPModal: false });
          confirmAlert({
            message: responseJson.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                 
                },
              },
            ],
          });
          //alert(responseJson.statusDetails)
          this.setState({ loaded: true });
        }
      }
      });
  }

  downloadSignCmpltd(data) {
    let accessKeyValue = JSON.stringify(data);
   
    let windowFeatures = "popup";

     let data1 = (document.getElementById("loadingMessage").innerHTML =
  "Downloading document please wait....");
// data1.setAttribute("", "Please wait....");
    var win = window.open(
      URL.downloadSignCmpltd + "?acskey=" + btoa(accessKeyValue),
     // windowFeatures
    );
   
  //  console.log("Downloading document please wait....");
    var winclose = window.close();
    //Self.close();
    // win.focus();
    // win.onblur=function(){win.close()};
    // win.close();
      //URL.downloadSignCmpltd + "?acskey=" + btoa(accessKeyValue);
    
  }

  onCloseOTPModal = () => {
    this.setState({ openOTPModal: false });
  };

  async createFile(docId) {
    let response = await fetch(
      URL.downloadStoredFile +
        "?at=" +
        btoa(sessionStorage.getItem("authToken")) +
        "&docID=" +
        btoa(docId)
    );
    let data = await response.blob();
    let testResponse = await this.test(data);
  }

  //routing to preview page
  async test(data) {
    let metadata = {
      type: "application/pdf",
    };
    var file1 = new File([data], this.state.fileName.split("@")[1], metadata);
    file1.preview = window.URL.createObjectURL(new File([data], this.state.fileName.split("@")[1], metadata));

    // console.log(this.state.signCoordinates.signCoordinates[0].signCoordinatesValues[0].totWidth);

    let numPages=null;
    // Initialize array to store page dimensions
    const pageDimensions = [];
    let equalPageDimensionsCheck = true;
    try {
      // Load PDF document using pdf.js
      const loadingTask = pdfjs.getDocument(file1.preview);
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
      console.log("Page dimensions:", pageDimensions);

      // Iterate through the array and compare dimensions
      for (let i = 1; i < pageDimensions.length; i++) {
        if (pageDimensions.length != 1) {

          if (pageDimensions[i].width !== pageDimensions[0].width || 
            pageDimensions[i].height !== pageDimensions[0].height) {
              equalPageDimensionsCheck = false;
              this.setState({ equalPageDimensions: false});
              break;
          }
        }
      }
      console.log(equalPageDimensionsCheck);
      console.log("Number of pages:", numPages);
    } catch (error) {
      console.error("Error:", error);
    }

    let data1 = {
      files: file1,
      sendername: sessionStorage.getItem("senderName"),
      requestedTime: sessionStorage.getItem("requestedTime"),
      externalSigner: true,
      signCoordinates: this.state.signCoordinates,
      signMode: this.state.signMode,
      height: this.state.signCoordinates.signCoordinates[0].signCoordinatesValues[0].totHeight,
      width: this.state.signCoordinates.signCoordinates[0].signCoordinatesValues[0].totWidth,
      docId: sessionStorage.getItem("docId"),
      username: sessionStorage.getItem("username"),
      firstName: sessionStorage.getItem("firstName"),
      email: sessionStorage.getItem("email"),
      userId: sessionStorage.getItem("userId"),
      mobileNo: sessionStorage.getItem("mobileNo"),
      ownerloginName: this.state.ownerloginName,
      customDocName: sessionStorage.getItem("customDocName"),
      senderComments: sessionStorage.getItem("senderComments"),
      signerListDetails: sessionStorage.getItem("signerListDetails"),
      pageDimensions: pageDimensions,
      equalPageDimensions: equalPageDimensionsCheck,
    };
    this.setState({ loaded: true });
    this.props.history.push({
      pathname: "/preview",
      frompath: "deGuest",
      state: {
        details: data1,
      },
    });
  }

  digitValidate(ele) {
    // console.log(ele.value);
    ele.value = ele.value.replace(/[^0-9]/g, "");
  }

  tabChange(val) {
    let ele = document.querySelectorAll(".otp");
    let data = document.getElementById("Otpfileds");
    // console.log(data);

    if (ele[val - 1].value != "") {
      ele[val].focus();
    } else if (ele[val - 1].value == "") {
      ele[val - 2].focus();
    }
  }
  generateotp = (obj) => {

    this.setState({ loaded: false });
  
    fetch(URL.generateOtpforMobAccess, {
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
          //call resend otp counter
          this.resendOtpTimer();

          // console.log("success");
          document.getElementById("refIDGroup").readOnly = true;
          document.getElementById("mpsotpbtn").style.display = "none";
          document.getElementById("mobOtpGroup").style.display = "";
          document.getElementById("mobilemsg").style.display = "";
          document.getElementById("refidMsg").style.display = "none";

          // document.getElementById("countdowntimer1").style.display = "";
          document.getElementById("mpssubmit").style.display = "";
          // document.getElementById("resendotpbtn").style.display = "";

          this.setState({
            loaded: true,
            mobotpref: responseJson.mobRefNo,
            mobNo: responseJson.mobileNum.replace(/\d(?=\d{4})/g, "*"),
          });
        } else {
          if (responseJson.statusDetails === "Session Expired!!") {
            sessionStorage.clear();
            this.setState({ loaded: true, openOTPModal: false });
            this.props.history.push("/login");
          } else {
            this.setState({ loaded: true, openOTPModal: false });
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
            // alert(responseJson.statusDetails);
            this.props.history.push("/login");
          }
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
    //  }
  };
  setInput = (e) => {
    let regNum = new RegExp(/^[0-9]*$/);

    let value = e.target.value;
    // console.log(value);
    let name = e.target.name;
    if (name === "mobileotp") {
      if (regNum.test(e.target.value)) {
        this.setState({ mobileotpvalue: value });
        // console.log(this.state.mobileotpvalue);
      } else {
        return false;
      }
    }
    if (name === "refid") {
      if (regNum.test(e.target.value)) {
        this.setState({ refid: value });
      } else {
        return false;
      }
    }
  };
  sendotp = () => {
    document.getElementById("mobrefid").disabled = true;
    let obj = {
      optnType: "MPSJOB",
      mobRefNo: this.state.refid,
      //  loginname: loginName,
      userIP: sessionStorage.getItem("userIP"),
    
    };
    this.generateotp(obj);
  };
  resendotp = () => {
    let obj = {
      optnType: "MPSJOB",
      mobRefNo: this.state.refid,
      //  loginname: loginName,
      userIP: sessionStorage.getItem("userIP"),
     
    };
    this.generateotp(obj);
  };

  render() {
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
        <div style={{ display: "none" }}>
          <canvas className="xx" id="textCanvas" height="60"></canvas>
          <img id="image" hidden={true} />
        </div>
        <div id="handSignContainer" style={{ display: "none" }}>
          <HandSign  data={"dxgfx"} />
        </div>
        <div
          id="loadingMessage"
          style={{
            textAlign: "center",
            marginTop: "20%",
            fontSize: "20px",
            color: "Black",
          }}
        ></div>

        <div className="item-container preview">
          <div className="items">
            <div
              className="banking-details-container"
              style={{
                marginTop: "-26px",
              }}
            >
              <Modal
                className="modal-container"
                open={this.state.openOTPModal}
                onClose={this.onCloseOTPModal}
                center={true}
                closeOnOverlayClick={false}
              >
                <div className="modal-head-1">
                  <span style={{ color: "#c79807",fontSize:"26px"}}>
                    Signer Authentication
                  </span>
                </div>
           
                <div className="para-text" id="otpmodalpara-text">
                  <div className="para-content" id="paraContentMb">
                    <Row id="otpmodalrow">
                      <InputGroup className="mb-1" id="refIDGroup">
                        <label id="enteremaileotp">Reference ID: &nbsp;</label>
                        {/* <InputGroupAddon
                          id=" refinputfield"
                          addonType="prepend"
                        >
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon> */}

                        <Input
                          type="text"
                          placeholder="Enter Reference ID"
                          name="refid"
                          id="mobrefid"
                          required={true}
                          maxLength={24}
                          onChange={this.setInput}
                          value={this.state.refid}
                          autoComplete="off"
                          readOnly={this.state.readOnly}
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        />
                      </InputGroup>

                      <InputGroup
                        id="mobOtpGroup"
                        style={{ display: "none" }}
                        className="mb-2"
                      >
                        <label
                          id="entermobileo
                        tp"
                        >
                          Mobile OTP:  &nbsp;&nbsp;&nbsp;
                        </label>
                        {/* <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon> */}

                        <Input
                          type="text"
                          placeholder="Enter Mobile OTP"
                          name="mobileotp"
                          onChange={this.setInput}
                          maxLength={6}
                          required={true}
                          value={this.state.mobileotp}
                          autoComplete="off"
                          onKeyPress={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        />
                      </InputGroup>
                      {/* <table>
                        <tr>
                          <td></td>
                        </tr>
                        <tr>
                          <td>
                            <input
                              type="text"
                              id="mainCaptcha"
                              readonly="readonly"
                            />{" "}
                            //set background image //according to your choice.
                            <input
                              type="button"
                              id="refresh"
                              value="Refresh"
                              onclick={this.generateCaptcha()}
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input type="text" id="txtInput" />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <input
                              id="Button1"
                              type="button"
                              value="Check"
                              onclick="CheckValidCaptcha();"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span id="error" style="color:red"></span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span id="success" style="color:green"></span>
                          </td>
                        </tr>
                      </table> */}
                    </Row>
                  </div>
                </div>
                <br />
                <span id="mobilemsg" style={{ display: "none" }}>
                  OTP Sent to Mobile No. :{this.state.mobNo}.
                </span>
                <div id="refidMsg">
                  Please enter the 16 digits reference ID which is shared as
                  part of the SMS
                </div>
                <div
                  className="agree-div"
                  style={{ textAlign: "-webkit-center" }}
                >
                  <button
                    className="aggree-button"
                    id="mpssubmit"
                    style={{ width: "150px", display: "none" }}
                    onClick={this.validateOtp.bind()}
                  >
                    <span>SUBMIT &#8594; </span>
                  </button>
                  <button
                    id="mpsotpbtn"
                    className="aggree-button"
                    style={{ width: "150px" }}
                    onClick={this.sendotp.bind()}
                  >
                    <span>View Document &#8594; </span>
                  </button>
                  <span
                    id="timer"
                    style={{
                      verticalAlign: "-webkit-baseline-middle",

                      marginLeft: "-5px",
                      marginTop: "3%",
                      display: "",
                      color: "#73818f",
                      fontSize: "0.875rem",
                    }}
                  ></span>{" "}
                  <Button
                    color="link"
                    id="resendotpbtn"
                    style={{ display: "none", marginTop: "5px" }}
                    title="OTP based Resend OTP"
                    onClick={this.resendotp.bind()}
                  >
                    {" "}
                    Resend OTP
                  </Button>
                  {/* <span id="countdowntimer1" style={{ display: "none" }}>
                    {" "}
                    Resend OTP in <span id="countdowntimer">30 </span>
                  </span> */}
                  <br />
                  <br />
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
