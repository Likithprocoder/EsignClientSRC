import React, { useState } from 'react'
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import "./addOrViewTempGrpUers.css";
import Modal from "react-responsive-modal";
import { Button, Input, Space, Table, Tooltip } from 'antd';
import {
    InputGroup,
    Row,
} from "reactstrap";
import { post } from 'jquery';
import ApiKeyList from '../Profile/ApiKeyList';
var Loader = require("react-loader");

function TempGroupAddOrView(props) {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isReasonModalVisible, setIsReasonModalVisible] = useState(false);
    const [formData, setFormData] = useState({
      name: '',
      mobileNo: '',
      email: '',
      address: '',
      desc: '',
      gstin: '',
      cin: '',
      panNo: '',
      contactPersonName: ''
    });
    const [errors, setErrors] = useState({});

    const [allowLoader, setAllowLoader] = useState(true);

    // used to store the template groups..
    const [templateGroup, setTemplateGroup] = useState([]);
    const [maxGroupLimit, setMaxGroupLimit] = useState([]);

    //to store the status details message and restrict the corporate admin to create the group..
    const [statusDetail, setStatusDetail] = useState("");

    // to open modal to collect template group details..
    const [openModlToCollTempGrp, setopenModlToCollTempGrp] = useState(false);

    const [showApiKeyList, setShowApiKeyList] = useState(false);
    const [entityName, setEntityName] = useState("");
    const [disableReason, setDisableReason] = useState("");
    const [corpID, setCorpID] = useState("");

    useState(() => {
        // Allow the below fetch call only if the user is corpAdmin or CorpUser. For Platform admin this call is not applicable.
        if (sessionStorage.getItem("roleID") === "6" || sessionStorage.getItem("roleID") === "7") {
            // Fetch call to get the corporate details from the API and check for corporate is enable or disabled.
            // If corporate is disabled then redirect to the old page.
            const corpDataInputs = {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    authToken: sessionStorage.getItem("authToken"),
                    corpId: sessionStorage.getItem("corpId")
                })
            };

            fetch(URL.getCorpDetails, corpDataInputs)
                .then(response => (response.json()))
                .then(data => {
                    if (data.status === "SUCCESS") {
                        if (data.details[0]["status"] === 0) {
                            confirmAlert({
                                message: "Your corporate is currently disabled. Please contact your administrator!",
                                buttons: [
                                    {
                                        label: "OK",
                                        className: "confirmBtn",
                                        onClick: () => {
                                            props.history.push((sessionStorage.getItem("roleID") === "6") ? "/accountInfo" : "/");
                                        },
                                    },
                                ], closeOnClickOutside: false
                            });
                        };
                    }
                    else if (data.statusDetails === "Session Expired") {
                        confirmAlert({
                            message: data.statusDetails,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        props.history.push("/login");
                                    },
                                },
                            ], closeOnClickOutside: false
                        });
                    }
                    else {
                        confirmAlert({
                            message: data.statusDetails,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        props.history.push((sessionStorage.getItem("roleID") === "6") ? "/accountInfo" : "/");
                                    },
                                },
                            ], closeOnClickOutside: false
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                    confirmAlert({
                        message: `Something went wrong. please try again!`,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                            },
                        ], closeOnClickOutside: false
                    });
                    props.location.push('/login');
                });
        }

        let urlForTempListAndCorpList = "";
        if (sessionStorage.getItem("roleID") === "1") {
            urlForTempListAndCorpList = URL.getCorpDetails;
        }
        else {
            urlForTempListAndCorpList = URL.getTemplateGrps;
        }
        const url = urlForTempListAndCorpList;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken"),

            }),
        };
        fetch(url, options)
            .then((response) => response.json())
            .then((responsedata) => {
                if (responsedata.status === "SUCCESS") {
                    setAllowLoader(false);
                    setTemplateGroup(responsedata.details);
                    setMaxGroupLimit(responsedata)
                    setStatusDetail(responsedata.statusDetails);
                    setAllowLoader(true);
                } else if (responsedata.statusDetails === "Session Expired") {
                    confirmAlert({
                        message: responsedata.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => {
                                    props.history.push("/login");
                                },
                            },
                        ],
                    });
                    setAllowLoader(true);
                } else {
                    confirmAlert({
                        message: responsedata.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => { },
                            },
                        ],
                    });
                }
                setAllowLoader(true);
            }).catch((error) => {
                console.log(error);
                confirmAlert({
                    message: `SomeThing Went Wrong PLease Try Again`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ],
                });
                setAllowLoader(true);
            });
    }, [])

    // to collect the template group details.
    const collTempGrpDet = (event) => {
        let groupName = document.getElementById("grpNamCrtgrp").value;
        let groupDesc = document.getElementById("grpDescCrtgrp").value;
        if (groupDesc === "" || groupName === "") {
            event.preventDefault()
            alert("Please fill all the details before proceeding!");
            return;
        }
        else {
            closeTheModal();
            confirmAlert({
                message: `Template group will be created under the corporate account`,
                buttons: [
                    {
                        label: "Confirm",
                        className: "confirmBtn",
                        onClick: () => {
                            setAllowLoader(false);
                            const options = {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    authToken: sessionStorage.getItem("authToken"),
                                    GroupName: groupName,
                                    GroupDescp: groupDesc,
                                })
                            }
                            fetch(URL.createTemplateGrp, options)
                                .then((response) => response.json()
                                    .then((data) => {
                                        if (data.status === "SUCCESS") {
                                            setAllowLoader(true);
                                            confirmAlert({
                                                message: data.statusDetails,
                                                buttons: [
                                                    {
                                                        label: "OK",
                                                        className: "confirmBtn",
                                                        onClick: () => {
                                                            window.location.reload();
                                                        },
                                                    },
                                                ],
                                            });
                                        } else if (data.statusDetails === "Session Expired") {
                                            setAllowLoader(true);
                                            confirmAlert({
                                                message: data.statusDetails,
                                                buttons: [
                                                    {
                                                        label: "OK",
                                                        className: "confirmBtn",
                                                        onClick: () => {
                                                            props.history.push("/login");
                                                        },
                                                    },
                                                ],
                                            });
                                        }
                                        else {
                                            setAllowLoader(true);
                                            confirmAlert({
                                                message: data.statusDetails,
                                                buttons: [
                                                    {
                                                        label: "OK",
                                                        className: "confirmBtn",
                                                    },
                                                ],
                                            });
                                        }
                                    }))
                                .catch(error => {
                                    console.log(error);
                                    setAllowLoader(true);
                                    confirmAlert({
                                        message: "Technical issue, Try again later!",
                                        buttons: [
                                            {
                                                label: "OK",
                                                className: "confirmBtn",
                                            },
                                        ],
                                    });
                                })
                            setAllowLoader(true);
                        },
                    },
                    {
                        label: "Cancel",
                        className: "cancelBtn",
                        onClick: () => {
                            event.preventDefault();
                            return;
                        },
                    },
                ],
            });
        }
    }

    const closeTheModal = () => {
        setopenModlToCollTempGrp(false);
    }
    
    const closeTheCreateModal = () => {
        resetFormData();
        setIsModalVisible(false);
    }
    const closeTheReasonModal = () => {
        setDisableReason('');
        setIsReasonModalVisible(false);
    }

    const resetFormData = () => {
        setFormData({
          name: '',
          mobileNo: '',
          email: '',
          address: '',
          desc: '',
          gstin: '',
          cin: '',
          panNo: '',
          contactPersonName: ''
        });
      }

    // to open the modal to collect the Template group by group admin..
    const createATempGroup = (event) => {
        let limit = 5;

        //if grplimit is fetched then set else use 5
        if ('groupLimit' in maxGroupLimit) {
            limit = maxGroupLimit.groupLimit
        }


        if (templateGroup.length < limit) {

            // if (templateGroup.length < maxGroupLimit.groupLimit) {
            if (statusDetail === "Account is disabled.") {
                confirmAlert({
                    message: "Failed To Create Group, This Admin Account is Disabled!",
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => {
                            },
                        },
                    ],
                });
            } else {
                setopenModlToCollTempGrp(true);
            }
        }
        else {
            confirmAlert({
                message: "Failed To Create Group,maximum limit reached!",
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => {
                        },
                    },
                ],
            });
        }
    }

    // called when sysAdmin needs to add users.
    const addEndUsrToTempGrp = (event, tempCode, tempName) => {
        props.history.push({
            pathname: "/addEndUsrToTempGrp",
            frompath: "/addOrViewTempGroup",
            state: {
                "templateName": tempName,
                "templateCode": tempCode
            }
        })
    }

    // called when sysAdmin needs to view end users.
    const ViewEndUsrToTempGrp = (event, tempCode, tempName) => {
        props.history.push({
            pathname: "/viewTempGrpUsr",
            frompath: "/addOrViewTempGroup",
            state: {
                "templateName": tempName,
                "templateCode": tempCode
            }
        })
    }

    const validateInputs = () => {
        if (!formData.name) {
        //   confirmAlert({
        //     message: "Name is required",
        //     buttons: [
        //       {
        //         label: "OK",
        //         className: "confirmBtn",
        //         onClick: () => { },
        //       },
        //     ],
        //   });
          return false;
        } else if (!formData.mobileNo) {
        //   confirmAlert({
        //     message: "Mobile No. is required",
        //     buttons: [
        //       {
        //         label: "OK",
        //         className: "confirmBtn",
        //         onClick: () => { },
        //       },
        //     ],
        //   });
          return false;
        } else if (!formData.email) {
            // confirmAlert({
            //   message: "Email is required",
            //   buttons: [
            //     {
            //       label: "OK",
            //       className: "confirmBtn",
            //       onClick: () => { },
            //     },
            //   ],
            // });
            return false;
        } else if (!formData.address) {
            // confirmAlert({
            //   message: "Address is required",
            //   buttons: [
            //     {
            //       label: "OK",
            //       className: "confirmBtn",
            //       onClick: () => { },
            //     },
            //   ],
            // });
            return false;
        } else if (!formData.desc) {
            // confirmAlert({
            //   message: "Description is required",
            //   buttons: [
            //     {
            //       label: "OK",
            //       className: "confirmBtn",
            //       onClick: () => { },
            //     },
            //   ],
            // });
            return false;
        } else if (!formData.contactPersonName) {
            // confirmAlert({
            //   message: "Contact person name  is required",
            //   buttons: [
            //     {
            //       label: "OK",
            //       className: "confirmBtn",
            //       onClick: () => { },
            //     },
            //   ],
            // });
            return false;
        } else {
          return true;
        }
    };

    const restrictNameInput = (e) => {
        const regex = /^[A-Za-z\s]*$/;
        if (!regex.test(e.key)) {
          e.preventDefault();
        }
      };
      
      const restrictMobileNoInput = (e) => {
        const regex = /^[0-9]*$/;
        if (!regex.test(e.key)) {
          e.preventDefault();
        }
      };
      
      const restrictEmailInput = (e) => {
        // const regex = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[a-zA-Z]{2,6}$/;
        const regex = /^[A-Za-z0-9._%+-@]*$/;
        if (!regex.test(e.key)) {
          e.preventDefault();
        }
      };
      
      const restrictGSTINInput = (e) => {
        const regex = /^[0-9a-zA-Z]*$/;
        if (!regex.test(e.key) || e.target.value.length >= 15) {
          e.preventDefault();
        }
      };
      
      const restrictCINInput = (e) => {
        const regex = /^[0-9a-zA-Z]*$/;
        if (!regex.test(e.key) || e.target.value.length >= 21) {
          e.preventDefault();
        }
      };
      
      const restrictPANNoInput = (e) => {
        const regex = /^[A-Za-z0-9]*$/;
        if (!regex.test(e.key) || e.target.value.length >= 10) {
          e.preventDefault();
        }
      };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
      };
    
    const handleSubmit = (e) => {
        const isValid = validateInputs();
        e.preventDefault();
        if (isValid) {
            const { name, mobileNo, email, desc, address, gstin, cin, panNo, contactPersonName } = formData;

            // Regular expression for validating an email address
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            // Regular expression for validating PAN number
            const panPattern = /^[A-Z]{5}\d{4}[A-Z]$/;

            // Regular expressions for validating GSTIN and CIN numbers
            const gstinPattern = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/;
            const cinPattern = /^[LU]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

            if (name.trim().length < 3) {
                confirmAlert({
                  message: "Entered name is invalid",
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => {},
                    },
                  ],
                });
                return;
            } else if (desc.trim().length < 3) {
                confirmAlert({
                    message: "Entered description is invalid",
                    buttons: [
                      {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => {},
                      },
                    ],
                  });
                  return;
            } else if (address.trim().length < 3) {
                confirmAlert({
                  message: "Entered address is invalid",
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => {},
                    },
                  ],
                });
                return;
            } else if (contactPersonName.trim().length < 3) {
                confirmAlert({
                  message: "Entered contact person name is invalid",
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => {},
                    },
                  ],
                });
                return;
            } else if (mobileNo.trim().length < 10) {
                // If the mobile number is less than 10 digits
                confirmAlert({
                  message: "Entered mobile no. is invalid. It should be 10 digits.",
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => {},
                    },
                  ],
                });
                return;
              } else if (!/^[6-9]/.test(mobileNo.trim())) {
                // If the mobile number does not start with 6, 7, 8, or 9
                confirmAlert({
                  message: "Entered mobile no. is invalid.",
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => {},
                    },
                  ],
                });
                return;
              } else if (!emailPattern.test(email.trim())) {
                // If the email does not match the pattern
                confirmAlert({
                  message: "Entered Email Id is invalid. Please provide a valid Email Id.",
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => {},
                    },
                  ],
                });
                return;
              } else if (!panPattern.test(panNo.trim())) {
                // If the PAN number does not match the pattern
                confirmAlert({
                  message: "Entered PAN number is invalid. Please provide a valid PAN number.",
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => {},
                    },
                  ],
                });
                return;
              } else if (gstin.trim() !== "" && !gstinPattern.test(gstin.trim())) {
                // GSTIN can be empty, but if not, must be valid
                confirmAlert({
                  message: "Entered GSTIN is invalid. Please provide a valid GSTIN number.",
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => {},
                    },
                  ],
                });
                return;
            } else if (cin.trim() !== "" && !cinPattern.test(cin.trim())) {
                // CIN can be empty, but if not, must be valid
                confirmAlert({
                  message: "Entered CIN is invalid. Please provide a valid CIN number.",
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => {},
                    },
                  ],
                });
                return;
            }
            
            const formattedData = {
                authToken: sessionStorage.getItem("authToken"),
                corpContactNo: mobileNo,
                corpAddress: address,
                corpEmialId: email,
                corpName: name,
                gstin: gstin.toUpperCase(),
                cin: cin.toUpperCase(),
                pan: panNo.toUpperCase(),
                contactPerson: contactPersonName,
                corpDesc: desc
            };
            
            fetch(URL.createCorporateEntity, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(formattedData)
            })
            .then((response) => { return response.json() })
            .then(responseJson => {
                if (responseJson.status === "SUCCESS") {
                    setAllowLoader(true);
                    confirmAlert({
                        message: responseJson.statusDetails,
                        buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => {setIsModalVisible(false); window.location.reload(true);},
                        },
                        ],
                    });
                } else if (responseJson.statusDetails === "Session Expired") {
                    setAllowLoader(true);
                    confirmAlert({
                      message: responseJson.statusDetails,
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn",
                          onClick: () => {setIsModalVisible(false)},
                        },
                      ],
                    });
                    this.props.history.push("/");
                  } else {
                    setAllowLoader(true);
                    confirmAlert({
                      message: responseJson.statusDetails,
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn",
                          onClick: () => {setIsModalVisible(false)},
                        },
                      ],
                    });
                  }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        } else {
            confirmAlert({
                message: "Fill all the mandatory fields to proceed",
                buttons: [
                  {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => { },
                  },
                ],
              });
        }
    };
    
    const createCorpEntity = (e) => {
        e.preventDefault();
        setIsModalVisible(true);
    };

  //enabling ,disabling corporate entity
  const enableDisableCorpEntity = (e, corpId, status) => {
    var message;
    let reason = disableReason;
    setCorpID(corpId);
    if (status === 1) {
      message = "Do you want to enable the corporate user?";
      confirmAlert({
        message: message,
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {
              updateCorpEntity(corpId, status, reason);
            },
          },
          {
            label: "Cancel",
            className: "confirmBtn",
            onClick: () => { },
          },
        ],
      });
    } else {
      message = "Do you want to disable the corporate user?";
      confirmAlert({
        message: message,
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {
              setIsReasonModalVisible(true);
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
  }

  const updateCorpEntity = (corpId, status) => {
    var inputTogetTempList = {
      authToken: sessionStorage.getItem("authToken"),
      corporateId: corpId,  
      enableDisable: status
    };
    setAllowLoader(false);
    fetch(URL.enableDisableCorpEntity, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputTogetTempList),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          setAllowLoader(true);
          confirmAlert({
            message: responseJson.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {window.location.reload(true);},
              },
            ],
          });
        } else {
          setAllowLoader(true);
          if (responseJson.statusDetails === "Session Expired!!") {
            sessionStorage.clear();
            this.props.history.push("/login");
          } else {
            setAllowLoader(true);
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
  }

  const getApiKeysList = (name, corpId) => {
    console.log("Selected Name:", name);
    console.log("Selected corpId:", corpId);
    setEntityName(name);
    setShowApiKeyList(true);
    setCorpID(corpId);
  }

  const handleReasonSubmit = () => {
    setDisableReason('');
    setIsReasonModalVisible(false);
    updateCorpEntity(corpID, 0);
  };

    // Custom styles for the modal
    const customModalStyles = {
      modal: {
          width: '600px', // Set the desired width here
          maxWidth: '100%',
      }
    };

  const { TextArea } = Input;
    return (
        <div>
            <Loader
                loaded={allowLoader}
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
            {!showApiKeyList && (
            <>
            <div style={{ display: "flex", width: "100%", marginBottom: "10px" }}>
                <div id='tempGroupListCss'>
                    {
                        <span>{sessionStorage.getItem("roleID") === "1" ? "Corporate List" : "Template Group List"}</span>
                    }
                </div>
                <div hidden={sessionStorage.getItem("roleID") === "6" ? false : true} className='viewAndAddUserBtn' style={{ width: "41%", textAlign: "end" }}>
                    <button style={{ height: "fit-content" }} type='submit' onClick={e => createATempGroup(e)} className='btn btn-success'>Add group</button>
                </div>
                <div hidden={sessionStorage.getItem("roleID") === "1" ? false : true} className='createUserBtn' style={{ width: "41.5%", textAlign: "end" }}>
                    <button style={{ height: "fit-content", marginRight: "10px" }} type='submit' onClick={createCorpEntity} className='btn btn-secondary'>Create Corporate Entity</button>
                </div>
            </div>
            <div className='LstOfTempGroupCss'>
                {
                    templateGroup.map((posts, index) => (
                        <div key={index} className='eachTempGroup'>
                            <div key={posts.code} className='groupNameCss'>
                                <span>{posts.status === 0 ? <i class="fa fa-times" id="fafatimesid" style={{ fontSize: "25px", padding: "0px", color: "#f86c6b" }}></i> : <i className="fa fa-check" style={{ color: "green", fontSize: "25px", padding: "0px" }}></i>} &nbsp;</span>
                                <span>{posts.name}</span>
                            </div>
                            <div className='viewAndAddUserBtn'>
                                {posts.status === 0 ? <button style={{ width: "100%", height: "fit-content" }} type='submit' onClick={e => enableDisableCorpEntity(e, posts.code, 1)} className='btn btn-link'>Enable</button> : 
                                <button style={{ width: "100%", height: "fit-content" }} type='submit' onClick={e => enableDisableCorpEntity(e, posts.code, 0)} className='btn btn-link'>Disable</button>}
                            </div>
                            <div className='viewAndAddUserBtn'>
                                <button style={{ width: "100%", height: "fit-content" }} type='submit' onClick={e => addEndUsrToTempGrp(e, posts.code, posts.name)} className='btn btn-primary' disabled={posts.status === 0}>Add Users</button>
                            </div>
                            <div className='viewAndAddUserBtn'>
                                <button style={{ width: "100%", height: "fit-content" }} type='submit' onClick={e => ViewEndUsrToTempGrp(e, posts.code, posts.name)} className='btn btn-primary' disabled={posts.status === 0}>View Users</button>
                            </div>
                            <div className='viewAndAddUserBtn'>
                                <button style={{ height: "fit-content" }} type='submit' onClick={() => getApiKeysList(posts.name, posts.corpId)} className='btn btn-success' disabled={posts.status === 0}>API Integrations</button>
                            </div>
                        </div>
                    ))
                }
            </div>
            </>)}
            {showApiKeyList && ( <div className='apiKeys'> <ApiKeyList id="apiKeyList" roleId={sessionStorage.getItem("roleID")} entityName={entityName} corpId={corpID}/></div>)}
            <Modal className='inputTakingModel' onClose={closeTheModal} open={openModlToCollTempGrp} center={true} closeOnOverlayClick={false}>
                <div className='WholeContent'>
                    <div className='headingOfModalXcss'>
                        <span style={{ fontSize: "20px" }}>Fill the template group details</span>
                    </div>
                    <form>
                        <div key="" className='Divo3Css'>
                            <div className='inputHolderCss'>
                                <div className='Divo5Css'>
                                    <div className='InputName'>
                                        <span>Group Name: </span>
                                    </div>
                                    <div className='inputname1'>
                                        <input type='text' name='label' id="grpNamCrtgrp" autoCapitalize='off' className='inputCss' />
                                    </div>
                                </div>
                                <div className='Divo5Css'>
                                    <div className='InputName'>
                                        <span>Group Description: </span>
                                    </div>
                                    <div className='inputname1'>
                                        <input type='text' name='placeHolder' id="grpDescCrtgrp" className='inputCss' />
                                    </div>
                                </div>
                                <div className='Divo6Css'>
                                    <div className='proceedCancelCss'>
                                        <button className='cancelbtn' style={{ marginRight: "5px" }} type='button' onClick={closeTheModal}>Cancel</button>
                                    </div>
                                    <div className='proceedCancelCss'>
                                        <button className='proceedbtnX' style={{ marginRight: "5px" }} type='button' onClick={event => collTempGrpDet(event)}>Proceed</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Modal>
            <Modal open={isModalVisible} onClose={closeTheCreateModal} center={true} closeOnOverlayClick={false}>
            <div style={{ padding: "0px 10px" }}>
                    <div className='headingOfModalXcss' style={{  color: "rgb(199, 152, 7)" }}>
                        <span style={{ fontSize: "25px", fontFamily: "Montserrat, sans-serif" }}>Create Corporate Entity</span>
                    </div>
                    <Row style={{ width: "450px" }}>
            <InputGroup className="inputGrp">
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <label className="inputGrpLabel" style={{ flex: '1' }}>Entity Name<em style={{ color: "red"}}>*</em>:&nbsp;</label>
                <Input
                  className="inputGrpInput"
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onKeyPress={restrictNameInput}
                  autoComplete="off"
                  placeholder="Enter entity name"
                  style={{ flex: '2' }}
                  maxLength={255}
                />
                {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
              </div>
            </InputGroup>
            <InputGroup className="inputGrp">
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <label className="inputGrpLabel" style={{ flex: '1' }}>Description<em style={{ color: "red"}}>*</em>:&nbsp;</label>
                <Input
                  className="inputGrpInput"
                  type="text"
                  id="desc"
                  value={formData.desc}
                  onChange={handleInputChange}
                  onKeyPress={restrictNameInput}
                  autoComplete="off"
                  placeholder="Enter description"
                  style={{ flex: '2' }}
                />
              </div>
            </InputGroup>
            <InputGroup className="inputGrp">
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <label className="inputGrpLabel" style={{ flex: '1' }}>GSTIN:&nbsp;</label>
                <Input
                  className="inputGrpInput"
                  type="text"
                  id="gstin"
                  value={formData.gstin}
                  onChange={handleInputChange}
                  onKeyPress={restrictGSTINInput}
                  autoComplete="off"
                  placeholder="Enter GSTIN"
                  style={{ flex: '2' }}
                />
                {errors.gstin && <span style={{ color: 'red' }}>{errors.gstin}</span>}
              </div>
            </InputGroup>
            <InputGroup className="inputGrp">
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <label className="inputGrpLabel" style={{ flex: '1' }}>CIN:&nbsp;</label>
                <Input
                  className="inputGrpInput"
                  type="text"
                  id="cin"
                  value={formData.cin}
                  onChange={handleInputChange}
                  onKeyPress={restrictCINInput}
                  autoComplete="off"
                  placeholder="Enter CIN"
                  style={{ flex: '2' }}
                />
                {errors.cin && <span style={{ color: 'red' }}>{errors.cin}</span>}
              </div>
            </InputGroup>
            <fieldset style={{ border: '1px solid #ccc', padding: '0px 10px 0px 10px', borderRadius: '5px', width: "100%" }}>
            <legend style={{ fontSize: "14px", padding: '0 10px', width: "38%", color: "gray" }}>Contact Person Details</legend>
            <InputGroup className="inputGrp">
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <label className="inputGrpLabel" style={{ flex: '1' }}>Name<em style={{ color: "red"}}>*</em>:&nbsp;</label>
                <Input
                  className="inputGrpInput"
                  type="text"
                  id="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={handleInputChange}
                  onKeyPress={restrictNameInput}
                  autoComplete="off"
                  placeholder="Enter name"
                  maxLength={255}
                  style={{ flex: '2', borderColor: errors.contactPersonName ? 'red' : ''  }}
                />
                {errors.contactPersonName && <span style={{ color: 'red' }}>{errors.contactPersonName}</span>}
              </div>
            </InputGroup>
            <InputGroup className="inputGrp">
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <label className="inputGrpLabel" style={{ flex: '1' }}>Mobile No.<em style={{ color: "red"}}>*</em>:&nbsp;</label>
                <Input
                  className="inputGrpInput"
                  type="text"
                  id="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  onKeyPress={restrictMobileNoInput}
                  autoComplete="off"
                  placeholder="Enter mobile number"
                  style={{ flex: '2' }}
                  maxLength={10}
                />
                {errors.mobileNo && <span style={{ color: 'red' }}>{errors.mobileNo}</span>}
              </div>
            </InputGroup>
            <InputGroup className="inputGrp">
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <label className="inputGrpLabel" style={{ flex: '1' }}>Email ID<em style={{ color: "red"}}>*</em>:&nbsp;</label>
                <Input
                  className="inputGrpInput"
                  type="text"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={restrictEmailInput}
                  autoComplete="off"
                  placeholder="Enter email"
                  style={{ flex: '2' }}
                />
                {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
              </div>
            </InputGroup>
            <InputGroup className="inputGrp">
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <label className="inputGrpLabel" style={{ flex: '1' }}>Address<em style={{ color: "red"}}>*</em>:&nbsp;</label>
                <Input
                  className="inputGrpInput"
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  autoComplete="off"
                  placeholder="Enter address"
                  style={{ flex: '2' }}
                />
                {errors.address && <span style={{ color: 'red' }}>{errors.address}</span>}
              </div>
            </InputGroup>
            <InputGroup className="inputGrp">
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <label className="inputGrpLabel" style={{ flex: '1' }}>PAN NO.<em style={{ color: "red"}}>*</em>:&nbsp;</label>
                <Input
                  className="inputGrpInput"
                  type="text"
                  id="panNo"
                  value={formData.panNo}
                  onChange={handleInputChange}
                  onKeyPress={restrictPANNoInput}
                  autoComplete="off"
                  placeholder="Enter PAN number"
                  style={{ flex: '2' }}
                />
                {errors.panNo && <span style={{ color: 'red' }}>{errors.panNo}</span>}
              </div>
            </InputGroup>
            </fieldset>
          </Row>
          <div style={{ float: "right", marginTop: "10px" }}>
          <Button className='btn btn-danger' style={{ marginRight: "5px" }} onClick={closeTheCreateModal}>Cancel</Button>
          <Button className='btn btn-success' onClick={handleSubmit}>Proceed</Button>
          </div>
        </div>
            </Modal>
      {/* <Modal isOpen={isOpen} toggle={toggle}> */}
      <Modal  open={isReasonModalVisible} onClose={closeTheReasonModal} center={true} closeOnOverlayClick={false} id="disableReason" styles={customModalStyles}>
      <div className="modal-header">
        <h5 className="modal-title">Disable Reason</h5>
      </div>
      <div className="modal-body">
        <TextArea
          value={disableReason}
          onChange={(e) => setDisableReason(e.target.value)}
          placeholder="Enter the reason for disabling"
          rows={4}
          cols={70}
        />
      </div>
      <div className="modal-footer">
        <Button className="btn btn-danger" onClick={closeTheReasonModal}>Cancel</Button>
        <Button className='btn btn-success' onClick={handleReasonSubmit}>Submit</Button>
      </div>
    </Modal>

        </div>
    )
}

export default TempGroupAddOrView