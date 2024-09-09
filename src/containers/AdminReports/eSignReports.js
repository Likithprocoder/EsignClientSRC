import React from 'react';
import { Table, Input, Col, Row, Button } from 'reactstrap';
import { URL } from '../URLConstant';
import $ from 'jquery';
import '../../scss/jquery.dataTables.css'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


var dt = require('datatables.net')
var buttons = require('datatables.net-buttons')

require('datatables.net-buttons/js/dataTables.buttons.min.js')();  //# HTML 5 file export
require('datatables.net-buttons/js/buttons.html5.js')();  //# HTML 5 file export
require('datatables.net-buttons/js/buttons.print.js')();  //# Print view button

var Loader = require('react-loader');

export default class eSignReports extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            txnData: "",
            loaded: true
        }
    }

    scriptLoaded() {
        window.A.sort();
    }

    componentDidMount() {

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        var startData = yyyy + '-' + mm + '-' + dd

        document.getElementById("fromDateContainer").defaultValue = startData
        document.getElementById("toDateContainer").defaultValue = startData
        this.getPaymentReports()
    }

    getPaymentReports = () => {
        var fromDate = document.getElementById("fromDateContainer").value
        var toDate = document.getElementById("toDateContainer").value

        var body = {
            "loginname": sessionStorage.getItem("username"),
            "authToken": sessionStorage.getItem("authToken"),
            "startDate": fromDate,
            "endDate": toDate,
            "esignStatus": "1"
        };
        this.setState({ loaded: false })
        fetch(URL.geteSignReports, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json()
        }).then((responseJson) => {
            if (responseJson.status === "SUCCESS") {
                var eSignList = responseJson.list
                this.setState({ loaded: true })
                $('#paymentList').DataTable().destroy();
                $('#paymentList').DataTable({
                    buttons: [
                        {
                            extend: 'csv',
                            filename: 'jsign-esigns-' + fromDate.replace(/-/g, '') + '-' + toDate.replace(/-/g, ''),
                            // customize: function (csv) {
                            //     return "My header\n\n"+  csv;
                            //  }
                        },
                        {
                            extend: 'print',
                        }
                    ],
                    "ordering": false,
                    "pagingType": "full_numbers",
                    "data": eSignList,
                    "columns": [{ "data": "username" },
                    {
                        "data": "txnDate",
                        render: function (data, type, full, meta) {
                            var msg = ""
                            if (data.length > 0) {
                                let str = data
                                msg = str.substring(0, str.length - 2);
                            }
                            return msg
                        }
                    },
                    { "data": "docName" },
                    { "data": "txnId" },
                    {
                        "data": "eSignPage",
                        render: function (data, type, full, meta) {
                            var msg = ""
                            if (data.length > 0) {
                                if (data === "SP") {
                                    msg = "Single Page"
                                } else if (data === "MP") {
                                    msg = "Multi Page"
                                }
                            }
                            return msg
                        }
                    },
                    { "data": "units" }]
                })
            } else {
                this.setState({ loaded: true })
                if (responseJson.statusDetails === "Session Expired!!") {
                    sessionStorage.clear()
                    this.props.history.push('/login')
                } else {
                    confirmAlert({
                        message: responseJson.statusDetails ,
                        buttons: [
                          {
                            label: 'OK',
                            className: 'confirmBtn',
                            onClick: () => { }
                          }
                        ]
                      })
                    alert(responseJson.statusDetails)
                }
            }
        }).catch(e => {
            this.setState({ loaded: true })
            alert(e)
        })
    }

    printTableData = () => {
              $('#paymentList').DataTable().buttons(['0']).trigger();

    }

    render() {
        return (
            <div>
                <Loader loaded={this.state.loaded} lines={13} radius={20} corners={1} rotate={0} direction={1} color="#000" speed={1} trail={60} shadow={false} hwaccel={false} className="spinner loader" zIndex={2e9} top="50%" left="50%" scale={1.00} loadedClassName="loadedContent" />
                <div className="inputDateContainer">
                    <Row>
                        <Col xs="0.5" style={{ paddingTop: "6px" }}>
                            <b>From</b>
                        </Col>
                        <Col xs="3">
                            <Input type="date" id="fromDateContainer" min='2019-01-01' onChange={this.getPaymentReports}></Input>
                        </Col>
                        <Col xs="0.5" style={{ paddingTop: "6px" }}>
                            <b>To</b>
                        </Col>
                        <Col xs="3">
                            <Input type="date" id="toDateContainer" min='2019-01-01' onChange={this.getPaymentReports}></Input>
                        </Col>
                        <Col xs="1.5">
                            <Button block outline color="primary" className="px-4" onClick={this.printTableData}>Download as CSV</Button>
                        </Col>
                    </Row>
                </div>
                <br></br>

                <Table hover bordered striped responsive id="paymentList" style={{ textAlign: "center", width: "100%" }}>
                    <thead>
                        <tr><th>Login</th><th>Signed On</th><th>Document Name</th><th>Transaction Ref. No.</th><th>eSign Type</th><th>Units</th></tr></thead>
                </Table>
                {/* <iframe name="print_frame" width="0" height="0" frameborder="0" src="about:blank"></iframe> */}
            </div>
        )
    }
}