import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { confirmAlert } from "react-confirm-alert";
import "./Upload_Home.css";
// import pdfImage from 'D:/Git Projects/docuExec-client/src/views/Icons/PDF.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileSignature, faIdCard, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { URL } from "../URLConstant";
var Loader = require("react-loader");
const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js`;
var jsPDF = require("jspdf");//For generating PDF's in Javascript

function Upload_Home(props) {

    const [loader, setLoader] = useState(true);

    const [fileNdMetaData, setFileNdMetaData] = useState({});

    const [pageDimension, setPageDimension] = useState(null);

    const [equalPageDimension, setEqualPageDimension] = useState(true);

    const [dimension, setDimension] = useState({})

    const [isDisable, setIsDisable] = useState(true);

    const [file, setFile] = useState();

    const [eSignData, setEsignData] = useState({});

    const [actvePlanData, setActivePlanData] = useState({});

    const [inQueueData, setInQueueData] = useState({});

    const [subPlnDscrpton, setSubPlnDscrpton] = useState("");

    const [curentIndex, setCurntIndex] = useState(0);

    const [subscriptionLst, setSubscriptionLst] = useState([]);

    const [isMobile, setIsMobile] = useState(false);

    const subscriptionListColor = ["linear-gradient(296deg,rgb(247, 103, 79) 0%,rgb(255, 192.78, 42.15) 100%)", "linear-gradient(296deg,rgb(174, 32, 233) 0%,rgb(241, 66, 158) 100%)"
        , "linear-gradient(296deg,rgb(44.94, 83.3, 1.11) 0%,rgb(132, 178, 63) 100%)", "linear-gradient(296deg,rgb(4.51, 56.5, 150.45) 0%,rgb(13.42, 168.29, 251.6) 100%)"
    ];

    const subcritinLstClrCheckMark = [{ "urlAndId": "paint0_linear_1_19408", "stopColor": "#F7674F", "stopColorTwo": "#FAC137" },
    { "urlAndId": "paint0_linear_25_4230", "stopColor": "#AE20E9", "stopColorTwo": "#F1429E" },
    { "urlAndId": "paint0_linear_25_4250", "stopColor": "#2D5301", "stopColorTwo": "#84B23F" },
    { "urlAndId": "paint0_linear_25_4270", "stopColor": "#053896", "stopColorTwo": "#0DA8FC" }]

    // User esign units call
    // User subscription call
    // Getflag call (KYCVerification, consentSign, etc);
    useState(() => {
        // User esign units call
        setLoader(false);
        let wallInfoData = {
            loginname: sessionStorage.getItem("username"),
            authToken: sessionStorage.getItem("authToken")
        };
        fetch(URL.getWalletInfo, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(wallInfoData)
        })
            .then((response) => {
                return response.json();
            })
            .then(async (responseJson) => {
                // Subscription call data.
                await subscriptionCall(wallInfoData);
                // Getflag call
                await getFlags(wallInfoData);
                // Subscription list call
                await subscriptionList();
                setLoader(true);
                if (responseJson.status === "SUCCESS") {
                    let responseData = responseJson;
                    // (120.00 units --->  120.00). for rendering in UI.
                    responseData["units"] = responseJson.units.split("units")[0];
                    setEsignData(responseData);
                    sessionStorage.setItem("units", responseJson.units);
                } else {
                    if (responseJson.statusDetails === "Session Expired!!") {
                        sessionStorage.clear();
                        confirmAlert({
                            message: responseJson.statusDetails,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => { props.history.push("/login") }
                                }
                            ], closeOnClickOutside: false
                        });
                    } else {
                        confirmAlert({
                            message: responseJson.statusDetails,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => { setLoader(true); }
                                }
                            ], closeOnClickOutside: false
                        });
                    }
                }
            })
            .catch((e) => {
                console.log(e);
                setLoader(true);
                confirmAlert({
                    message: 'Technical issues, Please try again later!',
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn"
                        }
                    ], closeOnClickOutside: false
                });
            });

        // Define a media query for mobile screens
        const mediaQuery = window.matchMedia("(max-width: 800px)");

        // Update the state based on the media query
        const handleMediaQueryChange = (event) => {
            setIsMobile(event.matches);
        };

        // Initial check
        setIsMobile(mediaQuery.matches);

        // Add an event listener to listen for changes
        mediaQuery.addEventListener("change", handleMediaQueryChange);

        // Cleanup the event listener on component unmount
        return () => {
            mediaQuery.removeEventListener("change", handleMediaQueryChange);
        };
    }, []);

    // User subscription call
    const subscriptionCall = (subscriptionData) => {
        fetch(URL.subscribedPlanDetails, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(subscriptionData)
        })
            .then((response) => {
                return response.json();
            })
            .then((responseJson) => {
                let uatsetupenabled = responseJson.uatsetupenabled;
                sessionStorage.setItem("uatsetupenabled", uatsetupenabled);
                if (responseJson.status === "SUCCESS") {
                    sessionStorage.setItem("planActive", true);
                    let activePlan = responseJson.activeSubscriptionPlan;
                    setActivePlanData(activePlan);
                    let inQueue = responseJson.inactiveSubscriptionPlan;
                    if (inQueue.status === "SUCCESS") {
                        setInQueueData(inQueue);
                    } else {
                        // Not subscribed with any plan
                    }
                    if (activePlan.planType == 0) {
                        setSubPlnDscrpton("Free Storage Plan");
                    } else {
                        setSubPlnDscrpton("Current Plan");
                    }
                    sessionStorage.setItem("noOfDays", activePlan.noOfDays);
                    sessionStorage.setItem("daysLeft", activePlan.daysleft);
                    sessionStorage.setItem("startDate", activePlan.startDate);
                    sessionStorage.setItem("endDate", activePlan.endDate);
                    sessionStorage.setItem("noSigns", activePlan.noSigns);
                    sessionStorage.setItem("signedcount", activePlan.signedcount);
                    sessionStorage.setItem("storagelimit", activePlan.storagelimit);
                    sessionStorage.setItem("usedstoragelimit", activePlan.usedstoragelimit);
                    sessionStorage.setItem("noOfDaysLeft", activePlan.noOfDaysLeft);
                    let defaultlimit = activePlan.storagelimit.split(" ")[0];
                    let usedlimt = activePlan.usedstoragelimit.split(" ")[0];
                    let availableStorage = (defaultlimit - usedlimt) * 1024;
                    sessionStorage.setItem("availableStorage", availableStorage);
                } else {
                    sessionStorage.setItem("planActive", false);
                    sessionStorage.setItem("planActiveDetails", responseJson.statusDetails);
                    if (responseJson.statusDetails == "Not subscribed with any plan") {

                    } else {
                        confirmAlert({
                            message: responseJson.statusDetails,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn"
                                }
                            ], closeOnClickOutside: false
                        });
                    }
                }
            })
            .catch((e) => {
                console.log(e);
                setLoader(true);
                confirmAlert({
                    message: 'Technical issues, Please try again later!',
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn"
                        }
                    ], closeOnClickOutside: false
                });
            });
    };

    // Getflag call (KYCVerification, consentSign, etc);
    const getFlags = (RqustBody) => {
        fetch(URL.getFlags, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(RqustBody),
        })
            .then((response) => {
                return response.json();
            })
            .then((responseJson) => {
                if (responseJson.status === "SUCCESS") {
                    sessionStorage.setItem("verifyMobile", responseJson.verifyMobile);
                    sessionStorage.setItem("consenteSign", responseJson.consenteSign);
                    sessionStorage.setItem("is_KYC_verified", responseJson.is_KYC_verified);
                    sessionStorage.setItem("maxFilesize", responseJson.maxFilesize);
                    //to check the role of the user to make the template groups visible(if corp admin) for voucher purchase
                    sessionStorage.setItem("roleId", responseJson.roleId);
                    if (responseJson.verifyMobile === "N") {
                        // Logic to implement
                    }
                    if (responseJson.consenteSign === "true") {
                        sessionStorage.setItem("consentFlag", responseJson.consentFlag);
                        if (responseJson.consentFlag === "N") {
                            // document.getElementById("consenteSignLink").style.display = "";
                        }
                    }
                } else {
                    if (responseJson.statusDetails === "Session Expired!!") {
                        sessionStorage.clear();
                        confirmAlert({
                            message: responseJson.statusDetails,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => { props.history.push("/login") }
                                }
                            ], closeOnClickOutside: false
                        });
                    } else {
                        confirmAlert({
                            message: responseJson.statusDetails,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn"
                                }
                            ], closeOnClickOutside: false
                        });
                    }
                }
            })
            .catch((e) => {
                console.log(e);
                setLoader(true);
                confirmAlert({
                    message: 'Technical issues, Please try again later!',
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn"
                        }
                    ], closeOnClickOutside: false
                });
            });
    };

    const subscriptionList = () => {
        var subListReqData = {
            username: "",
        };
        fetch(URL.getSubscriptionLists, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(subListReqData),
        })
            .then((response) => {
                return response.json();
            })
            .then((responseJson) => {
                if (responseJson.status === "SUCCESS") {
                    setSubscriptionLst(responseJson.list);
                } else {
                    console.log('Failed to load subscription list');
                }
            })
            .catch((e) => {
                console.log(e);
                setLoader(true);
                confirmAlert({
                    message: 'Technical issues, Please try again later!',
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn"
                        }
                    ], closeOnClickOutside: false
                });
            });
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
    };

    // Image to PDF file converter
    const imageToPDFConverter = (file) => {
        if (file) {
            var fileName = file.name;
            var name = fileName.split(".", 1);
            var srcData;
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function (fileLoadedEvent) {
                srcData = fileLoadedEvent.target.result; // <--- data: base64
                let imgHeigth;
                let imgWidth;
                var pdfWidth = 793;
                var pdfHeight = 841;
                var pdfType = "p"; //p->potrate, l->landsacpe
                var image = new Image();
                //Set the Base64 string return from FileReader as source.
                image.src = srcData;
                //Validate the File Height and Width.
                image.onload = function () {
                    imgHeigth = this.height;
                    imgWidth = this.width;
                    if (imgWidth > pdfWidth && imgHeigth < imgWidth) {
                        pdfType = "l";
                    }
                    const pdf = new jsPDF(pdfType, "mm", "a4");
                    var width = pdf.internal.pageSize.getWidth();
                    var height = pdf.internal.pageSize.getHeight();
                    if (imgWidth > pdfWidth && imgHeigth > pdfHeight) {
                        pdf.addImage(srcData, "JPEG", 0, 0, width, height);
                    } else if (imgWidth > pdfWidth && imgHeigth < pdfHeight) {
                        pdf.addImage(srcData, "JPEG", 0, 0, width, imgHeigth / 2.83465);
                    } else {
                        pdf.addImage(srcData, "JPEG", 0, 0);
                    }
                    pdf.save(name[0] + ".pdf");
                };
            };
            setLoader(true);
        } else {
            confirmAlertFunction('Upload valid image file for PDF conversion.');
        }
    };

    // To re-assign usestates as there initial value, in case any error accuring.
    const reAsignStates = () => {
        // On click of delete, make useState variable to default
        setFileNdMetaData({});
        setPageDimension(null);
        setEqualPageDimension(true);
        setDimension({});
        setIsDisable(true);
    };

    // On drop/upload of file from end-user, below function is triggred.
    const fileDrop = (files) => {
        setLoader(false);
        if (files.length > 0) {
            var file = files[0];
            if (file) {
                setFile(file);
                var filesize = files[0]?.size;
                var filesizeinKB = filesize / 1024;
                setFileNdMetaData({
                    files: files,
                    isdisable: false,
                    uploadedFileName: fileName,
                    uploadedFileSize: filesizeinKB.toFixed(2) + " KB"
                });
                if ((filesizeinKB / 1024) < 25) {
                    // Any uploaded file name shall not be more then, 128 character.
                    if (file.name.length < 128) {
                        var fileName = file.name;
                        var fleNmeWthOutExtention = fileName.split(".pdf");
                        if (fleNmeWthOutExtention.length > 2) {
                            confirmAlertFunction("Invalid file name.");
                            setLoader(true);
                        } else {
                            var reader = new FileReader();
                            reader.onloadend = async function (e) {
                                var typedarray = reader.result;
                                // For extension with .jpg and .png, the file is converted to PDF.
                                if (file.name.includes(".jpg") || file.name.includes(".png")) {
                                    // Image to PDF converter.
                                    imageToPDFConverter(file);
                                } else {
                                    //replaced the old function with the new api
                                    const loadingTask = pdfjs.getDocument(typedarray);
                                    const pdf = await loadingTask.promise;
                                    const numPages = pdf.numPages;
                                    const pageDimensions = [];
                                    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
                                        const page = await pdf.getPage(pageNumber);
                                        const viewport = page.getViewport({ scale: 1 });
                                        pageDimensions.push({
                                            pageNumber: pageNumber,
                                            width: viewport.width,
                                            height: viewport.height,
                                        });
                                    };
                                    setPageDimension(pageDimensions);
                                    // Iterate through the array and compare dimensions
                                    for (let i = 1; i < pageDimensions.length; i++) {
                                        if (pageDimensions.length != 1) {
                                            if (pageDimensions[i].width !== pageDimensions[0].width ||
                                                pageDimensions[i].height !== pageDimensions[0].height) {
                                                setEqualPageDimension(false);
                                                break;
                                            }
                                        }
                                    }
                                    loadingTask.promise.then(
                                        function (a) {
                                            a.getPage(1).then(
                                                function (b) {
                                                    var viewport = b.getViewport({ scale: 1 });
                                                    if (viewport.height != null && viewport.width != null) {
                                                        setDimension({
                                                            width: viewport.width,
                                                            height: viewport.height
                                                        });
                                                        setIsDisable(false);
                                                        setLoader(true);
                                                    } else {
                                                        reAsignStates();
                                                        confirmAlertFunction("Error reading PDF file. Please verify and upload.")
                                                    }
                                                }.bind(this))
                                                .catch(function (error) {
                                                    // Handle errors while getting the page
                                                    // Display an error message and handle the case appropriately
                                                    reAsignStates();
                                                    confirmAlertFunction("Error reading PDF file. Please verify and upload.")
                                                }.bind(this));
                                        }.bind(this))
                                        .catch((e) => {
                                            // Handle errors while loading the PDF
                                            // Display an error message and handle the case appropriately
                                            reAsignStates();
                                            confirmAlertFunction("Error reading PDF file. Please verify and upload.")
                                        });
                                }
                            }.bind(this);
                            reader.readAsArrayBuffer(file);
                        }
                    } else {
                        reAsignStates();
                        confirmAlertFunction("File name cannot be more than 128 characters");
                        setLoader(true);
                    }
                } else {
                    reAsignStates();
                    confirmAlertFunction("Uploaded files cannot exceed 25 MB. Please upload files that are smaller.");
                    setLoader(true);
                }
            } else {
                confirmAlertFunction("Please upload the valid file.");
                setLoader(true);
            }
        } else {
            confirmAlertFunction("Please select PDF file only.");
            setLoader(true);
        }
    };

    // Proceed with self signing.
    const proceedWithSelfSign = (event) => {
        setLoader(false);
        let dataForSignPreview = {
            files: file,
            height: dimension["width"],
            width: dimension["height"],
            pageDimensions: pageDimension,
            equalPageDimensions: equalPageDimension
        };

        let uplDocData = {
            loginname: sessionStorage.getItem("username"),
            authToken: sessionStorage.getItem("authToken"),
            userIP: sessionStorage.getItem("userIP"),
            docType: "PDF"
        };

        let formData = new FormData();
        formData.append("file", file);
        formData.append("inputDetails", JSON.stringify(uplDocData));

        fetch(URL.uploadDocument, {
            method: "POST",
            headers: { enctype: "multipart/form-data" },
            body: formData,
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.status === "SUCCESS") {
                    dataForSignPreview.docId = responseJson.docID;
                    if (dataForSignPreview.height != null && dataForSignPreview.width != null) {
                        props.history.push({
                            pathname: "/preview",
                            frompath: "dropdoc",
                            state: {
                                details: dataForSignPreview,
                            },
                        });
                    } else {
                        reAsignStates();
                        confirmAlertFunction("Error reading PDF file. Please upload file and try again.");
                        setLoader(true);
                    }
                } else {
                    if (responseJson.statusDetails === "Session Expired!!") {
                        sessionStorage.clear();
                        confirmAlert({
                            message: responseJson.statusDetails,
                            buttons: [
                                {
                                    label: "OK",
                                    className: "confirmBtn",
                                    onClick: () => { props.history.push("/login") }
                                },
                            ], closeOnClickOutside: false
                        });
                    } else {
                        confirmAlertFunction(responseJson.statusDetails);
                        setLoader(true);
                    }
                }
            })
            .catch(e => {
                console.log(e);
                reAsignStates();
                confirmAlertFunction("Error reading PDF file. Please upload file and try again.");
                setLoader(true);
            });
    };

    // 'signerInfo' page: Signers details collecting page.
    const clientInfoPage = () => {
        setLoader(false);
        let dataForClintInfoPage = {
            files: file,
            height: dimension["width"],
            width: dimension["height"],
            pageDimensions: pageDimension,
            equalPageDimensions: equalPageDimension
        };
        if (dataForClintInfoPage.height != null && dataForClintInfoPage.width != null) {
            setLoader(true);
            props.history.push({
                pathname: "/signerInfo",
                frompath: "dropdoc",
                state: {
                    details: dataForClintInfoPage,
                },
            });
        } else {
            reAsignStates();
            confirmAlertFunction("Error reading PDF file. Please upload file and try again.");
            setLoader(true);
        }
    }

    // Subscription in queue check.
    const checkSubscrptonInQueue = (planData) => {
        let requestBody = {
            authToken: sessionStorage.getItem("authToken"),
            loginname: sessionStorage.getItem("username")
        };
        fetch(URL.checkinQueuePlan, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                return response.json();
            })
            .then((responseJson) => {
                if (responseJson.status == "SUCCESS") {
                    setLoader(true);
                    let data = {
                        paymentType: "SUBM",
                        planID: planData.planId,
                        units: ""
                    };
                    props.history.push({
                        pathname: "/qrcode",
                        frompath: "/subscriptions",
                        state: {
                            details: data
                        },
                    });
                } else {
                    confirmAlert({
                        message: responseJson.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => { setLoader(true) }
                            },
                        ], closeOnClickOutside: false
                    });
                }
            })
            .catch(e => (e) => {
                console.log(e);
                setLoader(true);
                confirmAlert({
                    message: 'Technical issues, Please try again later!',
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn"
                        }
                    ], closeOnClickOutside: false
                });
            });
    };

    // A common function, which will decide the index value from the variable 'subscriptionListColor', which 
    // is used to add color for subscription list
    const decideIndex = (Index) => {
        // Convert input to a number for comparison
        const numericValue = parseFloat(Index / 4);
        // Check if value is an integer
        if (Number.isInteger(numericValue)) {
            return 0;
        }
        // Check if the value ends with .25
        else if ((numericValue * 100) % 100 === 25) {
            return 1;
        }
        // Check if the value ends with .5
        else if ((numericValue * 100) % 100 === 50) {
            return 2
        }
        // Check if the value ends with .75
        else {
            return 3;
        }
    };

    // To scroll the subscription list to next/previous set, on click of 'viewMore' and'viewLess' button.
    const viewToNxtLst = (currentIndex, scrollID) => {
        const container = document.getElementById('subListParent');
        const element = document.getElementById(currentIndex * scrollID);        
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const scrollLeft = container.scrollLeft;
        container.scroll({
            left: elementRect.left - containerRect.left + scrollLeft,
            behavior: 'smooth'
        });
        // Storing the scroll Index, in usestate..
        // The logic to scroll the subscription list, to next/previous the below state is used.
        setCurntIndex(currentIndex);
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
            <div className="UploadBody">

                <div className="fileUploadParent">
                    <Dropzone
                        type="file"
                        accept={[".jpg", ".gif", ".png", ".pdf"]}
                        className="drag-drop"
                        onDrop={e => fileDrop(e)}
                    >
                        {
                            isDisable ?
                                (
                                    <>
                                        <div className="DriveDIV" >
                                            <img
                                                hidden={true}
                                                className="gDriveImg"
                                                alt="Add to drive"
                                                src="https://c.animaapp.com/9x1HTYU3/img/add-to-drive@2x.png"
                                            />
                                        </div>
                                        <div className="dropInfo">
                                            <div className="upldImg" >
                                                <img
                                                    className="image"
                                                    alt="Centered"
                                                    src="https://c.animaapp.com/9x1HTYU3/img/group-44@2x.png"
                                                />
                                            </div>
                                            <div className="DrgDrpTxt">
                                                <p className="drag-drop-your-PDF">
                                                    Drag &amp; Drop your&nbsp;PDF file here
                                                </p>
                                            </div>

                                            <div className="or" >or</div>
                                            <div className="UplPDFImgBtn" >
                                                <div className="UPLPDFIMGBTN" style={{ paddingLeft: "0%" }}><button className="uploadBtn">Upload PDF</button></div>
                                                {/* <div className="UPLPDFIMGBTN" style={{ paddingLeft: "3%" }}>  <button className="uploadBtn">Upload Image</button></div> */}
                                            </div>
                                            <div className="UPLTXTPARADIV">
                                                <p className="uploadPara">
                                                    Make sure all pages of the document are in either landscape or
                                                    portrait orientation only.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="CameraClickUpld" >
                                            <div hidden={true} className="overlap-group">
                                                <img
                                                    className="photo-camera"
                                                    alt="Photo camera"
                                                    src="https://c.animaapp.com/9x1HTYU3/img/photo-camera@2x.png"
                                                />

                                                <img
                                                    className="x"
                                                    alt="X"
                                                    src="https://c.animaapp.com/9x1HTYU3/img/-x31-7@2x.png"
                                                />
                                            </div>
                                        </div>
                                    </>
                                ) :
                                (
                                    <div className="dropInfoAferDrop">
                                        <div className="PDFImageDIV" style={{ height: "50%" }}>
                                            {/* <img className="PDFImage" alt="Group" src={pdfImage} /> */}
                                        </div>
                                        <div className="UpldFleName">
                                            <span>{file.name}</span>
                                        </div>
                                        <div title="Delete uploaded document!" onClick={e => {
                                            // Stops bubbling from child element to parent element. 
                                            e.stopPropagation();
                                            // On click of delete, make useState variable to default
                                            reAsignStates();
                                        }} className="trashIconDIV" style={{ height: "20%" }}>
                                            <i style={{ color: "rgb(42 116 211)" }} id="deleteTrashIcon" onMouseEnter={e => {
                                                document.getElementById("deleteTrashIcon").style.color = "red"
                                            }} onMouseLeave={e => {
                                                document.getElementById("deleteTrashIcon").style.color = "rgb(42 116 211)"
                                            }} className="fa fa-trash trashIcon" aria-hidden="true"></i>
                                        </div>
                                        <div className="UpdSucsMesage">
                                            <span style={{ fontWeight: "700", }}>File successfully</span>
                                            <span style={{ color: "green" }} >&nbsp;uploaded!</span>
                                        </div>
                                    </div>
                                )
                        }

                    </Dropzone>


                </div>
                <div className="CardBody">
                    <div className="signature-card group" style={{ marginBottom: "6%" }}>
                        <div className="unitsDetails">
                            <div className="AvailableSign">
                                <span>Available Signatures</span>
                            </div>
                            <div className="NoOfUnitsParent" >
                                <span className="NoOfUnitsChild" >{actvePlanData["noSigns"] ? actvePlanData["noSigns"] : 0}</span>
                            </div>
                            <div className="AvailableSign" style={{ height: "10%", fontSize: "10px" }}><span>{subPlnDscrpton}</span></div>
                            <div className="topUpBtnParnt" >
                                <button onClick={e => {
                                    props.history.push("/payments/subscriptions")
                                }} className="topUpBtn">
                                    <i style={{ marginRight: "8%" }} className="fa fa-long-arrow-up" aria-hidden="true"></i>
                                    Top up</button>
                            </div>
                        </div>
                        <div className="signIcon">
                            <FontAwesomeIcon icon={faFileSignature} />
                        </div>
                    </div>

                    <div className="signature-card img">
                        <div className="unitsDetails">
                            <div className="AvailableSign">
                                <span>Available Units</span>
                            </div>
                            <div className="NoOfUnitsParent">
                                <span className="NoOfUnitsChild">{eSignData["units"]}</span>
                            </div>
                            <div className="AvailableSign" style={{ height: "10%", fontSize: "8px" }}><span>Available units</span></div>
                            <div className="topUpBtnParnt" >
                                <button onClick={e => {
                                    props.history.push("/payments/esignTopup")
                                }} className="topUpBtn">
                                    <i style={{ marginRight: "8%" }} className="fa fa-long-arrow-up" aria-hidden="true"></i>
                                    Top up</button>
                            </div>
                        </div>
                        <div className="signIcon" >
                            <FontAwesomeIcon icon={faIdCard} />
                        </div>
                    </div>
                </div>
            </div >
            <div className="SigningButtons">
                <div onClick={e => {
                    // Allow function call, only when document is uploaded.
                    if (!isDisable) {
                        proceedWithSelfSign(e);
                    } else {
                        confirmAlertFunction("Please upload the document")
                    }
                }} className="SignByme" >
                    <div title={isDisable ? "Please upload the document." : "Self signing!"} style={{ backgroundColor: (isDisable ? "#2e63da80" : "#2e63da"), cursor: (isDisable ? "no-drop" : "pointer") }} className="SignByMeDicParnt">
                        <div style={{ paddingRight: "4%" }} className="text-wrapper">Sign by me</div>
                        <img
                            className="personAndLayer"
                            alt="Person"
                            src="https://c.animaapp.com/n3lMeCcD/img/person@2x.png"
                        />
                    </div>
                </div>
                <div onClick={e => {
                    // Allow function call, only when document is uploaded.
                    if (!isDisable) {
                        clientInfoPage(e);
                    } else {
                        confirmAlertFunction("Please upload the document")
                    }
                }} className="SndFrSgning" >
                    <div title={isDisable ? "Please upload the document." : "Send for signing!"} style={{ backgroundColor: (isDisable ? "#2e63da80" : "#2e63da"), cursor: (isDisable ? "no-drop" : "pointer") }} className="SignByMeDicParnt">
                        <div style={{ paddingRight: "4%" }} className="text-wrapper">Send for signing</div>
                        <img
                            style={{ height: "24px", width: "24px" }}
                            className="personAndLayer"
                            alt="Layer"
                            src="https://c.animaapp.com/n3lMeCcD/img/layer-1.svg"
                        />
                    </div>
                </div>
            </div>
            <div>
                <div className="SubscribeHeadParent" >
                    <div className="topUpPlanParnt" >
                        <span className="subscriptinHead" >Top-Up Plans</span>
                    </div>
                    <div className="moreOrLessBtnPrnt" >
                        <div hidden={curentIndex === 0} className="viewMoreAdLessBtn" onClick={e => viewToNxtLst((curentIndex - 1), (isMobile ? 2 : 4))}>
                            <div className="chevronRight" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </div>
                            <div>
                                &nbsp;&nbsp;View Less
                            </div>
                        </div>
                        <div hidden={curentIndex === ((Math.ceil(subscriptionLst.length / (isMobile ? 2 : 4))) - 1)} className="viewMoreAdLessBtn" onClick={e => viewToNxtLst((curentIndex + 1), (isMobile ? 2 : 4))}>
                            <div>
                                View More&nbsp;&nbsp;
                            </div>
                            <div className="chevronRight" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </div>
                        </div>

                    </div>
                </div>
                <div id="subListParent" >
                    {
                        subscriptionLst.length !== 0 && (
                            subscriptionLst.map((data, index) => (
                                <div key={data.planId} id={index} className="subTypNameParent" >
                                    <div style={{ height: "12%" }}>  <span className="subTypName" >{data.descrip}</span></div>
                                    <div className="priceAndSigns" style={{ height: "30%", background: (subscriptionListColor[decideIndex(index)]) }}>
                                        <div className="price" >&#8377;{data.amount}</div>
                                        <div className="planDuraton" >For {data.noOfDays} Days</div>
                                    </div>
                                    <div style={{ height: "37%" }}>
                                        <div className="NumbrOfSgns" >
                                            <div className="NumbrOfSgnsChld1" >
                                                <svg width="18" height="18" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.934204" y="0.255615" width="7.85943" height="7.85943" rx="3.92972" fill={`url(#${subcritinLstClrCheckMark[decideIndex(index)]["urlAndId"]})`} />
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.58638 5.61653L2.20677 4.28111C2.01789 4.09828 2.02873 3.80902 2.23089 3.6382C2.43304 3.46738 2.75288 3.47721 2.94175 3.66001L4.00593 4.69009L5.69038 3.26672C5.70552 3.2539 5.72136 3.24216 5.73772 3.23137L6.52985 2.56203C6.73201 2.39121 7.05187 2.40104 7.24072 2.58387C7.4296 2.76667 7.41872 3.05595 7.2166 3.22677L4.79723 5.27116L4.79464 5.26866L3.95775 5.97585L3.58638 5.61653Z" fill="white" />
                                                    <defs>
                                                        <linearGradient id={subcritinLstClrCheckMark[decideIndex(index)]["urlAndId"]} x1="8.18852" y1="8.11505" x2="2.48092" y2="6.96789" gradientUnits="userSpaceOnUse">
                                                            <stop stop-color={subcritinLstClrCheckMark[decideIndex(index)]["stopColor"]} />
                                                            <stop offset="1" stop-color={subcritinLstClrCheckMark[decideIndex(index)]["stopColorTwo"]} />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </div>
                                            <div className="NumbrOfSgnsChld2">
                                                <span>{data.signs} Eletronic signs</span>
                                            </div>
                                        </div>
                                        <div className="NumbrOfSgns" >
                                            <div className="NumbrOfSgnsChld1" >
                                                <svg width="18" height="18" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.934204" y="0.255615" width="7.85943" height="7.85943" rx="3.92972" fill={`url(#${subcritinLstClrCheckMark[decideIndex(index)]["urlAndId"]})`} />
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.58638 5.61653L2.20677 4.28111C2.01789 4.09828 2.02873 3.80902 2.23089 3.6382C2.43304 3.46738 2.75288 3.47721 2.94175 3.66001L4.00593 4.69009L5.69038 3.26672C5.70552 3.2539 5.72136 3.24216 5.73772 3.23137L6.52985 2.56203C6.73201 2.39121 7.05187 2.40104 7.24072 2.58387C7.4296 2.76667 7.41872 3.05595 7.2166 3.22677L4.79723 5.27116L4.79464 5.26866L3.95775 5.97585L3.58638 5.61653Z" fill="white" />
                                                    <defs>
                                                        <linearGradient id={subcritinLstClrCheckMark[decideIndex(index)]["urlAndId"]} x1="8.18852" y1="8.11505" x2="2.48092" y2="6.96789" gradientUnits="userSpaceOnUse">
                                                            <stop stop-color={subcritinLstClrCheckMark[decideIndex(index)]["stopColor"]} />
                                                            <stop offset="1" stop-color={subcritinLstClrCheckMark[decideIndex(index)]["stopColorTwo"]} />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </div>
                                            <div className="NumbrOfSgnsChld2" >
                                                <span>{data.storage} Strorage</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="getStartdPrnt"  >
                                        <div className="getStarted" onClick={e => {
                                            // fetch amount and planId, and passing to a method, which checks, is user has any plan in queue.
                                            // If yes, dont allow next page, if not allow.
                                            setLoader(false);
                                            checkSubscrptonInQueue(data);
                                        }} style={{ background: (subscriptionListColor[decideIndex(index)]) }}>Get Started</div>
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
        </>
    )
}
export default Upload_Home;
