import React, { useEffect, useState } from 'react'
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import tableIcons from "../Inbox/MaterialTableIcons";
import MaterialTable, { MTableToolbar } from "material-table";
import { CsvBuilder } from "filefy";
import './voucher.css';

var Loader = require("react-loader");

function VoucherDetail(props) {

    const [allowLoader, setAllowLoader] = useState(true);

    //to store the data coming from diff page.
    // const [voucherSummDetails, setVoucherSummDetails] = useState([]);

    //to store the voucher details..
    const [voucherUsageInfo, setVoucherUsageInfo] = useState([]);

    //to store the data to be used in csv downlaod.
    const [csvFileDwnData, setCsvFileDwnData] = useState([]);

    const columns = [
        {
            title: "",
            field: "",
            cellStyle: {
                width: "2%",

            },
        },
        {
            title: "Voucher Code",
            field: "voucherCode",
            type: "string",
            cellStyle: {
                width: "24%",
                paddingLeft: "2px"
            }
        },
        {
            title: "Used By",
            field: "VoucherUsedBy",
            type: "string",

            cellStyle: {
                width: "24%",
                paddingLeft: "3px"
            },
        },
        {
            title: "Contact Number",
            field: "contactNumber",
            type: "number",
            cellStyle: {
                width: "24%",
            },
        },
        {
            title: "Voucher Activated On",
            field: "VoucherActivatedOn",
            type: "String",
            cellStyle: {
                width: "24%",
                paddingLeft: "3px"
            }
        }
    ];

    let Csvtitle = ['Plan Description', 'Voucher Amount (RS)', 'Voucher Type', 'Number of Voucher', 'Vouchers Used', 'Purchased On', '', 'Voucher status', 'Used By', 'Contact Number', 'Voucher code'];

    useEffect(() => {
        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken"),
                voucherID: props.location.state.voucherID.voucherID
            })
        }

        fetch(URL.getVoucherUsageDetails, options)
            .then(response => (response.json()))
            .then(data => {
                if (data.status === "SUCCESS") {
                    setVoucherUsageInfo(data.voucherUsageDetails);
                    let usageSummaryData = data.voucherUsageDetails;
                    let usrDataBefEdit = props.location.state.voucherID;
                    let usrData = {
                        planDescription: usrDataBefEdit.planDescription,
                        voucherAmount: usrDataBefEdit.voucherAmount,
                        voucherType: usrDataBefEdit.voucherType,
                        noOfVouchersPurchased: usrDataBefEdit.noOfVouchersPurchased,
                        vouchersUsed: usrDataBefEdit.vouchersUsed,
                        purchasedOn: usrDataBefEdit.purchasedOn,
                        voucherStatus: usrDataBefEdit.voucherStatus,
                        voucherID: usrDataBefEdit.voucherID
                    }
                    let allData = [];
                    let firstData = [];
                    for (let key in usrData) {
                        if (key === "voucherStatus" || key === "voucherID") {
                            continue;
                        }
                        else {
                            if (key === "voucherType") {
                                let voucherType = "";
                                if (usrData[key] === 0) {
                                    voucherType = "Different Voucher Type";
                                } else {
                                    voucherType = "Same Voucher Type";
                                }
                                firstData.push(voucherType);
                            }
                            else {
                                firstData.push(usrData[key]);
                            }
                        }
                    }
                    firstData.push('');
                    for (let key in usageSummaryData[0]) {
                        if (key === "tableData") {
                            continue;
                        } else {
                            if (key === "VoucherActivatedOn") {
                                firstData.push("Redeemed ");
                            } else {
                                firstData.push(usageSummaryData[0][key]);
                            }
                        }
                    }
                    allData.push(firstData);
                    if (usageSummaryData.length != 1) {
                        for (let key in usageSummaryData) {
                            let eachTimeArray = [];
                            for (let num = 0; num <= 6; num++) {
                                eachTimeArray.push('');
                            }
                            let eachUsrSummDetail = usageSummaryData[key];
                            for (let key in eachUsrSummDetail) {
                                if (key === "tableData") {
                                    continue;
                                } else {
                                    if (key === "VoucherActivatedOn") {
                                        eachTimeArray.push("Redeemed ");
                                    } else {
                                        eachTimeArray.push(eachUsrSummDetail[key]);
                                    }
                                }
                            }
                            allData.push(eachTimeArray);
                        }
                    }
                    setCsvFileDwnData(allData);
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
            <MaterialTable
                columns={columns}
                icons={tableIcons}
                data={voucherUsageInfo}
                options={{
                    exportButton: {
                        csv: true,
                        pdf: false,
                    },
                    exportCsv: (data, columns) => {
                        const builder = new CsvBuilder(`Voucher Usage Info-${((new Date().getFullYear()) + '-' + (new Number(new Date().getMonth()) + 1) + '-' + (new Date().getDate()))}`)
                            .setColumns(Csvtitle)
                            .addRows(csvFileDwnData)
                            .exportFile();
                        return builder;
                    },
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
                // actions={[
                //     {
                //         icon: () => <Delete id="deleteIconColor" />,
                //         id: "deleteIcon",
                //         tooltip: "Delete",
                //         onClick: (event, rowData) => removeTheEndUsers(event, rowData),
                //         isFreeAction: false,
                //         hidden: false,

                //         cellStyle: {
                //             padding: "0px"
                //         }
                //     },
                // ]}
                components={{
                    // ---------Overriding the Toolbar Component and customised-----------
                    Toolbar: (props) => (
                        <div
                            style={{
                                backgroundColor: "#e8eaf5",
                                height: "43px",
                                fontSize: "6px",
                            }}
                        >
                            <MTableToolbar {...props} />
                        </div>
                    ),
                }}
            ></MaterialTable>

        </div>
    )
}

export default VoucherDetail