import React, { useEffect, useRef, useState } from 'react';
import { CardBody, Table } from 'reactstrap';
import { confirmAlert } from "react-confirm-alert";
import { URL } from "../URLConstant";

function PlatFormAdminTopUp(props) {
    const [topUp, SetTopUp] = useState(0);

    // To render the type of topUp
    const [topUpType, setTopUpType] = useState("eSign TopUp");

    // subscription topUp data
    const [subscriptionTopUpData, setSubscriptionTopUpData] = useState([]);

    // to hold the selected  subscription topUp data.
    const [selectedSubscriptionTopUpData, setSelectedSubscriptionTopUpData] = useState({});

    // holds the corpoarte user data.
    const [corporateAdminCredntails, setCorporateAdminCredntails] = useState({});


    useEffect(() => {
        // check the page is getting reloaded for the second time.
        // if so then navigate back to the desired route
        if (!('corporateAdminCredntails' in (props.location))) {
            // Navigate back to the desired route
            sessionStorage.removeItem('hasReloaded');
            props.history.push("/addOrViewTempGroup");
        } else {

            setCorporateAdminCredntails(props.location.corporateAdminCredntails);
            // check the corporate is enabled or disabled
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
                        } else {
                            // get the subscription topUp data
                            const subscriptionTopUpDataInputs = {
                                method: "POST",
                                headers: {
                                    "Content-type": "application/json"
                                },
                                body: JSON.stringify({
                                    username: ""
                                })
                            };
                            fetch(URL.getSubscriptionLists, subscriptionTopUpDataInputs)
                                .then(response => (response.json()))
                                .then(data => {
                                    if (data.status === "SUCCESS") {
                                        setSubscriptionTopUpData(data.list);
                                        setSelectedSubscriptionTopUpData(data.list[0]);
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
                                                        window.location.reload();
                                                    }
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
                                })
                        }
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
                });
        };

    }, [])

    // TopUp operation
    const performTopUp = (e) => {
        // the operation depends up on the topUpType
        if (topUpType === "eSign TopUp") {
            // check the entered custom topUp value is valid or not.
            if (topUp === "" || topUp === 0 || topUp <= 0) {
                e.preventDefault();
                confirmAlert({
                    message: "Enter the valid number of units",
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn"
                        },
                    ], closeOnClickOutside: false,
                });
            } else {
                // check if user has filled the required data's
                // if not then show the alert message
                if (document.getElementById("transcationDateId").value === "" || (document.getElementById("paidAmountId").value === ""
                    || document.getElementById("paidAmountId").value <= 0) || document.getElementById("transcationRefNumberId").value === ""
                    || document.getElementById("transcationReasonId").value === "") {
                    e.preventDefault();
                    confirmAlert({
                        message: "Enter the required valid data.",
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn"
                            },
                        ], closeOnClickOutside: false,
                    });
                } else {
                    // eSign topUp operation fetch call goes here..
                    const options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            authToken: "cc29c523-1d98-44cb-b6d8-3a0117cb617a",
                            transtnDate: document.getElementById("transcationDateId").value,
                            paidAmount: document.getElementById("paidAmountId").value,
                            transtnRefNo: document.getElementById("transcationRefNumberId").value,
                            topUpReason: document.getElementById("transcationReasonId").value,
                            corpId: corporateAdminCredntails.corporateId,
                            corpUserId: corporateAdminCredntails.userID,
                            topUpType: "ESM",
                            amount: (Number(topUp) * 5).toString(),
                            userIp: sessionStorage.getItem("userIP")
                        })
                    };
                    TopUpFetchCall(options);
                }
            }
        } else {
            // check if user has filled the required data's
            // if not then show the alert message
            if (document.getElementById("transcationDateId").value === "" || (document.getElementById("paidAmountId").value === ""
                || document.getElementById("paidAmountId").value <= 0) || document.getElementById("transcationRefNumberId").value === ""
                || document.getElementById("transcationReasonId").value === "") {
                e.preventDefault();
                confirmAlert({
                    message: "Enter the required valid data.",
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn"
                        },
                    ], closeOnClickOutside: false,
                });
            } else {
                // Subscription topUp operation fetch call goes here..

                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        authToken: "cc29c523-1d98-44cb-b6d8-3a0117cb617a",
                        transtnDate: document.getElementById("transcationDateId").value,
                        paidAmount: document.getElementById("paidAmountId").value,
                        transtnRefNo: document.getElementById("transcationRefNumberId").value,
                        topUpReason: document.getElementById("transcationReasonId").value,
                        corpId: corporateAdminCredntails.corporateId,
                        corpUserId: corporateAdminCredntails.userID,
                        topUpType: "SUBM",
                        planID: selectedSubscriptionTopUpData.planId,
                        userIp: sessionStorage.getItem("userIP"),
                        amount: (selectedSubscriptionTopUpData.amount).toString(),
                    })
                };
                TopUpFetchCall(options);
            }

        }
    };

    // topUp call goes here..
    const TopUpFetchCall = (options) => {
        fetch(URL.internalTopUp, options)
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
                                    props.history.push("/addOrViewTempGroup");
                                }
                            }
                        ], closeOnClickOutside: false
                    });
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
                        ], closeOnClickOutside: false
                    });
                } else {
                    confirmAlert({
                        message: responsedata.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => {
                                    props.history.push("/addOrViewTempGroup");
                                }
                            },
                        ], closeOnClickOutside: false
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                confirmAlert({
                    message: `Unable to perform topup operation! Please try after some time.`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => {
                                props.history.push("/addOrViewTempGroup");
                            }
                        },
                    ], closeOnClickOutside: false
                });
            });
    };

    // to change the plan details
    const changePlanDetails = (e) => {
        setSelectedSubscriptionTopUpData(subscriptionTopUpData[e.target.value]);
    };

    return (
        <>
            <div style={{ backgroundColor: "white", width: "100%", height: "100%", borderRadius: "10px", padding: "20px" }}>
                <div className="Headinng" >
                    <div style={{ width: "50%", fontSize: "16px", }}>
                        <div style={{ marginBottom: "1%" }}><strong>Corporate Top Up</strong></div>
                        <div className='topUpOptions' style={{ alignItems: 'center' }}>
                            <label style={{ marginRight: '10px', fontSize: "14px" }}>
                                <input
                                    type="radio"
                                    value="option1"
                                    name="topUp"
                                    checked={topUpType === "eSign TopUp"}
                                    onChange={() => {
                                        // reset the selected subscription topUp data to the first index
                                        setSelectedSubscriptionTopUpData(subscriptionTopUpData[0]);
                                        setTopUpType("eSign TopUp")
                                    }}
                                />
                                eSign TopUp
                            </label>
                            <label style={{ fontSize: "14px" }}>
                                <input
                                    type="radio"
                                    value="option2"
                                    name="topUp"
                                    checked={topUpType === "Subscription TopUp"}
                                    onChange={() => {
                                        // reset the selected subscription topUp data to the first index
                                        setSelectedSubscriptionTopUpData(subscriptionTopUpData[0]);
                                        setTopUpType("Subscription TopUp")
                                        SetTopUp(0);
                                    }}
                                />
                                Subscription TopUp
                            </label>
                        </div>
                    </div>
                    <div className="userDataContainer">
                        <div className="userData" >
                            <div className='userDataLabel'><strong>Name </strong></div>
                            <div style={{ width: "5%" }}>:</div>
                            <div className='usetDataValue' style={{ width: "30%", fontFamily: "auto" }}>{corporateAdminCredntails.fullName}</div>
                        </div>
                        <div className="userData" >
                            <div className='userDataLabel'><strong>Number </strong></div>
                            <div style={{ width: "5%" }}>:</div>
                            <div style={{ width: "30%", fontFamily: "auto", }}>{corporateAdminCredntails.mobileNo}</div>
                        </div>
                        <div className="userData" >
                            <div className='userDataLabel'><strong>Corporate ID </strong></div>
                            <div style={{ width: "5%" }}>:</div>
                            <div style={{ width: "30%", fontFamily: "auto" }}>{corporateAdminCredntails.corporateId}</div>
                        </div>
                    </div>
                </div>
                <br />

                <div className="touUpContainer" style={{ padding: "0% 5%" }}>
                    <div className="subscription" >
                        {
                            topUpType === "Subscription TopUp" ?
                                <>
                                    <div style={{ display: "flex", width: "100%" }}>
                                        <div style={{ width: "50%" }}>
                                            <strong>Subscription topUp</strong>
                                        </div>
                                        <div style={{ width: "50%", textAlign: "end" }}>
                                            <button onClick={e => performTopUp(e)} className="btn btn-success" style={{ paddingTop: "1px", paddingBottom: "1px" }}>TopUp</button>
                                        </div>
                                    </div>
                                    <div className="subscptonData" style={{ backgroundColor: "lightcyan", marginTop: "3%", textAlign: "center", padding: "8%", borderRadius: "10px" }}>
                                        <div className="subscptonDrpDwn">
                                            <select style={{
                                                width: "100%", textAlign: "start", borderRadius: "5px", padding: "1%"
                                            }} onChange={e => changePlanDetails(e)}>
                                                {
                                                    subscriptionTopUpData.map((data, index) => (
                                                        <option key={index} value={index}>{data.descrip}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                        <div className="subscptonDetails" style={{ marginTop: "4%", textAlign: "center" }}>
                                            <React.Fragment>
                                                <div className="subscptonAmount" style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "3%" }}>
                                                    <div style={{ width: "30%" }}><strong>Amount </strong></div>
                                                    <div style={{ width: "10%" }}>:</div>
                                                    <div style={{ width: "40%" }}>{selectedSubscriptionTopUpData.amount}</div>
                                                </div>
                                                <div className="subscptonAmount" style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "3%" }}>
                                                    <div style={{ width: "30%" }}><strong>Signs </strong></div>
                                                    <div style={{ width: "10%" }}>:</div>
                                                    <div style={{ width: "40%" }}>{selectedSubscriptionTopUpData.signs}</div>
                                                </div>
                                                <div className="subscptonAmount" style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "3%" }}>
                                                    <div style={{ width: "30%" }}><strong>Storage </strong></div>
                                                    <div style={{ width: "10%" }}>:</div>
                                                    <div style={{ width: "40%" }}>{selectedSubscriptionTopUpData.storage}</div>
                                                </div>
                                            </React.Fragment>
                                        </div>
                                    </div>
                                </>
                                : <>
                                    <div style={{ display: "flex", width: "100%" }}>
                                        <div style={{ width: "50%" }}>
                                            <strong>eSign TopUp</strong>
                                        </div>
                                        <div style={{ width: "50%", textAlign: "end" }}>
                                            <button onClick={e => performTopUp(e)} className="btn btn-success" style={{ paddingTop: "1px", paddingBottom: "1px" }}>TopUp</button>
                                        </div>
                                    </div>
                                    <CardBody style={{ marginBottom: "5%" }}>
                                        <Table
                                            hover
                                            bordered
                                            striped
                                            responsive
                                            style={{ marginBottom: "0" }}
                                        >
                                            <thead>
                                                <tr style={{ textAlign: "center" }}>
                                                    <th>Sl. No.</th>
                                                    <th>eSign Pages</th>
                                                    <th>No. Units</th>
                                                </tr>
                                            </thead>
                                            <tbody style={{ textAlign: "center" }}>
                                                <tr>
                                                    <td>1</td>
                                                    <td>Single Page eSign</td>
                                                    <td>2</td>
                                                </tr>
                                                <tr>
                                                    <td>2</td>
                                                    <td>Multi Page eSign</td>
                                                    <td>2</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    </CardBody>
                                    <div className="customTopUp" >
                                        <div className="customEnterInput">
                                            <input
                                                type="number"
                                                autoComplete="true"
                                                placeholder="Enter the number of units"
                                                onChange={(e) => SetTopUp(e.target.value)}
                                                id="customTopUpId"
                                                className='customTopUpInput'
                                            />
                                        </div>
                                        <div className="amuntForEnteredUnits">
                                            <strong>Amount : {topUp * 5}</strong>
                                        </div>
                                    </div>
                                </>
                        }
                    </div>
                    <div className="topUpRequiredInputs" style={{ marginLeft: "3%" }}>
                        <div className="topUpDataLabel" >
                            <div className='topUpDataInputPAR'>Transaction Date<span style={{ color: "red" }}>*</span> :</div>
                            <input
                                className='topUpDataInputCHLD'
                                id="transcationDateId"
                                name="transcationDate"
                                type="date"
                                autoComplete="true"
                            />
                        </div>
                        <div className="topUpDataLabel">
                            <div className='topUpDataInputPAR'>Amount<span style={{ color: "red" }}>*</span> :</div>
                            <input
                                className='topUpDataInputCHLD'
                                id="paidAmountId"
                                name="paidAmount"
                                type="number"
                                autoComplete="true"
                                placeholder="Enter the amount"
                            />
                        </div>
                        <div className="topUpDataLabel" >
                            <div className='topUpDataInputPAR'>Transaction ref Number<span style={{ color: "red" }}>*</span> :</div>
                            <input
                                className='topUpDataInputCHLD'
                                id="transcationRefNumberId"
                                name="transcationRefNumber"
                                type="text"
                                autoComplete="true"
                                placeholder="Enter the transaction ref number"
                            />
                        </div>
                        <div className="topUpDataLabel">
                            <div className='topUpDataInputPAR'>Reason<span style={{ color: "red" }}>*</span> :</div>
                            <textarea
                                className='topUpDataInputCHLD'
                                id="transcationReasonId"
                                maxLength={200}
                                placeholder="Enter the reason for topUp"
                                style={{ height: "160px" }}
                            >
                            </textarea>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PlatFormAdminTopUp;