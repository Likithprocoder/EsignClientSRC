import React, { Component } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  CardHeader,
  Input,
  InputGroup,
} from "reactstrap";
import { URL } from "../URLConstant";
import "./VoucherSubscription.css";
import $ from "jquery";
import PDF1 from "../Download/PDF1";
import { confirmAlert } from "react-confirm-alert";
import Modal from "react-responsive-modal";

var Loader = require("react-loader");
class VoucherSubscription extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responsedata: [],
      inQueueplan: false,
      isConsentdisable: true,
      loadSubscriptionComponent: false,
      loaded: true,
      openRedeemModal: false,
      amount: "",
      signMode: "",
      storage: "",
      voucherQuantity: "",
      voucherType: 1,
      planId: "",
      disable: true,
      descrip: "",
      checkboxValue: 1,
      isUserCodeEnabled: false,
      definedVoucherCode: "",
      listOfSubGrp: [],
      corpAcctDetail: [],
      curntSubGrpList: [],
      corpEntity: {},
      curntCrpId: "",
      corpUsage: 1,
      tempGroupsCheckBox: 1,
      voucherUsageType: "Corporate Users Only" // Default value

    };
  }

  componentWillMount() {
    if (sessionStorage.getItem("consenteSign") === "true") {
      if (sessionStorage.getItem("consentFlag") === "N") {
        // this.onOpenFirstModel();
      } else {
        this.setState({ loadSubscriptionComponent: true });
      }
    } else {
      this.setState({ loadSubscriptionComponent: true });
    }
  }

  componentDidMount() {
    if (this.state.loadSubscriptionComponent) {
    } else {
      if (this.state.isConsentdisable) {
        let element = document.getElementById("submitConsentbutton");
        element.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
        element.style.cursor = "no-drop";
      }
    }
    //checking if the user is normal enduser because  the template groups should be displayed only for the corporate admin.
    const roleId = sessionStorage.getItem("roleId");
    if ((roleId && roleId.trim() == 2)) {

    } else {
      this.getTemplateGrps();
    }


    var body = {
      username: "",
    };
    // this.setState({ loaded: false });
    fetch(URL.getSubscriptionLists, {
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
          this.setState({ responsedata: responseJson.list });
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
  }

  setInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    // const value = e.target.value.replace(/[^0-9]/g, "");
    if (value !== undefined && value !== null) {
      // Apply regex to allow only up to 6 numeric characters
      value = value.replace(/\D/g, "").slice(0, 6);
      value = value.replace('e', '');
    }



    if (name === "voucherquantity") {
      this.setState({ disable: false });
      if (value.trim() !== "" && value !== "0") {
        this.setState({ voucherQuantity: value });
      } else {
        this.setState({ voucherQuantity: "" });
        this.setState({ disable: true });
      }
    }

    if (name === "select") {
      this.setState({ voucherType: e.target.value == "Same Voucher Code" ? 1 : 0 });

      if (e.target.value == "Same Voucher Code") {
        document.getElementById("userDefinedVoucherCode").style.display = "";
      }
      else {
        document.getElementById("userDefinedVoucherCode").style.display = "none";

      }


      if (this.state.voucherQuantity.trim() !== "" && this.state.voucherQuantity !== "0") {
        this.setState({ disable: false });
      } else {
        this.setState({ disable: true });
      }
    }

    if (name === "checkbox") {

      this.setState({ checkboxValue: e.target.checked ? 1 : 0 });
      if (this.state.voucherQuantity.trim() !== "" && this.state.voucherQuantity !== "0") {
        this.setState({ disable: false });
      } else {
        this.setState({ disable: true });
      }
    }

    // to set the corpUsage value to 1 if the voucher should be used by corporate users only
    // if (name === "usageType") {
    //   this.setState({ corpUsage: e.target.value == "Corporate Users Only" ? 1 : 0 });
    // }

    //  if(e.target.value == "Any user"){
    //   this.setState({ tempGroupsCheckBox:0})
    //   document.getElementById("tempGrpsList").style.display = "none";
    //   document.getElementById("tempGrpLabel").style.display = "none";

    // }else{
    //   this.setState({ tempGroupsCheckBox:1})
    //   document.getElementById("tempGrpsList").style.display = "";
    //   document.getElementById("tempGrpLabel").style.display = "";
    // }

    if (name === "tempGroups") {

      this.setState({ tempGroupsCheckBox: e.target.checked ? 1 : 0 });
      if (e.target.checked == 0) {
        document.getElementById("tempGrpsList").style.display = "none";

        //unchecking all the template grp checkboxes 
        for (let key in this.state.curntSubGrpList) {
          const subGrpId = this.state.curntSubGrpList[key][Object.keys(this.state.curntSubGrpList[key])[0]];
          const checkboxElement = document.getElementById(subGrpId);
          if (checkboxElement) {
            if (checkboxElement.checked) {
              checkboxElement.checked = false;
            }
          }
        }


      } else {
        document.getElementById("tempGrpsList").style.display = "";
      }
    }



  };

  // handleChange = (e) => {
  //   const isAnyUser = e.target.value === "Any user";
  //   this.setState({ corpUsage: e.target.value == "Corporate Users Only" ? 1 : 0 });
  //   this.setState({ isAnyUser });
  // }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
    this.setState({ corpUsage: e.target.value == "Corporate Users Only" ? 1 : 0 });
  }


  custUnitstoQrCode = (e, i) => {



    const { name, value } = i.target;
    let responsedata = [...this.state.responsedata];
    if (name === "planID") {
      responsedata[i] = { ...responsedata[i], [name]: value };
      this.setState({ responsedata });
    }
    var planId = responsedata[e].planId;
    var amount = "";
    var planList = $(this)[0].state.responsedata;
    planList.forEach((element) => {
      if (element.planId == planId) {
        amount = element.amount;
      }
    });

    this.setState({ amount: amount });
    this.setState({ planId: planId });

    this.setState({
      openRedeemModal: true,
    });

    this.state.responsedata.map((el, i) => {
      if (el.amount == amount) {
        this.setState({ signMode: el.signs });
        this.setState({ storage: el.storage });
        this.setState({ descrip: el.descrip });
      }
    });

  };

  createUI() {
    // console.log(this.state.responsedata);
    return this.state.responsedata.map((el, i) => (
      <div className="align-items-center">
        {/* {console.log(el.signs)} */}
        {/* {console.log(el.storage)} */}
        <div key={i}>
          {/* {console.log({el})} */}
          <Col xs="11" sm="4" md="3">
            <Card id="subscard">
              <CardHeader>
                <div id="discriptionspan">
                  <b>{el.descrip}</b>
                  <br />
                </div>
              </CardHeader>
              <CardBody>
                <p id="amountspan">
                  <b>₹ {el.amount}</b>
                </p>
                <p id="paratag">
                  {el.signs} Electronic Signs
                  <br />
                  &nbsp;{el.storage} Storage
                  <br />
                </p>
                <div className="purchaseBtn">
                  <button
                    className="aggree-button"
                    value={el.planId || ""}
                    name="planID"
                    // onClick={this.redeemVoucher}
                    onClick={this.custUnitstoQrCode.bind(this, i)}
                    id="buyBtn"
                  // name={el.planId}
                  >
                    <span>Buy Voucher </span>
                  </button>
                </div>
                {/* <hr className="card-seperation"></hr>
                <div className="voucherBtn">
                <button
                  className="aggree-button"
                  // value={el.planId || ""}
                  // name="planID"
                  // onClick={this.custUnitstoQrCode.bind(this, i)}
                  id="redeemBtn"
                  // name={el.planId}
                  onClick={this.redeemVoucher}
                >
                  <span><i className="icon-ticket"></i>Redeem Voucher<div class="question-mark-container">
                  <span class="question-mark"> ?</span>
                </div></span>
                </button>
                </div> */}
              </CardBody>
            </Card>
          </Col>
        </div>
      </div>
    ));
  }

  getQRDetails = (definedVoucherCode) => {



    if (this.state.voucherQuantity > 100000) {

      alert("Maximum of 1 Lakh vouchers can be purchased at a time.");
    } else {
      let additional_data = {
        numOfVouchers: parseInt(this.state.voucherQuantity),
        voucherType: this.state.voucherType,
        planId: this.state.planId,
        usageType: this.state.checkboxValue,
        vouchrCodeNote: "The request has been successfully initiated. Please be advised that the generation of voucher codes necessitates a certain amount of time. Kindly check for the generated voucher codes at a later juncture. Your patience is highly appreciated."
      };
      // if the voucher is defined by the user then the voucher code will be added to the additional data
      if (definedVoucherCode && definedVoucherCode.trim() !== "") {
        additional_data.voucherCode = definedVoucherCode;
      }
      //If the Corp admin is purhasing voucher the below parameters will be added to the additional data

      //     if (this.state.listOfSubGrp.length !== 0) {
      //       additional_data.corpId = this.state.curntCrpId;
      //       if(!this.state.voucherUsageType=="Any User"){
      //       // if(this.state.tempGroupsCheckBox==1){
      // console.log(this.state.tempGroupsCheckBox)
      //       let corpSubGrpSelected = [];
      //       // Adding the list of selected template groups to the additional data
      //       for (let key in this.state.curntSubGrpList) {
      //         if (document.getElementById(this.state.curntSubGrpList[key][Object.keys(this.state.curntSubGrpList[key])[0]]).checked) {
      //           corpSubGrpSelected.push(Object.keys(this.state.curntSubGrpList[key])[0]);
      //         }
      //       }

      //       let templtGrps = { "templtGrps": corpSubGrpSelected };
      //       // if(templtGrps.length!==0){
      //         additional_data = { ...additional_data, ...templtGrps};
      //       // }
      //     // }
      //   }

      //If the Corp admin is purhasing voucher the below parameters will be added to the additional data
      if (this.state.listOfSubGrp.length !== 0) {
        additional_data.corpId = this.state.curntCrpId;
        additional_data.corpUsage = this.state.corpUsage;
        if (this.state.voucherUsageType !== "Any User") {
          // console.log(this.state.tempGroupsCheckBox);
          let corpSubGrpSelected = [];
          // Adding the list of selected template groups to the additional data
          for (let key in this.state.curntSubGrpList) {
            const subGrpId = this.state.curntSubGrpList[key][Object.keys(this.state.curntSubGrpList[key])[0]];
            const checkboxElement = document.getElementById(subGrpId);
            if (checkboxElement) {
              if (checkboxElement.checked) {
                corpSubGrpSelected.push(Object.keys(this.state.curntSubGrpList[key])[0]);
              }
            }
          }
          if (corpSubGrpSelected.length > 0) {
            let templtGrps = { "templtGrps": corpSubGrpSelected };
            additional_data = { ...additional_data, ...templtGrps };
          }
        }

      }
      let data = {
        paymentType: "VOUC",
        amount: this.state.amount * this.state.voucherQuantity,
        additional_data: additional_data,
      };
      // console.log(data);
      this.props.history.push({
        pathname: "/qrcode",
        frompath: "/vouchers/vouchersubscription",
        state: {
          details: data,
        },
      });


    }
  };

  getValidation = () => {
    //diff voucher code
    if (this.state.voucherType == 0) {
      this.getQRDetails();
    }

    //same voucher code
    else {
      //if userdefined code is enabled - validations
      if (this.state.isUserCodeEnabled) {
        let definedVoucherCode = document.getElementById("userCode").value.trim();

        // let definedVoucherCode = this.state.definedVoucherCode
        if (definedVoucherCode == "") {
          alert("Enter custom code for vouchers")
        }
        else {

          if (definedVoucherCode.length != 10) {
            alert("Enter 10 digit code")
          }

          else {
            //duplication check
            var body = {
              voucherCode: definedVoucherCode
            };
            let jsonWebToken = sessionStorage.getItem("jsonWebToken");
            this.setState({ loaded: false });
            fetch(URL.checkVoucherCodeAvailability, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${jsonWebToken}`
              },
              body: JSON.stringify(body),
            })
              .then((response) => {
                return response.json();
              })
              .then((responseJson) => {
                // response_data = responseJson;
                if (responseJson.status === "SUCCESS") {
                  this.setState({ loaded: true });
                  this.getQRDetails(definedVoucherCode);

                } else {
                  this.setState({ loaded: true });
                  alert(responseJson.statusDetails)
                }
              })
              .catch((e) => {
                this.setState({ loaded: true });
                alert(e);
              });
          }
        }
      }
      else {
        this.getQRDetails();
      }
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

  onCloseRedeemModal = () => {
    this.setState({ voucherQuantity: "" });
    this.setState({ disable: true });
    this.setState({ openRedeemModal: false });
  };

  consenteSign = () => {
    let response_data = {};
    var body = {
      loginname: sessionStorage.getItem("username"),
      userIP: sessionStorage.getItem("userIP"),
      consentTnC: "consentTnC",
      docCode: "DOEXCONSENT",
    };
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    this.setState({ loaded: false });
    fetch(URL.consenteSign, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jsonWebToken}`
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
                onClick: () => { },
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



  handleUserCodeCheckboxChange = () => {
    this.setState((prevState) => ({
      isUserCodeEnabled: !prevState.isUserCodeEnabled,
    }));
  };

  setVoucherCode = (e) => {

    let value = e.target.value;

    let filteredValue = value.replace(/[^a-zA-Z0-9]/g, '');


    this.setState({ definedVoucherCode: filteredValue });

  }

  getTemplateGrps = () => {
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    fetch(URL.getTemplateGrps, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jsonWebToken}`
      },
      body: JSON.stringify({}),
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
              // curntCrpId: corpId
              curntCrpId: ""
            })
            alert(`No groups are available under the corporate account "${document.getElementById("corpEntyDrpdown").value}"`);
          }
          else {


            let convertedJsArry = this.convertJsonFormat(responseJson.details, false);
            this.setState({
              listOfSubGrp: convertedJsArry,
              curntSubGrpList: convertedJsArry,
              // curntCrpId: corpId
              curntCrpId: responseJson.corpId,


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

  render() {
    // Define the headers to include in the fetch request
    let headers = {
      Authorization: `Bearer ${sessionStorage.getItem("jsonWebToken")}`
    };
    const {
      openRedeemModal,
      amount,
      voucherQuantity,
      signMode,
      storage,
      descrip,
      checkboxValue,
      tempGroupsCheckBox,
      listOfSubGrp,
      voucherUsageType
    } = this.state;
    // Ensure listOfSubGrp has a default value if not provided
    // const listOfSubGrp = this.props.listOfSubGrp || [];
    if (this.state.loadSubscriptionComponent) {
      return (
        <div id="ModalView">
          <Row className="align-items-center">
            <br></br>
            {this.createUI()}
          </Row>
          {/* {console.log(amount)} */}


          <Modal
            style={{ marginTop: "10%", width: "100%" }}
            className="modal-container"
            open={openRedeemModal}
            onClose={this.onCloseRedeemModal}
            center={true}
            closeOnOverlayClick={false}
          >
            <div className="ModalWidth">
              <div className="modal-head-1">
                <span style={{ color: "#c79807" }}>Buy Voucher</span>
              </div>
              <div className="para-text" id="emailmodalpara-text">
                <div className="para-content">
                  <Row id="redeemmodalrow">
                    <div style={{ marginBottom: "14px", width: "100%" }}>
                      {/* <div> */}
                      <span style={{ display: "inline-flex", width: "52%" }}>
                        Plan Description
                      </span>
                      {descrip}
                      {/* </div> */}
                      <br />
                      <span style={{ display: "inline-flex", width: "52%" }}>
                        Amount({URL.rupeeSymbol})
                      </span>
                      <span>{amount}</span>
                      <br />
                      <span style={{ display: "inline-flex", width: "52%" }}>
                        Electronic Signs
                      </span>
                      <span>{signMode}</span>
                      <br />
                      <span style={{ display: "inline-flex", width: "52%" }}>
                        Storage
                      </span>
                      <span>{storage}</span>
                    </div>
                    <hr class="separator" />
                    <div style={{ width: "100%" }}>
                      <div style={{ marginTop: "14px" }}>
                        <b>Voucher Info</b>
                      </div>
                      {/* <InputGroup className="mb-3"> */}
                      <InputGroup style={{ marginBottom: "6px" }}>
                        <label style={{ display: "inline-flex", width: "52%" }}>
                          No. Of Voucher(s) &nbsp;
                        </label>
                        <Input
                          type="number"
                          id="voucherQnty"
                          placeholder="Enter No. of voucher"
                          title="Enter No. of voucher"
                          name="voucherquantity"
                          onChange={this.setInput}
                          required={true}
                          value={this.state.voucherQuantity}
                          minLength="1"
                          maxLength="6"
                          autoComplete="off"
                        />
                      </InputGroup>
                      <InputGroup style={{ marginBottom: "6px" }}>
                        <label style={{ display: "inline-flex", width: "52%" }}>
                          Voucher Type &nbsp;{" "}
                        </label>
                        <Input
                          id="exampleSelect"
                          name="select"
                          type="select"
                          onChange={this.setInput}
                        >
                          <option>Same Voucher Code</option>
                          <option>Different Voucher Code</option>
                        </Input>
                      </InputGroup>

                      <InputGroup
                        style={{ marginLeft: "20px", marginBottom: "10px" }}
                        id="userDefinedVoucherCode"
                      >
                        <Input
                          type="checkbox"
                          id="userCodeCheckbox"
                          name="checkbox"
                          checked={this.state.isUserCodeEnabled}
                          onChange={this.handleUserCodeCheckboxChange}
                          // value={this.state.voucherQuantity}
                          autoComplete="off"
                        />
                        <label>Voucher Code</label>
                        <Input
                          id="userCode"
                          name="select"
                          type="text"
                          placeholder="Enter voucher code"
                          maxLength="10"
                          minLength="10"
                          onChange={this.setVoucherCode}
                          value={this.state.definedVoucherCode}
                          disabled={!this.state.isUserCodeEnabled}
                          required={this.state.isUserCodeEnabled}
                          style={{ marginLeft: "21%", maxWidth: "48%" }}
                        >
                        </Input>

                      </InputGroup>



                      <InputGroup
                        style={{ marginLeft: "20px", marginBottom: "10px" }}
                      >
                        <Input
                          type="checkbox"
                          id="usageType"
                          name="checkbox"
                          checked={checkboxValue == 1}
                          onChange={this.setInput}
                          required={true}
                          // value={this.state.voucherQuantity}
                          autoComplete="off"
                        />
                        <label>One voucher per user</label>
                      </InputGroup>
                    </div>


                    {listOfSubGrp.length !== 0 && (
                      <>
                        <hr className="separator" />
                        <div style={{ marginTop: "14px" }}>
                          <b>Voucher Usage</b>
                        </div>
                        {/* If the user is corporate admin then the voucher eligibility will be displayed */}
                        <InputGroup id="vrchrEligibilty" style={{ marginBottom: "6px" }}>
                          <label style={{ display: "inline-flex", width: "52%" }}>
                            Voucher Eligibility &nbsp;{" "}
                          </label>
                          <Input
                            id="voucherUsageType"
                            name="voucherUsageType"
                            type="select"
                            onChange={this.handleChange}
                          >
                            <option>Corporate Users Only</option>
                            <option>Any user</option>
                          </Input>
                        </InputGroup>

                        {voucherUsageType !== "Any user" && (
                          <>
                            <InputGroup style={{ marginLeft: "20px" }}>
                              <Input
                                type="checkbox"
                                id="tempGroups"
                                name="tempGroups"
                                checked={tempGroupsCheckBox === 1}
                                onChange={this.setInput}
                                required={true}
                                autoComplete="off"
                              />
                              <label id="tempGrpLabel" style={{ marginBottom: "0px" }}>
                                Select Template Group(s) to access the Voucher
                              </label>
                            </InputGroup>

                            <InputGroup id="tempGrpsList" style={{ marginBottom: "6px" }}>
                              <div key="corpGroups" className="Divo5Css">
                                <div className="inputname1" style={{ paddingTop: "5px" }}>
                                  {listOfSubGrp.length !== 0 ? (
                                    <div
                                      className="GrpList scrollbarxCustomFields"
                                      style={{
                                        width: "140%",
                                        maxHeight: "200px",
                                        height: "fit-content",
                                        border: "3px solid #9dc1e3",
                                        fontSize: "13px",
                                        borderRadius: "5px",
                                        padding: "5px"
                                      }}
                                    >
                                      {listOfSubGrp.reduce((result, value, index, array) => {
                                        if (index % 2 === 0) {
                                          result.push(array.slice(index, index + 2));
                                        }
                                        return result;
                                      }, []).map((pair, index) => (
                                        <div style={{ display: "flex", width: "100%" }} key={index}>
                                          {pair.map((posts, subIndex) => (
                                            <div style={{ display: "flex", flexGrow: 1, width: "50%", alignItems: "center" }} key={subIndex}>
                                              <div style={{ width: "20px", paddingTop: "4px" }}>
                                                <input id={posts[Object.keys(posts)[0]]} type="checkBox"></input>
                                              </div>
                                              <div style={{ width: "90%", paddingTop: "2px" }}>
                                                <span>{posts[Object.keys(posts)[0]]}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <> </>
                                  )}
                                </div>
                              </div>
                            </InputGroup>
                          </>
                        )}
                      </>
                    )}

                    <hr class="separator" />
                    <div
                      id="billSummary"
                      style={{
                        marginTop: "14px",
                        width: "100%",
                        lineHeight: "25px",
                      }}
                    >
                      {/* <div> */}
                      <b>Payment Summary</b>
                      {/* </div> */}
                      <br />
                      <span style={{ display: "inline-flex", width: "52%" }}>
                        Voucher Quantity
                      </span>
                      <span>
                        {" "}
                        {voucherQuantity === "" ? "-" : voucherQuantity}
                      </span>
                      <br />
                      <span style={{ display: "inline-flex", width: "52%" }}>
                        Total Voucher Amount({URL.rupeeSymbol})
                      </span>
                      <span>
                        {" "}
                        {voucherQuantity === ""
                          ? "-"
                          : voucherQuantity * amount}
                      </span>
                    </div>
                  </Row>
                </div>
              </div>
              <div className="submit-details" id="submitBtn">
                <button
                  className="upload-button"
                  onClick={this.getValidation}
                  disabled={this.state.disable}
                  style={
                    this.state.disable
                      ? {
                        cursor: "no-drop",
                        backgroundColor: "rgba(96, 218, 185, 0.78)",
                      }
                      : {}
                  }
                >
                  <span style={{ width: "140px" }}>Proceed &#8594;</span>
                </button>
              </div>
            </div>
          </Modal>
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
                URL.viewConsentFile
                //  +
                // "?at=" +
                // btoa(sessionStorage.getItem("authToken"))
              }
              httpHeaders={headers}
            /* width="100%"
            height="100%"
            hidden */
            />
            <div style={{ marginTop: "20px" }}>
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
export default VoucherSubscription;