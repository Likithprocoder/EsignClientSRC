import React, { useState, useEffect } from "react";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import { Button, Input, Table, Modal, Tooltip } from 'antd';
import Loader from "react-loader";
import './FeedbackForm.css'; // Import the CSS file


function ViewUserFeedbackList(props) {

    const [allowLoader, setAllowLoader] = useState(true);

    const [feedbackList, setFeedbackList] = useState([]);

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
            sorter: (a, b) => a.feedbackGivenData - b.feedbackGivenData
        },
        {
            title: 'Action',
            dataIndex: 'feedbackData',
            width: '15%',
            render: (text, record) => (
                <div>
                    <span onClick={e => viewIndividualUsersFeedback(record)} className="btn btn-link">View</span>
                </div>
            )
        },
    ]

    useEffect(() => {
        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
        // finally data addition call.
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${jsonWebToken}`
            },
        };
        fetch(URL.getUsersFeedback, options)
            .then((response) => response.json())
            .then((responsedata) => {
                if (responsedata.status === "SUCCESS") {
                    setFeedbackList(responsedata.feedbackData);
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
    }, []);

    const viewIndividualUsersFeedback = (record) => {
        props.history.push({
            pathname: "/viewUserFeedback",
            frompath: "/docuExecFeedback",
            state: {
                userData: record
            }
        })
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
                    pageSize: 10,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                }}
                scroll={{ x: '100%' }}
                rowClassName={(record) => 'activeRow'}
            />
        </div>
    )
}
export default ViewUserFeedbackList;