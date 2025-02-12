import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import './BulkSigningCss.css'
import { confirmAlert } from 'react-confirm-alert';
import { URL as routeURl } from '../URLConstant';
import UserDetailValidation from "../Templates/UserDetailValidation";
import { bool } from "prop-types";
var Loader = require("react-loader");
var jsPDF = require("jspdf");
const pdfjsforOnDrag = require("pdfjs-dist");
pdfjsforOnDrag.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js`;

function UploadFileFrBulkSigning(props) {

    // to store the uploaded file names 
    const [uploadedFileName, setUploadedFileName] = useState({
        csvfile: {},
        html_pdfFile: {}
    })

    // to allow cursor when bth the files are uploaded.
    //0 - no files are uploaded.
    //1 - one file is uploaded.
    //2 - both the files are uploaded.
    const [filesAreUploaded, setFilesAreUplaoded] = useState(0);

    // to hold the default headers for the csv file.
    // and used for the validation.
    const csvHeaders = ["Signer Name", "Mobile No", "Email Id"];

    // to store the uploaded document to be signed.
    const [toBeSignedDoc, setToBeSignedDoc] = useState();

    // to store the csv document.
    const [toBeSignedCSV, setToBeSignedCSV] = useState();

    // to store the additional column names of the csv, that can be used to validate.
    const [additionalColumValues, setAdditionalColumValues] = useState([]);

    // to store the unique keys from HTML file.
    const [htmlKeys, setHtmlKeys] = useState([]);

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
    const [notifyDataModal, setNotifyDataModal] = useState(false);
    const [signDetails, setSignDetails] = useState({
        emailSubject: "Notification for Digital Signing",
        signerComments: "Please review and sign the document",
        docuTitle: "",
        signBy: "",
        startDate: ""
    });
    const [endDateTime, setEndDateTime] = useState("");

    const [allowLoader, setAllowLoader] = useState(true);

    const [signersCount, setSignersCount] = useState(0);

    useEffect(() => {
        document.getElementById('create-job').disabled = true;
        document.getElementById('create-job').style.cursor = "not-allowed";
        if (filesAreUploaded === 2) {
            document.getElementById('create-job').disabled = false;
            document.getElementById('create-job').style.cursor = "pointer";
            validateIsItCSV();
            setSEDate();
        }
    }, [filesAreUploaded]);

    // to display the default enddate as sign by date..
    const setSEDate = () => {
        let d = new Date();
        let e = new Date();
        e.setDate(e.getDate() + 15);
        let endDateValue = "";
        //date format yyyy-mm-dd
        if (e.getDate() < 10 && e.getMonth() < 10) {
            endDateValue = `${e.getFullYear()}-0${e.getMonth() + 1}-0${e.getDate()}`;
        } else if (e.getDate() < 10 && e.getMonth() > 9) {
            endDateValue = `${e.getFullYear()}-${e.getMonth() + 1}-0${e.getDate()}`;
        } else if (e.getDate() > 9 && e.getMonth() < 10) {
            endDateValue = `${e.getFullYear()}-0${e.getMonth() + 1}-${e.getDate()}`;
        } else {
            endDateValue = `${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()}`;
        }
        setEndDateTime(endDateValue + " " + "23:59:59");
        setSignDetails({
            ...signDetails,
            signBy: endDateValue,
            startDate: `${d.getFullYear()}-${d.getMonth() + 1
                }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
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
    }

    // To validate the CSV file and prepare the data in required format..
    const validateCSVData = (csvDataiBulk) => {
        const csvDatas = csvDataiBulk.split('\n');
        let formattedCSVData = {};
        // Firt three headers to be manditory..
        if (csvDatas.length === 0) {
            confirmAlertFunction("The uploaded file contains empty data, please add data(s) and re-upload!");
            return false;
        }
        else {
            let numberOfColumns = 0;
            let isEmpty = null;
            const headers = csvDatas[0].replace(/\r/g, '').split(',');
            if (!csvHeaders.includes(headers[0]) || !csvHeaders.includes(headers[1]) || !csvHeaders.includes(headers[2])) {
                confirmAlertFunction("The uploaded CSV contains incorrect headers, please follow the standards, or download the default CSV from the link provided below!");
                return false;
            } else {
                // Take a count of number of headers.
                // Ignore the first three mandatory columns.           
                for (let headerIndx = 0; headerIndx < headers.length; headerIndx++) {
                    if (headers[headerIndx].trim() === '') {
                        confirmAlertFunction('Please remove the empty columns and rows, and try re-uploading again!');
                        return false;
                    } else {
                        numberOfColumns++;
                        formattedCSVData[headers[headerIndx].trim()] = [];
                        if (headerIndx > 2) {

                            setAdditionalColumValues(oldvalue => ([
                                ...oldvalue,
                                headers[headerIndx].trim()]
                            ));
                        }
                    }
                };

                for (let rowIndex = 1; rowIndex < csvDatas.length; rowIndex++) {
                    let eachRowData = csvDatas[rowIndex].replace(/\r/g, '').split(',');
                    let isAllEmpty = eachRowData.filter((data) => data.trim() !== ''
                    );
                    if (isAllEmpty.length !== 0) {
                        // equal number of rows or greater then the number of columns counted..
                        if (!(eachRowData.length === numberOfColumns)) {
                            confirmAlertFunction('Uploaded CSV file contains invalid data. Please check and retry again!');
                            return false;
                        } else {
                            setSignersCount(prevCount => prevCount + 1); // Increment count by 1
                            for (let columnHeadrIndx = 0; columnHeadrIndx < headers.length; columnHeadrIndx++) {
                                let data = eachRowData[columnHeadrIndx];
                                if (data.trim() === '') {
                                    confirmAlertFunction(`The uploaded CSV file contains empty data.`);
                                    return false;
                                } else {
                                    if (columnHeadrIndx === 1) {
                                        let result = UserDetailValidation(data.trim(), "Mobile Number");
                                        if (!result || result === "isNotANumber") {
                                            confirmAlertFunction(`The uploaded CSV file contains invalid mobile number.`);
                                            return false;
                                        } else {
                                            formattedCSVData[headers[columnHeadrIndx]] = [...formattedCSVData[headers[columnHeadrIndx]], data.trim()]
                                        }
                                    }
                                    else if (columnHeadrIndx === 2) {
                                        let result = UserDetailValidation(data.trim(), "emailID");
                                        if (!result) {
                                            confirmAlertFunction(`The uploaded CSV file contains invalid emailId.`);
                                            return false;
                                        } else {
                                            formattedCSVData[headers[columnHeadrIndx]] = [...formattedCSVData[headers[columnHeadrIndx]], data.trim()]
                                        }
                                    } else {
                                        // add the data..
                                        formattedCSVData[headers[columnHeadrIndx]] = [...formattedCSVData[headers[columnHeadrIndx]], data.trim()]
                                    }
                                }
                            }
                        }
                    } else {
                        continue;
                    }
                }
            }
        };
        return formattedCSVData;
    };


    // to collect the csv file droped.
    const CsvFileDrop = (event) => {
        setSignersCount(0);
        let file = event[0];
        if (file.type === "text/csv") {
            let origFileName = (file.name).split('.')[0];
            let oriFileSize = file.size / 1000;
            // to read the contents from the csv file uploaded..
            // and perform validation.
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const validateAndUptedRsnse = validateCSVData(text);
                if (validateAndUptedRsnse !== false) {
                    setConvertedCSVData(validateAndUptedRsnse);
                    // storing csv file.
                    setToBeSignedCSV(file);
                    // storing cause the name can be displayed..
                    setUploadedFileName({
                        ...uploadedFileName,
                        csvfile: {
                            fileName: origFileName,
                            fileSize: oriFileSize
                        }
                    });
                    // to avoid the increment `filesAreUploaded` Variable.. 
                    // when both the files are uploaded..
                    if (filesAreUploaded !== 2) {
                        // signing proceed logic
                        setFilesAreUplaoded(
                            filesAreUploaded + 1
                        );
                    }
                }
            };
            reader.readAsText(file);
        }
        else {
            confirmAlertFunction("Not a valid CSV File!");
            return;
        }
    }

    // logic to fetch the unique keys from the HTML uploaded and store in an variable..
    const getKeysFromHtml = (htmlText) => {
        let allInpustFrmHTML = {};
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const htmlTag = doc.querySelector("html");
        // regex to find the input fields...
        const regexJSInput = /{{jsonObj\.[^}]+}}/g;
        // Use the match method to find all matches
        const matchesJSInput = htmlTag.textContent.match(regexJSInput);
        // If there are no matches, matches will be null, so handle that case
        const keysArrayONE = matchesJSInput ? matchesJSInput : [];
        // At this point variable 'keysArrayONE', which is above, will be holding all the inputs, including several duplicates,
        // In order to remove the duplicate keys, a JsonObject is declared, which allows only unique keys and the keys are iterated and added to 
        // the above JsonObject variable..
        for (let key in keysArrayONE) {
            allInpustFrmHTML[keysArrayONE[key]] = keysArrayONE[key];
        };
        // Iterating the unique keys, and assigning to an state.
        for (let key in allInpustFrmHTML) {
            setHtmlKeys(oldvalue => ([
                ...oldvalue,
                allInpustFrmHTML[key]
            ]));
        };
    }

    // to collect the HTML or PDF file uploaded.
    const htmlPDfFileDrop = (event) => {
        let file = event[0];
        setToBeSignedDoc(file);
        setFileName(file.name);
        if (file.type === "application/pdf" || file.type === "text/html") {
            let origFileName = (file.name).split('.')[0];
            let oriFileSize = file.size / 1000;
            if (file.type === "application/pdf") {
                setUploadedFileName({
                    ...uploadedFileName,
                    html_pdfFile: {
                        fileName: origFileName,
                        fileSize: oriFileSize,
                        fileType: "application/pdf"
                    }
                });
                // to avoid the increment `filesAreUploaded` Variable.. 
                // when both the files are uploaded..
                if (filesAreUploaded !== 2) {
                    setFilesAreUplaoded(
                        filesAreUploaded + 1
                    );
                }


            } else {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const text = e.target.result;
                    getKeysFromHtml(text);
                }
                reader.readAsText(file);
                setUploadedFileName({
                    ...uploadedFileName,
                    html_pdfFile: {
                        fileName: origFileName,
                        fileSize: oriFileSize,
                        fileType: "text/html"
                    }
                });

                // to avoid the increment `filesAreUploaded` Variable.. 
                // when both the files are uploaded..
                if (filesAreUploaded !== 2) {
                    setFilesAreUplaoded(
                        filesAreUploaded + 1
                    );
                }
            }
        }
        else {
            confirmAlertFunction("Not a valid File!");
            return;
        }
    }

    // to validate the CSV file uploaded, to check weather the CSV file contains only 3 columns
    // if the PDF file is uploaded.
    const validateIsItCSV = () => {
        if (uploadedFileName.html_pdfFile.fileType === "application/pdf") {
            if (Object.keys(convertedCSVData).length > 3) {
                setUploadedFileName({
                    ...uploadedFileName,
                    csvfile: {}
                });
                setFilesAreUplaoded(filesAreUploaded - 1);
                confirmAlertFunction("The uploaded CSV file contains unwanted columns! Please remove it and re-upload.");
            }
        }
    }

    // Modal to collect the signers notification details (Comments, Subject, etc).



    // final signing procced
    const proceedForSigning = () => {
        setAllowLoader(false);
        // Mandatory fields check..
        if (signDetails.docuTitle.trim() === "" || signDetails.signBy.trim() === "") {
            confirmAlert({
                message: 'Please fill all the neccessary fields!',
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn"
                    },
                ], closeOnClickOutside: false,
            });
            setAllowLoader(true);
            return;
        } else {
            if (uploadedFileName.html_pdfFile.fileType === "text/html") {
                // In a state 'signDetails', we will replace the signBy date before pushing to further pages..
                // The primary purpose of replacing the 'signBy' date from fromat1 to format2, because server accepts
                // format2.
                let signDetailsLocalVarble = signDetails;
                signDetailsLocalVarble = { ...signDetailsLocalVarble, "signBy": endDateTime };
                setAllowLoader(true);
                props.history.push({
                    pathname: "/htmlPreview",
                    frompath: "/bulkSigningUpload",
                    state: {
                        htmlFile: toBeSignedDoc,
                        htmlKeys: htmlKeys,
                        additionalColumValues: additionalColumValues,
                        csvFile: toBeSignedCSV,
                        convertedCSVData: convertedCSVData,
                        signDetails: signDetailsLocalVarble
                    }
                });
            }
            else {
                let validationData = {
                    userIP: sessionStorage.getItem("userIP")
                }
                let data = new FormData();
                data.append("inputDetails", JSON.stringify(validationData));
                data.append("csvFile", toBeSignedCSV);
                data.append("file", toBeSignedDoc);
                let jsonWebToken = sessionStorage.getItem("jsonWebToken");
                const options = {
                    method: "POST",
                    headers: {
                        enctype: "multipart/form-data",
                        'Authorization': `Bearer ${jsonWebToken}`
                    },
                    body: data
                }
                fetch(routeURl.uploadBulkSignFile, options)
                    .then(response => (response.json()))
                    .then(data => {
                        if (data.status === "SUCCESS") {
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
                            setAllowLoader(true);
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
                                ], closeOnClickOutside: false,
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
                                ], closeOnClickOutside: false,
                            });
                            setAllowLoader(true);
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
                            ], closeOnClickOutside: false,
                        });
                        setAllowLoader(true);
                    })
            }
        }

    }

    const createPDF = async (pdfValue, csvFileRefNo1, fileRefNo1) => {
        setAllowLoader(false);
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
            setAllowLoader(true);
            console.error("Error fetching PDF dimensions:", error);
        }

        file.preview = window.URL.createObjectURL(new File([blob], `${fileName.split(".")[0]}.pdf`, {
            type: "application/pdf",
            lastModified: new Date(),
        }));
        setFiles1(file);
        setFileUrl(file.preview);

        // In a state 'signDetails', we will replace the signBy date before pushing to further pages..
        // The primary purpose of replacing the 'signBy' date from fromat1 to format2, because server accepts
        // format2.
        let signDetailsLocalVarble = signDetails;
        signDetailsLocalVarble = { ...signDetailsLocalVarble, "signBy": endDateTime };
        let filedata = {
            files: file,
            height: height1,
            width: width1,
            csvFileRefNo: csvFileRefNo1,
            fileRefNo: fileRefNo1,
            pageDimensions: localPages,
            equalPageDimensions: equalPageDimensions1,
            signDetails: signDetailsLocalVarble
        };
        props.history.push({
            pathname: "/preview",
            frompath: "/bulkSigningUpload",
            state: {
                details: filedata,
            },
        });
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
            />
            <div className="DRPZONEPARENT1">
                <div className='DROPZONE1' >
                    <>
                        <Dropzone
                            type="file"
                            accept={[".csv"]}
                            className="CsvAndSignedDocuFile container"
                            onDrop={e => CsvFileDrop(e)}
                        >
                            <div className="text-container">{
                                Object.keys(uploadedFileName.csvfile).length !== 0 ?
                                    <>
                                        <div className='fileNameAndSize'>
                                            <span className='afterHtmlSelection'> {(uploadedFileName.csvfile).fileName}-{(uploadedFileName.csvfile).fileSize} KB </span>
                                        </div>
                                    </> :
                                    <>
                                        <div className='fileNameAndSize'>
                                            <div> Drop CSV File Here</div>
                                            <div>OR</div>
                                            <div><input className="uploadfilebtn" value="Click here to upload" readOnly /></div>
                                        </div>
                                    </>
                            }</div>
                        </Dropzone>
                    </>
                </div>
                <div className='DROPZONE2' >
                    <>
                        <Dropzone
                            type="file"
                            accept={[".pdf", ".html"]}
                            className="CsvAndSignedDocuFile container"
                            onDrop={e => htmlPDfFileDrop(e)}
                        >
                            <div>{
                                Object.keys(uploadedFileName.html_pdfFile).length !== 0 ?
                                    <>
                                        <div className='fileNameAndSize'>
                                            <span className='afterHtmlSelection'> {(uploadedFileName.html_pdfFile).fileName}-{(uploadedFileName.html_pdfFile).fileSize} KB </span>
                                        </div>
                                    </> :
                                    <>
                                        <div className='fileNameAndSize'>
                                            <div > Drop PDF/HTML File</div>
                                            <div >OR</div>
                                            <div ><input className="uploadfilebtn" value="Click here to upload" readOnly /></div>
                                        </div>
                                    </>
                            }</div>
                        </Dropzone>
                    </>
                </div>
            </div>
            <div className="next-nav">
                <button
                    className="upload-button container"
                    id="create-job"
                    onClick={e => setNotifyDataModal(true)}
                >
                    <span>Proceed &#8594;</span>
                </button>
            </div>
            <div style={{ textAlign: "center" }}>
                <button className="btn btn-link" onClick={() => {
                    // Default column headers
                    const headers = ["Signer Name", "Mobile No", "Email Id"];

                    // Create CSV content with only headers
                    const csvContent = headers.join(',') + '\n';

                    // Create a Blob from the CSV content
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

                    // Create a temporary <a> element to trigger the download
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'bulkSigningUpload.csv';
                    document.body.appendChild(link);
                    link.click();

                    // Clean up the temporary URL and element
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }} href=" ">Download the sample CSV file!</button>
            </div>
            {
                notifyDataModal && (
                    <div className="custom-modal">
                        <div className="CustomModal-contentBLKSIGN">
                            <span className="close" onClick={e => setNotifyDataModal(false)}>&times;</span>
                            <div>
                                <div className="DetailsHeading">
                                    <span>Please provide the signing details for email notification</span>
                                </div>
                                <div className="notificationContent">
                                    <div className="notifyIntFild" >
                                        <div style={{ width: "25%", paddingTop: "1%" }}>
                                            <span> Sign by<span id="mandatoryRed">*</span>: </span>
                                        </div>
                                        <div style={{ width: "75%" }}>
                                            <input defaultValue={signDetails.signBy} onChange={e => {
                                                setSignDetails({
                                                    ...signDetails,
                                                    signBy: e.target.value.trim()
                                                })
                                            }} className="inputCss" type="date" />
                                        </div>
                                    </div>
                                    <div className="notifyIntFild" >
                                        <div style={{ width: "25%", paddingTop: "1%" }}>
                                            <span>  Document title<span id="mandatoryRed">*</span>: </span>
                                        </div>
                                        <div style={{ width: "75%" }}>
                                            <input maxLength={30} className="inputCss" onChange={e => {
                                                setSignDetails({
                                                    ...signDetails,
                                                    docuTitle: e.target.value.trim()
                                                })
                                            }}
                                                placeholder="Enter the title" type="text" />
                                        </div>
                                    </div>
                                    <div style={{ display: "inline-flex", width: "100%" }}>
                                        <div style={{ width: "25%", paddingTop: "1%" }}>
                                            Email subject
                                        </div>
                                        <div style={{ width: "75%" }}>
                                            <textarea
                                                defaultValue={signDetails.emailSubject}
                                                maxLength={100}
                                                onChange={e => {
                                                    setSignDetails({
                                                        ...signDetails,
                                                        emailSubject: e.target.value.trim()
                                                    })
                                                }}
                                                className="inputCss" style={{ height: "70px" }} placeholder="Enter the email subject" />
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "end", fontSize: "10px" }}><span>(Max of 100 characters)</span> </div>
                                    <div style={{ display: "inline-flex", width: "100%" }}>
                                        <div style={{ width: "25%", paddingTop: "1%" }}>
                                            Owner comments
                                        </div>
                                        <div style={{ width: "75%" }}>
                                            <textarea maxLength={255} defaultValue={signDetails.signerComments} onChange={e => {
                                                setSignDetails({
                                                    ...signDetails,
                                                    signerComments: e.target.value.trim()
                                                })
                                            }} className="inputCss" style={{ height: "90px" }} placeholder="Document comments please" />
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "end", fontSize: "10px" }}><span>(Max of 255 characters)</span> </div>

                                </div>
                                <div style={{ marginBottom: "4px" }}>Note: Total signers count is {<b style={{ fontWeight: "bold" }}>{signersCount}</b>}</div>
                                <div>
                                    <button
                                        className="upload-button container"
                                        onClick={e => proceedForSigning(e)}
                                    >
                                        <span>Send for signing &#8594;</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

        </>
    )
}

export default UploadFileFrBulkSigning;