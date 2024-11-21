import React from 'react';
import { Table } from 'reactstrap';
import { URL } from '../URLConstant';
import '../../scss/jquery.dataTables.css'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
// import './bulkReg.css';
var $ = require('jquery');
var dt = require('datatables.net');
var datetime = require('datetime-moment');
let txnData = [];

var Loader = require('react-loader');

export default class BulkRegistationSummary extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
        }
    }

    componentDidMount() {
        this.setState({ loaded: false });
        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${jsonWebToken}`
            },
            body: JSON.stringify({})
        }
        fetch(URL.bulkRegistrationInfo, options)
            .then((response) => {
                return response.json()
            }).then((responseJson) => {
                if (responseJson.status === "SUCCESS") {
                    txnData = responseJson.info;
                    // txnData = [ 
                    //   {"batchNo":"INT1111","completionStatus":"0","totalCount":"100","failureCount":"10","requestedBy":"Harshith HV","requestedon":"2024-02-26 16:53:43","failureReason":"Validation errors","prescanStatus":"0"}, 
                    //   {"batchNo":"INT1112","completionStatus":"1","totalCount":"200","failureCount":"0","requestedBy":"Harshith HV","requestedon":"2024-02-26 16:54:43","failureReason":"NA","prescanStatus":"1"}, 
                    //   {"batchNo":"INT1113","completionStatus":"1","totalCount":"70","failureCount":"0","requestedBy":"Harshith HV","requestedon":"2024-02-26 16:55:43","failureReason":"NA","prescanStatus":"1"}, 
                    //   {"batchNo":"INT1114","completionStatus":"1","totalCount":"50","failureCount":"0","requestedBy":"Harshith HV","requestedon":"2024-02-26 16:56:43","failureReason":"NA","prescanStatus":"1"},       
                    //   ]
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
                                //     { "data": "null", 
                                //       "className": "text-center",
                                //       "render": function (data, type, row, meta) {
                                //         return meta.row + 1;
                                //     }
                                //    },
                                { "data": "batchNo" },
                                // {
                                //     "data": "requestedOn",
                                // },
                                {
                                    "data": "totalCount",
                                },
                                {
                                    "data": "null",
                                    "render": function (data, type, row) {
                                        // console.log(data);
                                        console.log(row);
                                        return row.totalCount - row.failureCount;
                                    }
                                },
                                {
                                    "data": "failureReason",
                                    "render": function (data, type, row) {
                                        console.log(row);
                                        return (row.failureReason == "") ? "-" : row.failureReason;
                                    }
                                },
                                {
                                    data: "completionStatus",
                                    "render": function (data, type, row) {
                                        switch (data) {
                                            case 0:
                                                return "Pending";
                                            case 1:
                                                return "Completed";
                                            default:
                                                return "Failure";
                                        }
                                    }
                                },
                                {
                                    data: "batchNo",
                                    render: function (data, type, row) {
                                        let disabled = row.completionStatus !== 1 ? "disabled" : "";
                                        let rowdata = JSON.stringify(row);
                                        // return "<div > <button  id='batchInfo' class='paddingClass batchInfo btn btn-link'  data-batchno='" + rowdata + "'>Download</button></div>"
                                        return "<div> <button id='batchInfo' class='paddingClass batchInfo btn btn-link' data-batchno='" + rowdata + "' " + disabled + ">Download</button></div>";
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
            }).then((e) => {
                $('#listtable').on("click", ".batchInfo", (e) => {
                    let body = { 
                        batchNo: $(e.currentTarget).data("batchno").batchNo + "",
                    };
                    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
                    const options = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': `Bearer ${jsonWebToken}`
                        },
                        body: JSON.stringify({body})
                    }
                    fetch(URL.bulkRegistrationInfo, options)
                        .then(response => (response.json()))
                        .then(data => {
                            if (data.status === "SUCCESS") {
                                // Parse the responseJson and generate CSV
                                const csvData = this.convertToCSV(data.info);
                                // Create a Blob object with the CSV data
                                const blob = new Blob([csvData], { type: 'text/csv' });
                                // Create a temporary anchor element to initiate download
                                const link = document.createElement('a');
                                link.href = window.URL.createObjectURL(blob);
                                link.download = `BatchNo-${$(e.currentTarget).data("batchno").batchNo}.csv`; // Set the filename for the downloaded file
                                // Trigger the download
                                link.click();
                            } else if (data.statusDetails === "Session Expired") {
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
                            } else {
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
                        }).catch(error => {
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
    }

    //     handleDownload = (batchNo) => {
    //       const authToken = sessionStorage.getItem("authToken");
    //       fetch(`${URL.bulkRegistrationInfo}?bNo=${btoa(batchNo)}&aT=${btoa(authToken)}`)
    //           .then((response) => response.json())
    //           .then((responseJson) => {
    //               if (responseJson.status === "SUCCESS") {
    //                   // Parse the responseJson and generate CSV
    //                   const csvData = this.convertToCSV(responseJson.searchInfo);
    //                   // Create a Blob object with the CSV data
    //                   const blob = new Blob([csvData], { type: 'text/csv' });
    //                   // Create a temporary anchor element to initiate download
    //                   const link = document.createElement('a');
    //                   link.href = window.URL.createObjectURL(blob);
    //                   link.download = 'data.csv'; // Set the filename for the downloaded file
    //                   // Trigger the download
    //                   link.click();
    //               } else {
    //                   // Handle error response
    //                   console.error("Error fetching CSV data");
    //               }
    //           })
    //           .catch((error) => {
    //               console.error("Error fetching CSV data:", error);
    //           });
    //   };

    convertToCSV = (data) => {
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))
        ].join('\r\n');
        return csv;
    };

    render() {
        return (
            <div>
                <Loader loaded={this.state.loaded} lines={13} radius={20} corners={1} rotate={0} direction={1} color="#000" speed={1} trail={60} shadow={false} hwaccel={false} className="spinner loader" zIndex={2e9} top="50%" left="50%" scale={1.00} loadedClassName="loadedContent" />
                <Table hover bordered striped responsive id="listtable" style={{ textAlign: "center" }}>
                    <thead><tr><th>Batch No.</th><th>Total Count</th><th>Success Count</th><th>Failure Reason</th><th>Completion Status</th><th>Report</th></tr></thead>
                </Table>
            </div >
        )
    }
}
