import React, { useState, useEffect } from "react";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import { Button, Input, Table, Modal, Tooltip } from 'antd';
import Loader from "react-loader";
import './FeedbackForm.css'; // Import the CSS file


function ViewUserFeedbackList(props) {

    const [allowLoader, setAllowLoader] = useState(true);

    const [feedbackList, setFeedbackList] = useState([]);

    const [numberOfpages, setNumberOfPages] = useState(0);

    const [pageNumber, setPageNumber] = useState(0); // Current page number

    const [recordPerPage, setRecordPerPage] = useState(10);
    let columns = [
        {
            title: 'Mobile Number',
            dataIndex: 'MobileNumber',
            sorter: (a, b) => a.MobileNumber - b.MobileNumber,
        },
        {
            title: 'User Name',
            dataIndex: 'UserName',
        },
        {
            title: 'Feedback On',
            dataIndex: 'feedbackGivenData',
            sorter: (a, b) => new Date(a.feedbackGivenData) - new Date(b.feedbackGivenData)
        },
        {
            title: 'Action',
            dataIndex: 'feedbackData',
            width: '15%',
            render: (text, record) => (
                <div>
                    <span style={{padding:"0px"}} onClick={e => viewIndividualUsersFeedback(record)} className="btn btn-link">View</span>
                </div>
            )
        },
    ]
    const fetchMthod = (pageNumber) => {
        const today = new Date();
        const todayFormattedDate = today.toISOString().split('T')[0];
        // Calculate the date three months back
        const threeMonthsBack = new Date(today.setMonth(today.getMonth() - 3));
        // Format the date to a readable string
        const formattedDate = threeMonthsBack.toISOString().split('T')[0];
        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
        // finally data addition call.
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${jsonWebToken}`,

            },
            body: JSON.stringify({
                startDate: formattedDate,
                endDate: todayFormattedDate,
                pageNumber: pageNumber
            }),
        };
        fetch(URL.getUsersFeedback, options)
            .then((response) => response.json())
            .then((responsedata) => {
                if (responsedata.status === "SUCCESS") {                    
                    setFeedbackList((prevItems) => {
                        // Create a new copy of the array
                        let updatedItems = [...prevItems];
                        let indexData = (updatedItems.length);
                        // Update the item at the given index
                        const feedbackList = [...responsedata.feedbackData].reverse();   
                        for (let index = 0; index < feedbackList.length; index++) {
                            const element = feedbackList[index];
                            updatedItems[indexData] = element;
                            indexData++;
                        }
                        // Return the updated array to setItems
                        return updatedItems;
                    });
                    setNumberOfPages(responsedata.numberOfPages);
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
                        ], closeOnClickOutside: false,
                    });
                    setAllowLoader(true);
                } else {
                    confirmAlert({
                        message: responsedata.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => { },
                            },
                        ], closeOnClickOutside: false,
                    });
                }
                setAllowLoader(true);
            }).catch((error) => {
                console.log(error);
                confirmAlert({
                    message: `SomeThing Went Wrong PLease Try Again`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ], closeOnClickOutside: false,
                });
                setAllowLoader(true);
            });
    }
    // Fetch data when the component mounts and when pageNumber changes
    useEffect(() => {
        fetchMthod(pageNumber);
    }, [pageNumber]);

    const viewIndividualUsersFeedback = (record) => {
        props.history.push({
            pathname: "/viewUserFeedback",
            frompath: "/docuExecFeedback",
            state: {
                userData: record
            }
        })
    };

    // Handle table change event
    const handleTableChange = (pagination) => {
        const { current, pageSize } = pagination;
        setRecordPerPage(pageSize);
        let numberOfPresntPage = feedbackList.length / 10;
        // Check if the user is on the last page
        if (current === numberOfPresntPage && pageNumber < numberOfpages) {
            setPageNumber(pageNumber + 1); // Update page number to fetch next set of data
        }
    };

    return (
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
            <Table
                columns={columns}
                dataSource={feedbackList}
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
    )
}
export default ViewUserFeedbackList;