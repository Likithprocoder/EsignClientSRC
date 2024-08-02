import React, { useState } from 'react'
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import "./addOrViewTempGrpUers.css";
import Modal from "react-responsive-modal";
var Loader = require("react-loader");

function TempGroupAddOrView(props) {

    const [allowLoader, setAllowLoader] = useState(true);

    // used to store the template groups..
    const [templateGroup, setTemplateGroup] = useState([]);
    const [maxGroupLimit, setMaxGroupLimit] = useState([]);

    //to store the status details message and restrict the corporate admin to create the group..
    const [statusDetail, setStatusDetail] = useState("");

    // to open modal to collect template group details..
    const [openModlToCollTempGrp, setopenModlToCollTempGrp] = useState(false);

    useState(() => {
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
            <div style={{ display: "flex", width: "100%", marginBottom: "10px" }}>
                <div id='tempGroupListCss'>
                    {
                        <span>{sessionStorage.getItem("roleID") === "1" ? "Corporate List" : "Template Group List"}</span>
                    }
                </div>
                <div hidden={sessionStorage.getItem("roleID") === "6" ? false : true} className='viewAndAddUserBtn' style={{ width: "41%", textAlign: "end" }}>
                    <button style={{ height: "fit-content" }} type='submit' onClick={e => createATempGroup(e)} className='btn btn-success'>Add group</button>
                </div>
            </div>
            <div className='LstOfTempGroupCss'>
                {
                    templateGroup.map((posts, index) => (
                        <div key={index} className='eachTempGroup'>
                            <div key={posts.code} className='groupNameCss'>
                                <span>{posts.name}</span>
                            </div>
                            <div className='viewAndAddUserBtn'>
                                <button style={{ width: "100%", height: "fit-content" }} type='submit' onClick={e => addEndUsrToTempGrp(e, posts.code, posts.name)} className='btn btn-success'>Add Users</button>
                            </div>
                            <div className='viewAndAddUserBtn'>
                                <button style={{ width: "100%", height: "fit-content" }} type='submit' onClick={e => ViewEndUsrToTempGrp(e, posts.code, posts.name)} className='btn btn-primary'>View Users</button>
                            </div>
                        </div>
                    ))
                }
            </div>
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
        </div>
    )
}

export default TempGroupAddOrView