import React, { useEffect, useState } from "react";
import '../AdminUploadTemplate/HtmlUpload.css';
import './BulkSigningCss.css';
import { URL } from '../URLConstant';
import { confirmAlert } from 'react-confirm-alert';
import '../AdminTemplateApproval/AdminApr.css';
var jsPDF = require("jspdf");
var Loader = require('react-loader');
const pdfjsforOnDrag = require("pdfjs-dist");
pdfjsforOnDrag.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js`;

function HtmlPreview(props) {

    // to store the html file
    const [htmlFile, setHtmlFile] = useState("");

    // to store the html content
    const [htmlContent, setHtmlContent] = useState("");

    // to store the keys from csv file
    const [csvKeys, setCsvKeys] = useState([]);

    // to store the keys from html file
    const [htmlKeys, setHtmlKeys] = useState([]);

    // to control flow of rendering the html file
    const [allowHtmlFile, setAllowHtmlFile] = useState(false);

    // to store the data of analyzed keys.
    const [analyzedDataTrue, setAnalyzedDataTrue] = useState([]);

    // to store the system search keys.
    const [sysSerKeys, setSysSerKeys] = useState([]);

    // to control the open and close of modal.
    const [allowmodal, setAllowModal] = useState(false);

    // to hold the HTML key.
    const [htmlKey, setHtmlKey] = useState();

    // to store the custom validation keys..
    const [ValidationKeyData, setValidationKey] = useState([]);

    // to hold the data to be sent to server..
    const [finlDataToServer, setFinalDataToServer] = useState({});

    // to allow setFinalDataToServer data when certain operation is completed.
    const [allowAfterDone, setAllowAfterDone] = useState(false);

    // to store the csv file passed.
    const [csvFile, setCsvFile] = useState("");

    // to store the converted data of csv file;
    const [convertedCSVData, setConvertedCSVData] = useState([]);

    const [PDFFile, setPDFFile] = useState("");
    const [equalPageDimensions, setEqualPageDimensions] = useState(true);
    const [pageDimensions, setPageDimensions] = useState("");
    const [files1, setFiles1] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [fileName, setFileName] = useState("");
    const [width, setWidth] = useState("");
    const [height, setHeight] = useState("");
    const [csvFileRefNo, setCsvFileRefNo] = useState("");
    const [fileRefNo, setFileRefNo] = useState("");
    const [loader, setLoader] = useState(false);


    // to store 
    // const [allowModalToRender, setAllowModalToRender] = useState({});
    // to fetch the html file and datas'
    useEffect(() => {
        let file = props.location.state.htmlFile;
        setFileName(file.name);
        setHtmlFile(file);
        // to read the content of the html file..
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = function (e) {
            const text = e.target.result;
            setHtmlContent(text);
            setAllowHtmlFile(true);
        }
        setCsvKeys(props.location.state.htmlKeys);
        console.log(props.location.state.additionalColumValues);
        
        setHtmlKeys(props.location.state.additionalColumValues);
        setCsvFile(props.location.state.csvFile);
        setConvertedCSVData(props.location.state.convertedCSVData);

        // logic to create the analyzed data.
        for (let key in props.location.state.htmlKeys) {
            let keyWitoutCurly = (props.location.state.htmlKeys[key]).substring(10, (props.location.state.htmlKeys[key]).length - 2)
            let allow = false;
            for (let keyz in props.location.state.additionalColumValues) {
                if (props.location.state.htmlKeys[key] === props.location.state.additionalColumValues[keyz]) {
                    allow = true;
                    break;
                }
            }
            setAnalyzedDataTrue(oldValue => ([
                ...oldValue,
                { "key": props.location.state.htmlKeys[key], "value": allow ? true : false }
            ]));

            setFinalDataToServer(oldValue => ({
                ...oldValue,
                [props.location.state.htmlKeys[key]]: {
                    label: keyWitoutCurly, placeHolder: `Enter The ${keyWitoutCurly} Here`, inputDescription:
                        keyWitoutCurly, inputDataType: "", minLength: "", maxLength: "",
                    minRange: "", maxRange: "", inputField: keyWitoutCurly, isMandatory:
                        0, customValidation: "", SearchAbleKey: 0,
                    autofill: 0, dataFromApp: 0, editable: 0, AppValue: ""
                }
            }))
        }
    }, []);

    // use effect for fetch calls
    useEffect(() => {
        setLoader(false);
        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken")
            })
        }
        fetch(URL.getValidationKeys, options)
            .then(response => (response.json()))
            .then(data => {
                if (data.status === "success") {
                    setLoader(true);
                    setValidationKey(data.data);
                }
                else if (data.statusDetails === "Session Expired") {
                    confirmAlert({
                        message: data.statusDetails,
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
                    setLoader(true);
                }
                else {
                    confirmAlert({
                        message: data.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn"
                            },
                        ], closeOnClickOutside: false
                    });
                    setLoader(true);
                }
            })
            .catch(error => {
                confirmAlert({
                    message: `Something went wrong. please try again!`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ], closeOnClickOutside: false
                });
                setLoader(true);
            })

        setLoader(false);
        // fetch call to get the list of application keys..
        const option = {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken")
            })
        }
        fetch(URL.getApplicationKeys, option)
            .then(response => (response.json()))
            .then(data => {
                if (data.status === "SUCCESS") {
                    setLoader(true);
                    setSysSerKeys(data.userAvailableData);
                }
                else if (data.statusDetails === "Session Expired") {
                    confirmAlert({
                        message: data.statusDetails,
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
                    setLoader(true);
                }
                else {
                    confirmAlert({
                        message: data.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn"
                            },
                        ], closeOnClickOutside: false
                    });
                    setLoader(true);
                }
            })
            .catch(error => {
                confirmAlert({
                    message: `Something went wrong. please try again!`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ], closeOnClickOutside: false
                });
                setLoader(true);
            })
    }, [])

    // to open the modal..
    const openModal = (e, key, boolean) => {
        setHtmlKey(key);
        setAllowModal(true);
        setAllowAfterDone(boolean);
    }

    // to close the modal..
    const closeTheModal = () => {
        setAllowModal(false);
    }

    // one consent confirmAlert that is used allover.
    const confirmAlertFunction = (message) => {
        confirmAlert({
            message: message,
            buttons: [
                {
                    label: "OK",
                    className: "confirmBtn"
                }
            ],
            closeOnClickOutside: false, // Set to false to prevent closing on click outside
        });
    }

    // to create the html file to be render..
    const creatHtmlForm = () => {
        if (allowHtmlFile) {
            var sampleText = htmlContent;
            sampleText = sampleText.replaceAll("{{jsonObj.", `<span style="background-color: yellow; height: fit-content;">`)
            sampleText = sampleText.replaceAll("}}", '</span>');
            return (
                <div dangerouslySetInnerHTML={{ __html: sampleText }} />
            )
        }
    }

    // to control the input on modal based on user selection of data type..
    const holderTheInputField = (e, key) => {
        if (e.target.value === "date") {
            document.getElementById(key + "placeHolder1").hidden = true;
            document.getElementById(key + "maxLength1").hidden = true;
            document.getElementById(key + "minLength1").hidden = true;
            document.getElementById(key + "minRange1").hidden = false;
            document.getElementById(key + "maxRange1").hidden = false;
            document.getElementById(key + "minRange").type = "date";
            document.getElementById(key + "maxRange").type = "date";
        }
        else if (e.target.value === "number") {
            document.getElementById(key + "placeHolder1").hidden = false;
            document.getElementById(key + "maxLength1").hidden = true;
            document.getElementById(key + "minLength1").hidden = true;
            document.getElementById(key + "minRange1").hidden = false;
            document.getElementById(key + "maxRange1").hidden = false;
            document.getElementById(key + "minRange").type = "number";
            document.getElementById(key + "maxRange").type = "number";
            document.getElementById(key + "placeHolder").value = `Enter The ${key.split("{{")[1].split("}}")[0].split(".")[1]} here`;
        }
        else {
            document.getElementById(key + "placeHolder1").hidden = false;
            document.getElementById(key + "maxLength1").hidden = false;
            document.getElementById(key + "minLength1").hidden = false;
            document.getElementById(key + "minRange1").hidden = true;
            document.getElementById(key + "maxRange1").hidden = true;
            document.getElementById(key + "placeHolder").value = `Enter The ${key.split("{{")[1].split("}}")[0].split(".")[1]} here`;
        }
    }

    // onclick of radio buttons
    const renderInputForm = (event, boolean) => {
        document.getElementById("PARENTDIVINPT").hidden = boolean;
    }

    // when pick from app checked or unchecked.
    const pickFrmApp = (e, key) => {
        document.getElementById("SYSKEYDROP").hidden = !e.target.checked;
    }

    // to collect the defined data of a particular html keys 
    const eachHtmKeysData = (event, key, boolean) => {
        // if the input field is non editable..it enters if condition....
        if (boolean) {
            let keyWithOutCurly = key.substring(10, key.length - 2);
            // allowAfterDone allows only if the key has a option of pickFormSystem..
            if (!allowAfterDone && document.getElementById("systemSearchID").checked) {
                let systemFillValue = document.getElementById("systemFillKeys").value;
                setFinalDataToServer({
                    ...finlDataToServer,
                    [key]: {
                        label: keyWithOutCurly, placeHolder: `Enter The ${keyWithOutCurly} Here`, inputDescription:
                            "", inputDataType: "", minLength: "", maxLength: "",
                        minRange: "", maxRange: "", inputField: keyWithOutCurly, isMandatory:
                            0, customValidation: "", SearchAbleKey: 0,
                        autofill: 1, dataFromApp: 1, editable: 0,
                        AppValue: systemFillValue
                    }
                })
                document.getElementById(`${key}Checked`).className = "fa fa-check";
            }
            else {
                setFinalDataToServer({
                    ...finlDataToServer,
                    [key]: {
                        label: keyWithOutCurly, placeHolder: `Enter The ${keyWithOutCurly} Here`, inputDescription:
                            "", inputDataType: "", minLength: "", maxLength: "",
                        minRange: "", maxRange: "", inputField: keyWithOutCurly, isMandatory:
                            0, customValidation: "", SearchAbleKey: 0,
                        autofill: 0, dataFromApp: 0, editable: 0,
                        AppValue: ""
                    }
                })
                document.getElementById(`${key}Checked`).className = "";
            }
            closeTheModal();
        }
        else {
            let systemFillKeys = "";
            let placeHolder = "";
            let minLength = "";
            let maxLength = "";
            let minRange = "";
            let maxRange = "";
            let customValidation = document.getElementById("ValidationKey").value;
            let isMandatoryYesOrNo = "";
            let searchAbleKey = document.getElementById(key + "SearchableKey").value;
            let keyWitoutCurly = key.substring(10, key.length - 2)

            // check if it is pickFromApp and it is checked..
            if (!allowAfterDone && document.getElementById("systemSearchID").checked) {
                systemFillKeys = document.getElementById("systemFillKeys").value;
            }

            if (document.getElementById(key + "label").value === "" || document.getElementById(key + "label").value === null) {
                confirmAlertFunction("Please Enter Label Name");
                return;
            }

            if (document.getElementById(key + "inputDescription").value === "" || document.getElementById(key + "inputDescription").value === null) {
                confirmAlertFunction("Please Enter Input Description")
                return;
            }

            if (document.getElementById(key + "dataType").value === "date") {
                if (document.getElementById(key + "minRange").value !== "" || document.getElementById(key + "minRange").value !== null) {
                    minRange = document.getElementById(key + "minRange").value;
                }
                if (document.getElementById(key + "maxRange").value !== "" || document.getElementById(key + "maxRange").value !== null) {
                    maxRange = document.getElementById(key + "maxRange").value;
                }
            }

            else if (document.getElementById(key + "dataType").value === "number") {
                if (document.getElementById(key + "placeHolder").value === "" || document.getElementById(key + "placeHolder").value === null) {
                    confirmAlertFunction('Please Fill The PlaceHolder!');
                    return;
                }
                else {
                    placeHolder = document.getElementById(key + "placeHolder").value;
                }

                if (document.getElementById(key + "minRange").value !== "" || document.getElementById(key + "minRange").value !== null) {
                    minRange = document.getElementById(key + "minRange").value;
                }
                if (document.getElementById(key + "maxRange").value !== "" || document.getElementById(key + "maxRange").value !== null) {
                    maxRange = document.getElementById(key + "maxRange").value;
                }
            }

            else if (document.getElementById(key + "dataType").value === "tel") {
                if (document.getElementById(key + "placeHolder").value === "" || document.getElementById(key + "placeHolder").value === null) {
                    confirmAlertFunction(`Please Fill The PlaceHolder`);
                    return;
                }
                else {
                    placeHolder = document.getElementById(key + "placeHolder").value;
                }
                minLength = 10;
                maxLength = 12;
            }

            else {
                if (document.getElementById(key + "placeHolder").value === "" || document.getElementById(key + "placeHolder").value === null) {
                    confirmAlertFunction(`Please Fill The PlaceHolder`);
                    return;
                }
                else {
                    placeHolder = document.getElementById(key + "placeHolder").value;
                }

                if (document.getElementById(key + "minLength").value === "" || document.getElementById(key + "minLength").value === null) {
                    minLength = 5;
                }
                else {
                    minLength = document.getElementById(key + "minLength").value;
                }
                if (document.getElementById(key + "maxLength").value === "" || document.getElementById(key + "minLength").value === null) {
                    maxLength = 150;
                }
                else {
                    maxLength = document.getElementById(key + "maxLength").value;
                }
                if (maxLength > 255 || maxLength <= 0) {
                    event.preventDefault();
                    confirmAlertFunction("The max length should not exceed 255 or below 0")
                    return;
                }
                else if (minLength <= 0 || minLength > 255) {
                    event.preventDefault();
                    confirmAlertFunction("The min length should not be less than 1 or above 255");
                    return;
                }
            }

            if (document.getElementById(key + "IsMandatory").value === "Yes") {
                isMandatoryYesOrNo = 1;
            } else {
                isMandatoryYesOrNo = 0;
            }

            if (customValidation === "noneOfthese") {
                customValidation = "";
            }

            if (searchAbleKey === "Yes") {
                searchAbleKey = 1;
            } else {
                searchAbleKey = 0;
            }
            setFinalDataToServer({
                ...finlDataToServer,
                [key]: {
                    ...finlDataToServer[key],
                    "label": document.getElementById(key + "label").value, "placeHolder": placeHolder,
                    "inputDescription": document.getElementById(key + "inputDescription").value, "inputDataType":
                        document.getElementById(key + "dataType").value, "minLength": minLength, "maxLength":
                        maxLength, "minRange": minRange, "maxRange": maxRange, "inputField": keyWitoutCurly, "isMandatory":
                        isMandatoryYesOrNo, "customValidation": customValidation, "SearchAbleKey": searchAbleKey,
                    AppValue: systemFillKeys, autofill: systemFillKeys !== "" ? 1 : 0, dataFromApp: systemFillKeys !== "" ? 1 : 0, editable: 1,
                }
            })
            document.getElementById(`${key}Checked`).className = "fa fa-check";
            closeTheModal();
        }
    }

    // to return the inner content of modal
    const editableField = () => {
        let arr = [];
        let intailData = finlDataToServer[htmlKey];
        let type = "";
        let placeHolder = false;
        let minLength = false;
        let maxLength = false;
        let minRange = false;
        let maxRange = false;
        let RangeDataType = "number";
        for (let keys in intailData) {
            if (keys === "type") {
                type = intailData[keys];
            }
            arr.push(intailData[keys] + "");
        }
        if (type === "date") {
            placeHolder = true;
            minLength = true;
            maxLength = true;
            RangeDataType = "date";
        }
        else if (type === "number") {
            minLength = true;
            maxLength = true;
        } else {
            minRange = true;
            maxRange = true;
        }
        return (
            <>
                <div className='Divo4Css'>
                    <div className='title' style={{ width: "28%" }}>
                        <span>Field Name: </span>
                    </div>
                    <div className='titleName'>
                        <span>{(htmlKey).substring(10, htmlKey.length - 2)}</span>
                    </div>
                </div>
                <div style={{ marginTop: "15px", display: "flex", marginBottom: "10px" }}>
                    <div style={{ marginRight: "10px", display: "flex" }}>
                        <div>
                            <input id="EditableRadioCheck" onClick={e => renderInputForm(e, false)} defaultChecked={intailData.editable === 0 ? false : true} type="radio" name="editable">
                            </input>
                        </div>
                        <div >Editable</div>
                    </div>
                    <div style={{ marginRight: "10px", display: "flex" }}>
                        <div>
                            <input onClick={e => renderInputForm(e, true)} type="radio" defaultChecked={intailData.editable === 0 ? true : false} name="editable"></input>
                        </div>
                        <div>Noneditable</div>
                    </div>
                </div>
                {
                    allowAfterDone ? <></> :
                        <>
                            <div style={{ display: "flex", marginBottom: "10px" }}>
                                <div style={{ marginRight: "10px", display: "flex", paddingTop: "2px" }}>
                                    <div style={{ paddingTop: "1px" }}>
                                        <input id="systemSearchID" onClick={e => pickFrmApp(e, htmlKey)} defaultChecked={intailData.dataFromApp === 0 ? false : true} type="checkBox" name="pickFromApp">
                                        </input>
                                    </div>
                                    <div >Pick from app</div>
                                </div>
                                <div id="SYSKEYDROP" hidden={intailData.dataFromApp === 0 ? true : false} className='inputname1'>
                                    <select id="systemFillKeys" defaultValue={arr[15]} name='dataType' className='selectdropdown' >
                                        {
                                            sysSerKeys.map((data) => (
                                                <option key={data.field_KEY} value={data.field_KEY} title={data.key_DESC} selected={intailData.value === data.field_KEY ? true : false}>{data.display_KEY}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                        </>
                }
                <div id="PARENTDIVINPT" hidden={intailData.editable === 0 ? true : false} key={htmlKey} className='Divo3Css'>
                    <div className='htmlPrivwSrllBar inputHolderCss'>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Label Name <span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <input defaultValue={arr[0]} type='text' name='label' id={`${htmlKey}label`} autoCapitalize='off' className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${htmlKey}placeHolder1`} hidden={placeHolder}>
                            <div className='InputName'>
                                <span>Place Holder<span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <input defaultValue={arr[1]} type='text' name='placeHolder' id={`${htmlKey}placeHolder`} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Field Desc <span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <input defaultValue={arr[2]} type='text' name='inputDescription' id={`${htmlKey}inputDescription`} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Data Type <span id="mandatoryRed">*</span>: </span>
                            </div>
                            <div className='inputname1'>
                                <select defaultValue={arr[3]} name='dataType' id={`${htmlKey}dataType`} className='selectdropdown' onChange={e => holderTheInputField(e, htmlKey)}>
                                    <option>text</option>
                                    <option>number</option>
                                    <option>date</option>
                                    <option>tel</option>
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${htmlKey}minLength1`} hidden={minLength}>
                            <div className='InputName'>
                                <span>Char Min Length: </span>
                            </div>
                            <div className='inputname1'>
                                <input defaultValue={arr[4]} type='number' name='minLength' id={`${htmlKey}minLength`} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${htmlKey}maxLength1`} hidden={maxLength}>
                            <div className='InputName'>
                                <span>Char Max Length: </span>
                            </div>
                            <div className='inputname1'>
                                <input defaultValue={arr[5]} type='number' id={`${htmlKey}maxLength`} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${htmlKey}minRange1`} hidden={minRange}>
                            <div className='InputName'>
                                <span>Min range: </span>
                            </div>
                            <div className='inputname1'>
                                <input defaultValue={arr[6]} type={RangeDataType} id={`${htmlKey}minRange`} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${htmlKey}maxRange1`} hidden={maxRange}>
                            <div className='InputName'>
                                <span>Max range: </span>
                            </div>
                            <div className='inputname1'>
                                <input defaultValue={arr[7]} type={RangeDataType} id={`${htmlKey}maxRange`} className='inputCss' />
                            </div>
                        </div>
                        <div className='Divo5Css' id={`${htmlKey}customValidation`}>
                            <div className='InputName'>
                                <span>Validation Key: </span>
                            </div>
                            <div className='inputname1'>
                                <select defaultValue={arr[10]} id='ValidationKey' style={{ height: "30px" }} type='text' className='inputCss'>
                                    <option value="" disabled hidden>Choose Validation key</option>
                                    <option key="noneOfthese" value="noneOfthese" id="noneOftheseID">No Validation</option>
                                    {
                                        <>
                                            {
                                                ValidationKeyData.map((data, index) => (
                                                    <option key={index} value={data} id={`${data}ValKeyId`}>{data}</option>
                                                ))
                                            }
                                        </>
                                    }
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Mandatory Field: </span>
                            </div>
                            <div className='inputname1'>
                                <select name='IsMandatory' id={`${htmlKey}IsMandatory`} className='selectdropdown' >
                                    <option selected={arr[9] === "0" ? false : true}>Yes</option>
                                    <option selected={arr[9] === "0" ? true : false}>No</option>
                                </select>
                            </div>
                        </div>
                        <div className='Divo5Css'>
                            <div className='InputName'>
                                <span>Searchable Key: </span>
                            </div>
                            <div className='inputname1'>
                                <select name='SearchableKey' id={`${htmlKey}SearchableKey`} className='selectdropdown' >
                                    <option selected={arr[11] === "1" ? true : false}>Yes</option>
                                    <option selected={arr[11] === "1" ? false : true}>No</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='Divo6Css'>
                    <div className='proceedCancelCss'>
                        <button className='cancelbtn' type='button' onClick={closeTheModal}>Cancel</button>
                    </div>
                    <div className='proceedCancelCss'>
                        <button className='proceedbtnX' type='button' onClick={e => eachHtmKeysData(e, htmlKey, document.getElementById("PARENTDIVINPT").hidden)}>Proceed</button>
                    </div>
                </div>
            </>
        )
    }

    // to final proceed with data
    const finalProccedWithJson = (event) => {
        let finlDataToServerArray = [];
        for (let key in analyzedDataTrue) {
            let finlDataToServerJSON = finlDataToServer[analyzedDataTrue[key].key];
            if (analyzedDataTrue[key].value) {
                if (finlDataToServerJSON.editable === 0) {
                    let nonEditableJSON = {
                        autofill: finlDataToServerJSON.autofill, dataFromApp: finlDataToServerJSON.dataFromApp, editable: finlDataToServerJSON.editable,
                        AppValue: finlDataToServerJSON.AppValue, inputField: finlDataToServerJSON.inputField
                    }
                    finlDataToServerArray.push(nonEditableJSON);
                } else {
                    finlDataToServerArray.push(finlDataToServerJSON);
                }
            } else {
                if (finlDataToServerJSON.editable === 0 && finlDataToServerJSON.dataFromApp === 0) {
                    confirmAlertFunction(`The field '${(analyzedDataTrue[key].key).substring(10, (analyzedDataTrue[key].key).length - 2)}' should have a data either in CSV file or should be picked from our application.`)
                    return;
                }
                else {
                    if (finlDataToServerJSON.editable === 0) {
                        let nonEditableJSON = {
                            autofill: finlDataToServerJSON.autofill, dataFromApp: finlDataToServerJSON.dataFromApp, editable: finlDataToServerJSON.editable,
                            AppValue: finlDataToServerJSON.AppValue, inputField: finlDataToServerJSON.inputField
                        }
                        finlDataToServerArray.push(nonEditableJSON);
                    }
                    else {
                        finlDataToServerArray.push(finlDataToServerJSON);
                    }
                }
            }
        }
        let validationData = {
            authToken: sessionStorage.getItem("authToken"),
            userIP: sessionStorage.getItem("userIP"),
            htmlvalidations: finlDataToServerArray
        }
        let data = new FormData();
        data.append("inputDetails", JSON.stringify(validationData));
        data.append("csvFile", csvFile);
        data.append("file", htmlFile);
        setLoader(false);
        const options = {
            method: "POST",
            headers: {
                enctype: "multipart/form-data"
            },
            body: data
        }
        fetch(URL.uploadBulkSignFile, options)
            .then(response => (response.json()))
            .then(data => {
                if (data.status === "SUCCESS") {
                    setLoader(true);
                    setPDFFile(data.PDFValue);
                    setCsvFileRefNo(data.csvFileRefNo);
                    setFileRefNo(data.fileRefNo);
                    confirmAlert({
                        message: data.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => {
                                    createPDF(data.PDFValue, data.csvFileRefNo, data.fileRefNo);
                                }
                            }
                        ],
                        closeOnClickOutside: false, // Set to false to prevent closing on click outside
                    });

                }
                else if (data.statusDetails === "Session Expired!!") {
                    confirmAlert({
                        message: data.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => {
                                    props.history.push("/login");
                                },
                            },
                        ],
                    });
                    setLoader(true);
                }
                else {
                    confirmAlert({
                        message: data.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn"
                            },
                        ],
                    });
                    setLoader(true);
                }
            })
            .catch(error => {
                console.log(error);
                confirmAlert({
                    message: `Something went wrong. please try again!`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ], closeOnClickOutside: false
                });
                setLoader(true);
            })
    }

    const createPDF = async (pdfValue, csvFileRefNo1, fileRefNo1) => {
        const base64String = pdfValue;
        // convert base64 string to original binary data..
        let data = atob(base64String);
        // storing individual bytes of binary data..
        const uint8Array = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            uint8Array[i] = data.charCodeAt(i);
        }
        const blob = new Blob([uint8Array], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        var file = new File([blob], `${fileName.split(".")[0]}.pdf`, {
            type: "application/pdf",
            lastModified: new Date(),
        });

        let localPages = null; // Declare local variable for pages
        let equalPageDimensions1 = true;
        let width1 = 0;
        let height1 = 0;

        try {
            const pdf = await pdfjsforOnDrag.getDocument(url).promise;

            let promises = [];

            // Fetch dimensions for each page
            for (let i = 1; i <= pdf.numPages; i++) {
                promises.push(pdf.getPage(i).then(page => {
                    if (i == 1) {
                        width1 = page.getViewport({ scale: 1 }).width;
                        height1 = page.getViewport({ scale: 1 }).height;
                        setWidth(page.getViewport({ scale: 1 }).width);
                        setHeight(page.getViewport({ scale: 1 }).height);
                    }
                    return {
                        pageNumber: i,
                        width: page.getViewport({ scale: 1 }).width,
                        height: page.getViewport({ scale: 1 }).height
                    };
                }));
            }

            // Resolve all promises
            const pages = await Promise.all(promises);
            localPages = pages; // Assign pages to local variable

            // Store page dimensions in state or use as needed
            setPageDimensions(pages);

            // Iterate through the array and compare dimensions
            for (let i = 1; i < pages.length; i++) {
                if (pages.length != 1) {
                    if (pages[i].width !== pages[0].width ||
                        pages[i].height !== pages[0].height) {
                        equalPageDimensions1 = false;
                        setEqualPageDimensions(false);
                        break;
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching PDF dimensions:", error);
        }

        file.preview = window.URL.createObjectURL(new File([blob], `${fileName.split(".")[0]}.pdf`, {
            type: "application/pdf",
            lastModified: new Date(),
        }));
        setFiles1(file);
        setFileUrl(file.preview);

        let filedata = {
            files: file,
            height: height1,
            width: width1,
            csvFileRefNo: csvFileRefNo1,
            fileRefNo: fileRefNo1,
            pageDimensions: localPages,
            equalPageDimensions: equalPageDimensions1,
        };
        props.history.push({
            // pathname: "/multiPplSignPreview",
            pathname: "/preview",
            frompath: "/htmlPreview",
            state: {
                details: filedata,
            },
        });
    }

    return (
        <>
            <Loader
                loaded={loader}
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
            <div className='o1'>
                <div className='o2'>
                    <div className='greyBackGroud scrollbar'>
                        <div className='whitebackground'>
                            <div className='htmltext'>
                                {
                                    creatHtmlForm()
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='o4'>
                    <div className='form scrollbar' >
                        <div className='part2Css'>
                            <div className='mainHeading'>
                                <span>Fields From CSV File</span>
                            </div>
                            <div className='formcontroller'>
                                <form key="HTMLKEYSFORM">
                                    {
                                        console.log(analyzedDataTrue)
                                        
                                    }
                                    {
                                        analyzedDataTrue.map((data, index) => (
                                            <React.Fragment key={index}>
                                                <div key={data.key} className='oneLabelBox' style={{ marginBottom: "0px" }}>
                                                    <div className='form-Montroll' >
                                                        <input type='text' disabled={true} value={(data.key).substring(10, (data.key).length - 2)} id={index} className='input-Montroll' />
                                                    </div>
                                                    <div className='editFields'  >
                                                        <div className='editcss'>
                                                            <button type='button' className='proceedbtn' onClick={e => openModal(e, data.key, data.value)}>Edit</button>
                                                        </div>
                                                        <div className='tickMarkcss' >
                                                            <span key={data.key} id={`${data.key}Checked`} style={{ color: "green" }}></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ marginBottom: "10px" }}>
                                                    {
                                                        data.value ?
                                                            <>
                                                                <div style={{ width: "100%" }}><span style={{ marginRight: "5px", fontSize: "12px" }}>{"("}Field available in uploaded CSV file{")"}</span></div>
                                                            </> : <></>
                                                    }
                                                </div>
                                            </React.Fragment>
                                        ))
                                    }
                                </form>
                            </div>
                        </div>
                        <div className='finalProceedCss'>
                            <button className='proceedbtnX' type='button' onClick={e => finalProccedWithJson(e)}>Proceed {'\u2192'}</button>
                        </div>
                    </div >
                </div>
            </div >
            {
                allowmodal && (
                    <div className="custom-modal">
                        <div className="CustomModal-content ">
                            <span className="close" onClick={closeTheModal}>&times;</span>
                            {
                                editableField()
                            }
                        </div>
                    </div>
                )}
        </>
    )

}
export default HtmlPreview;