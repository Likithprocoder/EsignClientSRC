import React, { Component } from 'react';
import { UserAddOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Modal, Tooltip } from 'antd';
import { confirmAlert } from "react-confirm-alert";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { URL } from "../URLConstant";
import "./AddressBook.css";
var Loader = require("react-loader");

class GroupManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: 0,
            info: [],
            initialInfo: [],

            columns: [
                // Table.SELECTION_COLUMN,
                {
                    title: 'Name',
                    dataIndex: 'contactName',
                    key: 'name',
                    width: 150,
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
                // {
                //     title: 'Type',
                //     dataIndex: 'contactType',
                //     key: 'type',
                //     sorter: (a, b) => a.contactType.localeCompare(b.contactType),
                //     render: (contactType) => (
                //         <span

                //         >
                //             {contactType === 'g' ? 'group' : 'individual'}
                //         </span>
                //     ),
                // },
                // {
                //     title: 'More',
                //     dataIndex: '',
                //     key: 'x',
                //     render: (text, record) => <a onClick={() => this.handle(record)} style={{ color: "blue" }}>...</a>,
                // },



            ],
            selectedRowKeys: [],
            selectedType: null,
            deleteButton: 'disable',
            searchText: '',
            searchedColumn: '',
            loaded: true,
            selectedRows: [],
            groupName: '',
            groupId: ''


        };

        this.searchInput = React.createRef();
    }

    componentDidMount() {
        this.setState({
            editMode: this.props.location.state.editMode,
        });


        if (this.props.location.state.editMode === 1) {
            // let grpId = this.props.location.state.groupId
            this.setState({ groupName: this.props.location.state.groupName, groupId: this.props.location.state.groupId })
            let jsonWebToken = sessionStorage.getItem("jsonWebToken");
            let body = {
                operationtype: 'GRP',
                groupId: this.props.location.state.groupId,


            }
            this.setState({ loaded: false })
            fetch(URL.fetchAddressBook, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${jsonWebToken}`
                },
                body: JSON.stringify(body),
            })

                .then((response) => {
                    return response.json();

                })
                .then((responseJson) => {
                    if (responseJson.status === "SUCCESS") {
                        this.setState({ loaded: true })
                        this.setState({ info: responseJson.searchInfo, initialInfo: responseJson.searchInfo });
                    }

                    else {
                        this.setState({ loaded: true })
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
                            // alert(responseJson.statusDetails)
                            this.setState({ loaded: true });
                        }
                    }



                })
                .catch((e) => {
                    this.setState({ loaded: true });
                    alert(e);
                });


        }

        if (this.props.location.state.editMode === 2) {
            // this.setState({ groupName: this.props.location.state.groupName, info: this.props.location.state.userInfo, editMode: this.props.location.state.actualEditMode, initialInfo: this.props.location.state.initialInfo, groupId: this.props.location.state.groupId })
            // document.getElementById('editSave').click()


            this.setState({
                groupName: this.props.location.state.groupName,
                info: this.props.location.state.userInfo,
                editMode: this.props.location.state.actualEditMode,
                initialInfo: this.props.location.state.initialInfo,
                groupId: this.props.location.state.groupId,
                loaded: false
            }, () => {
                // This callback will be executed after the state is updated
                // Trigger the save button here

                if (this.props.location.state.userInfo.length != this.props.location.state.initialInfo.length) {
                    document.getElementById('editSave').click();
                }
                else {
                    this.setState({ loaded: true })
                }

                // this.submit(e)
            });

        }

    }


    backToAddressBook = (e) => {
        e.preventDefault();
        this.props.history.push({
            pathname: '/getAddressBook',

        })
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

    onSelectChange = (selectedRowKeys, selectedRows) => {
        const selectedType = selectedRows.length > 0 ? selectedRows[0].type : null;
        const deleteButton = selectedType === null ? 'disable' : 'enable'
        this.setState({ selectedRowKeys, selectedType, deleteButton, selectedRows });

    };


    handleGroupName = (e) => {
        e.preventDefault();
        let grpName = e.target.value;
        let filteredValue = grpName.replace(/[^a-zA-Z0-9]/g, '');
        this.setState({ groupName: filteredValue })
    }

    validation = (grpName, userInfo) => {
        if (grpName.trim() === '') {
            return 'Group name can not be empty '

        }
        // else if (userInfo.length < 1 || userInfo.length === 1) {
        //     return 'A Group should atleast contain two members'
        // }
        else {
            return 'true'
        }
    }

    submit = (e) => {
        e.preventDefault()
        // alert('save button clicked')
        let grpName = this.state.groupName
        let userInfo = this.state.info
        let validation = this.validation(grpName, userInfo);

        if (validation === 'true') {
            // alert(this.state.editMode)
            //new grp creation
            // if (this.state.editMode === 0) {
            let arrayOfContactId = userInfo.map(function (item) {
                return item.contactId;
            });
            let arrayOfInitialContactId = this.state.initialInfo.map(function (item) {
                return item.contactId;
            });
            let message = '';
            let url = '';
            let body = '';
            if (this.state.editMode === 0) {
                let JsonarrayOfContactId = userInfo.map(function (item) {
                    return { contactId: item.contactId };
                });
                message = '"' + grpName + '" group will be created and added as a contact. Do you want to proceed?'
                url = URL.insertToAddressBook
                body = {
                    groupName: grpName,
                    userInfo: JsonarrayOfContactId

                }
            }
            else {
                message = 'Group: "' + grpName + '" is modified. Do you want to save?'
                url = URL.modifyAddressBook

                body = {
                    groupId: this.state.groupId,
                    updatedInfo: {

                        groupName: grpName,
                        userInfo: arrayOfInitialContactId,
                        updUserInfo: arrayOfContactId
                    }
                }
            }

            confirmAlert({
                message: message,
                closeOnClickOutside: false,
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => {
                            let jsonWebToken = sessionStorage.getItem("jsonWebToken");
                            this.setState({ loaded: false })
                            fetch(url, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    'Authorization': `Bearer ${jsonWebToken}`
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
                                                        if (this.state.editMode === 0 || this.state.info.length == 0) { this.backToAddressBook(e); }
                                                        else {
                                                            this.setState({ initialInfo: this.state.info })

                                                        }

                                                        // else {
                                                        //     // window.onbeforeunload = () => {
                                                        //     sessionStorage.setItem('editMode', 1);
                                                        //     // };
                                                        //     window.location.reload()

                                                        // }
                                                    }
                                                },
                                            ]
                                        })




                                    }

                                    else {
                                        this.setState({ loaded: true })
                                        if (responseJson.statusDetails === "Session Expired!!") {
                                            sessionStorage.clear();
                                            this.setState({ loaded: true });
                                            this.props.history.push("/login");
                                        }

                                        else {
                                            confirmAlert({
                                                message: responseJson.statusDetails,
                                                closeOnClickOutside: false,
                                                buttons: [
                                                    {
                                                        label: "OK",
                                                        className: "confirmBtn",
                                                        onClick: () => {
                                                            if (responseJson.statusDetails === "Group name already exists") {
                                                                this.backToAddressBook(e);
                                                            }
                                                        },
                                                    },
                                                ],
                                            });
                                            // alert(responseJson.statusDetails)
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
                        onClick: () => {
                            this.setState({ loaded: true })
                            this.backToAddressBook(e)
                        },
                    },
                ],
            });


            // }
            // //existing grp edition
            // else {

            // }
        }
        else {
            confirmAlert({
                message: validation,
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => { this.setState({ loaded: true }) },
                    },
                ],
            });
        }


    }


    addUsersTogrp = (e) => {
        if (this.state.groupName.trim() === '') {
            alert('Enter group name')
        }
        else {
            this.props.history.push({
                pathname: '/addUsersToGroup',
                state: {
                    editMode: this.state.editMode,
                    userInfo: this.state.info,
                    groupName: this.state.groupName,
                    groupId: this.state.groupId
                }

            });
        }

    }

    delete = (e) => {
        e.preventDefault()
        let noOfgrpMemeber = this.state.initialInfo.length;
        let iniMessage = noOfgrpMemeber > 1 ? noOfgrpMemeber + ' contacts are present in the Group: ' : noOfgrpMemeber + ' contact is present in the Group: ';
        confirmAlert({
            message: iniMessage + '"' + this.state.groupName + '", are you sure you want to delete?',
            buttons: [
                {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
                        let body = {
                            groupId: this.state.groupId,
                        }
                        this.setState({ loaded: false })
                        fetch(URL.removeFromAddressBook, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                'Authorization': `Bearer ${jsonWebToken}`
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
                                                    this.backToAddressBook(e);
                                                }
                                            },

                                        ]
                                    })

                                }

                                else {
                                    this.setState({ loaded: true })
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
                                        // alert(responseJson.statusDetails)
                                        this.setState({ loaded: true });
                                    }
                                }



                            })
                            .catch((e) => {
                                this.setState({ loaded: true });
                                alert(e);
                            });

                    }
                },
                {
                    label: "Cancel",
                    className: "cancelBtn",
                    onClick: () => { 
                        // window.location.reload()
                     }
                }

            ]
        })
    }


    removeCommonElements = (deleteArray) => {
        alert("called")
        // Logic to remove common elements from data
        const newData = this.state.info.filter(item => !deleteArray.includes(item));
        // console.log(newData)
        this.setState({ info: newData }); // Update state with modified data

        // console.log(this.state.info)
    };

    deleteUser = (e) => {
        e.preventDefault();
        let deleteArray = [];
        // e.preventDefault();
        this.state.selectedRows.forEach(row => {
            // console.log(row.contactId);
            deleteArray.push(row)
        });

        const newData = this.state.info.filter(item => !deleteArray.includes(item));
        // console.log(newData)
        this.setState({ info: newData }, () => { document.getElementById('editSave').click() });
        // window.reload()
        // confirmAlert({
        //     message: deleteArray.length + " contacts from the Group: " + this.state.groupName + " will be deleted, Do you want to proceed?",
        //     buttons: [
        //         {
        //             label: "OK",
        //             className: "confirmBtn",
        //             onClick: () => {
        //                 alert("called")
        //                 // Logic to remove common elements from data
        //                 const newData = this.state.info.filter(item => !deleteArray.includes(item));
        //                 // console.log(newData)
        //                 this.setState({ info: newData }, () => { document.getElementById('editSave').click }); // Update state with modified data



        //             },
        //         },
        //         {
        //             label: "Cancel",
        //             className: "cancelBtn",
        //             onClick: () => { },
        //         },
        //     ],
        // });







    }

    render() {
        const { selectedRowKeys, groupName, editMode } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'checkbox', // Allow only single row selection

            // getCheckboxProps: record => ({
            //     disabled: record.contactType === 'g'
            // }),
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
                <div id='button-container' >

                    <Tooltip title="Back" color={'rgba(0, 0, 0, 0.54)'} >
                        <RollbackOutlined style={{ fontSize: '30px' }} onClick={(e) => this.backToAddressBook(e)} />
                    </Tooltip>

                    <Tooltip title="Group deletion" color={'rgba(0, 0, 0, 0.54)'} >

                        <Button className="btn btn-danger pill" disabled={editMode === 0} onClick={(e) => this.delete(e)} style={{ marginLeft: 'Auto', marginRight: '10px' }}>
                            Delete Group
                        </Button>
                    </Tooltip>


                    <Tooltip title="Remove contact(s) from the group" color={'rgba(0, 0, 0, 0.54)'} >
                        <Button id='removebttn' className="btn btn-danger pill"
                            disabled={this.state.deleteButton === 'disable'}
                            onClick={(e) => this.deleteUser(e)}
                            style={{ marginleft: 'auto', marginRight: '10px' }}
                        >Remove</Button>
                    </Tooltip>

                    <Tooltip title="add contact to group" color={'rgba(0, 0, 0, 0.54)'} >
                        <UserAddOutlined id="addButton" style={{ fontSize: '30px', marginleft: 'auto' }} onClick={(e) => this.addUsersTogrp(e)} />
                    </Tooltip>
                </div>

                <div id='headerTag'>

                    <div style={{
                        width: "50%", display: 'flex', flexDirection: 'row', alignContent: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-end'

                    }}>
                        {/* <h1 id='header' style={{ fontSize: '30px' }}> */}
                        <text style={{ fontSize: '20px' }}> Group name:</text>
                        <input value={groupName} disabled={editMode === 1} id='grpName' placeholder="Enter group name" style={{
                            marginLeft: '10px', width: '35%', border: '1px solid black', fontSize: 'medium',
                            backgroundColor: 'rgb(213 224 242 / 59%);', height: '30px'
                        }}
                            onChange={(e) => this.handleGroupName(e)} required>
                        </input>
                        {/* </h1> */}
                    </div>
                </div>
                <Table
                    // style={{border:"1px solid black"}}
                    columns={this.state.columns}
                    // rowSelection={rowSelection}
                    rowSelection={rowSelection}
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
                    scroll={{ x: '100%' }}
                    dataSource={this.state.info}
                    pagination={{
                        pageSize: 10,
                        // total: infoLength,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}

                    rowClassName={(record) => record.contactType === 'g' ? 'group-row' : 'individual-row'}

                />
                <div id='footer' style={{ display: 'flex', marginTop: '10%', justifyContent: 'flex-end', alignItems: 'center' }}>


                    {/* <Button className="btn btn-warning pill" key="back" style={{ marginRight: '0.5%' }} onClick={(e) => this.backToAddressBook(e)}>
                        Cancel
                    </Button> */}




                    <Button id='editSave' hidden className="btn btn-success" key="submit" onClick={(e) => this.submit(e)} >
                        <span>Save </span>
                    </Button>
                </div>



            </div >
        );
    }
}
export default GroupManagement;