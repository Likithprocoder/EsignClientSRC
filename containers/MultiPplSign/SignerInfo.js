import React from "react";
import "./client.css";
import { Button, Row } from "reactstrap";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { notify } from "react-notify-toast";
import { URL } from "../URLConstant";
import Modal from "react-responsive-modal";
import {
  Input,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";

var Loader = require("react-loader");

class SignerInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      file: "",
      docName: "",
      total_height: "",
      total_width: "",
      enableSignOrder: "N",
      startDate: "",
      endDate: "",
      noSigns: "" + 0,
      signInfo: "",
      signerInfo: [{ signerName: "", signerMobile: "", signerEmail: "" }],
      min: "",
      count: 0,
      custDocName: "",
      sendersComments: "",
	  pageDimensions: "",
      equalPageDimensions: true,
openEmailModal: false,
      to: "",
      cc: "",
      array_emailTo: [],
      array_emailCc: [],
      subject: "",
      ebody: "",
      emailValidation: {},
      emailDetails: "",
      declineSigning:false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    if (this.props.location.frompath === "dropdoc") {
      this.setState({
        file: this.props.location.state.details.files,
        total_width: this.props.location.state.details.width,
        total_height: this.props.location.state.details.height,
        docName: this.props.location.state.details.files.name,
        pageDimensions: this.props.location.state.details.pageDimensions,
        equalPageDimensions: this.props.location.state.details.equalPageDimensions,
      });
    }
    this.setSEDate();
    var today = new Date().toISOString().split("T")[0];
    this.setState({ min: today });
    this.getEmailValidation();
  }

  addClick() {
    this.setState((prevState) => ({
      signerInfo: [
        ...prevState.signerInfo,
        { signerName: "", signerMobile: "", signerEmail: "" },
      ],
    }));
  }
  //------------validation for signer Info Array to check duplicate mobile number or email Id.
  checkSignerInfoListIsUnique(signerInfoArray) {
    for (var i = 0; i < signerInfoArray.length; i++) {
      for (var j = 0; j < signerInfoArray.length; j++) {
        if (i != j) {
          if (signerInfoArray[i] == signerInfoArray[j]) {
            return true; // means there are duplicate values
          }
        }
      }
    }
    return false; // means there are no duplicate values.
  }
  createUI() {
    return this.state.signerInfo.map((el, i) => (
      <div key={i}>
        <div class="horizontal-line">
        <Row className="align-items-center" id="signerRow">
          <span className="signerindex ">{i + 1} </span>
          <input
            className="signerfield "
            id="namefield"
            placeholder="Signer Name"
            name="signerName"
            value={el.signerName || ""}
            onChange={this.handleChange.bind(this, i)}
            // maxLength="25"
            // required={true}
          />
          <input
            className="signerfield "
            placeholder="Signer Mobile"
            id="mlplsignerName"
            name="signerMobile"
            value={el.signerMobile || ""}
            onChange={this.handleChange.bind(this, i)}
            maxLength={10}
            minLength={10}
            // required={true}
          />
          <input
            type="email"
            className="signerfield "
            id="mailfield"
            placeholder="Signer Email"
            name="signerEmail"
            value={el.signerEmail || ""}
            onChange={this.handleChange.bind(this, i)}
            // maxLength="60"
            // required={true}
          />
          <div className="next-nav">
            <Button
              className="px-4"
              color="danger"
              id="signerInfoRmvBtn"
              onClick={this.removeClick.bind(this, i)}
            >
              Remove
            </Button>
          </div>
        </Row>
        </div>
      </div>
    ));
  }

  handleChange = (i, e) => {
    const { name, value } = e.target;
    let signerInfo = [...this.state.signerInfo];
    let regName = new RegExp(/^[a-zA-Z0-9 ]*$/);
    // let regPassword = new RegExp(/^[A-Za-z0-9!.@#\$%\^&_ ]*$/);
    let regNum = new RegExp(/^[0-9]*$/);
    let regEmail = new RegExp(/^[A-Za-z0-9\-.@'_ ]*$/);
    if (name === "signerName") {
      if (regName.test(e.target.value)) {
        signerInfo[i] = { ...signerInfo[i], [name]: value };
        this.setState({ signerInfo });
      } else {
        return false;
      }
    }

    if (name === "signerEmail") {
      if (regEmail.test(e.target.value)) {
        signerInfo[i] = { ...signerInfo[i], [name]: value };
        this.setState({ signerInfo });
      } else {
        return false;
      }
    }

    if (name === "signerMobile") {
      if (regNum.test(e.target.value)) {
        signerInfo[i] = { ...signerInfo[i], [name]: value };
        this.setState({ signerInfo });
      } else {
        return false;
      }
    }
  };

  setCustomDocName = (e) => {
    let regName = new RegExp(/^[a-zA-Z0-9\-.@'#_/ ]*$/);
    const { name, value } = e.target;
    ////console.log("helllo");
    if (name === "custDocName") {
      ////console.log("helllo"+name);
      let encodedName = encodeURI(e.target.value);
      ////console.log("helllo" + encodedName.length);
      if (encodedName.length > 29) {
        alert("Document title should be of within 30 characters");
      } else {
        if (regName.test(e.target.value)) {
          ////console.log("helllo" + e.target.value);

          this.setState({ custDocName: e.target.value });
        } else {
          return false;
        }
      }
    }
  };

  setSendersComments = (e) => {
    let regName = new RegExp(/^[a-zA-Z0-9\-.@'#_/ ]*$/);
    const { name, value } = e.target;
    if (name === "sendersCommentsName") {
      // this.setState({ sendersComments: e.target.value });
      this.setState({
        sendersComments: e.target.value.replace(/[^\w\s@#_,'":.\\-]/gi, ""),
      });
    }
  };

  removeClick(i) {
    let signerInfo = [...this.state.signerInfo];
    signerInfo.splice(i, 1);
    this.setState({ signerInfo });
  }
  handleSubmit(event) {
    let regName = new RegExp(/^[a-zA-Z0-9 ]*$/);
    let regNum = new RegExp(/^[0-9]*$/);
    let regEmail = new RegExp(/[\w-]+@([\w-]+\.)+([\w-]{2,3})+/);
    let mobileNumberDigits =
      /^(?:(?:\\+|0{0,2})91(\s*[\\-]\s*)?|[0]?)?[6789]\d{9}$/;
    let isMobileValid = true;
    let isEmailValid = true;
    let isNameValid = true;
    event.preventDefault();
    // signerInfoList
    var signerInfoList = this.state.signerInfo.reduce((a, b) => {
      for (let i in b) {
        if (!a[i]) {
          a[i] = [];
        }
        a[i].push(b[i]);
      }

      return a;
    }, {});
    var mobileList = signerInfoList.signerMobile; // taking signerMobileNumber array
    var emailList = signerInfoList.signerEmail; // taking signerEmailId array
    var duplicateMobileNumeber = this.checkSignerInfoListIsUnique(mobileList);
    if (duplicateMobileNumeber == false) {
      var duplicateEmailId = this.checkSignerInfoListIsUnique(emailList);
      if (duplicateEmailId == false) {
        this.setState({ loaded: false });
        let signerInfo = [...this.state.signerInfo];
        if (this.state.enableSignOrder === "Y") {
          signerInfo.map((item, i) => {
            item["signOrder"] = i + 1;
          });
        } else {
          signerInfo.map((item, i) => {
            item["signOrder"] = "";
          });
        }
        event.preventDefault();
        //pusing to preview Page
        let data;
        for (let index = 0; index < signerInfo.length; index++) {
          if (
            signerInfo[index].signerName.length == 0 ||
            signerInfo[index].signerName.trim() == ""
          ) {
            this.setState({ loaded: true });

            isNameValid = false;
            return confirmAlert({
              message: "Signer name cannot be empty",
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
          if (!signerInfo[index].signerName.match(regName)) {
            isNameValid = false;

            return confirmAlert({
              message: "Enter valid signer name",
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
          if (signerInfo[index].signerMobile.trim() == "") {
            isMobileValid = false;
            this.setState({ loaded: true });
            return confirmAlert({
              message: "Mobile number cannot be empty",
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
          if (signerInfo[index].signerMobile.length != 10) {
            isMobileValid = false;
            this.setState({ loaded: true });
            return confirmAlert({
              message: "Enter valid 10 digit signer mobile number",
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
          if (
            !signerInfo[index].signerMobile.match(regNum) ||
            !signerInfo[index].signerMobile.match(mobileNumberDigits)
          ) {
            isMobileValid = false;
            this.setState({ loaded: true });
            return confirmAlert({
              message: "Enter valid 10 digit signer mobile number",
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
          if (
            signerInfo[index].signerEmail.length == 0 ||
            signerInfo[index].signerEmail.trim() == ""
          ) {
            isMobileValid = false;
            this.setState({ loaded: true });
            return confirmAlert({
              message: "Email field cannot be empty",
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
          if (!signerInfo[index].signerEmail.match(regEmail)) {
            isEmailValid = false;
            this.setState({ loaded: true });
            return confirmAlert({
              message: "Enter valid Email Id",
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
          if (isNameValid && isEmailValid && isMobileValid) {
            data = {
              noSigns: signerInfo.length,
              files: this.state.file,
              height: this.state.total_height,
              width: this.state.total_width,
              signerInfo: signerInfo,
              startDate: this.state.startDate,
              endDate: this.state.endDate,
              enableSignOrder: this.state.enableSignOrder,
              custDocName: this.state.custDocName,
              senderComments: this.state.sendersComments,
              pageDimensions: this.state.pageDimensions,
              equalPageDimensions: this.state.equalPageDimensions,

            };
            if(document.getElementById("checkboxdeclineSigning").checked){
              data.declineSigning=this.state.declineSigning
            }
            if (document.getElementById("checkboxEmailNotify").checked) {
              data.emailDetails = this.state.emailDetails;
            }
            this.setState({
              count: ++this.state.count,
            });
          }
        }
        this.setState({ loaded: true });
        this.props.history.push({
          pathname: "/multiPplSignPreview",
          frompath: "/signerInfo",
          state: {
            details: data,
          },
        });
      } else {
        this.setState({ loaded: true });
        confirmAlert({
          message: "Multiple signers cannot have same Email ID",
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
      this.setState({ loaded: true });
      confirmAlert({
        message: "Multiple signers cannot have same mobile number",
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
  }

  onChecked = () => {
    if (this.state.enableSignOrder === "N") {
      document.getElementById("checkboxdeclineSigning").style.display="none"
      document.getElementById("checkeddeclineSigning").style.display="none"
      document.getElementById("checkboxdeclineSigning").checked=false
      this.setState({
        enableSignOrder: "Y",
      });
    } else {
       document.getElementById("checkboxdeclineSigning").style.display=""
      document.getElementById("checkeddeclineSigning").style.display=""
      this.setState({
        enableSignOrder: "N",
      });
    }
  };

  //---------------Send Email--------------------------
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
    console.log(authToken);
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
                  onClick: () => {},
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
    document.getElementById("checkboxEmailNotify").checked = true;
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
        var resultTo = emailTo.replaceAll(";",",").split(",");
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
          var resultCc = emailCc.replaceAll(";",",").split(",");
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
        var emailDetails = {
          toEmails: emailArrayTo,
          ccEmails: emailArrayCc,
          eSub: this.state.subject,
          eBody: this.state.ebody,
          docId: "",
          userIP: sessionStorage.getItem("userIP"),
        };
        console.log(emailDetails);
        this.setState({ emailDetails: emailDetails});
        this.setState({ openEmailModal: false });
      }
      
    } else {
      alert("Please enter the Email ID");
      return;
    }
  };

  onCloseEmailModal = () => {
    this.setState({ to: "" });
    this.setState({ cc: "" });
    this.setState({ subject: "" });
    this.setState({ ebody: "" });
    this.setState({ openEmailModal: false });
    document.getElementById("checkboxEmailNotify").checked = false;
  };

  onCheckedDeclineSigning=()=>{
if(this.state.declineSigning===false){
    confirmAlert({
      title: "Decline signing",
      message: "Enabling the Decline signing option will not allow the pending signers to perform the signing.",
      buttons: [
        {
          label: "Proceed",
          className: "confirmBtn",
          onClick: () => {
            console.log("Checked")
            this.setState({ declineSigning: true });
          },
        },
        {
         
          label: "Cancel",
          className: "cancelBtn",
          onClick: () => {
            console.log(document.getElementById("checkboxdeclineSigning").checked)
            document.getElementById("checkboxdeclineSigning").checked=false;
          },
        },
      ],
    });
  }else{
    this.setState({ declineSigning: false });
  }
  }
  
  onCheckedEmailNotify = () => {

      this.setState({ openEmailModal: true });
   
  }

  finalDate = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  docuName = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };

  setSEDate() {
    let d = new Date();
    let e = new Date();
    e.setDate(e.getDate() + 15);
    let endDateValue = "";
    // to display the default enddate in the browser
    //date format yyyy-mm-dd
    if (e.getDate() < 10 && e.getMonth() < 10) {
      endDateValue = `${e.getFullYear()}-0${e.getMonth() + 1}-0${e.getDate()}`;
    } else if (e.getDate() < 10 && e.getMonth() > 9) {
      endDateValue = `${e.getFullYear()}-${e.getMonth() + 1}-0${e.getDate()}`;
    } else if (e.getDate() > 9 && e.getMonth() < 10) {
      endDateValue = `${e.getFullYear()}-0${e.getMonth() + 1}-${e.getDate()}`;
    } else {
      endDateValue = `${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`;
    }
    this.setState({
      startDate: `${d.getFullYear()}-${
        d.getMonth() + 1
      }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
      endDate: endDateValue,
    });
  }

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
        <form onSubmit={this.handleSubmit}>
          <input id="checkbox" type="checkbox" onChange={this.onChecked} />
          <label id="checked">Enable Sign Order</label>
          <input id="checkboxdeclineSigning" type="checkbox" onChange={this.onCheckedDeclineSigning} />
          <label id="checkeddeclineSigning">Decline signing</label>
          <input id="checkboxEmailNotify" type="checkbox" onChange={this.onCheckedEmailNotify} />
          <label id="checkedEmailNotify">Email Notify</label>
          <label id="enddate">Sign by: &nbsp;</label>
          <input
            id="enddatefield"
            className="signerfield"
            type="date"
            value={this.state.endDate}
            min={this.state.min}
            name="endDate"
            onChange={this.finalDate.bind(this)}
          />
          <label id="enddate">Document Name: &nbsp;</label>
          <label id="docName">
            <b>{this.state.docName}</b>
          </label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <label id="custDocName">Document Title:</label>
          <input
            className="documentTitle"
            placeholder="Enter Document Title"
            name="custDocName"
            onChange={this.setCustomDocName.bind(this)}
            maxLength={30}
            required={true}
          />
          <Row>
            {" "}
            <div
              id="sendersCommentsid"
              style={{ paddingTop: "18px", marginLeft: "15px" }}
            >
              Sender Comments:
            </div>
            <textarea
              class="sendersComments"
              id="comments"
              name="sendersCommentsName"
              placeholder="maximum 255 characters allowed"
              title="maximum 255 characters allowed"
              rows="1"
              onkeypress={this.setSendersComments.bind(this)}
              onChange={this.setSendersComments.bind(this)}
              onpaste={this.setSendersComments.bind(this)}
              value={this.state.sendersComments}
            
              minLength={0}
              maxLength={455}
              autoComplete="off"
            ></textarea>
          </Row>
          {/* <label id="sendersCommentsid">Sender Comments:</label>
          <textarea
            className="sendersComments"
            placeholder="Comments"
            name="sendersCommentsName"
            onChange={this.setSendersComments.bind(this)}
            maxLength={255}
            required={true}
          /> */}
          {/* //<input id="docName" className="signerfield" type='text' value={this.state.docName} /> */}
          {/* <div style={{ backgroundColor: `rgba(165, 42, 42, 0.5)` }}> */}
          <div id="signerContainer">
            {this.createUI()}
          </div>
          <div className="next-nav" style={{ marginTop: "10px" }}>
            <Button
              color="primary"
              className="px-4"
              onClick={this.addClick.bind(this)}
            >
              Add next signer
            </Button>
          </div>
          <br />
          <div className="next-nav">
            <Button
              color="success"
              className="px-4"
              type="submit"
              id="next-button"
              disabled={this.state.isdisable}
            >
              <span>Proceed with signing &#8594;</span>
            </Button>
          </div>
        </form>
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
                <span style={{ color: "#c79807" }}>Email Notify</span>
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
                        style={{ display: (this.state.cc === "") ? "" : "none"}}
                      >
                        Cc
                      </button>
                    </InputGroup>
                    <InputGroup
                      className="mb-3"
                      id="unHideCc"
                      style={{ display: (this.state.cc !== "") ? "" : "none" }}
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
                  id="proceedBtn"
                  onClick={this.getEmailDetails}
                  style={{ marginRight: "10px" }}
                >
                  <span>Proceed</span>
                </button>
                <button
                  className="upload-button"
                  id="cancelBtn"
                  onClick={this.onCloseEmailModal}
                  style={{ backgroundColor: "#f86c6b"}}
                >
                  <span>Discard</span>
                </button>
              </div>
            </Modal>
          </Col>
      </div>
    );
  }
}

export default SignerInfo;
