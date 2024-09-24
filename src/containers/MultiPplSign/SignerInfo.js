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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faTrashCan,faPlus } from '@fortawesome/free-solid-svg-icons';
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
      declineSigning:false,
      addressBookData: [],
      filteredData: [],
      addressBookGroupData: [],
      showAddressBook: false,
      selectedContact: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('click', this.handleClickOutside);
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
    // this.getEmailValidation();

    document.body.removeEventListener('click', this.handleClickOutside);

    let obj = {
      authToken: sessionStorage.getItem('authToken'),
      operationtype: "SRCH",
      //    groupId:"",
      userid: "8",
    }

    this.fetchAddressBookDetails(obj);
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

  // to make the cursore pointer when
  bigimg = (props, id) => {
    document.getElementById(id).style.cursor = "pointer";
  };

  // handleFocus = (i) => {
  //   this.handleChange.bind(this);
  //   const { signerInfo } = this.state;
  //   const { signerName } = signerInfo[i];

  //   // Close dropdown for all signers except the one being focused
  //   const updatedShowAddressBook = {};
  //   Object.keys(this.state.showAddressBook).forEach((key) => {
  //     if (parseInt(key) !== i) {
  //       updatedShowAddressBook[key] = false;
  //     }
  //   });

  //   // Open dropdown for the focused signer if conditions are met
  //   if (signerName && signerName.length >= 3) {
  //     this.setState({
  //       showAddressBook: {
  //         ...updatedShowAddressBook,
  //         [i]: true,
  //       }
  //     });
  //   } else {
  //     this.setState({
  //       showAddressBook: updatedShowAddressBook,
  //     });
  //   }
  // }

  handleClickOutside = (event) => {
    const addressBookDropdown = document.getElementById('addressBookDropdown');
    const nameInput = document.getElementById('namefield');
    if (addressBookDropdown && !addressBookDropdown.contains(event.target) && !nameInput.contains(event.target)) {
      this.setState({ showAddressBook: false });
    }
  }



  createUI() {
    return this.state.signerInfo.map((el, i) => (
      <div key={i}>
        <div class="horizontal-line">
          <Row className="align-items-center" id="signerRow">
            <span className="signerindex ">{i + 1} </span>
            <div className="input-container">
              <input
                className="signerfield "
                id="namefield"
                placeholder="Signer Name"
                name="signerName"
                value={el.signerName || ""}
                onChange={this.handleChange.bind(this, i)}
                autoComplete="off"
              // onFocus={() => this.setState({ showAddressBook: true })}
              // onFocus={() => this.handleFocus(i)}
              // onFocus={this.handleChange.bind(this, i)}
              // onBlur={() => this.setState({ showAddressBook: false })}
              />
              {el.signerName && el.signerName.length >= 3 && this.state.showAddressBook[i] && (
                <div className="custom-dropdown" id="addressBookDropdown" style={{ maxHeight: '200px', overflowY: 'auto', overflowX: 'auto' }}>
                  {this.state.filteredData.map(contact => (
                    <div key={contact.contactId} className="dropdown-item" id="dropdownItemDiv" onClick={() => { this.handleSelectContact(contact, i); this.setState({ showAddressBook: false }); }} style={{ backgroundColor: contact.contactType === "g" ? "#efdeda" : "#d6f0e9" }}>
                      <div>{contact.contactName}</div>
                      {contact.contactType == "i" ? <div style={{ fontSize: '9px' }}>Email: {contact.emailId}, Mobile: {contact.mobileNo}</div> : <div style={{ fontSize: '8px' }} >(Group)</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <input
              className="signerfield "
              placeholder="Signer Mobile"
              id="mlplsignerName"
              name="signerMobile"
              value={el.signerMobile || ""}
              onChange={this.handleChange.bind(this, i)}
              maxLength={10}
              minLength={10}
              autoComplete="off"
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
              // style={{ marginRight: "14px" }}
              autoComplete="off"
            // maxLength="60"
            // required={true}
            />
            <div id="signerContainerActions">
              <div title="Remove the user" className="next-nav" >
                {/* <span
                  style={{ color: "#f86c6b", fontSize: "25px" }}
                  className="px-4 fa fa-trash"
                  id={`${i}signerInfoRmvBtn`}
                  onClick={this.removeClick.bind(this, i)}
                  onMouseOver={(e) => this.bigimg(e, `${i}signerInfoRmvBtn`)}
                >
                </span> */}

                <FontAwesomeIcon icon={faTrashCan}
                  style={{ color: "#f86c6b", fontSize: "25px",marginRight:'10px ' }}
                  id={`${i}signerInfoRmvBtn`}
                  onClick={this.removeClick.bind(this, i)}
                  onMouseOver={(e) => this.bigimg(e, `${i}signerInfoRmvBtn`)} />

              </div>
              <div className="next-nav combined-icons" title="Add user to address book" style={{ paddingTop: "2px", display: "flex" }}>
                {/* <span
                  style={{ color: "#539f9f", fontSize: "24px", display: "flex" }}
                  className="px-4 fa fa-address-book-o"
                  id={`${i}AddressBookAdd`}
                  onClick={this.addUsrToAddBook.bind(this, i, el)}
                  onMouseOver={(e) => this.bigimg(e, `${i}AddressBookAdd`)}
                >
                  <span className="fa fa-plus plusSymb"></span>
                </span> */}

                <FontAwesomeIcon icon={faAddressBook}
                  style={{ fontSize: "24px" }}
                  id={`${i}AddressBookAdd`}
                  onClick={this.addUsrToAddBook.bind(this, i, el)}
                  onMouseOver={(e) => this.bigimg(e, `${i}AddressBookAdd`)} />
              </div>
              <FontAwesomeIcon icon={faPlus} />



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
        this.setState({ signerInfo }, () => {
          // Check if the length of the signer name is at least three
          if (value.length >= 3) {
            // If yes, show the address book dropdown for this signer
            this.setState((prevState) => ({
              showAddressBook: {
                ...prevState.showAddressBook,
                [i]: true,
              }
            }));
            // Filter address book contacts based on the signer name
            const filteredContacts = this.state.addressBookData.filter(contact =>
              contact.contactName.toLowerCase().startsWith(value.toLowerCase())
            );
            // Update filtered data in the state to show in the dropdown
            this.setState({ filteredData: filteredContacts });
          } else {
            // If not, hide the address book dropdown for this signer
            this.setState((prevState) => ({
              showAddressBook: {
                ...prevState.showAddressBook,
                [i]: false,
              }
            }));
          }
        });
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


  handleSelectContact = (contact, index) => {
    if (contact.contactType === "g") {
      let obj = {
        authToken: sessionStorage.getItem('authToken'),
        operationtype: "GRP",
        groupId: contact.contactId,
        userid: "8",
      };
      this.fetchAddressBookGroupDetails(obj, index); // Pass the index
    } else {
      this.updateSignerInfo(contact, index); // Call a separate function to update signer info
    }
    this.setState({ showAddressBook: false });
  };

  updateSignerInfo = (contact, index) => {
    this.setState((prevState) => {
      const updatedSignerInfo = [...prevState.signerInfo];
      updatedSignerInfo[index] = {
        signerName: contact.contactName,
        signerMobile: contact.mobileNo,
        signerEmail: contact.emailId,
      };
      return {
        selectedContact: [contact],
        signerInfo: updatedSignerInfo,
      };
    });
  };

  setCustomDocName = (e) => {
    let regName = new RegExp(/^[a-zA-Z0-9\-.@'#_/ ]*$/);
    const { name, value } = e.target;
    if (name === "custDocName") {
      let encodedName = encodeURI(e.target.value);
      if (encodedName.length > 29) {
        alert("Document title should be of within 30 characters");
      } else {
        if (regName.test(e.target.value)) {

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

  // to add the user to address book.
  addUsrToAddBook(i, usrDetaiils) {
    // for (let key in usrDetaiils) {
    //   if (usrDetaiils[key] === "") {
    //     return confirmAlert({
    //       message: `Please fill the ${key.substring(6, key.length)}!`,
    //       buttons: [
    //         {
    //           label: "OK",
    //           className: "confirmBtn"
    //         },
    //       ],
    //     });
    //   }
    // }
    // //<----------------Fetch API to add the users to the address book----------------->

    // const individualData = { contactId: "", contactName: usrDetaiils.signerName, contactType: "i", emailId: usrDetaiils.signerEmail, mobileNo: usrDetaiils.signerMobile };

    // // Check if individualData already exists in addressBookData
    // const isDuplicate = this.state.addressBookData.some(item =>
    //   item.contactName === individualData.contactName &&
    //   item.emailId === individualData.emailId &&
    //   item.mobileNo === individualData.mobileNo
    // );

    // if (!isDuplicate) {
    //   // Add individualData to addressBookData only if it's not a duplicate
    //   this.setState((prevState) => ({
    //     addressBookData: [
    //       ...prevState.addressBookData,
    //       individualData,
    //     ],
    //   }));
    // }

    let name = usrDetaiils.signerName.trim();
    let mobile = usrDetaiils.signerMobile.trim();
    let email = usrDetaiils.signerEmail.trim();
    //validation
    const mobileRegex = /^[6-9]\d{9}$/;

    if (name === "" || name.length == 0) {
      alert("Please enter contact name")
      return false;
    }

    else if (mobile.length != 10 || !mobileRegex.test(mobile)) {
      alert("Please enter a valid mobile number")
      return false;
    }
    else if (email === "" || email.length < 5) {
      alert("Please enter email id")
      return false;
    }


    let disaplayMessage = name + " will be saved as a contact, Do you want to proceed.";




    confirmAlert({
      message: disaplayMessage,
      buttons: [
        {
          label: "OK",
          className: "confirmBtn",
          onClick: () => {

            for (let key in usrDetaiils) {
              if (usrDetaiils[key] === "") {
                return confirmAlert({
                  message: `Please fill the ${key.substring(6, key.length)}!`,
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn"
                    },
                  ],
                });
              }
            }
            //<----------------Fetch API to add the users to the address book----------------->
        
            const individualData = { contactId: "", contactName: usrDetaiils.signerName, contactType: "i", emailId: usrDetaiils.signerEmail, mobileNo: usrDetaiils.signerMobile };
        
            // Check if individualData already exists in addressBookData
            const isDuplicate = this.state.addressBookData.some(item =>
              item.contactName === individualData.contactName &&
              item.emailId === individualData.emailId &&
              item.mobileNo === individualData.mobileNo
            );
        
            if (!isDuplicate) {
              // Add individualData to addressBookData only if it's not a duplicate
              this.setState((prevState) => ({
                addressBookData: [
                  ...prevState.addressBookData,
                  individualData,
                ],
              }));
            }

            let body = {
              authToken: sessionStorage.getItem("authToken"),
              userInfo: [{
                "firstName": name, "emailId": email, "mobileNo": mobile
              }]
            }




            fetch(URL.insertToAddressBook, {
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
                    message: responseJson.statusDetails,
                    buttons: [
                      {
                        label: "OK",
                        className: "confirmBtn"
                      },
                    ],
                  });
                }
                else if (responseJson.statusDetails === "Session Expired" || responseJson.statusDetails === "Authentication Key Not Found") {
                  confirmAlert({
                    message: "Session Expired!",
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
                }
                else {
                  if (responseJson.statusDetails === "User already exists") {
                    confirmAlert({
                      message: "Contact already exists",
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn"
                        },
                      ],
                    });
                  } else {
                    confirmAlert({
                      message: responseJson.statusDetails,
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn"
                        },
                      ],
                    });

                  }
                }
              })
              .catch((e) => {
                console.log(e);
              });




          },
        },
        {
          label: "Cancel",
          className: "confirmBtn",
          onClick: () => { },
        },
      ],
    });

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
          var resData = responseJson.valdtnResp;
          this.setState({ emailValidation: resData, loaded: true });
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
            this.setState({ declineSigning: true });
          },
        },
        {
         
          label: "Cancel",
          className: "cancelBtn",
          onClick: () => {
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
    // if (e.getDate() < 10 && (e.getMonth() + 1) < 10) {
    //   endDateValue = `${e.getFullYear()}-0${e.getMonth() + 1}-0${e.getDate()}`;
    // } else if (e.getDate() < 10 && (e.getMonth() + 1) > 9) {
    //   endDateValue = `${e.getFullYear()}-${e.getMonth() + 1}-0${e.getDate()}`;
    // } else if (e.getDate() > 9 && (e.getMonth() + 1) < 10) {
    //   endDateValue = `${e.getFullYear()}-0${e.getMonth() + 1}-${e.getDate()}`;
    // } else {
    //   endDateValue = `${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`;
    // }

    // date format yyyy-mm-dd
    const year = e.getFullYear();
    const month = String(e.getMonth() + 1).padStart(2, '0'); // ensures 2 digits, pads with 0 if necessary
    const day = String(e.getDate()).padStart(2, '0'); // ensures 2 digits, pads with 0 if necessary
    endDateValue = `${year}-${month}-${day}`;
    console.log(endDateValue);

    this.setState({
      startDate: `${d.getFullYear()}-${
        d.getMonth() + 1
      }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
      endDate: endDateValue,
    });
  }

  fetchAddressBookDetails(obj) {
    fetch(URL.fetchAddressBook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    }).then((response) => {
      return response.json();
    }).then((responseJson) => {
      if (responseJson.status == "SUCCESS") {
        this.setState({
          addressBookData: responseJson.searchInfo,
          // filteredData: responseJson.searchInfo,
        });
      } else {
        if (responseJson.statusDetails === "Session Expired!!") {
          sessionStorage.clear();
          this.setState({ loaded: true });
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
          this.setState({ loaded: true });
        }
      }
    }).catch((error) => {
      console.error("Error fetching address book data:", error);
    });
  }

  fetchAddressBookGroupDetails = (obj, index) => {
    fetch(URL.fetchAddressBook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          const groupData = responseJson.searchInfo;
          // Update signer info for group contacts
          groupData.forEach((item, i) => {
            if (i === 0) {
              this.updateSignerInfo(item, index);
            } else {
              this.setState((prevState) => ({
                signerInfo: [
                  ...prevState.signerInfo,
                  {
                    signerName: item.contactName,
                    signerMobile: item.mobileNo,
                    signerEmail: item.emailId,
                  },
                ],
              }));
            }
          });
        } else {
          if (responseJson.statusDetails === "Session Expired!!") {
            sessionStorage.clear();
            this.setState({ loaded: true });
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
            this.setState({ loaded: true });
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching address book group data:", error);
      });
  };



  // Function to add individual records
  addIndividualRecord(record) {
    this.setState((prevState) => ({
      signerInfo: [
        ...prevState.signerInfo,
        {
          signerName: record.contactName,
          signerMobile: record.mobileNo,
          signerEmail: record.emailId
        }
      ]
    }));
  }

handleDateInput(e) {
  const dateValue = e.target.value;
  const today = new Date();
  const minDate = new Date(today); // Today
  const maxDate = new Date("2037-12-31");
  minDate.setDate(today.getDate() - 15); // Subtract 15 days from today

  // Regex to match the date format YYYY-MM-DD
  const datePattern = /^\d{0,4}-\d{0,2}-\d{0,2}$/;

  // Check if the typed value matches the date pattern
  if (!datePattern.test(dateValue)) {
    e.target.value = dateValue.slice(0, -1); // Remove the last character if invalid
    return;
  }

  // Split the date into parts
  const [year, month, day] = dateValue.split('-');

  // If the year has more than 4 digits, trim it to 4
  if (year && year.length > 4) {
    e.target.value = `${year.slice(0, 4)}-${month || '01'}-${day || '01'}`;
    return;
  }

  // Validate the month (must be between 01 and 12)
  if (month.length === 2 && (parseInt(month) < 1 || parseInt(month) > 12)) {
    e.target.value = this.state.endDate; // Reset to the previous valid date
    // alert("Please enter a valid month (01 to 12).");
    return;
  }

  // Allow day input up to two digits
  if (day && day.length > 2) {
    e.target.value = `${year}-${month || '01'}-${day.slice(0, 2)}`;
    return;
  }

  // Validate the date only if the input is complete
  if (year.length === 4 && month.length === 2 && day.length === 2) {
    const selectedDate = new Date(dateValue);

    // Check if the selected date is before minDate (15 days ago)
    if (selectedDate < minDate) {
      e.target.value = this.state.endDate; // Reset to the previous valid date
      // alert(`Please select a date that is today or within the last 15 days.`);
      return;
    }

    // Check if the date exceeds the max date
    if (selectedDate > maxDate) {
      e.target.value = this.state.endDate; // Reset to the previous valid date
      // alert(`Please select a date on or before ${maxDate.toISOString().split('T')[0]}.`);
      return;
    }
  }
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
          <label id="checked" htmlFor="checkbox">Enable Sign Order</label>
          <input id="checkboxdeclineSigning" type="checkbox" onChange={this.onCheckedDeclineSigning} />
          <label id="checkeddeclineSigning" htmlFor="checkboxdeclineSigning">Decline signing</label>
          <input id="checkboxEmailNotify" type="checkbox" onChange={this.onCheckedEmailNotify} />
          <label id="checkedEmailNotify" htmlFor="checkboxEmailNotify">Email Notify</label>
          <label id="enddate">Sign by: &nbsp;</label>
          <input
            id="enddatefield"
            className="signerfield"
            type="date"
            value={this.state.endDate}
            min={this.state.min}
            max="2037-12-31"
            name="endDate"
            onChange={this.finalDate.bind(this)}
            onInput={this.handleDateInput.bind(this)}
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
              style={{ paddingTop: "8px", marginLeft: "18px" }}
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
          <div id="signerContainer" style={{ marginTop: "20px" }}>
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
