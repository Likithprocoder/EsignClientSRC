import React, { Component } from 'react';
// Button,
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Modal, Tooltip } from 'antd';
// inport * from 'antd';
import Highlighter from 'react-highlight-words';
import "./AddressBook.css";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import { UserAddOutlined, UsergroupAddOutlined, EditOutlined } from '@ant-design/icons';


import {
    InputGroup,
    Row,
} from "reactstrap";






var Loader = require("react-loader");
class AddressBook extends Component {
    constructor(props) {
        super(props);
        this.state = {

            info: [],
            columns: [
                // Table.SELECTION_COLUMN,
                {
                    title: 'Name',
                    dataIndex: 'contactName',
                    key: 'name',
                    // width: 150,
                    ...this.getColumnSearchProps('contactName'),
                    sorter: (a, b) => a.contactName.localeCompare(b.contactName),
                },
                // Table.EXPAND_COLUMN,
                {
                    title: 'Mobile number',
                    dataIndex: 'mobileNo',
                    key: 'mobileNo',

                    ...this.getColumnSearchProps('mobileNo'),
                },

                {
                    title: 'Email Id',
                    dataIndex: 'emailId',
                    key: 'emailId',

                },
                {
                    title: 'Type',
                    dataIndex: 'contactType',
                    key: 'type',
                    sorter: (a, b) => a.contactType.localeCompare(b.contactType),
                    render: (contactType) => (
                        <span

                        >
                            {contactType === 'g' ? 'group' : 'individual'}
                        </span>
                    ),
                },
                {
                    title: 'More',
                    dataIndex: '',
                    key: 'x',
                    render: (text, record) => <Tooltip title="Edit details" color={'rgba(0, 0, 0, 0.54)'}>
                        {/* <a onClick={() => this.handle(record)} style={{ color: "blue" }}>...</a> */}
                        <EditOutlined onClick={() => this.handle(record)} />
                    </Tooltip>,
                },
                // {
                //     title: 'Checkbox Column',
                //     dataIndex: 'checkboxColumn',
                //     render: (_, record) => record.contactType === 'g' ? <input type='checkbox'></input> :''
                // },


            ],
            selectedRowKeys: [],
            selectedType: null,
            deleteButton: 'disable',
            searchText: '',
            searchedColumn: '',
            loaded: true,
            selectedRows: [],
            contactModal: false,
            filteredName: "",
            filteredMobile: "",
            filteredEmail: "",
            editMode: 0,
            contactId: ""

        };

        this.searchInput = React.createRef();
    }

