import React from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Modal from "react-responsive-modal";
import "../Inbox/inbox.css"
import { map } from "lodash";
import Notifications, { notify } from "react-notify-toast";
import '../DigiLocker/DigiLocker.css'
var Loader = require("react-loader");
var timerEvent = null;

export default class ProfileDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: true,
      password: "",
      repassword: "",
      emailRefNo: "",
      mobRefNo: "",
      passwordSuggestionMessage: "",
      otp: "",
      timeleft: 30,
      allowModal: false,
      listOfSubGrp: [],
      corpAcctDetail: [],
      curntSubGrpList: [],
      corpEntity: {},
      curntCrpId: "",
      isKYCVerified: 0,
      userId: "",
    };
  }

  componentWillMount() {
    var body = {
      loginname: sessionStorage.getItem("username"),
      authToken: sessionStorage.getItem("authToken"),
    };
    this.setState({ loaded: false });
    fetch(URL.getProfileDetails, {
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
          var registeredOnDate = responseJson.registeredOn;
          document.getElementById("name").innerHTML = responseJson.username;
          document.getElementById("email").innerHTML = responseJson.email;
          document.getElementById("mobile").innerHTML = responseJson.mobile;
          document.getElementById("register").innerHTML = registeredOnDate;
          sessionStorage.setItem("firstName", responseJson.username);
          this.setState({ loaded: true });
        } else {
          if (responseJson.statusDetails === "Session Expired!!") {
            this.setState({ loaded: true });
            sessionStorage.clear();
            this.props.history.push("/login");
          } else {
            this.setState({ loaded: true });
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

    // KYC status getFlag call.
    var body = {
      loginname: sessionStorage.getItem("username"),
      authToken: sessionStorage.getItem("authToken"),
    };
    this.setState({ loaded: false });
    fetch(URL.getFlags, {
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
          this.setState({
            isKYCVerified: responseJson.is_KYC_verified,
            userId: responseJson.userId,
            loaded: true,
          });
          sessionStorage.setItem("KYCuserId", responseJson.userId);
          sessionStorage.setItem(
            "is_KYC_verified",
            responseJson.is_KYC_verified
          );
          if (responseJson.is_KYC_verified == 1) {
            this.setState({ loaded: true });
            this.getAdharDetails();
          } else {
            document.getElementById("KYCNotVerifiedTbl").style.display = "";
            document.getElementById("dlverifyBtn").style.display = "";
          }
        }

        else {
          if (responseJson.statusDetails === "Invalid Authentication key or key Expired!!") {
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
          this.setState({ loaded: true })
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        //  alert(e);
        alert(e);
        this.props.history.push("/");
      });

  }
  //------------KYC related functions ------------------
  // KYC Status check
  KYCStatus() {
    var status;
    if (this.state.isKYCVerified == 1) {
      status = "Verified";

      return (
        <React.Fragment>
          {status + " "}{" "}
          <i
            style={{ color: "green" }}
            id="dlCheckIcon"
            class="fa fa-check"
          ></i>{" "}
        </React.Fragment>
      );
    } else {
      status = "Not Verified";
      return (
        <React.Fragment>
          {status + "  "}
          <i
            style={{ color: "orange" }}
            className="fa fa-exclamation-triangle"
            id="warningIcon"
          ></i>{" "}
        </React.Fragment>
      );
    }
  }

  verifyKYCCall = () => {
    let windowFeatures = "popup";

    var user_id = sessionStorage.getItem("KYCuserId");
    var win = window.open(
      URL.digiLocker + "?user_id=" + user_id,
      "KYCStatus",
      windowFeatures
    );
  };

  // to fetch the aadhaar details
  getAdharDetails() {
    document.getElementById("UserDetail").style.display = "";
    var body = {
      authToken: sessionStorage.getItem("authToken"),
    };
    fetch(URL.KYCDetails, {
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
        if (responseJson.status == "SUCCESS") {
          this.setState({ loaded: true });
          document.getElementById("address").innerHTML =
            responseJson.Finaladdress;
          document.getElementById("aadhaarName").innerHTML = responseJson.name;
          document.getElementById("verifiedOn").innerHTML =
            responseJson.VerifiedOn;
          this.setState({ loaded: true });
        } else if (responseJson.statusDetails === "Session Expired!!") {
          this.setState({ loaded: true });
          sessionStorage.clear();
          this.props.history.push("/login");
        } else {
          this.setState({ loaded: true });
          confirmAlert({
            message: responseJson.statusDetails,
            buttons: [
              {
                label: "ok",
                className: "confirmBtn",
                onClick: () => { },
              },
            ],
          });
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
  }
  //------------KYC related calls ------------------



  // resend otp counter
  startResendOtpTimer = () => {
    this.setState({ timeleft: 30 });
    let timerElement = document.getElementById("timer");
    let resendOtpBtn = document.getElementById("resentOTPBtn");

    if (timerElement && resendOtpBtn) {
      resendOtpBtn.style.display = "none";
      timerElement.style.display = "";

      let timeleftSec = this.state.timeleft;

      // Clear any existing timer event
      this.stopResendOtpTimer();

      timerEvent = setInterval(() => {
        if (timeleftSec < 0) {
          clearInterval(timerEvent);
          resendOtpBtn.style.display = "";
          timerElement.style.display = "none";
        } else {
          timerElement.innerHTML = "Resend OTP in " + timeleftSec + " Secs";
        }

        timeleftSec -= 1;
      }, 1000);
    }
  };

  // resend otp counter for ending the timer
  stopResendOtpTimer = () => {
    if (timerEvent) {
      clearInterval(timerEvent);
      timerEvent = null; // Set timerEvent to null after clearing it
    }
  };

  // // resend otp counter
  // resendOtpTimer = () => {
  //   this.setState({ timeleft: 30 });
  //   document.getElementById("resentOTPBtn").style.display = "none";
  //   document.getElementById("timer").style.display = "";

  //   var timeleft = this.state.timeleft;
  //   timerEvent = setInterval(function () {
  //     if (timeleft < 0) {
  //       clearInterval(timerEvent);
  //       document.getElementById("resentOTPBtn").style.display = "";
  //       document.getElementById("timer").style.display = "none";
  //     } else {

  //       document.getElementById("timer").innerHTML =
  //         "Resend OTP in " + timeleft + " Secs";
  //     }
  //     timeleft -= 1;
  //   }, 1000);
  // };

  toEditPage = () => {
    this.props.history.push("/editProfile");
  };

  setInput = (e) => {
    let regName = new RegExp(/^[A-Za-z0-9_ ]*$/);
    let regPassword = new RegExp(/^[A-Za-z0-9!.@#\$%\^&_ ]*$/);
    let regNum = new RegExp(/^[0-9]*$/);
    let value = e.target.value;
    let name = e.target.name;

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
    if (name === "otp") {
      if (regNum.test(e.target.value)) {
        this.setState({ otp: value });
      } else {
        return false;
      }
    }
  };

  verify = () => {
    let passwordLetters = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
    );
    let myColor = {
      background: "#ff7675",
      text: "#FFFFFF",
    };
    var body = {
      loginname: btoa(sessionStorage.getItem("username")),
      authToken: sessionStorage.getItem("authToken"),
      optnType: "CHGPAS",
    };
    if (this.state.password.length !== 0 && this.state.password.trim() !== "") {
      if (
        this.state.repassword.length !== 0 &&
        this.state.repassword.trim() !== ""
      ) {
        if (passwordLetters.test(this.state.password)) {
          if (this.state.password === this.state.repassword) {
            this.setState({ passwordSuggestionMessage: "" });

            this.setState({ loaded: false });
            fetch(URL.getOtp, {
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
                    message:
                      "OTP sent to registered email ID and mobile number.",
                    buttons: [
                      {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => {
                          // start otp resend counter
                          this.startResendOtpTimer();
                          document.getElementById("verifyBtn").style.display =
                            "none";
                          // document.getElementById("cancelBtn").style.marginLeft = "38%";
                          document.getElementById(
                            "otpContainer"
                          ).style.display = "";
                          document.getElementById("submitBtn").style.display =
                            "";
                          // document.getElementById("resentOTPBtn").style.display = "";
                          document.getElementById(
                            "newPassword"
                          ).readOnly = true;
                          document.getElementById("repassword").readOnly = true;
                          this.setState({ loaded: true });
                          this.setState({
                            mobRefNo: responseJson.mobRefNo,
                            emailRefNo: responseJson.emailRefNo,
                          });
                        },
                      },
                    ],
                  });

                } else {
                  if (responseJson.statusDetails === "Session Expired!!") {
                    sessionStorage.clear();
                    this.setState({ loaded: true });
                    this.props.history.push("/login");
                  } else {
                    this.setState({ loaded: true });
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
                    // alert(responseJson.statusDetails)
                  }
                }
              })
              .catch((e) => {
                this.setState({ loaded: true });
                alert(e);
              });
          } else {
            confirmAlert({
              message: "Password and Confirm Password Should match",
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => { },
                },
              ],
            });
            // alert('Password and Confirm Password do not match!', "custom", 5000, myColor)
          }
        } else {
          confirmAlert({
            message:
              "Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special charecter",
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => { },
              },
            ],
          });
          //alert('Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special charecter', "custom", 5000, myColor);
        }
      } else {
        confirmAlert({
          message: "Please enter confirm password",
          buttons: [
            {
              fontSize: "14px",
              label: "OK",
              className: "confirmBtn",
              onClick: () => { },
            },
          ],
        });
        //alert("please Enter your Re-password")
      }
    } else {
      confirmAlert({
        message: "Please enter new password",
        buttons: [
          {
            fontSize: "14px",
            label: "OK",
            className: "confirmBtn",
            onClick: () => { },
          },
        ],
      });
      //alert("please Enter your password")
    }
  };

  changePassword = () => {
    let myColor = {
      background: "#ff7675",
      text: "#FFFFFF",
    };

    if (
      this.state.otp.length !== 0 &&
      this.state.otp.length == 6 &&
      this.state.otp.trim() !== ""
    ) {
      let json = {
        loginname: btoa(sessionStorage.getItem("username")),
        password: btoa(this.state.password),
        repassword: btoa(this.state.repassword),
        authToken: sessionStorage.getItem("authToken"),
        optnType: "CHGPAS",
        emailOtp: btoa(this.state.otp),
        emailRefNo: btoa(this.state.emailRefNo),
        mobRefNo: btoa(this.state.mobRefNo),
        mobileNumOtp: btoa(this.state.otp),
        userIP: btoa(sessionStorage.getItem("userIP")),
      };
      this.setState({ loaded: false });

      fetch(URL.changePassword, {
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
          if (responseJson.status === "SUCCESS") {
            document.getElementById("resentOTPBtn").style.display = "none";
            document.getElementById("timer").style.display = "none";
            this.startResendOtpTimer.bind(this).timeleft = 0;
            document.getElementById("timer").innerHTML = "Resend OTP in " + 30 + " Secs";

            clearInterval(timerEvent);

            // this.resendOtpTimer.bind(this).clear;
            this.setState({
              loaded: true,
              password: "",
              repassword: "",
              otp: "",
              timeleft: 30,
            });
            // client level message altered as per suggestion because the internally we are using same method for forgot password and change password.
            var msg = responseJson.statusDetails;
            if (msg === "Password updated successfully") {
              msg = "Password changed successfully";
            }
            confirmAlert({
              message: msg,
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => { },
                },
              ],
            });
            //alert(responseJson.statusDetails)

            document.getElementById("showPassword").style.display = "none";
            document.getElementById("buttons").style.display = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("newPassword").readOnly = false;
            document.getElementById("repassword").readOnly = false;
            document.getElementById("otpContainer").style.display = "none";
            document.getElementById("verifyBtn").style.display = "";
            document.getElementById("submitBtn").style.display = "none";
            document.getElementById("resentOTPBtn").style.display = "none";
          } else {
            if (responseJson.statusDetails === "Session Expired!!") {
              sessionStorage.clear();
              this.setState({ loaded: true });
              this.props.history.push("/login");
            } else {
              this.setState({ loaded: true });
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
              //alert(responseJson.statusDetails)
            }
          }
        })
        .catch((e) => {
          this.setState({ loaded: true });
          alert("Failed to connect to server", "custom", 5000, myColor);
        });
    } else {
      //console.log("else block");
      confirmAlert({
        message: "Please enter a valid OTP",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => { },
          },
        ],
      });
      //  alert('Please enter valid OTP')
    }
  };

  toChangePassword = () => {
    document.getElementById("showPassword").style.display = "";
    document.getElementById("buttons").style.display = "none";

    if (document.getElementById("otpContainer").style.display == "") {
      document.getElementById("newPassword").readOnly = false;
      document.getElementById("repassword").readOnly = false;
      document.getElementById("otpContainer").style.display = "none";
      document.getElementById("resentOTPBtn").style.display = "none";
      document.getElementById("verifyBtn").style.display = "";
      document.getElementById("submitBtn").style.display = "none";
      document.getElementById("cancelBtn").style.marginLeft = "0%";
      // this.stopResendOtpTimer();

    }
  };

  cancel = () => {
    document.getElementById("showPassword").style.display = "none";
    document.getElementById("buttons").style.display = "";
    document.getElementById("timer").style.display = "none";
    this.setState({ password: '' });
    this.setState({ repassword: '' });
    this.stopResendOtpTimer();
  };

  passwordoverPass = (obj) => {
    var obj = document.getElementById("newPassword");
    obj.type = "text";
  };

  passwordoutPass = (obj) => {
    var obj = document.getElementById("newPassword");
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

  showPasswordSuggestion = () => {
    // $("#rePassword").click = () => {
    this.setState({
      passwordSuggestionMessage:
        "Note: Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special character",
    });
    // document.getElementById("PasswordSuggestion").style.display = "";
    //      };
  };

  showPasswordSuggestionReset = () => {
    this.setState({ passwordSuggestionMessage: "" });
  };

  // a function to convert a json structure as implemented format
  convertJsonFormat = (jsonArray, boolean) => {
    let corpEntLstArray = [];
    for (let key in jsonArray) {
      let CorpEntiJsObj = jsonArray[key];
      let modiCorpJson = null;
      if (boolean) {
        modiCorpJson = {
          [CorpEntiJsObj.name]: CorpEntiJsObj.code
        }
      } else {
        modiCorpJson = {
          [CorpEntiJsObj.code]: CorpEntiJsObj.name
        }
      }
      corpEntLstArray.push(modiCorpJson);
    }
    return (
      corpEntLstArray
    )
  }

  // to open the model to collect the corp and corp group list..
  openModalForCorpAccount = (e) => {
    var json = {
      authToken: sessionStorage.getItem("authToken"),
    };
    fetch(URL.getCorpDetails, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(json)
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        this.setState({ loaded: true });
        if (responseJson.status === "SUCCESS") {
          let convertedJsArry = this.convertJsonFormat(responseJson.details, true);
          this.setState({
            corpAcctDetail: convertedJsArry,
            allowModal: true
          })
          if (convertedJsArry.length === 1) {
            this.getSubgrpForThatcorp(e.persist(), true, convertedJsArry[0][Object.keys(convertedJsArry[0])[0]]);
          }
        }
        else if (responseJson.statusDetails === "Session Expired") {
          confirmAlert({
            message: responseJson.statusDetails,
            buttons: [
              {
                label: "ok",
                className: "confirmBtn",
                onClick: () => { },
              },
            ],
          });
          this.props.history.push("/");
        }
        else {
          this.setState({ loaded: true });
          confirmAlert({
            message: responseJson.statusDetails,
            buttons: [
              {
                label: "ok",
                className: "confirmBtn",
                onClick: () => { },
              },
            ],
          });
          // alert(responseJson.statusDetails)
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        console.log(e);
      });


    this.setState({
      listOfSubGrp: [],
      curntSubGrpList: [],
      corpEntity: {},
      corpAcctDetail: [],
      curntCrpId: ""
    })
  };

  // to close the modal opened to collect the corp details...
  closeTheModal = (event) => {
    this.setState({
      listOfSubGrp: [],
      curntSubGrpList: [],
      corpEntity: {},
      corpAcctDetail: [],
      curntCrpId: "",
      allowModal: false
    })
  }

  // api to get the list  of subgroup under the corp account.
  getSubgrpForThatcorp = (event, boolean, corporateId) => {
    let corpoId = "";
    if (boolean) {
      corpoId = corporateId;
    }
    else {
      corpoId = event.target.value;
    }
    if (corpoId !== '' || boolean) {
      var json = {
        authToken: sessionStorage.getItem("authToken"),
        corpId: corpoId
      };
      fetch(URL.getTemplateGrps, {
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
          this.setState({ loaded: true });
          if (responseJson.status === "SUCCESS") {
            if (responseJson.details.length === 0) {
              this.setState({
                listOfSubGrp: [],
                curntSubGrpList: [],
                corpEntity: {},
                curntCrpId: corpoId
              })
              alert(`No groups are available under the corporate account "${document.getElementById("corpEntyDrpdown").value}"`);
            }
            else {
              let convertedJsArry = this.convertJsonFormat(responseJson.details, false);
              this.setState({
                listOfSubGrp: convertedJsArry,
                curntSubGrpList: convertedJsArry,
                curntCrpId: corpoId
              })
            }
          }
          else if (responseJson.statusDetails === "Session Expired") {
            confirmAlert({
              message: responseJson.statusDetails,
              buttons: [
                {
                  label: "ok",
                  className: "confirmBtn",
                  onClick: () => { },
                },
              ],
            });
            this.props.history.push("/");
          }
          else {
            this.setState({ loaded: true });
            confirmAlert({
              message: responseJson.statusDetails,
              buttons: [
                {
                  label: "ok",
                  className: "confirmBtn",
                  onClick: () => { },
                },
              ],
            });
            // alert(responseJson.statusDetails)
          }
        })
        .catch((e) => {
          this.setState({ loaded: true });
          console.log(e);
        });
    }
    else {
      this.setState({
        listOfSubGrp: [],
        curntSubGrpList: [],
        corpEntity: {},
        curntCrpId: ""
      })
    }
  }
  // to collect the corp details
  addCorpDetails = (event) => {
    event.preventDefault();
    let corpSubGrpSelected = [];
    if (document.getElementById("corpUsrID").value === '' || document.getElementById("corpEntyDrpdown").value === '') {
      alert('Please fill all the mandatory fields!');
    }
    else {
      for (let key in this.state.curntSubGrpList) {
        if (document.getElementById(this.state.curntSubGrpList[key][Object.keys(this.state.curntSubGrpList[key])[0]]).checked) {
          corpSubGrpSelected.push(Object.keys(this.state.curntSubGrpList[key])[0]);
        }
      }
      let corpEntity = { "corpID": this.state.curntCrpId, "userCorpID": document.getElementById("corpUsrID").value, "requestedGrps": corpSubGrpSelected };
      this.setState({
        corpEntity: corpEntity,
        loaded: false
      })
      this.closeTheModal(event);

      var body = {
        authToken: sessionStorage.getItem("authToken"),
        corpEntity: corpEntity
      };

      fetch(URL.addCorpMember, {
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
            this.setState({ loaded: true });
          } else {
            this.setState({ loaded: true });
            if (responseJson.statusDetails === "Session Expired!!") {
              sessionStorage.clear();
              // this.setState({ loaded: true })
              this.props.history.push("/login");
            }
            else {
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
  }

  // collect corp entity request..
  collectCorpEntityResq = () => {
    return (
      <div>
        <div className='inputHolderCss'>
          {
            <>

              <div key="usrCrpIdBody" className='Divo5Css'>
                <div className='InputName'>
                  <span>User Corp ID<span style={{ color: "red" }}>*</span> </span>
                </div>
                <div className='inputname1'>
                  <input type="text" name="Corporate user id" id="corpUsrID" placeholder="Please enter the corp ID" autoCapitalize='off' className='inputCss' />
                </div>
              </div>

              <div key="corpList" className='Divo5Css'>
                <div className='InputName'>
                  <span>Corporate Entity<span style={{ color: "red" }}>*</span> </span>
                </div>

                <div className='inputname1'>
                  {
                    this.state.corpAcctDetail.length === 1 ?
                      <input type="text" id="corpEntyDrpdown" disabled={true} value={Object.keys(this.state.corpAcctDetail[0])[0]} name="OneCorpEnty" autoCapitalize='off' className='inputCss' />
                      :
                      <select className='inputCss' id="corpEntyDrpdown" onChange={e => this.getSubgrpForThatcorp(e, false, "")}>
                        <option hidden={false} key="defaultSelect" value='' >Select</option>
                        {
                          this.state.corpAcctDetail.length !== 0 ?
                            <>
                              {
                                this.state.corpAcctDetail.map((posts, index) => (
                                  <option key={index} value={posts[Object.keys(posts)[0]]}>{Object.keys(posts)[0]}</option>
                                ))
                              }
                            </> :
                            <> </>
                        }
                      </select>
                  }
                </div>
              </div>

              <div key="corpGroups" className='Divo5Css'>
                <div className='InputName'>
                  <span>Groups</span>
                </div>
                <div className='inputname1' style={{ paddingTop: "10px" }}>
                  {
                    this.state.listOfSubGrp.length !== 0 ?
                      <>
                        <div className="GrpList scrollbarxCustomFields" style={{ width: "100%", maxHeight: "200px", height: "fit-content", border: "3px solid #9dc1e3", fontSize: "13px", borderRadius: "5px", padding: "5px" }}>
                          {
                            this.state.listOfSubGrp.map((posts, index) => (
                              <div style={{ display: "flex", width: "100%" }} key={index}>
                                <div style={{ width: "10%", paddingTop: "4px" }}><input id={posts[Object.keys(posts)[0]]} type="checkBox"></input></div>
                                <div style={{ width: "80%", paddingTop: "2px" }}><span>{posts[Object.keys(posts)[0]]}</span></div>
                              </div>
                            ))
                          }
                        </div>
                      </> :
                      <> </>
                  }
                </div>
              </div>
            </>
          }
        </div>
        <div className='Divo6Css'>
          <div className='proceedCancelCss'>
            <button className='cancelbtn' type='button' onClick={e => this.closeTheModal(e)}>Cancel</button>
            <button className='proceedbtnX' type='button' onClick={e => this.addCorpDetails(e)}>Submit</button>
          </div>
        </div>
      </div>
    )
  }


  render() {
    return (
      <div>
        <Notifications />
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
        <Row>
          <Col xs="12" sm="6" md="6" lg="5">
            <Card>
              <CardHeader>
                <b>Profile Details</b>
              </CardHeader>
              <CardBody className="p-4">
                <table>
                  <tbody>
                    {/* <tr style={{ height: "30px" }}>
                      <td>Login Name</td>
                      <td>:</td>
                      <td>{sessionStorage.getItem("username")}</td>
                    </tr> */}
                    <tr style={{ height: "30px" }}>
                      <td style={{ width: "30%", height: "25px" }}>
                        Full Name
                      </td>
                      <td style={{ width: "5%" }}>:</td>
                      <td style={{ width: "65%" }} id="name"></td>
                    </tr>
                    <tr style={{ height: "30px" }}>
                      <td>Email-ID</td>
                      <td>:</td>
                      <td id="email"></td>
                    </tr>
                    <tr style={{ height: "30px" }}>
                      <td>Mobile</td>
                      <td>:</td>
                      <td id="mobile"></td>
                    </tr>
                    <tr style={{ height: "30px" }}>
                      <td>Registered On</td>
                      <td>:</td>
                      <td id="register"></td>
                    </tr>
                  </tbody>
                </table>
                <div hidden={sessionStorage.getItem("roleID") !== "2"} id="disLinkToBecomCorpMem" style={{ display: 'flex', paddingTop: "6px", marginBottom:"7px" }}>
                  <a href="#" onClick={e => this.openModalForCorpAccount(e)}>Want to become a member of corporate entity?</a>
                  {/* <div style={{ paddingTop: "6px" }}>
                    To become member of the corporate entity.
                  </div>
                  <div>
                    <button className="btn btn-link" onClick={e => this.openModalForCorpAccount(e)}>Click here</button>
                  </div> */}
                </div>
                <a hidden={!(sessionStorage.getItem("roleID") === "2" || sessionStorage.getItem("roleID") === "7")} href="" onClick={() => {
                  this.props.history.push("/exitFromCorporate");
                }}>Exit from corporate entity?</a>
              </CardBody>
            </Card>
            <Row id="buttons" className="mb-3">

              <Button
                color="primary"
                className="px-4"
                style={{ marginRight: "7%", marginLeft: "4%" }}
                onClick={this.toEditPage}
              >
                Edit Profile
              </Button>
              {" "}
              <Button
                className="px-3"
                color="primary"
                onClick={this.toChangePassword}
              >
                Change Password
              </Button>

            </Row>

            <div id="showPassword" style={{ display: "none", marginBottom: "15px" }}>
              <Card>
                <CardHeader>
                  <b>Change Password</b>
                </CardHeader>
                <CardBody className="p-3">
                  <table style={{ width: "100%" }}>
                    <tbody>
                      <tr style={{ height: "30px" }}>
                        <td style={{ width: "36%", height: "25px" }}>
                          New Password
                        </td>
                        <td>:</td>
                        <td>
                          <InputGroup>
                            <Input
                              id="newPassword"
                              type="password"
                              name="password"
                              placeholder="Password"
                              autoComplete="off"
                              title="Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special character"
                              onClick={this.showPasswordSuggestion}
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
                        </td>
                      </tr>
                      <tr style={{ height: "30px" }}>
                        <td>Confirm Password</td>
                        <td>:</td>
                        <td>
                          <InputGroup>
                            <Input
                              id="repassword"
                              type="password"
                              name="repassword"
                              placeholder="Confirm Password"
                              autoComplete="off"
                              title="Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special character"
                              onClick={this.showPasswordSuggestion}
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
                        </td>
                      </tr>

                      <tr
                        style={{ height: "30px", display: "none" }}
                        id="otpContainer"
                      >
                        <td>OTP</td>
                        <td>:</td>
                        <td>
                          {" "}
                          <Input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            autoComplete="off"
                            onClick={this.showPasswordSuggestionReset}
                            onChange={this.setInput}
                            value={this.state.otp}
                            maxLength="6"
                            minLength="6"
                          />
                        </td>
                      </tr>
                      <tr
                        style={{ height: "30px", display: "none" }}
                        id="otpContainer"
                      >
                        <td>OTP</td>
                        <td>:</td>
                        <td>
                          {" "}
                          <Input
                            type="text"
                            name="otp"
                            onClick={this.showPasswordSuggestionReset}
                            placeholder="Enter OTP"
                            autoComplete="off"
                            onChange={this.setInput}
                            value={this.state.otp}
                            maxLength="6"
                            minLength="6"
                          />
                        </td>
                      </tr>
                      <tr style={{ marginTop: "4px" }}>
                        <td>
                          {/* {" "}
                          <Button
                            color="primary"
                            className="px-4"
                            style={{ display: "none", margin: "0% 0% 0% 0%" }}
                            id="submitBtn"
                            onClick={this.changePassword}
                          >
                            Save Changes
                          </Button> */}
                        </td>
                        <td></td>

                        <td>
                          <span
                            id="timer"
                            style={{
                              verticalAlign: "-webkit-baseline-middle",

                              display: "",
                              color: "#73818f",
                              fontSize: "0.875rem",
                            }}
                          ></span>{" "}
                          <Button
                            // color="link"
                            // color="primary"
                            // className="px-4"

                            color="link"
                            className="px-0"
                            style={{ display: "none", margin: "0% 0% 0% 0%" }}
                            id="resentOTPBtn"
                            onClick={this.verify}
                          >
                            Resend OTP
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p style={{ fontSize: "12px" }}>
                    {this.state.passwordSuggestionMessage}
                  </p>
                </CardBody>
              </Card>
              <Button
                style={{ margin: "0% 5% 0% 0%" }}
                color="primary"
                className="px-4"
                id="verifyBtn"
                onClick={this.verify}
              >
                Proceed &#8594;
              </Button>
              <Button
                style={{ margin: "0% 0% 0% 0%" }}
                color="danger"
                className="px-4"
                id="cancelBtn"
                onClick={this.cancel}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                className="px-4"
                style={{
                  display: "none",
                  margin: "0% 0% 0% 0%",
                  float: "right",
                }}
                id="submitBtn"
                onClick={this.changePassword}
              >
                Save Changes
              </Button>
              {/* <span
                id="timer"
                style={{
                  margin: "1% 2% 4% 5%",
                  display: "",
                  color: "#73818f",
                  fontSize: "0.875rem",
                }}
              ></span>{" "}
              <Button
                // color="link"
                // color="primary"
                // className="px-4"
                class="btn btn-link"
                style={{ display: "none", margin: "0% 0% 0% 5%" }}
                id="resentOTPBtn"
                onClick={this.verify}
              >
                Resend OTP
              </Button> */}
            </div>
          </Col>

          <Col xs="12" sm="6" md="6" lg="5">
            <Card>
              <CardHeader>
                <b>KYC STATUS Details</b>
              </CardHeader>
              <CardBody>
                <div>
                  <table id="KYCNotVerifiedTbl" style={{ display: "none" }}>
                    <tbody>
                      <tr style={{ height: "30px" }}>
                        <td style={{ width: "9%", height: "25px" }}>
                          KYC Status
                        </td>
                        <td style={{ width: "1%" }}>: </td>
                        <td style={{ width: "30%" }}>{this.KYCStatus()}</td>
                        <td style={{ width: "15%" }}>
                          {" "}
                          <Button
                            id="dlverifyBtn"
                            style={{ display: "none" }}
                            color="primary"
                            onClick={this.verifyKYCCall}
                          >
                            Verify KYC
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <table id="UserDetail" style={{ display: "none" }}>
                  <tbody>
                    <tr style={{ height: "30px" }}>
                      <td
                        style={{
                          width: "22%",
                          height: "25px",
                          verticalAlign: "text-top",
                        }}
                      >
                        KYC Status
                      </td>
                      <td style={{ width: "2%", verticalAlign: "text-top" }}>
                        :{" "}
                      </td>
                      <td style={{ width: "20%", verticalAlign: "text-top" }}>
                        {this.KYCStatus()}
                      </td>
                      {/* <td style={{ width: "20%", verticalAlign: "text-top" }}>
                        {" "}
                        <Button
                          id="dlverifyBtn"
                          style={{ display: "none" }}
                          color="primary"
                          onClick={this.verifyKYCCall}
                        >
                          Verify KYC
                        </Button>
                      </td> */}
                    </tr>
                    <tr style={{ height: "30px" }}>
                      <td
                        style={{
                          width: "22%",
                          height: "25px",
                          verticalAlign: "text-top",
                        }}
                        title="As per Aadhaar"
                      >
                        Full Name
                      </td>
                      <td style={{ width: "2%", verticalAlign: "text-top" }}>
                        :
                      </td>
                      <td
                        style={{ width: "60%", verticalAlign: "text-top" }}
                        id="aadhaarName"
                      ></td>
                    </tr>
                    <tr style={{ height: "30px" }}>
                      <td style={{ width: "22%", verticalAlign: "text-top" }}>
                        Address
                      </td>
                      <td style={{ width: "2%", verticalAlign: "text-top" }}>
                        :
                      </td>
                      <td
                        style={{ width: "60%", verticalAlign: "text-top" }}
                        id="address"
                      >
                        {" "}
                      </td>
                    </tr>

                    <tr style={{ height: "30px" }}>
                      <td style={{ width: "22%", verticalAlign: "text-top" }}>
                        KYC Verified On
                      </td>
                      <td style={{ width: "2%", verticalAlign: "text-top" }}>
                        :
                      </td>
                      <td
                        style={{ width: "60%", verticalAlign: "text-top" }}
                        id="verifiedOn"
                      ></td>
                    </tr>
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <p>
          KYC Verification is required to carryout Aadhaar based signing. KYC
          verification connects with your Digilocker account to collect KYC
          details as per Aadhaar data. <br></br>
          This process does not collect any other details linked with your
          Digilocker account, and does not get or store your Aadhaar number. In
          case you have not signed up for Digilocker,{" "}
          <a title="DigiLocker" href="" onClick={this.verifyKYCCall}>
            Click here
          </a>{" "}
          to signup for a free national Digilocker account.
        </p>

        <Modal className='inputTakingModel' onClose={this.closeTheModal} open={this.state.allowModal} center={true} closeOnOverlayClick={false}>
          <div className='WholeContent'>
            <div className='headingOfModalXcss'>
              <span style={{ fontSize: "20px" }}>Corporate Information</span>
            </div>
            <form>
              {
                this.collectCorpEntityResq()
              }
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}