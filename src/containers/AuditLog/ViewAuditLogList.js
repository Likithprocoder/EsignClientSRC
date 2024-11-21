import React, { useEffect, useState } from 'react'
import { Table, DatePicker, Select, Input, Button } from 'antd';
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

    const [selectedDateRangeActulValue, setSelectedDateRangeActulValue] = useState([]);

    const [userData, setUserData] = useState({});

    const [totalNumberOfRecords, setTotalNumberOfRecords] = useState("");

    const { RangePicker } = DatePicker;

    const { Option } = Select;

    const [allowModel, setAllowModel] = useState(false);

    const [userNameInput, setUserNameInput] = useState("");

    const [currentPage, setCurrentPage] = useState(1);


    let columns = [
        {
            title: 'Operation Status',
            dataIndex: "sucesFailreRspnse",
            render: (record) => (
                <span >{record === "1" ? "SUCCESS" : "FAILURE"}</span>
            )
        },
        {
            title: 'Entry Date',
            dataIndex: "entryDate"
        },
        {
            title: 'IP Address',
            dataIndex: "IP"
        },
        {
            title: '',
            render: (record) => (
                <span style={{ padding: "0px" }} onClick={e => {
                    setUserData({});
                    fetchUserDetails(record)
                }
                } className='btn btn-link'>More Info..</span>
            )
        }
    ]

    // Fetch the user data..
    const fetchUserDetails = (record) => {
        setAllowLoader(false);
        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
        // finally data addition call.
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${jsonWebToken}`
            },
            body: JSON.stringify({
                referenceId: record["referenceId"]
            })
        };
        fetch(URL.fetchAuditFullDetails, options)
            .then((response) => response.json())
            .then((responsedata) => {
                if (responsedata.status === "SUCCESS") {
                    setUserData(responsedata);
                    setAllowModel(true);
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

    useEffect(() => {
        setAllowLoader(false);
        // initial setting the current date and date of 3months ago from current date.
        setSelectedDateRnge(() => {
            let dateAray = [];
            dateAray.push(moment().startOf("month").format("YYYY-MM-DD"));
            dateAray.push(moment().format("YYYY-MM-DD"));
            setSelectedDateRngeTwo(dateAray);
            return dateAray;
        });
        setSelectedDateRangeActulValue([moment().startOf("month"), moment()]);
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
                        setOperationType(responsedata.operationTypes[0]["operation_Type"]);
                        setOperationTypeList(responsedata.operationTypes);
                        // GET call to retrieve the operation types.
                        fetchAuditLogs(moment().startOf("month"), moment(), responsedata.operationTypes[0]["operation_Type"], 0, "", true);
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
        setCurrentPage(current);
        setRecordPerPage(pageSize);
        let numberOfPresntPage = auditRecords.length / 10;
        // Check if the user is on the last page
        if (current === numberOfPresntPage && pageNumber < numberOfpages) {
            // date should be selected..
            fetchAuditLogs(selectedDateRngeTwo[0], selectedDateRngeTwo[1], operationType, (pageNumber + 1), userNameInput, false);
        }
    };

    const onDateRangeChange = (dates, dateStrings) => {
        // For the value of 'dates' is null, indicates user has removed the selected date, so reassigning to empty [].
        if (dates === null) {
            setSelectedDateRnge([]);
            setSelectedDateRangeActulValue([]);
        } else {
            const start = moment(dateStrings[0]);
            const end = moment(dateStrings[1]);
            const threeMonthsAfterStart = start.clone().add(3, 'months');
            if (!end.isSameOrBefore(threeMonthsAfterStart)) {
                // if the selected date range is not between 3months, an alert is throwen.
                confirmAlert({
                    message: 'Please select the date range between 3 months maximum.',
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn"
                        },
                    ], closeOnClickOutside: false,
                });
                // On selection of dates exceeding 3months, empty of values, which is used to dislay to users.
                setSelectedDateRangeActulValue([]);
            } else {
                // setAuditRecords([]);
                // setPageNumber(0);
                setSelectedDateRnge(dateStrings);
                setSelectedDateRangeActulValue(dates);
                // fetchAuditLogs(dates[0], dates[1], operationType, 0);
            }
        }
    };


    const handleOptionChange = (event) => {
        // Check if the user has selected both date and operation type.
        // if (selectedDateRnge.length !== 0) {
        //     setAuditRecords([]);
        //     setPageNumber(0);
        //     fetchAuditLogs(selectedDateRngeTwo[0], selectedDateRngeTwo[1], event, 0);
        // } else {
        //     confirmAlert({
        //         message: 'Select the date range for audit log records before submitting.',
        //         buttons: [
        //             {
        //                 label: "OK",
        //                 className: "confirmBtn"
        //             },
        //         ], closeOnClickOutside: false,
        //     });
        //     setOperationType(event);
        // }
        setOperationType(event);
    };

    // Fetch call for audit logs.
    const fetchAuditLogs = (startDte, endDte, operationType, pageIndex, nameBsedSerch, boolean) => {
        setPageNumber(pageIndex);
        // the page reset, needs to be done only when 'fetchAuditLogs()', is done from search button.
        if (boolean) {
            setCurrentPage(1);
        }
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
                indexNumber: pageIndex,
                usrBasdSrchNme: nameBsedSerch
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
                    setTotalNumberOfRecords(responsedata.totalRecordsCount);
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
                    <RangePicker value={selectedDateRangeActulValue} // 3 months ago to today
                        format="YYYY-MM-DD" className='DtePckr' onChange={onDateRangeChange} />
                    {
                        operationTypeList.length !== 0 && (
                            <Select defaultValue={operationTypeList[0]["operation_Type"] ?? ''} onChange={e => handleOptionChange(e)} id='operationTypeID' className='OpratTyp'>
                                {
                                    operationTypeList.map((posts, index) => (
                                        <Option title={posts["operation_Description"]} key={`OPTType${index}`} value={posts["operation_Type"]}>{posts["operation_Type"]}</Option>
                                    ))
                                }
                            </Select>
                        )
                    }
                    <Input
                        placeholder="Enter the loginName"
                        onChange={(e) => setUserNameInput((e.target.value).trim())}
                        style={{ marginBottom: '10px', marginRight: "20px", width: "30%" }}
                        id='nameBsedSerch'
                    />
                    <Button
                        style={{ backgroundColor: 'lightblue', color: 'black', borderColor: 'lightblue' }}
                        onClick={e => {
                            //    check if the data is not empty 
                            //    Check if the user has selected both date and operation type.
                            if (selectedDateRnge.length !== 0) {
                                setAuditRecords([]);
                                setPageNumber(0);
                                setUserNameInput(document.getElementById('nameBsedSerch').value.trim());
                                setSelectedDateRngeTwo(selectedDateRnge);
                                fetchAuditLogs(selectedDateRnge[0], selectedDateRnge[1], operationType, 0, document.getElementById('nameBsedSerch').value.trim(), true);
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
                        }}
                    >
                        Search
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={auditRecords}
                    pagination={{
                        pageSize: recordPerPage,
                        showQuickJumper: true,
                        showTotal: (total, range) => `(Total records count-${totalNumberOfRecords}) ${range[0]}-${range[1]} of ${total} items`,
                        current: currentPage
                    }}
                    onChange={handleTableChange}
                    scroll={{ x: '100%' }}
                    rowClassName={(record) => 'activeRow'}
                    style={{ border: "1px solid lightgrey", borderRadius: "2px" }}
                    key="TableFrmAntd"
                />
            </div>
            {
                allowModel && (
                    <div className="custom-modal">
                        <div className="CustomModal-content">
                            <span className="close" onClick={e => setAllowModel(false)}>&times;</span>
                            <>
                                <div className='USRINFOHEAD'>
                                    <span>User Info</span>
                                </div>
                                <div className='USRINFODATAPAENT'>
                                    <div className='USRINFOCHLD'>
                                        <div className='USRINFODATALBLE'>Name</div>
                                        <div className='USRINFODATACOLEN'>:</div>
                                        <div className='USRINFOVAlUE'>{userData.name}</div>
                                    </div>
                                    <div className='USRINFOCHLD'>
                                        <div className='USRINFODATALBLE'>Emial ID</div>
                                        <div className='USRINFODATACOLEN'>:</div>
                                        <div className='USRINFOVAlUE'>{userData.emailID}</div>
                                    </div>
                                    <div className='USRINFOCHLD'>
                                        <div className='USRINFODATALBLE'>KYC Status</div>
                                        <div className='USRINFODATACOLEN'>:</div>
                                        <div className='USRINFOVAlUE'>{userData.KYCStatus === 1 ? "Verified" : "Unverified"}</div>
                                    </div>
                                    <div hidden={userData.additionalData === null} className='USRINFOCHLD'>
                                        <div className='USRINFODATALBLE'>Addition Data</div>
                                        <div className='USRINFODATACOLEN'>:</div>
                                        <div className='USRINFOVAlUE'>{userData.additionalData}</div>
                                    </div>
                                </div>
                            </>
                        </div>
                    </div>
                )
            }
        </React.Fragment >
    )
}
export default ViewAuditLogList