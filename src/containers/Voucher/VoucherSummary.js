import React from 'react';
import { Table } from 'reactstrap';
import { URL } from '../URLConstant';
import '../../scss/jquery.dataTables.css'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './voucher.css';
import { CSVLink } from 'react-csv';
import Modal from "react-responsive-modal";
var $ = require('jquery');
var dt = require('datatables.net');
var datetime = require('datetime-moment');
let txnData = [];

var Loader = require('react-loader');

//  headers for csv dowload..
const headers = [
    { label: 'Plan Description', key: 'planDescription' },
    { label: 'Voucher Amount(RS)', key: 'amount' },
    { label: 'Voucher Type', key: 'voucherType' },
    { label: 'Number Of Vouchers', key: 'numberOfVouchers' },
    { label: 'Voucher Used', key: 'voucherUsage' },
    { label: 'Purchased On', key: 'purchasedOn' },
    { label: "", key: "" },
    { label: 'Voucher Codes', key: 'vouchercodes' },
    // { label: 'Voucher Expires On', key: 'expiredOn' },
]

export default class TxnDetails extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            txnData: "",
            loaded: true,
            allowmodal: false,
            voucherCodess: {},
            allowmodalFrMrdetail: false,
            VoucherData: [],
            voucherMorDetail: {},
            name: "",
            csvDownloadDate: "",
            planDesc: ""
            // dataToNextPage: []
        }
    }

    closeTheModal = () => {
        this.setState({
            allowmodal: false,
            allowmodalFrMrdetail: false,
        })
    }

    componentDidMount() {
        var body = {
            "authToken": sessionStorage.getItem("authToken")
        };
        this.setState({ loaded: false })
        fetch(URL.getVoucherSummary, {
            // fetch(URL.getUnitsHistory, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json()
        }).then((responseJson) => {
            // console.log(responseJson);
            if (responseJson.status === "SUCCESS") {
                txnData = responseJson.voucherSummaryDetails
                // Format the purchasedOn values using moment.js
                this.setState({ loaded: true })
                $(document).ready(function () {
                    // txnData.forEach((item) => {
                    //     item.purchasedOn = moment(item.purchasedOn, "DD-MMM-YYYY").format("DD-MM-YYYY HH:mm:ss");
                    // });
                    $.fn.dataTable.moment('DD-MM-YYYY HH:mm:ss');
                    // $("#listtable").DataTable().destroy();
                    $("#listtable").dataTable({
                        "pagingType": "full_numbers",
                        "ordering": false,
                        "data": txnData,
                        // "order": [0, 'desc'],
                        "columns": [
                            { "data": "purchasedOn", "className": "text-center" },
                            { "data": "voucherAmount" },

                            {
                                "data": null,
                                "render": function (data, type, row) {
                                    return `${row.vouchersUsed} / ${row.noOfVouchersPurchased}`;
                                }
                            },
                            {
                                "data": "voucherStatus",
                                "render": function (data, type, row) {
                                    switch (data) {
                                        case 0:
                                            return "Not used";
                                        case 1:
                                            return "Partially used";
                                        case 2:
                                            return "Used all";
                                        case 3:
                                            return "Validity expired";
                                        default:
                                            return "Unknown";
                                    }
                                }
                            },
                            {
                                data: "voucherID",
                                render: function (data, type, row) {
                                    let rowdata = JSON.stringify(row);
                                    return "<div > <button  id='voucherCodesInfo' class='paddingClass voucherCodesInfo btn btn-link'  data-voucherid='" + rowdata + "'>Voucher Codes</button></div>"
                                }
                            },
                            {
                                data: "voucherID",
                                render: function (data, type, row) {
                                    let rowdata = JSON.stringify(row);
                                    return "<div> <button   id='moreDetails' class='paddingClass moreDetails btn btn-link'  data-voucherid='" + rowdata + "'>More Info</button></div>"
                                }
                            },
                            {
                                data: "voucherID",
                                render: function (data, type, row) {
                                    let rowdata = JSON.stringify(row);
                                    return "<div> <button  id='usageInfo' class='paddingClass usageInfo btn btn-link'  data-voucherid= '" + rowdata + "' + >Voucher Usage Info</button></div>"
                                }
                            }
                        ]
                    });
                });
            }
            else {
                this.setState({ loaded: true })
                if (responseJson.statusDetails === "Session Expired!!") {
                    sessionStorage.clear()
                    this.props.history.push('/login')
                } else {
                    confirmAlert({
                        message: responseJson.statusDetails,
                        buttons: [
                            {
                                label: 'OK',
                                className: 'confirmBtn',
                                onClick: () => { this.props.history.push('/') }
                            }
                        ]
                    })
                }
            }
        })
            .then((e) => {
                $('#listtable').on("click", ".voucherCodesInfo", (e) => {
                    const options = {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            authToken: sessionStorage.getItem("authToken"),
                            voucherID: $(e.currentTarget).data("voucherid").voucherID + "",
                        })
                    }

                    fetch(URL.getVoucherCodes, options)
                        .then(response => (response.json()))
                        .then(data => {
                            if (data.status === "SUCCESS") {
                                let keyToDisplay = "";
                                if (data.voucherType === 0) {
                                    keyToDisplay = "Different Voucher Codes";
                                }
                                else {
                                    keyToDisplay = "Same Voucher Code";
                                }
                                let vouchData = [{
                                    "numberOfVouchers": data.numberOfVouchers,
                                    "voucherType": keyToDisplay,
                                    "amount": data.amount,
                                    "voucherUsage": data.voucherUsage,
                                    "planDescription": data.planDescription,
                                    "purchasedOn": data.purchasedOn,
                                    "": "",
                                    "vouchercodes": data.voucherCodes[0],
                                }]
                                this.setState({ VoucherData: vouchData });
                                let allwOnce = true;
                                for (let key in data.voucherCodes) {
                                    if (allwOnce) {
                                        allwOnce = false;
                                        continue;
                                    } else {
                                        this.setState((prevState) => ({
                                            VoucherData: [
                                                ...prevState.VoucherData,
                                                {
                                                    "vouchercodes": data.voucherCodes[key],
                                                }
                                            ],
                                        }));
                                    }
                                }
                                this.setState({
                                    voucherCodess: data,
                                    allowmodal: true
                                });
                            }
                            else if (data.statusDetails === "Session Expired") {
                                confirmAlert({
                                    message: data.statusDetails,
                                    buttons: [
                                        {
                                            label: "OK",
                                            className: "confirmBtn",
                                            onClick: () => {
                                                this.props.history.push("/login");
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
                })
            })
            .then((e) => {
                $('#listtable').on("click", ".moreDetails", (e) => {
                    const options = {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json"
                        },
                        body: JSON.stringify({
                            authToken: sessionStorage.getItem("authToken"),
                            voucherID: $(e.currentTarget).data("voucherid").voucherID + ""
                        })
                    }

                    fetch(URL.getVoucherInfo, options)
                        .then(response => (response.json()))
                        .then(data => {
                            if (data.status === "SUCCESS") {
                                this.setState({
                                    voucherMorDetail: data.voucherDetails,
                                    allowmodalFrMrdetail: true,
                                    planDesc: $(e.currentTarget).data("voucherid").planDescription
                                });
                            }
                            else if (data.statusDetails === "Session Expired") {
                                confirmAlert({
                                    message: data.statusDetails,
                                    buttons: [
                                        {
                                            label: "OK",
                                            className: "confirmBtn",
                                            onClick: () => {
                                                this.props.history.push("/login");
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
                })
            })
            .then((e) => {
                $('#listtable').on("click", ".usageInfo", (e) => {
                    this.props.history.push({
                        pathname: "/voucherUsageInfo",
                        frompath: "vouchers/getVoucherSummary",
                        state: {
                            voucherID: $(e.currentTarget).data("voucherid")
                        }
                    })
                })
            })
            .catch(e => {
                this.setState({ loaded: true })
                alert(e)
            })
    }

    handleEdit(e) {
        confirmAlert({
            message: e,
            buttons: [
                {
                    label: 'OK',
                    className: 'confirmBtn',
                    onClick: () => { }
                }
            ]
        })
    }

    crtVoucherCode = () => {

        if (Object.keys(this.state.voucherCodess).length !== 0) {
            let voucherCodess = this.state.voucherCodess;
            return (
                <div>
                    <div
                        style={{ display: "flex", marginBottom: "5px" }}
                        className="rejectedByCss"
                    >
                        <div style={{ fontStyle: "inherit", fontSize: "13px", width: "50%", display: "flex" }}>
                            <div style={{ width: "85%" }}>Voucher Type </div> <div>:</div>
                        </div>
                        <div style={{ fontSize: "13px", width: "50%" }}>
                            <span>{voucherCodess.voucherType === 0 ? "Different Voucher Codes" : "Same Voucher Code"}</span>
                        </div>
                    </div>
                    <div
                        style={{ display: "flex", marginBottom: "5px" }}
                        className="rejectedByCss"
                    >
                        <div
                            style={{ fontStyle: "inherit", fontSize: "13px", width: "50%", display: "flex" }}
                        >
                            <div style={{ width: "85%" }}>Number of Voucher </div><div>:</div>
                        </div>
                        <div style={{ fontSize: "13px", width: "50%" }}>
                            <span>{voucherCodess.numberOfVouchers}</span>
                        </div>
                    </div>  <div
                        style={{ display: "flex", marginBottom: "5px" }}
                        className="rejectedByCss"
                    >
                        <div
                            style={{ fontStyle: "inherit", fontSize: "13px", width: "50%", display: "flex" }}
                        >
                            <div style={{ width: "85%" }}>Purchased On </div><div>:</div>
                        </div>
                        <div style={{ fontSize: "13px", width: "50%" }}>
                            <span>{voucherCodess.purchasedOn}</span>
                        </div>
                    </div>
                    <div className='inputHolderCssVocu ScrollBarForApprove'>
                        {
                            voucherCodess.voucherCodes.map((posts, index) => (
                                <div key={index} style={{ display: "flex" }}>
                                    <div style={{ marginRight: '2px' }}>
                                        {index + 1}.
                                    </div>
                                    <div>
                                        {posts}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>
                    Voucher codes unavailable!
                </div>
            )
        }
    }

    // to get the voucher details..
    crtVouchermrDeatil = () => {
        if (Object.keys(this.state.voucherMorDetail).length !== 0) {
            const voucherMorDetail = this.state.voucherMorDetail;
            let keyToDisplay = "";

            if (voucherMorDetail.voucherStatus === 0) {
                keyToDisplay = "Not used";
            }
            else if (voucherMorDetail.voucherStatus === 1) {
                keyToDisplay = "Partially used";
            }
            else if (voucherMorDetail.voucherStatus === 2) {
                keyToDisplay = "Used all";
            } else {
                keyToDisplay = "Voucher expired";
            }

            return (
                <div>
                    <div className='inputHolderCssVocu'>
                        <div className="mainContentBodyCss">
                            <div
                                style={{ display: "flex", marginBottom: "5px" }}
                                className="" rejectedByCss
                            >
                                <div style={{ fontStyle: "inherit", fontSize: "13px", width: "52%", display: "flex" }}>
                                    <div style={{ width: "85%" }}>Purchased on </div> <div>:</div>
                                </div>
                                <div style={{ fontSize: "13px", width: "48%" }}>
                                    <span>{voucherMorDetail.purchasedOn}</span>
                                </div>
                            </div>
                            <div
                                style={{ display: "flex", marginBottom: "5px" }}
                                className="rejectedByCss"
                            >
                                <div
                                    style={{ fontStyle: "inherit", fontSize: "13px", width: "52%", display: "flex" }}
                                >
                                    <div style={{ width: "85%" }}>Amount paid({URL.rupeeSymbol})</div><div>:</div>
                                </div>
                                <div style={{ fontSize: "13px", width: "48%" }}>
                                    <span>{voucherMorDetail.voucherAmount}</span>
                                </div>
                            </div>
                            <div
                                style={{ display: "flex", marginBottom: "2px" }}
                                className="rejectedOncss"
                            >
                                <div
                                    style={{ fontStyle: "inherit", fontSize: "13px", width: "52%", display: "flex" }}
                                >
                                    <div style={{ width: "85%" }}>Voucher used</div><div>:</div>
                                </div>
                                <div style={{ fontSize: "13px", width: "48%" }}>
                                    <span>{voucherMorDetail.vouchersUsed} / {voucherMorDetail.noOfVouchersPurchased}</span>
                                </div>
                            </div>
                            <div
                                style={{ display: "flex", marginBottom: "2px" }}
                                className="rejectedOncss"
                            >
                                <div
                                    style={{ fontStyle: "inherit", fontSize: "13px", width: "52%", display: "flex" }}
                                >
                                    <div style={{ width: "85%" }}>Voucher status</div><div>:</div>
                                </div>
                                <div style={{ fontSize: "13px", width: "48%" }}>
                                    <span>{keyToDisplay}
                                    </span>
                                </div>
                            </div>
                            <div
                                style={{ display: "flex", marginBottom: "2px" }}
                                className="rejectedOncss"
                            >
                                <div
                                    style={{ fontStyle: "inherit", fontSize: "13px", width: "52%", display: "flex" }}
                                >
                                    <div style={{ width: "85%" }}>Voucher type</div><div>:</div>
                                </div>
                                <div style={{ fontSize: "13px", width: "48%" }}>
                                    <span>{voucherMorDetail.voucherType === 0 ? "Different voucher code" : "Same voucher code"}</span>
                                </div>
                            </div>
                            <div
                                style={{ display: "flex", marginBottom: "2px" }}
                                className="rejectedOncss"
                            >
                                <div
                                    style={{ fontStyle: "inherit", fontSize: "13px", width: "52%", display: "flex" }}
                                >
                                    <div style={{ width: "85%" }}>Expiry date</div><div>:</div>
                                </div>
                                <div style={{ fontSize: "13px", width: "48%" }}>
                                    <span>{voucherMorDetail.expiresOn}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <hr></hr>
                        </div>
                        <div className="mainContentBodyCss">
                            <div
                                style={{ display: "flex", marginBottom: "2px" }}
                                className="" rejectedByCss
                            >
                                <div style={{ fontStyle: "inherit", fontSize: "13px", width: "52%", display: "flex" }}>
                                    <div style={{ width: "85%", marginBottom: "3px", fontWeight: 500 }}>Plan Description</div> <div>:</div>
                                </div>
                                <div style={{ fontSize: "13px", width: "48%" }}>
                                    <span>{this.state.planDesc}</span>
                                </div>
                            </div>
                            <div
                                style={{ display: "flex", marginBottom: "5px" }}
                                className="" rejectedByCss
                            >
                                <div style={{ fontStyle: "inherit", fontSize: "13px", width: "52%", display: "flex" }}>
                                    <div style={{ width: "85%" }}>Storage limit</div> <div>:</div>
                                </div>
                                <div style={{ fontSize: "13px", width: "48%" }}>
                                    <span>{voucherMorDetail.planDetails.storagelimit}</span>
                                </div>
                            </div>
                            <div
                                style={{ display: "flex", marginBottom: "5px" }}
                                className="rejectedOncss"
                            >
                                <div
                                    style={{ fontStyle: "inherit", fontSize: "13px", width: "52%", display: "flex" }}
                                >
                                    <div style={{ width: "85%" }}>Plan amount({URL.rupeeSymbol})</div><div>:</div>
                                </div>
                                <div style={{ fontSize: "13px", width: "48%" }}>
                                    <span>{voucherMorDetail.planDetails.planAmount}</span>
                                </div>
                            </div>
                            <div
                                style={{ display: "flex", marginBottom: "2px" }}
                                className="rejectedOncss"
                            >
                                <div
                                    style={{ fontStyle: "inherit", fontSize: "13px", width: "52%", display: "flex" }}
                                >
                                    <div style={{ width: "85%" }}>Number of signs</div><div>:</div>
                                </div>
                                <div style={{ fontSize: "13px", width: "48%" }}>
                                    <span>{voucherMorDetail.planDetails.noOfSigns}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <Loader loaded={this.state.loaded} lines={13} radius={20} corners={1} rotate={0} direction={1} color="#000" speed={1} trail={60} shadow={false} hwaccel={false} className="spinner loader" zIndex={2e9} top="50%" left="50%" scale={1.00} loadedClassName="loadedContent" />
                <Table hover bordered striped responsive id="listtable" style={{ textAlign: "center" }}>
                    <thead><tr><th>Purchased On</th><th>Amount({URL.rupeeSymbol})</th><th>Voucher Usage</th><th>Voucher Status</th><th style={{ visibility: 'hidden' }}>Code</th><th style={{ visibility: 'hidden' }}>More</th><th style={{ visibility: 'hidden' }}>Usage</th></tr></thead>
                </Table>

                <Modal className='inputTakingModel' onClose={this.closeTheModal} open={this.state.allowmodalFrMrdetail} center={true} closeOnOverlayClick={false}>
                    <div className='WholeContentVocher'>
                        <div className='headingOfModalXcss'>
                            <span style={{ fontSize: "22px" }}>Voucher Details</span>
                        </div>
                        <div className='Divo3Css'>
                            {
                                this.crtVouchermrDeatil()
                            }
                        </div>
                        <div className='Divo6Css'>
                            <div className='proceedCancelCss'>
                                <button className='proceedbtnXVoucher' type='button' onClick={e => this.closeTheModal()}>OK</button>
                            </div>
                        </div>
                    </div>
                </Modal>

                <Modal className='inputTakingModel' onClose={this.closeTheModal} open={this.state.allowmodal} center={true} closeOnOverlayClick={false}>
                    <div className='WholeContentVocher'>
                        <div className='headingOfModalXcss'>
                            <span style={{ fontSize: "22px" }}>Voucher Code</span>
                        </div>
                        <div className='Divo3Css'>
                            {
                                this.crtVoucherCode()
                            }
                        </div>
                        <div className='Divo6Css'>
                            <div className='proceedCancelCss'>
                                <button style={{ marginRight: "30px" }} className='proceedbtnXVoucher' type='button' onClick={e => this.closeTheModal()}>OK</button>
                                <CSVLink
                                    headers={headers}
                                    data={this.state.VoucherData}
                                    filename={`Voucher code details- ${((new Date().getFullYear()) + '-' + (new Number(new Date().getMonth()) + 1) + '-' + (new Date().getDate()))}`}
                                    target="_blank"
                                >
                                    Export
                                </CSVLink>
                            </div>
                        </div>
                    </div>
                </Modal >

            </div >
        )
    }
}
