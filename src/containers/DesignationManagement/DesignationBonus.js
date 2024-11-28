import React, { Component } from 'react';
import { EditOutlined, } from '@ant-design/icons';
import { Button, Input, Table, Modal, Tooltip } from 'antd';
import "./Designation.css";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import Loader from "react-loader";
import {
    InputGroup,
    Row,
} from "reactstrap";
class DesignationBonus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: [],
            columns: [
                {
                    title: 'Designation',
                    dataIndex: 'designation',
                    key: 'designation',
                    sorter: (a, b) => a.designation.localeCompare(b.designation),
                },
                {
                    title: 'Description',
                    dataIndex: 'designation_descp',
                    key: 'designation_descp',
                },
                {
                    title: 'Bonus ',
                    dataIndex: 'bonusCredits',
                    width: '10%',
                    key: 'bonusCredits',
                    sorter: (a, b) => a.bonusCredits - b.bonusCredits,
                },
                {
                    title: 'Bonus Type',
                    dataIndex: 'bonusType',
                    width: '10%',
                    key: 'bonusType',
                },
                {
                    title: 'Status',
                    dataIndex: 'status',
                    key: 'status',
                    render: (status) => (
                        <span>
                            {status === 1 ? 'Active' : status === 0 ? 'Inactive' : 'Deleted'}
                        </span>
                    ),
                },
                {
                    title: 'Actions',
                    dataIndex: '',
                    key: 'x',
                    width: '15%',
                    render: (text, record) => (
                        <div>
                            {
                                record.status === 1 ? (
                                    <a
                                        type="button"
                                        style={{ color: "blue" }}
                                        onClick={() => this.modifyStatus(record, 0)}
                                    >
                                        Disable
                                    </a>
                                ) : (
                                    <a
                                        type="button"
                                        style={{ color: "green" }}
                                        onClick={() => this.modifyStatus(record, 1)}
                                    >
                                        Enable
                                    </a>
                                )
                            }
                            &nbsp; / &nbsp; <Tooltip title="Edit details"   color={'rgba(0, 0, 0, 0.54)'}>
                                <EditOutlined onClick={() => this.handle(record)} />
                            </Tooltip> &nbsp; / &nbsp;
                            <Tooltip title="Remove Designation" placement="topLeft" color={'rgba(0, 0, 0, 0.54)'} >

                                <a
                                    className='fa fa-trash'
                                    type="submit"
                                    style={{ color: "red", fontSize: "20px" }}
                                    onClick={(e) =>
                                        this.modifyStatus(record, 2)
                                    }
                                >
                                </a>
                            </Tooltip>
                        </div>
                    )
                },
                // {
                //     title: 'More',
                //     dataIndex: '',
                //     key: 'x',
                //     render: (text, record) => (

                //         <Tooltip title="Edit details" color={'rgba(0, 0, 0, 0.54)'}>
                //             <EditOutlined onClick={() => this.handle(record)} />
                //         </Tooltip>


                //     ),
                // },
            ],
            loaded: true,
            modal: false,
            designation: "",
            description: "",
            units: "",
            editMode: 0,
            bonusId: "",
            submitButton: true
        };

    }

    componentDidMount() {
        var body = {
            authToken: sessionStorage.getItem("authToken"),

        };
        this.setState({ loaded: false });
        fetch(URL.fetchDesignationBonus, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === "SUCCESS") {
                    this.setState({ loaded: true, info: responseJson.designationBonus });
                } else {
                    this.setState({ loaded: true });
                    if (responseJson.statusDetails === "Session Expired!!") {
                        sessionStorage.clear();
                        this.props.history.push("/login");
                    } else {
                        confirmAlert({
                            message: responseJson.statusDetails,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => { },
                                },
                            ],
                        });
                    }
                }
            })
            .catch((e) => {
                this.setState({ loaded: true });
                alert(e);
            });
    }



    handle = (record) => {

        this.setState({
            editMode: 1,
            modal: true,
            designation: record.designation,
            description: record.designation_descp,
            units: record.bonusCredits,
            bonusId: record.slNo

        });
    }


    modifyStatus = (record, updatedStatus) => {
        let message = "";
        if (updatedStatus === 2) {
            message = "Are you sure you want to remove the Designation: " + record.designation + "?";
        } else if (updatedStatus === 1) {
            message = "Would you like to enable the Designation: " + record.designation + "?";
        } else {
            message = "Would you like to disable the Designation: " + record.designation + "?";
        }
        confirmAlert({
            message: message,
            closeOnClickOutside: false,

            buttons: [
                {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                        let body = {
                            authToken: sessionStorage.getItem("authToken"),
                            slNo: record.slNo,
                            updatedStatus: updatedStatus
                        }
                        this.setState({ loaded: false })
                        fetch(URL.upddateDesignationStatus, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(body),
                        })

                            .then((response) => {
                                return response.json();

                            })
                            .then((responseJson) => {
                                if (responseJson.status === "SUCCESS") {

                                    confirmAlert({
                                        message: responseJson.statusDetails,
                                        closeOnClickOutside: false,
                                        buttons: [
                                            {
                                                label: "OK",
                                                className: "confirmBtn",
                                                onClick: () => {
                                                    this.setState({ loaded: true })
                                                    window.location.reload()
                                                }
                                            },

                                        ]
                                    })




                                }
                                else {
                                    this.setState({ loaded: true })
                                    if (responseJson.statusDetails === "Session Expired!!") {
                                        alert("Session Expired!!")
                                        sessionStorage.clear();
                                        this.setState({ loaded: true });
                                        this.props.history.push("/login");
                                    } else {
                                        confirmAlert({
                                            message: responseJson.statusDetails,
                                            buttons: [
                                                {
                                                    label: "OK",
                                                    className: "confirmBtn",
                                                    onClick: () => { },
                                                },
                                            ],
                                        });
                                        this.setState({ loaded: true });
                                    }
                                }

                            })
                            .catch((e) => {
                                this.setState({ loaded: true });
                                alert(e);
                            });


                    },
                },
                {
                    label: "Cancel",
                    className: "cancelBtn",
                    onClick: () => { },
                },
            ],
        });


    }



    CloseDesignationModal = (e) => {
        e.preventDefault()
        this.setState({ modal: false, designation: "", description: "", units: "", editMode: 0 });
    };
    openDesignationModal = (e) => {
        e.preventDefault()
        this.setState({ modal: true, });
    };

    setInput = (e) => {
        let value = e.target.value;
        if (e.target.id == 'designation') {
            let filteredValue = value.trim().replace(/[^a-zA-Z0-9 ]/g, '');
            this.setState({ designation: filteredValue, submitButton: false });
        }
        else if (e.target.id == 'description') {
            let filtereddescription = value.trim().replace(/[^a-zA-Z0-9 ]/g, '');
            this.setState({ description: filtereddescription, submitButton: false });
        }
    
        else {
            let filteredunit = value.replace(/[^0-9]/g, '').slice(0, 5); ;
            this.setState({ units: filteredunit, submitButton: false });
        }



    }



    addOrEditDesignationMapping = (e) => {
        e.preventDefault();
        if (this.state.designation === "") {
            confirmAlert({
                message: "Please enter the Designation.",
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => { },
                    },
                ],
            });
            return;
        }

        if (this.state.description === "") {
            confirmAlert({
                message: "Please enter the Designation Description.",
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => { },
                    },
                ],
            });
            return;
        }

        if (this.state.units === "") {
            confirmAlert({
                message: "Please fill in the Bonus Credits field.",
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => { },
                    },
                ],
            });
            return;
        } else if (isNaN(this.state.units)) {
            confirmAlert({
                message: "Please enter a valid number for Bonus Credits.",
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => { },
                    },
                ],
            });
            return;
        }

        let jsonArray = [{
            "designation": this.state.designation,
            "designation_description": this.state.description,
            "bonusCredits": this.state.units

        }]
        let message = "";
        var body = {};
        let endpoint = "";
        let sucessMessage = "";
        if (this.state.editMode == 1) {
            endpoint = URL.UpdateDesignationBonus
            message = "Would you like to update the details for the Designation: " + this.state.designation + " ?"
            sucessMessage = "Record updated successfully"
            body = {
                authToken: sessionStorage.getItem("authToken"),
                slNo: this.state.bonusId,
                designation: this.state.designation,
                designation_descp: this.state.description,
                bonusCredits: this.state.units
            };


        }

        else {
            endpoint = URL.insertDesignationBonus
            message = "Would you like to add the Designation: " + this.state.designation + "?"
            sucessMessage = "Record inserted successfully"
            body = {
                authToken: sessionStorage.getItem("authToken"),
                designationBasedBonus: jsonArray
            };

        }





        confirmAlert({
            message: message,
            closeOnClickOutside: false,
            buttons: [
                {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {

                        this.setState({ loaded: false });
                        fetch(endpoint, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(body),
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                if (responseJson.status === "SUCCESS") {
                                    this.setState({ modal: false });
                                    confirmAlert({
                                        message: sucessMessage,
                                        buttons: [
                                            {
                                                label: "OK",
                                                className: "confirmBtn",
                                                onClick: () => {
                                                    this.setState({ loaded: true, submitButton: false })
                                                    window.location.reload()
                                                },
                                            },
                                        ],
                                    });

                                } else {
                                    this.setState({ loaded: true });
                                    if (responseJson.statusDetails === "Session Expired!!") {
                                        sessionStorage.clear();
                                        this.props.history.push("/login");
                                    } else {
                                        confirmAlert({
                                            message: responseJson.statusDetails,
                                            buttons: [
                                                {
                                                    label: "OK",
                                                    className: "confirmBtn",
                                                    onClick: () => { },
                                                },
                                            ],
                                        });
                                    }
                                }
                            })
                            .catch((e) => {
                                this.setState({ loaded: true });
                                alert(e);
                            });


                    },
                },
                {
                    label: "Cancel",
                    className: "cancelBtn",
                    onClick: () => { },
                },
            ],
        });



    }

    render() {
        const { columns } = this.state;



        return (
            <div>
                <Loader
                    loaded={this.state.loaded}
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


                <div style={{ display: "flex", width: "100%", marginBottom: "12px", alignItems: "center", justifyContent: "space-between" }}>
                    <div id='tempGroupListCss'>

                        <span>Allocate bonus credits based on each designation level.</span>

                    </div>
                    <div className='viewAndAddUserBtn' style={{ width: "41%", textAlign: "end" }}>
                        <Tooltip title="Add Designation" color={'rgba(0, 0, 0, 0.54)'} >
                            <button style={{ height: "fit-content" }} type='submit' onClick={(e) => this.openDesignationModal(e)} className='btn btn-success'>Add Entry</button>
                        </Tooltip>
                    </div>
                </div>







                <Table
                    columns={columns}
                    dataSource={this.state.info}
                    pagination={{
                        pageSize: 10,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    scroll={{ x: '100%' }}
                    rowClassName={(record) => record.status === 1 ? 'activeRow' : record.status === 0 ? 'inactiveRow' : 'deletedRow'}
                />

                <Modal
                    centered
                    open={this.state.modal}
                    onClose={this.CloseDesignationModal}
                    onOk={this.CloseDesignationModal}
                    onCancel={this.CloseDesignationModal}
                    maskClosable={false}
                    style={{ zIndex: 999 }}
                    footer={[
                        <Button className="btn btn-danger rounded-pill" key="back" onClick={this.CloseDesignationModal}>
                            Close
                        </Button>,
                        <Button className="btn btn-success rounded-pill" key="submit" style={{ backgroundColor: "#1dd1a1" }} disabled={this.state.editMode === 0 ? false : this.state.submitButton} onClick={(e) => { this.addOrEditDesignationMapping(e) }}>
                            <span>Submit &#8594; </span>
                        </Button>,
                    ]}
                >
                    <div className="Header">
                        <span style={{ color: "#c79807" }}>
                            {this.state.editMode === 1 ? 'Update Designation Bonus Details' : 'Add Designation Bonus Details'}
                        </span>
                    </div>
                    <div className="designation-para-text">
                        <div style={{ margin: "2rem" }}>
                            <Row>
                                <InputGroup style={{ marginTop: "1rem" }} className="inputGrp">
                                    <div style={{ width: "100%" }}>
                                        <label className="inputGrpLabel" >Designation:&nbsp;</label>
                                        <Input
                                            className="inputGrpInput"
                                            type="text"
                                            placeholder="Enter Designation"
                                            id="designation"
                                            onChange={(e) => { this.setInput(e) }}
                                            required={true}
                                            value={this.state.designation}
                                            autoComplete="off"
                                        />
                                    </div>
                                </InputGroup>

                                <InputGroup className="inputGrp">
                                    <div style={{ width: "100%" }}>
                                        <label className="inputGrpLabel">Description:&nbsp;</label>
                                        <Input
                                            className="inputGrpInput"
                                            type="text"
                                            value={this.state.description}
                                            placeholder="Enter Description"
                                            id="description"
                                            onChange={(e) => { this.setInput(e) }}
                                            required={true}
                                            autoComplete="off"
                                        />
                                    </div>
                                </InputGroup>

                                <InputGroup className="inputGrp">
                                    <div style={{ width: "100%" }}>
                                        <label className="inputGrpLabel">Bonus Credits:&nbsp;</label>
                                        <Input
                                            className="inputGrpInput"
                                            type="text"
                                            placeholder="Enter Bonus Credits"
                                            id="units"
                                            value={this.state.units}
                                            required={true}
                                            onChange={(e) => { this.setInput(e) }}
                                            autoComplete="off"

                                        />
                                    </div>
                                </InputGroup>
                            </Row>
                        </div>
                    </div>
                </Modal>

            </div>
        );
    }
}

export default DesignationBonus;