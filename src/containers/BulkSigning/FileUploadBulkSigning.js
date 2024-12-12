import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import './BulkSigningCss.css'
import { confirmAlert } from 'react-confirm-alert';
import { URL } from '../URLConstant';
import UserDetailValidation from "../Templates/UserDetailValidation";
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
    const  [csvFileRefNo, setCsvFileRefNo] = useState("");
    const  [fileRefNo, setFileRefNo] = useState("");

    useEffect(() => {
        document.getElementById('create-job').disabled = true;
        document.getElementById('create-job').style.cursor = "not-allowed";
        if (filesAreUploaded === 2) {
            document.getElementById('create-job').disabled = false;
            document.getElementById('create-job').style.cursor = "pointer";
            validateCSV();
        }

    }, [filesAreUploaded]);


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

    // to read the passed csv data and convert to json array..
    function parseCSV(csv) {
        const lines = csv.split('\n');
        const headersWithSpace = lines[0].split(',');
        const headers = [];
        const headerAndValues = {};
        for (let key in headersWithSpace) {
            if ((headersWithSpace[key]).includes("\r")) {
                headers.push(headersWithSpace[key].split("\r")[0]);
            } else {
                headers.push(headersWithSpace[key]);
            }
        }

        for (let key in headers) {
            headerAndValues[headers[key]] = [];
        }

        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].split(',');
            if (line.length === headers.length) {
                for (let j = 0; j < headers.length; j++) {
                    let valuesArray = [];
                    for (let keysz in headerAndValues[headers[j]]) {
                        valuesArray.push(headerAndValues[headers[j]][keysz]);
                    }
                    if ((line[j]).includes("\r")) {
                        valuesArray.push(line[j].split("\r")[0]);
                    } else {
                        valuesArray.push(line[j]);
                    }
                    headerAndValues[headers[j]] = valuesArray;
                }
            }
        }
        for (let keyzz in headerAndValues) {
            let obj = { [keyzz]: headerAndValues[keyzz] };
            data.push(obj);
        }
        return data;
    }

    // to collect the csv file droped.
    const CsvFileDrop = (event) => {
        let file = event[0];
        if (file.type === "text/csv") {
            let origFileName = (file.name).split('.')[0];
            let oriFileSize = file.size / 1000;
            // to read the contents from the csv file uploaded..
            // and perform validation.
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                const csvData = parseCSV(text);
                setConvertedCSVData(csvData);
                if (csvData.length === 0) {
                    confirmAlertFunction("The uploaded file contains empty data, please add data(s) and re-upload!");
                    return;
                } else {
                    // logic to check weather csv file contains all manditory columns and there respective values..
                    // and perform furthur operations..
                    // console.log(csvData);
                    for (let index = 0; index <= 2; index++) {
                        let jsonObj = csvData[index];
                        // converts an json onbject to an json Array.
                        // validating manditory column name
                        // console.log(jsonObj);
                        if (!csvHeaders.includes(Object.keys(jsonObj)[0])) {
                            // console.log(Object.keys(jsonObj)[0]);
                            confirmAlertFunction("The uploaded file contains incorrect headers. The CSV header should be as specified!");
                            return;
                        }

                        // to limit the validation of 2 column only..
                        // validating empty check 
                        if (index <= 2) {
                            for (let keysz in jsonObj[Object.keys(jsonObj)[0]]) {
                                if (jsonObj[Object.keys(jsonObj)[0]][keysz] === "" && index <= 1) {
                                    confirmAlertFunction("The file should not contain any empty values for columns 'Signer Name And Mobile Number'. Please fill and re-upload!");
                                    return;
                                }
                                else {
                                    if (index === 1) {
                                        let result = UserDetailValidation(jsonObj[Object.keys(jsonObj)[0]][keysz], "Mobile Number");
                                        if (!result || result === "isNotANumber") {
                                            confirmAlertFunction(`The uploaded CSV file contains invalid mobile number.`);
                                            return;
                                        }
                                    }
                                    else if (index === 2 && jsonObj[Object.keys(jsonObj)[0]][keysz] !== "") {
                                        let result = UserDetailValidation(jsonObj[Object.keys(jsonObj)[0]][keysz], "emailID");
                                        if (!result) {
                                            confirmAlertFunction(`The uploaded CSV file contains invalid emailId.`);
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // to store the additional header values from the csv..
                    for (let index2 = 3; index2 <= csvData.length - 1; index2++) {
                        let columnName = "";
                        // by default the last column value in a row ends with 
                        // \r to remove the \r if() executed..
                        if ((Object.keys(csvData[index2])[0]).includes("\r")) {
                            columnName = (Object.keys(csvData[index2])[0]).split("\r")[0];
                        } else {
                            columnName = Object.keys(csvData[index2])[0];
                        }
                        setAdditionalColumValues(oldvalue => ([
                            ...oldvalue,
                            columnName
                        ]));
                    }

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
    const getKeysFromHtml = (text) => {
        let eachLineText = text.split('\n');
        for (let index = 0; index <= eachLineText.length - 1; index++) {
            let splitedText = eachLineText[index].split(" ");
            for (let j = 0; j <= splitedText.length - 1; j++) {
                // the word contains with out any spaces in between..
                if (splitedText[j].includes("{{") || splitedText[j].includes("}}")) {
                    if ((splitedText[j]).startsWith("{{") && (splitedText[j]).endsWith("}}")) {
                        setHtmlKeys(oldvalue => ([
                            ...oldvalue,
                            splitedText[j]
                        ]));
                        // else is exceuted if the word contains spaces in between..
                        // spaces are removed and formed to a proper word.
                    } else {
                        const spacedWords = splitedText[j];
                        const unspacedWords = spacedWords.split('').filter(char => char !== ' ').join('');
                        setHtmlKeys(oldvalue => ([
                            ...oldvalue,
                            unspacedWords
                        ]));
                    }

                }
            }
        }
    }

    // to collect the HTML or PDF file uploaded.
    const htmlPDfFileDrop = (event) => {
        let file = event[0];
        setToBeSignedDoc(file);
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
                    let expectResult = getKeysFromHtml(text);
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
    const validateCSV = () => {
        if (uploadedFileName.html_pdfFile.fileType === "application/pdf") {
            if (convertedCSVData.length > 3) {
                setUploadedFileName({
                    ...uploadedFileName,
                    csvfile: {}
                });
                setFilesAreUplaoded(filesAreUploaded - 1);
                confirmAlertFunction("The uploaded CSV file contains unwanted columns! Please remove it and re-upload.");
            }
        }
    }

    // final signing procced
    const proceedForSigning = () => {
        if (uploadedFileName.html_pdfFile.fileType === "text/html") {
            props.history.push({
                pathname: "/htmlPreview",
                frompath: "/bulkSigning",
                state: {
                    htmlFile: toBeSignedDoc,
                    htmlKeys: htmlKeys,
                    additionalColumValues: additionalColumValues,
                    csvFile: toBeSignedCSV,
                    convertedCSVData: convertedCSVData
                }
            })
        }
        else {
            let validationData = {
                authToken: sessionStorage.getItem("authToken"),
                userIP: sessionStorage.getItem("userIP")
            }
            let data = new FormData();
            data.append("inputDetails", JSON.stringify(validationData));
            data.append("csvFile", toBeSignedCSV);
            data.append("file", toBeSignedDoc);

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
                    console.log(data);
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
                                        // props.history.push({
                                        //     pathname: "/preview",
                                        //     frompath: "bulkSigning",
                                        //     state: data
                                        // });
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
                        ],
                    });
                })
        }
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
        console.log(url);
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
                    if ( i == 1 ) {
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
          console.log({filedata});
          props.history.push({
            // pathname: "/preview",
            pathname: "/multiPplSignPreview",
            frompath: "/htmlPreview",
            state: {
              details: filedata,
            },
          });
    }

    return (
        <>
            <Loader
                loaded={true}
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
                    onClick={e => proceedForSigning(e)}
                >
                    <span>Send for signing &#8594;</span>
                </button>
            </div>
        </>
    )
}

export default UploadFileFrBulkSigning;