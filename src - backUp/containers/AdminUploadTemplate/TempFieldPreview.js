import React, { useEffect, useState } from 'react'
import './HtmlInput.css';
import { URL } from '../URLConstant';
import { confirmAlert } from "react-confirm-alert";
import Modal from "react-responsive-modal";
var Loader = require('react-loader');


function TempFieldPreview(props) {

    const [tempInputFields, settempInputFields] = useState({});

    const [tempDetails, setTempDetails] = useState({});

    const [htmlfile, setHtmlFile] = useState({});

    const [editedHTML, setEditedHTML] = useState("");

    const [loader, setLoader] = useState(false);

    const [fileUplaodTemplate, setFileUploadTemplate] = useState({});

    const [allowArr, setAllowArr] = useState(false);

    const [fieldDataArr, SetFiledDataArr] = useState([]);

    const [fileFieldDataArr, setfileFiledDataArr] = useState([]);

    const [radioTypValue, setradioTypValue] = useState({});

    const [userandAuth, setUserAndAuth] = useState({
        userIp: "",
        AuthToken: ""
    });

    // to render the modal used to view custom field details
    const [allowModal, setAllowModal] = useState(false);

    // used to add render tick mark added to the searchAble Fields
    const [tickMark, setTickMark] = useState([]);

    // used to send only tick mark to the server to be saved..
    const [jutSearchKey, setJutSearchKet] = useState([]);

    // to store the custom fields 
    const [customFields, setCustomFields] = useState([]);

    const [finalData, setFinalData] = useState({
        templateDetails: null,
        formDetails: null,
        fileUploadDetail: null,
        searchKeyFields: null,
        userIp: null,
        authToken: null,
        statusFlag: null,
        oldTemplateCode: null,
        customDropdownOption: null
    })

    // to store the custom fields detail (key, keysize, filledby, etc)
    const [customFieldDetail, setCustomFieldDetail] = useState({});

    // to store and render the dropdown options.
    const [dropDwnOption, setDropDwnOption] = useState([]);

    useEffect(() => {
        let userip = sessionStorage.getItem("userIP");
        let AuthToken = sessionStorage.getItem("authToken");
        const tempIF = props.location.state.templateinputFields;
        const TempDetail = props.location.state.templateDetails;
        const htmlFile1 = props.location.state.htmlFile;
        const templateFileFields = props.location.state.templateFileFields;
        const radioTypeValues = props.location.state.radioTypeValues;
        const searchAbleKeys = props.location.state.searchAbleKeys;
        setTickMark(props.location.state.searchAbleKeys);
        setCustomFields(props.location.state.customFields);
        for (let key in tempIF) {
            SetFiledDataArr(oldvalue => ([
                ...oldvalue,
                { [key]: tempIF[key] }
            ]))
        }

        for (let key in searchAbleKeys) {
            if (searchAbleKeys[key]) {
                setJutSearchKet(oldvalue => ([
                    ...oldvalue,
                    key
                ]))
            } else {
                continue;
            }
        }

        for (let key in props.location.state.customFieldSearch) {
            if (props.location.state.customFieldSearch[key][Object.keys(props.location.state.customFieldSearch[key])]) {
                setJutSearchKet(oldvalue => ([
                    ...oldvalue,
                    Object.keys(props.location.state.customFieldSearch[key])[0]
                ]))
            } else {
                continue;
            }
        }

        for (let key in templateFileFields) {
            setfileFiledDataArr(oldvalue => ([
                ...oldvalue,
                { [key]: templateFileFields[key] }
            ]))
        }

        for (let key in radioTypeValues) {
            SetFiledDataArr(oldvalue => ([
                ...oldvalue,
                { [key]: radioTypeValues[key] }
            ]))
        }


        // to append the custom fields to existing input fields..
        let customFieldsDetails = props.location.state.customFields;
        for (let key in customFieldsDetails) {
            SetFiledDataArr(oldvalue => ([
                ...oldvalue,
                { [customFieldsDetails[key].inputField]: customFieldsDetails[key] }
            ]))
        }

        // select dropdwn array creation
        let drpDwnValue = props.location.state.customDropdownOption;
        let drpDwnArray = [];
        for (let key in drpDwnValue) {
            let js = { [key]: drpDwnValue[key] };
            drpDwnArray.push(js);
        }
        setDropDwnOption(drpDwnArray);
        setUserAndAuth({
            userIp: userip,
            AuthToken: AuthToken
        });
        settempInputFields(tempIF);
        setTempDetails(TempDetail);
        setHtmlFile(htmlFile1);
        setEditedHTML(props.location.state.editedHTML);
        setFileUploadTemplate(templateFileFields);
        setradioTypValue(radioTypeValues);
        setAllowArr(true);
        setLoader(true);
    }, [])

    useEffect(() => {
        if (allowArr) {
            setFinalData({
                templateDetails: tempDetails,
                formDetails: fieldDataArr,
                fileUploadDetail: fileFieldDataArr,
                searchKeyFields: jutSearchKey,
                userIp: userandAuth.userIp,
                authToken: userandAuth.AuthToken,
                statusFlag: props.location.state.statusFlag,
                oldTemplateCode: props.location.state.oldTemplateCode,
                customDropdownOption: dropDwnOption,
            })
        }
    }, [allowArr])

    const CreateFieldDetail = () => {
        let arr = [];
        for (let key in tempInputFields) {
            arr.push(tempInputFields[key]);
        }
        return (
            <>
                {
                    arr.map((item, index) => CreateSingleFieldDetail(item, index))
                }
            </>
        )
    }

    const CreateSingleFieldDetail = (prop, index) => {
        let placeHolder = "-----";
        let maxLength = "-----"
        let minLength = "-----";
        let minRange = "-----";
        let maxRange = "-----"

        if (prop.placeHolder !== "") {
            placeHolder = prop.placeHolder;
        }
        if (prop.minLength !== "") {
            minLength = prop.minLength;
            maxLength = prop.maxLength;
        }
        if (prop.minRange !== "") {
            minRange = prop.minRange;
            maxRange = prop.maxRange;
        }

        return (
            <div key={prop.label} style={{ color: index % 2 === 0 ? "#9a7a7a" : "black" }} className='hellow'>
                <div className='headCss124' ><span id='textdecoCss'>{(prop.label).substring(0, 18)}</span></div>
                <div className='headCss12' style={{ width: "8%" }}><span id='textdecoCss'>{prop.type}</span></div>
                <div className="headCss12" style={{ width: "8%" }}><span >{tickMark[prop.inputField] ? "Yes" : "No"}</span></div>
                <div className='headCss12' style={{ width: "6%" }}><span id='textdecoCss'>{minLength}</span></div>
                <div className='headCss12' style={{ width: "6%" }}><span id='textdecoCss'>{maxLength}</span></div>
                <div className='headCss12' style={{ width: "5%" }}><span id='textdecoCss'>{minRange}</span></div>
                <div className='headCss12' style={{ width: "5%" }}><span id='textdecoCss'>{maxRange}</span></div>
                <div className='headCss123'><span id='textdecoCss'>{placeHolder}</span></div>
                <div className='headCss123' style={{ width: "16%" }}><span title={prop.inputDescription} id='textdecoCss'>{(prop.inputDescription).substring(0, 18)}</span></div>
                <div className='headCss123' style={{ width: "12%" }}><span id='textdecoCss'>{prop.customValidation}</span></div>
            </div>
        )
    }

    const returnToPreviousPage = () => {
        props.history.push({
            pathname: "/templatePreview",
            frompath: "/templateFieldPreview",
            state: {
                templateinputFields: tempInputFields,
                templateDetails: tempDetails,
                htmlFile: [htmlfile],
                templateFileFields: fileUplaodTemplate,
                radioTypeValues: radioTypValue,
                allowAftRadioCrt: props.location.state.allowAftRadioCrt,
                searchAbleKeys: tickMark,
                statusFlag: props.location.state.statusFlag,
                oldTemplateCode: props.location.state.oldTemplateCode,
                lableInput: props.location.state.lableInput,
                customFields: props.location.state.customFields,
                customFieldSearch: props.location.state.customFieldSearch,
                customDropdownOption: props.location.state.customDropdownOption,
                searchAbleKeyCount: props.location.state.searchAbleKeyCount,
                editedHTML:[editedHTML]
            }
        })
    }

    //used to create the file attachment validation table..
    const CreateFileValidationDetail = () => {
        if (Object.keys(fileUplaodTemplate).length != 0) {
            let arrForFileUploadDetail = [];
            for (let key in fileUplaodTemplate) {
                arrForFileUploadDetail.push(fileUplaodTemplate[key]);
            }
            return (
                <>
                    <div className='inputfieldHeadCss'><span>Template file upload field details</span></div>
                    <div className='a4Css' key="templateFileUploadDetails">
                        <div className='a2Css'>
                            <div className='headCsss2' style={{ width: "25%" }}><span id='textdecoCss'>Label</span></div>
                            <div className='headCsss' style={{ width: "25%", textAlign: "start" }}><span id='textdecoCss'>Field Description</span></div>
                            <div className='headCsss' style={{ width: "25%", textAlign: "start" }}><span id='textdecoCss'>Attachment Type</span></div>
                            <div className='headCsss' style={{ width: "25%", textAlign: "start" }}><span id='textdecoCss'>Attachment Size</span></div>
                        </div>
                        <div className='a5Css'>
                            {
                                arrForFileUploadDetail.map((posts, index) => (
                                    <div key={index} className='hellow' style={{ color: index % 2 === 0 ? "#9a7a7a" : "black" }}>
                                        <div className='headCss124' style={{ width: "25%" }}><span id='textdecoCss'>{posts.fieldLable}</span></div>
                                        <div className='headCss12' style={{ width: "25%", textAlign: "start" }}><span id='textdecoCss'>{posts.fieldDesc}</span></div>
                                        <div className='headCss12' style={{ width: "25%", textAlign: "start" }}><span id='textdecoCss'>{posts.attachmentType}</span></div>
                                        <div className='headCss12' style={{ width: "10%", textAlign: "center" }}><span id='textdecoCss'>{`${posts.maxAttachmentSize}KB`}</span></div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </>
            )
        }
    }

    const finalSubmission = (e) => {
        e.preventDefault();
        let fileUpldDetail = finalData.fileUploadDetail;
        let fileUpldDetArr = [];
        for (let key in fileUpldDetail) {
            let eachFileData = fileUpldDetail[key];
            fileUpldDetArr.push(eachFileData[Object.keys(eachFileData)]);
        }
        finalData.fileUploadDetail = fileUpldDetArr;
        let data = new FormData();
        data.append("jsonData", JSON.stringify(finalData));
        data.append("file", editedHTML)

        const options = {
            method: "POST",
            headers: {
                enctype: "multipart/form-data"
            },
            body: data
        };
        fetch(URL.addHtmlTempAndFormDetail, options)
            .then((response) => response.json()
                .then((data) => {
                    if (data.statusDetails === "The uploded template exists" || data.statusDetails === "The uploded template exists and active") {
                        e.preventDefault();
                        confirmAlert({
                            message: data.statusDetails,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn"
                                },
                            ],closeOnClickOutside: false
                        });
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
                            ],closeOnClickOutside: false
                        });
                    }
                    else {
                        confirmAlert({
                            message: data.statusDetails,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => {
                                        props.history.push("/uploadTemplate");
                                    },
                                },
                            ],closeOnClickOutside: false
                        });
                    }
                }))
            .catch(error => {
                console.log(error);
                confirmAlert({
                    message: `SomeThing Went Wrong PLease Try Again`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ],closeOnClickOutside: false
                });
            })
    }

    const isMandOrNot = (value) => {
        if (value === 1) {
            return (
                <span>
                    Mandatory
                </span>
            )
        } else {
            return (
                <span>
                    Optional
                </span>
            )
        }
    }
    // used to create radioTypeValidation
    const CrtRadioTypDetail = () => {
        if (Object.keys(radioTypValue).length != 0) {
            let radioToRender = [];
            for (let key in radioTypValue) {
                radioToRender.push(radioTypValue[key]);
            }
            return (
                <>
                    <div className='inputfieldHeadCss'><span>Template radio button details</span></div>
                    <div className='a4Css' key="templateFileUploadDetails">
                        <div className='a2Css'>
                            <div className='headCsss2' style={{ width: "25%" }}><span id='textdecoCss'>RadioTypeName</span></div>
                            <div className='headCsss' style={{ width: "25%", textAlign: "start" }}><span id='textdecoCss'>Mandatory/Optional</span></div>
                        </div>
                        <div className='a5Css'>
                            {
                                radioToRender.map((posts, index) => (
                                    <div key={index}>
                                        <div className='hellow' style={{ color: index % 2 === 0 ? "#9a7a7a" : "black" }}>
                                            <div className='headCss124' style={{ width: "25%" }}><span id='textdecoCss'>{posts.inputField}</span></div>
                                            <div className='headCss12' style={{ width: "25%", textAlign: "start" }}><span id='textdecoCss'>{isMandOrNot(posts.isMandatory)}</span></div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </>
            )
        }
    }

    // to view the custom field details..
    const openModlForCustomKey = (event, customDetails) => {
        setCustomFieldDetail(customDetails);
        setAllowModal(true);
    }

    // to create custom field table
    const createCustomFieldTable = () => {
        if (customFields.length != 0) {
            return (
                <>
                    <div className='inputfieldHeadCss'><span>Custom field details</span></div>
                    <div className='a4Css' key="templateFileUploadDetails">
                        <div className='a2Css'>
                            <div className='headCsss2' style={{ width: "15%" }}><span id='textdecoCss'>Label</span></div>
                            <div className='headCsss' style={{ width: "8%" }}><span id='textdecoCss'>Type</span></div>
                            <div className='headCsss' style={{ width: "8%" }}><span id='textdecoCss'>Searchable</span></div>
                            <div className='headCsss' style={{ width: "5%" }} ><span id='textdecoCss'>Min <br />Length</span></div>
                            <div className='headCsss' style={{ width: "5%" }} ><span id='textdecoCss'>Max <br />Length</span></div>
                            <div className='headCsss' style={{ width: "5%" }}><span id='textdecoCss'>Min <br />Range</span></div>
                            <div className='headCsss' style={{ width: "5%" }}><span id='textdecoCss'>Max <br />Range</span></div>
                            <div className='headCsss1' style={{ width: "18%" }}><span id='textdecoCss'>Placeholder</span></div>
                            <div className='headCsss1' style={{ width: "15%" }}><span id='textdecoCss'>Input Description</span></div>
                            <div className='headCsss1' style={{ width: "11%", paddingLeft: "0px" }}><span id='textdecoCss'>Custom Validation</span></div>
                            <div className='headCsss1' style={{ width: "5%" }}><span id='textdecoCss'></span></div>
                        </div>
                        <div className='a5Css'>
                            {
                                customFields.map((posts, index) => (
                                    <div key={index} className='hellow' style={{ color: index % 2 === 0 ? "#9a7a7a" : "black", marginBottom: "0px" }}>

                                        <div className='headCss124' style={{ width: "15%", paddingTop: "8px" }}><span id='textdecoCss'>{(posts.label).substring(0, 18)}</span></div>
                                        <div className='headCss12' style={{ width: "8%", paddingTop: '8px' }}><span id='textdecoCss'>{posts.type}</span></div>
                                        <div className="headCss12" style={{ width: "8%", paddingTop: '8px' }}><span >{posts.SearchAbleKey}</span></div>
                                        <div className='headCss12' style={{ width: "5%", paddingTop: '8px' }}><span id='textdecoCss'>{posts.minLength === "" ? "-----" : posts.minLength}</span></div>
                                        <div className='headCss12' style={{ width: "5%", paddingTop: '8px' }}><span id='textdecoCss'>{posts.maxLength === "" ? "-----" : posts.maxLength}</span></div>
                                        <div className='headCss12' style={{ width: "5%", paddingTop: '8px' }}><span id='textdecoCss'>{posts.minRange === "" ? "-----" : posts.minRange}</span></div>
                                        <div className='headCss12' style={{ width: "5%", paddingTop: '8px' }}><span id='textdecoCss'>{posts.maxRange === "" ? "-----" : posts.maxRange}</span></div>
                                        <div className='headCss123' style={{ width: "18%", paddingTop: '8px' }}><span id='textdecoCss'>{posts.placeHolder}</span></div>
                                        <div className='headCss123' style={{ width: "15%", paddingTop: '8px' }}><span title={posts.inputDescription} id='textdecoCss'>{(posts.inputDescription).substring(0, 18)}</span></div>
                                        <div className='headCss123' style={{ width: "11%", paddingTop: '8px' }}><span id='textdecoCss'>{posts.customValidation}</span></div>
                                        <div style={{ width: "5%", fontFamily: 'FontAwesome' }}><button onClick={e => openModlForCustomKey(e, posts)} className='btn btn-link'>More</button></div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </>
            )
        }
    }

    // to render the custom filed modal.
    const inputFieldPreviewModal = () => {
        return (
            <div key="customFilBody" className='Divo3Css'>
                <div className='inputHolderCssCustomModal'>
                    <div className='Divo5CssCustomModal'>
                        <div className='InputNameCustomModal'>
                            <span>Custom Field Key: </span>
                        </div>
                        <div className='inputname1Custom'>
                            <input disabled={true} value={customFieldDetail.inputField} name='customFieldKey' id='customFieldKeyID' className='inputCssCustomModal' />
                        </div>
                    </div>
                    <div className='Divo5CssCustomModal' >
                        <div className='InputNameCustomModal'>
                            <span>Filled By Customer: </span>
                        </div>
                        <div className='inputname1Custom'>
                            <input disabled={true} value={customFieldDetail.customerFilled === true ? "Yes" : "No"} name='Customer' id='CustomerID' className='inputCssCustomModal' />
                        </div>
                    </div>
                    <div className='Divo5CssCustomModal' >
                        <div className='InputNameCustomModal'>
                            <span>Filled By Template Owner: </span>
                        </div>
                        <div className='inputname1Custom'>
                            <input disabled={true} value={customFieldDetail.templateGroupFilled === true ? "Yes" : "No"} name='placeHolder' className='inputCssCustomModal' />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const closeTheModal = () => {
        setAllowModal(false);
    };

    const createEachDrpDwnLine = (data, indexValue) => {
        if (data.length !== 0) {
            return (
                <div className='EachJsValue'>
                    {
                        data[Object.keys(data)[0]].map((posts, index) => (
                            < div key={index} style={{ color: indexValue % 2 === 0 ? "#9a7a7a" : "black", marginBottom: "0px" }}>{posts}</div >
                        ))
                    }
                </div>
            )
        }
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
            <div className='floatrightCss'>
                <div>
                    <button type="button" class=" btn btn-warning rounded-pill btn btn-secondary dangerbutton1" style={{ fontSize: "17px" }} onClick={returnToPreviousPage}>Edit template fields</button>
                    <button type="button" class=" btn btn-success rounded-pill btn btn-secondary" style={{ fontSize: "17px" }} onClick={e => finalSubmission(e)}>Submit</button>
                </div>
            </div>
            <div>
                <div className='mainBranchCss scrollbarx'>
                    <div className='a1Css'>
                        <div className='a2Css'>
                            <div className='headCss' style={{ width: /*"21%"*/ "24%" }}><span id='textdecoCss'>Template Name</span></div>
                            {/* <div className='headCss' style={{ width: "16%" }}><span id='textdecoCss'>Template Code</span></div> */}
                            <div className='headCss' style={{ width: /*"18%"*/"21%" }}><span id='textdecoCss'>Template Descp</span></div>
                            <div className='headCss' style={{ width: /*"13%"*/"16%" }} ><span id='textdecoCss'>Group</span></div>
                            <div className='headCss' style={{ width: /*"16%"*/"19%" }} ><span id='textdecoCss'>Sub Group</span></div>
                            <div className='headCss' style={{ width: /*"16%"*/"19%" }} ><span id='textdecoCss'>Mode of signature</span></div>
                        </div>
                        <div className='a3Css'>
                            <div className='headCss1' style={{ width: /*"21%"*/ "24%" }}><span id='textdecoCss'>{tempDetails.templateName}</span></div>
                            {/* <div className='headCss1' style={{ width: "16%" }}><span id='textdecoCss'>{tempDetails.templateCode}</span></div> */}
                            <div className='headCss1' title={tempDetails.templateDescp} style={{ width: /*"18%"*/"21%" }}><span id='textdecoCss'>{`${tempDetails.templateDescp}`.substring(0, 22) + "..."}</span></div>
                            <div className='headCss1' style={{ width: /*"13%"*/"16%" }} ><span id='textdecoCss'>{tempDetails.group}</span></div>
                            <div className='headCss1' style={{ width: /*"16%"*/"19%" }}><span id='textdecoCss'>{tempDetails.subGroup}</span></div>
                            <div className='headCss1' style={{ width: /*"16%"*/"19%" }}><span id='textdecoCss'>{tempDetails.ModeofSignatureName}</span></div>
                        </div>
                    </div>
                    <div className='inputfieldHeadCss'><span>Template field details</span></div>
                    <div className='a4Css'>
                        <div className='a2Css'>
                            <div className='headCsss2'><span id='textdecoCss'>Label</span></div>
                            <div className='headCsss' style={{ width: "8%" }}><span id='textdecoCss'>Type</span></div>
                            <div className='headCsss' style={{ width: "8%" }}><span id='textdecoCss'>Searchable</span></div>
                            <div className='headCsss' style={{ width: "6" }} ><span id='textdecoCss'>Min <br />Length</span></div>
                            <div className='headCsss' style={{ width: "6%" }} ><span id='textdecoCss'>Max <br />Length</span></div>
                            <div className='headCsss' ><span id='textdecoCss'>Min <br />Range</span></div>
                            <div className='headCsss' ><span id='textdecoCss'>Max <br />Range</span></div>
                            <div className='headCsss1'><span id='textdecoCss'>Placeholder</span></div>
                            <div className='headCsss1' style={{ width: "16%" }}><span id='textdecoCss'>Input Description</span></div>
                            <div className='headCsss1' style={{ width: "12%", paddingLeft: "0px" }}><span id='textdecoCss'>Custom Validation</span></div>
                        </div>
                        <div className='a5Css'>
                            {CreateFieldDetail()}
                        </div>
                    </div>
                    {
                        CreateFileValidationDetail()
                    }
                    {
                        CrtRadioTypDetail()
                    }
                    {
                        createCustomFieldTable()
                    }
                    {
                        dropDwnOption.length === 0 ? <> </> :
                            <div className='inputfieldHeadCss'><span>Dropdown Options</span>
                                <div className='a4Css' key="templateFileUploadDetails">
                                    <div className='a2Css'>
                                        {
                                            dropDwnOption.map((posts, index) => (
                                                <div className='headCsss2' style={{ width: "15%" }}><span id='textdecoCss'>{Object.keys(posts)[0]}</span></div>
                                            ))
                                        }
                                    </div>
                                    <div className='a5Css'>
                                        <div className='hellowDivCss'>
                                            {
                                                dropDwnOption.map((posts, index) => (
                                                    createEachDrpDwnLine(posts, index)
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div >
            <Modal className='inputTakingModel' onClose={closeTheModal} open={allowModal} center={true} closeOnOverlayClick={false}>
                <div className='WholeContent'>
                    <div className='headingOfModalXcss'>
                        <span style={{ fontSize: "22px" }}>Custom field detail</span>
                    </div>
                    <form>
                        {
                            inputFieldPreviewModal()
                        }
                    </form>
                </div>
            </Modal>
        </>
    )

}

export default TempFieldPreview