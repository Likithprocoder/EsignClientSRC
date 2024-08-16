import React, { useState } from 'react'
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import "./addOrViewTempGrpUers.css";
import Modal from "react-responsive-modal";
import { event } from 'jquery';
var Loader = require("react-loader");
function CreateTempGroup(props) {

    const [allowLoader, setAllowLoader] = useState(true);

    // to open modal to collect template group details..
    const [openModlToCollTempGrp, setopenModlToCollTempGrp] = useState(false);

    // used to store the template groups..
    const [templateGroup, setTemplateGroup] = useState([]);

    useState(() => {
        const url = URL.getCorpDetails;
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
                    setTemplateGroup(responsedata.details);
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
                } else {
                    confirmAlert({
                        message: responsedata.statusDetail,
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
            .catch((error) => {
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
            });
    }, [])

    // called when sysAdmin needs to view end users.
    const ViewCreatedGroups = (event) => {
        props.history.push({
            pathname: "/addOrViewTempGroup",
            frompath: "/createTemptgroup"
        })
    }

    // to open the modal to collect the Template group by group admin..
    const createATempGroup = (event) => {
        setopenModlToCollTempGrp(true);
    }

    const closeTheModal = () => {
        setopenModlToCollTempGrp(false);
    }

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
                message: `Template group will be created under the corporate account "${templateGroup[0].name}"`,
                buttons: [
                    {
                        label: "Confirm",
                        className: "confirmBtn",
                        onClick: () => {
                            setAllowLoader(false);
                            const options = {
                                method: "POST",
                                headers: {
                                    "Content-Type": "appiaction/json"
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
                                        if (data.status === "SUCEESS") {
                                            setAllowLoader(true);
                                            confirmAlert({
                                                message: data.statusDetails,
                                                buttons: [
                                                    {
                                                        label: "OK",
                                                        className: "confirmBtn",
                                                        onClick: () => {
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
            <div id='tempGroupListCss'>
                {
                    <span>Create Template Group</span>
                }
            </div>
            <div className='LstOfTempGroupCss'>
                {
                    templateGroup.map((posts, index) => (
                        <div key={index} className='eachTempGroup'>
                            <div key={posts.code} className='groupNameCss'>
                                <span>{posts.name}</span>
                            </div>
                            <div className='viewAndAddUserBtn'>
                                <button style={{ width: "100%", height: "fit-content" }} type='submit' onClick={e => createATempGroup(e)} className='btn btn-success'>Create Group</button>
                            </div>
                            <div className='viewAndAddUserBtn'>
                                <button style={{ width: "100%", height: "fit-content" }} type='submit' onClick={e => ViewCreatedGroups(e)} className='btn btn-primary'>View Group</button>
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
                                    <button className='cancelbtn' type='button' onClick={closeTheModal}>Cancel</button>
                                    </div>
                                    <div className='proceedCancelCss'>
                                    <button className='proceedbtnX' type='button' onClick={event => collTempGrpDet(event)}>Proceed</button>
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

export default CreateTempGroup