import React, { Component } from 'react';
import { MenuOutlined, } from '@ant-design/icons';
import { Button, Input, Table, Modal, Tooltip } from 'antd';
import "./Employeelist.css";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import Loader from "react-loader";
import {
    InputGroup,
    Row,
} from "reactstrap";
class EmployeeList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: [],
            columns: [
                {
                    title: 'Emp Id',
                    dataIndex: ['id', 'empId'], // Accessing EMP_ID within the id object',
                    key: 'empId',
                    sorter: (a, b) => a.id.EmpId.localeCompare(b.id.empId),
                },
                {
                    title: 'Vouchers Used',
                    dataIndex: 'voucherUsedCount',
                    sorter: (a, b) => a.voucherUsedCount - b.voucherUsedCount,
                },
                {
                    title: 'Units Subscribed',
                    dataIndex: 'unitsSubscribed',
                    // width: '10%',
                    sorter: (a, b) => a.unitsSubscribed - b.unitsSubscribed,
                },

                {
                    title: 'Status',
                    dataIndex: 'empStatus',
                    key: 'status',
                    render: (status) => (
                        <span>
                            {status === "1" ? 'Active' : status === "0" ? 'Inactive' : 'Deleted'}
                        </span>
                    ),
                },
                {
                    title: 'Registration',
                    dataIndex: 'registration',
                    key: 'regis',
                    render: (text, record) => (
                        <span>
                            {record.registered === 1 ? 'Completed' : record.registered === 0 ? 'Pending' : 'Deleted'}
                        </span>
                    ),
                },
                {
                    title: 'Action',
                    dataIndex: '',
                    key: 'x',
                    width: '15%',
                    render: (text, record) => (
                        <div>
                            {
                                record.empStatus == 1 ? (
                                    <a
                                        type="button"
                                        style={{ color: "blue" }}
                                        onClick={() => this.modifyStatus(record.id.empId, "0")}
                                    >
                                        Disable
                                    </a>
                                ) : (
                                    <a
                                        type="button"
                                        style={{ color: "green" }}
                                        onClick={() => this.modifyStatus(record.id.empId, "1")}
                                    >
                                        Enable
                                    </a>
                                )
                            }
                        </div>
                    )
                },
                {
                    title: 'More',
                    dataIndex: '',
                    key: 'x',
                    render: (text, record) => (

                        <Tooltip title="Edit details" color={'rgba(0, 0, 0, 0.54)'}>
                            {/* <EditOutlined onClick={() => this.handle(record)} /> */}
                            <MenuOutlined onClick={() => this.handle(record)} />
                        </Tooltip>
                    ),
                },
            ],
            txnData: "",
            loaded: true,
            allowmodal: false,
            contactModal: false,
            allowmodalFrMrdetail: false,
            empMoreDetail: {},
            name: "",
            empId: "",
            filteredName: "",
            filteredMobile: "",
            filteredEmail: "",
            designation: "",
            readOnly: false,
            editMode: 0,
            inputColor: "lightgrey",
            isEmpDisable: false,
            corporateID: ""
        };
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        this.fetchEmployeeList();
    }

    fetchEmployeeList = () => {
        this.setState({ loaded: false });
        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
        fetch(URL.getCorpEmpMappingList, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${jsonWebToken}`
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.status === "SUCCESS") {
                    this.setState({ loaded: true, info: responseJson.corpEmpSummary.filter(emp => emp.empStatus !== "2"), corporateID: responseJson.corporateID });
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

    updateCorpEmployee = (options) => {
        fetch(URL.updateCorpEmpMapping, options)
            .then(response => (response.json()))
            .then(data => {
                // console.log(data);
                if (data.status === "SUCCESS") {
                    if (data.statusDetails == "Employee removed successfully") {
                        this.setState({ contactModal: false });
                    }
                    confirmAlert({
                        message: data.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => {
                                },
                            },
                        ],
                    });
                    this.fetchEmployeeList(); // Refresh the list
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
    }

    handle = (record) => {
        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                'Authorization': `Bearer ${jsonWebToken}`
            },
            body: JSON.stringify({
                empId: record.id.empId,
                corpID:this.state.corporateID
            })
        }

        fetch(URL.getCorpEmployee, options)
            .then(response => response.json())
            .then(data => {
                if (data.status === "SUCCESS") {
                    this.setState({
                        empMoreDetail: data.corpEmployee,
                        contactModal: true,
                        empId: data.corpEmployee.empId,
                        filteredName: data.corpEmployee.name,
                        filteredEmail: data.corpEmployee.emailId,
                        filteredMobile: data.corpEmployee.mobileNo,
                        designation: data.corpEmployee.designation
                    });

                    if (record.empStatus === "0") {
                        this.setState({ isEmpDisable: true });
                    } else {
                        this.setState({ isEmpDisable: false});
                    }

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
            })
            .catch(error => {
                confirmAlert({
                    message: `Something went wrong. Please try again!`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ],
                });
            });
    }

    deleteEmpById = () => {
        confirmAlert({
            message: `Are you sure you want to delete the selected employee with EMP ID: ${this.state.empId}?`,
            buttons: [
                {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
                        const options = {
                            method: "POST",
                            headers: {
                                "Content-type": "application/json",
                                'Authorization': `Bearer ${jsonWebToken}`
                            },
                            body: JSON.stringify({
                                empId: this.state.empId,
                                updatedStatus: "2",
                                corpID: this.state.corporateID
                            })
                        }
                        this.updateCorpEmployee(options);
                    },
                },
                {
                    label: "Cancel",
                    className: "confirmBtn",
                    onClick: () => { },
                },
            ],
        });
    }

    modifyStatus = (empId, status) => {
        confirmAlert({
            message: `Are you sure you want to ${status == 0 ? 'disable' : 'enable'} the selected employee with EMP ID: ${empId}?`,
            buttons: [
                {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
                        const options = {
                            method: "POST",
                            headers: {
                                "Content-type": "application/json",
                                'Authorization': `Bearer ${jsonWebToken}`
                            },
                            body: JSON.stringify({
                                empId: empId,
                                updatedStatus: status,
                                corpID:this.state.corporateID
                            })
                        }
                        this.updateCorpEmployee(options);
                    },
                },
                {
                    label: "Cancel",
                    className: "confirmBtn",
                    onClick: () => { },
                },
            ],
        });
    }

    addOrEditContact = (e) => {
        e.preventDefault();
        let name = document.getElementById("contactName").value.trim();
        let mobile = document.getElementById("contactMobile").value.trim();
        let email = document.getElementById("contactEmail").value.trim();
        let designation = document.getElementById("contactDesig").value.trim();
    
        // validation
        const mobileRegex = /^[6-9]\d{9}$/;
        const emailRegex = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[a-zA-Z]{2,6}$/;
    
        if (name === "" || name.length == 0) {
            alert("Please enter contact name");
            return false;
        } else if (mobile.length != 10 || !mobileRegex.test(mobile)) {
            alert("Please enter a valid mobile number");
            return false;
        } else if (email === "" || email.length < 5 || !emailRegex.test(email)) {
            alert("Please enter valid email id");
            return false;
        } else if (designation === "" || designation.length == 0) {
            alert("Please enter designation");
            return false;
        }
        
        // console.log(this.state.empMoreDetail);
    
        if (
            name === this.state.empMoreDetail.name &&
            mobile === this.state.empMoreDetail.mobileNo &&
            email === this.state.empMoreDetail.emailId &&
            designation === this.state.empMoreDetail.designation
        ) {
            confirmAlert({
                message: "No changes detected. The data is unmodified.",
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
    
        let disaplayMessage = "Employee details are modified, Do you want to save?";
    
        confirmAlert({
            message: disaplayMessage,
            buttons: [
                {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
                        let body = {
                            empId: this.state.empId,
                            updatedInfo: {
                                "updname": name, "updemailId": email, "updmobileNo": mobile, "upddesignation": designation
                            },
                            corpID:this.state.corporateID
                        };
                        const url = URL.updateCorpEmpMapping;

                        this.setState({ loaded: false });
                        fetch(url, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${jsonWebToken}`
                            },
                            body: JSON.stringify(body),
                        })
                            .then((response) => response.json())
                            .then((responseJson) => {
                                if (responseJson.status === "SUCCESS") {
                                    this.setState({ loaded: true });
                                    confirmAlert({
                                        message: responseJson.statusDetails,
                                        closeOnClickOutside: false,
                                        buttons: [
                                            {
                                                label: "OK",
                                                className: "confirmBtn",
                                                onClick: () => {
                                                    this.setState({ contactModal: false });

                                                    this.setState({ editMode: 0 });
                                                    this.setState({ readOnly: false });
                                                    this.setState({ inputColor: "lightgrey" });
                                                    document.getElementById("submitEmp").style.display = "none";
                                                    document.getElementById("cancelEmp").style.display = "none";
                                                    document.getElementById("editEmp").style.display = "";
                                                    document.getElementById("deleteEmp").style.display = "";
                                                    this.fetchEmployeeList();
                                                },
                                            },
                                        ],
                                    });
                                } else {
                                    this.setState({ loaded: true });
                                    if (responseJson.statusDetails === "Session Expired!!") {
                                        alert("Session Expired!!");
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
                    className: "confirmBtn",
                    onClick: () => { },
                },
            ],
        });
    };


    onCloseContactModal = (e) => {
        e.preventDefault()
        this.setState({ contactModal: false });

        this.setState({ editMode: 0 });
        this.setState({ readOnly: false });
        this.setState({ inputColor: "lightgrey" });
        document.getElementById("submitEmp").style.display = "none";
        document.getElementById("cancelEmp").style.display = "none";
        document.getElementById("editEmp").style.display = "";
        document.getElementById("deleteEmp").style.display = "";
    };

    setInput = (e) => {
        let value = e.target.value;
        if (e.target.id == 'contactName') {
            let filteredValue = value.replace(/[^a-zA-Z0-9 ]/g, '');
            this.setState({ filteredName: filteredValue });
        } else if (e.target.id == 'contactMobile') {
            this.setState({ filteredMobile: value });
        } else if (e.target.id == 'contactEmail') {
            this.setState({ filteredEmail: value });
        } else if (e.target.id == 'contactDesig') {
            this.setState({ designation: value });
        }
    }

    toggleReadOnly = () => {
        // this.setState({ loaded: true });
        this.setState({ editMode: 1 });
        this.setState({ readOnly: true });
        this.setState({ inputColor: "white" });
        document.getElementById("submitEmp").style.display = "";
        document.getElementById("cancelEmp").style.display = "";
        document.getElementById("editEmp").style.display = "none";
        document.getElementById("deleteEmp").style.display = "none";

        // Focus the input field when the button is clicked
        if (this.inputRef.current) {
            this.inputRef.current.focus();
        }
    };


    openUploadPage= (e) => {
        e.preventDefault();
        this.props.history.push("/uploadEmpDetails")
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


                <div style={{ display: "flex", marginBottom: "12px", alignItems: "center", justifyContent: "space-between", float: "right"}}>
                    {/* <div id='tempGroupListCss'>

                        <span>Allocate bonus credits based on each designation level.</span>
                      
                    </div> */}
                    <div className='viewAndAddUserBtn'>
                        <Tooltip title="Add employee" color={'rgba(0, 0, 0, 0.54)'} >
                            <button style={{ height: "fit-content" }} type='submit' onClick={(e) => this.openUploadPage(e)} className='btn btn-success'>Add employee</button>
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

                    rowClassName={(record) =>
                        record.empStatus === "1"
                            ? 'activeRow'
                            : record.empStatus === "0"
                                ? 'inactiveRow'
                                : 'deletedRow'
                    }
                />

                <Modal
                    centered
                    open={this.state.contactModal}
                    onClose={this.onCloseContactModal}
                    onOk={this.onCloseContactModal}
                    onCancel={this.onCloseContactModal}
                    maskClosable={false}
                    style={{ zIndex: 999 }}
                    footer={[
                        <Button className="btn btn-danger rounded-pill" id="deleteEmp" key="back" onClick={this.deleteEmpById} style={{ height: "fit-content", marginRight: "5px" }} disabled={this.state.isEmpDisable}>
                            Delete
                        </Button>,
                        <Button className="btn btn-primary rounded-pill" id="editEmp" key="edit" style={{ backgroundColor: "#1dd1a1", height: "fit-content", color: "white" }} onClick={this.toggleReadOnly} disabled={this.state.isEmpDisable}>
                            <span>Edit</span>
                        </Button>,
                        <Button className="btn btn-danger rounded-pill" id="cancelEmp" key="back" onClick={this.onCloseContactModal} style={{ height: "fit-content", marginRight: "5px", display: "none" }}>
                            Cancel
                        </Button>,
                        <Button className="btn btn-success rounded-pill" id="submitEmp" key="submit" style={{ backgroundColor: "#1dd1a1", height: "fit-content", display: "none", color: "white" }} onClick={(e) => { this.addOrEditContact(e) }}>
                            <span>Submit</span>
                        </Button>,
                    ]}
                >
                    <div className="Header">
                        <span style={{ color: "#c79807" }}>
                            {this.state.editMode == 1 ? 'Edit Employee Details' : 'Employee Details'}
                        </span>

                    </div>
                    <div className="designation-para-text">
                        <div style={{ margin: "2rem" }}>
                            <Row>

                                <InputGroup style={{ marginTop: "1rem" }} className="inputGrp">
                                    <div style={{ width: "100%" }}>
                                        <label className="inputGrpLabel">Name:&nbsp;</label>
                                        <Input
                                            className="inputGrpInput"
                                            type="text"
                                            value={this.state.filteredName}
                                            onChange={(e) => { this.setInput(e) }}
                                            required={true}
                                            autoComplete="off"
                                            style={{ backgroundColor: this.state.inputColor }}
                                            placeholder="Enter Name"
                                            id="contactName"
                                            readOnly={!this.state.readOnly}
                                            ref={this.inputRef}
                                        />
                                    </div>
                                </InputGroup>


                                <InputGroup className="inputGrp">
                                    <div style={{ width: "100%" }}>
                                        <label className="inputGrpLabel">Mobile:&nbsp;</label>
                                        <Input
                                            className="inputGrpInput"
                                            style={{ backgroundColor: this.state.inputColor }}
                                            type="text"
                                            value={this.state.filteredMobile}
                                            placeholder="Enter Mobile number"
                                            id="contactMobile"
                                            onChange={(e) => { this.setInput(e) }}
                                            maxLength="10"
                                            required={true}
                                            autoComplete="off"
                                            onKeyPress={(event) => {
                                                if (!/[0-9]/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            readOnly={!this.state.readOnly}
                                        />
                                    </div>
                                </InputGroup>


                                <InputGroup className="inputGrp">
                                    <div style={{ width: "100%" }}>
                                        <label className="inputGrpLabel">Email:&nbsp;</label>
                                        <Input
                                            className="inputGrpInput"
                                            style={{ backgroundColor: this.state.inputColor }}
                                            type="text"
                                            placeholder="Enter Email Id"
                                            id="contactEmail"
                                            value={this.state.filteredEmail}
                                            required={true}
                                            onChange={(e) => { this.setInput(e) }}
                                            autoComplete="off"
                                            readOnly={!this.state.readOnly}
                                        />
                                    </div>
                                </InputGroup>

                                <InputGroup className="inputGrp">
                                    <div style={{ width: "100%" }}>
                                        <label className="inputGrpLabel" >Designation:&nbsp;</label>
                                        <Input
                                            className="inputGrpInput"
                                            style={{ backgroundColor: this.state.inputColor }}
                                            type="text"
                                            placeholder="Enter Designation"
                                            id="contactDesig"
                                            value={this.state.designation}
                                            required={true}
                                            onChange={(e) => { this.setInput(e) }}
                                            autoComplete="off"
                                            readOnly={!this.state.readOnly}
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

export default EmployeeList;