    componentDidMount() {
        var body = {

            authToken: sessionStorage.getItem("authToken"),
            operationtype: "SRCH",
        };
        this.setState({ loaded: false });
        fetch(URL.fetchAddressBook, {
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
                    this.setState({ loaded: true });
                    this.setState({ info: responseJson.searchInfo });
                }

                else {
                    this.setState({ loaded: true });
                    if (responseJson.statusDetails === "Session Expired!!") {
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
    }



    getColumnSearchProps = (dataIndex) => ({

        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={this.searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                {/* <Space>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>

                </Space> */}
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };

    handle = (record) => {

        if (record.contactType === 'i') {
            this.setState({ editMode: 1, contactModal: true, contactId: record.contactId, filteredName: record.contactName, filteredEmail: record.emailId, filteredMobile: record.mobileNo })


        } else {

            this.props.history.push({
                pathname: '/getAddressBookGroups',
                state: {
                    groupId: record.contactId,
                    groupName: record.contactName,
                    editMode: 1

                }
            });
        }
    }



    onSelectChange = (selectedRowKeys, selectedRows) => {
        const selectedType = selectedRows.length > 0 ? selectedRows[0].type : null;
        const deleteButton = selectedType === null ? 'disable' : 'enable'
        this.setState({ selectedRowKeys, selectedType, deleteButton, selectedRows });

    };



    delete = (e) => {
        let deleteArray = [];
        // e.preventDefault();
        this.state.selectedRows.forEach(row => {
            deleteArray.push(row.contactId)
        });
        let message = '';
        if (deleteArray.length > 1) { message = "contacts are" }
        else {
            message = "contact is"
        }

        confirmAlert({
            message: deleteArray.length + " " + message + " selected, are you sure you want to delete?",
            buttons: [
                {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                        let body = {
                            authToken: sessionStorage.getItem("authToken"),
                            contactId: deleteArray
                        }
                        this.setState({ loaded: false })
                        fetch(URL.removeFromAddressBook, {
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
                                                    // alert(responseJson.statusDetails)
                                                    window.location.reload()
                                                }
                                            },
                                            // {
                                            //     label: "Cancel",
                                            //     className: "confirmBtn",
                                            //     onClick: () => { },
                                            // }
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
        //validation
        const mobileRegex = /^[6-9]\d{9}$/;
        const emailRegex = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[a-zA-Z]{2,6}$/;

        if (name === "" || name.length == 0) {
            alert("Please enter contact name")
            return false;
        }

        else if (mobile.length != 10 || !mobileRegex.test(mobile)) {
            alert("Please enter a valid mobile number")
            return false;
        }
        else if (email === "" || email.length < 5 || !emailRegex.test(email)) {
            alert("Please enter valid email id")
            return false;
        }


        let disaplayMessage = this.state.editMode == 0 ? name + " will be saved as a contact, Do you want to proceed." : "User contact details are modified, Do you want to save?";




        confirmAlert({
            message: disaplayMessage,
            buttons: [
                {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                        let body = {}
                        let url = '';


                        if (this.state.editMode == 0) {
                            body = {
                                authToken: sessionStorage.getItem("authToken"),
                                userInfo: [{
                                    "firstName": name, "emailId": email, "mobileNo": mobile
                                }]
                            }
                            url = URL.insertToAddressBook;
                        }
                        else {

                            body = {
                                authToken: sessionStorage.getItem("authToken"),
                                contactId: this.state.contactId,
                                updatedInfo: {
                                    "updcontactName": name, "updemailId": email, "updmobileNo": mobile
                                }
                            }
                            url = URL.modifyAddressBook;
                        }

                        // let body = {
                        //     authToken: sessionStorage.getItem("authToken"),
                        //     userInfo: array
                        // }
                        this.setState({ loaded: false })
                        fetch(url, {
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
                                    this.setState({ loaded: true })
                                    // alert(responseJson.statusDetails)
                                    confirmAlert({
                                        message: responseJson.statusDetails,
                                        closeOnClickOutside: false,
                                        buttons: [
                                            {
                                                label: "OK",
                                                className: "confirmBtn",
                                                onClick: () => {
                                                    this.setState({ contactModal: false })
                                                    window.location.reload()
                                                }
                                            },
                                            // {
                                            //     label: "Cancel",
                                            //     className: "confirmBtn",
                                            //     onClick: () => { },
                                            // }
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
                                                    onClick: () => { }
                                                }]
                                        })

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
    }



    onCloseContactModal = (e) => {
        e.preventDefault()
        this.setState({ contactModal: false });
    };
    openContactModal = (e) => {
        e.preventDefault()
        this.setState({ editMode: 0, contactModal: true, filteredEmail: '', filteredMobile: '', filteredName: '' });
    };
    setInput = (e) => {
        let value = e.target.value;
        if (e.target.id == 'contactName') {
            let filteredValue = value.replace(/[^a-zA-Z0-9]/g, '');
            this.setState({ filteredName: filteredValue });
        }
        else if (e.target.id == 'contactMobile') {
            this.setState({ filteredMobile: value });
        }
        else {
            this.setState({ filteredEmail: value });
        }

    }

    pushToGroupManagemnt = (e) => {
        e.preventDefault()
        this.props.history.push({
            pathname: '/getAddressBookGroups',
            state: {
                // groupId: record.contactId,
                editMode: 0

            }
        });
    }


    render() {
        const { columns, selectedRowKeys } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'checkbox', // Allow only single row selection

            getCheckboxProps: record => ({
                disabled: record.contactType === 'g'
            }),
        };
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
                <div id='headerTag'>
                    {/* <div style={{ width: "50%" }}><h1 id='header'>Address book</h1></div> */}


                    <div id='button-container' style={{ width: "100%", justifyContent: 'end' }}>


                        <Tooltip title="Remove contact" color={'rgba(0, 0, 0, 0.54)'} >
                            <Button id='removebttn' className="btn btn-danger pill" style={{ marginRight: '10px' }} onClick={(e) => this.delete(e)}
                                disabled={this.state.deleteButton === 'disable'}>Remove</Button>


                        </Tooltip>




                        <Tooltip title="Add contact" color={'rgba(0, 0, 0, 0.54)'} >
                            <UserAddOutlined id="addButton" style={{ fontSize: '30px', marginRight: '10px' }} onClick={(e) => this.openContactModal(e)} />
                        </Tooltip>

                        <Tooltip title="Add group" color={'rgba(0, 0, 0, 0.54)'} >
                            <UsergroupAddOutlined style={{ fontSize: '30px' }} onClick={(e) => this.pushToGroupManagemnt(e)} />
                        </Tooltip>
                    </div>

                </div>

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



                <Table
                    // style={{border:"1px solid black"}}
                    columns={columns}
                    rowSelection={rowSelection}
                    scroll={{ x: '100%' }}
                    // expandable={{
                    //     expandedRowRender: (record) => (
                    //         <p
                    //             style={{
                    //                 margin: 0,
                    //             }}
                    //         >
                    //             {record.description}
                    //         </p>
                    //     ),
                    // }}
                    dataSource={this.state.info}
                    pagination={{
                        pageSize: 10,
                        // total: infoLength,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}

                    rowClassName={(record) => record.contactType === 'g' ? 'group-row' : 'individual-row'}

                />



                <Modal

                    centered
                    // open={modal2Open}
                    open={this.state.contactModal}
                    onClose={this.onCloseContactModal}
                    onOk={this.onCloseContactModal}
                    onCancel={this.onCloseContactModal}
                    maskClosable={false}

                    footer={[
                        <Button className="btn btn-danger rounded-pill" key="back" onClick={this.onCloseContactModal} style={{ height: "fit-content"}}>
                            Close
                        </Button>,
                        <Button className="btn btn-success rounded-pill" key="submit" style={{ backgroundColor: "#1dd1a1", height: "fit-content" }} onClick={(e) => { this.addOrEditContact(e) }}>
                            <span>Submit &#8594; </span>
                        </Button>,


                    ]}

                >
                    <div className="Header">
                        <span style={{ color: "#c79807" }}>
                            {this.state.editMode == 1 ? 'Edit contact details' : 'New contact details'}
                        </span>
                    </div>
                    <div className="designation-para-text">
                        <div style={{ margin: "2rem" }}>
                            <Row >
                                <InputGroup style={{ marginTop: "1rem" }} className="inputGrp">
                                    <div style={{ width: "100%" }}>
                                        <label className="inputGrpLabel" id="entermobileotp">Name :&nbsp;</label>
                                        <Input
                                            className="inputGrpInput"
                                            type="text"
                                            placeholder="Enter Name"
                                            id="contactName"
                                            onChange={(e) => { this.setInput(e) }}
                                            required={true}
                                            value={this.state.filteredName}
                                            autoComplete="off"

                                        />

                                    </div>
                                </InputGroup>

                                <InputGroup className="inputGrp">
                                    <div style={{ width: "100%" }}>
                                        <label className="inputGrpLabel" id="entermobileotp">Mobile :&nbsp;</label>
                                        <Input className="inputGrpInput"
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
                                        />
                                    </div>

                                </InputGroup>


                                <InputGroup className="inputGrp">
                                    <div style={{ width: "100%" }}>
                                        <label className="inputGrpLabel" >Email :&nbsp;</label>

                                        <Input className="inputGrpInput"
                                            type="text"
                                            placeholder="Enter Email Id"
                                            id="contactEmail"
                                            value={this.state.filteredEmail}
                                            // name="emailotp"
                                            required={true}
                                            onChange={(e) => { this.setInput(e) }}
                                            // maxLength="6"
                                            // onChange={this.setInput}
                                            // value={this.state.emailotp}
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

export default AddressBook;
