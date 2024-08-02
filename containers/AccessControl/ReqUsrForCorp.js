import React, { useEffect, useState } from 'react';
import tableIcons from "../Inbox/MaterialTableIcons";
import { confirmAlert } from "react-confirm-alert";
import { URL } from "../URLConstant";
import MaterialTable, { MTableToolbar } from "material-table";
import { log2 } from 'pdfjs-dist';
import Modal from "react-responsive-modal";
import "./addOrViewTempGrpUers.css";

var Loader = require("react-loader");

function ReqUsrForCorp(props) {

    const [reqCorpDetails, setReqCorpDetails] = useState([]);

    const [allowModal, setAllowModal] = useState(false);

    const [eachRequstesList, setEachRequstesList] = useState([]);

    const [eachReqListFrMakMem, setEachReqListFrMakMem] = useState([]);

    const [allowTocheck, setAllowTocheck] = useState(true);

    const [allgrpNameAndCodeList, SetAllgrpNameAndCodeList] = useState({});

    const [userEmpyDetail, setUserEmpyDetail] = useState({
        UserName: "",
        RequestedOn: "",
        UserCorpId: "",
        loginName: "",
        corpMember: ""
    });

    // fetch API to get the list of requested members who has raised to 
    //become the member of corp entity and for group access
    useEffect(() => {
        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken")
            })
        }

        fetch(URL.getCorpMemberRequests, options)
            .then(response => (response.json()))
            .then(data => {
                if (data.status === "SUCCESS") {
                    setReqCorpDetails(data.userDetails);
                    SetAllgrpNameAndCodeList(data.grpNameAndCodList);
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
                        ],
                    });
                }
                else {
                    confirmAlert({
                        message: data.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn"
                            },
                        ],
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
                    ],
                });
            })
    }, [])

    // column name in materail table..
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
            field: "firstName",
            cellStyle: {
                width: "23%",
                paddingLeft: "2px"
            }
        },
        {
            title: "Requested On",
            field: "requested_On",
            cellStyle: {
                width: "25%",
                paddingLeft: "3px"
            }
        },
        {
            title: "Corp Employee ID",
            field: "userCorpID",
            cellStyle: {
                width: "25%",
            }
        },
        {
            title: "Requested groups",
            cellStyle: {
                paddingLeft: "0px",
                width: "25%",
            },
            render: (rowData) => {
                return (
                    <div style={{ paddingLeft: "20%" }}>
                        <button
                            className='btn btn-success'
                            type="submit"
                            style={{ color: "white", fontSize: "12px", backgroundColor: "#20a8d8", borderColor: "#20a8d8" }}
                            onClick={(event) =>
                                viewGrpRequested(event, rowData)
                            }
                        >
                            View
                        </button>
                    </div>
                );
            },
        },
    ];

    // Logic to open checkBox on reject of all group to be a member of corp entity..
    const accpRecjValue = (event, inputId, key) => {
        let allFalse = true;
        if (!(userEmpyDetail.corpMember === "1")) {
            if (inputId.includes("Reject")) {
                eachReqListFrMakMem[key] = true;
            }
            else {
                eachReqListFrMakMem[key] = false;
            }
            for (let key in eachReqListFrMakMem) {
                if (!eachReqListFrMakMem[key]) {
                    allFalse = false;
                } else {
                    continue;
                }
            }
            if (allFalse) {
                setAllowTocheck(false);
            }
            else {
                setAllowTocheck(true);
            }
        }
    }

    // on click of view button below () is used to set the data's to the state..
    const viewGrpRequested = (event, data) => {
        event.preventDefault();
        // if the selected grp list is empty. showing a alert..
        if (data.reqstdGroups === '') {
            confirmAlert({
                message: 'No groups were selected by the user!',
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
            setEachRequstesList([]);
        } else {
            // let parsedreqstdGroups = JSON.parse(data.reqstdGroups);
            setAllowModal(true);
            setEachRequstesList(data.reqstdGroups);
            for (let key in data.reqstdGroups) {
                setEachReqListFrMakMem(oldvalue => ({
                    ...oldvalue,
                    [data.reqstdGroups[key]]: false
                }))
            }
            setUserEmpyDetail({
                UserName: data.firstName,
                RequestedOn: data.requested_On,
                UserCorpId: data.userCorpID,
                loginName: data.loginName,
                corpMember: data.corpMember
            })
        }
    }

    // to close the modal..
    const closeTheModal = (event, boolean) => {
        setAllowModal(false);
    }

    //to view the list of requested grps and other details.
    const openModalForReqGrp = () => {
        if (eachRequstesList.length !== 0) {
            return (
                <>
                    <div
                        style={{ display: "flex", marginBottom: "5px" }}
                        className="rejectedByCss"
                    >
                        <div style={{ fontStyle: "inherit", fontSize: "13px", width: "50%", display: "flex" }}>
                            <div style={{ width: "85%" }}>Name </div> <div>:</div>
                        </div>
                        <div style={{ fontSize: "13px", width: "50%" }}>
                            <span>{userEmpyDetail.UserName}</span>
                        </div>
                    </div>
                    <div
                        style={{ display: "flex", marginBottom: "5px" }}
                        className="rejectedByCss"
                    >
                        <div
                            style={{ fontStyle: "inherit", fontSize: "13px", width: "50%", display: "flex" }}
                        >
                            <div style={{ width: "85%" }}>Requested On </div><div>:</div>
                        </div>
                        <div style={{ fontSize: "13px", width: "50%" }}>
                            <span>{userEmpyDetail.RequestedOn}</span>
                        </div>
                    </div>  <div
                        style={{ display: "flex", marginBottom: "5px" }}
                        className="rejectedByCss"
                    >
                        <div
                            style={{ fontStyle: "inherit", fontSize: "13px", width: "50%", display: "flex" }}
                        >
                            <div style={{ width: "85%" }}>Corp Employee ID </div><div>:</div>
                        </div>
                        <div style={{ fontSize: "13px", width: "50%" }}>
                            <span>{userEmpyDetail.UserCorpId}</span>
                        </div>
                    </div>
                    <div className='inputname1' style={{ paddingTop: "5px", width: "100%" }}>
                        {
                            <>
                                <div className="GrpList  ScrollBarForApprove" style={{ width: "100%", height: "fit-content", border: "3px solid #9dc1e3", fontSize: "13px", borderRadius: "5px", padding: "5px" }}>
                                    {
                                        eachRequstesList.map((posts, index) => (
                                            <>
                                                <div style={{ display: "flex", width: "100%", paddingBottom: "5px" }} key={index}>
                                                    <div style={{ width: "60%", paddingTop: "2px" }}><span>{allgrpNameAndCodeList[posts]}</span></div>
                                                    <div style={{ width: "20%", paddingRight: "10px", display: "flex" }}> <div style={{ paddingTop: "3px" }}><input onChange={e => accpRecjValue(e, `${posts}Accept`, posts)} type='radio' name={`acceptAndReject${posts}`} id={`${posts}Accept`} /></div><div style={{ paddingRight: "3px", color: "green" }}>Accept</div></div>
                                                    <div style={{ width: "20%", display: "flex" }}><div style={{ paddingTop: "3px" }} ><input onChange={e => accpRecjValue(e, `${posts}Reject`, posts)} type='radio' name={`acceptAndReject${posts}`} id={`${posts}Reject`} /></div> <div style={{ paddingRight: "3px", color: "red" }}>Reject</div></div>
                                                </div>
                                            </>
                                        ))
                                    }
                                </div>
                            </>
                        }
                    </div>
                    <div id='corpMemCss' hidden={allowTocheck}>
                        <div style={{ marginRight: '3px' }}><input type='checkBox' name='shall_Be_Corp_Member' id='shallBeCorpMember' /></div>
                        <div>should be corporate member?</div>
                    </div>
                </>
            )
        }
    }

    // final submittion call for approve or rejection of groups..
    const accptReqGrp = (event) => {
        event.preventDefault();
        let acceptedGrp = [];
        let rejectedGrp = [];
        for (let key in eachRequstesList) {
            // if sys Users has not selected any of the options, below alert is showen..
            if (!document.getElementById(`${eachRequstesList[key]}Accept`).checked && !document.getElementById(`${eachRequstesList[key]}Reject`).checked) {
                alert(`Please select the option for '${allgrpNameAndCodeList[eachRequstesList[key]]}' before submit!`);
                return;
            }
            else if (document.getElementById(`${eachRequstesList[key]}Accept`).checked) {
                acceptedGrp.push(eachRequstesList[key]);
            }
            else {
                rejectedGrp.push(eachRequstesList[key]);
            }
        }

        closeTheModal();
        setAllowModal(false);
        let isCorpMember = "";
        // below if condition is used to check if the system user has selected him to be a part of corpmember..
        if (!allowTocheck) {
            if (document.getElementById("shallBeCorpMember").checked) {
                isCorpMember = "1";
            }
            else {
                isCorpMember = "0";
            }
        }
        // based on server response checking if he is already an member of corp or not..
        else if (userEmpyDetail.corpMember === "1") {
            isCorpMember = "0";
        }
        else {
            isCorpMember = "1";
        }
        let userDetails = [{
            loginName: userEmpyDetail.loginName,
            addedGroups: acceptedGrp,
            rejectedGroups: rejectedGrp,
            UserCorpId: userEmpyDetail.UserCorpId,
            isCorpMember: isCorpMember
        }];

        // API call to add the users to there respective grps..
        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken"),
                userDetails: userDetails,
                userIP: sessionStorage.getItem("userIP"),
            })
        }
        fetch(URL.approveCorpMemberRequests, options)
            .then(response => (response.json()))
            .then(data => {
                if (data.status === "SUCCESS") {
                    setAllowModal(false);
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
                }
                else if (data.statusDetails === "Session Expired") {
                    setAllowModal(false);
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
                    setAllowModal(false);
                    confirmAlert({
                        message: data.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn"
                            },
                        ],
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
                    ],
                });
            })
    }

    return (
        <>
            <Loader
                loaded={true}
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
            <MaterialTable
                columns={columns}
                icons={tableIcons}
                data={reqCorpDetails}
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
            <Modal className='inputTakingModel' onClose={closeTheModal} open={allowModal} center={true} closeOnOverlayClick={false}>
                <div className='WholeContent' style={{ width: "350px" }}>
                    <div className='headingOfModalXcss'>
                        <span style={{ fontSize: "20px" }}>Requested Groups</span>
                    </div>
                    <form>
                        {
                            openModalForReqGrp()
                        }
                    </form>
                    <div className='Divo6Css'>
                        <div className='proceedCancelCss'>
                            <button className='cancelbtn' type='button' onClick={closeTheModal}>Cancel</button>
                            <button className='proceedbtnX' type='button' onClick={e => accptReqGrp(e)}>Submit</button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )

}

export default ReqUsrForCorp