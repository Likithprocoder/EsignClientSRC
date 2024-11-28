import React, { Component } from 'react';
import { UserAddOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Modal, Tooltip } from 'antd';
import { confirmAlert } from "react-confirm-alert";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { URL } from "../URLConstant";
import "./AddressBook.css";
var Loader = require("react-loader");

export default class ApplicationInbox extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            editMode: 0,
            info: [],
            initialInfo: [],
            columns: [],
            // columns: [
            //     // Table.SELECTION_COLUMN,
            //     {
            //         title: 'Name',
            //         dataIndex: 'contactName',
            //         key: 'name',
            //         width: 150,
            //         ...this.getColumnSearchProps('contactName'),
            //         sorter: (a, b) => a.contactName.localeCompare(b.contactName),
            //         render: (text, record) => {
            //             if (this.getCheckboxProps(record).disabled) {
            //                 return (
            //                     <Tooltip title="Existing` member">
            //                         <span>{text}</span>
            //                     </Tooltip>
            //                 );
            //             }
            //             return text;
            //         },
            //     },
            //     // Table.EXPAND_COLUMN,
            //     {
            //         title: 'Mobile no',
            //         dataIndex: 'mobileNo',
            //         key: 'mobileNo',

            //         ...this.getColumnSearchProps('mobileNo'),
            //     },

            //     {
            //         title: 'Email Id',
            //         dataIndex: 'emailId',
            //         key: 'emailId',

            //     },
            //     // {
            //     //     title: 'Type',
            //     //     dataIndex: 'contactType',
            //     //     key: 'type',
            //     //     sorter: (a, b) => a.contactType.localeCompare(b.contactType),
            //     //     render: (contactType) => (
            //     //         <span

            //     //         >
            //     //             {contactType === 'g' ? 'group' : 'individual'}
            //     //         </span>
            //     //     ),
            //     // },
            //     // {
            //     //     title: 'More',
            //     //     dataIndex: '',
            //     //     key: 'x',
            //     //     render: (text, record) => <a onClick={() => this.handle(record)} style={{ color: "blue" }}>...</a>,
            //     // },
            //     // {
            //     //     title: 'Checkbox Column',
            //     //     dataIndex: 'checkboxColumn',
            //     //     render: (_, record) => record.contactType === 'g' ? <input type='checkbox'></input> :''
            //     // },
            // ],
            selectedRowKeys: [],
            selectedType: null,
            deleteButton: 'disable',
            searchText: '',
            searchedColumn: '',
            loaded: true,
            selectedRows: [],
            UpdatedInfo: []
        };

        this.searchInput = React.createRef();
    }

    componentDidMount() {
        let columns = [
            // Table.SELECTION_COLUMN,
            {
                title: 'Name',
                dataIndex: 'contactName',
                key: 'name',
                width: 150,
                ...this.getColumnSearchProps('contactName'),
                sorter: (a, b) => a.contactName.localeCompare(b.contactName),
                render: (text, record) => {
                    if (this.getCheckboxProps(record).disabled) {
                        return (
                            <Tooltip title="Existing member" color={'rgba(0, 0, 0, 0.54)'} >
                                <span>{text}</span>
                            </Tooltip >
                        );
                    }
                    return text;
                },
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
            // {
            //     title: 'Checkbox Column',
            //     dataIndex: 'checkboxColumn',
            //     render: (_, record) => record.contactType === 'g' ? <input type='checkbox'></input> :''
            // },
        ]

        //set grpName and info
        // this.setState({ groupName: this.props.location.state.groupName })

        // if (this.props.location.state.enableMode === 0) {
        //     this.setState({ groupName: this.props.location.state.groupName })
        // }
        // else{

        this.setState({ columns: columns, groupName: this.props.location.state.groupName, UpdatedInfo: this.props.location.state.userInfo, editMode: this.props.location.state.editMode, initialInfo: this.props.location.state.userInfo, groupId: this.props.location.state.groupId })
        // }

        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
        this.setState({ loaded: false })
        fetch(URL.fetchAddressBook, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${jsonWebToken}`
            },
            body: JSON.stringify({
                operationtype: "INDL",
                groupId: this.props.location.state.groupId
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((responseJson) => {
                if (responseJson.status == "SUCCESS") {
                    this.setState({ loaded: true })
                    this.setState({
                        info: responseJson.searchInfo
                    })
                }
                else if (responseJson.statusDetails == "Session Expired") {
                    this.setState({ loaded: true })
                    confirmAlert({
                        message: responseJson.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => {
                                    this.props.history.push("/");
                                },
                            },
                        ],
                    });
                }
                else {
                    this.setState({ loaded: true })
                    confirmAlert({
                        message: responseJson.statusDetail,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => { },
                            },
                        ],
                    });
                }
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


    addUsersTogrp = (e) => {
        e.preventDefault();
        const updatedInfoCopy = [...this.state.UpdatedInfo];

        this.state.selectedRows.forEach(row => {
            updatedInfoCopy.push(row)
        });




        this.props.history.push({
            pathname: '/getAddressBookGroups',
            state: {
                editMode: 2,//to know that users have been added
                actualEditMode: this.state.editMode,
                userInfo: updatedInfoCopy,
                groupName: this.state.groupName,
                initialInfo: this.state.initialInfo,
                groupId: this.state.groupId

            }
        });



    }


    backToGroupManagemnt = (e) => {
        e.preventDefault()
        this.props.history.push({
            pathname: '/getAddressBookGroups',
            state: {
                editMode: 2,//to know that users have been added
                actualEditMode: this.state.editMode,
                userInfo: this.state.UpdatedInfo,
                groupName: this.state.groupName,
                initialInfo: this.state.initialInfo

            }
        });
    }

    getCheckboxProps = (record) => {
        const { UpdatedInfo } = this.state;
        return {
            disabled: UpdatedInfo.some(element => element.key === record.key)
        };
    };

    render() {
        const { selectedRowKeys } = this.state;
        // console.log(UpdatedInfo)
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            type: 'checkbox', // Allow only single row selection

            //To check if the record.key exists in the UpdatedInfo array ,if yes disable checkbox
            getCheckboxProps: this.getCheckboxProps


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

                    <Tooltip title="Back" color={'rgba(0, 0, 0, 0.54)'}>
                        <RollbackOutlined style={{ fontSize: '30px', marginRight: '20%' }} onClick={(e) => this.backToGroupManagemnt(e)} />
                    </Tooltip>

                    <Tooltip title="Add selected contacts to group" color={'rgba(0, 0, 0, 0.54)'}>

                        <Button id="addButton" className="btn btn-success" key="submit" onClick={(e) => this.addUsersTogrp(e)} style={{ marginLeft: 'Auto' }}>
                            <span>Add</span>
                        </Button>

                    </Tooltip>




                </div>
                <div id='headerTag'>
                    <div style={{ fontSize: '25px' }}>Group: {this.state.groupName}</div>
                    {/* <text style={{ fontSize: '20px' }}> <br></br>Select and add users</text> */}



                </div>

                
                    <Table
                        columns={this.state.columns}
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

                        rowClassName={(record) =>
                            this.getCheckboxProps(record).disabled ? 'disabled-row' : 'individual-row'
                        }
                    />
               



            </div>
        );
    }
} 