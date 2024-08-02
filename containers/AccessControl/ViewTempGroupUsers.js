import React, { useEffect, useState } from 'react'
import "./addOrViewTempGrpUers.css";
import { URL } from "../URLConstant";
import MaterialTable, { MTableToolbar } from "material-table";
import tableIcons from "../Inbox/MaterialTableIcons";
import { Delete } from "@material-ui/icons";
import { confirmAlert } from "react-confirm-alert";
var Loader = require("react-loader");

function ViewTempGroupUsers(props) {
    // to store the endUser detail included to the particular group.
    const [endUserDetail, setEndUserDetail] = useState([])

    const [allowLoader, setAllowLoader] = useState(true);

    // holdes the columns of the table..
    const columns = [
        {
            title: "",
            field: "",
            cellStyle: {
                width: "2%",

            }
        },
        {
            title: "Name",
            field: "fullName",
            cellStyle: {
                width: "20%",
                paddingLeft: "2px"
            }
        },
        {
            title: "Email Id",
            field: "emailID",
            type: "string",

            cellStyle: {
                width: "31%",
                paddingLeft: "3px"
            },
            render: (rowData) => {
                return (
                    `${rowData.mobileNo}`.startsWith("1000") ? "----------"
                        : (rowData.emailID)
                );
            }
        },
        {
            title: "Mobile Number",
            field: "mobileNo",
            type: "number",
            cellStyle: {
                width: "20%",
            },
            render: (rowData) => {
                return (
                    `${rowData.mobileNo}`.startsWith("1000") ? "----------"
                        : (rowData.mobileNo)
                );
            }
        },
        {
            title: "Status",
            field: "mobileNo",
            type: "number",
            cellStyle: {
                width: "17%",
                paddingLeft: "3px"
            },
            render: (rowData) => {
                if (`${rowData.mobileNo}`.startsWith("1000")) {
                    return (
                        <div style={{ color: "red" }}>Deleted</div>
                    );
                } else if (rowData.status === 0) {
                    return (
                        <div style={{ color: "red" }}>Inactive</div>
                    );
                } else {
                    return (
                        <div style={{ color: "blue" }}>Active</div>
                    );
                }
            }
        },
        {
            title: "Action",
            cellStyle: {
                paddingLeft: "0px",
                width: "10%",
            },
            render: (rowData) => {
                return (
                    <div style={{ display: "flex" }}>
                        <div>
                            <a
                                className='fa fa-trash'
                                type="submit"
                                style={{ color: "red", fontSize: "20px" }}
                                onClick={(event) =>
                                    removeTheEndUsers(event, rowData)
                                }
                            >
                            </a>
                        </div>
                        <div style={{ marginLeft: "2px", marginRight: "2px" }} hidden={sessionStorage.getItem("roleID") === "1" ? false : true}>
                            <>/</>
                        </div>
                        <div hidden={sessionStorage.getItem("roleID") === "1" ? false : true}>
                            {
                                enableOrDisable(rowData)
                            }
                        </div>
                    </div>
                );
            },
        },
    ];

    // to () called to enable or disable the adminUser form the corp group..
    const enableOrDisableTheUser = (event, rowData) => {

        confirmAlert({
            message: `User ${rowData.fullName} will be ${rowData.status === 1 ? "Disabled" : "Enabled"}!`,
            buttons: [
                {
                    label: "Confirm",
                    className: "confirmBtn",
                    onClick: () => {
                        const options = {
                            method: "POST",
                            headers: {
                                "Content-Type": "appiaction/json"
                            },
                            body: JSON.stringify({
                                authToken: sessionStorage.getItem("authToken"),
                                code: props.location.state.templateCode,
                                userDetails: [
                                    {
                                        loginName: rowData.fullName + "",
                                        userId: rowData.userID
                                    }
                                ]
                            })
                        }
                        fetch(URL.modifygrpAdmin, options)
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
                                                        viewEndUsers();
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

    // to return the enable or disable button based on status..
    const enableOrDisable = (rowData) => {
        if (rowData.status === 1) {
            return (
                <a
                    type="button"
                    style={{ color: "red" }}
                    onClick={(e) =>
                        enableOrDisableTheUser(e,
                            rowData
                        )
                    }
                >
                    Disable
                </a>
            )
        }
        else {
            return (
                <a
                    type="button"
                    style={{ color: "green" }}
                    onClick={(e) =>
                        enableOrDisableTheUser(e,
                            rowData
                        )
                    }
                >
                    Enable
                </a>
            )
        }
    }

    const viewEndUsers = () => {
        const url = URL.viewAddedTemplateUsers;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken"),
                code: props.location.state.templateCode
            }),
        };
        fetch(url, options)
            .then((response) => response.json())
            .then((responsedata) => {
                if (responsedata.status === "SUCCESS") {
                    setEndUserDetail(responsedata.userList)
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
    }
    useEffect(() => {
        viewEndUsers();
    }, [])

    // to remove users from the list..
    const removeTheEndUsers = (event, data) => {
        let userName = data.fullName;
        let userDetails = [{ loginName: userName, userId: data.userID + "" }];
        confirmAlert({
            message: `User "${userName}" will be deleted from the group "${props.location.state.templateName}"`,
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
                                userDetails: userDetails
                            })
                        }
                        fetch(URL.removeTemplateUsers, options)
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
                                                        viewEndUsers();
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

    return (
        <>
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
            <div>
                <div className='temGrpName' style={{ marginBottom: "5px" }}>
                    <span >Template Group: </span>
                    <span style={{ fontSize: "16px" }}>{props.location.state.templateName}</span>
                </div>
                <MaterialTable
                    columns={columns}
                    icons={tableIcons}
                    data={endUserDetail}
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
                    components={{
                        // ---------Overriding the Toolbar Component and customised-----------
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

            </div>
        </>

    )
}

export default ViewTempGroupUsers