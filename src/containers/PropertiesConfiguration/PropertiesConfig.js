import React, { useEffect, useState, memo } from "react";
import { confirmAlert } from "react-confirm-alert";
import { URL } from "../URLConstant";
import "./PropertiesConfig.css";
import { Input, Button, Select } from 'antd';
var Loader = require("react-loader");

function PropertiesConfig(props) {

    const [allowLoader, setAllowLoader] = useState(true);

    // Key/Values Records..
    const [propertiesRecord, setPropertiesRecord] = useState([]);

    const [forValidation, setForValidation] = useState([]);

    const [disableEnable, setDisableEnable] = useState(true);

    const [OTType, setOTType] = useState();

    const [smsProvider, setSMSProvider] = useState();

    const { Option } = Select;


    // Server call to fetch list of key and value pairs..
    useEffect(() => {
        // This feature is only avaiable for platform admin. In else users with other roleID is trying is accesss, push to '/' page.
        if (sessionStorage.getItem("roleID") === "1") {
            fetchConfigData("", "SMS");
        } else {
            props.history.push('/');
        }
    }, []);


    // Client Encryption Method..
    const encryptSecretKeyUsingAES = async (secretKey, json) => {
        try {
            // Generate a random salt
            const salt = crypto.getRandomValues(new Uint8Array(16));

            // Generate a random IV
            const iv = crypto.getRandomValues(new Uint8Array(16));

            // Derive a key using PBKDF2
            const importedSecretKey = await crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(secretKey),
                { name: "PBKDF2" },
                false,
                ["deriveKey"]
            );

            const derivedKey = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: salt,
                    iterations: 65536,
                    hash: "SHA-1",
                },
                importedSecretKey,
                { name: "AES-CBC", length: 256 },
                true,
                ["encrypt"]
            );

            // Encrypt the JSON string using AES with CBC mode
            const encryptedTextBuffer = await crypto.subtle.encrypt(
                {
                    name: "AES-CBC",
                    iv: iv,
                },
                derivedKey,
                new TextEncoder().encode(json)
            );

            // Combine salt, IV, and ciphertext
            const combinedDataBuffer = new Uint8Array([
                ...salt,
                ...iv,
                ...new Uint8Array(encryptedTextBuffer),
            ]);

            // Encode the combined data to Base64
            const combinedData = btoa(
                String.fromCharCode.apply(null, combinedDataBuffer)
            );
            return combinedData;
        } catch (error) {
            console.error("Encryption Error:", error);
            return null;
        }
    };

    // Client Decryption Methos..
    const decryptSecretKeyUsingAES = async (encryptedData, secretKey) => {
        try {
            // Decode the Base64 string to get the combined data
            const combinedDataBuffer = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));

            // Extract the salt, IV, and ciphertext
            const salt = combinedDataBuffer.slice(0, 16); // First 16 bytes
            const iv = combinedDataBuffer.slice(16, 32); // Next 16 bytes
            const ciphertext = combinedDataBuffer.slice(32); // Remaining bytes

            // Derive the key using PBKDF2
            const importedSecretKey = await crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(secretKey),
                { name: "PBKDF2" },
                false,
                ["deriveKey"]
            );

            const derivedKey = await crypto.subtle.deriveKey(
                {
                    name: "PBKDF2",
                    salt: salt,
                    iterations: 65536,
                    hash: "SHA-1", // Ensure this matches the encryption hash
                },
                importedSecretKey,
                { name: "AES-CBC", length: 256 },
                true,
                ["decrypt"]
            );

            // Decrypt the ciphertext
            const decryptedBuffer = await crypto.subtle.decrypt(
                {
                    name: "AES-CBC",
                    iv: iv,
                },
                derivedKey,
                ciphertext
            );

            // Decode the decrypted buffer back into a string
            const decryptedText = new TextDecoder().decode(decryptedBuffer);
            return decryptedText;
        } catch (error) {
            console.error("Decryption Error:", error);
            return null;
        }
    };

    // To fetch data (key and values)..
    const fetchConfigData = (event, type) => {
        setAllowLoader(false);
        hideValuesWithpassword(true);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    "optType": type,
                    authToken: sessionStorage.getItem("authToken")
                }
            )
        };
        fetch(URL.fetchConfigKeys, options)
            .then((response) => response.json())
            .then(async (responsedata) => {
                if (responsedata.status === "SUCCESS") {
                    setOTType(type);
                    if (type === "SMS") {
                        // If the input 'type' contains value 'SMS',then server response with 
                        // key ---> activeProvider
                        setSMSProvider(responsedata.activeProvider);
                    }
                    // let decryptedData = await decryptSecretKeyUsingAES(JSON.stringify(responsedata.encryptedData), sessionStorage.getItem("secretKey"));
                    // console.log(decryptedData);
                    setPropertiesRecord(responsedata.encryptedData);
                    setForValidation(responsedata.encryptedData);
                    setAllowLoader(true);
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
                    setAllowLoader(false);
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
                    setAllowLoader(false);
                }
            }).catch((error) => {
                console.error(error);
                confirmAlert({
                    message: `SomeThing Went Wrong PLease Try Again`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ], closeOnClickOutside: false,
                });
                setAllowLoader(false);
            });
    };

    // Updating new config properties data.
    const saveUpdateCofigPropertiesData = (event) => {
        // Check if user has enabled edit button, before save call, 
        // Through this server calls for unchanged data, can be neglected..
        if (disableEnable) {
            confirmAlert({
                message: 'Please edit the data before saving!',
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn"
                    }
                ], closeOnClickOutside: false,
            });
        } else {
            let newUpdatedCOnfigData = [];
            // Logic to identify the modified values only!
            for (let posts of forValidation) {
                // Iterate over data, by using DOM and fetch values and descriptions.
                let value = document.getElementById(`VALUE${posts["key"]}`).value;
                // Empty check..
                if (value.trim() === "") {
                    confirmAlert({
                        message: 'Empty values are not considered!. Please provide the value and try again.',
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: e => { }
                            }
                        ], closeOnClickOutside: false
                    });
                    return;
                } else {
                    // Compare the values, if it has changed, include it in the new upadted config data.
                    if (value !== posts["value"]) {
                        newUpdatedCOnfigData.push({ key: posts["key"], value: value, descrptn: posts["descrptn"] });
                    } else {
                        // No operations to perfrom..
                    }
                }
            };
            if (newUpdatedCOnfigData.length === 0) {
                confirmAlert({
                    message: 'There are no changes to be considered for saving!',
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: e => { }
                        }
                    ], closeOnClickOutside: false,
                });
            } else {
                // Server call to update the new config properties data.
                confirmAlert({
                    message: `Are you sure to proceed with the configuration properties to be updated!`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: async e => {
                                setAllowLoader(false);
                                let dataTobeEncrypted = { configKeys: newUpdatedCOnfigData };
                                let encryptedData = await encryptSecretKeyUsingAES(sessionStorage.getItem("secretKey"), JSON.stringify(dataTobeEncrypted));
                                let updateConfigData = {
                                    optType: OTType,
                                    encryptedData: encryptedData,
                                    authToken: sessionStorage.getItem("authToken")
                                };
                                // for 'OTType' to be SMS, an extra key 'smsProvider' and its respective value is sent..
                                if (OTType === "SMS") {
                                    updateConfigData["smsProvider"] = smsProvider;
                                } else {
                                    // No operation to perform..
                                }
                                const options = {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(updateConfigData)
                                };
                                fetch(URL.saveConfigKeys, options)
                                    .then((response) => response.json())
                                    .then(async (responsedata) => {
                                        if (responsedata.status === "SUCCESS") {
                                            // Response mandatory key check..
                                            confirmAlert({
                                                message: responsedata.statusDetails,
                                                buttons: [
                                                    {
                                                        label: "OK",
                                                        className: "confirmBtn",
                                                        onClick: () => { window.location.reload() }
                                                    }
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
                                            setAllowLoader(true);
                                        }
                                    }).catch((error) => {
                                        console.error(error);
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
                        },
                        {
                            label: "Cancel",
                            className: "cancelBtn"
                        }
                    ], closeOnClickOutside: false
                });
            }
        }
    };

    // Function to update the SMS provider..
    const swicthSMSProvider = (value) => {
        // A check to confirm the user has selected different SMS provider..
        // On clicking on same provider, alerting the user..
        if (value === smsProvider) {
            // Do nothing..
        } else {
            // An confirmation from user end to swtich the router..
            confirmAlert({
                message: `Are you sure to change the SMS provider to ${value}!`,
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: e => {
                            setAllowLoader(false);
                            const options = {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    OPTYPE: "SMS",
                                    smsProvider: value,
                                    authToken: sessionStorage.getItem("authToken")
                                })
                            };
                            fetch(URL.switchProvider, options)
                                .then((response) => response.json())
                                .then(async (responsedata) => {
                                    if (responsedata.status === "SUCCESS") {
                                        // Response mandatory key check..
                                        confirmAlert({
                                            message: responsedata.statusDetails,
                                            buttons: [
                                                {
                                                    label: "OK",
                                                    className: "confirmBtn",
                                                    onClick: () => {
                                                        window.location.reload()
                                                    }
                                                }
                                            ], closeOnClickOutside: false,
                                        });
                                        setAllowLoader(true);
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
                                    } else {
                                        confirmAlert({
                                            message: responsedata.statusDetails,
                                            buttons: [
                                                {
                                                    label: "OK",
                                                    className: "confirmBtn",
                                                    onClick: () => {
                                                        window.location.reload()
                                                    },
                                                }
                                            ], closeOnClickOutside: false,
                                        });
                                        setAllowLoader(true);
                                    }
                                }).catch((error) => {
                                    console.error(error);
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
                    },
                    {
                        label: "Cancel",
                        className: "cancelBtn"
                    }
                ], closeOnClickOutside: false,
            });
        }
    };

    // Common method, which could hide the values displayed.
    const hideValuesWithpassword = (boolean) => {
        // If block executes when this method is not called from the 'eye' icon present.
        if (boolean) {
            // Perform multiple operations in the true block
            // For maskOff, change Input type to 'password'
            (function () {
                document.getElementById("maskBtn").className = "fa fa-eye-slash"; document.getElementById("maskBtn").title = "Hide values";
                document.getElementById("maskBtn").title = "View values";
                propertiesRecord.forEach(item => {
                    document.getElementById(`VALUE${item["key"]}`).type = "password";
                });
            })()
        } else {
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
        }

    }

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
                    <div style={{ width: "78%" }}><span >SMS and Email Configurations</span></div>
                    <div style={{ width: "2%", fontSize: "20px" }}><i title="View values" className="fa fa-eye-slash" id="maskBtn"
                        onClick={() => hideValuesWithpassword(false)}
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
                <div className="ConfigSelectRow">
                    <div style={{ width: "10%", marginBottom: "20px" }} ><Input onClick={e => fetchConfigData(e, "SMS")} style={{ width: "fit-content" }} name="emailOrSms" defaultChecked={true} type="radio" />SMS</div>
                    <div style={{ width: "10%" }} ><Input onClick={e => fetchConfigData(e, "EMAIL")} style={{ width: "fit-content" }} name="emailOrSms" type="radio" />Email</div>
                    <div hidden={OTType === "SMS" ? false : true} className="SwtchSMSProvider" >Switch SMS Provider {<i class="fa fa-arrow-right"></i>}</div>
                    <div hidden={OTType === "SMS" ? false : true} className="SwtchSMSProviderDrpDwn" >
                        <Select onSelect={e => swicthSMSProvider(e)} value={smsProvider} title="Switch SMS Provider" style={{ width: "100%" }}>
                            <Option value={"AQUA"}> {smsProvider === "AQUA" ? <i title="Active SMS Provider" className="fa fa-check" /> : ""}AQUA</Option>
                            <Option value={"ROUTEMOBILES"}>{smsProvider === "ROUTEMOBILES" ? <i title="Active SMS Provider" className="fa fa-check" /> : ""}ROUTEMOBILES</Option>
                        </Select>
                    </div>
                </div>
                <div className="PCParntBorder ScrollBar">
                    <div className="PCParntHeading">
                        <div className="variables" ><span >Variable</span></div>
                        <div className="variables" ><span >Description</span></div>
                        <div className="values" style={{ paddingLeft: "3px", fontWeight: 500 }} ><span >Value</span></div>
                    </div>
                    <div>
                        {
                            propertiesRecord.map((posts, index) => (
                                <React.Fragment key={index}>
                                    <div className="PCParntHeading">
                                        <div style={{ padding: "5px", fontWeight: "" }} className="variables" ><span>{OTType === "SMS" ? (posts["key"]).substring(((smsProvider.length) + 6), (posts["key"]).length) : (posts["key"]).substring(5, (posts["key"]).length)}</span></div>
                                        <div style={{ padding: "5px", fontWeight: "" }} className="variables" ><span>{posts["descrptn"]}</span></div>
                                        <div className="values">
                                            <Input onChange={e => {
                                                setPropertiesRecord((prevData) =>
                                                    prevData.map((item, i) =>
                                                        i === index ? { ...item, ["value"]: e.target.value.trim() } : item
                                                    )
                                                );
                                            }} disabled={disableEnable} id={`VALUE${posts["key"]}`} style={{ borderWidth: "0px", padding: "5px" }} type="password" value={posts["value"]} />
                                        </div>
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