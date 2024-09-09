import React, { Component } from "react";
import { URL } from '../URLConstant'
import { Button, Table } from 'reactstrap';
import $ from 'jquery';
import '../../scss/jquery.dataTables.css'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

let serviceData = []
var dt = require('datatables.net');

var Loader = require('react-loader');

export default class UpdateServices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: "",
            loaded: true
        }
    }

    componentDidMount() {
        var body = {
            "username": sessionStorage.getItem("username"),
            "authToken": sessionStorage.getItem("authToken")
        }
        this.setState({ loaded: false })
        fetch(URL.getServices, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json()
        }).then((responseJson) => {
            if (responseJson.status === "SUCCESS") {
                serviceData = responseJson.list
                this.setState({ loaded: true })
                $(document).ready(function () {
                    $('#serviceList').dataTable({
                        "ordering": false
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
                            onClick: () => { }
                          }
                        ]
                      })
                   // alert(responseJson.statusDetails)
                }
            }
        }).catch(e => {
            this.setState({ loaded: true })
            alert(e)
        })
    }


    renderTableData() {
        return serviceData.map((services, index) => {
            var status
            if (services.enableStatus === 1) {
                status = "ACTIVE"
            }
            if (services.enableStatus === 0) {
                status = "DISABLED"
            }
            return (
                <tr key={index}>
                    <td><input type="checkbox" id={services.serviceName} value={services.enableStatus} /></td>
                    <td style={{textAlign:"left"}}>{services.serviceDescription}</td>
                    <td style={{textAlign:"left"}}>{services.serviceName}</td>
                    <td style={{textAlign:"left"}}><span class={status}>{status}</span></td>
                </tr>
            )
        })
    }

    updateService(e) {
        var checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        var list = []
        var msg
        if (e === 1) {
            msg = "Press OK to Enable service"
        } else if (e === 0) {
            msg = "Press OK to Disable service"
        }

        if (checkboxes.length > 0) {
            for (var checkbox of checkboxes) {
                var service = {
                    serviceName: checkbox.id,
                    enableStatus: e
                }
                list.push(service)
            }
            var body = {
                "username": btoa(sessionStorage.getItem("username")),
                "authToken": sessionStorage.getItem("authToken"),
                "list": list
            }
            this.setState({ loaded: false })
            var r = window.confirm(msg)
            if (r === true) {
                fetch(URL.updateServices, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }).then((response) => {
                    return response.json()
                }).then((responseJson) => {
                    if (responseJson.status === "SUCCESS") {
                        this.setState({ loaded: true })
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
                        //alert(responseJson.statusDetails)
                        window.location.reload(false);
                    } else {
                        if (responseJson.statusDetails === "Session Expired!!") {
                            sessionStorage.clear()
                            this.setState({ loaded: true })
                            this.props.history.push('/login')
                        } else {
                            this.setState({ loaded: true })
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
                           // alert(responseJson.statusDetails)
                        }
                    }
                }).catch(e => {
                    this.setState({ loaded: true })
                    alert(e)
                })
            }else{
                this.setState({ loaded: true })
            }
        } else {
            confirmAlert({
                message: "Please select the services" ,
                buttons: [
                  {
                    label: 'OK',
                    className: 'confirmBtn',
                    onClick: () => { }
                  }
                ]
              })
            //alert("Please select the services")
            
        }
    }

    render() {
        return (
            <div>
                <Loader loaded={this.state.loaded} lines={13} radius={20} corners={1} rotate={0} direction={1} color="#000" speed={1} trail={60} shadow={false} hwaccel={false} className="spinner loader" zIndex={2e9} top="50%" left="50%" scale={1.00} loadedClassName="loadedContent" />
                <div class="serviceList_Container" >
                <Table hover bordered striped responsive id="serviceList">
                    <thead style={{textAlign:"left"}}><tr><th></th><th>Service Description</th><th>Service Name</th><th>Service Status</th></tr></thead>
                    <tbody>
                        {this.renderTableData()}
                    </tbody>
                </Table>
                </div>
                <br></br>
                <Button color="danger" className="px-4" id="service_disable_btn" style={{ margin: "0% 0% 0% 65%" }} onClick={(e) => this.updateService(0)}>DISABLE</Button>
                <Button color="primary" className="px-4" style={{ marginLeft: "3%" }} onClick={(e) => this.updateService(1)}>ENABLE</Button>
            </div>
        )
    }
}