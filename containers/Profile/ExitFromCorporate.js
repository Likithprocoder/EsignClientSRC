import React, { useEffect, useState } from 'react';
import { confirmAlert } from "react-confirm-alert";
import { URL } from "../URLConstant";
import '../Templates/Template.css';
import './exitCorpGroup.css';
const ExitFromCorporate = (props) => {
    // corporate group list
    const [corporateList, setCorporateList] = useState([]);

    // contains the server fetch calls...
    useEffect(() => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken")
            }),
        };

        fetch(URL.getTemplateGrps, options)
            .then((response) => response.json())
            .then((responsedata) => {
                if (responsedata.status === "SUCCESS") {
                    setCorporateList(responsedata.details);
                    // disable the delete button at intial render.
                    // document.getElementById("deleteFrmParticulGrp").disabled = true;
                }
                else if (responsedata.statusDetails === "Session Expired") {
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
                        ], closeOnClickOutside: false,
                    });
                } else {
                    confirmAlertFunction(responsedata.statusDetails);
                }
            })
            .catch((error) => {
                console.log(error);
                confirmAlertFunction(`Something went wrong pLease try again!`);
            });
    }, []);

    // one consent confirmAlert that is used allover.
    const confirmAlertFunction = (message) => {
        confirmAlert({
            message: message,
            buttons: [
                {
                    label: "OK",
                    className: "confirmBtn"
                }
            ],
            closeOnClickOutside: false, // Set to false to prevent closing on click outside
        });
    };

    // fetch call to remove the user from particular corporate groups.
    const exitFromParticulrCorpGrp = (index, groupName) => {
        // confirm if the user wants to unlink from the selected corporate groups.
        confirmAlert({
            message: `Are you sure you want to exit from the corporate group '${groupName}' ?`,
            buttons: [
                {
                    label: "Yes",
                    className: "confirmBtn",
                    onClick: () => {
                        // iterate over the corporateList and collect the selected corporate groups.
                        let selectedCorpGrps = [corporateList[index]];
                        // for (let key in corporateList) {
                        //     let checkBox = document.getElementById(corporateList[key].name);
                        //     // check if the checkbox is checked or not.
                        //     if (checkBox.checked) {
                        //         selectedCorpGrps.push(corporateList[key]);
                        //     };
                        // };
                        // fetch call to unlink user from the selected corporate groups.
                        const options = {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                authToken: sessionStorage.getItem("authToken"),
                                selectedCorpGrps: selectedCorpGrps,
                                roleId: sessionStorage.getItem("roleID")
                            }),
                        };
                        fetch(URL.deleteUserFromCorpGroup, options)
                            .then((response) => response.json())
                            .then((responsedata) => {
                                if (responsedata.status === "SUCCESS") {
                                    confirmAlert({
                                        message: responsedata.statusDetails,
                                        buttons: [
                                            {
                                                label: "OK",
                                                className: "confirmBtn",
                                                onClick: () => {
                                                    window.location.reload();
                                                },
                                            },
                                        ], closeOnClickOutside: false,
                                    });
                                }
                                else if (responsedata.statusDetails === "Session Expired") {
                                    confirmAlertFunction(responsedata.statusDetails);
                                    props.history.push("/login");
                                } else {
                                    confirmAlertFunction(responsedata.statusDetails);
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                confirmAlertFunction(`Something went wrong pLease try again!`);
                            });
                    },
                },
                {
                    label: "No",
                    className: "cancelBtn",
                },
            ], closeOnClickOutside: false
        });

    };

    // fetch call to remove the user from the corporate entity.
    const exitFromCorpEntity = () => {
        confirmAlert({
            message: "Are you sure you want to exit from corporate? once the user is unlinked from the corporate entity, the user will not be able to access the template group and its services.",
            buttons: [
                {
                    label: "Yes",
                    className: "confirmBtn",
                    onClick: () => {
                        const options = {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                authToken: sessionStorage.getItem("authToken"),
                                roleId: sessionStorage.getItem("roleID"),
                                numberOfGrps: corporateList.length
                            }),
                        };
                        fetch(URL.deleteUserFromCorpGroup, options)
                            .then((response) => response.json())
                            .then((responsedata) => {
                                if (responsedata.status === "SUCCESS") {
                                    confirmAlertFunction(responsedata.statusDetails);
                                    props.history.push("/profileDetails");
                                }
                                else if (responsedata.statusDetails === "Session Expired") {
                                    confirmAlertFunction(responsedata.statusDetails);
                                    props.history.push("/login");
                                } else {
                                    confirmAlertFunction(responsedata.statusDetails);
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                confirmAlertFunction(`Something went wrong pLease try again!`);
                            });
                    },
                },
                {
                    label: "No",
                    className: "cancelBtn",

                },
            ], closeOnClickOutside: false
        });
    }

    return (
        <div>
            <div className='parentBakGrd'>
                <div className='operationButtons'>
                    {/* <div style={{ marginRight: "3%", width:"60%" }} className='selectGrp'>
                            <button id='deleteFrmParticulGrp' onClick={exitFromParticulrCorpGrp} title='Access for the selected corporate groups will be unlinked' className='btn btn-success'>Unlink from selected group</button>
                        </div> */}
                    <div className='exitFrmCorp'>
                        <button onClick={exitFromCorpEntity} title='Your account will be unlinked from the corporate entity' className='btn btn-danger'>Exit from corporate</button>
                    </div>
                </div>
                <div style={{ minHeight: "362px" }} className='parentgrpList scrollbarx' >
                    <div className='crpGrpList'>
                        <span>{corporateList.length > 1 ? "Linked corporate group" : "No groups linked"}</span>
                    </div>
                    {
                        corporateList.map((corporate, index) => (
                            <div className='corpGrpOperation' hidden={corporate.code === "G0001"} key={`corpName${index}`}>
                                {/* <div style={{ marginRight: "1%", marginBottom: "1%", paddingTop: "1px" }} className={`checkBox${index}`}> */}
                                {/* <input onClick={(e) => {
                                        if (e.target.checked) {
                                            document.getElementById("deleteFrmParticulGrp").disabled = false;
                                        }
                                        // check if all the checkboxes are unchecked then disable the delete button.
                                        else if (!corporateList.some(corporate => document.getElementById(corporate.name).checked === true)) {
                                            document.getElementById("deleteFrmParticulGrp").disabled = true;
                                        }
                                    }} id={corporate.name} type="checkbox" /> */}
                                {/* </div> */}
                                <div className='corporateGrpName' key={`grpName${index}`}>
                                    <span>{Number(index)}. {corporate.name}</span>
                                </div>
                                <div style={{ width: "50%" }}>
                                    <button onClick={e => exitFromParticulrCorpGrp(index, corporate.name)} className='btn btn-success'>Exit the group</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>

    );
};

export default ExitFromCorporate;