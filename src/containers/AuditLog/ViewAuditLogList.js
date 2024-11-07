import React, { useEffect, useState } from 'react'
import { Table, DatePicker, Select, Button } from 'antd';
import Loader from "react-loader";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import './aduitLog.css'; // Import the CSS file
import moment from 'moment';


function ViewAuditLogList(props) {

    const [allowLoader, setAllowLoader] = useState(true);

    const [auditRecords, setAuditRecords] = useState([]);

    const [recordPerPage, setRecordPerPage] = useState(10);

    const [pageNumber, setPageNumber] = useState(0); // Current page number

    const [numberOfpages, setNumberOfPages] = useState(0);

    const [selectedDateRnge, setSelectedDateRnge] = useState([]);

    const [operationType, setOperationType] = useState("");

    const [operationTypeList, setOperationTypeList] = useState([]);

    const [selectedDateRngeTwo, setSelectedDateRngeTwo] = useState([]);

    const { RangePicker } = DatePicker;

    const { Option } = Select;

    let columns = [
        {
            title: 'User Name',
            dataIndex: 0
        },
        {
            title: 'Operation Status',
            dataIndex: 2
        },
        {
            title: 'Entry Date',
            dataIndex: 3
        },
        {
            title: 'IP Address',
            dataIndex: 1
        }
    ]

    useEffect(() => {
        setAllowLoader(false);
        // initial setting the current date and date of 3months ago from current date.
        setSelectedDateRnge(() => {
            let dateAray = [];
            dateAray.push(moment().subtract(3, 'months').format("YYYY-MM-DD"));
            dateAray.push(moment().format("YYYY-MM-DD"));
            setSelectedDateRngeTwo(dateAray);
            return dateAray;
        });
        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
        // finally data addition call.
        const options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${jsonWebToken}`
            }
        };
        fetch(URL.fetchAuditOperationType, options)
            .then((response) => response.json())
            .then((responsedata) => {
                if (responsedata.status === "SUCCESS") {
                    // operation types lenght check..
                    if (responsedata.operationTypes.length !== 0) {
                        // Initial assigning of index 0 operationType value for a state.
                        setOperationType(responsedata.operationTypes[0]);
                        setOperationTypeList(responsedata.operationTypes);
                        // GET call to retrieve the operation types.
                        fetchAuditLogs(moment().subtract(3, 'months'), moment(), responsedata.operationTypes[0], 0);
                    } else {
                        confirmAlert({
                            message: 'Empty audit log records!',
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn"
                                },
                            ], closeOnClickOutside: false
                        });
                    }
                } else if (responsedata.statusDetails === "Session Expired") {
                    confirmAlert({
                        message: responsedata.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => {
                                    props.history.push("/login");
                                },
                            },
                        ], closeOnClickOutside: false
                    });
                } else {
                    confirmAlert({
                        message: responsedata.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn"
                            },
                        ], closeOnClickOutside: false,
                    });
                }
            }).catch((error) => {
                console.log(error);
                confirmAlert({
                    message: `SomeThing Went Wrong PLease Try Again`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => {
                                props.history.push("/");
                            },
                        },
                    ], closeOnClickOutside: false,
                });
            });
        setAllowLoader(true);
    }, []);

    // Handle table change event
    const handleTableChange = (pagination) => {
        const { current, pageSize } = pagination;
        setRecordPerPage(pageSize);
        let numberOfPresntPage = auditRecords.length / 10;
        // Check if the user is on the last page
        if (current === numberOfPresntPage && pageNumber < numberOfpages) {
            // date should be selected..
            fetchAuditLogs(selectedDateRngeTwo[0], selectedDateRngeTwo[1], operationType, (pageNumber + 1));
        }
    };

    const onDateRangeChange = (dates, dateStrings) => {
        // For the value of 'dates' is null, indicates user has removed the selected date, so reassigning to empty [].
        if (dates === null) {
            setSelectedDateRnge([]);
        } else {
            setSelectedDateRnge(dateStrings);
            setSelectedDateRngeTwo(dateStrings);
        }
    };

    const handleOptionChange = (event) => {
        // Check if the user has selected both date and operation type.
        if (selectedDateRnge.length !== 0) {
            setAuditRecords([]);
            setPageNumber(0);
            const operationType = event;
            setOperationType(operationType);
            fetchAuditLogs(selectedDateRngeTwo[0], selectedDateRngeTwo[1], operationType, 0);
        } else {
            confirmAlert({
                message: 'Select the date range for audit log records before submitting.',
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn"
                    },
                ], closeOnClickOutside: false,
            });
        }
    };

    // Fetch call for audit logs.
    const fetchAuditLogs = (startDte, endDte, operationType, pageIndex) => {
        setPageNumber(pageIndex);
        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${jsonWebToken}`
            },
            body: JSON.stringify({
                operationType: operationType,
                startDate: startDte,
                endDate: endDte,
                indexNumber: pageIndex
            })
        };
        fetch(URL.fetchAuditLogs, options)
            .then((response) => response.json())
            .then((responsedata) => {
                if (responsedata.status === "SUCCESS") {
                    setAuditRecords((prevItems) => {
                        // Create a new copy of the array
                        let updatedItems = [...prevItems];
                        let indexData = (updatedItems.length);
                        // Update the item at the given index
                        const auditLogs = [...responsedata.auditLogData].reverse();
                        for (let index = 0; index < auditLogs.length; index++) {
                            const element = auditLogs[index];
                            updatedItems[indexData] = element;
                            indexData++;
                        }
                        // Return the updated array to setItems
                        return updatedItems;
                    });
                    setNumberOfPages(responsedata.totalPages);
                } else if (responsedata.statusDetails === "Session Expired") {
                    confirmAlert({
                        message: responsedata.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => {
                                    props.history.push("/login");
                                },
                            },
                        ], closeOnClickOutside: false
                    });
                } else {
                    confirmAlert({
                        message: responsedata.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn"
                            },
                        ], closeOnClickOutside: false,
                    });
                }
            }).catch((error) => {
                console.log(error);
                confirmAlert({
                    message: `SomeThing Went Wrong PLease Try Again`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => {
                                props.history.push("/");
                            },
                        },
                    ], closeOnClickOutside: false,
                });
            });
        setAllowLoader(true);
    };

    return (
        <React.Fragment>
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
                <div className='AditLgFltr'>
                    <RangePicker defaultValue={[moment().subtract(3, 'months'), moment()]} // 3 months ago to today
                        format="YYYY-MM-DD" className='DtePckr' onChange={onDateRangeChange} />
                    {
                        operationTypeList.length !== 0 && (
                            <Select defaultValue={operationTypeList[0]} onChange={e => handleOptionChange(e)} id='operationTypeID' className='OpratTyp'>
                                {
                                    operationTypeList.map((posts, index) => (
                                        <Option key={`OPTType${index}`} value={posts}>{posts}</Option>
                                    ))
                                }
                            </Select>
                        )
                    }
                </div>
                <Table
                    columns={columns}
                    dataSource={auditRecords}
                    pagination={{
                        pageSize: recordPerPage,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: '100%' }}
                    rowClassName={(record) => 'activeRow'}
                />
            </div>
        </React.Fragment>
    )
}
export default ViewAuditLogList