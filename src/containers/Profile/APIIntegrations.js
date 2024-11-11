import React from "react";
import {
  Button,
  Col,
  Row,
  Input,
} from "reactstrap";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Modal from "react-responsive-modal";
import "../Inbox/inbox.css"
import Notifications, { notify } from "react-notify-toast";
import '../DigiLocker/DigiLocker.css'
import ApiKeyList from "./ApiKeyList";
var Loader = require("react-loader");
var timerEvent = null;

export default class APIIntegrations extends React.Component {
  constructor(props) {
    super(props);
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
      roleId: "",
      modalOpen: false,
      appName: '',
      description: '',
      apiKey: '',
      showApiKeyList: true, // Flag to control rendering of ApiKeyList
      apiKeyLimit: false,
    };
     // Bind your methods in the constructor
     this.restrictNameInput = this.restrictNameInput.bind(this);
     this.generateAPIKeys = this.generateAPIKeys.bind(this);
     this.validateInputs = this.validateInputs.bind(this);
  }

  setApiKeyLimit = (value) => {
    this.setState({ apiKeyLimit: value });
  }

  setIsDisabledState = (value) => {
    this.setState({ isDisabled: value });
  }

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

    toggleModal = () => {
      // console.log(this.state.apiKeyLimit);
      if (this.state.apiKeyLimit) {
        confirmAlert({
          message: "Generation of API Key limit reached. Please delete an existing key to generate a new one.",
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
              onClick: () => {},
            },
          ],
        });
      } else {
        this.setState({ modalOpen: !this.state.modalOpen });
        this.setState({ appName: ""});
        this.setState({ description: ""});
      }
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleKeyPress = (event) => {
        const regex = /^[a-zA-Z0-9 ]*$/; // Allow only alphanumeric characters and spaces
        if (!regex.test(event.key)) {
        event.preventDefault();
        }
    };

    restrictNameInput = (e) => {
        const regex = /^[a-zA-Z0-9 ]*$/;
        if (!regex.test(e.key)) {
        e.preventDefault();
        }
    };

    //Generate API Key call
    generateAPIKeys = (e) => {
        let validationSuccess = this.validateInputs();
        if (validationSuccess) {
        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
        var json = {
            appName: this.state.appName,
            description: this.state.description,
        };
        fetch(URL.generateapikey, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${jsonWebToken}`
            },
            body: JSON.stringify(json)
        })
            .then((response) => {
            return response.json();
            })
            .then((responseJson) => {
            this.setState({ loaded: true });
            if (responseJson.status === "SUCCESS") {
                this.setState({ loaded: true });
                confirmAlert({
                message: responseJson.statusDetails+". Keep it secure.",
                buttons: [
                    {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {window.location.reload(true);},
                    },
                ],
                });
            } else if (responseJson.statusDetails === "Session Expired") {
                confirmAlert({
                message: responseJson.statusDetails,
                buttons: [
                    {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => { this.props.history.push("/login"); },
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
                    onClick: () => { },
                    },
                ],
                });
            }
            })
            .catch((e) => {
            this.setState({ loaded: true });
            console.log(e);
            });
          }
    };

    validateInputs = () => {
      if (!this.state.appName) {
        confirmAlert({
          message: "App Name is required",
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
              onClick: () => { },
            },
          ],
        });
        return false;
      } else if (!this.state.description) {
        confirmAlert({
          message: "Description is required",
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
              onClick: () => { },
            },
          ],
        });
        return false;
      } else {
        return true;
      }
    };

    // componentDidUpdate(prevProps, prevState) {
    //   if (prevState.roleId !== this.state.roleId) {
    //     // Role ID has changed, trigger any additional rendering logic here
    //     console.log("Role ID updated:", this.state.roleId);
    //     this.setState({ showApiKeyList: true });
    //     // You can add any additional logic here, such as fetching data based on the new roleId
    //   }
    // }

  render() {
    // let roleID = this.state.roleId;
    // console.log(roleID);
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
        <Col xs="12" sm="6" md="6" lg="12">
            {/* <Card hidden={sessionStorage.getItem("roleID") !== "7"}> */}
              {/* <CardHeader> */}
                {/* <b>API Keys</b> */}
              {/* </CardHeader> */}
              {/* <CardBody className="p-4"> */}
                <div id="apiKeyGeneration" hidden={sessionStorage.getItem("roleID") !== "6"}>
                  {/* <div style={{ marginBottom: "10px", marginLeft: "-12px" }}> */}
                  <div style={{borderLeft: "5px solid grey", padding: "10px", background: "rgb(232, 234, 245)"}}>
                  <i class="fa fa-info-circle" aria-hidden="true" style={{ color: "grey"}}></i> To securely connect to DocuExec API(s), your application should use an API key with the necessary permissions to access the services.
                  </div>
                  <Button className="btn btn-success" onClick={this.toggleModal} style={{ float: "left", marginBottom: "20px", marginTop: "15px" }} disabled={this.state.isDisabled}>Generate New API Key</Button>
                </div>
              {/* </CardBody> */}
            {/* </Card> */}
        </Col>
        </Row>

        {this.state.showApiKeyList && ((sessionStorage.getItem("roleID") === "6") && (<ApiKeyList roleId={sessionStorage.getItem("roleID")} setApiKeyLimit={this.setApiKeyLimit} setIsDisabledState={this.setIsDisabledState}/>))}

        <Modal open={this.state.modalOpen} onClose={this.toggleModal} center={true} closeOnOverlayClick={false} id="apiKeyModal" >
          {/* <div style={{ width: "24% !important"}}> */}
        <h2 style={{ color: "rgb(199, 152, 7)", width: "320px", display: "flex", justifyContent: "center" }} >Generate API Key</h2>
          <form>
              <div className="form-group">
                <label htmlFor="appName">App Name<em style={{ color: "red"}}>*</em></label>
                <Input
                  type="text"
                  name="appName"
                  id="appName"
                  value={this.state.appName}
                  onChange={this.handleInputChange}
                  onKeyPress={this.restrictNameInput}
                  autoComplete="off"
                  maxLength={56}
                  placeholder="Enter app name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description<em style={{ color: "red"}}>*</em></label>
                <Input
                  type="textarea"
                  name="description"
                  id="description"
                  value={this.state.description}
                  onChange={this.handleInputChange}
                  onKeyPress={this.restrictNameInput}
                  autoComplete="off"
                  placeholder="Enter description"
                />
              </div>
              <Button color="success" onClick={this.generateAPIKeys} style={{ float: "right" }}>Generate</Button>
            </form>
            {/* </div> */}
        </Modal>
      </div>
    );
  }
}