import React, { useState, useEffect } from "react";
import { URL } from "../URLConstant";
import './FeedbackForm.css'; // Import the CSS file
import { confirmAlert } from "react-confirm-alert";
var Loader = require("react-loader");

function UserFeedbackView(props) {

    const [userData, setUserData] = useState();

    const [feedBack_question, setFeedbackQuestions] = useState([]);

    const [allowLoader, setAllowLoader] = useState(false);

    const [inholdRender, setInholdRender] = useState(false);

    useEffect(() => {
        setUserData(props.history.location.state.userData);
        // fetch call to get the feedback questions.
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken")
            }),
        };
        fetch(URL.getFeedbackQuestions, options)
            .then((response) => response.json())
            .then((responsedata) => {
                if (responsedata.status === "SUCCESS") {
                    setFeedbackQuestions(JSON.parse(atob(responsedata.feedBackQuestions)));
                    setInholdRender(true);
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
    }, []);


    useEffect(() => {
        if (inholdRender) {
            for (let key in userData.feedbackData) {
                let jsObj = userData.feedbackData[key]
                //check for type of input..                
                if (!(document.getElementById(jsObj.QNumber).type === "radio")) {
                    document.getElementById(jsObj.QNumber).value = jsObj.data
                }
            }
            // name, mobile, feedbackON data addition.
            document.getElementById("USERNAME").innerHTML = userData.UserName
            document.getElementById("USERMOBILE").innerHTML = userData.MobileNumber
            document.getElementById("USERFEDBCKON").innerHTML = userData.feedbackGivenData
        }
    }, [inholdRender]);

    const checkSelectedInput = (option, qNumber) => {
        if (Object.keys(userData).length !== 0) {
            let checked = false;
            let feedbackData = userData.feedbackData;
            let data = feedbackData.filter(data => (data.QNumber === qNumber && data.data === option));
            if (data.length !== 0) {
                checked = true;
            }
            return (
                <>
                    <label>
                        <input id={qNumber} checked={checked} type="radio" name={qNumber} value={option} />
                        {option}
                    </label>
                </>
            )
        }
    }
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
                key="loader"
            />
            <div className="userIndentity" style={{ marginBottom: "5px" }}>
                <div className="UserData"  key="USERNAME"><strong>Name</strong>: <span style={{marginLeft:"5px"}} id="USERNAME"></span></div>
                <div className="UserData"  key="USERMOBILE"><strong>Mobile Number</strong>: <span style={{marginLeft:"5px"}} id="USERMOBILE"></span></div>
                <div className="UserData"  key="USERFEDBCKON"><strong>Feedback ON</strong>: <span style={{marginLeft:"5px"}} id="USERFEDBCKON"></span></div>
            </div>
            <form className="scrollbarx" key="feedbackForm">
                {
                    feedBack_question.length !== 0 && (
                        feedBack_question.map((category, index) => (
                            <React.Fragment key={`ZERO${index}`}>
                                <div>
                                    <h3>{Object.keys(category)[0]}</h3>
                                    {category[Object.keys(category)[0]].map((question, qIndex) => (
                                        <div key={`ONE${qIndex}${index}`}>
                                            {Object.keys(question.feedBack_question).map((questionText, qTextIndex) => (
                                                <div key={`TWO${qTextIndex}${qIndex}`}>
                                                    <p><span hidden={question.isMandatory === "0"} style={{ color: "red" }}>*</span><strong>{Number(qIndex) + 1}.</strong><span style={{ fontWeight: "500" }}>{questionText}</span> </p>
                                                    {Array.isArray(question.feedBack_question[questionText]) ? (
                                                        question.feedBack_question[questionText].map((option, optIndex) => (
                                                            <div style={{ paddingLeft: "2%" }} key={`THREE${optIndex}${qTextIndex}`}>
                                                                {
                                                                    checkSelectedInput(option, question.QNumber)
                                                                }
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <textarea
                                                            disabled={true}
                                                            name={question.QNumber}
                                                            placeholder="Please describe any issues"
                                                            rows="3"
                                                            required={question.isMandatory === "1"}
                                                            id={question.QNumber}
                                                            key={question.QNumber}
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
                        placeholder="Describe any overall issues or problems you have faced"
                        rows="5"
                        className="overall-problems-textarea"
                        id="others"
                    />
                </div>
            </form>
        </>
    )

}
export default UserFeedbackView;