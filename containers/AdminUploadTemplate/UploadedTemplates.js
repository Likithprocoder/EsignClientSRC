import { URL } from "../URLConstant";
import React, { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "./HtmlInput.css"
import Modal from "react-responsive-modal";
import MaterialTable, { MTableToolbar } from "material-table";
import tableIcons from "../Inbox/MaterialTableIcons";
var Loader = require("react-loader");

function RejectedTemplate(props) {

    // to store the list of uploaded template.
    const [uplodedTempByMaker, seUplodedTempByMaker] = useState([]);
    const [loader, setLoader] = useState(false);
    const [allowmodal, setAllowModal] = useState(false);
    const [comments, setComments] = useState("");
    //to save the file object.
    const [fileObject, setFileObject] = useState();

    // to store the template input field details
    const [tempInputField, setTempInputField] = useState({});

    // to store the template file attachment details.
    const [tempFileAttach, setTempFileAttach] = useState({});

    // to store the template radio type input fields..
    const [tempRadioFields, setTempRadioFields] = useState({});

    // to allow the method call when data is filled 
    const [allowForTemp, setAllowFrTemp] = useState(false);

    // used to store template Details
    const [templateDetaile, settemplateDetail] = useState();

    // used to store radio keys and values
    const [radioValues, setRadioValues] = useState({});

    //used to store the custom fields.. 
    const [customField, setCustomField] = useState([]);

    // used to store the search custom fields..
    const [customFieldSet, setcustomFieldSet] = useState([]);

    // searchAbleKeys
    const [searchAbleKey, setSearchAbleKey] = useState({});

    // searchAbleKeys
    const [searchAbleKeyCount, setSearchAbleKeyCount] = useState({});

    // to store select dropdown values
    const [selectCustomField, setSelectCustomField] = useState({});

    // to store the dynamic Tables
    const [dynamic, setDynamic] = useState([]);

    const [moreinfo, setMoreinfo] = useState({
        rejectedBy: "",
        rejectedOn: "",
        templateName: "",
    });

    const [input, setinput] = useState({});

    const columns = [
        {
            title: "",
            field: "",
            cellStyle: {
                width: "1%",
                padding: "0px",
                paddingRight: "0%",
                paddingLeft: "1%",
                textAlign: "center",
            }
        },
        {
            title: "Template Name",
            field: "templateName",
            cellStyle: {
                width: "19%",
                paddingLeft: "2px"
            },
            render: (rowData) => {
                return (
                    (rowData.fileName).substring(0, 28)
                )
            }
        },
        {
            title: "Group",
            field: "groupName",
            type: "number",
            cellStyle: {
                width: "15%",
                paddingLeft: "3px"
            }
        },
        {
            title: "Sub Group",
            field: "subGroup",
            type: "string",
            cellStyle: {
                width: "14%",
                paddingLeft: "3px"
            },
        },
        {
            title: "Uploaded On",
            field: "uploadedOn",
            type: "string",
            cellStyle: {
                width: "16%",
                paddingLeft: "3px"
            }
        },
        {
            title: "Uploaded By",
            field: "uploadedBy",
            type: "string",
            cellStyle: {
                width: "15%",
                paddingLeft: "3px"
            }
        },
        {
            title: "Status",
            field: "status",
            type: "string",
            cellStyle: {
                width: "7%",
                paddingLeft: "3px"
            },
            render: (rowData) => {
                if (rowData.status === "0") {
                    return (
                        <div style={{ width: "100%", textAlign: "start", paddingTop: "7px" }}>
                            <span className="TemNameCss">
                                <span style={{ fontFamily: "inherit", fontSize: "14px", color: "red" }}>Rejected</span>
                            </span>
                        </div>
                    )
                }
                else {
                    return (
                        <div style={{ width: "100%", textAlign: "start" }}>
                            <span className="TemNameCss">
                                <div style={{ paddingTop: "8px", color: "green" }}>
                                    Not viewed
                                </div>
                            </span>
                        </div>
                    )
                }
            },
        },
        {
            title: "Actions",
            field: "",
            type: "",
            cellStyle: {
                width: "14%",
                paddingLeft: "5px",
            },
            render: (rowData) => {
                if (rowData.status === "0") {
                    return (
                        <>
                            <span className="TemNameCss">
                                <button style={{ color: " red", fontSize: "18px", padding: "0px", paddingRight: "2px" }} onClick={e => (deleteTheRejectedTemplate(rowData.templateCode, rowData.templateName))} className="btn btn-link  fa fa-trash"></button>
                                <div style={{ display: "inline-flex", height: "27px", width: "8px" }}><span style={{ fontSize: "16px", paddingTop: "5px" }}>/</span></div>
                                <button style={{ color: "##2 0a8d8", padding: "0px", paddingRight: "2px", fontSize: "14px" }} onClick={event => EditTheUploadDocu(event, rowData.templateCode)} id="editWarning" className="btn btn-link">Edit</button>
                                <div style={{ display: "inline-flex", height: "27px", width: "8px" }}><span style={{ fontSize: "16px", paddingTop: "5px" }}>/</span></div>
                                <button style={{ color: "##20a8d8", padding: "0px", fontSize: "14px" }} onClick={e => openCommentModal(rowData.comments, rowData.rejectedOn, rowData.rejectedBy, rowData.templateName)} id="editWarning" className="btn btn-link">More Info</button>
                            </span>
                        </>
                    )
                } else {
                    return (
                        <>
                            <span className="TemNameCss">
                                <button style={{ color: "red", fontSize: "20px", padding: "0px", paddingRight: "2px" }} onClick={e => (deleteTheRejectedTemplate(rowData.templateCode, rowData.templateName))} className="btn btn-link fa fa-trash"></button>
                                <div style={{ display: "inline-flex", height: "27px", width: "8px" }}><span style={{ fontSize: "16px", paddingTop: "5px" }}>/</span></div>
                                <button style={{ color: "##20a8d8", padding: "0px", fontSize: "14px" }} onClick={event => EditTheUploadDocu(event, rowData.templateCode)} id="editWarning" className="btn btn-link">Edit</button>
                            </span>
                        </>
                    )
                }
            }
        }
    ];

    useEffect(() => {
        pushToEdit();
    }, [allowForTemp])

    useEffect(() => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken")
            }),
        };

        fetch(URL.getTemplateToBeApproved, options).then((response) =>
            response.json().then((data) => {
                if (data.status === "success") {
                    seUplodedTempByMaker(data.data);
                    setLoader(true);
                } else if (data.statusDetails === "Session Expired") {
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
                } else {
                    confirmAlert({
                        message: data.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                            },
                        ],closeOnClickOutside: false
                    });
                }
                setLoader(true);
            })
        ).catch((error) => {
            console.log(error);
        })
    }, []);

    //to delete the template..
    const deleteTheRejectedTemplate = (templateCode, templateName) => {
        confirmAlert({
            title: "Confirm delete",
            message: `Do you want to delete the template "${templateName}"?`,
            buttons: [
                {
                    label: "Confirm",
                    className: "confirmBtn",
                    onClick: () => {
                        let body = {
                            authToken: sessionStorage.getItem("authToken"),
                            templateCode: templateCode,
                            userIP: sessionStorage.getItem("userIP")
                        };
                        fetch(URL.deleteRejectedTemp, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(body),
                        })
                            .then((response) => {
                                return response.json();
                            })
                            .then((responseJson) => {
                                if (responseJson.status === "success") {
                                    confirmAlert({
                                        message: responseJson.statusDetails,
                                        buttons: [
                                            {
                                                label: "OK",
                                                className: "confirmBtn",
                                                onClick: () => {
                                                    window.location.reload(false);
                                                },
                                            },
                                        ],closeOnClickOutside: false
                                    });
                                } else {
                                    confirmAlert({
                                        message: responseJson.statusDetails,
                                        buttons: [
                                            {
                                                label: "OK",
                                                className: "confirmBtn",
                                                onClick: () => { },
                                            },
                                        ],closeOnClickOutside: false
                                    });
                                }
                            });
                    },
                },
                {
                    label: "Cancel",
                    className: "cancelBtn",
                    onClick: () => { },
                },
            ],closeOnClickOutside: false
        });
    }

    // to continue the edit portion in template upload page..
    const EditTheUploadDocu = (event, templateCode) => {
        const EditData = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                authToken: sessionStorage.getItem("authToken"),
                templateCode: templateCode
            }),
        };
        fetch(URL.tempdataForEdit, EditData)
            .then((response) => response.json()
                .then((data) => {
                    if (data.status === "SUCCESS") {
                        function dataURLtoFile(dataurl, filename) {
                            var arr = dataurl.split(','),
                                mime = arr[0].match(/:(.*?);/)[1],
                                bstr = atob(arr[arr.length - 1]),
                                n = bstr.length,
                                u8arr = new Uint8Array(n);
                            while (n--) {
                                u8arr[n] = bstr.charCodeAt(n);
                            }
                            return new File([u8arr], filename, { type: "text/html" });
                        }
                        var file = dataURLtoFile(`data:text/plain;base64,${data.htmlFile}`, data.templateFileName);
                        setFileObject(file);
                        // receving the data as [], converting [] to {} and sending to template input.
                        for (let key in data.templateinputFields) {
                            setTempInputField(oldValue => ({
                                ...oldValue,
                                [Object.keys(data.templateinputFields[key])[0]]: {
                                    "label": data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].label, "placeHolder": data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].placeHolder, "inputDescription": data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].inputDescription,
                                    "type": data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].type, "minLength": data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].minLength, "maxLength": data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].maxLength,
                                    "minRange": data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].minRange, "maxRange": data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].maxRange, "inputField": data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].inputField,
                                    "isMandatory": data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].isMandatory, 
                                    "customValidation": data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].customValidation, 
                                    "SearchAbleKey": data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].SearchAbleKey,
                                    "repeatBlock":  data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].repeatBlock
                                }
                            }));
                            setinput(oldvalue => ({
                                ...oldvalue,
                                [data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].inputField]: data.templateinputFields[key][Object.keys(data.templateinputFields[key])[0]].label
                            }));
                        }

                        for (let keys in data.templateFileFields) {
                            setTempFileAttach(oldValue => ({
                                ...oldValue,
                                [data.templateFileFields[keys].inputField]: {
                                    "fieldLable": data.templateFileFields[keys].fieldLable,
                                    "inputField": data.templateFileFields[keys].inputField,
                                    "attachmentType": data.templateFileFields[keys].attachmentType,
                                    "maxAttachmentSize": data.templateFileFields[keys].maxAttachmentSize,
                                    "fieldDesc": data.templateFileFields[keys].fieldDesc,
                                    "key": data.templateFileFields[keys].key
                                }
                            }))
                        }

                        for (let key in data.radioTypeValues) {
                            setTempRadioFields(oldValue => ({
                                ...oldValue,
                                [Object.keys(data.radioTypeValues[key])[0]]: {
                                    "label": data.radioTypeValues[key][Object.keys(data.radioTypeValues[key])[0]].label, "placeHolder": data.radioTypeValues[key][Object.keys(data.radioTypeValues[key])[0]].placeHolder, "inputDescription": data.radioTypeValues[key][Object.keys(data.radioTypeValues[key])[0]].inputDescription,
                                    "type": data.radioTypeValues[key][Object.keys(data.radioTypeValues[key])[0]].type, "minLength": data.radioTypeValues[key][Object.keys(data.radioTypeValues[key])[0]].minLength, "maxLength": data.radioTypeValues[key][Object.keys(data.radioTypeValues[key])[0]].maxLength,
                                    "minRange": data.radioTypeValues[key][Object.keys(data.radioTypeValues[key])[0]].minRange, "maxRange": data.radioTypeValues[key][Object.keys(data.radioTypeValues[key])[0]].maxRange, "inputField": data.radioTypeValues[key][Object.keys(data.radioTypeValues[key])[0]].inputField,
                                    "isMandatory": data.radioTypeValues[key][Object.keys(data.radioTypeValues[key])[0]].isMandatory, 
                                    "customValidation": data.radioTypeValues[key][Object.keys(data.radioTypeValues[key])[0]].customValidation, 
                                    "SearchAbleKey": data.radioTypeValues[key][Object.keys(data.radioTypeValues[key])[0]].SearchAbleKey,
                                    "repeatBlock":  data.radioTypeValues[key][Object.keys(data.radioTypeValues[key])[0]].repeatBlock
                                }
                            }))
                        }
                        for (let key in data.customFieldsArray) {
                            let searchAble = "";
                            if (data.customFieldsArray[key].SearchAbleKey === "Yes") {
                                searchAble = true;
                            }
                            else {
                                searchAble = false;
                            }
                            setCustomField(oldValue => ([
                                ...oldValue,
                                { [data.customFieldsArray[key].inputField]: searchAble }
                            ]))
                        }

                        for (let key in data.customFieldsArray) {
                            setcustomFieldSet(oldValue => ([
                                ...oldValue,
                                {
                                    label: data.customFieldsArray[key].label,
                                    placeHolder: data.customFieldsArray[key].placeHolder,
                                    inputDescription: data.customFieldsArray[key].inputDescription,
                                    type: data.customFieldsArray[key].type,
                                    minLength: data.customFieldsArray[key].minLength,
                                    maxLength: data.customFieldsArray[key].maxLength,
                                    minRange: data.customFieldsArray[key].minRange,
                                    maxRange: data.customFieldsArray[key].maxRange,
                                    inputField: data.customFieldsArray[key].inputField,
                                    isMandatory: data.customFieldsArray[key].isMandatory,
                                    customValidation: data.customFieldsArray[key].customValidation,
                                    SearchAbleKey: data.customFieldsArray[key].SearchAbleKey,
                                    customerFilled: data.customFieldsArray[key].customerFilled,
                                    templateGroupFilled: data.customFieldsArray[key].templateGroupFilled
                                }
                            ]))
                        }
                        for (let key in data.selectDropdown) {
                            setSelectCustomField((oldvalue) => ({
                                ...oldvalue,
                                [Object.keys(data.selectDropdown[key])[0]]: data.selectDropdown[key][Object.keys(data.selectDropdown[key])[0]]
                            }))
                        }
                        settemplateDetail(data.templateDetails);
                        setRadioValues(data.allowAftRadioCrt);
                        setSearchAbleKey(data.searchAbleKeys);
                        setSearchAbleKeyCount(data.searchAbleKeyCount);
                        setDynamic(data.dynamicTable);
                        setAllowFrTemp(true);
                    } else if (data.statusDetails === "Session Expired") {
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
                                    className: "confirmBtn"
                                },
                            ],closeOnClickOutside: false
                        });
                    }
                }))
            .catch(error => {
                confirmAlert({
                    message: "Technical issue, Try again later!",
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                        },
                    ],closeOnClickOutside: false
                });
            })
    }

    // pushing the detail to htmlInput page.
    const pushToEdit = () => {
        if (allowForTemp) {
            props.history.push({
                pathname: "/templatePreview",
                frompath: "/uploadedTemplates",
                state: {
                    templateinputFields: tempInputField,// validation of template inputs.
                    templateDetails: templateDetaile,// details of defined template name,description.
                    htmlFile: [fileObject],
                    templateFileFields: tempFileAttach,// attachments details.
                    radioTypeValues: tempRadioFields,//radio made mandatory fields.
                    allowAftRadioCrt: radioValues,//radio made mandatory fields.
                    searchAbleKeys: searchAbleKey,// searchAble keys..
                    statusFlag: "1",
                    oldTemplateCode: templateDetaile.templateCode,
                    lableInput:input,
                    customFields: customFieldSet,//custom field details.
                    customFieldSearch: customField,//custom fields made searchAble keys.
                    customDropdownOption: selectCustomField,//drop down values
                    searchAbleKeyCount: searchAbleKeyCount,
                    editedHTML: [fileObject]
                }
            })
        }

    }
    //to add comments to the setState..
    const openCommentModal = (comments, rejectedByon, rejectedBy, templateName) => {
        setComments(comments);
        setMoreinfo({
            rejectedBy: rejectedBy,
            rejectedOn: rejectedByon,
            templateName: templateName,
        });
        setAllowModal(true);
    }

    const closeTheModal = () => {
        setAllowModal(false);
    };

    const showcomment = () => {
        return <>{comments}</>;
    };


    const moreInfo = () => {
        return (
            <div className="mainContentBodyCss">
                <div
                    style={{ display: "flex", marginBottom: "5px" }}
                    className="rejectedByCss"
                >
                    <div style={{ fontStyle: "inherit", fontSize: "13px", fontWeight: "500", width: "50%", display: "flex" }}>
                        {/* <span>Template name       :</span> */}
                        <div style={{ width: "85%" }}>Template name </div> <div>:</div>
                    </div>
                    <div style={{ fontSize: "13px", width: "50%", paddingTop: "1px" }}>
                        <span>{moreinfo.templateName}</span>
                    </div>
                </div>
                <div
                    style={{ display: "flex", marginBottom: "5px" }}
                    className="rejectedByCss"
                >
                    <div
                        style={{ fontStyle: "inherit", fontSize: "13px", fontWeight: "500", width: "50%", display: "flex" }}
                    >
                        <div style={{ width: "85%" }}>Rejected by</div><div>:</div>
                    </div>
                    <div style={{ fontSize: "13px", width: "50%", paddingTop: "1px" }}>
                        <span>{moreinfo.rejectedBy}</span>
                    </div>
                </div>
                <div
                    style={{ display: "flex", marginBottom: "2px" }}
                    className="rejectedOncss"
                >
                    <div
                        style={{ fontStyle: "inherit", fontSize: "13px", fontWeight: "500", width: "50%", display: "flex" }}
                    >
                        <div style={{ width: "85%" }}>Rejected time</div><div>:</div>
                    </div>
                    <div style={{ fontSize: "13px", width: "50%", paddingTop: "1px" }}>
                        <span>{moreinfo.rejectedOn}</span>
                    </div>
                </div>
                <div
                    style={{ display: "flex", marginBottom: "5px" }}
                    className="rejectedByCss"
                ></div>
                <div style={{ fontStyle: "inherit", fontSize: "13px", fontWeight: "500", width: "50%", display: "flex", marginBottom: "10px" }}>
                    <div style={{ width: "85%" }}>Reason of rejection </div> <div>:</div>
                </div>
            </div>
        );
    };


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
            <MaterialTable
                columns={columns}
                icons={tableIcons}
                data={uplodedTempByMaker}
                options={{
                    search: true,
                    // searchFieldVariant: "outlined",
                    thirdSortClick: false, //------not to Allow unsorted state on third header click------------------
                    detailPanelType: "single",
                    detailPanelColumnAlignment: "right", //-------Align detailPanel column at right side of the Table
                    actionsColumnIndex: -1, //-----------Align actions column at right side of the Table--------------
                    // searchFieldAlignment: "left", //-----Search bar alignement----------------------------------------
                    padding: "dense", //-----------Adjust table row height------------------------------------
                    sorting: true, //-----------In-built Sorting operation enabled------------------------
                    showTitle: false, //-----------make table title invisible--------------------------------
                    headerStyle: {
                        borderTop: "2px inset ",
                        top: 0,
                        borderTopWidth: "2px",
                        backgroundColor: "#e8eaf5",
                        color: "black",
                        fontWeight: "normal",
                        fontSize: "14px",
                        paddingLeft: "2px",
                        borderBottom: "2px inset ",
                    },
                    searchFieldStyle: {
                        marginTop: "0px",
                        paddingTop: "0px",
                        paddingRight: "0px",
                        color: "Black",
                        top: "0px",
                        marginBottom: "20px",
                        border: "outset",
                    },
                    pageSize: 10,
                    pageSizeOptions: [10, 15, 20],
                }}
                components={{
                    //---------Overriding the Toolbar Component and customised-----------
                    Toolbar: (props) => (
                        <div
                            style={{
                                backgroundColor: "#e8eaf5",
                                height: "35px",
                                fontSize: "6px",
                            }}
                        >
                            <MTableToolbar {...props} />
                        </div>
                    ),
                }}
            ></MaterialTable>
            <Modal
                className="inputTakingModel"
                onClose={closeTheModal}
                open={allowmodal}
                center={true}
                closeOnOverlayClick={false}
            >
                <div className="ScrollBarX1xx">
                    <div className="MoreInfoCss">{moreInfo()}</div>
                    <div className="spacingCss ">
                        <div className="TextContentCss ScrollBarForApproveTemp">{showcomment()}</div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default RejectedTemplate