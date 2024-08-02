import React, { useEffect, useState } from 'react'
import "./addOrViewTempGrpUers.css";
import { URL } from "../URLConstant";
import MaterialTable, { MTableToolbar } from "material-table";
import { Delete } from "@material-ui/icons";
import tableIcons from "../Inbox/MaterialTableIcons";
import { confirmAlert } from "react-confirm-alert";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
var Loader = require("react-loader");

function AddEndUsrToTempGrp(props) {

    const [allowLoader, setAllowLoader] = useState(true);

    // an array to store the user details.
    const [listOfEndUserToAdd, setListOfEndUserToAdd] = useState([]);

    // to hide the add each end user block.
    const [hideAddEachUser, setHideAddEachUser] = useState(true);

    // to store the eachuser deatil recieved for search..
    const [endUsrDetail, setEndUsrDetail] = useState({});

    // data to be sent to client.
    const [endUserDetail, setEndUserDetail] = useState([]);

    const columns = [
        {
            title: "",
            field: "",
            cellStyle: {
                width: "2%",

            },
        },
        {
            title: "Username",
            field: "userName",
            cellStyle: {
                width: "35%",
                paddingLeft: "2px"
            }
        },
        {
            title: "Mobile Number",
            field: "mobileNumber",
            type: "number",
            cellStyle: {
                width: "38%",
                paddingLeft: "3px"
            },
        },
        {
            title: "Email Id",
            field: "emailId",
            type: "string",

            cellStyle: {
                width: "25%",
                paddingLeft: "3px"
            },
        }
    ];



    // used to call, Back end and fetch each endUsers data to add to tempList.
    const getEndUserData = (event) => {
        if (document.getElementById("EDUSRMobNumOrEmlID").value === "") {
            event.preventDefault();
            confirmAlert({
                message: "Please Enter The Mobile Number/Email ID.",
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => { return },
                    },
                ],
            });
        }
        else {
            let mobileNumberRegex = new RegExp(/^[6-9]{1}[0-9]{9}$/);
            let allowMobileNumber = mobileNumberRegex.test(document.getElementById("EDUSRMobNumOrEmlID").value);
            let emailIdRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            let allowEmailId = emailIdRegex.test(document.getElementById("EDUSRMobNumOrEmlID").value);
            if (allowMobileNumber || allowEmailId) {
                const url = URL.getUserDetails;
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        authToken: sessionStorage.getItem("authToken"),
                        searchValue: document.getElementById("EDUSRMobNumOrEmlID").value
                    }),
                };
                fetch(url, options)
                    .then((response) => response.json())
                    .then((responsedata) => {
                        if (responsedata.status === "SUCCESS") {
                            setEndUsrDetail(responsedata);
                            setHideAddEachUser(false);
                        }
                        else if (responsedata.statusDetails === "Session Expired!!") {
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
                                message: responsedata.statusDetails,
                                buttons: [
                                    {
                                        label: "OK",
                                        className: "confirmBtn",
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
            } else {
                confirmAlert({
                    message: "Entered Value is Invalid!",
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => { return },
                        },
                    ],
                });
            }
        }

    }

    // to remove users from the list..
    const removeTheEndUsers = (event, data, index) => {
        let endUsrData = [];
        let endUsrDataToServer = [];

        for (let key in listOfEndUserToAdd) {
            if (listOfEndUserToAdd[key].mobileNumber != data.mobileNumber) {
                endUsrData.push(listOfEndUserToAdd[key]);
            }
        }

        for (let key in endUserDetail) {
            if (endUserDetail[key].loginName != data.userName) {
                endUsrDataToServer.push(endUserDetail[key]);
            }
        }
        setListOfEndUserToAdd(endUsrData);
        setEndUserDetail(endUsrDataToServer);
    }

    // used to add the users to listOfEndUserToAdd LIst.
    const addTheUsrToList = (event) => {
        let allowDntAllow = true;
        for (let key in listOfEndUserToAdd) {
            if (listOfEndUserToAdd[key].mobileNumber === endUsrDetail.mobileNo) {
                allowDntAllow = false;
                event.preventDefault();
                confirmAlert({
                    message: `User "${endUsrDetail.firstName}" has been added to the list!`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => {
                                return;
                            },
                        },
                    ],
                });
            }
        }

        if (allowDntAllow) {
            setListOfEndUserToAdd([
                ...listOfEndUserToAdd,
                { userName: endUsrDetail.firstName, mobileNumber: endUsrDetail.mobileNo, emailId: endUsrDetail.emailId }
            ]);
            setEndUserDetail([
                ...endUserDetail,
                { loginName: endUsrDetail.firstName, userId: endUsrDetail.userID + "" }
            ]);
            setHideAddEachUser(true);
            toast.success("User Added Successfully!", { autoClose: 1500 });
            document.getElementById("EDUSRMobNumOrEmlID").value = "";
        }
    }

    // used to cancel the operation.
    const cancelTheUsers = (event) => {
        setHideAddEachUser(true);
        document.getElementById("EDUSRMobNumOrEmlID").value = "";
    }

    // for the final submission of users to be added to server.
    const submitTheUserToTempGroup = (event) => {
        if (listOfEndUserToAdd.length === 0) {
            event.preventDefault();
            confirmAlert({
                message: "Please add the users!",
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => {
                            return;
                        },
                    },
                ],
            });
        }
        else {
            confirmAlert({
                message: `You have selected ${listOfEndUserToAdd.length} users to the group "${props.location.state.templateName}"`,
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
                                    code: props.location.state.templateCode,
                                    userDetails: endUserDetail
                                })
                            }
                            fetch(URL.addTemplateUsers, options)
                                .then((response) => response.json()
                                    .then((data) => {
                                        if (data.status === "Success") {
                                            setAllowLoader(true);
                                            if (data.userDetailsResp.length === 0) {
                                                confirmAlert({
                                                    message: data.statusDetails,
                                                    buttons: [
                                                        {
                                                            label: "OK",
                                                            className: "confirmBtn",
                                                            onClick: () => {
                                                                setListOfEndUserToAdd([]);
                                                                setEndUserDetail([]);
                                                            },
                                                        },
                                                    ],
                                                });
                                            }
                                            else {
                                                confirmAlert({
                                                    message: `${data.statusDetails} and ${data.userDetailsResp.length} users have already linked to the group.`,
                                                    buttons: [
                                                        {
                                                            label: "OK",
                                                            className: "confirmBtn",
                                                            onClick: () => {
                                                                setListOfEndUserToAdd([]);
                                                                setEndUserDetail([]);
                                                            },
                                                        },
                                                    ],
                                                });
                                            }
                                        }
                                        else if (data.status === "Failure") {
                                            confirmAlert({
                                                message: "User has been already linked to the group",
                                                buttons: [
                                                    {
                                                        label: "OK",
                                                        className: "confirmBtn",
                                                    },
                                                ],
                                            });
                                        }
                                        else if (data.statusDetails === "Session Expired") {
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
            <ToastContainer></ToastContainer>
            <div className='findUsrCss'>
                <div className='temGrpName'>
                    <span > {sessionStorage.getItem("roleID") === "1" ? "Corporate:" : "Template Group:"} </span>
                    <span style={{ fontSize: "16px" }}>{props.location.state.templateName}</span>
                </div>
                <div className='MobNumSearchCss inputDicCss' >
                    <div className='inputLableCss'><span > Search user: </span></div> <div style={{ width: "80%" }} ><input style={{ fontSize: '13px', width: "90%" }} type='text' id='EDUSRMobNumOrEmlID' placeholder='Enter The Mobile Number/Email ID' /></div>
                </div>
                <div className='FindBtnCss' style={{ width: "8%", textAlign: "start" }}>
                    <button className='btn btn-success ' style={{ backgroundColor: "#63c2e0", borderColor: "#63c2e0" }} onClick={e => getEndUserData(e)}>Search</button>
                </div>
                <div className='FindBtnCss' >
                    <button className='btn btn-success ' onClick={event => submitTheUserToTempGroup(event)} >Submit</button>
                </div>
            </div>
            <div className='AddUser01' hidden={hideAddEachUser}>
                <div className='AddUser02'>
                    <div style={{ width: "fit-content", marginRight: '4px', paddingTop: "6px" }}><span >Name: </span></div>
                    <div className='UserNameCss'><span>{endUsrDetail.firstName}</span></div>
                </div>
                <div className='AddUser03'>
                    <div style={{ width: "fit-content", marginRight: '4px', paddingTop: "6px" }}><span className='fa fa-mobile' style={{ fontSize: "21px" }}> </span> <span>:</span></div>
                    <div className='UserNameCss' > <span>{endUsrDetail.mobileNo}</span></div>
                </div>
                <div className='AddUser04'>
                    <div style={{ width: "fit-content", marginRight: '4px', paddingTop: "5px" }}><span className='fa fa-envelope-open-o' style={{ fontSize: "14px" }}>: </span></div>
                    <div className='UserNameCss'> <span>{endUsrDetail.emailId}</span></div>
                </div>
                <div className='AddUser05'>
                    <div style={{ width: "fit-content", marginRight: '4px', paddingTop: "6px" }}><span></span></div>
                    <div className='UserNameCss'> <span></span></div>
                </div>
                <div className='AddUser06'>
                    <button type='submit' className='btn btn-primary' style={{ width: "100%" }} onClick={e => addTheUsrToList(e)}>Add</button>
                </div>
                <div className='AddUser07'>
                    <button type='submit' className='btn btn-danger' style={{ width: "100%" }} onClick={e => cancelTheUsers(e)}>Cancel</button>
                </div>

            </div>
            <MaterialTable
                columns={columns}
                icons={tableIcons}
                data={listOfEndUserToAdd}
                options={{
                    search: true,
                    thirdSortClick: false,
                    detailPanelType: "single",
                    detailPanelColumnAlignment: "right",
                    actionsColumnIndex: -1,
                    padding: "dense",
                    sorting: true,
                    showTitle: false,
                    headerStyle: {
                        borderTop: "2px inset ",
                        top: 0,
                        borderTopWidth: "2px",
                        backgroundColor: "#e8eaf5",
                        color: "black",
                        fontWeight: "normal",
                        fontSize: "16px",
                        paddingLeft: "2px",
                        borderBottom: "2px inset ",
                    },
                    searchFieldStyle: {
                        marginTop: "0px",
                        paddingTop: "0px",
                        paddingRight: "0px",
                        color: "Black",
                        top: "0px",
                        marginBottom: "20px",
                        border: "outset",
                    },
                    pageSize: 10,
                    pageSizeOptions: [10, 15, 20],
                }}
                actions={[
                    {
                        icon: () => <Delete id="deleteIconColor" />,
                        id: "deleteIcon",
                        tooltip: "Delete",
                        onClick: (event, rowData) => removeTheEndUsers(event, rowData),
                        isFreeAction: false,
                        hidden: false,

                        cellStyle: {
                            padding: "0px"
                        }
                    }
                ]}
                components={{
                    //---------Overriding the Toolbar Component and customised-----------
                    Toolbar: (props) => (
                        <div
                            style={{
                                backgroundColor: "#e8eaf5",
                                height: "35px",
                                fontSize: "6px",
                            }}
                        >
                            <MTableToolbar {...props} />
                        </div>
                    ),
                }}
            ></MaterialTable>
        </div >
    )
}

export default AddEndUsrToTempGrp