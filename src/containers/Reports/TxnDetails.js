import React from 'react';
import { Table } from 'reactstrap';
import { URL } from '../URLConstant';
import '../../scss/jquery.dataTables.css'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import "./TxnDetails.css";
var $ = require('jquery');
var dt = require('datatables.net');
var datetime = require('datetime-moment')

let txnData = []

var Loader = require('react-loader');

export default class TxnDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            txnData: "",
            loaded: true
        }
    }

    componentDidMount() {
        var body = {
            "loginname": sessionStorage.getItem("username"),
        };
        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
        this.setState({ loaded: false })
        fetch(URL.getUnitsHistory, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jsonWebToken}`
            },
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json()
        }).then((responseJson) => {
        
            if (responseJson.status === "SUCCESS") {
                txnData = responseJson.txnHistory
                this.setState({ loaded: true })
                // Capture the `this` context of the React component
                const that = this;

                $(document).ready(function () {
                    $.fn.dataTable.moment('DD-MM-YYYY HH:mm:ss');
                    $('#listtable').dataTable({
                        "pagingType": "full_numbers",
                        "ordering": false,
                        "data": txnData,
                        "columns": [
                            { "width": "18%", "data": "filename" },
                            { "data": "date" },
                            { "data": "formattedAmount" },
                            { "data": "signType" },
                            {
                                "data": "signMode",
                                render: function (data, type, full, meta) {
                                    var msg = ""
                                    if (data === "1") {
                                        msg = "Aadhaar eSign"
                                    } else if (data === "2") {
                                        msg = "Electronic Sign"
                                    } 
                                    else if (data === "3") {
                                        msg = "DSC Sign"
                                    }
                                    else if (data === "4") {
                                        msg = "OTP Based Sign"
                                    }
                                    else {
                                        msg = ""
                                    }
                                    return msg
                                }
                            },
                            {
                                "data": "selfSigned",
                                render: function (data, type, full, meta) {
                                    var msg = ""
                                    if (data == 1) {
                                        msg = "Self"
                                    }  else {
                                        msg = "Others"
                                    }
                                    return msg
                                }
                            },
                            { "data": "txnId" },
                            {
                                render: function (data, type, full, meta) {
                                    if (full.signMode === "2" || full.signMode === "4" || full.signMode === "1" ) {
                                        // Add a data attribute to store txnId
                                        return `<button class="download-btn" data-txnid="${full.txnId}">Download</button>`;
                                    } else {
                                        return ""
                                    }
                                }
                            }
                        ]   
                    });
                     // Attach event listener using arrow function to ensure correct `this`
                $('#listtable tbody').on('click', '.download-btn', function(event) {
                    const txnId = $(event.currentTarget).data('txnid');
                    // Use `that` to access the React method, not `this`
                    that.downloadPDF(txnId);  // Correctly refer to the React component's method
                });
                });
            } else {
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
                                onClick: () => {  this.props.history.push('/')}
                            }
                        ]
                    })
                }
            }
        }).catch(e => {
            this.setState({ loaded: true })
            alert(e)
        })
    }

    // JavaScript function to handle the download
    downloadPDF(txnId) {
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    
    fetch(URL.getSummaryPDF + "?tID=" + btoa(txnId), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${jsonWebToken}`
        }
    })
    .then(response => {
        if (response.ok) {
            return response.blob(); // Assuming the response is a file (PDF)
        } else {
            throw new Error('Failed to download file');
        }
    })
    .then(blob => {
        // Create a download link and click it programmatically
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'summary.pdf'; // You can modify the file name if needed
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
    .catch(error => {
        console.error('Error:', error);
    });
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
        //  alert(e)
    }

    render() {
        return (
            <div>
                <Loader loaded={this.state.loaded} lines={13} radius={20} corners={1} rotate={0} direction={1} color="#000" speed={1} trail={60} shadow={false} hwaccel={false} className="spinner loader" zIndex={2e9} top="50%" left="50%" scale={1.00} loadedClassName="loadedContent" />
                {/* <Col >
                    <Card>
                    <CardHeader>
                        <b>Transaction History</b>
                    </CardHeader>
                    <CardBody> */}
                <Table hover bordered striped responsive id="listtable" style={{ textAlign: "center" }}>
                    <thead><tr><th style={{ textAlign: "left" }}>File Name</th><th>Date Time</th><th>Units</th><th>Sign Type</th><th>Sign Mode</th><th>Signed By</th><th>Transaction Ref. No.</th><th>Summary PDF</th></tr></thead>
                    {/* <tbody>
                        {this.renderTableData()}
                    </tbody> */}
                </Table>
                <p>Note: Summary PDF available for Aadhaar eSign,Electronic Sign and OTP Based Sign</p>
                {/* </CardBody>
                    </Card>
                </Col> */}
            </div>
        )
    }
}
