import React, { Component, Suspense } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import Notifications, { notify } from "react-notify-toast";
import Loader from "react-loader";
import { URL } from "../../../containers/URLConstant";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import $ from "jquery";
import PasswordStrengthBar from "react-password-strength-bar";
import { AppFooter } from "@coreui/react";
import { SdCard } from "@material-ui/icons";
import { Refresh } from "@material-ui/icons";
import mySignLogo from "../Login/logo/appLogo.png";
import "./register.css";
import "../../../containers/Inbox/inbox.css"
import Modal from "react-responsive-modal";
import { ListItem, colors } from "@material-ui/core";
import { object } from "prop-types";

const DefaultFooter = React.lazy(() =>
  import("../../../containers/DefaultLayout/DefaultFooter")
);
var timerEvent = null;

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginname: "",
      username: "",
      email: "",
      password: "",
      repassword: "",
      moble: "",
      otp: "",
      openFirstModal: false,
      openSecondModal: false,
      TandC: "",
      consenteSign: false,
      loaded: true,
      isregiserBtndisable: true,
      TandConditionPage: "",
      PrivacyPolicyPage: "",
      mobileNumOtp: "",
      emailOtp: "",
      mobRefNo: "",
      emailRefNo: "",
      // age: "",
      captchaText: "",
      captchaRef: "",
      OTPValidtaionstatus: "N",
      OTPValidtaionstatusDetails: " ",
      timeleft: 30,
      backToRegister: false,
      allowModal: false,
      listOfSubGrp: [],
      corpAcctDetail: [],
      curntSubGrpList: [],
      corpEntity: {},
      curntCrpId: ""
    };
  }

  componentWillMount() {
    if (this.props.location.frompath === "/download/tokenSignDownload") {
      this.setState({
        email: this.props.location.state.details.mailId,
      });
    }
  }

  componentDidMount() {
    var url = window.location.href;
    var TandConditionPage = url.split("/register");
    this.setState({
      TandConditionPage: TandConditionPage[0],
      PrivacyPolicyPage: TandConditionPage[0],
    });
    this.getCaptchaCode();
  }

  setInput = (e) => {
    let regName = new RegExp(/^[a-zA-Z0-9 ]*$/);
    let loginName = new RegExp(/^[a-zA-Z0-9 ]*$/);
    let regPassword = new RegExp(/^[A-Za-z0-9!.@#\$%\^&_ ]*$/);
    let regEmail = new RegExp(/^[A-Za-z0-9\-.@'_ ]*$/);
    let regNum = new RegExp(/^[0-9]*$/);
    let regCaptcha = new RegExp(/^[A-Za-z0-9!@#$%&*]*$/);
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
    if (name === "email") {
      if (regEmail.test(e.target.value)) {
        this.setState({ email: value });
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
    if (name === "otp") {
      if (regNum.test(e.target.value)) {
        this.setState({ otp: value });
      } else {
        return false;
      }
    }
    if (name === "mobileNumOtp") {
      if (regNum.test(e.target.value)) {
        this.setState({ mobileNumOtp: value });
      } else {
        return false;
      }
    }
    if (name === "emailOtp") {
      if (regNum.test(e.target.value)) {
        this.setState({ emailOtp: value });
      } else {
        return false;
      }
    }
    if (name === "captchaCode") {
      if (regCaptcha.test(e.target.value)) {
        this.setState({ captchaText: value });
      } else {
        return false;
      }
    }
    // if (name === "age") {
    //   if (regNum.test(e.target.value)) {
    //     this.setState({ age: value });
    //   } else {
    //     return false;
    //   }
    // }
  };

  register = () => {
    if (this.state.OTPValidtaionstatus == "N") {
      let response_data = {};
      let regEmail = new RegExp(/[\w-]+@([\w-]+\.)+([\w-]{2,3})+/);

      let passwordLetters = new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
      );
      let mobileNumberDigits =
        /^(?:(?:\\+|0{0,2})91(\s*[\\-]\s*)?|[0]?)?[6789]\d{9}$/;
      let myColor = {
        background: "#ff7675",
        text: "#FFFFFF",
      };
      if (
        this.state.mobileNumOtp.length !== 0 &&
        this.state.mobileNumOtp.trim() !== ""
      ) {
        if (
          this.state.emailOtp.length !== 0 &&
          this.state.emailOtp.trim() !== ""
        ) {
          if (
            this.state.username.length !== 0 &&
            this.state.username.trim() !== ""
          ) {
            if (
              this.state.email.length !== 0 &&
              this.state.email.trim() !== ""
            ) {
              if (regEmail.test(this.state.email)) {
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
                          if (mobileNumberDigits.test(this.state.moble)) {
                            let json = {
                              optnType: "REGTIN",
                              mobRefNo: btoa(this.state.mobRefNo),
                              emailRefNo: btoa(this.state.emailRefNo),
                              mobileNumOtp: btoa(this.state.mobileNumOtp),
                              emailOtp: btoa(this.state.emailOtp),
                              loginname: btoa(this.state.loginname),
                              username: btoa(this.state.username),
                              email: btoa(this.state.email.toLowerCase()),
                              password: btoa(this.state.password),
                              mobile: btoa(this.state.moble),
                              userIP: sessionStorage.getItem("userIP"),
                            };

                            if (document.getElementById("corpLinkInput").checked) {
                              json.corpEntity = this.state.corpEntity;
                            }
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
                                  document.getElementById(
                                    "resendOTP"
                                  ).style.display = "none";
                                  document.getElementById(
                                    "timer"
                                  ).style.display = "none";
                                  this.startResendOtpTimer.bind(this).timeleft = 0;
                                  document.getElementById("timer").innerHTML =
                                    "Resend OTP in " + 30 + " Secs";

                                  clearInterval(timerEvent);
                                  this.setState({ loaded: true });
                                  confirmAlert({
                                    message: responseJson.statusDetails,
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
                                    loaded: true,
                                  });
                                  if (
                                    JSON.stringify(responseJson).includes(
                                      "OTPValidtaionstatus"
                                    )
                                  ) {
                                    this.setState({
                                      OTPValidtaionstatusDetails:
                                        responseJson.OTPValidtaionstatusDetails,
                                      OTPValidtaionstatus:
                                        responseJson.OTPValidtaionstatus,
                                    });
                                  }
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
                                  // alert(responseJson.statusDetails)
                                }
                              })
                              .catch((e) => {
                                this.setState({ loaded: true });
                                // notify.show(e, "custom", 5000, myColor);
                                alert(e);
                              });
                          } else {
                            notify.show(
                              "Please Enter a Valid Mobile Number!",
                              "custom",
                              5000,
                              myColor
                            );
                          }
                        } else {
                          notify.show(
                            "Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special character",
                            "custom",
                            5000,
                            myColor
                          );
                        }
                      } else {
                        notify.show(
                          "Please Enter 10 Digit Mobile Number!",
                          "custom",
                          5000,
                          myColor
                        );
                      }
                    } else {
                      notify.show(
                        "Password and Confirm Password does not match!",
                        "custom",
                        5000,
                        myColor
                      );
                    }
                  } else {
                    notify.show(
                      "Confirm Password field cannot be empty",
                      "custom",
                      5000,
                      myColor
                    );
                  }
                } else {
                  notify.show(
                    "Please Enter Your Password!",
                    "custom",
                    5000,
                    myColor
                  );
                }
              } else {
                notify.show(
                  "Please Enter a Valid Email Id",
                  "custom",
                  5000,
                  myColor
                );
              }
            } else {
              notify.show("Please Enter Your Email!", "custom", 5000, myColor);
            }
            // } else {
            //   notify.show(
            //     "Please Enter Your Login Name!",
            //     "custom",
            //     5000,
            //     myColor
            //   );
            // }
          } else {
            notify.show(
              "Please Enter Your Full Name!",
              "custom",
              5000,
              myColor
            );
          }
        } else {
          notify.show("Please Enter Email OTP", "custom", 5000, myColor);
        }
      } else {
        notify.show("Please Enter Mobile OTP!", "custom", 5000, myColor);
      }
    } else {
      confirmAlert({
        message: this.state.OTPValidtaionstatusDetails,
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
    }
    // $(document).ready(function () {
    //   $("#mobile").on("cut copy paste", function (e) {
    //     e.preventDefault();
    //   });
    // });
    // $("#mobile").on("paste", function (e) {
    //   e.preventDefault();
    //   return false;
    // });
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

  validateOTP = () => {
    let myColor = {
      background: "#ff7675",
      text: "#FFFFFF",
    };
    if (this.state.otp.length !== 0 && this.state.otp.trim() !== "") {
      let json = {
        otp: btoa(this.state.otp),
        mobile: btoa(this.state.mobile),
        email: btoa(this.state.email.toLowerCase()),
      };
      this.setState({ loaded: false });
      fetch(URL.regValidateOtp, {
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
            // alert(responseJson.statusDetails)
            this.props.history.push("/");
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
            // alert(responseJson.statusDetails)
          }
        })
        .catch((e) => {
          this.setState({ loaded: true });
          notify.show("Failed to connect to server", "custom", 5000, myColor);
        });
    } else {
      notify.show("Please Enter OTP!!", "custom", 5000, myColor);
    }
  };

  registerTandC = () => {
    this.props.history.push("/termsandconditions");
    window.location.reload(false);
  };

  generateOTP (optnType){
    // this.setState({ backToRegister: true});
    this.setState({ OTPValidtaionstatus: "N" });
    let regEmail = new RegExp(/[\w-]+@([\w-]+\.)+([\w-]{2,3})+/);
    let mobileNumberDigits =
      /^(?:(?:\\+|0{0,2})91(\s*[\\-]\s*)?|[0]?)?[6789]\d{9}$/;
    let regCaptcha = new RegExp(/^[A-Za-z0-9!@#$%&*]*$/);
    let myColor = {
      background: "#ff7675",
      text: "#FFFFFF",
    };

    // const botIdentified = sessionStorage.getItem('botIdentified')
    // if (this.state.age.length !== 0 || botIdentified) {
    if (this.state.moble.length !== 0 && this.state.moble.trim() !== "") {
      if (mobileNumberDigits.test(this.state.moble)) {
        if (this.state.email.length !== 0 && this.state.email.trim() !== "") {
          if (regEmail.test(this.state.email)) {
            if (
              this.state.captchaText.length !== 0 &&
              this.state.captchaText.trim() !== ""
            ) {
              let json = {
                emailId: this.state.email.toLowerCase(),
                mobileNum: this.state.moble,
                captchaText: this.state.captchaText,
                captchaRef: this.state.captchaRef,
                optnType: optnType,
              };
              this.setState({ loaded: false });
              fetch(URL.getOtpforVerification, {
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
                    this.setState({ backToRegister: true});
                     confirmAlert({
                       message:
                         "OTP sent to registered email ID and mobile number.",
                       buttons: [
                         {
                           label: "OK",
                           className: "confirmBtn",
                           onClick: () => {
                            this.startResendOtpTimer();

                            this.setState({
                              loaded: true,
                              mobRefNo: responseJson.mobRefNo,
                              emailRefNo: responseJson.emailRefNo,
                            });

                            document.getElementById("mobile").readOnly = true;
                            document.getElementById("email").readOnly = true;
                            document.getElementById(
                              "captchaGroup"
                            ).style.display = "none";
                            document.getElementById("buttonOTP").style.display =
                              "none";
                            document.getElementById("usernames").style.display =
                              "";
                            document.getElementById("passwords").style.display =
                              "";
                            document.getElementById(
                              "registerBtn"
                            ).style.display = "";
                            document.getElementById(
                              "otpContainer"
                            ).style.display = "";
                            document.getElementById("tandc").style.display = "";
                            document.getElementById("corpLink").style.display = "";
                            // document.getElementById("policyterms").style.display = "";
                            // document.getElementById("resendOTP").style.display = "";
                            document.getElementById(
                              "paaswordStrengthBar"
                            ).style.display = "";
                            document.getElementById(
                              "Docupolicy"
                            ).style.display = "none";
                            document.getElementById(
                              "mobileandEmail"
                            ).style.display = "inline-block ";
                            document.getElementById(
                              "mobileandEmail"
                            ).style.width = "100%";
                            document.getElementById(
                              "mobileandEmail"
                            ).style.display = "inline-flex";
                            document.getElementById(
                              "emailGroup"
                            ).style.marginLeft = "3%";
                          },
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
                          onClick: () => {
                            if (responseJson.statusDetails !== "Entered captcha is incorrect") {
                              this.setState({ captchaText: "" });
                              this.getCaptchaCode();
                            }
                          },
                        },
                      ],
                    });
                  }
                })
                .catch((e) => {
                  this.setState({ loaded: true });
                  alert(e);
                  alert("Failed to connect to server", "custom", 5000, myColor);
                });
            } else {
              notify.show("Please enter captcha", "custom", 5000, myColor);
            }
          } else {
            notify.show("Please enter valid email", "custom", 5000, myColor);
          }
        } else {
          notify.show("Please enter your email", "custom", 5000, myColor);
        }
      } else {
        notify.show(
          "Please enter a valid 10 digit mobile number!",
          "custom",
          5000,
          myColor
        );
      }
    } else {
      notify.show("Please enter your mobile number!", "custom", 5000, myColor);
    }
    // } else {
    //   sessionStorage.setItem("botIdentified", true);
    //   alert("Hi Bot!!!");
    // }
  };

  //checking whether consent signing checkboc is enabled or not
  onDocuExecPolicyChecked = () => {
    // var checkedbox = document.getElementById("docuexecplcyChkbox");
    var checkedTandCbox = document.getElementById("registerCheckbox");
    let element1 = document.getElementById("registerBtn");
    if (checkedTandCbox.checked) {
      this.setState({ isregiserBtndisable: false });
    } else {
      this.setState({ isregiserBtndisable: true });
    }
    if (checkedTandCbox.checked) {
      // checkedbox.checked &&
      element1.style.backgroundColor = "#1DD1A1";
      element1.style.cursor = "pointer";
    } else {
      element1.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
      element1.style.cursor = "no-drop";
    }
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
  openModalForCorpAccount = (event) => {
    if (document.getElementById("corpLinkInput").checked) {
      var json = {
      };
      fetch(URL.getCorpDetails, {
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
            let convertedJsArry = this.convertJsonFormat(responseJson.details, true);
            this.setState({
              corpAcctDetail: convertedJsArry,
              allowModal: true
            })
          }
          else if (responseJson.statusDetails === "Session Expired") {
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
            this.props.history.push("/");
          }
          else {
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
        corpAcctDetail: [],
        curntCrpId: ""
      })
    }
  };

  //--------------Disable the Cut Copy Paste----------------------
  onPaste() {
    $(document).ready(function () {
      $("#mobile").bind("cut copy paste", function (e) {
        e.preventDefault();
      });
    });
  }
  //---------------Navigation to Login Page-----------------------
  loginPage = () => {
    this.props.history.push("/login");
    window.location.reload(false);
  };

  //---------------Generate New Captcha---------------------------
  getCaptchaCode = () => {
    this.setState({ loaded: false });
    fetch(URL.getCaptchaCode, {
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
          this.setState({ loaded: true });
          this.setState({ captchaRef: responseJson.captchaRefNo });
          var resDataImg = responseJson.captchaImg;
          // console.log(resDataImg);
          //Set the Base64 string return from getCaptchaCode api to state.
          document
            .getElementById("imgElem")
            .setAttribute("src", "data:image/jpg;base64," + resDataImg);
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
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
  };

  // resend otp counter
  startResendOtpTimer = () => {
    this.setState({ timeleft: 30 });
    let timerElement = document.getElementById("timer");
    let resendOtpBtn = document.getElementById("resendOTP");
  
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
  
  stopResendOtpTimer = () => {
    if (timerEvent) {
      clearInterval(timerEvent);
      timerEvent = null; // Set timerEvent to null after clearing it
    }
  };

  // resend otp counter
  // resendOtpTimer = () => {
  //   this.setState({ timeleft: 30 });
  //   document.getElementById("resendOTP").style.display = "none";
  //   document.getElementById("timer").style.display = "";

  //   var timeleft = this.state.timeleft;
  //   timerEvent = setInterval(function () {
  //     if (timeleft < 0) {
  //       clearInterval(timerEvent);
  //       document.getElementById("resendOTP").style.display = "";
  //       document.getElementById("timer").style.display = "none";
  //     } else {
  //       document.getElementById("timer").innerHTML =
  //         "Resend OTP in " + timeleft + " Secs";
  //     }
  //     timeleft -= 1;
  //   }, 1000);
  // };

  // Function to go back to the Login form
  goBackToRegister = () => {
    this.stopResendOtpTimer();
    this.setState({ backToRegister: false});
    this.getCaptchaCode();
    this.setState({ captchaText: "" });
    // this.setState({ emailOtp: "" });
    // this.setState({ mobileNumOtp: "" });
    this.setState({ password: "" });
    this.setState({ repassword: "" });
    this.setState({ username: "" });
    this.setState({ emailOtp: "" });
    this.setState({ mobileNumOtp: "" });
    this.setState({  })
    this.setState({ isregiserBtndisable: true });
    document.getElementById("registerCheckbox").checked = false;

    document.getElementById("captcha2").style.display = "";
    document.getElementById("mobile").readOnly = false;
    document.getElementById("email").readOnly = false;
    document.getElementById("timer").style.display = "none";
    document.getElementById("captchaGroup").style.display = "";
    document.getElementById("buttonOTP").style.display = "";
    document.getElementById("usernames").style.display = "none";
    document.getElementById("passwords").style.display = "none";
    document.getElementById("registerBtn").style.display = "none";
    document.getElementById("otpContainer").style.display = "none";
    document.getElementById("tandc").style.display = "none";
    // document.getElementById("policyterms").style.display = "";
    document.getElementById("resendOTP").style.display = "none";
    document.getElementById("paaswordStrengthBar").style.display = "none";
    document.getElementById("Docupolicy").style.display = "";
    document.getElementById("mobileandEmail").style.display = "inline-block ";
    document.getElementById("mobileandEmail").style.width = "100%";                        
    // document.getElementById("mobileandEmail").style.display = "inline-flex";                        
    document.getElementById("emailGroup").style.marginLeft = "0%";
    // document.getElementById("backToReg").style.display = "none";
    document.getElementById("corpLink").style.display = "none";
  };

  // to close the modal opened to collect the corp details...
  closeTheModal = (event, boolean) => {
    if (boolean) {
      document.getElementById("corpLinkInput").checked = false;
      this.setState({
        listOfSubGrp: [],
        curntSubGrpList: [],
        corpEntity: {}
      })
    }
    this.setState({
      allowModal: false
    })
  }


  // api to get the list  of subgroup under the corp account.
  getSubgrpForThatcorp = (event) => {
    if (event.target.value !== '') {
      let corpId = event.target.value;
      var json = {
        corpId: corpId
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
                curntCrpId: corpId
              })
              alert(`No groups are available under the corporate account "${document.getElementById("corpEntyDrpdown").value}"`);
            }
            else {
              let convertedJsArry = this.convertJsonFormat(responseJson.details, false);
              this.setState({
                listOfSubGrp: convertedJsArry,
                curntSubGrpList: convertedJsArry,
                curntCrpId: corpId
              })
            }
          }
          else if (responseJson.statusDetails === "Session Expired") {
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
            this.props.history.push("/");
          }
          else {
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
        corpEntity: corpEntity
      })
      console.log(corpEntity);
      this.closeTheModal(event, false);
    }
  }

  openModalForCustFieldDetail = () => {
    return (
      <div>
        <div className='inputHolderCss scrollbarxCustomFields'>
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
                  <select className='inputCss' id="corpEntyDrpdown" onChange={e => this.getSubgrpForThatcorp(e)}>
                    <option key="defaultSelect" value='' disabled={false} hidden={false} >Select</option>
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
                        <div className="GrpList" style={{ width: "100%", height: "fit-content", border: "3px solid #9dc1e3", fontSize: "13px", borderRadius: "5px", padding: "5px" }}>
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
            <button className='cancelbtn' type='button' onClick={e => this.closeTheModal(e, true)}>Cancel</button>
            <button className='proceedbtnX' type='button' onClick={e => this.addCorpDetails(e)}>Submit</button>
          </div>
        </div>
      </div>
    )
  }


  render() {
    return (
      <div className="app flex-row align-items-center">
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
        <Container>
          <div className="isign-logo">
            <img style={{ height: "100%" }} src={mySignLogo}></img>
          </div>
          <Row className="justify-content-center">
            <Col md="11" lg="22" xl="7">
              <Card id="cardBody" className="mx-5">
                <CardBody className="p-3">
                  {(this.state.backToRegister) && (<Button id="backToReg" style={{ color: "black", background: "#f0f3f5", height: "30px", width: "60px" }} onClick={this.goBackToRegister}>
                    <div style={{ marginTop: "-12px", fontSize: "x-large", color: "grey" }}>&larr;</div>
                  </Button>)}
                  <Form>
                    <h2 class="text-center mb-3">Register </h2>

                    <div id="mobileandEmail">
                      <InputGroup className="mb-2 ">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-screen-smartphone"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          id="mobile"
                          type="text"
                          name="mobile"
                          placeholder="Mobile Number"
                          autoComplete="off"
                          onChange={this.setInput}
                          value={this.state.moble}
                          minLength="10"
                          maxLength="10"
                          onpaste={this.onPaste()}
                        />
                      </InputGroup>
                      <InputGroup id="emailGroup" className="mb-2 ">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>@</InputGroupText>
                        </InputGroupAddon>

                        <Input
                          id="email"
                          type="email"
                          name="email"
                          placeholder="Email"
                          autoComplete="off"
                          onChange={this.setInput}
                          value={this.state.email}
                          maxLength="60"
                          required={true}
                        />
                      </InputGroup>

                      <InputGroup id="captchaGroup" className="mb-2 ">
                        <Input
                          id="captcha2"
                          type="text"
                          name="captchaCode"
                          style={{ height: "auto" }}
                          placeholder="Enter Captcha"
                          autoComplete="off"
                          onChange={this.setInput}
                          value={this.state.captchaText}
                          required={true}
                          maxLength={6}
                        />

                        <div
                          id="captcha1"
                          style={{
                            border: "1px solid gainsboro",
                            borderRadius: "0px 5px 5px 0px",
                            height: "62px",
                            width: "185px",
                          }}
                        >
                          <img
                            id="imgElem"
                            style={{ padding: "5px 0px 5px 1px" }}
                          ></img>

                          <span title="Generate new captcha">
                            <Refresh
                              className={"refresh-spin"}
                              onClick={this.getCaptchaCode}
                              style={{
                                verticalAlign: "bottom",
                                paddingBottom: "5px",
                                cursor: "pointer",
                                color: "#20a8d8",
                                fontSize: "xx-large",
                              }}
                              fontSize={"medium"}
                            />
                          </span>
                        </div>
                      </InputGroup>

                      {/* <InputGroup className="mb-2 " style={{ display: "none" }}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa-child"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          id="age"
                          type="text"
                          name="age"
                          placeholder="Age"
                          autoComplete="off"
                          onChange={this.setInput}
                          value={this.state.age}
                          minLength="2"
                          maxLength="3"
                          onpaste={this.onPaste()}
                        />
                      </InputGroup> */}
                    </div>
                    <InputGroup
                      id="otpContainer"
                      className="mb-0"
                      style={{ display: "none" }}
                    >
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        style={{ height: "35px", display: "" }}
                        id="otpContainer"
                        type="text"
                        name="mobileNumOtp"
                        placeholder="Enter Mobile OTP"
                        autoComplete="off"
                        onChange={this.setInput}
                        value={this.state.mobileNumOtp}
                        maxLength="6"
                        minLength="6"
                      />
                      <InputGroupAddon className=" ml-3" addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        style={{ height: "35px", display: "" }}
                        id="otpContainer"
                        type="text"
                        name="emailOtp"
                        placeholder="Enter Email OTP"
                        autoComplete="off"
                        onChange={this.setInput}
                        value={this.state.emailOtp}
                        maxLength="6"
                        minLength="6"
                      />
                    </InputGroup>
                    <div>
                      <div
                      // id="resendOTP"
                      // class="text-right mt-0 mb-0"
                      // style={{ display: "none" }}
                      >
                        {/* <a href="#" onClick={this.generateOTP}>
                          Resend OTP ?
                        </a> */}
                        <span
                          id="timer"
                          style={{
                            verticalAlign: "-webkit-baseline-middle",

                            marginLeft: "5px",
                            marginTop: "3%",
                            marginBottom: "3%",
                            display: "",
                            color: "#73818f",
                            fontSize: "0.875rem",
                          }}
                        ></span>{" "}
                        <Button
                          style={{
                            // marginRight: "-95px",
                            float: "right",
                            display: "none",
                          }}
                          color="link"
                          className="px-0"
                          id="resendOTP"
                          // title="OTP based Reset Password"
                          onClick={()=>this.generateOTP("REGRES")}
                        >
                          Resend OTP ?
                        </Button>
                      </div>

                      <div>
                        <InputGroup
                          style={{ display: "none", marginTop: "1%" }}
                          className="mb-2"
                          id="usernames"
                        >
                          {/* <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            id="loginname"
                            type="text"
                            name="loginname"
                            placeholder="User Name"
                            autoComplete="off"
                            onChange={this.setInput}
                            value={this.state.loginname}
                            maxLength="25"
                            minLength="4"
                            required={true}
                          /> */}
                          <InputGroupAddon
                            // className=" ml-3"
                            addonType="prepend"
                          >
                            <InputGroupText>
                              <i className="icon-user"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Full Name"
                            autoComplete="off"
                            onChange={this.setInput}
                            value={this.state.username}
                            maxLength="25"
                            minLength="4"
                            required={true}
                          />
                        </InputGroup>
                      </div>
                      <div>
                        <InputGroup
                          style={{ display: "none" }}
                          className="mb-0"
                          id="passwords"
                        >
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            id="myPassword"
                            type="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="off"
                            title="Password should contain atleast 1 Capital letter, 1 Small letter, 1 Numeric and 1 Special character"
                            onChange={this.setInput}
                            value={this.state.password}
                            maxLength="30"
                            required={true}
                          />

                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i
                                className="fa fa-unlock"
                                onMouseOver={this.passwordoverPass}
                                onMouseOut={this.passwordoutPass}
                              ></i>{" "}
                            </InputGroupText>
                          </InputGroupAddon>

                          <InputGroupAddon className="ml-3" addonType="prepend">
                            <InputGroupText>
                              <i className="icon-lock"></i>
                            </InputGroupText>
                          </InputGroupAddon>
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
                            required={true}
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
                      </div>
                      <div className="ml-0">
                        <InputGroup
                          id="paaswordStrengthBar"
                          style={{ display: "none" }}
                        >
                          <div class="col">
                            <PasswordStrengthBar
                              className="ml-0"
                              shortScoreWord="too short"
                              scoreWords={[
                                "weak",
                                "weak",
                                "good",
                                "strong",
                                "very strong",
                              ]}
                              password={this.state.password}
                            />
                          </div>
                          <div class="col-xl-0"></div>

                          <div class="col">
                            <PasswordStrengthBar
                              className="ml-0"
                              shortScoreWord="too short"
                              scoreWords={[
                                "weak",
                                "weak",
                                "good",
                                "strong",
                                "very strong",
                              ]}
                              password={this.state.repassword}
                            />
                          </div>
                        </InputGroup>
                      </div>

                      <div>
                        <div
                          id="tandc"
                          style={{ display: "none", marginBottom: "10px" }}
                          class="ml-0"
                        >
                          <input
                            className="mb-1 ml-0"
                            type="checkbox"
                            name="acceptance"
                            id="registerCheckbox"
                            onChange={this.onDocuExecPolicyChecked}
                          ></input>
                          <a
                            className="mb-1 "
                            style={{ fontSize: "13px", marginLeft: "5px" }}
                            href={
                              this.state.TandConditionPage +
                              "/termsandconditions"
                            }
                            // onClick={(e)=>{e.preventDefault();this.props.history.push("/termsandconditions")}}
                            target="_blank"
                          >
                            I agree with all the terms and conditions of
                            DocuExec
                          </a>
                        </div>
                        
                        <div>
                        <div
                          id="corpLink"
                          class="ml-0"
                          style={{ display: "none", marginBottom: '5px' }}
                        >
                          <input
                            className="mb-1 ml-0"
                            type="checkbox"
                            name="acceptance"
                            id="corpLinkInput"
                            onChange={e => this.openModalForCorpAccount(e)}

                          ></input>
                          <span style={{ color: "#20a8d8", paddingLeft: "5px", fontSize: "13px" }}>
                            Corporate user?
                          </span>
                        </div>
                      </div>
                        <div style={{ display: "none" }} id="policyterms">
                          <input
                            className="mb-3"
                            type="checkbox"
                            name="acceptance"
                            id="docuexecplcyChkbox"
                            onChange={this.onDocuExecPolicyChecked}
                          ></input>
                          <a
                            style={{ fontSize: "13px", marginLeft: "5px" }}
                            href={
                              this.state.PrivacyPolicyPage + "/privacypolicy"
                            }
                            target="_blank"
                          >
                            I agree with Privacy policy of DocuExec
                          </a>
                        </div>
                      </div>
                      <p
                        class="text-center mt-1 mb-0"
                        id="Docupolicy"
                        style={{
                          marginBottom: "20px",
                          marginTop: "5px",
                        }}
                      >
                        <a
                          style={{ fontSize: "13px" }}
                          href={
                            this.state.TandConditionPage + "/termsandconditions"
                          }
                          target="_blank"
                        >
                          DocuExec Terms
                        </a>
                        {/* <span style={{ marginLeft: "4px" }}> and</span>
                        <a
                          style={{
                            fontSize: "13px",
                            marginLeft: "5px ",
                          }}
                          href={this.state.PrivacyPolicyPage + "/privacypolicy"}
                          target="_blank"
                        >
                          Privacy Policy
                        </a> */}
                      </p>

                      <Button
                        style={{ display: "none" }}
                        id="registerBtn"
                        color="success"
                        disabled={this.state.isregiserBtndisable}
                        block
                        onClick={this.register}
                      >
                        Register Account
                      </Button>
                      <Button
                        id="otpBtn"
                        color="success"
                        style={{ display: "none" }}
                        block
                        onClick={this.validateOTP}
                      >
                        Verify OTP
                      </Button>
                      <div id="buttonOTP" className="text-center ">
                        {" "}
                        <Button
                          id="otpBtn"
                          color="success"
                          onClick={()=>this.generateOTP("REGTIN")}
                        >
                          Generate OTP to Register
                        </Button>
                      </div>

                      <p class="text-center mt-1 mb-0">
                        <a href={this.state.PrivacyPolicyPage + "/Login"}>
                          Already Registered? Login
                        </a>
                      </p>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>{" "}
          </Row>
        </Container>
        <div className="fixed-bottom">
          <footer class="app-footer">
            <span id="footer">
              <a href="https://www.integramicro.com/" target="_blank">
                <img
                  src="/static/media/IntegraLogo.50ad4a4c.png"
                  width="45px"
                />
              </a>{" "}
              {URL.footerContent}
            </span>
          </footer>
        </div>
        <Modal className='inputTakingModel' onClose={e => this.closeTheModal(e, true)} open={this.state.allowModal} center={true} closeOnOverlayClick={false}>
          <div className='WholeContent'>
            <div className='headingOfModalXcss'>
              <span style={{ fontSize: "20px" }}>Corporate Information</span>
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

export default Register;
