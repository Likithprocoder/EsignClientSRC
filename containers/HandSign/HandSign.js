import React, { useState, useRef, useEffect } from "react";
import Popup from "reactjs-popup";
import SignaturePad from "react-signature-canvas";
import { Button, Row } from "reactstrap";
import "./handSign.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./Fonts/handSignFonts.css";
import Dropzone from "react-dropzone";
import { ModalBody, ModalFooter, ModalHeader } from "reactstrap";

function HandSign(props) {
  var file;
  const [signMode, setsignMode] = useState(props.signMode);
  const [imageURL, setImageURL] = useState(null);
  const [isdisable, setdisable] = useState(true);
  const [drawImg, setDrawImg] = useState(null);
  const [filename, setFileName] = useState("");
  const [uploadedSign, setUploadedSign] = useState(false);
  const sigCanvas = useRef({});

  useEffect(() => {
    var imageValue = defaultSignatureFont();
    setImageURL(imageValue);
  }, []);

  const clear = () => sigCanvas.current.clear();
  const adopt = () => {
    var imagedata = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    //data:image/jpeg;base64,
    if (imagedata !== null) {
      if (
        imagedata.length > 2000 &&
        imagedata.includes("base64") &&
        imagedata.includes("data:image")
      ) {
        setImageURL(imagedata);
        sessionStorage.setItem("signUploadImgFileName", "");
        sessionStorage.setItem("handSignImg", imagedata);
        document.getElementById("closeBtn").click();
      } else {
        // sessionStorage.removeItem("handSignImg");
        // document.getElementById("closeBtn").click();
        if (signMode == "4") {
          alert("Please Sign or Upload a Valid Signature");
        } else {
          alert("Please Sign or Upload a Valid Signature");
        }
      }
    } else {
      if (signMode == "4") {
        alert("Please Sign or upload signature");
      } else {
        alert("Please Sign or upload signature");
      }
    }
  };

  // On the click of apply button the setted image will be displayed
  const adoptUpload = () => {
    console.log("Apply2 called");
    console.log(drawImg);
    if (uploadedSign) {
      if (
        drawImg.length > 2000 &&
        drawImg.includes("base64") &&
        drawImg.includes("data:image")
      ) {
        console.log("DragImg");
        setImageURL(drawImg);
        sessionStorage.setItem("handSignImg", drawImg);
        document.getElementById("closeBtn").click();
      } else {
        if (signMode == "4") {
          alert("Please Sign or Upload a Valid Signature");
        } else {
          alert("Please Sign or Upload a Valid Signature");
        }
      }
    } else {
      if (signMode == "4") {
        alert("Please Sign or upload signature");
      } else {
        alert("Please Sign or upload signature");
      }
    }
  };

  function onDrop(files) {
    var file = files[0];
    if (file.size < 1048576) {
      setUploadedSign(true);
      sessionStorage.setItem("signUploadImgFileName", file.name);
      setFileName(file.name);
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          // convert image file to base64 string
          var base64img = reader.result;
          setDrawImg(base64img);
          // setImageURL(base64img);
          sessionStorage.setItem("handSignImg", base64img);
          setdisable(false);
        },
        false
      );
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      confirmAlert({
        message: "Signed image should be less than 1MB",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
    }
  }

  const createnav = () => {
    console.log("CreateNav")
    document.getElementById("signaturePad").style.display = "none";
    document.getElementById("nav-tabContent").style.display = "";
    document.getElementById("clearBtn").style.display = "none";
    document.getElementById("adoptBtn").style.display = "none";
    document.getElementById("adoptUploadBtn").style.display = "";
    document.getElementById("canvasMsg1").style.display = "";
    document.getElementById("canvasMsg2").style.display = "none";

    // setDrawImg(null);
    // setImageURL(null);
    handelChange();
    resetRDB();
  };

  //setting radio buttons to default value
  const resetRDB = () => {
    var checkBoxes = document.getElementsByName("selectedFont");
    console.log(checkBoxes);
    for (var i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked) {
        document.getElementById(checkBoxes[i].id).checked = false;
      }
    }
  };

  const drawnav = () => {
    document.getElementById("signaturePad").style.display = "";
    document.getElementById("clearBtn").style.display = "";
    document.getElementById("nav-tabContent").style.display = "none";
    document.getElementById("adoptBtn").style.display = "";
    document.getElementById("adoptUploadBtn").style.display = "none";
    document.getElementById("canvasMsg2").style.display = "none";
    document.getElementById("canvasMsg1").style.display = "none";
    clear();
  };

  const uploadnav = () => {
    document.getElementById("signaturePad").style.display = "none";
    document.getElementById("clearBtn").style.display = "none";
    document.getElementById("nav-tabContent").style.display = "";
    document.getElementById("adoptBtn").style.display = "none";
    document.getElementById("adoptUploadBtn").style.display = "";
    document.getElementById("canvasMsg2").style.display = "";
    document.getElementById("canvasMsg1").style.display = "none";
    setFileName("");
    // setDrawImg(null);
    // setImageURL(null);
    setdisable(true);
  };

  //getting the  font family for the input value
  let handelChange = () => {
    console.log("goodfoot");
    document.getElementById("goodfoot").innerHTML =
      sessionStorage.getItem("firstName");
    document.getElementById("Sofia").innerHTML =
      sessionStorage.getItem("firstName");
    document.getElementById("Cookie").innerHTML =
      sessionStorage.getItem("firstName");
    document.getElementById("Rouge").innerHTML =
      sessionStorage.getItem("firstName");
    document.getElementById("DancingScript").innerHTML =
      sessionStorage.getItem("firstName");
    document.getElementById("Romanesco").innerHTML =
      sessionStorage.getItem("firstName");
    document.getElementById("iLoveGlitter").innerHTML =
      sessionStorage.getItem("firstName");
  };

  // on the click of radio button the selected font will be set to the image
  let imageCreator = (fontfamily, text) => {
    var tCtx = document.getElementById("textCanvas").getContext("2d"),
      imageElem = document.getElementById("image");
    var x = 0;
    var y = 45;
    var fontWeight = 400;
    var fontSize = 50;
    if (fontfamily === "iLoveGlitter") {
      x = 1;
    }
    if (fontfamily === "Caveat") {
      x = 10;
    }
    // if (fontfamily === "SueEllen") {
    //   fontSize = 45;
    // }
    if (fontfamily === "Sofia" || fontfamily === "Rouge" || fontfamily === "DancingScript") {
      y = 40;
    }

    var font = "" + fontWeight + " " + fontSize + "px " + fontfamily;
    // //console.log(font)
    // Set it before getting the size
    tCtx.font = font;
    // this will reset all our context's properties
    tCtx.canvas.width = tCtx.measureText(text).width + 5;
    // so we need to set it again
    tCtx.font = font;
    // //console.log(tCtx.font);

    // set the color only now
    tCtx.fillStyle = "black";
    tCtx.fillText(text, x, y);
    imageElem.src = tCtx.canvas.toDataURL();
    setDrawImg(tCtx.canvas.toDataURL());
    ////console.log(tCtx.canvas.toDataURL());
    return imageElem.src;
  };

  let fontHandler = (e) => {
    setUploadedSign(true);
    imageCreator(e.target.value, e.target.nextSibling.innerText);
  };

  let defaultSignatureFont = () => {
    var fontfamily = "goodfoot";
    var text = sessionStorage.getItem("firstName");
    let imageCreatorValue = imageCreator(fontfamily, text);
    sessionStorage.setItem("handSignImg", imageCreatorValue);
    return imageCreatorValue;
  };

  function isPdfSelected() {
    if (isdisable) {
      return (
        <div>
          <span className="drop-pdf">Drop file here </span>
          <i className="fa fa-file-picture-o"></i>
          <br />
          <span className="drop-pdf">OR</span>
          <br />
          <span className="drop-pdf">
            <input
              type="button"
              style={{
                width: "77px",
                fontSize: "inherit",
                backgroundColor: "gray",
                color: "white",
              }}
              value="Upload"
            />
          </span>
        </div>
      );
    } else {
      return (
        <div>
          <img
            style={{ height: "155px", width: "auto" }}
            src={drawImg}
            alt=""
          />
        </div>
      );
    }
  }
  return (
    <div>
      <Row>
        <div style={{width:"150px"}}>
          {imageURL ? (
            <img
              src={imageURL}
              alt="my signature"
              style={{
                display: "block",
                margin: "0px 0px 5px 40px",
                border: "1px solid black",
                width: "130px",
                height: "60px",
                backgroundColor: "white",
                objectFit: "contain"
              }}
            />
          ) : null}
        </div>
        <div style={{marginLeft:"5%"}}>
          <Popup
            modal
            trigger={
              <Button color="primary" id="signaturePadBtn">
                Change Signature
              </Button>
            }
            // Open Signature Pad
            closeOnDocumentClick={false}
          >
            {(close) => (
              <div style={{ color: "black" }}>
                <ModalHeader>Create Your Signature</ModalHeader>
                <ModalBody>
                  <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <a
                        className="nav-item nav-link active"
                        id="nav-profile-tab"
                        data-toggle="tab"
                        href="#nav-profile"
                        role="tab"
                        aria-controls="nav-profile"
                        aria-selected="false"
                        onClick={drawnav}
                      >
                        Draw
                      </a>
                      <a
                        className="nav-item nav-link"
                        id="nav-home-tab"
                        data-toggle="tab"
                        href="#nav-home"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                        onClick={createnav}
                      >
                        Choose
                      </a>
                      <a
                        className="nav-item nav-link"
                        id="nav-contact-tab"
                        data-toggle="tab"
                        href="#nav-contact"
                        role="tab"
                        aria-controls="nav-contact"
                        aria-selected="false"
                        onClick={uploadnav}
                      >
                        Upload
                      </a>
                    </div>
                  </nav>

                  <div className="sigContainer" id="signaturePad">
                    <SignaturePad
                      ref={sigCanvas}
                      canvasProps={{
                        className: "signatureCanvas",
                      }}
                    />
                    <div id="canvasMsg">Please sign in the above box</div>
                  </div>
                  <div
                    className="tab-content"
                    id="nav-tabContent"
                    style={{ display: "none" }}
                  >
                    <div
                      className="tab-pane fade"
                      id="nav-profile"
                      role="tabpanel"
                      aria-labelledby="nav-profile-tab"
                    ></div>
                    <div
                      className="tab-pane fade show active"
                      id="nav-home"
                      role="tabpanel"
                      aria-labelledby="nav-home-tab"
                    >
                      <div>
                        <canvas
                          className="xx"
                          id="textCanvas"
                          height="60"
                        ></canvas>
                        <img id="image" hidden={true} />
                        <label style={{ fontSize: "20px", margin: "0px" }}>
                          Name:
                          <input
                            id="namefield"
                            className="signerfield "
                            value={sessionStorage.getItem("firstName")}
                            type="text"
                            readOnly={true}
                          />
                          <br></br>
                        </label>
                        <div id="signFontsCntr">
                          <div className="radio-items" id="radio-item1">
                            <input
                              id="rd1"
                              type="radio"
                              name="selectedFont"
                              value="goodfoot"
                              onChange={fontHandler}
                            />
                            <span
                              id="goodfoot"
                              style={{
                                fontFamily: "goodfoot",
                                marginLeft: "5px",
                              }}
                            ></span>
                            <br></br>
                          </div>
                          <div className="radio-items" id="radio-item7">
                            <input
                              id="rd4"
                              type="radio"
                              name="selectedFont"
                              value="Sofia"
                              onChange={fontHandler}
                            />
                            <span
                              id="Sofia"
                              style={{ fontFamily: "Sofia", marginLeft: "5px" }}
                            ></span>
                            <br></br>
                          </div>
                          <div className="radio-items" id="radio-item10">
                            <input
                              id="rd5"
                              type="radio"
                              name="selectedFont"
                              value="Cookie"
                              onChange={fontHandler}
                            />
                            <span
                              id="Cookie"
                              style={{
                                fontFamily: "Cookie",
                                marginLeft: "5px",
                              }}
                            ></span>
                            <br></br>
                          </div>
                          <div className="radio-items" id="radio-item8">
                            <input
                              id="rd8"
                              type="radio"
                              name="selectedFont"
                              value="Rouge"
                              onChange={fontHandler}
                            />
                            <span
                              id="Rouge"
                              style={{ fontFamily: "Rouge", marginLeft: "5px" }}
                            ></span>
                            <br></br>
                          </div>
                          <div className="radio-items" id="radio-item11">
                            <input
                              id="rd9"
                              type="radio"
                              name="selectedFont"
                              value="DancingScript"
                              onChange={fontHandler}
                            />
                            <span
                              id="DancingScript"
                              style={{
                                fontFamily: "DancingScript",
                                marginLeft: "5px",
                              }}
                            ></span>
                            <br></br>
                          </div>
                          <div className="radio-items" id="radio-item4">
                            <input
                              id="rd10"
                              type="radio"
                              name="selectedFont"
                              value="Romanesco"
                              onChange={fontHandler}
                            />
                            <span
                              id="Romanesco"
                              style={{
                                fontFamily: "Romanesco",
                                marginLeft: "5px",
                              }}
                            ></span>
                            <br></br>
                          </div>
                          <div className="radio-items" id="radio-item3">
                            <input
                              id="rd11"
                              type="radio"
                              name="selectedFont"
                              value="iLoveGlitter"
                              onChange={fontHandler}
                            />
                            <span
                              id="iLoveGlitter"
                              style={{
                                fontFamily: "iLoveGlitter",
                                marginLeft: "5px",
                              }}
                            ></span>
                            <br></br>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="tab-pane fade"
                      id="nav-contact"
                      role="tabpanel"
                      aria-labelledby="nav-contact-tab"
                    >
                      <div className="pdf-lg-container">
                        <div
                          id="pdfContainerSignaturePad"
                          className="pdfContainerSignaturePad-container"
                        >
                          <section className="">
                            <div id="HsDropZone" className="dropzone">
                              <h6>Upload the File</h6>
                              <Dropzone
                                type="file"
                                id="SignaturepadDropZone"
                                accept={[".jpg", ".png", ".jpeg"]}
                                className="inner-content"
                                onDrop={(e) => onDrop(e)}
                              >
                                <div className="text-container">
                                  {isPdfSelected()}
                                </div>
                              </Dropzone>
                              <div className="dropped-files">
                                <aside>
                                  <h6 className="dropped-files-name">
                                    {" "}
                                    {filename}
                                  </h6>
                                </aside>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div id="canvasMsg1" style={{ display: "none" }}>
                    Select your signature
                  </div>
                  <div id="canvasMsg2" style={{ display: "none" }}>
                    Drop/Upload signature file(jpg/png/jpeg)
                  </div>
                  <div id="canvasMsg3" style={{ display: "none" }}>
                    Customise your signature
                  </div>
                </ModalBody>
                <ModalFooter id="signatureModalFooter">
                  <Button id="adoptBtn" color="success" onClick={adopt}>
                    Apply
                  </Button>
                  <Button
                    id="adoptUploadBtn"
                    color="success"
                    onClick={adoptUpload}
                    style={{ display: "none", position: "relative" }}
                  >
                    Apply
                  </Button>
                  <Button id="clearBtn" color="primary" onClick={clear}>
                    Clear
                  </Button>
                  <Button
                    id="closeBtn"
                    color="danger"
                    style={{ position: "relative" }}
                    onClick={close}
                  >
                    Close
                  </Button>
                </ModalFooter>
              </div>
            )}
          </Popup>
        </div>
      </Row>
    </div>
  );
}

export default HandSign;
