import React, { useState, useEffect } from "react";
import "./Template.css";
import { memo } from "react";
import $, { event } from "jquery";
import { URL } from "../URLConstant";
import _, { keys } from "lodash";
import { Tooltip } from "reactstrap";
import { confirmAlert } from "react-confirm-alert";
import UserDetailValidation from "./UserDetailValidation";
import Webcam from 'react-webcam';
import ReactCrop from 'react-image-crop';
import imageCompression from 'browser-image-compression';
import { FaCameraRotate } from 'react-icons/fa6';
import { BsCameraFill, BsLockFill } from 'react-icons/bs';
import { useRef } from "react";
import 'react-image-crop/dist/ReactCrop.css';
import 'bootstrap/js/dist/modal.js';
import '../AdminUploadTemplate/HtmlUpload.css';
import '../AdminTemplateApproval/AdminApr.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Typography } from "@material-ui/core";

var Loader = require("react-loader");

function NewTemplate(props) {

    const initialCropState = {
        unit: '%',
        x: 0,
        y: 0,
        width: 100,
        height: 95
    };

    // loader 
    const [allowLoader, setAllowLoader] = useState(false);

    // templateCode
    const [templateCode, setTemplateCode] = useState("");

    // templateName
    const [templateName, setTemplateName] = useState("");

    // mode of signature as defined 
    const [modeOfSignature, setModeOfSignature] = useState("");

    // used to store the custom field details..
    const [customFieldData, setCustomFieldData] = useState([]);

    // template form attachment details
    const [fileAttahments, setFileAttahments] = useState([]);

    //********************************** */ Select drop down..
    // to store the selectDropdown values which is only used to push to next page and vice versa..
    const [selectDrpDwn, setSelectDrpDwn] = useState({});
    //to render the selectDropDown to Client.
    const [selectDrpArray, setselectDrpArray] = useState([]);
    // to store the selectDrpDwn value and display in the template..
    const [selectDrpDwnVal, setSelectDrpDwnVal] = useState({});
    //********************************** */

    // to store boolean to render custom fields.
    const [allowForCus, setAllowForCus] = useState(false);

    // to set the page pathName..
    const [fromPath, setFromPath] = useState("");

    // to store the meta data.
    const [detail, setDetail] = useState({});

    // to store template draft reference number
    const [temptDrftRef, setTempDrftRef] = useState("");

    //*********************************** Template attachments
    const [templateForRendering, setTemplateForRendering] = useState([]);
    const [templateAttachmentForProcced, settemplateAttachmentForProcced] = useState([]);
    const [imageFileForSaveDraft, setimageFileForSaveDraft] = useState([]);
    const [imageFileForSaveDraftTwo, setimageFileForSaveDraftTwo] = useState([]);
    const [templateAttachmentForDraft, setTemplateAttachmentForDraft] = useState([]);
    //***********************************

    // prefilling of data to UI block boolean..
    const [isDataRender, setIsDataRender] = useState(false);

    // used for allowing a particluar if block to execute based on the boolean..
    const [renderFromOtherPage, setRenderFromOtherPage] = useState(false);

    // radio list
    const [radioButtonList, setRadioButtonList] = useState({});

    // checkBox list
    const [checkBoxList, setCheckedBoxList] = useState({});

    // template radio attachment to  
    const [tempRadioValidation, setTempRadioValidation] = useState([]);

    //camera capture feature
    const webcamRef = useRef(null);
    const [cameraIsOpen, setCameraIsOpen] = useState(false);
    const [captureData, setCaptureData] = useState(null);
    const [iterationId, setIterationId] = useState(0);
    const [capturedImageArray, setCaturedImageArray] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const [facingMode, setFacingMode] = useState('user');
    const [selectedOption, setSelectedOption] = useState('None');
    const [crop, setCrop] = useState(initialCropState);
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const [aspect, setAspect] = useState(null);

    // tool tip 
    const [tooltipOpen, setToolTipOpen] = useState(false);

    // used for allowing a particluar if block when datas are from server..
    const [allowDataToRenderThisPage, setAllowDataToRenderThisPage] = useState(false);

    // to store only entered value and used to render on the template..
    const [List, SetList] = useState({});

    // filled meta data
    const [ListMeta, SetListMeta] = useState({});

    // to store template attachment files when returned from template pdf preview.
    const [templateAttachment, setTemplateAttachment] = useState([]);

    // data to be sent for save draft..
    const [listForSaveDraft, setListForSaveDraft] = useState({});

    // used to store the custom field key and value to be sent to server..
    const [customFieldDetail, setCustomFieldDetail] = useState({});

    // to open modal
    const [allowModal, setAllowModal] = useState({
        // dynamicTable: false,
        inputModal: false,
        dropDownModal: false,
    });

    // to open repeat block modal..
    const [openReptBlock, setOpenReptBlock] = useState({
        openReptBlock1: false,
        allowTextArea: false
    });

    // to store the PDF preview pathName.
    const [toPathName, setToPathName] = useState("");

    // to control the collapse dropDown of all repeat blocks.
    const [repeatDrpDwn, setrepeatDrpDwn] = useState("");

    //to store the list of repeatable tags 
    const [repeatAbleBlock, setRepeatAbleBlock] = useState({});

    // holds the intial html file as it is recieved from server.
    const [htmlFileServer, setHTMLFileServer] = useState();

    // holds the input fields of ready from repetable block.
    const [reptBlockFields, setReptBlockFields] = useState({});

    // holds the default repeat content which has input fields in it.
    const [repetBlckOfInptField, setRepetBlckOfInptField] = useState({});

    // inputfield array which contains html input which are to be used in inputModal.
    const [inputFieldArrToModal, setInputFieldArrToModal] = useState({});

    // to store the eachInputName 
    const [htmlInputFieldKey, setHtmlInputFieldKey] = useState("");

    // to control the scroll of HTML 
    const [scrollControl, setScrollControl] = useState(false);

    // to store the eachInputName 
    const [htmlDrpDwnFieldKey, setHtmlDrpDwnFieldKey] = useState("");

    // holds the array values of the rept block to be edited..
    const [childNodeOfRptBlck, setChildNodeOfRptBlck] = useState([]);

    // stote the alered data of form.templateInputs..
    const [templateInputs, setTemplateInputs] = useState([]);

    // holds the index of which block the user has selected.
    const [initReptIndex, setInitReptIndex] = useState({});

    // data stored to save in saveDraft.
    const [reptDataToSveDraft, setReptDataToSveDraft] = useState({});

    // to store the defaut repeatAble blocks with inputs with in.
    const [reptBlckOfInputs, setReptBlckOfInputs] = useState({});

    const [appenedFormData, setAppenedFormData] = useState({
        boolean: false,
        type: ""
    });

    const [repeatContentUpdateHTML, setRepeatContentUpdateHTML] = useState();

    // holds the name of the blockName on which we currently we work.
    const [intFld, setIntFld] = useState({
        intFldKey: "",
        intFldIndex: 0,
        operationFlag: false,
        TempateInputIndex: 0
    });

    // holds the HTML String 
    const [form, setForm] = useState({
        status: "",
        tempCode: "",
        HtmlBase64String: "",
        templateInputs: [],
        templateDescription: "",
    });

    var monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];


    useEffect(() => { //  useEffect to assign the function calls when user clicks on the Input on HTML Template.
        templateInputs.forEach((inputs, index) => {
            if (Object.keys(inputs).length === 1) {  // if the size of key is 1, then it indicates it is a repeatAble block inputs..
                let templateInputs = inputs[Object.keys(inputs)[0]];
                for (let keyz in templateInputs) {
                    let inputArray = templateInputs[keyz];
                    inputArray.forEach(item => {
                        let id = document.getElementById(item["inputField"]);
                        if (id !== null && item.editable !== 0) { // DOM element loading may delay, so add check validation that it is not NULL.
                            id.onclick = event => openmodalForRepeatBlck(event, Object.keys(inputs)[0], keyz, index); // assigning function call on Onclick of input by end users.
                        };
                    });
                }
            }
            else { // independent inputs are called for newInputField().
                let id = document.getElementById(inputs.inputField);
                if (id !== null && inputs.editable !== 0) {
                    id.onclick = newInputField;
                };
            };
        });

        for (let key in selectDrpDwn) { // onclick feature for select dropDown..
            let id = document.getElementById(`#$Drp_${key}#$Template`);
            if (id !== null) {
                id.onclick = selectDrpDwnModal;
            }
        }
    });

    useEffect(() => { // useEffect to scroll the HTML form to particular repeatBlock selected.
        if (!(document.getElementById('scrollToreptBlk') === null)) {
            const container = document.getElementById('ScrollBarX'); // Main scroll Element.
            const element = document.getElementById('scrollToreptBlk'); // to be scrolled Element. 
            const containerRect = container.getBoundingClientRect();
            const elementRect = element.getBoundingClientRect();
            // Calculate the top offset
            const offset = elementRect.top - containerRect.top + container.scrollTop;
            // Calculate the position to scroll to so that the element is at 25% from the top of the container
            const scrollToPosition = offset - (container.clientHeight * 0.25) + (elementRect.height / 2);
            container.scroll({
                top: scrollToPosition,
                behavior: 'smooth'
            });
        }
    }, [scrollControl]);

    // To fetch the data from server as well as to reassign the values 
    //when page is returned from edit details.
    // to detect on when device the user is working..
    useEffect(() => {
        // Detect if the device is mobile based on the user agent string
        const checkIsMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsMobile(checkIsMobile);
        // from template PDF preview page.
        if (props.location.frompath === "/draftTemplates" || props.location.frompath === "/templatePdfPreview") {
            const url = URL.getTemplateInputs;
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    authToken: sessionStorage.getItem("authToken"),
                    templateCode: props.location.state.templateCode,
                }),
            };

            fetch(url, options)
                .then((response) => response.json())
                .then((responsedata) => {
                    if (responsedata.status === "SUCCESS") {
                        // converting HTML string to a DOM..
                        let count = 0;
                        let reptBlckInutSvdDraft = props.location.state.reptDataToSveDraft;
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(atob(responsedata.HtmlBase64String), 'text/html');
                        const tableExists = doc.body.querySelectorAll("table"); // fetching tables from the HTML.
                        const lines = atob(responsedata.HtmlBase64String).split('\n'); // spliting based on next line.
                        let StringHTML = atob(responsedata.HtmlBase64String);
                        const dfaultContentOfReptBlck = [];
                        let isCollecting = false;
                        let isCommentCollecting = false;
                        let collectedContent = '';
                        let commentCollectedContent = '';
                        lines.forEach(line => {
                            line = line.trim();
                            // Check for <repeatTag>
                            if (line.includes('<repeattag>')) {
                                isCollecting = true;
                                collectedContent = '';
                                collectedContent += line.split("<repeattag>")[1];
                            } else if (line.includes('</repeattag>')) {
                                isCollecting = false;
                                collectedContent += line.split("</repeattag>")[0];
                                const div = document.createElement("div");
                                div.setAttribute('style', "background-color: #ddecf9; border-radius: 5px;"); // setting of backGround color for repeatAble blocks.
                                div.setAttribute('title', "Repeatable Block!");
                                const replacedStr = collectedContent.toString().replace(/@@repeatTag\d+@@/g, ""); // removal of @@repeatTag@@ key before insertion
                                div.innerHTML = replacedStr.toString();
                                StringHTML = StringHTML.replace(replacedStr, div.outerHTML);
                                div.removeAttribute("style"); // removing style and title before adding to dfaultContentOfReptBlck
                                div.removeAttribute("title");
                                dfaultContentOfReptBlck.push(div);
                                collectedContent = '';
                            } else if (isCollecting) {
                                collectedContent += line;
                            }

                            // Check for commented <!--<repeatTag>-->
                            if (line.includes('<!--<repeatTag>-->')) {
                                isCommentCollecting = true;
                                commentCollectedContent = '';
                                commentCollectedContent += line.split("<!--<repeatTag>-->")[1];
                            } else if (line.includes('<!--</repeatTag>-->')) {
                                isCommentCollecting = false;
                                commentCollectedContent += line.split("<!--</repeatTag>-->")[0];
                                dfaultContentOfReptBlck.push(commentCollectedContent.toString());
                                commentCollectedContent = '';
                            } else if (isCommentCollecting) {
                                commentCollectedContent += line;
                            }
                        });

                        setRepeatContentUpdateHTML(dfaultContentOfReptBlck);// storing the dfaultContentOfReptBlck variable to be used in updateHTML();
                        dfaultContentOfReptBlck.forEach((data, index) => {
                            let isItTable = ""; // holds JSON for commented repeat tag and string for repeat tag element.
                            let keysArray = "";
                            let filteredData = "";
                            if (typeof data === "string") {  // checking the data, if data is string it is considered as commented repeatTag.
                                let count = 0;
                                for (let key in tableExists) {
                                    if (!isNaN(key)) {
                                        // Step 2: Create a regular expression to match the content inside <repeatTag>
                                        const repeatTagRegex = /<!--<repeatTag>-->([\s\S]*?)<!--<\/repeatTag>-->/g;
                                        // Step 3: Use the matchAll method to find all matches
                                        const matches = [...tableExists[key].outerHTML.matchAll(repeatTagRegex)];
                                        // get all the contents inside the commented repeatTag.
                                        const contentArray = matches.map(match => match[1].trim());
                                        // comparing the data 
                                        if (contentArray.length !== 0 && data.trim().replace(/\s+/g, '') === (contentArray[0].trim()).replace(/\s+/g, '')) {
                                            isItTable = { "tableNumber": count, "defaultData": data };
                                        };
                                        count++;
                                    };
                                };
                                keysArray = findInputKeys(data);
                                filteredData = keysArray.map(data => data.split("{{")[1].split("}}")[0].split(".")[1]); // converting {{jsonObj.key}} to 'key'
                            }
                            else { // else it is content from repeat Tag element.
                                isItTable = data.outerHTML; // converting DOM element to string.
                                keysArray = findInputKeys(data.outerHTML);
                                filteredData = keysArray.map(data => data.split("{{")[1].split("}}")[0].split(".")[1]);
                            };
                            setInitReptIndex(oldvalue => ({ // index starts from 0 so increasing the one Index further.
                                ...oldvalue,
                                [`Repeatable Block ${Number(index) + 1}`]: 0
                            }));
                            if (!(keysArray.length === 0)) { // keysArray.length indicates the repeatTag content doesn't contain any inputs..
                                let inputFields = [];
                                // iteraing the input fields arrays one by one providing [] for each input
                                for (let key in filteredData) {
                                    inputFields.push(filteredData[key]);
                                };
                                setReptBlockFields(oldvalue => ({
                                    ...oldvalue,
                                    [`Repeatable Block ${Number(index) + 1}`]: inputFields
                                }));
                                setReptBlckOfInputs(oldvalue => ({
                                    ...oldvalue,
                                    [`Repeatable Block ${Number(index) + 1}`]: [isItTable]
                                }));

                                // setting default repeatAble content first..
                                let defaultContentArray = [isItTable];
                                // based on Repeatable Block key get all repeated inputs [[city1, No1],[City2,No2],[City3,No3]]
                                for (let key in reptBlckInutSvdDraft[`Repeatable Block ${Number(index) + 1}`]) {
                                    let defaultContent = "";
                                    if (typeof isItTable === "object") {
                                        defaultContent = isItTable["defaultData"]; // for commented repeatTag pick the default content from JSON;
                                    } else {
                                        defaultContent = isItTable; // for repeatTag element just the string.
                                    }
                                    // iterating each repeated inputs [city1, No1].
                                    for (let keyz in reptBlckInutSvdDraft[`Repeatable Block ${Number(index) + 1}`][key]) {
                                        // repalacing original city and No with city1 and No1, and creating a another repeated block.
                                        defaultContent = defaultContent.replace(keysArray[keyz], `{{jsonObj.${reptBlckInutSvdDraft[`Repeatable Block ${Number(index) + 1}`][key][keyz]}}}`);
                                    };
                                    defaultContentArray.push(defaultContent); // addition of new repeated block created based on repeated inpust [city1, No1]
                                };
                                setRepetBlckOfInptField(oldvalue => ({
                                    ...oldvalue,
                                    [`Repeatable Block ${Number(index) + 1}`]: defaultContentArray
                                }));
                            };
                        });

                        // converting the template inputs received from server in to new rendering format 
                        /*server format - [{Rb1:[{inputs},{inputs}]},{inputs},{Rb2:[{inputs},{inputs}]},{inputs}];
                          creating format - [{RB1:{0:[{inputs},{inputs}],1:[{inputs},{inputs}]}},{inputs},{inputs}]  ---> here 0,1 inside RB1 indicates 0 as default inputs, 1 is a repeated inputs*/
                        let templateInptMainArray = [];
                        const templateInputServer = JSON.parse(JSON.stringify(responsedata.templateInputs)); // deep copying procedure..
                        for (let Mainkey in templateInputServer) {
                            if (Object.keys(templateInputServer[Mainkey]).length === 1) { //if JSON is having single key it indicates those are the inputs present inside the repeatAble block..
                                let inptData = JSON.parse(JSON.stringify(templateInputServer[Mainkey][Object.keys(templateInputServer[Mainkey])[0]])); // deep copying procedure..
                                let count = 0;
                                let innerReptData = {};
                                if (reptBlckInutSvdDraft[Object.keys(templateInputServer[Mainkey])[0]].length !== 0) {  // if repeatd inputs contains [[city1,No1],[city2,No2]], then for each [city1,No1] array add template inputs.
                                    innerReptData[count] = inptData; // adding of default index 0's inputs.
                                    count++;
                                    let repetInputsArray = reptBlckInutSvdDraft[Object.keys(templateInputServer[Mainkey])[0]]; // getting  repeated inputs [[city1,No1],[city2,No2]]
                                    // iterate the repetInputsArray 
                                    for (let key in repetInputsArray) { //[city1,No1]
                                        let inptArryData = [];
                                        for (let keyz in repetInputsArray[key]) {
                                            let eachInputs = JSON.parse(JSON.stringify(inptData[keyz]));  // default template inputs  
                                            eachInputs["inputField"] = repetInputsArray[key][keyz]; //changing default city inputField key to city1.
                                            inptArryData.push(eachInputs); // adding changed inputField key inputs keeping other data inside as it is.
                                        };
                                        innerReptData[count] = inptArryData; // {{1:[{},{}]}}
                                        count++;
                                    };
                                    // pushing data to templateInptMainArray variable.
                                    templateInptMainArray.push({ [Object.keys(templateInputServer[Mainkey])[0]]: innerReptData });
                                    count++;
                                } else { // repeated inputs contains [] empty just pushing the data [{RB1:{0:[inputs],[inputs]}}]
                                    innerReptData[count] = inptData;
                                    templateInptMainArray.push({ [Object.keys(templateInputServer[Mainkey])[0]]: innerReptData });
                                }
                            }
                            else { // individual data is assigned directly.
                                templateInptMainArray.push(templateInputServer[Mainkey]);
                            };
                        };
                        setTemplateInputs(templateInptMainArray);

                        for (let key in responsedata.selectDropdown) {
                            let drpDwnKey = Object.keys(responsedata.selectDropdown[key])[0];
                            let drpDwnValue = responsedata.selectDropdown[key][Object.keys(responsedata.selectDropdown[key])[0]];
                            setselectDrpArray(oldvalue => ([
                                ...oldvalue,
                                { [drpDwnKey]: drpDwnValue }]
                            ));
                            setSelectDrpDwn((oldvalue) => ({
                                ...oldvalue,
                                [drpDwnKey]: drpDwnValue
                            }));
                        }

                        // fetch API call will recieve customFeildInputs, which is for both end-user and system-users, even tho only end-user data are 
                        // only displayed for end-user.
                        // checking weather atleast one of the data is for end-user, so we can control of displaying the custom fields block. 
                        for (let key in responsedata.customFeildInputs) {
                            if (responsedata.customFeildInputs[key].tobefilledby === 0) {
                                setAllowForCus(true);
                                break;
                            }
                        };

                        // deep copying..
                        let resposedata = { ...responsedata };
                        setForm({
                            HtmlBase64String: btoa(StringHTML),
                            status: resposedata.status,
                            tempCode: resposedata.tempCode,
                            templateDescription: resposedata.templateDescription,
                            templateInputs: resposedata.templateInputs
                        });
                        setHTMLFileServer(btoa(StringHTML));
                        setTempRadioValidation(responsedata.templateRadioInputs);
                        setModeOfSignature(responsedata.modeOfSignature);
                        setCustomFieldData(responsedata.customFeildInputs);
                        setFileAttahments(responsedata.templateAttachmentList);
                        setDetail(props.location.state.userDetails);
                        setTemplateCode(props.location.state.templateCode);
                        setTemplateName(props.location.state.templateName);
                        setTemplateAttachment(props.location.state.templateAttachments);
                        setTempDrftRef(props.location.state.temptDrftRef);
                        setToPathName(props.location.state.toPathName);
                        setReptDataToSveDraft(props.location.state.reptDataToSveDraft);
                        setRepeatAbleBlock(props.location.state.repeatAbleBlck);
                        setFromPath(props.location.pathname);
                        setTemplateForRendering(props.location.state.templateAttachments);
                        setAllowLoader(true);
                        setRenderFromOtherPage(true);
                    }
                    else if (responsedata.statusDetails === "KYC not verified") {
                        confirmAlert({
                            message: "KYC should be verified to use this template!",
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        props.history.push("/templates");
                                    },
                                },
                            ], closeOnClickOutside: false,
                        });
                    }
                    else if (responsedata.statusDetails === "Session Expired!!") {
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
                        confirmAlertFunction(responsedata.statusDetails);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    confirmAlertFunction(`SomeThing Went Wrong PLease Try Again`);
                });

        }
        // for the first fetch call when page renders...
        else {
            let templateCode = "";
            // check for templateCode..
            if (props.location.state !== undefined) {
                templateCode = props.location.state.templateCode
            };
            setToPathName("/templatePdfPreview");
            const url = URL.getTemplateInputs;
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    authToken: sessionStorage.getItem("authToken"),
                    templateCode: templateCode,
                }),
            };

            fetch(url, options)
                .then((response) => response.json())
                .then((responsedata) => {
                    if (responsedata.status === "SUCCESS") {
                        if (responsedata.hasOwnProperty("tempDataInDrft")) {
                            confirmAlert({
                                title: "Templates",
                                message: "This template data was saved earlier! please select 'Draft saved' to continue or go with the 'New template'.",
                                buttons: [
                                    {
                                        label: "Draft saved",
                                        className: "confirmBtn",
                                        onClick: () => {
                                            props.history.push({
                                                pathname: "/draftForms",
                                            });
                                        }
                                    },
                                    {
                                        label: "New template",
                                        className: "confirmBtn",
                                        onClick: () => { }
                                    },
                                ], closeOnClickOutside: false, // Set to false to prevent closing on click outside
                            });
                        }

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(atob(responsedata.HtmlBase64String), 'text/html');
                        const tableExists = doc.body.querySelectorAll("table");
                        const lines = atob(responsedata.HtmlBase64String).split('\n');
                        let StringHTML = atob(responsedata.HtmlBase64String);
                        const dfaultContentOfReptBlck = [];
                        let isCollecting = false;
                        let isCommentCollecting = false;
                        let collectedContent = '';
                        let commentCollectedContent = '';
                        lines.forEach(line => {
                            line = line.trim();
                            // Check for <repeatTag>
                            if (line.includes('<repeattag>')) {
                                isCollecting = true;
                                collectedContent = '';
                                collectedContent += line.split("<repeattag>")[1]; // collect content after the <repeatTag>
                            } else if (line.includes('</repeattag>')) {
                                isCollecting = false;
                                collectedContent += line.split("</repeattag>")[0];  // collect content before the <repeatTag>
                                const div = document.createElement("div");
                                div.setAttribute('style', "background-color: #ddecf9; border-radius: 5px;"); // setting of backGround color for repeatAble blocks.
                                div.setAttribute('title', "Repeatable Block!")
                                const replacedStr = collectedContent.toString().replace(/@@repeatTag\d+@@/g, "");
                                div.innerHTML = replacedStr.toString();
                                StringHTML = StringHTML.replace(replacedStr, div.outerHTML);
                                div.removeAttribute("style"); // removing style and title before adding to dfaultContentOfReptBlck
                                div.removeAttribute("title");
                                dfaultContentOfReptBlck.push(div);
                                collectedContent = '';
                            } else if (isCollecting) {
                                collectedContent += line;
                            }

                            // Check for commented <repeatTag>
                            if (line.includes('<!--<repeatTag>-->')) {
                                isCommentCollecting = true;
                                commentCollectedContent = '';
                                commentCollectedContent += line.split("<!--<repeatTag>-->")[1];
                            } else if (line.includes('<!--</repeatTag>-->')) {
                                isCommentCollecting = false;
                                commentCollectedContent += line.split("<!--</repeatTag>-->")[0];
                                dfaultContentOfReptBlck.push(commentCollectedContent.toString());
                                commentCollectedContent = '';
                            } else if (isCommentCollecting) {
                                commentCollectedContent += line;
                            }
                        });
                        setRepeatContentUpdateHTML(dfaultContentOfReptBlck);// storing the dfaultContentOfReptBlck variable to be used in updateHTML();
                        // iterating the dfaultContentOfReptBlck and assigning to state variables.
                        dfaultContentOfReptBlck.forEach((data, index) => {
                            let isItTable = "";
                            let keysArray = "";
                            let filteredData = "";
                            // checking the data, if data is string it is considered as table.
                            if (typeof data === "string") { // to read the input fields in the repeatable block..
                                let count = 0;
                                // iterate the tables and fetch there ID's.
                                for (let key in tableExists) {
                                    if (!isNaN(key)) {
                                        // Step 2: Create a regular expression to match the content inside <repeatTag>
                                        const repeatTagRegex = /<!--<repeatTag>-->([\s\S]*?)<!--<\/repeatTag>-->/g;
                                        // Step 3: Use the matchAll method to find all matches
                                        const matches = [...tableExists[key].outerHTML.matchAll(repeatTagRegex)];
                                        // get all the contents inside the commented repeatTag.
                                        const contentArray = matches.map(match => match[1].trim());
                                        // comparing the data 
                                        if (contentArray.length !== 0 && data.trim().replace(/\s+/g, '') === (contentArray[0].trim()).replace(/\s+/g, '')) {
                                            isItTable = { "tableNumber": count, "defaultData": data };
                                            let replaceingTable = tableExists[key].outerHTML;
                                            let table = tableExists[key];
                                            const nodes = Array.from(table.querySelector("tbody").childNodes);
                                            let insideRepeatTag = false;
                                            nodes.forEach(node => {
                                                if (node.nodeType === Node.COMMENT_NODE && node.nodeValue.trim() === '<repeatTag>') {
                                                    insideRepeatTag = true;
                                                } else if (node.nodeType === Node.COMMENT_NODE && node.nodeValue.trim() === '</repeatTag>') {
                                                    insideRepeatTag = false;
                                                } else if (insideRepeatTag && node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TR') {
                                                    node.setAttribute("style", `${node.getAttribute('style')}; background-color: #ddecf9; border-radius:5px`);
                                                }
                                            });
                                            StringHTML = StringHTML.replace(replaceingTable, table.outerHTML);
                                        };
                                        count++;
                                    };
                                };
                                keysArray = findInputKeys(data);
                                filteredData = keysArray.map(data => data.split("{{")[1].split("}}")[0].split(".")[1]);
                            }
                            else { // else it is content from repeat Tag.
                                isItTable = data.outerHTML; // converting DOM element to string.
                                keysArray = findInputKeys(data.outerHTML);
                                filteredData = keysArray.map(data => data.split("{{")[1].split("}}")[0].split(".")[1]);
                            }
                            setrepeatDrpDwn(oldvalue => ({
                                ...oldvalue,
                                [`Repeatable Block ${Number(index) + 1}`]: false
                            }));
                            setReptDataToSveDraft(oldvalue => ({
                                ...oldvalue,
                                [`Repeatable Block ${Number(index) + 1}`]: []
                            }));
                            setInitReptIndex(oldvalue => ({
                                ...oldvalue,
                                [`Repeatable Block ${Number(index) + 1}`]: 0
                            }));
                            if (keysArray.length === 0) {
                                setRepeatAbleBlock(oldvalue => ({
                                    ...oldvalue,
                                    [`Repeatable Block ${Number(index) + 1}`]: [isItTable]
                                }));
                            }
                            else {
                                setReptBlckOfInputs(oldvalue => ({
                                    ...oldvalue,
                                    [`Repeatable Block ${Number(index) + 1}`]: [isItTable]
                                }));
                                // adding the repeat blocks which has input fields in it.
                                setRepetBlckOfInptField(oldvalue => ({
                                    ...oldvalue,
                                    [`Repeatable Block ${Number(index) + 1}`]: [isItTable]
                                }));
                                setReptBlockFields(oldvalue => {
                                    let inputFields = [];
                                    // iteraing the input fields arrays one by one providing [] for each input
                                    for (let key in filteredData) {
                                        inputFields.push(filteredData[key]);
                                    }
                                    return {
                                        ...oldvalue,
                                        [`Repeatable Block ${Number(index) + 1}`]: inputFields
                                    }
                                });
                            }
                        });

                        for (let key in responsedata.selectDropdown) {
                            let drpDwnKey = Object.keys(responsedata.selectDropdown[key])[0];
                            let drpDwnValue = responsedata.selectDropdown[key][Object.keys(responsedata.selectDropdown[key])[0]];
                            setselectDrpArray(oldvalue => ([
                                ...oldvalue,
                                { [drpDwnKey]: drpDwnValue }]
                            ));
                            setSelectDrpDwnVal(oldvalue => ({
                                ...oldvalue,
                                [`#$Drp_${drpDwnKey}#$`]: drpDwnKey
                            }));
                            setSelectDrpDwn((oldvalue) => ({
                                ...oldvalue,
                                [drpDwnKey]: drpDwnValue
                            }));
                        };

                        // fetch API call will recieve customFeildInputs, which is for both end-user and system-users, even tho only end-user data are 
                        // only displayed for end-user.
                        // checking weather atleast one of the data is for end-user, so we can control of displaying the custom fields block. 
                        for (let key in responsedata.customFeildInputs) {
                            if (responsedata.customFeildInputs[key].tobefilledby === 0) {
                                setAllowForCus(true);
                                break;
                            }
                        };

                        // converting the template inputs received from server in to new rendering format 
                        /*server format - [{Rb1:[{inputs},{inputs}]},{inputs},{Rb2:[{inputs},{inputs}]},{inputs}];
                          creating format - [{RB1:{0:[{inputs},{inputs}],1:[{inputs},{inputs}]}},{inputs},{inputs}]  ---> here 0,1 inside RB1 indicates 0 as default inputs, 1 is a repeated inputs*/                        let templateInptMainArray = [];
                        for (let key in responsedata.templateInputs) {
                            // check whether the data is repeatAble.
                            if (Object.keys(responsedata.templateInputs[key]).length === 1) {
                                let innerReptData = {};
                                let outerReptData = {};
                                innerReptData[0] = responsedata.templateInputs[key][Object.keys(responsedata.templateInputs[key])[0]];
                                outerReptData[Object.keys(responsedata.templateInputs[key])[0]] = innerReptData;
                                templateInptMainArray.push(outerReptData);

                            }
                            else {
                                templateInptMainArray.push(responsedata.templateInputs[key]);
                            }
                        };
                        setTemplateInputs(templateInptMainArray);
                        setForm({
                            HtmlBase64String: btoa(StringHTML),
                            status: responsedata.status,
                            tempCode: responsedata.tempCode,
                            templateDescription: responsedata.templateDescription,
                            templateInputs: responsedata.templateInputs
                        });
                        setHTMLFileServer(btoa(StringHTML));
                        setTempRadioValidation(responsedata.templateRadioInputs);
                        setModeOfSignature(responsedata.modeOfSignature);
                        setCustomFieldData(responsedata.customFeildInputs);
                        setFileAttahments(responsedata.templateAttachmentList);
                        setTemplateName(props.location.state.templateName);
                        setTemplateCode(props.location.state.templateCode);
                        setFromPath(props.location.pathname);
                        setAllowDataToRenderThisPage(true);
                    }
                    else if (responsedata.statusDetails === "KYC not verified") {
                        confirmAlert({
                            message: "KYC should be verified to use this template!",
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        props.history.push("/templates");
                                    },
                                },
                            ], closeOnClickOutside: false,
                        });
                    }
                    else if (responsedata.statusDetails === "Session Expired!!") {
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
                        confirmAlertFunction(responsedata.statusDetails);
                    }
                })
                .catch((error) => {
                    console.log(error);
                    confirmAlertFunction(`SomeThing Went Wrong PLease Try Again`);
                });
            setAllowLoader(true);
        }
    }, []);

    // to reassign the check/ticks on template every time when render returns..
    useEffect(() => {
        for (let key in radioButtonList) {
            document.getElementById(key).checked = radioButtonList[key];
        }
        for (let key in checkBoxList) {
            document.getElementById(key).checked = checkBoxList[key];
        }
    }, [radioButtonList, checkBoxList]);

    // allowed when its success, returned from server..
    useEffect(() => {
        if (allowDataToRenderThisPage) {
            setAllowLoader(false);
            form.templateInputs.map((pst) => {
                // form.templateInputs structure changes because of addition of repeatAble blocks
                // checking whether each jsonObject has a single key. single key indicates its a repeatable block
                if (Object.keys(pst).length === 1) {
                    pst[Object.keys(pst)[0]].map((innerPst) => {
                        const input1 = innerPst.inputField;
                        SetList((oldvalue) => ({
                            ...oldvalue,
                            [`${input1}`]: input1,
                        }));
                        SetListMeta((oldvalue) => ({
                            ...oldvalue,
                            [`${input1}`]: { value: input1, dataType: innerPst.inputDataType }
                        }))
                        setListForSaveDraft((oldvalue) => ({
                            ...oldvalue,
                            [`${input1}`]: { value: input1, dataType: innerPst.inputDataType }
                        }));
                        // template inputs storing in different manner.
                        setInputFieldArrToModal(oldvalue => ({
                            ...oldvalue,
                            [input1]: innerPst
                        }));
                    })
                } else {
                    const input1 = pst.inputField;
                    SetList((oldvalue) => ({
                        ...oldvalue,
                        [`${input1}`]: input1,
                    }));
                    SetListMeta((oldvalue) => ({
                        ...oldvalue,
                        [`${input1}`]: { value: input1, dataType: pst.inputDataType }
                    }))
                    setListForSaveDraft((oldvalue) => ({
                        ...oldvalue,
                        [`${input1}`]: { value: input1, dataType: pst.inputDataType }
                    }));
                    // template inputs storing in different manner.
                    setInputFieldArrToModal(oldvalue => ({
                        ...oldvalue,
                        [input1]: pst
                    }));
                }
            });

            for (let key in customFieldData) {
                setCustomFieldDetail(oldvalue => ({
                    ...oldvalue,
                    [`${customFieldData[key].inputField}`]: { value: '', dataType: customFieldData[key].inputDataType, customField: true, filledBy: customFieldData[key].tobefilledby }
                }))
            }
            setAllowLoader(true);
            setAllowDataToRenderThisPage(false);
        }
    }, [allowDataToRenderThisPage])

    // allowed when page is returned from previous page..
    // and append values to above declared useStates..
    useEffect(() => {
        if (renderFromOtherPage) {
            setAllowLoader(false);
            for (let key in detail) {
                let userValue = "";
                if (detail[key].value.includes("_____") && Object.keys(detail[key]).length !== 4) {
                    userValue = key;
                }
                else {
                    userValue = detail[key].value;
                    if (detail[key].value.includes("-Jan-") || detail[key].value.includes("-Feb-") || detail[key].value.includes("-Mar-") || detail[key].value.includes("-Apr-") || detail[key].value.includes("-May-") ||
                        detail[key].value.includes("-Jun-") || detail[key].value.includes("-Jul-") || detail[key].value.includes("-Aug-") || detail[key].value.includes("-Sep-") || detail[key].value.includes("-Oct-") || detail[key].value.includes("-Nov-") || detail[key].value.includes("-Dec-")) {
                        let formattedDate = convertDateFormate(detail[key].value);
                        document.getElementById(`${key}FrmInptField`).value = formattedDate;
                    };
                }
                if (Object.keys(detail[key]).length === 4) {
                    setCustomFieldDetail(oldvalue => ({
                        ...oldvalue,
                        [`${key}`]: { value: detail[key].value, dataType: detail[key].dataType, customField: detail[key].customField, filledBy: detail[key].filledBy }
                    }))
                }
                else {
                    if (key.startsWith("#$Drp_")) {
                        // the value is ______ which indicates user has not entered any value, if so adding the key as a value.
                        setSelectDrpDwnVal(oldvalue => ({
                            ...oldvalue,
                            [key]: detail[key].value === "__________" ? key.substring(6, key.length - 2) : detail[key].value
                        }));
                    }
                    else if (!key.includes("$$")) {
                        // metaData
                        SetListMeta(oldvalue => ({
                            ...oldvalue,
                            [key]: { value: detail[key].value, dataType: detail[key].dataType }
                        }));
                        // data for save draft
                        setListForSaveDraft((oldvalue) => ({
                            ...oldvalue,
                            [key]: { value: detail[key].value, dataType: detail[key].dataType },
                        }));
                        // data to render in HTML form
                        SetList((oldvalue) => ({
                            ...oldvalue,
                            [key]: userValue,
                        }));
                    }
                }
            }
            // to assign the inputValidation for the setInputFieldArrToModal.
            form.templateInputs.forEach((inputs, index) => {
                //checking the inputs length.
                if (Object.keys(inputs).length === 1) {
                    let templateInputs = inputs[Object.keys(inputs)[0]];
                    //iterate the templateInputs.
                    for (let key in templateInputs) {
                        setInputFieldArrToModal(oldvalue => ({
                            ...oldvalue,
                            [templateInputs[key].inputField]: templateInputs[key]
                        }))
                    };
                } else {
                    setInputFieldArrToModal(oldvalue => ({
                        ...oldvalue,
                        [inputs.inputField]: inputs
                    }))
                }
            });
            setRenderFromOtherPage(false);
            setIsDataRender(true);
            setAllowLoader(true);
        }
    }, [renderFromOtherPage]);

    // Below useEffect is executed when a page is returned from edit details..
    // used to append value in input forms..
    useEffect(() => {
        if (isDataRender) {
            setAllowLoader(false);
            for (let key in detail) {
                // Template input fields..
                if (!key.includes("$$") && !key.includes("##") && !key.includes("#$Drp_")) {
                    if (detail[key].value.includes("-Jan-") || detail[key].value.includes("-Feb-") || detail[key].value.includes("-Mar-") || detail[key].value.includes("-Apr-") || detail[key].value.includes("-May-") ||
                        detail[key].value.includes("-Jun-") || detail[key].value.includes("-Jul-") || detail[key].value.includes("-Aug-") || detail[key].value.includes("-Sep-") || detail[key].value.includes("-Oct-") || detail[key].value.includes("-Nov-") || detail[key].value.includes("-Dec-")) {
                        let formattedDate = convertDateFormate(detail[key].value);
                        if (detail[key].hasOwnProperty("filledBy")) { //filledBy key is present only for the custom fields.
                            if (detail[key].filledBy !== 1) { // 0 indicates for end user and 1 for system user.
                                document.getElementById(`${key}cusFrmInptField`).value = formattedDate;
                            }
                        } else {
                            document.getElementById(`${key}FrmInptField`).value = formattedDate;
                        }
                    }
                    else {
                        if (detail[key].hasOwnProperty("filledBy")) {
                            if (detail[key].filledBy !== 1) {
                                document.getElementById(`${key}cusFrmInptField`).value = detail[key].value;
                            }
                        }
                    };
                }
                //radio and checkboxes.
                else if (key.includes("$$")) {
                    document.getElementById(key).checked = detail[key].value === "checked" ? true : false;
                }
                //select dropdowns..
                else if (key.includes("#$Drp_")) {
                    if (detail[key].value !== "__________") {
                        document.getElementById(key.substring(6, key.length - 2)).value = detail[key].value;
                    } else {
                        continue;
                    }
                }
                // to template attachments..
                else {
                    for (let attchmentkey in templateAttachment) {
                        if (templateAttachment[attchmentkey].attachmentKey === key) {
                            if (String(templateAttachment[attchmentkey].isAvailableInSvr) === "1") {
                                let file = new File([], `${templateAttachment[attchmentkey].attmntFileName}`, { type: `${templateAttachment[attchmentkey].attachmentType}` });
                                let filenput = document.getElementById(key);
                                document.getElementById(key).name = "isAvailableInSvr";
                                let list = new DataTransfer();
                                list.items.add(file);
                                let myFileList = list.files;
                                filenput.files = myFileList;
                                document.getElementById(`${key}1`).innerHTML = "Attachment Uploaded";
                                document.getElementById(`${key}1`).style.backgroundColor = "#ffc65e";
                            } else {

                                let base64 = templateAttachment[attchmentkey].attachmentData;
                                let byteString = atob(base64.split(",")[1]);
                                let mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
                                let ab = new ArrayBuffer(byteString.length);
                                let ia = new Uint8Array(ab);
                                for (var i = 0; i < byteString.length; i++) {
                                    ia[i] = byteString.charCodeAt(i);
                                }
                                let file = new File(
                                    [ab],
                                    `${templateAttachment[attchmentkey].attmntFileName}`,
                                    { type: mimeString }
                                );
                                let filenput = document.getElementById(key);
                                let list = new DataTransfer();
                                list.items.add(file);
                                let myFileList = list.files;
                                filenput.files = myFileList;
                                document.getElementById(`${key}1`).innerHTML =
                                    "Attachment Uploaded";
                                document.getElementById(`${key}1`).style.backgroundColor =
                                    "#ffc65e";
                            }
                        }
                    }
                }
            }
            // updateHTML function is called if there are any repeated blocks to be get appended to HTML and render to users.
            updateHTML("");
            setAllowLoader(true);
        }
    }, [isDataRender]);

    // Below useEffect is used to attach the values to the below template form.
    // because the data related to repeatTag is deleted the old data is remained due to DOM using old values based on ID's.
    useEffect(() => {
        if (appenedFormData.boolean) {
            templateInputs.forEach((inputs, index) => {
                //checking the inputs length.
                if (Object.keys(inputs).length === 1) {
                    let templateInputs = inputs[Object.keys(inputs)[0]];
                    //iterate the templateInputs.
                    for (let key in templateInputs) {
                        let inputArray = templateInputs[key];
                        inputArray.forEach(item => {
                            // check if the value is similar to key
                            // if it is key do not append.
                            if (!(List[item["inputField"]] === item["inputField"])) {
                                document.getElementById(`${item["inputField"]}FrmInptField`).value = List[item["inputField"]];
                            }
                        });
                    };
                } else {
                    // check if the value is similar to key
                    // if it is key do not append.
                    if (!(List[inputs["inputField"]] === inputs["inputField"])) {
                        document.getElementById(`${inputs["inputField"]}FrmInptField`).value = List[inputs["inputField"]];
                    }
                }
            });
            //based on the value of type variable deciding the message either update or deletion.
            if (appenedFormData.type === "edit") {
                toast.success("Data updated!", { autoClose: 1000 });
            } else {
                toast.error("Block deleted!", { autoClose: 1000 });
            }
            setAppenedFormData({
                boolean: false,
                type: ""
            });
        }
    }, [appenedFormData]);


    /*------------------------Comman used FUNCATIONS-------------------------------------*/
    // input field modal close
    const closeTheModal = () => {
        setAllowModal({
            inputModal: false,
            dropDownModal: false,
            // dynamicTable: false
        });
        setOpenReptBlock({
            allowTextArea: false,
            openReptBlock1: false
        });
        setChildNodeOfRptBlck([]);
        setIntFld({
            intFldKey: "",
            intFldIndex: 0,
            operationFlag: false,
            TempateInputIndex: 0
        });
    };
    const openToolTip = () => {
        setToolTipOpen(true);
    };
    const closeToolTip = () => {
        setToolTipOpen(false);
    };
    // convert date from yyyy-mm-dd to yyyy-mmm-dd..
    function dateFormat(d) {
        var t = new Date(d);
        return t.getDate() + "-" + monthNames[t.getMonth()] + "-" + t.getFullYear();
    };
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
    };
    // to convert dd-mmm-yyyy to dd-mm-yy
    const convertDateFormate = (dateValue) => {
        var date = `${dateValue}`.split("-");
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (var j = 0; j < months.length; j++) {
            if (date[1] == months[j]) {
                date[1] = months.indexOf(months[j]) + 1;
            }
        }
        if (date[1] < 10) {
            date[1] = '0' + date[1];
        }
        if (date[0] < 10) {
            date[0] = "0" + date[0];
        }
        var formattedDate = date[2] + "-" + date[1] + "-" + date[0];
        return formattedDate;
    };
    // to validate the data..
    const dataValidation = (isCustomValidation, EnteredValue, customValidation, label, datatype, min, max) => {
        let responseJson = {
            boolean: false,
            clinetResponse: "continue"
        }
        if (isCustomValidation) {
            let result = UserDetailValidation(EnteredValue, customValidation);
            let responseToclient = "";
            let allowBoolean = false;
            if (result === "invalidInput") {
                responseToclient = "Invalid date selection";
                allowBoolean = true;
            }
            else if (result === "ageProblem") {
                responseToclient = "age should be between 18 to 65!";
                allowBoolean = true;
            }
            else if (result === "isNotANumber" || !result) {
                responseToclient = `Invalid inputs for the ${label}`;
                allowBoolean = true;
            }
            responseJson = {
                boolean: allowBoolean,
                clinetResponse: responseToclient
            }
            return responseJson;
        }

        else if (datatype === "number" || datatype === "date") {

            if ((min === "" && max === "") || (min === 0 && max === 0)) {
                return responseJson;
            } else if (EnteredValue < min || EnteredValue > max) {
                if (datatype === "date") {
                    min = dateFormat(min);
                    max = dateFormat(max);
                }
                responseJson = {
                    boolean: true,
                    clinetResponse: `The value for the field '${label}' should fall with in range of  ${min} to ${max}.`
                }
                return responseJson;
            }
        }

        else if (datatype === "tel") {
            if (isNaN(EnteredValue) || (EnteredValue.length !== 10 || EnteredValue.length !== 12)) {
                responseJson = {
                    boolean: true,
                    clinetResponse: `Invalid inputs for the field ${label}`
                }
                return responseJson;
            }
        }
        return responseJson;
    };
    // commanly used confirm alert with input focus in it.
    const confirmAlertForValidation = (message, fieldID) => {
        confirmAlert({
            message: message,
            buttons: [
                {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                        document
                            .getElementById(fieldID)
                            .focus();
                    },
                },
            ], closeOnClickOutside: false,
        });
        setAllowLoader(true);
    };
    // fetching all the templates inputs {{jsonObj.}};
    // function to find the {{jsonObj.key}} with in the sent text.
    const findInputKeys = (content) => {
        // Regular expression to match keys in the format {{jsObj.someName}}
        const regex = /{{jsonObj\.[^}]+}}/g;
        // Use the match method to find all matches
        const matches = content.match(regex);
        // If there are no matches, matches will be null, so handle that case
        const keysArray = matches ? matches : [];
        return keysArray;
    };
    /*------------------------Comman used FUNCATIONS-------------------------------------*/


    /*------------------------Template Input form-------------------------------------*/
    // when ever any value changes for template inputs..
    const inputFieldOnchange = (e, FieldId, datatype) => {
        e.preventDefault();
        const container = document.getElementById('ScrollBarX');
        const element = document.getElementById(FieldId);
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const elementHeight = elementRect.height;
        container.scroll({
            top: elementRect.top - containerRect.top + scrollTop - (containerHeight / 2) + (elementHeight / 2),
            behavior: 'smooth'
        });

        let radiobtn = document.querySelectorAll("input[type=radio]");
        for (let i = 0; i <= radiobtn.length - 1; i++) {
            setRadioButtonList((oldvalue) => ({
                ...oldvalue,
                [radiobtn[i].id]: radiobtn[i].checked
            }));
        }
        let checkbtn = document.querySelectorAll("input[type=checkBox]");
        for (let i = 0; i <= checkbtn.length - 1; i++) {
            setCheckedBoxList((oldvalue) => ({
                ...oldvalue,
                [checkbtn[i].id]: checkbtn[i].checked,
            }));
        }

        let userValue = "";
        let inputDataTye = "";

        // for date as DataType..
        if (datatype === "date" || datatype === "Date") {
            userValue = dateFormat(e.target.value.trim());
            inputDataTye = datatype;
        };
        // for all other types of data.
        if (datatype !== "date" && datatype !== "Date") {
            userValue = e.target.value.trim();
            inputDataTye = datatype;
        };
        SetList(oldvalue => ({
            ...oldvalue,
            [FieldId]: userValue
        }));
        SetListMeta(oldvalue => ({
            ...oldvalue,
            [FieldId]: { value: userValue, dataType: inputDataTye }
        }));
        setListForSaveDraft(oldvalue => ({
            ...oldvalue,
            [FieldId]: { value: userValue, dataType: inputDataTye }
        }));

        //if the values are empty the yellow background is showen..
        if (userValue === "") {
            SetList(oldvalue => ({
                ...oldvalue,
                [FieldId]: `${FieldId}`
            }));
            SetListMeta(oldvalue => ({
                ...oldvalue,
                [FieldId]: { value: FieldId, dataType: inputDataTye }
            }));
            setListForSaveDraft(oldvalue => ({
                ...oldvalue,
                [FieldId]: { value: FieldId, dataType: inputDataTye }
            }));
        };
    };
    // template input form Modal..
    // to open the modal when clicked on html form for template datainputs..
    const newInputField = (event) => {
        setHtmlInputFieldKey(event.srcElement.id);
        setAllowModal({
            ...allowModal,
            inputModal: true
        });
    };
    // to open modal of dropDown..
    // to open the modal when clicked on html form used for the Template dropDown..
    const selectDrpDwnModal = (event) => {
        setHtmlDrpDwnFieldKey((event.srcElement.id).substring(6, ((event.srcElement.id).length - 10)));
        setAllowModal({
            ...allowModal,
            dropDownModal: true
        });
    };
    // returns input field to the inputFieldModal..
    const inputFieldModal = () => {
        if (allowModal.inputModal && htmlInputFieldKey.length !== 0) {
            let inputValidation = inputFieldArrToModal[htmlInputFieldKey];
            let jsValidationObj = {
                id: `${htmlInputFieldKey}ModalInput`,
                customValidationKey: inputValidation.customValidation,
                inputField: inputValidation.inputField,
                dataType: inputValidation.inputDataType,
                minRange: inputValidation.minRange,
                maxRange: inputValidation.maxRange,
                minLength: inputValidation.minLength,
                maxLength: inputValidation.maxLength,
                label: inputValidation.label,
                id: `${inputValidation.inputField}ModalInput`
            }
            return (
                <>
                    <div key="key" style={{ paddingTop: "16px" }}>
                        <div className='Divo4Css'>
                            <div className='title'>
                                <span> Label: </span>
                            </div>
                            <div style={{ width: "fit-content", marginLeft: "10px" }} className='titleName'>
                                <span>{inputValidation.label}</span>
                            </div>
                        </div>
                        <div className='inputHolderCss'>
                            <div className='Divo5Css'>
                                <input type={inputValidation.inputDataType}
                                    placeholder={inputValidation.placeHolder} min={inputValidation.minRange} max={inputValidation.maxRange} minLength={inputValidation.minLength} maxLength={inputValidation.maxLength}
                                    name={inputValidation.label} id={`${inputValidation.inputField}ModalInput`} defaultValue={List[inputValidation.inputField] === inputValidation.inputField ? "" : List[inputValidation.inputField]} autoCapitalize='off' className='inputCssTemplate' />
                            </div>
                        </div>
                        <div className="InRange_R1" style={{ paddingTop: "8px" }}
                            hidden={(inputValidation.minRange !== "" && inputValidation.maxRange !== "" && inputValidation.minRange !== " " && inputValidation.maxRange !== " ") ? false : true}>
                            <div className="InRange_R2" >
                                <div className="InRange_R3" >
                                    <div className="InRange_R3" style={{ width: "85%" }}>Minimum range</div> <div>:</div>
                                </div>
                                <div className="InRange_R4" >
                                    <span>{inputValidation.minRange}</span>
                                </div>
                            </div>
                            <div className="InRange_R2" >
                                <div className="InRange_R3" >
                                    <div style={{ width: "85%" }}>Maximum range</div> <div>:</div>
                                </div>
                                <div className="InRange_R4" >
                                    <span>{inputValidation.maxRange}</span>
                                </div>
                            </div>
                        </div>
                        <div className="InRange_R1" style={{ paddingTop: "8px" }}
                            hidden={(inputValidation.maxLength !== "" && inputValidation.minLength !== "" && inputValidation.maxLength !== " " && inputValidation.minLength !== " ") ? false : true}>
                            <div className="InRange_R2" >
                                <div className="InRange_R3" >
                                    <div className="InRange_R3" style={{ width: "85%" }}>Minimum Length</div> <div>:</div>
                                </div>
                                <div className="InRange_R4" >
                                    <span>{inputValidation.minLength}</span>
                                </div>
                            </div>
                            <div className="InRange_R2" >
                                <div className="InRange_R3" >
                                    <div style={{ width: "85%" }}>Maximum Length</div> <div>:</div>
                                </div>
                                <div className="InRange_R4" >
                                    <span>{inputValidation.maxLength}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: "100%", textAlign: "center", paddingTop: "8px" }}>
                            <button className='proceedbtnXVoucher' type='button' onClick={e => collectInputModalData(e, jsValidationObj)}>OK</button>
                        </div>
                    </div >
                </>
            )
        }
        if (allowModal.dropDownModal && htmlDrpDwnFieldKey.length !== 0) {
            return (
                <>
                    <div key="key" className='Divo3Css' style={{ paddingTop: "16px" }}>
                        <div className='Divo4Css'>
                            <div style={{ width: "fit-content" }} className='title'>
                                <span> Dropdown: </span>
                            </div>
                            <div style={{ width: "fit-content", marginLeft: "10px" }} className='titleName'>
                                <span>{htmlDrpDwnFieldKey}</span>
                            </div>
                        </div>
                        <div className='inputHolderCss'>
                            <div className='Divo5Css'>
                                <div className='inputfieldCss'>
                                    <select id={`${htmlInputFieldKey}DrpDwnModl`} style={{ borderColor: "#9dc1e3" }} className='input-Montroll1Css' /*onChange={e => selectedValue(e, htmlInputFieldKey)}*/>
                                        <option value='' disabled={false} hidden={false}>Choose value</option>
                                        {
                                            selectDrpDwn[htmlDrpDwnFieldKey].map((item) => (
                                                <option key={`${item}Key`} selected={selectDrpDwnVal[`#$Drp_${htmlDrpDwnFieldKey}#$`] === item ? true : false} value={item} id={`${item}Option`}>{item}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div style={{ width: "100%", textAlign: "center", paddingTop: "8px" }}>
                            <button className='proceedbtnXVoucher' type='button' onClick={e => selectedValue(e, htmlDrpDwnFieldKey, `${htmlInputFieldKey}DrpDwnModl`)}>OK</button>
                        </div>
                    </div>
                </>
            )
        }

    };
    // to collect inputs data entered through modal..
    const collectInputModalData = (event, jsValidation) => {
        let scrollIntoViewOptions = { block: "center" };
        const element = document.getElementById(jsValidation.inputField);
        element.scrollIntoView(scrollIntoViewOptions);
        let Enteredvalue = document.getElementById(jsValidation.id).value.trim();
        let validationResponse = {
            boolean: false,
            clinetResponse: "continue"
        };
        if (Enteredvalue !== "") {
            if (jsValidation.customValidationKey !== "") {
                validationResponse = dataValidation(true, Enteredvalue, jsValidation.customValidationKey, jsValidation.label, jsValidation.dataType, "", "");
            } else if (jsValidation.dataType === "number") {
                validationResponse = dataValidation(false, Number(Enteredvalue), jsValidation.customValidationKey, jsValidation.label, jsValidation.dataType, Number(jsValidation.minRange), Number(jsValidation.maxRange));
            } else if (jsValidation.dataType === "date") {
                validationResponse = dataValidation(false, new Date(Enteredvalue), jsValidation.customValidationKey, jsValidation.label, jsValidation.dataType, new Date(jsValidation.minRange), new Date(jsValidation.maxRange));
            } else if (jsValidation.dataType === "tel") {
                validationResponse = dataValidation(false, Enteredvalue, jsValidation.customValidationKey, jsValidation.label, jsValidation.dataType, "", "");
            }
            if (validationResponse.boolean) {
                event.preventDefault();
                confirmAlertFunction(validationResponse.clinetResponse);
                return;
            }
        }
        closeTheModal();
        document.getElementById(`${jsValidation.inputField}FrmInptField`).value = Enteredvalue; // Through DOM Value updation to the Template Form..
        if (jsValidation.dataType === "date" || jsValidation.dataType === "Date") {
            let dateInMyFormat = dateFormat(Enteredvalue);
            SetList({
                ...List,
                [jsValidation.inputField]: dateInMyFormat,
            });
            SetListMeta({
                ...ListMeta,
                [jsValidation.inputField]: { value: dateInMyFormat, dataType: jsValidation.dataType }
            })
            setListForSaveDraft({
                ...listForSaveDraft,
                [jsValidation.inputField]: { value: dateInMyFormat, dataType: jsValidation.dataType },
            });


            //if the values are empty the yellow background is showen..
            if (Enteredvalue === "") {
                SetList({
                    ...List,
                    [jsValidation.inputField]: `${jsValidation.inputField}`,
                });
                SetListMeta({
                    ...ListMeta,
                    [jsValidation.inputField]: { value: jsValidation.inputField, dataType: jsValidation.dataType }
                })
                setListForSaveDraft({
                    ...List,
                    [jsValidation.inputField]: { value: jsValidation.inputField, dataType: jsValidation.dataType },
                });
            }
        }

        if (jsValidation.dataType !== "date" && jsValidation.dataType !== "Date") {
            SetList({
                ...List,
                [jsValidation.inputField]: Enteredvalue,
            });
            SetListMeta({
                ...ListMeta,
                [jsValidation.inputField]: { value: Enteredvalue, dataType: jsValidation.dataType }
            })
            setListForSaveDraft({
                ...listForSaveDraft,
                [jsValidation.inputField]: { value: Enteredvalue, dataType: jsValidation.dataType }
            });

            //if the values are empty the yellow background is showen..
            if (Enteredvalue === "") {
                SetList({
                    ...List,
                    [jsValidation.inputField]: `${jsValidation.inputField}`,
                });
                SetListMeta({
                    ...ListMeta,
                    [jsValidation.inputField]: { value: jsValidation.inputField, dataType: jsValidation.dataType }
                })
                setListForSaveDraft({
                    ...listForSaveDraft,
                    [jsValidation.inputField]: { value: jsValidation.inputField, dataType: jsValidation.dataType },
                });
            }
        }
    };
    /*------------------------Template Input form-------------------------------------*/


    /*------------------------save draft -------------------------------------*/

    const dataValidationFunction = (validationData) => {
        let value = List[validationData.inputField] === validationData.inputField ? "" : List[validationData.inputField];
        // check if that inputs has custom valdation. (1st preference to custom validation).
        if (validationData.customValidation !== "") {
            if (value === "") {
                return true;
            } else {

                let responseJson = dataValidation(true, value, validationData.customValidation,
                    validationData.label, "", "", "");
                if (responseJson.boolean) {
                    setAllowLoader(true);
                    confirmAlertForValidation(responseJson.clinetResponse, `${validationData.inputField}FrmInptField`);
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        // dataType of number.
        else if (validationData.inputDataType === "number") {
            if (value === "") {
                return true;
            }
            else {
                let validationResponse = dataValidation(false, Number(value), validationData.customValidation,
                    validationData.label, "number", Number(validationData.minRange), Number(validationData.maxRange));
                if (validationResponse.boolean) {
                    confirmAlertForValidation(validationResponse.clinetResponse, `${validationData.inputField}FrmInptField`);
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        // dataype as date.
        else if (validationData.inputDataType === "date") {
            if (value === "") {
                return true;
            }
            else {
                let validationResponse = dataValidation(false, new Date(value), "",
                    validationData.label, "date", new Date(validationData.minRange), new Date(validationData.maxRange));
                if (validationResponse.boolean) {
                    confirmAlertForValidation(validationResponse.clinetResponse, `${validationData.inputField}FrmInptField`);
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        // dataType as tel.
        else if (validationData.inputDataType === "tel") {
            if (value === "") {
                return true;
            }
            else {
                let validationResponse = dataValidation(false, value, "", validationData.label, "tel", "", "");
                if (validationResponse.boolean) {
                    confirmAlertForValidation(validationResponse.clinetResponse, `${validationData.inputField}FrmInptField`);
                    return false;
                } else {
                    return true;
                }
            }
        }
        // dataType as text just return true.
        else {
            return true;
        }
    };
    // tempalte saving in draft tempates page.
    const saveDraft = (e) => {
        setAllowLoader(false);
        e.preventDefault();
        let formInputs = templateInputs;
        // template inputs validation.
        for (let keys in formInputs) {
            // checking the number in each JSON, Json having one key indicates it is repeatAble block.
            if (Object.keys(formInputs[keys]).length === 1) {
                let inptsInsideReptBlck = formInputs[keys][Object.keys(formInputs[keys])[0]];
                // iterating over the reptAble inputs parent.
                for (let key in inptsInsideReptBlck) {
                    // setting the index of repeatable for presently on which the data validation is performed.
                    setInitReptIndex({
                        ...initReptIndex,
                        [Object.keys(formInputs[keys])[0]]: Number(key)
                    });
                    // iterating over the reptAble inputs child.
                    for (let childKey in inptsInsideReptBlck[key]) {
                        let boolean = dataValidationFunction(inptsInsideReptBlck[key][childKey]);
                        // check if the returned value is true. if it is true iteration with next value else false is returned return
                        // by stopping the loop.
                        if (boolean) {
                            continue;
                        } else {
                            return;
                        }
                    }
                };
            }
            else {
                let boolean = dataValidationFunction(formInputs[keys]);
                // check if the returned value is true. if it is true iteration with next value else false is returned return
                // by stopping the loop.
                if (boolean) {
                    continue;
                } else {
                    return;
                }
            };
        }

        // custom fields validation.
        for (let keys in customFieldData) {
            if (customFieldData[keys].customValidation != "" && customFieldData[keys].tobefilledby === 0) {
                e.preventDefault();
                if (document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value + "" === "") {
                    continue;
                }
                else {
                    let responseJson = dataValidation(true, document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value + "", customFieldData[keys].customValidation,
                        customFieldData[keys].label, "", "", "");
                    if (responseJson.boolean) {
                        setAllowLoader(true);
                        e.preventDefault();
                        confirmAlert({
                            message: responseJson.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${customFieldData[keys].inputField}cusFrmInptField`)
                                            .focus();
                                    },
                                },
                            ], closeOnClickOutside: false,
                        });
                        return;
                    }
                    else {
                        continue;
                    }
                }
            }
            else if (customFieldData[keys].inputDataType === "number" && customFieldData[keys].tobefilledby !== 1) {
                e.preventDefault();
                if (document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value + "" === "") {
                    continue;
                }
                else {
                    let validationResponse = dataValidation(false, Number(document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value), "",
                        customFieldData[keys].label, "number", Number(customFieldData[keys].minRange), Number(customFieldData[keys].maxRange));
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        confirmAlert({
                            message: validationResponse.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${customFieldData[keys].inputField}cusFrmInptField`)
                                            .focus();
                                    },
                                },
                            ], closeOnClickOutside: false,
                        });
                        setAllowLoader(true);
                        return;
                    }
                    else {
                        continue;
                    }
                }
            }
            else if (customFieldData[keys].inputDataType === "date" && customFieldData[keys].tobefilledby !== 1) {
                e.preventDefault();
                if (document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value + "" === "") {
                    continue;
                }
                else {
                    let validationResponse = dataValidation(false, new Date(document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value), "",
                        customFieldData[keys].label, "date", new Date(customFieldData[keys].minRange), new Date(customFieldData[keys].maxRange));
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        confirmAlert({
                            message: validationResponse.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${customFieldData[keys].inputField}cusFrmInptField`)
                                            .focus();
                                    },
                                },
                            ], closeOnClickOutside: false,
                        });
                        setAllowLoader(true);
                        return;
                    }
                    else {
                        continue;
                    }
                }
            }
            else if (customFieldData[keys].inputDataType === "tel" && customFieldData[keys].tobefilledby !== 1) {
                e.preventDefault();
                if (document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value + "" === "") {
                    continue;
                }
                else {
                    let validationResponse = dataValidation(false, document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value, "",
                        customFieldData[keys].label, "tel", "", "");
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        confirmAlert({
                            message: validationResponse.clinetResponse,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        document
                                            .getElementById(`${customFieldData[keys].inputField}cusFrmInptField`)
                                            .focus();
                                    },
                                },
                            ], closeOnClickOutside: false,
                        });
                        setAllowLoader(true);
                        return;
                    } else {
                        continue;
                    }
                }
            }
        }

        let file = document.querySelectorAll("input[type=file]");
        let totalfileuplodedcount = compareAndPrepareAttData(e, false, false);
        let radio = document.querySelectorAll("input[type=radio]");
        var checkBox = document.querySelectorAll("input[type=checkBox]");
        if (radio.length !== 0) {
            for (let i = 0; i <= radio.length - 1; i++) {
                if (radio[i].checked === false) {

                    listForSaveDraft[radio[i].id] = { value: "", dataType: "radio" };
                } else {

                    listForSaveDraft[radio[i].id] = { value: "checked", dataType: "radio" };
                }
            }
        }
        if (checkBox.length !== 0) {
            for (let i = 0; i <= checkBox.length - 1; i++) {
                if (checkBox[i].checked === false) {
                    listForSaveDraft[checkBox[i].id] = { value: "", dataType: "checkBox" };
                } else {
                    listForSaveDraft[checkBox[i].id] = { value: "checked", dataType: "checkBox" };
                }
            }
        }

        for (let key in listForSaveDraft) {
            if (listForSaveDraft[key].value === key) {
                let json = { value: "__________", dataType: listForSaveDraft[key].dataType };
                listForSaveDraft[key] = json;
            }
        }

        //to include the custom field to the list..
        for (let key in customFieldDetail) {
            listForSaveDraft[key] = customFieldDetail[key];
        }

        // to store the selectdropdownValues..
        for (let key in selectDrpDwnVal) {
            if (key === `#$Drp_${selectDrpDwnVal[key]}#$`) {
                listForSaveDraft[key] = { value: "__________" };
            }
            else {
                listForSaveDraft[key] = { value: selectDrpDwnVal[key] };
            }
        }

        let isFilesAvailable = false;
        // checking if any attachments present in the template.
        // the checking is done weather to continue the file appending.
        // if no files are attached. Then no need of continuing the furthur process.
        for (let index = 0; index <= file.length - 1; index++) {
            if (file[index].value !== "") {
                isFilesAvailable = true;
            };
        };
        // checking if any images are captured are attached.
        if (capturedImageArray.length !== 0) {
            isFilesAvailable = true;
        }

        if (isFilesAvailable) {
            let count = 0;
            if (Object.keys(imageFileForSaveDraft).length !== 0) {
                for (let key in imageFileForSaveDraft) {
                    if (imageFileForSaveDraft[key].attachmentData != "") {
                        let reader = new FileReader();
                        reader.readAsDataURL(imageFileForSaveDraft[key].attachmentData);
                        reader.onload = function () {
                            templateAttachmentForDraft[count] = {
                                attachmentData: reader.result,
                                attachmentKey: key,
                                attachmentType: imageFileForSaveDraft[key].attachmentData.type,
                                attachmentLable: imageFileForSaveDraft[key].attachmentLable,
                                attachmentId: imageFileForSaveDraft[key].attachmentId,
                                attmntFileName: imageFileForSaveDraft[key].attmntFileName
                            };
                            count++;
                            if (count === totalfileuplodedcount) {
                                SaveDraftAPI(e);
                                setTemplateForRendering(imageFileForSaveDraftTwo);
                                setimageFileForSaveDraft([]);
                            }
                        };
                        reader.onerror = function (error) {
                            console.log("Error: ", error);
                        };
                    } else {
                        templateAttachmentForDraft[count] = {
                            attachmentData: "",
                            attachmentKey: key,
                            attachmentType: imageFileForSaveDraft[key].attachmentType,
                            attachmentLable: imageFileForSaveDraft[key].attachmentLable,
                            attachmentId: imageFileForSaveDraft[key].attachmentId,
                            attmntFileName: imageFileForSaveDraft[key].attmntFileName,
                            attachmentDimension: imageFileForSaveDraft[key].attachmentDimension,
                            isAvailableInSvr: imageFileForSaveDraft[key].isAvailableInSvr,
                        };
                        count++;
                        if (count === totalfileuplodedcount) {
                            SaveDraftAPI(e);
                            setTemplateForRendering(imageFileForSaveDraftTwo);
                            setimageFileForSaveDraft([]);
                        }
                    }
                }
            } else {
                SaveDraftAPI(e);
                setimageFileForSaveDraft([]);
            }
        } else {
            SaveDraftAPI(e);
        }
        e.preventDefault();
    };
    // Final save draft funcation which saves the data... 
    const SaveDraftAPI = e => {
        setTemplateAttachmentForDraft([]);
        setAllowLoader(false);
        let additionalData = {};
        let reptData = { "reptDataToSveDraft": reptDataToSveDraft, "repeatAbleBlock": repeatAbleBlock };
        // appending the repetable Block to the dynamicTableArray..
        additionalData["repeatAbleBolckData"] = JSON.stringify(reptData);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken"),
                templateData: listForSaveDraft,
                templateCode: templateCode,
                templateAttachments: templateAttachmentForDraft,
                temptDrftRef: temptDrftRef,
                dynaTableDataForSaveDraft: additionalData,
                templateName: templateName
            }),
        };
        fetch(URL.saveTemplateDrafts, options)
            .then((response) => response.json())
            .then((responsedata) => {
                if (responsedata.status === "SUCCESS") {
                    e.preventDefault();
                    setAllowLoader(true);
                    confirmAlertFunction(responsedata.statusDetails);
                    e.preventDefault();
                } else if (responsedata.statusDetails === "Session Expired!!") {
                    setAllowLoader(true);
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
                }
                else if (responsedata.status === "failedInValidation") {
                    e.preventDefault();
                    confirmAlert({
                        message: responsedata.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => {
                                    document.getElementById(`${responsedata.fieldLabel}cusFrmInptField`).focus();
                                },
                            },
                        ], closeOnClickOutside: false,
                    });
                    setAllowLoader(true);
                    return;
                }
                else {
                    confirmAlertFunction(responsedata.statusDetails);
                }
            })
            .catch((error) => {
                confirmAlertFunction(`SomeThing Went Wrong PLease Try Again!`);
            });
        setAllowLoader(true);
    };
    /*------------------------save draft -------------------------------------*/


    /*------------------------HTML Create (UI)-------------------------------------*/
    // to create Template to render on UI..
    const creatMyForm = () => {
        let HtmlHash = atob(form.HtmlBase64String);
        var renderingHtml = HtmlHash;
        const parser = new DOMParser();
        const doc = parser.parseFromString(HtmlHash, 'text/html');
        const htmlBodyTag = doc.querySelector("body").outerHTML.split("\n");
        // fetching all the templates inputs {{jsonObj.}};
        // function to find the {{jsonObj.key}} with in the sent text.
        const keysArray = findInputKeys(doc.querySelector("body").outerHTML);

        let inputFields = [];
        // iteraing the input fields arrays one by one providing [] for each input
        for (let key in keysArray) {
            let wordwithFirstCurly = keysArray[key].split("{{")[1];
            let wordWithSecondCurly = wordwithFirstCurly.split("}}")[0];
            let dataWithCurly = wordWithSecondCurly.split(".")[1];
            inputFields.push(dataWithCurly);
        }
        // iterate the filteredData 
        inputFields.forEach(data => {
            renderingHtml = renderingHtml.replace(
                `{{jsonObj.${data}`,
                `<span id=${data} class=${`${List[data]}` !== data ? "recount" : "encount"
                }>${List[data]}`
            );
            renderingHtml = renderingHtml.replace("}}", "</span >");
        });

        for (let i = 0; i < htmlBodyTag.length; i++) {
            let eachLine = htmlBodyTag[i];
            let words = eachLine.split(" ");
            for (let j = 0; j < words.length; j++) {
                let trimmedData = words[j].trim();
                // '##' search for the attachments..
                if (trimmedData.includes("##atchmt")) {
                    const regex = /(##atchmt##.*?##)/;
                    const match = trimmedData.match(regex);
                    let id = match[1];
                    let keyName = trimmedData.split("atchmt##")[1];
                    let OriginalkeyName = keyName.split("##")[0];
                    renderingHtml = renderingHtml.replace(
                        `##atchmt##${OriginalkeyName}##`,
                        `<div><span style="font-size:12px; margin-left:5px; font-family: initial; background-color:aquamarine;" id=${`${id}1`}>(Please Upload the attachment)</span></div>`
                    );
                }

                // '#$' search for the  selectDropDown
                else if (trimmedData.includes("#$Drp_")) {
                    renderingHtml = renderingHtml.replace(`${trimmedData}`,
                        `<span id=${`${trimmedData}Template`} style=background-color:${`#$Drp_${selectDrpDwnVal[trimmedData]}#$` !== trimmedData ? "#ffc65e" : "lightskyblue"}
                          >${selectDrpDwnVal[trimmedData]}</span>`
                    );
                }
            }
        }

        // removing @@ repeatAble search keys from HTML 
        renderingHtml = renderingHtml.replace(/@@(.*?)@@/g, "");
        return <div dangerouslySetInnerHTML={{ __html: renderingHtml }} />;
    };
    /*------------------------HTML Create (UI)-------------------------------------*/

    /*------------------------Custom fields-------------------------------------*/
    //  to create custom field input form.
    const customFieldInputForm = () => {
        if (customFieldData.length != 0 && allowForCus) {
            return (
                <div className="fileUploadBorder">
                    <span className="form-montrol1" style={{ marginBottom: "10px" }}>
                        fill the custom field input
                    </span>
                    {
                        customFieldData.map((posts, index) => {
                            if (posts.tobefilledby === 0) {
                                return (
                                    <div key={index}>
                                        <div className="form-loop md-5">
                                            <label style={{ width: "100%" }}>{posts.label}
                                                <input
                                                    name={posts.inputField}
                                                    id={`${posts.inputField}cusFrmInptField`}
                                                    minLength={posts.minLength}
                                                    maxLength={posts.maxLength}
                                                    min={posts.minRange}
                                                    max={posts.maxRange}
                                                    type={posts.inputDataType}
                                                    class="form-montrol"
                                                    placeholder={`${posts.placeHolder}`}
                                                    onChange={(e) => cusFieldOnChange(e, posts.inputField, posts.tobefilledby)}
                                                    autoComplete="true"
                                                />
                                            </label>
                                        </div>

                                    </div>
                                )
                            }
                        })
                    }
                </div>
            )
        }
    };
    // to collect the custom field data, entered by the user...
    const cusFieldOnChange = (event, key, tobeFilledBy) => {
        let radiobtn = document.querySelectorAll("input[type=radio]");
        for (let i = 0; i <= radiobtn.length - 1; i++) {
            setRadioButtonList((oldvalue) => ({
                ...oldvalue,
                [radiobtn[i].id]: radiobtn[i].checked,
            }));
        }
        let checkbtn = document.querySelectorAll("input[type=checkBox]");
        for (let i = 0; i <= checkbtn.length - 1; i++) {
            setCheckedBoxList((oldvalue) => ({
                ...oldvalue,
                [checkbtn[i].id]: checkbtn[i].checked,
            }));
        }

        if (event.target.type === "date" || event.target.type === "Date") {
            let dateInMyFormat = dateFormat(event.target.value);
            setCustomFieldDetail({
                ...customFieldDetail,
                [`${key}`]: { value: dateInMyFormat, dataType: event.target.type, customField: true, filledBy: tobeFilledBy }
            })
        }

        if (event.target.type !== "date" && event.target.type !== "Date") {
            setCustomFieldDetail({
                ...customFieldDetail,
                [`${key}`]: { value: event.target.value, dataType: event.target.type, customField: true, filledBy: tobeFilledBy }
            })
        }
    };
    /*------------------------Custom fields-------------------------------------*/


    /*------------------------Custom select drop down-------------------------------------*/
    //drop down selected values
    const selectedValue = (event, key, DomID) => {
        let radiobtn = document.querySelectorAll("input[type=radio]");
        for (let i = 0; i <= radiobtn.length - 1; i++) {
            setRadioButtonList((oldvalue) => ({
                ...oldvalue,
                [radiobtn[i].id]: radiobtn[i].checked,
            }));
        }
        let checkbtn = document.querySelectorAll("input[type=checkBox]");
        for (let i = 0; i <= checkbtn.length - 1; i++) {
            setCheckedBoxList((oldvalue) => ({
                ...oldvalue,
                [checkbtn[i].id]: checkbtn[i].checked,
            }));
        }

        if (document.getElementById(DomID).value === "") {
            setSelectDrpDwnVal({
                ...selectDrpDwnVal,
                [`#$Drp_${key}#$`]: key
            })
        }
        else {
            setSelectDrpDwnVal({
                ...selectDrpDwnVal,
                [`#$Drp_${key}#$`]: document.getElementById(DomID).value
            })
        }
        closeTheModal();
        // to sroll the view of the custom dropdown on HTML.. 
        const container = document.getElementById('ScrollBarX');
        const element = document.getElementById(`${`#$Drp_${key}#$`}Template`);
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const elementHeight = elementRect.height;
        container.scroll({
            top: elementRect.top - containerRect.top + scrollTop - (containerHeight / 2) + (elementHeight / 2),
            behavior: 'smooth'
        });
    };
    /*------------------------Custom select drop down-------------------------------------*/

    /*------------------------Repeatable blocks--------------------------------------*/
    // () to create a HTML file based on the Data updated.
    const updateHTML = (repetableKey) => {
        // adding of the data to the tables in HTML..
        // need to convert the HTML in to base64 and add to the form usestate....
        const contents = atob(htmlFileServer);
        const parser = new DOMParser();
        const doc = parser.parseFromString(contents, 'text/html');
        // const tagExists = doc.querySelectorAll('table');
        const repetableTags = doc.querySelectorAll('repeatTag');
        const tagExists = doc.querySelectorAll('table');

        // appending the repeated data of commented repeatTag inside the table.
        for (let key in repetBlckOfInptField) {
            // iterating the array
            if (typeof repetBlckOfInptField[key][0] === 'object') {
                let table = tagExists[Number(repetBlckOfInptField[key][0]["tableNumber"])];
                const individualStyleTag = table.querySelector("tbody");
                let styleProperty = "";
                let tableDataStyle = "";
                if (individualStyleTag) { // fetching the style attribute..
                    const trStyleTag = individualStyleTag.querySelector("tr");
                    if (trStyleTag.getAttribute('style') !== null) {
                        styleProperty = trStyleTag.getAttribute('style');
                    }
                    let tData = trStyleTag.querySelector('td');
                    if (tData) {
                        if (tData.getAttribute('style') !== null) {
                            tableDataStyle = tData.getAttribute('style').getAttribute('style');
                        }
                    }
                };
                for (let keyz in repetBlckOfInptField[key]) {
                    // below if condition says it is a repeatAble block inside the table.. 
                    // avoid the 1st index content appending to HTML form because it contains the original content.
                    if (keyz !== "0") {
                        const nodes = Array.from(individualStyleTag.childNodes);
                        let endRepeatTagNode = null;
                        // Find the ending comment node <!-- </repeatTag> -->
                        nodes.forEach(node => {
                            if (node.nodeType === Node.COMMENT_NODE && node.nodeValue.trim() === '</repeatTag>') {
                                endRepeatTagNode = node;
                            }
                        });
                        if (endRepeatTagNode) {
                            let tableContent = repetBlckOfInptField[key][keyz];
                            const keysArray = findInputKeys(tableContent);
                            // Insert a new row into the <tbody>..
                            // Create a new row
                            const bodyRow = document.createElement('tr');
                            bodyRow.setAttribute('style', `${styleProperty}; background-color: #d8f5ad;`);
                            // Add cells to the row
                            keysArray.forEach(key => {
                                const cell = document.createElement('td');
                                cell.setAttribute('style', `${tableDataStyle}`);
                                cell.textContent = key;
                                bodyRow.appendChild(cell);
                            });

                            // Insert the new row before the ending comment node
                            individualStyleTag.insertBefore(bodyRow, endRepeatTagNode);
                        }
                    } else { continue };
                }
            };
        };

        for (let parentKey in reptBlckOfInputs) { // For highlighting of commented repeatAble block inside the table.. 
            if (repetableKey === parentKey && typeof reptBlckOfInputs[parentKey][0] === 'object') { // check the key sent matches with the reptBlckOfInputs
                // iteration of tables to find the matching one with above.
                // key of actual tables are Number so ensuring the data is table.
                let table = tagExists[Number(reptBlckOfInputs[parentKey][0]["tableNumber"])];
                const nodes = Array.from(table.querySelector("tbody").childNodes);
                let insideRepeatTag = false;
                let TRCounts = 0;
                nodes.forEach((node, index) => {
                    if (node.nodeType === Node.COMMENT_NODE && node.nodeValue.trim() === '<repeatTag>') {
                        insideRepeatTag = true;
                    } else if (node.nodeType === Node.COMMENT_NODE && node.nodeValue.trim() === '</repeatTag>') {
                        insideRepeatTag = false;
                    } else if (insideRepeatTag && node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TR') {
                        if (initReptIndex[repetableKey] === TRCounts) {
                            node.setAttribute("style", `${node.getAttribute('style')}; border: 3px solid green;`);
                            node.setAttribute('id', 'scrollToreptBlk');
                        }
                        TRCounts++;
                    }
                });
                setScrollControl(!scrollControl);
            }
        };

        let docString = doc.documentElement.outerHTML;

        // for highlighting the repetable Block..
        let count = 0;
        repeatContentUpdateHTML.forEach((data, index) => {
            // checking the data, if data is string it is considered as table.
            if (typeof data === "string") { // to read the input fields in the repeatable block..

            } else {
                if (repetableKey.substring(17, repetableKey.length) === `${Number(index) + 1}` && initReptIndex[repetableKey] === 0) {
                    // const parentElement = docElement.querySelector("repeatTag1");
                    const parentElement = document.createElement('div');
                    parentElement.setAttribute('id', 'scrollToreptBlk');
                    const reptTag = document.createElement('repeatTag');
                    parentElement.setAttribute('style', "border: 3px solid green;margin-bottom: 5px;  width: fit-content; height: fit-content");
                    const childElements = repetableTags[count].innerHTML;
                    const range = document.createRange();
                    // Create a document fragment from the HTML string
                    const fragment = range.createContextualFragment(childElements);
                    // Iterate over all child elements and process them
                    Array.from(fragment.children).forEach((node) => {
                        parentElement.appendChild(node.cloneNode(true));
                        // Perform operations on each node
                    });
                    // Append all elements from the collection to the parent element
                    reptTag.appendChild(parentElement);
                    reptTag.insertAdjacentHTML('beforeend', `@@repeatTag${Number(index) + 1}@@`);
                    docString = docString.replace(repetableTags[count].outerHTML, `${reptTag.outerHTML}`);
                    setScrollControl(!scrollControl);
                };
                count++;
            };
        });


        // iterating and appending the inputs present repeatAble blocks.
        for (let key in repetBlckOfInptField) {
            // iterating the array
            here: for (let keyz in repetBlckOfInptField[key]) {
                // below if condition says it is a repeatAble block inside the table.. 
                if (typeof repetBlckOfInptField[key][keyz][0] === 'object') {
                    break here;
                } else {
                    // avoid the 1st index content appending to HTML form because it contains the original content.
                    if (keyz !== "0") {
                        docString = docString.replace(`@@repeatTag${key.substring(key.length - 1, key.length)}@@`,
                            `<div style="padding:2px; word-break: break-word;word-wrap: break-word;border:2px solid ${initReptIndex[key] === Number(keyz) ? "green" : "#d8f5ad"};margin-bottom: 5px;width: fit-content;height: fit-content;overflow-wrap: break-word;">${(repetBlckOfInptField[key][keyz])}</div>@@repeatTag${key.substring(17, key.length)}@@`);
                    }
                };

            };
        }


        // iterating to append the static content repeatAble blocks..
        for (let key in repeatAbleBlock) {
            // iterating the array
            for (let keyz in repeatAbleBlock[key]) {
                // avoid the 1st index content appending to HTML form because it contains the original data and 1 extra 
                // data will be appended...
                if (keyz !== "0") {
                    docString = docString.replace(`@@repeatTag${key.substring(key.length - 1, key.length)}@@`,
                        `<div style="word-break: break-word;word-wrap: break-word;border:2px solid #d8f5ad;margin-bottom: 5px;width: fit-content;height: fit-content;overflow-wrap: break-word;">${(repeatAbleBlock[key][keyz])}</div>@@repeatTag${key.substring(17, key.length)}@@`);
                }
            };
        };


        // replacing the new htmlBase64 which contains new rows appended..
        setForm({
            ...form,
            HtmlBase64String: btoa(docString)
        })
    };
    // on call of add btn in repeatAbleBlock block 
    const repetColapsDrpDwn = (panel) => (event, expanded) => {
        if (expanded) {
            // iterating and setting all indexs to '0' default 
            for (let key in initReptIndex) {
                initReptIndex[key] = 0;
            };
            setrepeatDrpDwn(panel);
            updateHTML(panel);
        } else {
            // iterating and setting all indexs to '0' default 
            for (let key in initReptIndex) {
                initReptIndex[key] = 0;
            };
            setrepeatDrpDwn("");
            updateHTML("");
        }
    }
    // open modal for the block which contains input fields.
    const reptBlckWithInpField = (event, block, updationIndex) => {
        event.preventDefault();
        // fetching the inputs inside the block to be repeated.
        let inputs = reptBlockFields[block];

        // if the '0' index of content is JSON object then the content is repeatAbleTable.
        const json = repetBlckOfInptField[block][0];
        const isItJSONObj = typeof json === 'object'
        let stringBlock = "";
        if (isItJSONObj) {
            stringBlock = repetBlckOfInptField[block][0]["defaultData"];
        } else {
            // getting the default block to be repeated
            stringBlock = repetBlckOfInptField[block][0];
        }
        for (let key in inputs) {
            // replacing the input key by 1 increment..
            stringBlock = stringBlock.replace(`{{jsonObj.${inputs[key]}}}`, `{{jsonObj.${inputs[key]}${repetBlckOfInptField[block].length}}}`);
            // setting the new incremented keys to all the comman used states..
            List[`${inputs[key]}${repetBlckOfInptField[block].length}`] = `${inputs[key]}${repetBlckOfInptField[block].length}`
            let oldData = { ...ListMeta[inputs[key]] }; // getting the data of original default input.
            oldData["value"] = `${inputs[key]}${repetBlckOfInptField[block].length}`; // changing its value with new numneric appended value.
            ListMeta[`${inputs[key]}${repetBlckOfInptField[block].length}`] = oldData;
            listForSaveDraft[`${inputs[key]}${repetBlckOfInptField[block].length}`] = oldData;
        };
        repetBlckOfInptField[block] = [...repetBlckOfInptField[block], stringBlock]; // adding the new repeat block to the repetBlckOfInptField state.

        let inputsJsFrUpdation = "";
        let inputJsFrEdition = "";
        // itarating the templateIputs and getting the particular block.
        for (let key in templateInputs) {
            // below condition fetchs the data of particular block..
            if (Object.keys(templateInputs[key]).length === 1 && Object.keys(templateInputs[key])[0] === block) {
                inputJsFrEdition = templateInputs[key][Object.keys(templateInputs[key])[0]][0];
                inputsJsFrUpdation = templateInputs[key][Object.keys(templateInputs[key])[0]];
            };
        }

        // array to add the existing data and new json data.
        let jsonArray = [];
        let dataArray = [];
        // getting the existing data and appending new data.
        let presentData = reptDataToSveDraft[block];
        for (let key in inputJsFrEdition) {
            let jsonObj = inputJsFrEdition[key];
            // updating only the inputField and keeping other datas.
            jsonObj = { ...jsonObj, "inputField": `${jsonObj["inputField"]}${Number(repetBlckOfInptField[block].length) - 1}` };
            jsonArray.push(jsonObj);
            dataArray.push(`${jsonObj["inputField"]}`);
        };
        inputsJsFrUpdation[Number(repetBlckOfInptField[block].length) - 1] = jsonArray;
        presentData.push(dataArray);
        setReptDataToSveDraft({ // storing the repeat block input to reptDataToSveDraft state in an format [{city1,name1},{city2,name2},{city3, name3}];
            ...reptDataToSveDraft,
            [block]: presentData
        });
        templateInputs[updationIndex][block] = inputsJsFrUpdation; //addition of new repeated Inputs to TemplateInputs state.
        initReptIndex[block] = Number(repetBlckOfInptField[block].length) - 1
        updateHTML(block);
    };
    // open modal for to add static text repeatable blocks
    const repeatAbleBlk = (event, value, index, boolean) => {
        event.preventDefault();
        // repeat the section..
        const range = document.createRange();
        // Create a document fragment from the HTML string
        const fragment = range.createContextualFragment(repeatAbleBlock[value][index]);
        // Iterate over all child elements and process them
        const node = fragment.firstChild;
        let booleann = false;
        // to check weather the elements contain any <table> tag..
        // if it contains any table tag then dont allow for the editing option..
        for (let key in node.childNodes) {
            if (!isNaN(key)) {
                if ((node.childNodes[key]).tagName === "TABLE" || (node.childNodes[key]).tagName === "THEAD" || (node.childNodes[key]).tagName === "TBODy") {
                    booleann = true;
                    break;
                }
            }
        }
        // if boolean is true dont allow to edit.
        // boolean indicates, True- add block, false- edit block
        // else allow..
        if (booleann) {
            if (boolean) {
                repeatTheBlock(value);
            } else {
                confirmAlertFunction("This block doesn't contain any content to edit!");
                return;
            }
        } else {
            const childElementsArray = Array.from(node.childNodes);
            Array.from(childElementsArray).forEach(element => {
                const hasChildElements = Array.from(element.childNodes).some(child => child.nodeType === Node.ELEMENT_NODE);
                // if the node contains its own child nodes..
                // else just the contain..\
                if (hasChildElements) {
                    const childElementsArray2 = Array.from(element.childNodes);
                    let elementData = [];
                    // iterating for the child nodes of the main node..
                    Array.from(childElementsArray2).forEach(element1 => {
                        // in case the child element of the above parent element doesn't have a tag but contians only txt.
                        // then add 'noTag' and push the text..
                        if (element1.nodeType === Node.ELEMENT_NODE && element1.tagName !== "BR") {
                            // excluding the br tag to be added.
                            elementData.push({ [element1.tagName]: element1 });
                        } else if (element1.textContent.trim().length !== 0 || element1.tagName === "BR") {
                            // apending the <br/> tag..
                            if (element1.tagName === "BR") {
                                elementData.push({ [element1.tagName]: "" });
                            } else {
                                // not including the @@repeatTag text
                                if (!element1.textContent.trim().includes("@@repeatTag")) {
                                    elementData.push({ "noTag": element1.textContent.trim() });
                                };
                            }
                        }
                    });
                    setChildNodeOfRptBlck(oldvalue => ([
                        ...oldvalue,
                        { [element.tagName]: elementData }
                    ]));
                } else {
                    if (element.nodeType !== Node.TEXT_NODE && element.nodeType === Node.ELEMENT_NODE) { // not including text nodes.. 
                        setChildNodeOfRptBlck(oldvalue => ([
                            ...oldvalue,
                            { [element.tagName]: element }
                        ]));
                    }
                }
            });
            setOpenReptBlock({
                ...openReptBlock,
                allowTextArea: true
            });
        }

        setIntFld({
            ...intFld,
            intFldKey: value,
            intFldIndex: index,
            operationFlag: boolean
        });
    };
    //  repeats static text repeatable blocks.
    const repeatTheBlock = (value) => {
        let contents = atob(form.HtmlBase64String);
        let newContent = repeatAbleBlock[value][0];
        let repetBlockChanges = contents.replace(`@@repeatTag${value.substring(17, value.length)}@@`,
            `<div style="word-break: break-word;word-wrap: break-word;border:2px solid #d8f5ad;margin-bottom: 5px;width: fit-content;height: fit-content;overflow-wrap: break-word;">${newContent}</div>@@repeatTag${value.substring(17, value.length)}@@`);
        // replacing the new htmlBase64 which contains new rows appended..
        setRepeatAbleBlock({
            ...repeatAbleBlock,
            [value]: [...repeatAbleBlock[value], newContent]
        });
        setForm({
            ...form,
            HtmlBase64String: btoa(repetBlockChanges)
        });
        toast.success("Block added!", { autoClose: 1000 });
    };
    // to remove the repeatAble block from the HTML
    const deleteReptBlock = (event, index, key) => {
        // removing the data from repeatAbleBlock state
        repeatAbleBlock[key].splice(index, 1);
        toast.error("Block deleted!", { autoClose: 1000 });
        updateHTML(key);
    };
    // to remove the repeat block which contains inputs.
    const dleteInpReptBlck = (e, index, ReptKey, mainIndex) => {
        setAllowLoader(false);
        // deletion of div data from repetBlckInptField..
        repetBlckOfInptField[ReptKey].splice(repetBlckOfInptField[ReptKey].length - 1, 1);
        for (let key in reptBlockFields[ReptKey]) {  // iteraing the inputs and deleting all inputs related to that particular block..
            // deleting all the datas from comman used states..
            delete List[`${reptBlockFields[ReptKey][key]}${index}`];
            delete ListMeta[`${reptBlockFields[ReptKey][key]}${index}`];
            delete listForSaveDraft[`${reptBlockFields[ReptKey][key]}${index}`];
            const pattern = new RegExp(`^${reptBlockFields[ReptKey][key]}\\d*$`); // Create dynamic regex pattern based on prefix
            let value = Object.keys(List)
                .filter(key => pattern.test(key)) // Filter keys that match the dynamic pattern
                .reduce((result, key) => {
                    result[key] = List[key];
                    return result;
                }, {});
            // iteraing the list of data.
            let usrValues = [];
            let DataOfMetaDataAndSaveDraft = []; // storing data to use below to reupdate.
            for (let keyz in value) {
                // avoiding the first original key to be deleted or pushed to usrValues variable.
                if (keyz !== reptBlockFields[ReptKey][key]) {
                    DataOfMetaDataAndSaveDraft.push({ ...ListMeta[keyz], boolean: value[keyz] === keyz ? true : false }); // pushing data to DataOfMetaDataAndSaveDraft.
                    // delete all data repeated to that input field.
                    delete List[keyz];
                    delete ListMeta[keyz];
                    delete listForSaveDraft[keyz];
                    // is the value is same as key then boolena is true else false.
                    usrValues.push({ value: value[keyz], boolean: value[keyz] === keyz ? true : false });
                };
            };
            //iterate the usrValues.
            usrValues.forEach((data, index) => {
                // checking the boolean if boolean is true the value is similar to key so
                // the newly key which will be added as below for that key same key is added.
                SetList(oldvalue => ({
                    ...oldvalue,
                    [`${reptBlockFields[ReptKey][key]}${Number(index) + 1}`]: data["boolean"] ? `${reptBlockFields[ReptKey][key]}${Number(index) + 1}` : data["value"]
                }));
            });

            DataOfMetaDataAndSaveDraft.forEach((data, index) => { // addition of inputs that are deleted above with new modified keys. 
                SetListMeta(oldvalue => ({
                    ...oldvalue,
                    [`${reptBlockFields[ReptKey][key]}${Number(index) + 1}`]: {
                        value: data["boolean"] ? `${reptBlockFields[ReptKey][key]}${Number(index) + 1}`
                            : data["value"], dataType: data["dataType"]
                    }
                }));
                setListForSaveDraft(oldvalue => ({
                    ...oldvalue,
                    [`${reptBlockFields[ReptKey][key]}${Number(index) + 1}`]: {
                        value: data["boolean"] ? `${reptBlockFields[ReptKey][key]}${Number(index) + 1}`
                            : data["value"], dataType: data["dataType"]
                    }
                }));
            });
        };

        // setting the index back to 0 for deleted block.
        initReptIndex[ReptKey] = 0;
        // deleting the data from templateInputs 
        delete templateInputs[mainIndex][ReptKey][Object.keys(templateInputs[mainIndex][ReptKey]).length - 1];

        // deleting data from reptDataToSveDraft
        reptDataToSveDraft[ReptKey].splice(reptDataToSveDraft[ReptKey].length - 1, 1);
        updateHTML(ReptKey);
        setAllowLoader(true);
        setAppenedFormData({
            boolean: true,
            type: "delete"
        });
    };
    // modal to display the list of inputs inside the repeatAble block..
    const repetableBlock = () => {
        // check if intFldKey key has value updated.
        if (intFld.intFldKey !== "") {
            // fetch the inputs of that particular repeat block and particular index..
            let inputFields = templateInputs[intFld.intFldIndex][intFld.intFldKey][intFld.TempateInputIndex];
            // iterate and collect all the inputFields
            const array = inputFields.map(data => data.inputField);
            // allowing the rendering option after DOM is completly loaded.
            return (
                <>
                    <div className='Divo4Css'>
                        <div className='title'>
                            <span>{`${(intFld.intFldKey).substring(0, 10)} content ${(intFld.intFldKey).substring(17, intFld.intFldKey.length)}`}</span>
                        </div>
                    </div>
                    <div className='Divo4Css' >
                        <div className='title'>
                            <span>Block: </span>
                        </div>
                        <div className='titleName'>
                            <span>{Number(intFld.TempateInputIndex) + 1}</span>
                        </div>
                    </div>
                    <div className='inputHolderCss' >
                        {
                            array.map((data, index) => (
                                <div key={index} className='Divo5Css'>
                                    <div className='InputName' style={{ width: "40%", fontSize: "15px" }}>
                                        <span>{data.replace(/[0-9]/g, '')}: </span>
                                    </div>
                                    <div style={{ width: "55%" }}>
                                        <input
                                            type={inputFieldArrToModal[data.replace(/[0-9]/g, '')].inputDataType}
                                            name={inputFieldArrToModal[data.replace(/[0-9]/g, '')].inputField}
                                            id={`Repeat${data}`}
                                            defaultValue={List[data].replace(/[0-9]/g, '') === inputFieldArrToModal[data.replace(/[0-9]/g, '')].inputField ? "" : List[data]}
                                            autoCapitalize='off'
                                            className='inputCss'
                                            minLength={inputFieldArrToModal[data.replace(/[0-9]/g, '')].minLength}
                                            maxLength={inputFieldArrToModal[data.replace(/[0-9]/g, '')].maxLength}
                                            min={inputFieldArrToModal[data.replace(/[0-9]/g, '')].minRange}
                                            max={inputFieldArrToModal[data.replace(/[0-9]/g, '')].maxRange}
                                            placeholder={`${inputFieldArrToModal[data.replace(/[0-9]/g, '')].editable === 0 ? inputFieldArrToModal[data].inputField :
                                                inputFieldArrToModal[data.replace(/[0-9]/g, '')].placeHolder}`}
                                            autoComplete="true"
                                        />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className='Divo6Css'>
                        <div className='proceedCancelCss'>
                            <button className='cancelbtn' type='button' onClick={closeTheModal}>Cancel</button>
                        </div>
                        <div className='proceedCancelCss'>
                            <button onClick={e => collectInputModalDataRept(e, array)} className='proceedbtnX' type='button'>Update</button>
                        </div>
                    </div>
                </>
            );
        }



    };
    // to validate the entered data by users.
    const collectInputModalDataRept = (event, inputFieldArray) => {
        for (let key in inputFieldArray) {
            // regex validation to separate the alphabet from alpha numeric String. 
            let validationData = inputFieldArrToModal[inputFieldArray[key].replace(/[0-9]/g, '')];
            let Enteredvalue = document.getElementById(`Repeat${inputFieldArray[key]}`).value.trim();
            let validationResponse = {
                boolean: false,
                clinetResponse: "continue"
            };
            if (Enteredvalue !== "") {
                if (validationData.customValidation !== "") {
                    validationResponse = dataValidation(true, Enteredvalue, validationData.customValidation, validationData.label, validationData.inputDataType, "", "");
                } else if (validationData.inputDataType === "number") {
                    validationResponse = dataValidation(false, Number(Enteredvalue), validationData.customValidation, validationData.label, validationData.inputDataType, Number(validationData.minRange), Number(validationData.maxRange));
                } else if (validationData.inputDataType === "date") {
                    validationResponse = dataValidation(false, new Date(Enteredvalue), validationData.customValidation, validationData.label, validationData.inputDataType, new Date(validationData.minRange), new Date(validationData.maxRange));
                } else if (validationData.inputDataType === "tel") {
                    validationResponse = dataValidation(false, Enteredvalue, validationData.customValidation, validationData.label, validationData.inputDataType, "", "");
                }
                if (validationResponse.boolean) {
                    event.preventDefault();
                    confirmAlertFunction(validationResponse.clinetResponse);
                    return;
                }
            }
            else {
                if (validationData.isMandatory === 1) {
                    event.preventDefault();
                    confirmAlertFunction(`Please fill the '${validationData.label}' before proceeding`);
                    return;
                }
            }

            let userValue = "";
            let inputDataTye = validationData.inputDataType;

            // for date as DataType..
            if (validationData.inputDataType === "date" || validationData.inputDataType === "Date") {
                userValue = dateFormat(Enteredvalue);
            }
            // for all other types of data.
            if (validationData.inputDataType !== "date" && validationData.inputDataType !== "Date") {
                userValue = Enteredvalue;
            };
            SetList(oldvalue => ({
                ...oldvalue,
                [inputFieldArray[key]]: userValue,
            }));
            SetListMeta(oldvalue => ({
                ...oldvalue,
                [inputFieldArray[key]]: { value: userValue, dataType: inputDataTye }
            }));
            setListForSaveDraft(oldvalue => ({
                ...oldvalue,
                [inputFieldArray[key]]: { value: userValue, dataType: inputDataTye },
            }));

            //if the values are empty the yellow background is showen..
            if (Enteredvalue === "") {
                SetList(oldvalue => ({
                    ...oldvalue,
                    [inputFieldArray[key]]: `${inputFieldArray[key]}`,
                }));
                SetListMeta(oldvalue => ({
                    ...oldvalue,
                    [inputFieldArray[key]]: { value: inputFieldArray[key], dataType: inputDataTye }
                }));
                setListForSaveDraft(oldvalue => ({
                    ...oldvalue,
                    [inputFieldArray[key]]: { value: inputFieldArray[key], dataType: inputDataTye },
                }));
            }
        };
        setIntFld({
            intFldKey: "",
            intFldIndex: 0,
            operationFlag: false,
            TempateInputIndex: 0
        });
        setAppenedFormData({
            boolean: true,
            type: "edit"
        });
        closeTheModal();
    };
    //  collects the edited static content of repetAble block.
    const colectEditedChanges = (event) => {
        event.preventDefault();
        const parentElement = document.createElement("div");
        let repetBlockChanges = "";
        let divBlock = "";
        // checking the flag. if the operation is edit then collect the old data for operation..
        if (!intFld.operationFlag) {
            divBlock = repeatAbleBlock[intFld.intFldKey][intFld.intFldIndex];
        };
        // iterate all the tags inside and add inside the div tag..
        for (let key in childNodeOfRptBlck) {
            // if the value is node element
            // if array go to else
            if (childNodeOfRptBlck[key][Object.keys(childNodeOfRptBlck[key])[0]].nodeType === Node.ELEMENT_NODE) {
                const newTag = document.createElement(Object.keys(childNodeOfRptBlck[key])[0]);
                if ((document.getElementById(`txtArea${key}`).value).trim().length === 0) {
                    confirmAlertFunction('Please add some content before add/saving a block.');
                    return;
                }
                newTag.innerText = (document.getElementById(`txtArea${key}`).value).trim();
                parentElement.appendChild(newTag);
            }
            else {
                let array = childNodeOfRptBlck[key][Object.keys(childNodeOfRptBlck[key])[0]];
                const newTagMain = document.createElement(Object.keys(childNodeOfRptBlck[key])[0]);
                let hasSomeText = false;
                for (let keyz in array) {
                    const newTag = document.createElement(Object.keys(array[keyz])[0]);
                    // NOTAG indicate the content inside the parent tag doesn't contain any tags..
                    if (newTag.tagName === "NOTAG") {
                        // some content should be present in order to add a repeatAble block..
                        hasSomeText = document.getElementById(`txtAreaChild${keyz}${key}`).value.trim() !== "" ? true : hasSomeText
                        // creating the text node and appending to parent element..
                        newTagMain.appendChild(document.createTextNode(document.getElementById(`txtAreaChild${keyz}${key}`).value.trim()));
                    }
                    else if (newTag.tagName === "BR") {
                        newTagMain.appendChild(document.createElement("br"));
                    }
                    else {
                        hasSomeText = document.getElementById(`txtAreaChild${keyz}${key}`).value.trim() !== "" ? true : hasSomeText;
                        newTag.innerText = (document.getElementById(`txtAreaChild${keyz}${key}`).value).trim();
                        newTagMain.appendChild(newTag);
                    }
                }
                // hasSomeText boolean 'true' indiactes some contents are present.
                if (hasSomeText) {
                    parentElement.appendChild(newTagMain);
                }
                else {
                    confirmAlertFunction('Please add some content before add/saving a block.');
                    return;
                }
            }
            setIntFld({
                intFldKey: "",
                intFldIndex: 0,
                operationFlag: false,
                TempateInputIndex: 0
            });
        }

        // appending the data to the state and updating HTML..
        let contents = atob(form.HtmlBase64String);
        // replacing the new htmlBase64 which contains new rows appended..
        if (intFld.operationFlag) {
            repetBlockChanges = contents.replace(`@@repeatTag${intFld.intFldKey.substring(17, intFld.intFldKey.length)}@@`,
                `<div style="word-break: break-word;word-wrap: break-word;border:2px solid #d8f5ad;margin-bottom: 5px;width: fit-content;height: fit-content;overflow-wrap: break-word;">${parentElement.outerHTML}</div>@@repeatTag${intFld.intFldKey.substring(17, intFld.intFldKey.length)}@@`);
            setRepeatAbleBlock({
                ...repeatAbleBlock,
                [intFld.intFldKey]: [...repeatAbleBlock[intFld.intFldKey], parentElement.outerHTML]
            });
        }
        else {
            // adding value to the setRepeatAbleBlock state..
            repeatAbleBlock[intFld.intFldKey][intFld.intFldIndex] = parentElement.outerHTML;
            // replacing the string.
            repetBlockChanges = contents.replace(`${divBlock}`, `${parentElement.outerHTML}`);
        }
        setForm({
            ...form,
            HtmlBase64String: btoa(repetBlockChanges)
        });
        toast.success(intFld.intFldIndex === 0 ? "Block added!" : "Block edited!", { autoClose: 1000 });
        setChildNodeOfRptBlck([]);
        closeTheModal();
    };
    // returns the text area modal to edit the content,
    const openTxtModal = () => {
        return (
            <>
                <div className='Divo4Css'>
                    <div className='title'>
                        <span>Name: </span>
                    </div>
                    <div className='titleName'>
                        <span>{`${intFld.intFldKey.substring(0, 11)} content ${intFld.intFldKey.substring(17, intFld.intFldKey.length)}`}</span>
                    </div>
                </div>
                <div className='Divo4Css' hidden={intFld.intFldIndex === 0 ? true : false}>
                    <div className='title'>
                        <span>Block: </span>
                    </div>
                    <div className='titleName'>
                        <span>{Number(intFld.intFldIndex) + 1}</span>
                    </div>
                </div>
                <div className="ScrollBarForApproveTemp">
                    <>
                        {
                            childNodeOfRptBlck.map((data, index) => (
                                Array.isArray(data[Object.keys(data)[0]]) ? <>
                                    {
                                        data[Object.keys(data)[0]].map((data1, index1) => (
                                            // the array can also contain BR which is not required to show in text area.
                                            Object.keys(data1)[0] === "BR" ? <> </> :
                                                <textarea rows="5" cols="50" id={`txtAreaChild${index1}${index}`} key={index1} className='inputCssRT'>{Object.keys(data1)[0] !== "noTag" ? data1[Object.keys(data1)[0]].innerText : data1[Object.keys(data1)[0]]}</textarea>
                                        ))
                                    }
                                </> : <textarea rows="5" cols="50" id={`txtArea${index}`} key={index} className='inputCssRT'>{data[Object.keys(data)[0]].innerText}</textarea>
                            ))
                        }
                    </>
                </div>
                <div className='Divo6Css'>
                    <div className='proceedCancelCss'>
                        <button className='cancelbtn' type='button' onClick={closeTheModal}>Cancel</button>
                    </div>
                    <div className='proceedCancelCss'>
                        <button className='proceedbtnX' onClick={e => colectEditedChanges(e)} type='button'>{intFld.intFldIndex === 0 ? "Add" : "Update"}</button>
                    </div>
                </div>
            </>
        );
    };
    // opens modal for the repeat block with all the inputs.
    const openmodalForRepeatBlck = (event, key, inputIndex, baseIndex) => {
        // allowing input fields modal of repeat block!
        setOpenReptBlock({
            ...openReptBlock,
            openReptBlock1: true
        });
        setIntFld({
            intFldKey: key,
            intFldIndex: baseIndex,
            operationFlag: false,
            TempateInputIndex: inputIndex
        });
    };
    // renders the inputs in the form inside repeat tags based on used selection
    const renderReptBlockInputs = (event, repeatKey, index) => {
        event.preventDefault();
        initReptIndex[repeatKey] = index;
        updateHTML(repeatKey); // user selects particular block then the green highlighting needs to be performed to updateHTML() is called.
    };
    /*------------------------Repeatable blocks--------------------------------------*/


    /*------------------------File upload section--------------------------------------*/
    // to create file attachment input fields on UI.
    const createFileUploadtag = () => {
        if (fileAttahments.length !== 0) {
            return (
                <>
                    <div className="fileUploadBorder">
                        <span className="form-montrol1" style={{ marginBottom: "10px" }}>
                            Upload below documents
                        </span>
                        <div className="noteFileCss" style={{ fontFamily: "inherit" }}>
                            <span className="blink">Note:</span>
                            <br />
                            1. The maximum of 500KB file can be uploaded.
                            <div>
                                2. File format accepted (.pdf, .jpeg, .png)
                            </div>
                        </div>
                        {fileAttahments.map((posts, index) => (
                            <div
                                key={index}
                                className="OuterTagCss"
                                style={{ width: "100%" }}
                            >
                                <div
                                    className="filenameCss"
                                    style={{
                                        fontSize: "14px",
                                        fontStyle: "italic",
                                        width: "100%",
                                        paddingTop: "5px",
                                    }}
                                >
                                    <span id={posts.inputField} title={posts.fieldLable} className={posts.mandatory}>
                                        {posts.fieldLable}
                                    </span>
                                </div >
                                <div className="uploadimageCss" style={{ width: "100%" }}>
                                    <table>
                                        <tr>
                                            <td style={{ width: "70%" }}>
                                                <input
                                                    type="file"
                                                    // onChange={(e) => ChangenameInTemplate(e, posts.key)}
                                                    onChange={(e) => ChangenameInTemplate(e, e.currentTarget.id, posts.fieldLable)}
                                                    style={{
                                                        width: "90%",
                                                        border: "1px solid black",
                                                        backgroundColor: "white",
                                                        fontStyle: "italic",
                                                        borderRadius: "5px",
                                                        fontSize: "14px",
                                                    }}
                                                    accept={posts.attachmentType}
                                                    id={posts.key}
                                                />
                                            </td>
                                            <text style={{ fontSize: "120%" }}>or</text>
                                            &nbsp;
                                            <td>
                                                <BsCameraFill id={`${posts.key},${posts.fieldLable}`} style={{ fontSize: "250%", color: "#007bff" }} onClick={(e) => openCamera(e, e.currentTarget.id)} data-toggle="modal" data-target="#cameraModal"
                                                />
                                                <div className={`modal ${cameraIsOpen ? 'show' : ''}`} id="cameraModal" tabIndex="-1" aria-labelledby="cameraModalLabel" aria-hidden={!cameraIsOpen} data-backdrop="static">
                                                    <div className="modal-dialog">
                                                        <div className="modal-content" >
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="cameraModalLabel" >Camera</h5><br></br>Note: Maximum of 400kb image can be captured.
                                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={(e) => closeCamera(e)}><span aria-hidden="true">&times;</span></button>
                                                            </div>
                                                            <div className="modal-body" >
                                                                {cameraIsOpen && !captureData && (
                                                                    <div>
                                                                        {isMobile ? (
                                                                            <div>
                                                                                <FaCameraRotate onClick={(e) => handleSwitchCamera(e)} style={{ marginBottom: "2%", fontSize: "200%", color: "#007bff" }} />
                                                                            </div>
                                                                        ) : (
                                                                            <></>
                                                                        )}
                                                                        <Webcam videoConstraints={{
                                                                            facingMode: facingMode,
                                                                            autoFocus: true, // Use the autofocus state
                                                                        }}
                                                                            screenshotFormat="image/png"
                                                                            screenshotQuality={1}
                                                                            ref={webcamRef}
                                                                            imageSmoothing={true}
                                                                            className="Webcam"
                                                                        >
                                                                            {({ getScreenshot }) => (
                                                                                <button type="button" className="btn btn-success rounded-pill"
                                                                                    style={{ marginTop: "2%" }}
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        // Check if getScreenshot is available
                                                                                        if (getScreenshot) {
                                                                                            const imageSrc = getScreenshot();
                                                                                            console.log(imageSrc);
                                                                                            setCaptureData(imageSrc);
                                                                                        } else {
                                                                                            console.error("getScreenshot is not available.");
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    Capture
                                                                                </button>
                                                                            )}
                                                                        </Webcam>
                                                                    </div>
                                                                )}
                                                                {captureData && (
                                                                    <div>
                                                                        <ReactCrop crop={crop}
                                                                            onChange={c => handleCropChange(c)}
                                                                            id="reactCrop"
                                                                            aspect={aspect}
                                                                        >
                                                                            <img src={captureData} alt="Captured" /><br />
                                                                        </ReactCrop>

                                                                        <form>
                                                                            <div className="radio" style={{ fontfamily: "ui-monospace" }}>
                                                                                <text>
                                                                                    Select the size of the image
                                                                                </text> &nbsp;
                                                                                <input
                                                                                    type="radio"
                                                                                    name="CropSize"
                                                                                    id="radio"
                                                                                    value="None"
                                                                                    checked={selectedOption === 'None'}
                                                                                    onChange={handleRadioChange}
                                                                                />Original
                                                                                &nbsp;
                                                                                <input
                                                                                    type="radio"
                                                                                    name="CropSize"
                                                                                    value="A4"
                                                                                    checked={selectedOption === 'A4'}
                                                                                    onChange={handleRadioChange}
                                                                                />A4
                                                                                &nbsp;
                                                                                <input
                                                                                    type="radio"
                                                                                    name="CropSize"
                                                                                    value="pp"
                                                                                    checked={selectedOption === 'pp'}
                                                                                    onChange={handleRadioChange}
                                                                                />Passport
                                                                                &nbsp;
                                                                                <input
                                                                                    type="radio"
                                                                                    name="CropSize"
                                                                                    value="idvertical"
                                                                                    checked={selectedOption === 'idvertical'}
                                                                                    onChange={handleRadioChange}
                                                                                />ID -Portrait
                                                                                &nbsp;
                                                                                <input
                                                                                    type="radio"
                                                                                    name="CropSize"
                                                                                    value="idhorizontal"
                                                                                    checked={selectedOption === 'idhorizontal'}
                                                                                    onChange={handleRadioChange}
                                                                                />ID -Landscape
                                                                                &nbsp;
                                                                            </div>
                                                                        </form>
                                                                        {croppedImageUrl ? (
                                                                            <div style={{ textAlign: "center" }}>
                                                                                <h2 >Cropped Image:</h2>
                                                                                <img src={croppedImageUrl} alt="Cropped" />
                                                                            </div>
                                                                        ) : (<></>)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="modal-footer">
                                                                {!captureData ? (
                                                                    <div>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <button id="cropper" type="button" className="btn btn-warning rounded-pill" onClick={handleCropComplete} hidden>Crop & Preview</button>&nbsp;
                                                                        <button type="button" className="btn btn-warning rounded-pill" onClick={retakeImage}>Retake</button>&nbsp;
                                                                        <button type="button" class="btn btn-success rounded-pill" id={`${posts.key},${index}`} onClick={(e) => capturedImage(e, captureData)}  >Proceed</button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                        <br></br>
                                        <tr >
                                            {/* <td   > */}
                                            <lable id={`${posts.key},${posts.fieldLable}message`} style={{ fontSize: "13px", display: "none", color: "#620404c7" }} >
                                                {posts.fieldLable} attachment captured</lable>
                                            <div style={{ borderBottom: "1px solid #817c7c8f", marginTop: "8%" }}></div>
                                            {/* </td> */}
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            );
        }
    };
    // when file is attached, displaying file is attached on Template..
    const ChangenameInTemplate = (e, id, fieldLabel) => {
        document.getElementById(id + "," + fieldLabel + "message").style.display = "none";
        if (document.getElementById(id).files.length != 0) {
            let size = document.getElementById(id).files[0].size;
            let sizeInKB = size / 1024;
            e.preventDefault();
            if (sizeInKB > 500) {
                document.getElementById(id).files[0].value = "";
                document.getElementById(id).type = "";
                document.getElementById(id).type = "file";
                confirmAlertFunction(`Attachment cannot exceed 500KB`);
                document.getElementById(id + "1").innerHTML = `(Please Upload the attachment)`;
                document.getElementById(id + "1").style.backgroundColor = "aquamarine";
            }
            else {
                document.getElementById(id + "1").innerHTML = `Attachment Uploaded`;
                document.getElementById(id + "1").style.backgroundColor = "#ffc65e";
            }
        }
        else {
            setTemplateAttachment([]);
        }
    };
    /*------------------------File upload section--------------------------------------*/


    /*------------------------Final Proceed--------------------------------------*/

    // data validation for template inputs used in proceed function
    const dataValidationFrProceed = (validationData) => {
        setAllowLoader(false);
        let value = List[validationData.inputField] === validationData.inputField ? "" : List[validationData.inputField];
        // checking for .editable flag.
        // inputs contains .editable flag only when the template edited is done through bulk signing feature.
        if (validationData.customValidation !== "" && validationData.editable !== 0) {
            if (value === "") {
                if (validationData.isMandatory === 0) {
                    return true;
                }
                else {
                    confirmAlertForValidation(`Please fill the '${validationData.label}' before proceeding`, `${validationData.inputField}FrmInptField`);
                    return false;
                }
            }
            else {
                let responseJson = dataValidation(true, value, validationData.customValidation,
                    validationData.label, "", "", "");
                if (responseJson.boolean) {
                    setAllowLoader(true);
                    if (validationData.editable === 1) {
                        alert(responseJson.clinetResponse);
                    } else {
                        confirmAlertForValidation(responseJson.clinetResponse, `${validationData.inputField}FrmInptField`);
                    }
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        else if (validationData.isMandatory === 1 && validationData.editable !== 0) {
            if (value === "") {
                if (validationData.inputField === 1) {
                    alert(`Please fill the '${validationData.label}' before proceeding`)
                } else {
                    confirmAlertForValidation(`Please fill the '${validationData.label}' before proceeding`, `${validationData.inputField}FrmInptField`);
                }
                setAllowLoader(true);
                return false;
            }
            else {
                return true;
            }
        }
        else if (validationData.inputDataType === "number" && validationData.editable !== 0) {
            if (value !== "") {
                let validationResponse = dataValidation(false, Number(value), "",
                    validationData.label, "number", Number(validationData.minRange), Number(validationData.maxRange));
                if (validationResponse.boolean) {
                    if (validationData.editable === 1) {
                        alert(validationResponse.clinetResponse);
                    } else {
                        confirmAlertForValidation(validationResponse.clinetResponse, `${validationData.inputField}FrmInptField`);
                    }
                    setAllowLoader(true);
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                if (validationData.isMandatory === 0) {
                    return true;
                }
                else {
                    confirmAlertForValidation(`Please fill the '${validationData.label}' before proceeding`, `${validationData.inputField}FrmInptField`);
                    setAllowLoader(true);
                    return false;
                }
            }
        }
        else if (validationData.inputDataType === "date" && validationData.editable !== 0) {
            if (value !== "") {
                let validationResponse = dataValidation(false, new Date(value), "",
                    validationData.label, "date", new Date(validationData.minRange), new Date(validationData.maxRange));
                if (validationResponse.boolean) {
                    if (validationData.editable === 1) {
                        alert(validationResponse.clinetResponse);
                    } else {
                        confirmAlertForValidation(validationResponse.clinetResponse, `${validationData.inputField}FrmInptField`);
                    }
                    setAllowLoader(true);
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                if (validationData.isMandatory === 0) {
                    return true;
                }
                else {
                    confirmAlertForValidation(`Please fill the '${validationData.label}' before proceeding`, `${validationData.inputField}FrmInptField`);
                    setAllowLoader(true);
                    return false;
                }
            }
        }

        else if (validationData.inputDataType === "tel" && validationData.editable !== 0) {
            if (value !== "") {
                let validationResponse = dataValidation(false, value, "",
                    validationData.label, "tel", "", "");
                if (validationResponse.boolean) {
                    if (validationData.editable === 1) {
                        alert(validationResponse.clinetResponse);
                    } else {
                        confirmAlertForValidation(validationResponse.clinetResponse, `${validationData.inputField}FrmInptField`);
                    }
                    setAllowLoader(true);
                    return false;
                } else {
                    return true;
                }
            }
            else {
                if (validationData.isMandatory === 0) {
                    return true;
                }
                else {
                    confirmAlertForValidation(`Please fill the '${validationData.label}' before proceeding`, `${validationData.inputField}FrmInptField`);
                    setAllowLoader(true);
                    return false;
                }
            }
        }
        else {
            return true;
        }
    };
    // final procced for pdf preview..
    const proceed = (e) => {
        e.preventDefault();
        let formInputs = templateInputs;
        for (let keys in formInputs) {
            // checking the number in each JSON, Json having one key indicates it is repeatAble block.
            if (Object.keys(formInputs[keys]).length === 1) {
                let inptsInsideReptBlck = formInputs[keys][Object.keys(formInputs[keys])[0]];
                // iterating over the reptAble inputs parent.
                for (let key in inptsInsideReptBlck) {
                    // setting the index of repeatable for presently on which the data validation is performed.
                    setInitReptIndex({
                        ...initReptIndex,
                        [Object.keys(formInputs[keys])[0]]: Number(key)
                    });
                    // iterating over the reptAble inputs child.
                    for (let childKey in inptsInsideReptBlck[key]) {
                        let boolean = dataValidationFrProceed(inptsInsideReptBlck[key][childKey]);
                        // check if the returned value is true. if it is true iteration with next value else false is returned return
                        // by stopping the loop.
                        if (boolean) {
                            continue;
                        } else {
                            return;
                        }
                    }
                };
            }
            else {
                let boolean = dataValidationFrProceed(formInputs[keys]);
                // check if the returned value is true. if it is true iteration with next value else false is returned return
                // by stopping the loop.
                if (boolean) {
                    continue;
                } else {
                    return;
                }
            };

        }

        for (let keys in customFieldData) {
            e.preventDefault();
            if (customFieldData[keys].customValidation !== "" && customFieldData[keys].tobefilledby !== 1) {
                e.preventDefault();
                if (document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value + "" === "") {
                    if (customFieldData[keys].isMandatory === 0) {
                        continue;
                    }
                    else {
                        e.preventDefault();
                        confirmAlertForValidation(`Please fill the '${customFieldData[keys].label}' before proceeding`, `${customFieldData[keys].inputField}cusFrmInptField`);
                        setAllowLoader(true);
                        return;
                    }
                }
                else {
                    let responseJson = dataValidation(true, document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value + "", customFieldData[keys].customValidation,
                        customFieldData[keys].label, "", "", "");
                    if (responseJson.boolean) {
                        setAllowLoader(true);
                        e.preventDefault();
                        confirmAlertForValidation(responseJson.clinetResponse, `${customFieldData[keys].inputField}cusFrmInptField`);
                        return;
                    }
                    else {
                        continue;
                    }
                }
            }

            else if (customFieldData[keys].isMandatory === 1 && customFieldData[keys].tobefilledby !== 1) {
                if (document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value + "" === "") {
                    e.preventDefault();
                    confirmAlertForValidation(`Please fill the '${customFieldData[keys].label}' before proceeding`, `${customFieldData[keys].inputField}cusFrmInptField`);
                    setAllowLoader(true);
                    return;
                }
            }

            else if (customFieldData[keys].inputDataType === "number" && customFieldData[keys].tobefilledby !== 1) {
                if (document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value + "" !== "") {
                    let validationResponse = dataValidation(false, Number(document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value), "",
                        customFieldData[keys].label, "number", Number(customFieldData[keys].minRange), Number(customFieldData[keys].maxRange));
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        confirmAlertForValidation(validationResponse.clinetResponse, `${customFieldData[keys].inputField}cusFrmInptField`);
                        setAllowLoader(true);
                        return;
                    }
                    else {
                        continue;
                    }
                }
                else {
                    if (customFieldData[keys].isMandatory === 0) {
                        continue;
                    }
                    else {
                        e.preventDefault();
                        confirmAlertForValidation(`Please fill the '${customFieldData[keys].label}' before proceeding`, `${customFieldData[keys].inputField}cusFrmInptField`);
                        setAllowLoader(true);
                        return;
                    }
                }
            }

            else if (customFieldData[keys].inputDataType === "date" && customFieldData[keys].tobefilledby !== 1) {
                if (document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value !== "") {
                    let validationResponse = dataValidation(false, new Date(document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value), "",
                        customFieldData[keys].label, "date", new Date(customFieldData[keys].minRange), new Date(customFieldData[keys].maxRange));
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        confirmAlertForValidation(validationResponse.clinetResponse, `${customFieldData[keys].inputField}cusFrmInptField`);
                        setAllowLoader(true);
                        return;
                    }
                    else {
                        continue;
                    }
                } else {
                    e.preventDefault();
                    if (customFieldData[keys].isMandatory === 0) {
                        continue;
                    }
                    else {
                        confirmAlertForValidation(`Please fill the '${customFieldData[keys].label}' before proceeding`, `${customFieldData[keys].inputField}cusFrmInptField`);
                        setAllowLoader(true);
                        return;
                    }
                }
            }

            else if (customFieldData[keys].inputDataType === "tel" && customFieldData[keys].tobefilledby !== 1) {
                if (document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value !== "") {
                    let validationResponse = dataValidation(false, document.getElementById(`${customFieldData[keys].inputField}cusFrmInptField`).value,
                        "", customFieldData[keys].label, "tel", "", "");
                    if (validationResponse.boolean) {
                        e.preventDefault();
                        confirmAlertForValidation(validationResponse.clinetResponse, `${customFieldData[keys].inputField}cusFrmInptField`);
                        setAllowLoader(true);
                        return;
                    } else {
                        continue;
                    }
                }
                else {
                    e.preventDefault();
                    if (formInputs[keys].isMandatory === 0) {
                        continue;
                    }
                    else {
                        confirmAlertForValidation(`Please fill the '${customFieldData[keys].label}' before proceeding`, `${customFieldData[keys].inputField}cusFrmInptField`);
                        setAllowLoader(true);
                        return;
                    }
                }
            }
        }
        let checkBox = document.querySelectorAll("input[type=checkBox]");
        let radio = document.querySelectorAll("input[type=radio]");
        for (let key in tempRadioValidation) {
            let eachJsObj = tempRadioValidation[key]
            let keys = Object.keys(tempRadioValidation[key]);
            if (eachJsObj[keys[0]] === 1) {
                let name = keys[0];
                let checkIfChecked = "dontAllow";
                let radioBtnCheck = "";
                for (let i = 0; i <= radio.length - 1; i++) {
                    if (radio[i].name === name) {
                        radioBtnCheck = radio[i].id;
                        if (radio[i].checked === true) {
                            checkIfChecked = "Allow";
                        }
                        else {
                            continue;
                        }
                    }
                }
                if (checkIfChecked === "dontAllow") {
                    confirmAlertFunction(`Please check the field ${name} before proceeding`);
                    e.preventDefault();
                    const container = document.getElementById('ScrollBarX');
                    const element = document.getElementById(radioBtnCheck);
                    const containerRect = container.getBoundingClientRect();
                    const elementRect = element.getBoundingClientRect();
                    container.scroll({
                        top: elementRect.top - containerRect.top + container.scrollTop,
                        behavior: 'smooth'
                    });
                    return;
                } else {
                    continue;
                }
            }
            else {
                continue;
            }
        }

        if (radio.length !== 0) {
            for (let i = 0; i <= radio.length - 1; i++) {
                if (radio[i].checked === false) {
                    List[radio[i].id] = { value: "", dataType: "radio" };
                } else {
                    List[radio[i].id] = { value: "checked", dataType: "radio" };
                }
            }
        }

        if (checkBox.length !== 0) {
            for (let i = 0; i <= checkBox.length - 1; i++) {
                if (checkBox[i].checked === false) {
                    List[checkBox[i].id] = { value: "", dataType: "checkBox" };
                } else {
                    List[checkBox[i].id] = { value: "checked", dataType: "checkBox" };
                }
            }
        }
        //to include the custom field to the list..
        for (let key in customFieldDetail) {
            List[key] = customFieldDetail[key];
        }

        for (let key in ListMeta) {
            if (ListMeta[key].value === key) {
                let json = { value: "__________", dataType: ListMeta[key].dataType };
                List[key] = json;
            }
            else {
                List[key] = ListMeta[key];
            }
        }

        for (let key in selectDrpDwnVal) {
            if (key === `#$Drp_${selectDrpDwnVal[key]}#$`) {
                List[key] = { value: "__________" };
            }
            else {
                List[key] = { value: selectDrpDwnVal[key] };
            }
        }

        let file = document.querySelectorAll("input[type=file]");
        let totalfileuplodedcount = compareAndPrepareAttData(e, true, true);
        if (totalfileuplodedcount === "attachNeedToFill") {
            return;
        }

        // checking if the files are avialable, if existed enter the if block to creat files state;
        let isFilesAvailable = false;

        for (let index = 0; index <= file.length - 1; index++) {
            if (file[index].value !== "" || capturedImageArray.length !== 0) {
                isFilesAvailable = true;
            }
        }

        if (isFilesAvailable) {
            let count = 0;
            if (Object.keys(imageFileForSaveDraft).length !== 0) {
                for (let key in imageFileForSaveDraft) {
                    if (imageFileForSaveDraft[key].attachmentData != "") {
                        let reader = new FileReader();
                        reader.readAsDataURL(imageFileForSaveDraft[key].attachmentData);
                        reader.onload = function () {
                            templateAttachmentForProcced[count] = {
                                attachmentData: reader.result,
                                attachmentKey: key,
                                attachmentType: imageFileForSaveDraft[key].attachmentData.type,
                                attachmentLable: imageFileForSaveDraft[key].attachmentLable,
                                attachmentId: imageFileForSaveDraft[key].attachmentId,
                                attmntFileName: imageFileForSaveDraft[key].attmntFileName,
                                attachmentDimension: imageFileForSaveDraft[key].attachmentDimension,
                            };
                            count++;
                            if (count === totalfileuplodedcount) {
                                furthurproceed();
                                setimageFileForSaveDraft([]);
                            }
                        };
                        reader.onerror = function (error) {
                            console.log("Error: ", error);
                        };
                    } else {
                        templateAttachmentForProcced[count] = {
                            attachmentData: "",
                            attachmentKey: key,
                            attachmentType: imageFileForSaveDraft[key].attachmentType,
                            attachmentLable: imageFileForSaveDraft[key].attachmentLable,
                            attachmentId: imageFileForSaveDraft[key].attachmentId,
                            attmntFileName: imageFileForSaveDraft[key].attmntFileName,
                            attachmentDimension: imageFileForSaveDraft[key].attachmentDimension,
                            isAvailableInSvr: imageFileForSaveDraft[key].isAvailableInSvr,
                        };
                        count++;
                        if (count === totalfileuplodedcount) {
                            furthurproceed();
                            setimageFileForSaveDraft([]);
                        }
                    }
                }
            } else {
                furthurproceed();
                setimageFileForSaveDraft([]);
            }
        } else {
            furthurproceed();
        }
        e.preventDefault();
    };
    // Page is pushed to TempaltePDF priview page with user data's..
    const furthurproceed = () => {
        setAllowLoader(true);
        let state = {
            userDetails: List,
            templateCode: templateCode,
            templateName: templateName,
            templateAttachments: templateAttachmentForProcced,
            temptDrftRef: temptDrftRef,
            repeatAbleBlck: repeatAbleBlock,
            reptDataToSveDraft: reptDataToSveDraft,
            reptBlckOfInputs: reptBlckOfInputs
        };
        props.history.push({
            pathname: toPathName,
            frompath: fromPath,
            state: state
        });
    };
    // file attachment data. 
    const compareAndPrepareAttData = (e, makeFileToAttach, formsaveOrproceed) => {
        let mandatoryKey = "";
        let totalfileuplodedcount = 0;
        let file = document.querySelectorAll("input[type=file]");
        for (let index = 0; index <= file.length - 1; index++) {
            let id = file[index].id;
            let keyName = id.split("atchmt##")[1];
            mandatoryKey = keyName.split("##")[0];
            List[file[index].id] = { value: "" };
            listForSaveDraft[file[index].id] = { value: "" };
            if (file[index].value !== "") {
                let id = file[index].id;
                let keyName = id.split("atchmt##")[1];
                let OriginalkeyName = keyName.split("##")[0];
                let attachmentLable = document.getElementById(`${OriginalkeyName}`).title;
                e.preventDefault();
                let allowFileToAttach = true;
                if (Object.keys(templateForRendering).length != 0) {
                    for (let key in templateForRendering) {
                        if (file[index].files[0].name === templateForRendering[key].attmntFileName && file[index].id === templateForRendering[key].attachmentKey) {
                            allowFileToAttach = false;
                        }
                    }
                    if (allowFileToAttach) {
                        totalfileuplodedcount++;
                        imageFileForSaveDraft[file[index].id] = {
                            attachmentData: file[index].files[0],
                            attachmentKey: file[index].id,
                            attachmentType: file[index].files[0].type,
                            attachmentLable: attachmentLable,
                            attachmentId: id,
                            attmntFileName: file[index].files[0].name,
                        };
                        imageFileForSaveDraftTwo[file[index].id] = {
                            attachmentData: file[index].files[0],
                            attachmentKey: file[index].id,
                            attachmentType: file[index].files[0].type,
                            attachmentLable: attachmentLable,
                            attachmentId: id,
                            attmntFileName: file[index].files[0].name,
                        };
                    }
                    else {
                        if (document.getElementById(id).name === "isAvailableInSvr") {
                            totalfileuplodedcount++;
                            imageFileForSaveDraft[file[index].id] = {
                                attachmentData: "",
                                attachmentKey: id,
                                attachmentType: file[index].files[0].type,
                                attachmentLable: attachmentLable,
                                attachmentId: id,
                                attmntFileName: file[index].files[0].name,
                                isAvailableInSvr: "1"
                            };
                            imageFileForSaveDraftTwo[file[index].id] = {
                                attachmentData: "",
                                attachmentKey: id,
                                attachmentType: file[index].files[0].type,
                                attachmentLable: attachmentLable,
                                attachmentId: id,
                                attmntFileName: file[index].files[0].name,
                                isAvailableInSvr: "1"
                            };
                        }
                        else {
                            if (fromPath === "/draftTemplates" || makeFileToAttach) {
                                totalfileuplodedcount++;
                                imageFileForSaveDraft[file[index].id] = {
                                    attachmentData: file[index].files[0],
                                    attachmentKey: id,
                                    attachmentType: file[index].files[0].type,
                                    attachmentLable: attachmentLable,
                                    attachmentId: id,
                                    attmntFileName: file[index].files[0].name,
                                };
                            }
                        }
                    }
                }
                else {
                    totalfileuplodedcount++;
                    imageFileForSaveDraft[file[index].id] = {
                        attachmentData: file[index].files[0],
                        attachmentKey: file[index].id,
                        attachmentType: file[index].files[0].type,
                        attachmentLable: attachmentLable,
                        attachmentId: id,
                        attmntFileName: file[index].files[0].name,
                    };
                    imageFileForSaveDraftTwo[file[index].id] = {
                        attachmentData: file[index].files[0],
                        attachmentKey: file[index].id,
                        attachmentType: file[index].files[0].type,
                        attachmentLable: attachmentLable,
                        attachmentId: id,
                        attmntFileName: file[index].files[0].name,
                    };
                }
            }

            else {
                let fileid = file[index].id.split("##")[2];
                let id = file[index].id;
                let keyName = id.split("atchmt##")[1];
                let OriginalkeyName = keyName.split("##")[0];
                let attachmentLable = document.getElementById(`${OriginalkeyName}`).title;
                //name and data
                capturedImageArray.forEach((item, index1) => {
                    if (fileid == item.name) {
                        let allowFileToAttach = true;
                        if (Object.keys(templateForRendering).length != 0) {
                            if (allowFileToAttach) {
                                totalfileuplodedcount++;
                                imageFileForSaveDraft[file[index].id] = {
                                    attachmentData: item.data,
                                    attachmentKey: id,
                                    attachmentType: item.data.type,
                                    attachmentLable: attachmentLable,
                                    attachmentId: id,
                                    attmntFileName: item.data.name,
                                    attachmentDimension: item.attachmentDimension
                                };
                                imageFileForSaveDraftTwo[file[index].id] = {
                                    attachmentData: item.data,
                                    attachmentKey: file[index].id,
                                    attachmentType: item.data.type,
                                    attachmentLable: attachmentLable,
                                    attachmentId: id,
                                    attmntFileName: item.data.name,
                                    attachmentDimension: item.attachmentDimension
                                };
                            }
                            else {
                                if (document.getElementById(id).name === "isAvailableInSvr") {
                                    totalfileuplodedcount++;
                                    imageFileForSaveDraft[file[index].id] = {
                                        attachmentData: "",
                                        attachmentKey: id,
                                        attachmentType: item.data.type,
                                        attachmentLable: attachmentLable,
                                        attachmentId: id,
                                        attmntFileName: item.data.name,
                                        attachmentDimension: item.attachmentDimension,
                                        isAvailableInSvr: "1"
                                    };
                                    imageFileForSaveDraftTwo[file[index].id] = {
                                        attachmentData: "",
                                        attachmentKey: id,
                                        attachmentType: item.data.type,
                                        attachmentLable: attachmentLable,
                                        attachmentId: id,
                                        attmntFileName: item.data.name,
                                        attachmentDimension: item.attachmentDimension,
                                        isAvailableInSvr: "1"
                                    };
                                }
                                else {
                                    if (fromPath === "/draftTemplates" || makeFileToAttach) {
                                        totalfileuplodedcount++;
                                        imageFileForSaveDraft[file[index].id] = {
                                            attachmentData: item.data,
                                            attachmentKey: id,
                                            attachmentType: item.data.type,
                                            attachmentLable: attachmentLable,
                                            attachmentId: id,
                                            attmntFileName: item.data.name,
                                            attachmentDimension: item.attachmentDimension,
                                        };
                                    }
                                }
                            }
                        }
                        else {
                            totalfileuplodedcount++;
                            imageFileForSaveDraft[file[index].id] = {
                                attachmentData: item.data,
                                attachmentKey: file[index].id,
                                attachmentType: item.data.type,
                                attachmentLable: attachmentLable,
                                attachmentId: id,
                                attmntFileName: item.data.name,
                                attachmentDimension: item.attachmentDimension,
                            };
                            imageFileForSaveDraftTwo[file[index].id] = {
                                attachmentData: item.data,
                                attachmentKey: file[index].id,
                                attachmentType: item.data.type,
                                attachmentLable: attachmentLable,
                                attachmentId: id,
                                attmntFileName: item.data.name,
                                attachmentDimension: item.attachmentDimension,
                            };
                        }

                    }
                });
                if (formsaveOrproceed) {
                    let mandatory = document.getElementById(`${mandatoryKey}`).className;
                    let fieldLabel = document.getElementById(`${mandatoryKey}`).title;
                    let dontAllwMan = (mandatory === "true");
                    if (dontAllwMan) {
                        e.preventDefault();
                        confirmAlertFunction(`Please attach the ${fieldLabel} file before procceding`);
                        return "attachNeedToFill";
                    } else {
                        continue;
                    }
                }
            }
        }
        return (totalfileuplodedcount);
    };
    /*------------------------Final Proceed--------------------------------------*/


    /*------------------------Camera sesction--------------------------------------*/
    const handleRadioChange = (event) => {
        setSelectedOption(event.target.value);
        if (event.target.value === "A4") {
            document.getElementById("cropper").removeAttribute("hidden")
            let cropState = {}
            if (isMobile) {
                cropState = {
                    //A4
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (21.01 / (2.5 * 3.15)) * 72,
                    height: (29.62 / (2.5 * 3.15)) * 72
                };
            }
            else {
                cropState = {
                    //A4
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (21.01 / (2.5 * 1.8)) * 72,
                    height: (29.62 / (2.5 * 1.8)) * 72
                };
            }
            setAspect(cropState.width / cropState.height)
            setCrop(cropState)
        }
        else if (event.target.value === "pp") {
            document.getElementById("cropper").removeAttribute("hidden")
            let cropState = {}
            if (isMobile) {
                cropState = {
                    // passport
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (3.5 / 2.5) * 72,
                    height: (4.5 / 2.5) * 72
                };
            }
            else {
                cropState = {
                    // passport
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (3.5 / 1.5) * 72,
                    height: (4.5 / 1.5) * 72
                };
            }
            setAspect(cropState.width / cropState.height)
            setCrop(cropState)
        }
        else if (event.target.value === "idvertical") {
            document.getElementById("cropper").removeAttribute("hidden")
            let cropState = {}
            if (isMobile) {
                cropState = {
                    //vertical id 
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (5.4 / 2.5) * 72,
                    height: (8.6 / 2.5) * 72
                };
            }
            else {
                cropState = {
                    //vertical id 
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (5.4 / 1.5) * 72,
                    height: (8.6 / 1.5) * 72
                };
            }
            setAspect(cropState.width / cropState.height)
            setCrop(cropState)

        }
        else if (event.target.value === "idhorizontal") {
            document.getElementById("cropper").removeAttribute("hidden")
            let cropState = {}
            if (isMobile) {
                cropState = {
                    //horizontal id 
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (8.6 / 2.5) * 72,
                    height: (5.4 / 2.5) * 72
                };
            }
            else {
                cropState = {
                    //horizontal id 
                    unit: 'px',
                    x: 0,
                    y: 0,
                    width: (8.6 / 1.5) * 72,
                    height: (5.4 / 1.5) * 72
                };
            }
            setAspect(cropState.width / cropState.height)
            setCrop(cropState)
        }
        else {
            document.getElementById("cropper").setAttribute("hidden", "true");
            setAspect(null)
            setCrop(initialCropState)
        }
    };
    //opening camera
    const openCamera = async (e, id) => {
        // alert(id)
        e.preventDefault();
        setIterationId(id)
        setAllowLoader(false);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            if (webcamRef.current) {
                webcamRef.current.srcObject = stream;
            }
            setAllowLoader(true);
            setCameraIsOpen(true);
        } catch (error) {
            setAllowLoader(true);
            console.error('Error accessing webcam:', error);
            alert('Camera access denied. Please enable camera access in your browser settings.');
        }
    };
    //closing camera
    const closeCamera = (e) => {
        setAllowLoader(false);
        setSelectedOption('None')
        if (webcamRef.current && webcamRef.current.srcObject) {
            const stream = webcamRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        e.preventDefault();
        //clearning the image captured 
        setCaptureData(null);
        setCroppedImageUrl(null);
        // Update the state to indicate that the camera is closed
        setCameraIsOpen(false);
        //setting the cropping tool to default
        resetCropToDefault();
        setAllowLoader(true);
    };
    // retake of image
    const retakeImage = () => {
        setSelectedOption('None')
        setCaptureData(null);
        setCroppedImageUrl(null);
        resetCropToDefault();
    }
    // corp change handle.
    const handleCropChange = (newCrop) => {
        setCrop(newCrop);
        document.getElementById("cropper").removeAttribute("hidden")
    };
    // Function to reset the crop state to its initial values
    const resetCropToDefault = () => {
        setAspect(null)
        setCrop(initialCropState);
    };
    const handleCropComplete = () => {
        if (captureData) {
            const image = new Image();
            image.src = captureData;
            const canvas = document.createElement('canvas');
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(
                image,
                crop.x,
                crop.y,
                crop.width,
                crop.height,
                0,
                0,
                crop.width,
                crop.height
            );
            // Convert the cropped image to a data URL
            const croppedURL = canvas.toDataURL('image/jpeg', '0.1');
            // const croppedURL = canvas.toDataURL('image/jpeg',"0.1");
            // Set the cropped image URL
            setCroppedImageUrl(croppedURL);
        }
    };
    const handleSwitchCamera = (e) => {
        e.preventDefault();
        // Toggle between 'user' and 'environment' for front and rear view camera respectively
        const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
        setFacingMode(newFacingMode);
    };
    const capturedImage = (e, captureData) => {
        closeCamera(e);
        //setting the crop size radio to default
        document.getElementById(iterationId.split(",")[0]).value = "";
        e.preventDefault();
        let base64Data = null;
        if (croppedImageUrl) {
            confirmAlert({
                message: `Image is cropped, which image do you want to proceed with?`,
                buttons: [
                    {
                        label: "Cancel",
                        className: "cancelBtn",
                        style: { fontSize: "13px" },
                        onClick: () => {
                            //setting radio button to none(default)
                            setSelectedOption('None')
                            $('#cameraModal').modal('show')
                        },
                    },
                    {
                        label: "Original",
                        className: "confirmBtn",
                        style: { fontSize: "13px" },
                        onClick: () => {
                            //setting radio button to none(default)
                            setSelectedOption('None')
                            base64Data = captureData.split(",")[1];
                            proceedingWithImg(base64Data);
                        },
                    },
                    {
                        label: "Cropped",
                        className: "confirmBtn",
                        style: { fontSize: "13px" },
                        onClick: () => {
                            base64Data = croppedImageUrl.split(",")[1];
                            proceedingWithImg(base64Data);
                        },
                    },
                ], closeOnClickOutside: false,
            });
        }
        else {
            if (crop.x == initialCropState.x && crop.y == initialCropState.y &&
                crop.width == initialCropState.width && crop.height == initialCropState.height && crop.unit == initialCropState.unit) {
                base64Data = captureData.split(",")[1];
                proceedingWithImg(base64Data);
            }
            else {
                confirmAlert({
                    message: `Image is cropped, which image do you want to proceed with?`,
                    buttons: [
                        {
                            label: "Cancel",
                            className: "cancelBtn",
                            onClick: () => {
                                //setting radio button to none(default)
                                setSelectedOption('None')
                                $('#cameraModal').modal('show')
                            },
                        },
                        {
                            label: "Original",
                            className: "confirmBtn",
                            onClick: () => {
                                //setting radio button to none(default)
                                setSelectedOption('None')
                                base64Data = captureData.split(",")[1];
                                proceedingWithImg(base64Data);
                            },
                        },
                        {
                            label: "Cropped",
                            className: "confirmBtn",
                            onClick: () => {
                                //Cropping the image based on cropping tool position
                                const image = new Image();
                                image.src = captureData;
                                const canvas = document.createElement('canvas');
                                canvas.width = crop.width;
                                canvas.height = crop.height;
                                let ctx = canvas.getContext('2d');
                                ctx.drawImage(
                                    image,
                                    crop.x,
                                    crop.y,
                                    crop.width,
                                    crop.height,
                                    0,
                                    0,
                                    crop.width,
                                    crop.height
                                );
                                let imageURL = canvas.toDataURL('image/jpeg');
                                // let imageURL = canvas.toDataURL('image/jpeg',"0.1");
                                base64Data = imageURL.split(",")[1];
                                proceedingWithImg(base64Data);
                            },
                        },
                    ], closeOnClickOutside: false,
                });
            }
        }
        $('#cameraModal').modal('hide')
        $('.modal-backdrop').remove();
    }
    const proceedingWithImg = async (base64imgData) => {
        // Decode the base64 data
        const binaryData = atob(base64imgData);
        // Convert the binary data to Uint8Array
        const dataArray = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            dataArray[i] = binaryData.charCodeAt(i);
        }
        // Create a Blob with the appropriate MIME type
        const mime = captureData.split(";")[0].split(":")[1];
        const blob = new Blob([dataArray], { type: mime });
        // Create a File 
        const fileName = iterationId.split(",")[1] + ' (captured)-image.jpg'; // Replace with the desired file name
        const file = new File([blob], fileName, { type: mime });
        const fileSize = file.size
        const fileSizeInmb = (fileSize / (1024 * 1024)).toFixed(2);
        let compressImage = file;

        if (fileSizeInmb > 2) {
            const options = {
                maxSizeMB: 0.5, // Maximum size in megabytes
                // maxWidthOrHeight: 1024, // Maximum width or height of the output image
                // useWebWorker: true,
            };
            // Compress the image
            setAllowLoader(false);
            compressImage = await imageCompression(file, options);
            // Calculate the compressed file size after compression
            const compressfileSize = compressImage.size;
            const compressfileSizeInmb = (compressfileSize / (1024 * 1024)).toFixed(2);
            setAllowLoader(true);
        }
        //image size validation
        if (fileSizeInmb > 2) {
            //setting radio button to none(default)
            setSelectedOption('None')
            setAllowLoader(true);
            confirmAlertFunction(`Attachment cannot exceed 2mb`);
        }
        else {
            let jsonData = { "name": iterationId.split("##")[2].split(",")[0], "data": compressImage, "attachmentDimension": selectedOption }
            // setCaturedImageArray(prevArray => [...prevArray, jsonData]);
            //avoiding duplicate entries
            setCaturedImageArray(prevArray => {
                const newArray = [...prevArray];
                const newEntryString = JSON.stringify(jsonData);
                const index = newArray.findIndex(item => {
                    const itemObject = JSON.parse(JSON.stringify(item));
                    return itemObject.name === JSON.parse(newEntryString).name;
                });

                if (index !== -1) {
                    // If it  exists replace the old entry with the new one
                    newArray[index] = jsonData;
                } else {
                    // else just add another entry 
                    newArray.push(jsonData);
                }
                return newArray;
            });
            //setting radio button to none(default)
            setSelectedOption('None');
            document.getElementById(iterationId + "message").style.display = "block";
            document.getElementById(iterationId.split(",")[0] + "1").innerHTML = `Attachment Captured`;
            document.getElementById(iterationId.split(",")[0] + "1").style.backgroundColor = "#ffc65e";
            //erasing the captured image and cropped image(if any) from screen 
            setCaptureData(null);
            setCroppedImageUrl(null);
            //setting the cropping tool to default position
            resetCropToDefault();
        }
    }
    // to make the cursore pointer when
    const bigimg = (props, id) => {
        document.getElementById(id).style.cursor = "pointer";
    };
    /*------------------------Camera sesction--------------------------------------*/

    const camera = useRef(null);
    const [image, setImage] = useState(null);

    return (
        <>
            <ToastContainer></ToastContainer>
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
            <div className="temdescCss" >
                <div className="temdesContentCssTemplate" style={{ width: "50%" }}>
                    <Tooltip
                        target="tempdesc"
                        id="tooltip"
                        isOpen={tooltipOpen}
                        placement="bottom"
                    >
                        {form.templateDescription}
                    </Tooltip>
                    <span className="blink">Note: </span>
                    <span
                        onMouseOver={openToolTip}
                        onMouseLeave={closeToolTip}
                        id="tempdesc"
                    >
                        {
                            form.templateDescription.substring(0, 25) + "..."
                        }
                    </span>
                </div>
                <form id="URL" name="URL" method="POST" action="http:localhost:8090/MYSIGN/login" encType="multipart/form-data" target="my_iframe">
                </form>
                <div className="saveDraftCss">
                    <button className="btn btn-primary" onClick={e => saveDraft(e)}>Save Draft</button>
                </div>
            </div>
            <div className="mainclass">
                <div className="contentCss">
                    <div id="ScrollBarX" className="greyBackCss ScrollBarX">
                        <div className="whiteBackCss">
                            {
                                creatMyForm()
                            }
                        </div>
                    </div>
                </div>
                <div className="MainFormCss ">
                    <div id="templateInputForm" className="FormBorderCss ScrollBarX1">
                        <div className="FormCss ">
                            <h6 className=" form-montrol1 ">Fill the document details</h6>
                            <form>

                                {(templateInputs.length !== 0)
                                    ? templateInputs.map((posts, index) => (
                                        //below disabled attribute in style tag is used to.
                                        //hide the input fields if the editable key is 0.
                                        //when page is used for template signing for bulk signing.
                                        Object.keys(posts).length === 1 && Object.keys(repetBlckOfInptField).length !== 0 ?
                                            <>
                                                <div className="fileUploadBorder" style={{ marginBottom: "15px" }}>
                                                    <Accordion
                                                        style={{
                                                            backgroundColor: "#FFFFF4",
                                                            borderWidth: "3px",
                                                            borderColor: "black",
                                                            marginBottom: "5px",
                                                        }}
                                                        id={`accor${Object.keys(posts)[0]}`}
                                                        expanded={repeatDrpDwn === Object.keys(posts)[0]}
                                                        onChange={repetColapsDrpDwn(Object.keys(posts)[0])}
                                                    >
                                                        <AccordionSummary
                                                            expandIcon={<ExpandMoreIcon />}
                                                            aria-controls="panel1a-content"
                                                            id="panel1a-header"
                                                            style={{
                                                                minHeight: "30px",
                                                                height: "30px"
                                                            }}
                                                        >
                                                            <Typography >
                                                                <b style={{ fontSize: "14px" }}>Repeatable content {Object.keys(posts)[0].substring(17, Object.keys(posts)[0].length)}</b>
                                                            </Typography>
                                                        </AccordionSummary>

                                                        <div style={{ paddingRight: "7%", paddingTop: "10px", display: "flex" }} title="Add blocks!" >
                                                            <div style={{ width: "70%", display: "flex", fontSize: "13px", paddingLeft: "8%", paddingTop: "1%" }}>
                                                                <b>Selected Block: </b>
                                                                <b>&nbsp;{Number(initReptIndex[Object.keys(posts)[0]]) + 1}</b>
                                                            </div>
                                                            <div style={{ textAlignLast: "end", width: "30%" }}>
                                                                <span className="fa fa-plus" style={{ fontSize: "24px", color: "green" }} onClick={e => reptBlckWithInpField(e, Object.keys(posts)[0], index)} ></span>
                                                            </div>
                                                        </div>
                                                        <AccordionDetails >
                                                            <Typography
                                                                style={{
                                                                    width: "100%"
                                                                }}>
                                                                <div className="ScrollBarForApproveTemp" id={`${Object.keys(posts)[0]}dropDown`} style={{ backgroundColor: "floralwhite", borderRadius: "10px", maxHeight: "133px", height: "fit-Content" }}>
                                                                    {
                                                                        repetBlckOfInptField[(Object.keys(posts)[0])]?.map((headerKey, Innerindex) => (
                                                                            <>
                                                                                {
                                                                                    <div style={{ display: "flex", marginBottom: "2px" }}>
                                                                                        <div style={{ width: "20%", padding: "9px", color: "green" }} className={initReptIndex[Object.keys(posts)[0]] === Number(Innerindex) ? "fa fa-arrow-right" : ""}></div>
                                                                                        <div style={{ width: "60%", marginRight: "4px" }}>
                                                                                            <button onClick={event => renderReptBlockInputs(event, Object.keys(posts)[0], Number(Innerindex))} className="btn btn-primary" name={`Block ${Innerindex}`} style={{ width: "100%", height: "90%", fontSize: "12px" }}>{`Block ${Number(Innerindex) + 1}`}</button>
                                                                                        </div>
                                                                                        <div hidden={Innerindex === 0} title="Delete values" className="next-nav">
                                                                                            <span
                                                                                                style={{ color: "red", fontSize: "23px", padding: "3px" }}
                                                                                                className="fa fa-trash"
                                                                                                id="signerInfoRmvBtn"
                                                                                                onMouseOver={(e) => bigimg(e, "signerInfoRmvBtn")}
                                                                                                onClick={e => dleteInpReptBlck(e, Innerindex, Object.keys(posts)[0], index)}
                                                                                                title="Remove repeatable block!"
                                                                                            >
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                }
                                                                            </>
                                                                        ))
                                                                    }

                                                                </div >
                                                            </Typography>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                    {/* <div style={{ textAlign: "start", marginBottom: "8px" }} className="form-montrol1">Block {Number(initReptIndex[Object.keys(posts)[0]])+1}</div> */}
                                                    {
                                                        Object.keys(posts[Object.keys(posts)[0]]).map((value) => (
                                                            <div hidden={!(Number(value) === initReptIndex[Object.keys(posts)[0]])}>
                                                                {
                                                                    posts[Object.keys(posts)[0]][value].map((innerPosts, index) => (
                                                                        <>
                                                                            <div key={index} className="form-loop md-5">
                                                                                <label style={{ width: "100%" }}>{innerPosts.label}
                                                                                    <input
                                                                                        style={{ backgroundColor: innerPosts.editable === 0 ? "lightgrey" : "" }}
                                                                                        name={innerPosts.inputField}
                                                                                        id={`${innerPosts.inputField}FrmInptField`}
                                                                                        minLength={innerPosts.minLength}
                                                                                        maxLength={innerPosts.maxLength}
                                                                                        min={innerPosts.minRange}
                                                                                        max={innerPosts.maxRange}
                                                                                        type={innerPosts.inputDataType}
                                                                                        class="form-montrol"
                                                                                        placeholder={`${posts.editable === 0 ? innerPosts.inputField : innerPosts.placeHolder}`}
                                                                                        onChange={(e) => inputFieldOnchange(e, innerPosts.inputField, innerPosts.inputDataType)}
                                                                                        autoComplete="true"
                                                                                        defaultValue={List[innerPosts.inputField] === innerPosts.inputField ? "" : List[innerPosts.inputField]}
                                                                                    />
                                                                                </label>
                                                                            </div>
                                                                        </>
                                                                    ))

                                                                }
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </> :
                                            <div key={index} className="form-loop md-5">
                                                <label style={{ width: "100%" }}>{posts.editable === 0 ? posts.inputField : posts.label}
                                                    <input
                                                        disabled={posts.editable === 0 ? true : false}
                                                        style={{ backgroundColor: posts.editable === 0 ? "lightgrey" : "" }}
                                                        name={posts.inputField}
                                                        id={`${posts.inputField}FrmInptField`}
                                                        minLength={posts.minLength}
                                                        maxLength={posts.maxLength}
                                                        min={posts.minRange}
                                                        max={posts.maxRange}
                                                        type={posts.inputDataType}
                                                        class="form-montrol"
                                                        placeholder={`${posts.editable === 0 ? posts.inputField : posts.placeHolder}`}
                                                        onChange={(e) => inputFieldOnchange(e, posts.inputField, posts.inputDataType)}
                                                        autoComplete="true"
                                                        defaultValue={List[posts.inputField] === posts.inputField ? "" : List[posts.inputField]}
                                                    />
                                                </label>
                                            </div>
                                    ))
                                    : "No inputs present for this template."}
                                {
                                    customFieldInputForm()
                                }
                                {
                                    selectDrpArray.length !== 0 && (
                                        <div className="fileUploadBorder">
                                            <span className="form-montrol1" style={{ marginBottom: "10px" }}>
                                                Dropdown
                                            </span>
                                            {
                                                selectDrpArray.map((posts, index) => (
                                                    <div key={`${Object.keys(posts)[0]}drpDwnKey`} className='formcontroller1'>
                                                        <div className='labelCss'>
                                                            <span id='inputname'>{Object.keys(posts)[0]}</span>
                                                        </div>
                                                        <div className='inputfieldCss'>
                                                            <select id={`${Object.keys(posts)[0]}`} className='input-Montroll1Css' onChange={e => selectedValue(e, `${Object.keys(posts)[0]}`, `${Object.keys(posts)[0]}`)}>
                                                                <option key={`${Object.keys(posts)[0]}`} value='' disabled={false} hidden={false}>Choose value</option>
                                                                {
                                                                    posts[Object.keys(posts)[0]].map((item) => (
                                                                        <option key={`${item}Key`} selected={selectDrpDwnVal[`#$Drp_${Object.keys(posts)[0]}#$`] === item ? true : false} value={item} id={`${item}Option`}>{item}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>)
                                }
                                {
                                    Object.keys(repeatAbleBlock).length !== 0 && (
                                        <div className="fileUploadBorder" style={{ border: "3px solid burlywood" }}>
                                            <h6 style={{ marginBottom: "20px" }} className="form-montrol1">Add Contents</h6>
                                            {
                                                Object.keys(repeatAbleBlock).map((value, index) => (
                                                    <>
                                                        <Accordion
                                                            style={{
                                                                backgroundColor: "#FFFFF4",
                                                                borderWidth: "3px",
                                                                borderColor: "black",
                                                                marginBottom: "20px"
                                                            }}
                                                            id={`accor${value}`}
                                                            expanded={repeatDrpDwn === value}
                                                            onChange={repetColapsDrpDwn(value)}
                                                        >
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls="panel1a-content"
                                                                id="panel1a-header"
                                                                style={{
                                                                    minHeight: "30px",
                                                                    borderRadius: "10px",
                                                                    height: "30px"
                                                                }}
                                                            >
                                                                <Typography >
                                                                    <b style={{ fontSize: "14px" }}>Repeatable content {value.substring(17, value.length)}</b>
                                                                </Typography>
                                                            </AccordionSummary>
                                                            <div style={{ paddingRight: "7%", paddingTop: "10px", display: "flex" }} title="Add blocks!" >
                                                                <div style={{ textAlignLast: "end", width: "100%" }}>
                                                                    <span className="fa fa-plus" style={{ fontSize: "24px", color: "green" }} onClick={e => repeatAbleBlk(e, value, 0, true)} ></span>
                                                                </div>
                                                            </div>

                                                            <AccordionDetails >
                                                                <Typography>
                                                                    <div className="ScrollBarForApproveTemp" id={`${value}dropDown`} style={{ backgroundColor: "floralwhite", borderRadius: "10px", maxHeight: "150px", height: "fit-Content" }}>
                                                                        {
                                                                            repeatAbleBlock[value].map((headerKey, index) => (

                                                                                <>
                                                                                    {
                                                                                        <div style={{ display: "flex" }}>
                                                                                            <div style={{ width: "50%", marginRight: "4px" }}> <label style={{ width: "100%" }}>
                                                                                                <input
                                                                                                    name={`Block ${Number(index) + 1}`}
                                                                                                    type="text"
                                                                                                    class="form-montrol"
                                                                                                    autoComplete="true"
                                                                                                    disabled={true}
                                                                                                    value={`Block ${Number(index) + 1}`}
                                                                                                    style={{ height: "30px" }}
                                                                                                />
                                                                                            </label></div>
                                                                                            <div hidden={index === 0} className='editcss' title="Edit values" style={{ width: "32%", marginRight: "4px" }}>
                                                                                                <button onClick={e => repeatAbleBlk(e, value, index, false)} style={{ height: "30px" }} type='button' className='proceedbtn' name='uploadInputButton' >Edit</button>
                                                                                            </div>
                                                                                            <div hidden={index === 0} title="Delete values" className="next-nav">
                                                                                                <span
                                                                                                    style={{ color: "red", fontSize: "23px", padding: "3px" }}
                                                                                                    className="fa fa-trash"
                                                                                                    id="signerInfoRmvBtn"
                                                                                                    onMouseOver={(e) => bigimg(e, "signerInfoRmvBtn")}
                                                                                                    onClick={e => deleteReptBlock(e, index, value)}
                                                                                                    title="Remove repeatable block!"
                                                                                                >
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                    }
                                                                                </>

                                                                            ))
                                                                        }
                                                                    </div >
                                                                </Typography>
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </>
                                                ))
                                            }

                                        </div >
                                    )
                                }
                                {
                                    createFileUploadtag()
                                }
                                <div className="buttonCss">
                                    <button class="container btn btn-primary " onClick={proceed}>
                                        Proceed
                                    </button>
                                </div>
                            </form >
                        </div>
                    </div>
                </div >
                {
                    openReptBlock.openReptBlock1 && (
                        <div className="custom-modal">
                            <div className="CustomModal-content">
                                <span className="close" onClick={closeTheModal}>&times;</span>
                                {
                                    repetableBlock()
                                }
                            </div>
                        </div>
                    )
                }
                {
                    openReptBlock.allowTextArea && (
                        <div className="custom-modal">
                            <div className="CustomModal-content">
                                <span className="close" onClick={closeTheModal}>&times;</span>
                                {
                                    openTxtModal()
                                }
                            </div>
                        </div>
                    )
                }
                {
                    (allowModal.inputModal || allowModal.dropDownModal) && (
                        <div className="custom-modal">
                            <div className="CustomModal-content">
                                <span className="close" onClick={closeTheModal}>&times;</span>
                                {
                                    inputFieldModal()
                                }
                            </div>
                        </div>
                    )
                }
            </div >

        </>
    );
}
export default memo(NewTemplate);