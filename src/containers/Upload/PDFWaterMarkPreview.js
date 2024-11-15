import React, { useEffect, useState } from "react";
import { URL as url } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import "./upload.css";
var Loader = require("react-loader");

function PDFWaterMarkPreview(props) {
    
    const [pdfUrl, setPDFURL] = useState();

    const [waterMarkModal, setWaterMarkModal] = useState(false);

    const [fileData, setFileData] = useState();

    const [allowLoader, setAllowLoader] = useState(true);

    const [watermarkContent, setWatermarkContent] = useState();

    const [file, setFile] = useState();

    useEffect(() => {        
            setPDFURL(props.location.state.details.PDFURL);
            setFileData(props.location.state.details);
            setWatermarkContent(props.location.state.details.waterMarkContent);            
            setFile(new File([props.location.state.details.blob], `${props.location.state.details.files.name}`, { type: "application/pdf" }));
    }, []);

    // fetch call to generate new watermark added PDF..
    const addNewWaterMark = (waterMarkContent) => {
        setAllowLoader(false);
        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
        var body = {
            docID: fileData.docId,
            waterMarkContent: waterMarkContent
        };
        fetch(url.editWaterMark, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${jsonWebToken}`
            },
            body: JSON.stringify(body),
        })
            .then((response) => {
                return response.json();
            })
            .then((responseJson) => {
                if (responseJson.status === "SUCCESS") {
                    // If the response is returned with key 'base64PDF', push the page to 'PDFWatermarkPreview'.
                    // Convert the Base64 string to a Blob
                    const byteCharacters = atob(responseJson.base64PDF); // Decode the Base64 string
                    const byteArrays = [];
                    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                        const slice = byteCharacters.slice(offset, offset + 1024);
                        const byteNumbers = new Array(slice.length);
                        for (let i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        byteArrays.push(byteArray);
                    }
                    // Create a Blob from the byte arrays
                    const blob = new Blob(byteArrays, { type: 'application/pdf' });
                    // Step 2: Convert Blob to File
                    const newFile = new File([blob], `${file.name}`, { type: "application/pdf" });
                    // Create an object URL for the Blob
                    const url = URL.createObjectURL(blob);
                    setPDFURL(url);
                    setAllowLoader(true);
                    setWaterMarkModal(false);
                    setFile(newFile);
                } else if (responseJson.statusDetails === "Session Expired!") {
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
                }
                else {
                    confirmAlert({
                        message: responseJson.statusDetails,
                        buttons: [
                            {
                                label: "OK",
                                className: "confirmBtn",
                                onClick: () => { props.history.push("/") }
                            },
                        ], closeOnClickOutside: false
                    });
                }
            })
            .catch((e) => {
                console.log(e);
                confirmAlert({
                    message: `Technical issues! Please try later.`,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => { props.history.push("/") }
                        },
                    ], closeOnClickOutside: false
                });
            });
    };

    // Self signing, and the newly generated PDF updated operation.
    const selfSigning = (e,routeTo) => {
        setAllowLoader(false);
        let body = {
            docID: fileData.docId,
            isUpdate: true
        };
        let formData = new FormData();
        formData.append("file", file);
        formData.append("inputDetails", JSON.stringify(body));
        let jsonWebToken = sessionStorage.getItem("jsonWebToken");
        fetch(url.uploadDocument, {
            method: "POST",
            headers: {
                enctype: "multipart/form-data",
                'Authorization': `Bearer ${jsonWebToken}`
            },
            body: formData
        }).then((response) => {
            return response.json();
        }).then((responseJson) => {
            if (responseJson.status === "SUCCESS") {
                // Reassign new waterMark pdf..
                fileData["files"] = {"preview":pdfUrl};
                delete fileData["waterMarkContent"];
                delete fileData["PDFURL"];
                delete fileData["blob"];    
                props.history.push({
                    pathname: routeTo,
                    frompath: "waterMarkPreview",
                    state: {
                        details: fileData,
                    }
                });
            } else if (responseJson.statusDetails === "Session Expired!") {
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
            }
            else {
                confirmAlert({
                    message: responseJson.statusDetails,
                    buttons: [
                        {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => { props.history.push("/") }
                        },
                    ], closeOnClickOutside: false
                });
            }
        }).catch((e) => {
            console.log(e);
            confirmAlert({
                message: `Technical issues! Please try later.`,
                buttons: [
                    {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => { props.history.push("/") }
                    },
                ], closeOnClickOutside: false
            });
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
            <div style={{ display: "inline-flex" }}>
                <div className="nextOPTIONS">
                    <button
                        className="upload-button"
                        id="create-job"
                        onClick={e => {
                            confirmAlert({
                                message: 'By going back, the watermarked PDF will be lost. The original uploaded PDF will still be available in your inbox.',
                                buttons: [
                                    {
                                        label: "OK",
                                        className: "confirmBtn",
                                        onClick: () => { props.history.push("/docUpload"); }
                                    },
                                    {
                                        label: "Cancel",
                                        className: "cancelBtn"
                                    }
                                ], closeOnClickOutside: false
                            });
                        }}
                        style={{ backgroundColor: "#f86c6b" }}
                        title="Back to upload document page"
                    >
                        <span>&#8592; Back</span>
                    </button>
                </div>
                <div className="nextOPTIONS">
                    <button
                        className="upload-button"
                        id="create-job"
                        onClick={e => {
                            setWaterMarkModal(true);
                        }}
                        style={{ backgroundColor: "#ffc107" }}
                        title="Edit the watermark and generate new PDF file"
                    >
                        <span>Edit watermark</span>
                    </button>
                </div>
                <div className="nextOPTIONS">
                    <button
                        className="upload-button"
                        id="next-button"
                        title="Self signing"
                        onClick={e => selfSigning(e,"/preview")}
                    >
                        <span>Sign by me &#8594;</span>
                    </button>
                    <br></br>
                </div>
                <div className="nextOPTIONS">
                    <button
                        className="upload-button"
                        id="create-job"
                        title="3rd party signing"
                        onClick={e => selfSigning(e,"/signerInfo")}
                    >
                        <span>Send for signing &#8594;</span>
                    </button>
                </div>
            </div>
            {pdfUrl && (
                <iframe
                    src={pdfUrl}
                    title="PDF Viewer"
                    width="100%"
                    height="500px"
                ></iframe>
            )}
            {
                waterMarkModal && (
                    <div className="custom-modal">
                        <div className="CustomModal-content">
                            <span className="close" onClick={e => {
                                setWaterMarkModal(false);
                            }}>&times;</span>
                            <React.Fragment>
                                <div style={{ marginTop: "15px" }}>
                                    <div style={{ marginBottom: "10px" }}>
                                        <textarea defaultValue={watermarkContent} id="WaterMarkContnt" maxLength="30" style={{ width: "100%", height: "80px", fontSize: "16px", backgroundColor: "lightcyan", borderRadius: "15px" }} placeholder="Watermark content"></textarea>
                                    </div >
                                    <div style={{ display: "inline-flex" }}>
                                        <div style={{ fontSize: "12px", marginRight: "12px", marginTop: "2%" }}>
                                            <span style={{ color: "red" }}>Note</span>: Maximum of 30 characters
                                        </div>
                                        <div style={{}}>
                                            <button onClick={e => {
                                                // empty check..
                                                if (document.getElementById("WaterMarkContnt").value.trim() === "" || document.getElementById("WaterMarkContnt").value.trim() === null) {
                                                    confirmAlert({
                                                        message: 'Watermark content is empty!',
                                                        buttons: [
                                                            {
                                                                label: "OK",
                                                                className: "confirmBtn"
                                                            }
                                                        ], closeOnClickOutside: false
                                                    });
                                                } else {
                                                    // esure the new content of the watermark is different from the old content.
                                                    // if it is equal to old watermark content, not API calls are made
                                                    if (watermarkContent.trim() !== document.getElementById("WaterMarkContnt").value.trim()) {
                                                        // fetch call to generate new watermark..
                                                        addNewWaterMark(document.getElementById("WaterMarkContnt").value.trim());
                                                        // set watermark content to the state..
                                                        setWatermarkContent(document.getElementById("WaterMarkContnt").value.trim());
                                                    } else {
                                                        setWaterMarkModal(false);
                                                    }
                                                }
                                            }} style={{ fontSize: "12px" }} className="btn btn-success">Regenerate PDF</button>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        </div>
                    </div>
                )
            }
        </React.Fragment>
    )
}

export default PDFWaterMarkPreview;