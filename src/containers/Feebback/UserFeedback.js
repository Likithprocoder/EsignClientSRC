import React, { useState, useEffect } from "react";
import { memo } from "react";
import { URL } from "../URLConstant";
import './FeedbackForm.css'; // Import the CSS file
import { confirmAlert } from "react-confirm-alert";
import { array, object } from "prop-types";
import { CheckOutlined } from "@material-ui/icons";
var Loader = require("react-loader");

function UserFeedback(props) {

    const [feedBack_question, setFeedbackQuestions] = useState([]);
    // loader 
    const [allowLoader, setAllowLoader] = useState(false);

    const [overallProblems, setOverallProblems] = useState(""); // State to store overall problems

    const handleOverallProblemsChange = (e) => {
        setOverallProblems(e.target.value); // Update state with user input
    };

    useEffect(() => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken"),

            }),
        };
        fetch(URL.getFeedbackQuestions, options)
            .then((response) => response.json())
            .then((responsedata) => {
                if (responsedata.status === "SUCCESS") {
                    setFeedbackQuestions(JSON.parse(atob(responsedata.feedBackQuestions)));
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
                                className: "confirmBtn"
                            }
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
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can capture the fee(dback form responses here.
        if (document.getElementById("overAllFeedback").value === "") {
            confirmAlert({
                message: 'Please provide the overall feedback!',
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn",
                    },
                ], closeOnClickOutside: false,
            });
        } else {
            let userData = [];
            for (let key in feedBack_question) {
                const eachQuestions = feedBack_question[key][Object.keys(feedBack_question[key])[0]];
                for (let innerKey in eachQuestions) {
                    // check type of question..
                    const quesrion = eachQuestions[innerKey]["feedBack_question"][Object.keys(eachQuestions[innerKey]["feedBack_question"])[0]];
                    if (typeof quesrion == "object") {
                        let checkedData = quesrion.find((data, dataIndex) => document.getElementById(`${key}${innerKey}${dataIndex}`).checked);
                        userData.push({ "data": checkedData, "type": eachQuestions[innerKey]["type"], QNumber: eachQuestions[innerKey]["QNumber"] })
                    } else {
                        let feedbackComment = document.getElementById(`${key}${innerKey}`).value;
                        userData.push({ "data": feedbackComment, "type": eachQuestions[innerKey]["type"], QNumber: eachQuestions[innerKey]["QNumber"] })
                    }
                };
            }
            userData.push({ "data": overallProblems, "type": "others", QNumber: "others" });

            // finally data addition call.
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    authToken: sessionStorage.getItem("authToken"),
                    userFeedBack: userData
                }),
            };
            fetch(URL.insertUsersFeedback, options)
                .then((response) => response.json())
                .then((responsedata) => {
                    if (responsedata.status === "SUCCESS") {
                        confirmAlert({
                            message: responsedata.statusDetails,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        props.history.push("/accountInfo");
                                    }
                                },
                            ], closeOnClickOutside: false,
                        });
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

        };
    };


    return (
        <>
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

            <form className="scrollbarx" onSubmit={handleSubmit}>
                {
                    feedBack_question.length !== 0 && (
                        feedBack_question.map((category, index) => (
                            <React.Fragment key={index}>
                                <div >
                                    <h3>{Object.keys(category)[0]}</h3>
                                    {category[Object.keys(category)[0]].map((question, qIndex) => (
                                        <div key={qIndex}>
                                            {Object.keys(question.feedBack_question).map((questionText, qTextIndex) => (
                                                <div key={qTextIndex}>
                                                    <p><span hidden={question.isMandatory === "0"} style={{ color: "red" }}>*</span><strong>{Number(qIndex) + 1}.</strong><span style={{ fontWeight: "500" }}>{questionText}</span> </p>
                                                    {Array.isArray(question.feedBack_question[questionText]) ? (
                                                        question.feedBack_question[questionText].map((option, optIndex) => (
                                                            <div style={{ paddingLeft: "2%" }} key={optIndex}>
                                                                <label>
                                                                    <input id={`${index}${qIndex}${optIndex}`} type="radio" name={question.QNumber} value={option} required={question.isMandatory === "1"} />
                                                                    {option}
                                                                </label>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <textarea
                                                            name={question.QNumber}
                                                            placeholder="Please describe any issues"
                                                            rows="3"
                                                            required={question.isMandatory === "1"}
                                                            id={`${index}${qIndex}`}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                                <hr />
                            </React.Fragment>
                        ))
                    )
                }
                <div className="overall-problems">
                    <h3>Overall Problems You Faced</h3>
                    <textarea
                        value={overallProblems}
                        onChange={handleOverallProblemsChange}
                        placeholder="Describe any overall issues or problems you have faced"
                        rows="5"
                        className="overall-problems-textarea"
                        id="overAllFeedback"
                    />
                </div>
                <button type="submit">Submit Feedback</button>
            </form>
        </>
    )
}
export default memo(UserFeedback);