import React, { useEffect, useState, memo } from "react";
import { confirmAlert } from "react-confirm-alert";
import { URL } from "../URLConstant";
import "./PropertiesConfig.css";
import { Input, Button } from 'antd';
var Loader = require("react-loader");

function PropertiesConfig(props) {

    const [allowLoader, setAllowLoader] = useState(true);

    // Key/Values Records..
    const [propertiesRecord, setPropertiesRecord] = useState([]);

    const [disableEnable, setDisableEnable] = useState(true);

    // Server call to fetch list of key and value pairs..
    useEffect(() => {
        // setAllowLoader(false);
        if (sessionStorage.getItem("roleID") === "1") {
            // let jsonWebToken = sessionStorage.getItem("jsonWebToken");
            // const options = {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         'Authorization': `Bearer ${jsonWebToken}`
            //     },
            // body: JSON.stringify({})
            // };
            // fetch(URL., options)
            //     .then((response) => response.json())
            //     .then((responsedata) => {
            //         if (responsedata.status === "SUCCESS") {
            setPropertiesRecord([{ key: "from.email", value: "RameshTheITGuy@gmail.com", description: "Email configuration" },
            { key: "from.mobileNumber", value: "9988776655", description: "Mobile number configuration" }]);
            //             setAllowLoader(true);
            //             setPropertiesRecord(responsedata.records);
            //     } else if (responsedata.statusDetails === "Session Expired") {
            //         confirmAlert({
            //             message: responsedata.statusDetails,
            //             buttons: [
            //                 {
            //                     label: "OK",
            //                     className: "confirmBtn",
            //                     onClick: () => {
            //                         props.history.push("/login");
            //                     },
            //                 },
            //             ], closeOnClickOutside: false,
            //         });
            //     } else {
            //         confirmAlert({
            //             message: responsedata.statusDetails,
            //             buttons: [
            //                 {
            //                     label: "OK",
            //                     className: "confirmBtn"
            //                 }
            //             ], closeOnClickOutside: false,
            //         });
            //     }
            // }).catch((error) => {
            //     console.error(error);
            //     confirmAlert({
            //         message: `SomeThing Went Wrong PLease Try Again`,
            //         buttons: [
            //             {
            //                 label: "OK",
            //                 className: "confirmBtn",
            //             },
            //         ], closeOnClickOutside: false,
            //     });
            // });
        } else {
            props.history.push("/");
        }
    }, [])

    // Server call to insert, the update configuration data..
    const saveUpdateCofigPropertiesData = (e) => {
        // setAllowLoader(false);
        let newConfigData = [];
        propertiesRecord.forEach((data) => {
            // Iterate over an array and construct a new data to server.
            // Check for any empty data..
            if (document.getElementById(`VALUE${data["key"]}`).value.trim() === "" || document.getElementById(`DESC${data["key"]}`).value.trim() === "") {
                confirmAlert({
                    message: "Empty data cannot be accepted. Please include the value and try again.",
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => { setAllowLoader(true) }
                        },
                    ], closeOnClickOutside: false
                });
                // Reinitialize with empty array on empty values found..
                newConfigData = [];
                return;
            } else {
                newConfigData.push({ key: data["key"], value: document.getElementById(`VALUE${data["key"]}`).value.trim(), description: document.getElementById(`DESC${data["key"]}`).value.trim() })
            }
            setPropertiesRecord(newConfigData);
            // // 'POST' Method Server call to update new edited config data.
            // let jsonWebToken = sessionStorage.getItem("jsonWebToken");
            // const options = {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         'Authorization': `Bearer ${jsonWebToken}`
            //     },
            //     body: JSON.stringify({})
            // };
            // fetch(URL.DeleteUser, options)
            //     .then((response) => response.json())
            //     .then((responsedata) => {
            //         if (responsedata.status === "SUCCESS") {
            //             confirmAlert({
            //                 message: responsedata.statusDetails,
            //                 buttons: [
            //                     {
            //                         label: "OK",
            //                         className: "confirmBtn",
            //                         onClick: () => {
            //                             setAllowLoader(true);
            //                         }
            //                     },
            //                 ], closeOnClickOutside: false,
            //             });
            //             setPropertiesRecord(newConfigData);
            //         } else if (responsedata.statusDetails === "Session Expired") {
            //             confirmAlert({
            //                 message: responsedata.statusDetails,
            //                 buttons: [
            //                     {
            //                         label: "OK",
            //                         className: "confirmBtn",
            //                         onClick: () => {
            //                             props.history.push("/login");
            //                         }
            //                     }
            //                 ], closeOnClickOutside: false,
            //             });
            //         } else {
            //             confirmAlert({
            //                 message: responsedata.statusDetails,
            //                 buttons: [
            //                     {
            //                         label: "OK",
            //                         className: "confirmBtn",
            //                         onClick: () => {
            //                             setAllowLoader(true);
            //                         }
            //                     }
            //                 ], closeOnClickOutside: false,
            //             });
            //             setPropertiesRecord(...propertiesRecord);
            //         }
            //     }).catch((error) => {
            //         console.error(error);
            //         confirmAlert({
            //             message: `SomeThing Went Wrong PLease Try Again`,
            //             buttons: [
            //                 {
            //                     label: "OK",
            //                     className: "confirmBtn",
            //                     onClick: () => {
            //                         setAllowLoader(true);
            //                     }
            //                 },
            //             ], closeOnClickOutside: false,
            //         });
            //         setPropertiesRecord(...propertiesRecord);
            //     });
        });
    };

    return (
        <React.Fragment>
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
            <div className="ParntDivPC">
                <div className="heading" style={{ width: "100%" }}>
                    <div style={{ width: "75%" }}><span >SMS and Email Configuration</span></div>
                    <div style={{ width: "5%", fontSize: "20px" }}><i title="View values" className="fa fa-eye-slash" id="maskBtn"
                        onClick={() => {
                            document.getElementById("maskBtn").className === "fa fa-eye-slash" ?
                                (
                                    // Perform multiple operations in the true block
                                    // For maskOn, change Input type to 'text'
                                    (function () {
                                        document.getElementById("maskBtn").className = "fa fa-eye";
                                        document.getElementById("maskBtn").title = "Hide values";
                                        propertiesRecord.forEach(item => {
                                            document.getElementById(`VALUE${item["key"]}`).type = "text";
                                        });
                                    })()
                                )
                                :
                                (
                                    // Perform multiple operations in the true block
                                    // For maskOff, change Input type to 'password'
                                    (function () {
                                        document.getElementById("maskBtn").className = "fa fa-eye-slash"; document.getElementById("maskBtn").title = "Hide values";
                                        document.getElementById("maskBtn").title = "View values";
                                        propertiesRecord.forEach(item => {
                                            document.getElementById(`VALUE${item["key"]}`).type = "password";
                                        });
                                    })()
                                )
                        }}
                    ></i></div>
                    <div style={{ width: "10%" }} className="editBTN" >
                        <Button onClick={() => {
                            setDisableEnable(false);
                        }} >Edit</Button>
                    </div>
                    <div onClick={e => saveUpdateCofigPropertiesData(e)} style={{ width: "10%" }} className="editBTN" >
                        <Button>Save</Button>
                    </div>
                </div>
                <div className="PCParntBorder ScrollBar">
                    <div className="PCParntHeading">
                        <div className="variables" ><span >Variable</span></div>
                        <div className="variables" ><span >Description</span></div>
                        <div className="values" style={{paddingLeft:"3px"}} ><span >Value</span></div>
                    </div>
                    <div>
                        {
                            propertiesRecord.map((posts, index) => (
                                <React.Fragment key={index}>
                                    <div className="PCParntHeading">
                                        <div style={{ padding: "5px" }} className="variables" ><span>{posts["key"]}</span></div>
                                        <div className="variables" >
                                            <Input disabled={disableEnable} id={`DESC${posts["key"]}`} style={{ borderWidth: "0px", padding: "5px" }} type="text" defaultValue={posts["description"]} /></div>
                                        <div className="values" >
                                            <Input disabled={disableEnable} id={`VALUE${posts["key"]}`} style={{ borderWidth: "0px", padding: "5px" }} type="password" defaultValue={posts["value"]} /></div>
                                    </div>
                                </React.Fragment>
                            ))
                        }
                    </div>
                </div>
            </div>
        </React.Fragment >
    )
}
export default memo(PropertiesConfig);