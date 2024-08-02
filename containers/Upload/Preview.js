import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/resizable";
import "jquery-ui-touch-punch";
import { Worker, Viewer, SpecialZoomLevel, AnnotationType } from "@react-pdf-viewer/core";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import ReactDOM, { render } from "react-dom";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import closeDragDiv from "../Upload/close_Draggable.webp";
import Modal from "react-responsive-modal";
import { URL } from "../URLConstant";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HandSign from "../HandSign/HandSign";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Tooltip,
} from "reactstrap";
import QRDetails from "../Payment/QRDetails";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./upload.css";

var Loader = require("react-loader");

const pdfjsforOnDrag = require("pdfjs-dist");
pdfjsforOnDrag.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js`;
const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
};
var timerEvent = null;
const defaultLeft = "0px";
const defaultTop = "0px";
const defaultDragWidth = "90px"; //84,88,104
const defaultDragHeight = "48px"; //46,46,62
const defaultDragWidthMob = "72px";//67
const defaultDragHeightMob = "37px";//35

const Preview = (props) => {
  // var data = props?.location?.state?.details;
  const frompath = props?.location?.frompath;

  //-------Declaring a new state variable dragArray, count, currentPage, containmentPage----
  const [dragArray, setDragArray] = useState(null || []);
  const [count, setCount] = useState(1);
  const [count4, setCount4] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageView, setCurrentPageView] = useState(1);
  const [containmentPage, setContainmentPage] = useState(1);
  const [rangeArray, setRangeArray] = useState(null || []);
  const [overflow, setOverflow] = useState("");
  const [loaded, setLoaded] = useState(true);
  const [openOTPModal, setOpenOTPModal] = useState(false);
  const [openFirstModal, setOpenFirstModal] = useState(false);
  const [openSecondModal, setOpenSecondModal] = useState(false);
  const [ownerloginName, setOwnerloginName] = useState("");
  const [customPagesValid, setCustomPagesValid] = useState(true);
  const [planActive, setPlanActive] = useState("");
  const [planActiveDetails, setPlanActiveDetails] = useState("");
  const [selectedOption, setSelectedOption] = useState("1");
  const [selectedMode, setSelectedMode] = useState("2");
  const [range, setRange] = useState("");
  const [emailotpvalue, setEmailotpvalue] = useState("");
  const [mobileotpvalue, setMobileotpvalue] = useState("");
  const [isInsufficientUnits, setIsInsufficientUnits] = useState(false);
  const [tandcHeader, setTandcHeader] = useState("Electronic Sign");
  const [TandC, setTandC] = useState("");
  const [docId, setDocId] = useState("");
  const [mobileNum, setMobileNum] = useState("");
  const [emailId, setEmailId] = useState("");
  const [txnId, setTxnId] = useState("");
  const [TxnID, setTxnID] = useState("");
  const [loginMode, setLoginMode] = useState("");
  const [overlay_width, setOverlay_width] = useState(100);
  const [overlay_height, setOverlay_height] = useState(43);
  // const [updated, setUpdated] = useState(null);
  const [externalSignCurrentPageNum, setExternalSignCurrentPageNum] =
    useState(1);
  const [AuthToken, setAuthToken] = useState(
    sessionStorage.getItem("authToken")
  );
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState("");
  // const [createdFileUrl, setCreatedFileUrl] = useState("");
  const [signerMobileNumber, setSignerMobileNumber] = useState("");
  const [customDocName, setCustomDocName] = useState("");
  const [signeremail, setSigneremail] = useState("");
  const [username, setUsername] = useState("");
  const [senderName, setSenderName] = useState("");
  const [requestedTime, setRequestedTime] = useState("");
  const [canvas_width, setCanvas_width] = useState("");
  const [canvas_height, setCanvas_height] = useState("");
  const [previewHeight, setPreviewHeight] = useState(620);
  const [signeruserId, setSigneruserId] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [docrefNo, setDocrefNo] = useState("");
  // const [actual_x, setActual_x] = useState(0);
  const [actual_y, setActual_y] = useState(0);
  const [xVal1, setXVal1] = useState(null || []);
  const [yVal1, setYVal1] = useState(null || []);
  const [range_array, setRange_array] = useState(null || []);
  const [selectedOptionArray, setSelectedOptionArray] = useState(null || []);
  const [responsedata, setResponsedata] = useState({});
  const [clientCallRespData, setClientCallRespData] = useState({});
  const [Height, setHeight] = useState("");
  const [Width, setWidth] = useState("");
  const [isExternalGuestAccess, setIsExternalGuestAccess] = useState("");
  const [timeleft, setTimeleft] = useState(0);
  const [allPageBatch, setAllPageBatch] = useState(1);
  const [customPageBatch, setCustomPageBatch] = useState(1);
  const [customPositionedDragIds, setCustomPositionedDragIds] = useState(
    null || []
  );
  const [customResizedDragIds, setCustomResizedDragIds] = useState(null || []);
  const [exclusionDragIds, setExclusionDragIds] = useState(null || []);
  const [currentPageNo, setCurrentPageNo] = useState(null || []);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipOpenModal, setTooltipOpenModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [submitted, setSubmitted] = useState(true);
  /*Using mutationRef keeps a clone of state value in ref and regularly updating it.
 Since refs are mutated, they aren t affected by closures and can hold updated values.*/
  const isFirstRender = useRef(true);
  const mutationRef = useRef(containmentPage);
  const [signerComments, setSignerComments] = useState("");
  const [signerCommentName, setSignerCommentName] = useState("");
  const [openAddCommentsModal, setOpenAddCommentsModal] = useState(false);
  const [opensignersCommentsModal, setOpensignersCommentsModal] =
    useState(false);
  const [commentsListDetails, setCommentsListDetails] = useState(null || []);
  const [isPrivate, setIsPrivate] = useState(0);
  const [commentsMargin, setCommentsMargin] = useState("0.5rem");
  const [commentsHeading, setCommentsHeading] = useState("    ");
  const [tempCode, setTempCode] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [subGroup, setSubGroup] = useState("");
  const [allowFromTemplate, setAllowFromTemplate] = useState(false);
  const [draftRefNumber, setDraftRefNumber] = useState("");
  const [fromTemplatePage, setFromTemplatePage] = useState("");
  const [shown, setShown] = useState(false);
  const [clientDimensions, setClientDimensions] = useState([]);
  const [finalClientDimensions, setFinalClientDimensions] = useState([]);
  const [pageDimensions, setPageDimensions] = useState(props?.location?.state?.details?.pageDimensions || []);
  const [equalPageDimensions, setEqualPageDimensions] = useState(props?.location?.state?.details?.equalPageDimensions);
  const [allRangeArrayValues, setAllRangeArrayValues] = useState([]);
  const [unequalPages, setUnequalPages] = useState([]);

  //-------Page change event...geting TotalPages, currentPage-----
  const handlePageChange = (event) => {
    //Storing total number of pages in session----
    sessionStorage.setItem("TotalPages", event.doc._pdfInfo.numPages);
    //Initializing a state variable currentPage----
    if (shown) {
      setCurrentPageView(event.currentPage + 1);
    } else if (!shown) {
      setCurrentPage(event.currentPage + 1);
    }
  };

  const getWalletDetailsonLoad = () => {
    var body = {
      loginname: sessionStorage.getItem("username"),
      authToken: sessionStorage.getItem("authToken"),
    };

    fetch(URL.getWalletInfo, {
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
        if (responseJson.status === "SUCCESS") {
          sessionStorage.setItem("units", responseJson.units);
          setLoaded(true);
        } else {
          if (responseJson.statusDetails === "Session Expired!!") {
            sessionStorage.clear();
            setLoaded(true);
            props.history.push("/login");
          } else {
            confirmAlert({
              message: responseJson.statusDetails,
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {},
                },
              ],
            });
            setLoaded(true);
          }
        }
      })
      .catch((e) => {
        setLoaded(true);
        alert(e);
      });
  };

  //Hide of select signature page div if it is external signer
  const toggleDiv = () => {
    var div = document.getElementById("signPageSelectDiv");
    var data = props?.location?.state?.details;

    if (data?.hasOwnProperty("externalSigner") && data?.externalSigner) {
      div.style.display = "none";
    }
  };

  useEffect(() => {
    var data = props?.location?.state?.details;
    
    // if (data?.files?.preview) {
    //     setFileUrl(data.files.preview);
    // }

    setTimeleft(30);//For OTP signing 
    toggleDiv();

    if (allowFromTemplate) {
      if (selectedMode === "1") {
        document.getElementById("otpSignModeRadio").disabled = true;
        document.getElementById("selfDscTokenModeRadio").disabled = true;
        document.getElementById("electronicModeRadio").disabled = true;
      } else if (selectedMode === "2") {
        document.getElementById("otpSignModeRadio").disabled = true;
        document.getElementById("selfDscTokenModeRadio").disabled = true;
        document.getElementById("aadhaarModeRadio").disabled = true;
      } else if (selectedMode === "3") {
        document.getElementById("otpSignModeRadio").disabled = true;
        document.getElementById("electronicModeRadio").disabled = true;
        document.getElementById("aadhaarModeRadio").disabled = true;
      } else {
        document.getElementById("selfDscTokenModeRadio").disabled = true;
        document.getElementById("electronicModeRadio").disabled = true;
        document.getElementById("aadhaarModeRadio").disabled = true;
      }
    }

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      setOverflow("visible");
      document.getElementById("decorate").style.width = "";
      document.getElementById("decorate").style.height = "";
      document.getElementById("outer-most-div").style.margin = "2rem -1rem";
      document.getElementById("outer-most-div").style.width = "21rem";
      document.getElementById("viewModal").style.marginLeft = "5%";
      document.getElementById("viewModal").style.height = "45px";
      document.getElementById("decorate").style.backgroundColor = "";
      document.getElementById("hideThumbnailForMobile").style.display = "none";
      document.getElementById("parent-div").style.height = "30rem";
      document.getElementById("decorate").style.height = "520px";
    }

    if (
      sessionStorage.getItem("ud") == "false" ||
      sessionStorage.getItem("ud") == null
    ) {
      //for multi user external signer fixing coordinates
      if (data?.hasOwnProperty("externalSigner") && data?.externalSigner) {
        if (data.signMode === "1") {
          document.getElementById("aadhaarModeRadio").click();
        }
        if (data.signMode === "3") {
          document.getElementById("selfDscTokenModeRadio").click();
        }

        var signPage = data.signCoordinates.signPage;
        if (
          signPage != "P" &&
          signPage != "A" &&
          signPage != "F" &&
          signPage != "L"
        ) {
          setSelectedOption("C");
          setExternalSignCurrentPageNum(parseInt(signPage));
        }

        document.getElementById("declineButton").style.display = "";

        document.getElementById("documntsender0").style.display = "";
        document.getElementById("documntsender").style.display = "";
        document.getElementById("documntsender1").style.display = "";
        document.getElementById("firstPage").disabled = true;
        document.getElementById("lastPage").disabled = true;
        document.getElementById("append").disabled = true;
        document.getElementById("allPage").disabled = true;
        document.getElementById("removeAll").style.display = "none";
        document.getElementById("signaturePage").style.display = "none";
        document.getElementById("customPage").disabled = true;
        document.getElementById("aadhaarModeRadio").disabled = true;
        document.getElementById("electronicModeRadio").disabled = true;
        document.getElementById("selfDscTokenModeRadio").disabled = true;
        document.getElementById("selfDscTokenModeRadio").style.marginLeft =
          "-13px";
        document.getElementById("clientdownloadspan").style.marginLeft = "6px";
        document.getElementById("otpSignModeRadio").style.display = "none";
        document.getElementById("otpsigningtext").style.display = "none";
        document.getElementById("selftokentext").style.display = "";
        document.getElementById("balanceContainer").style.display = "none";
        if (signeruserId === "0") {
          if (data.signMode === "3") {
            document.getElementById("generateaccesscodeBtn").style.display = "";
            document.getElementById("accesscodemsg1").style.display = "";
          }
        }
      }
    }

    subscribedPlanDetails();
    var is_KYC_Verified = sessionStorage.getItem("is_KYC_verified");
    if (is_KYC_Verified != 1) {
      // document.getElementById("availableBalanceId").style.display = "none";
      document.getElementById("aadhaarModeRadio").disabled = true;
      document.getElementById("aadhaarModeRadio").title =
        "Requires KYC verification";
      document.getElementById("aadhaarEsign").title =
        "Requires KYC verification";
      document.getElementById("aadhaarEsign").style.color = "gray";
    }
  }, []);

  useEffect(() => {
    let data = {};
    if (sessionStorage.getItem("txnrefNo") != null && sessionStorage.getItem("ud") == "true") {
      data.signCoordinates = JSON.parse(sessionStorage.getItem("signCoordinates"));
    } else {
      data = props?.location?.state?.details;
    }
    if (
      (data?.hasOwnProperty("externalSigner") && data?.externalSigner) ||
      frompath === "/download/tokenSignDownload" ||
      frompath === "inbox" || (sessionStorage.getItem("txnrefNo") != null && sessionStorage.getItem("ud") == "true")
    ) {
      renderSeal();
    }
  });

  useEffect(() => {
    if (responsedata.status === "SUCCESS") {
      if (selectedMode == "3") {
        calltoclientforTokenCheck();
      }
    }
  },[responsedata]);

  useEffect(() => {
    if (clientCallRespData.status === "SUCCESS") {
      clientResponse();
    }
  },[clientCallRespData]);

  const getColor = () =>
    `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, ${0.5})`;

  const renderInitialValuesToState = (finalDimensions) => {
    // setLoaded(false);
    const dragArrayObject = [];
    const flatArray = [];
    let tempCount = 1;
    let tempAllPageBatch = 1;
    let tempCustomPageBatch = 1;
    let data = {};
    
    //Incase of Aadhaar signing this below block gets executed
    if (sessionStorage.getItem("txnrefNo") != null && sessionStorage.getItem("ud") == "true") {
      data.signCoordinates = JSON.parse(sessionStorage.getItem("signCoordinates"));
    } else {
      data = props?.location?.state?.details;
    }

        //Setting the signPage values to P if we get the SignPage value other than P and A.(*Not From DE from DE I will be always getting signPage value as P and A)
        if (data?.hasOwnProperty("externalSigner") && data?.externalSigner) {
          if (data.signCoordinates.signPage == "F") {
            data.signCoordinates.signPage = "P";
            data.signCoordinates.pageList.push(1);
            data.signCoordinates.signCoordinates[0].page = 1;
          } else if (data.signCoordinates.signPage == "L") {
            data.signCoordinates.signPage = "P";
            data.signCoordinates.pageList.push(
              Number(sessionStorage.getItem("TotalPages"))
            );
            data.signCoordinates.signCoordinates[0].page = Number(
              sessionStorage.getItem("TotalPages")
            );
          } else if (
            data.signCoordinates.signPage != "F" &&
            data.signCoordinates.signPage != "L" &&
            data.signCoordinates.signPage != "A" &&
            data.signCoordinates.signPage != "P"
          ) {
            data.signCoordinates.signCoordinates[0].page = Number(
              data.signCoordinates.signPage
            );
            data.signCoordinates.pageList.push(
              Number(data.signCoordinates.signPage)
            );
            data.signCoordinates.signPage = "P";
          }
        }

        if (
          (data?.hasOwnProperty("externalSigner") && data?.externalSigner) ||
          frompath === "/download/tokenSignDownload" ||
          frompath === "inbox" || sessionStorage.getItem("txnrefNo") != null &&
          sessionStorage.getItem("ud") == "true"
        ) {
          let xVal = [];
          let yVal = [];
          let widthVal = [];
          let heightVal = [];
          let width_ratio_arr = [];
          let height_ratio_arr = [];

          console.log({finalDimensions});

          for (let i = 0; i < pageDimensions.length; i++) {
          if (sessionStorage.getItem("txnrefNo") != null && sessionStorage.getItem("ud") == "true") {
          if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            //For cross compatibality check, the below if block gets executed
            if ((data?.hasOwnProperty("externalSigner") && data?.externalSigner) || frompath === "inbox") {
              //-24 is the offset value of the scrollbar
              width_ratio_arr.push(pageDimensions[i].width / (finalDimensions[i].clientWidth - 16));//8, 20
              //-7 is the default offset value of the height
              height_ratio_arr.push(pageDimensions[i].height / (finalDimensions[i].clientHeight - 9)); //11.5
            } else {
              //-24 is the offset value of the scrollbar
              width_ratio_arr.push(pageDimensions[i].width / (finalDimensions[i].clientWidth - 20));
              //-7 is the default offset value of the height
              height_ratio_arr.push(pageDimensions[i].height / (finalDimensions[i].clientHeight - 9)); //11.5
            }
          } else {
            //-24 is the offset value of the scrollbar
            width_ratio_arr.push(pageDimensions[i].width / (finalDimensions[i].clientWidth - 20));
            //-7 is the default offset value of the height
            height_ratio_arr.push(pageDimensions[i].height / (finalDimensions[i].clientHeight - 6)); //11.5
          }
            setSelectedOptionArray([
              ...selectedOptionArray,
              data.signCoordinates.signPage,
            ]);
            setRangeArray([...rangeArray, ...data.signCoordinates.pageList]);
            setAllRangeArrayValues([...data.signCoordinates.pageList]);
          } else {
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
              //For cross compatibality check, the below if block gets executed
              if ((data?.hasOwnProperty("externalSigner") && data?.externalSigner) || frompath === "inbox") {
                //-8 value is the default offset value
                width_ratio_arr.push(pageDimensions[i].width / (finalDimensions[i].clientWidth - 15)); //8,20
                height_ratio_arr.push(pageDimensions[i].height / (finalDimensions[i].clientHeight - 7)); //11.5, 8, 7
              } else {
                //-8 value is the default offset value
                width_ratio_arr.push(pageDimensions[i].width / (finalDimensions[i].clientWidth - 20)); //8
                height_ratio_arr.push(pageDimensions[i].height / (finalDimensions[i].clientHeight - 9)); //11.5, 8, 7
              }
            } else {
              //-8 value is the default offset value
              width_ratio_arr.push(pageDimensions[i].width / (finalDimensions[i].clientWidth - 20)); //8
              height_ratio_arr.push(pageDimensions[i].height / (finalDimensions[i].clientHeight - 6)); //11.5, 8, 7
            }

            setSelectedOptionArray([
              ...selectedOptionArray,
              data.signCoordinates.signPage,
            ]);
            setRangeArray([...rangeArray, ...data.signCoordinates.pageList] || [...rangeArray, ...data.signCoordinates.pages]);
            setAllRangeArrayValues([...allRangeArrayValues, ...data.signCoordinates.pageList] || [...allRangeArrayValues, ...data.signCoordinates.pages]);
          }
          }
          console.log({ width_ratio_arr });
          console.log({ height_ratio_arr });

          //Create x-coordinate and y-coordinate values Array
          for (
            let j = 0;
            j < data.signCoordinates.signCoordinates.length;
            j++
          ) {
            for (
              let i = 0;
              i <
              data.signCoordinates.signCoordinates[j].signCoordinatesValues
                .length;
              i++
            ) {
              let signCoordinatesData =
                data.signCoordinates.signCoordinates[j].signCoordinatesValues[
                  i
                ];

              if (
                data.hasOwnProperty("externalSigner") &&
                data.externalSigner
              ) {
                if (signCoordinatesData.x != "0" && sessionStorage.getItem("TotalPages") != "1") {
                  xVal.push(
                    parseInt(
                      Math.round(Number(signCoordinatesData.x) / width_ratio_arr[0]),
                      10
                    )
                  );
                } else {
                  xVal.push(
                    parseInt(
                      Math.round(Number(signCoordinatesData.x) / width_ratio_arr[0]),
                      10
                    )
                  );
                }
              } else if (
                frompath === "/download/tokenSignDownload" ||
                frompath === "inbox" || (sessionStorage.getItem("txnrefNo") != null && sessionStorage.getItem("ud") == "true")
              ) {
                //if (data.signCoordinates.signPage == "P") {
                if (
                  sessionStorage.getItem("TotalPages") != "1" &&
                  signCoordinatesData.x != "0"
                ) {
                  xVal.push(
                    parseInt(
                      Math.round(Number(signCoordinatesData.x) / width_ratio_arr[0]) -
                        5,
                      10
                    )
                  );
                } else {
                  xVal.push(
                    parseInt(
                      Math.round(Number(signCoordinatesData.x) / width_ratio_arr[0]),
                      10
                    )
                  );
                }
              }
              yVal.push(
                parseInt(
                  Math.round(Number(signCoordinatesData.y) / height_ratio_arr[data.signCoordinates.pageList[j] - 1]),
                  10
                )
              );

              widthVal.push(
                parseInt(
                  Math.round(Number(signCoordinatesData.width) / width_ratio_arr[0]),
                  10
                )
              );
              heightVal.push(
                parseInt(
                  Math.round(Number(signCoordinatesData.height) / height_ratio_arr[data.signCoordinates.pageList[j] - 1]),
                  10
                )
              );
            }
          }

          // Preparing an array selectedBatchArr which includes which and all batches got added
          let selectedBatchArr = [];
          let defaultPageList = [];
          for (
            let k = 0;
            k < data.signCoordinates.signCoordinates.length;
            k++
          ) {
            for (
              let j = 0;
              j <
              data.signCoordinates.signCoordinates[k].signCoordinatesValues
                .length;
              j++
            ) {
              let internalData =
                data.signCoordinates.signCoordinates[k].signCoordinatesValues[
                  j
                ];

              if (internalData.hasOwnProperty("selectedBatch")) {
                if (internalData.selectedBatch?.charAt(0) !== "A") {
                  selectedBatchArr.push(internalData.selectedBatch);
                } else if (internalData.selectedBatch?.charAt(0) === "A") {
                  selectedBatchArr.push(internalData.selectedBatch);
                }
              }
            }
          }

          //Creating an dragArray object and setting to state so that on page loads that respective objects values will be applied to respective pages
          if (data.signCoordinates.signPage == "P") {
            // Create a page list array---------------
            let pageListArray = [];
            for (
              let a = 0;
              a < data.signCoordinates.signCoordinates.length;
              a++
            ) {
              for (
                let b = 0;
                b <
                data.signCoordinates.signCoordinates[a].signCoordinatesValues
                  .length;
                b++
              ) {
                pageListArray.push(
                  data.signCoordinates.signCoordinates[a].page
                );
              }
            }

            //Creating an dragArray object---------------
            for (let i = 0; i < pageListArray.length; i++) {
              dragArrayObject.push({
                count: count4 + i,
                dragId: "draggable" + (count4 + i),
                left: xVal[i] + "px",
                top: yVal[i] + "px",
                pageNo: pageListArray[i],
                resizeDragHeight: heightVal[i] + "px",
                resizeDragWidth: widthVal[i] + "px",
                selectedPBatch: selectedBatchArr[i],
              });
            }
          } else if (data.signCoordinates.signPage == "A") {
            let pageListA = [];
            //Preparing pagelist array------------------
            for (
              let i = 0;
              i < data.signCoordinates.signCoordinates.length;
              i++
            ) {
              for (
                let j = 0;
                j <
                data.signCoordinates.signCoordinates[i].signCoordinatesValues
                  .length;
                j++
              ) {
                pageListA.push(data.signCoordinates.signCoordinates[i].page);
              }
            }

            pageListA = pageListA.filter(function (item, pos, self) {
              //Removing the duplicates from the array
              return self.indexOf(item) == pos;
            });
            pageListA.shift();
            setRangeArray([...rangeArray, ...pageListA]);
            setAllRangeArrayValues([...allRangeArrayValues, ...pageListA]);  

            //Preparing the defaultPageListA where default seals are present
            let defaultPageListA = [];
            if (data?.hasOwnProperty("externalSigner") && data.externalSigner) {
              for (let i = 0; i < sessionStorage.getItem("TotalPages"); i++) {
                defaultPageListA.push(i + 1);
              }
            } else if (
              frompath === "/download/tokenSignDownload" ||
              frompath === "inbox" || (sessionStorage.getItem("txnrefNo") != null && sessionStorage.getItem("ud") == "true")
            ) {
              for (let i = 0; i < sessionStorage.getItem("TotalPages"); i++) {
                defaultPageListA.push(i + 1);
              }
            }

            defaultPageList = defaultPageListA.filter(
              (item) => !pageListA.includes(item)
            );

            let k = 0;
            for (
              let j = 0;
              j <
              data.signCoordinates.signCoordinates[0].signCoordinatesValues
                .length;
              j++
            ) {
              //Preparing the dragArray objects for default seal positions
              console.log({defaultPageList});
              for (let i = 0; i < defaultPageList.length; i++) {
                let dataSignCoordinates =
                  data.signCoordinates.signCoordinates[0].signCoordinatesValues[
                    j
                  ];
                  console.log(dataSignCoordinates.x);
                let temp_obj = {
                  count: count4 + k,
                  dragId: "draggable" + (count4 + k),
                  left:
                    (data?.hasOwnProperty("externalSigner") &&
                    data?.externalSigner)
                      ? (sessionStorage.getItem("TotalPages") == "1" ||
                        dataSignCoordinates.x == 0)
                        ? parseInt(
                            Math.round(
                              Number(dataSignCoordinates.x) / width_ratio_arr[0]
                            ),
                            10
                          ) + "px"
                        : parseInt(
                            Math.round(
                              Number(dataSignCoordinates.x) / width_ratio_arr[0] - 5
                            ),
                            10
                          ) + "px"
                      : sessionStorage.getItem("TotalPages") == "1" || dataSignCoordinates.x == 0
                      ? parseInt(
                          Math.round(
                            Number(dataSignCoordinates.x) / width_ratio_arr[0]
                          ),
                          10
                        ) + "px"
                      : parseInt(
                          Math.round(
                            Number(dataSignCoordinates.x) / width_ratio_arr[0] - 5
                          ),
                          10
                        ) + "px",
                  top:
                    parseInt(
                      Math.round(Number(dataSignCoordinates.y) / height_ratio_arr[defaultPageList[i] - 1]),
                      10
                    ) + "px",
                  pageNo: defaultPageList[i],
                  resizeDragHeight:
                    parseInt(
                      Math.round(
                        Number(dataSignCoordinates.height) / height_ratio_arr[defaultPageList[i] - 1]
                      ),
                      10
                    ) + "px",
                  resizeDragWidth:
                    parseInt(dataSignCoordinates.width / width_ratio_arr[0], 10) +
                    "px",
                  selectedABatch: dataSignCoordinates.selectedBatch,
                };
                dragArrayObject.push(temp_obj);
                k++;
              }
            }
            console.log({dragArrayObject});


          //Preparing the dragArray objects for custom seal positions
            for (
              let p = 0;
              p < data.signCoordinates.signCoordinates.length;
              p++
            ) {
              if (p != 0) {
                for (
                  let q = 0;
                  q <
                  data.signCoordinates.signCoordinates[p].signCoordinatesValues
                    .length;
                  q++
                ) {
                  let signCoordinateData =
                    data.signCoordinates.signCoordinates[p]
                      .signCoordinatesValues[q];
                  if (
                    (signCoordinateData.hasOwnProperty("selectedBatch") &&
                      signCoordinateData.selectedBatch?.charAt(0) == "A") ||
                    (data.hasOwnProperty("externalSigner") &&
                      data.externalSigner)
                  ) {
                    console.log("All Pages INSIDE");
                    console.log(signCoordinateData.x);
                    dragArrayObject.push({
                      count: count4 + k,
                      dragId: "draggable" + (count4 + k),
                      left:
                        (data.hasOwnProperty("externalSigner") &&
                          data.externalSigner) ||
                        signCoordinateData.x != "0"
                          ? parseInt(
                              Math.round(
                                Number(signCoordinateData.x / width_ratio_arr[0]) - 5
                              ),
                              10
                            ) + "px"
                          : parseInt(
                              Math.round(
                                Number(signCoordinateData.x) / width_ratio_arr[0]
                              ),
                              10
                            ) + "px",
                      pageNo: data.signCoordinates.signCoordinates[p].page,
                      resizeDragHeight:
                        parseInt(
                          Math.round(
                            Number(signCoordinateData.height) / height_ratio_arr[data.signCoordinates.signCoordinates[p].page - 1]
                          ),
                          10
                        ) + "px",
                      resizeDragWidth:
                        parseInt(
                          Math.round(
                            Number(signCoordinateData.width) / width_ratio_arr[0]
                          ),
                          10
                        ) + "px",
                      top:
                        parseInt(
                          Math.round(
                            Number(signCoordinateData.y) / height_ratio_arr[data.signCoordinates.signCoordinates[p].page - 1]
                          ),
                          10
                        ) + "px",
                      selectedABatch: signCoordinateData.selectedBatch,
                    });
                    k++;
                    console.log({dragArrayObject});
                  } else if (
                    (signCoordinateData.hasOwnProperty("selectedBatch") &&
                      signCoordinateData.selectedBatch?.charAt(0) != "A") ||
                    (data.hasOwnProperty("externalSigner") &&
                      data.externalSigner)
                  ) {
                    console.log("Entered");
                    dragArrayObject.push({
                      count: count4 + k,
                      dragId: "draggable" + (count4 + k),
                      left:
                        data.hasOwnProperty("externalSigner") &&
                        data.externalSigner
                          ? parseInt(
                              Math.round(
                                Number(signCoordinateData.x) / width_ratio_arr[0]
                              ),
                              10
                            ) + "px"
                          : (signCoordinateData.x == 0) ? parseInt(
                              Math.round(
                                Number(signCoordinateData.x) / width_ratio_arr[0]
                              ),
                              10
                            ) + "px" : parseInt(
                              Math.round(
                                Number(signCoordinateData.x) / width_ratio_arr[0] - 5
                              ),
                              10
                            ) + "px",
                      pageNo: data.signCoordinates.signCoordinates[p].page,
                      resizeDragHeight:
                        parseInt(
                          Math.round(
                            Number(signCoordinateData.height) / height_ratio_arr[q]
                          ),
                          10
                        ) + "px",
                      resizeDragWidth:
                        parseInt(
                          Math.round(
                            Number(signCoordinateData.width) / width_ratio_arr[0]
                          ),
                          10
                        ) + "px",
                      top:
                        parseInt(
                          Math.round(
                            Number(signCoordinateData.y) / height_ratio_arr[q]
                          ),
                          10
                        ) + "px",
                      selectedPBatch: signCoordinateData.selectedBatch,
                    });
                    k++;
                  }
                }
              }
            }
          }
          console.log({ dragArrayObject });
          const groupedByPBatch = {};
          const groupedByABatch = {};

          dragArrayObject.forEach((obj) => {
            if ("selectedPBatch" in obj) {
              const pBatch = obj.selectedPBatch;
              if (!groupedByPBatch[pBatch]) {
                groupedByPBatch[pBatch] = [];
              }
              groupedByPBatch[pBatch].push(obj);
            } else if ("selectedABatch" in obj) {
              // } else if ("selectedBatch" in obj && obj.selectedBatch?.charAt(0) === "A") {
              const aBatch = obj.selectedABatch;
              if (!groupedByABatch[aBatch]) {
                groupedByABatch[aBatch] = [];
              }
              groupedByABatch[aBatch].push(obj);
            }
          });
          let batchList = {};
          for (const batchName in groupedByABatch) {
            if (groupedByABatch.hasOwnProperty(batchName)) {
              groupedByABatch[batchName].forEach((obj) => {
                if (!batchList.hasOwnProperty(batchName)) {
                  batchList[batchName] = getColor();
                }
                obj.color = batchList[batchName];
              });
            }
          }

          for (const batchName in groupedByPBatch) {
            if (groupedByPBatch.hasOwnProperty(batchName)) {
              groupedByPBatch[batchName].forEach((obj) => {
                if (!batchList.hasOwnProperty(batchName)) {
                  batchList[batchName] = getColor();
                }
                obj.selectedPBatch === "F" ||
                obj.selectedPBatch === "C" ||
                obj.selectedPBatch === "L"
                  ? (obj.color = getColor())
                  : (obj.color = batchList[batchName]);
              });
            }
          }

          // Combine objects from the first grouped array
          for (const batchName in groupedByPBatch) {
            if (groupedByPBatch.hasOwnProperty(batchName)) {
              groupedByPBatch[batchName].forEach((obj) => {
                // Add the batchName to each object for reference
                obj.batchName = batchName;
                flatArray.push(obj);
              });
            }
          }

          // Combine objects from the second grouped array
          for (const batchName in groupedByABatch) {
            if (groupedByABatch.hasOwnProperty(batchName)) {
              groupedByABatch[batchName].forEach((obj) => {
                // Add the batchName to each object for reference
                obj.batchName = batchName;
                flatArray.push(obj);
              });
            }
          }

          console.log("Flat array:", flatArray);

          setCount(count + flatArray.length);
          let tempFlatArray = [...flatArray];
          tempFlatArray = tempFlatArray.filter(
            (obj, index, self) =>
              self.findIndex(
                (item) =>
                  (item.selectedABatch || item.selectedPBatch) ===
                  (obj.selectedABatch || obj.selectedPBatch)
              ) === index
          );

          for (let i = 0; i < tempFlatArray.length; i++) {
            if (
              tempFlatArray[i].selectedABatch &&
              tempFlatArray[i].selectedABatch.charAt(0) == "A"
            ) {
              tempAllPageBatch = tempAllPageBatch + 1;
            } else if (
              tempFlatArray[i].selectedPBatch &&
              tempFlatArray[i].selectedPBatch.charAt(0) == "P"
            ) {
              tempCustomPageBatch = tempCustomPageBatch + 1;
            }
          }
          setAllPageBatch(tempAllPageBatch);
          setCustomPageBatch(tempCustomPageBatch);
          setDragArray(flatArray);
        // }
      // }
        // clearInterval(intervalId);
        // handlePageChange();
        // clearInterval(intervalId);
      }
      setLoaded(true);
    // };
    // const intervalId = setInterval(checkForElement, 100);
    // return () => clearInterval(intervalId);
  };

  useLayoutEffect(() => {
    setLoaded(false);
    let data = props?.location?.state?.details;
    if (data?.files?.preview) {
      console.log("SELF");
      setFileUrl(data.files.preview);
      initialRenderCal();
    }

    //check local token or something
    if (sessionStorage.externalSigner != "true") {
      getWalletDetailsonLoad();
    }
    
    if (
      sessionStorage.getItem("txnrefNo") != null &&
      sessionStorage.getItem("ud") == "true"
    ) {
      createFile(
        sessionStorage.getItem("txnrefNo"),
        sessionStorage.getItem("signedStatus")
      );
    } else if (
      frompath === "dropdoc" ||
      frompath === "jsguest" ||
      frompath === "/download/tokenSignDownload" ||
      frompath === "inbox" ||
      frompath === "/templatePdfPreview" || frompath === "deGuest"
    ) {
      if (frompath === "/templatePdfPreview") {
        sessionStorage.setItem(
          "draftRefNumber",
          props?.location?.state?.details?.temptDrftRefFromServer
        );
        setTempCode(props?.location?.state?.details?.tempCode);
        setGroupCode(props?.location?.state?.details?.groupCode);
        setSubGroup(props?.location?.state?.details?.subGroup);
        setDraftRefNumber(props?.location?.state?.details?.temptDrftRefFromServer);
        setFromTemplatePage(props?.location?.state?.details?.fromTemplatePage);
      }
      if (frompath === "inbox") {
        if (
          props?.location?.state?.details.hasOwnProperty("signerListDetails")
        ) {
          setCommentsListDetails(
            props?.location?.state?.details?.signerListDetails
          );
        }
        setDocId(props?.location?.state?.details?.docId);
      }
      if (frompath === "jsguest" || frompath === "deGuest") {
        setIsExternalGuestAccess("");
        setCommentsMargin("3rem");
        setCommentsListDetails(
          JSON.parse(props?.location?.state?.details?.signerListDetails)
        );
      }
      setFile(props?.location?.state?.details?.files);
      setCanvas_width(props?.location?.state?.details?.width);
      setCanvas_height(props?.location?.state?.details?.height);
      setSenderName(props?.location?.state?.details?.sendername);
      setRequestedTime(props?.location?.state?.details?.requestedTime);
      setUsername(props?.location?.state?.details?.username);
      setSigneremail(props?.location?.state?.details?.email);
      setSigneruserId(props?.location?.state?.details?.userId);
      setSignerMobileNumber(props?.location?.state?.details?.mobileNo);
      setOwnerloginName(props?.location?.state?.details?.ownerloginName);
      setCustomDocName(props?.location?.state?.details?.customDocName || sessionStorage.getItem("customDocName"));
      sessionStorage.setItem("externalSigner", false);
      if (
        frompath === "inbox" &&
        data.hasOwnProperty("loginMode") &&
        data.loginMode
      ) {
        setAuthToken(props?.location?.state?.details?.authToken);
      } else {
        setAuthToken(sessionStorage.getItem("authToken"));
      }
    
      // for multi user external signer fixing coordinates
      if (data?.hasOwnProperty("externalSigner") && data?.externalSigner) {
        setHeight(data.height);
        setWidth(data.width);
        setRange_array(data.signCoordinates.pages);
        setSelectedOption(data.signCoordinates.signPage);
        setDocId(props?.location?.state?.details?.docId);
        sessionStorage.setItem("externalSigner", true);
      }
    } else {
      props.history.push("/");
    }
  }, []);

  const initialRenderCal = () => {
    setLoaded(false);
    let data = props?.location?.state?.details;
    //Preparing equal and unequal pages incase of multiple page document
    const unequalPages = [];
    const equalPages = [];
    if (pageDimensions.length > 1) {
      pageDimensions.forEach(page => {
        const roundedWidth = Math.round(page.width);
        const roundedHeight = Math.round(page.height);
        const roundedPropWidth = Math.round(props?.location?.state?.details?.width);
        const roundedPropHeight = Math.round(props?.location?.state?.details?.height);
        if (roundedWidth !== roundedPropWidth || roundedHeight !== roundedPropHeight) {
          unequalPages.push(page.pageNumber);
        } else {
          equalPages.push(page.pageNumber);
        }
      });
    }
    setUnequalPages(unequalPages);
    console.log({unequalPages});
    console.log({equalPages});
        
    let capturedDimensions = [];
    const finalDimensions = [];
    const checkForElement = async () => {
      setLoaded(false);
    
      // Array to store the final result    
      let docuPageTestElement = document.getElementById("docuPageTest" + currentPage);
    
          if (docuPageTestElement) {
            clearInterval(intervalId);//It stops the function checkForElement from executing further

            //Setting the width to static so that it will work even when assigned from old UI
            //Since we have a scroll in new UI and not in old UI 
            if (sessionStorage.getItem("TotalPages") == 1) {
              document.getElementById("parent-div").style.height = "auto"; //So that for single page document scroll wont come
            } else if (sessionStorage.getItem("TotalPages") != 1) {
              document.getElementById("parent-div").style.width = "476.67px";
            }
    
            // Call this function with the unequal pages array
            if (!props?.location?.state?.details?.equalPageDimensions) {
              setLoaded(false);
              if (currentPage == 1 && equalPages[0] == 1) {
              } else {
                jumpToPage(equalPages[0] - 1)
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
    
              //One record from equal pages to create All pages object
              const pageElementEqual = document.getElementById(`docuPageTest${equalPages[0]}`);
              if (pageElementEqual) {
                setLoaded(false);
                const pageNumberValue = pageElementEqual.getAttribute('aria-label');
                const newDimensions = {
                  pageNumber: pageNumberValue,
                  clientWidth: pageElementEqual.clientWidth,
                  clientHeight: pageElementEqual.clientHeight
                };
                // Assign values to clientDimensions array
                capturedDimensions.push(newDimensions);
                // setClientDimensions(prevDimensions => [...prevDimensions, newDimensions]);
              }
    
              for (let i = 0; i < unequalPages.length; i++) {
                setLoaded(false);
                if (currentPage == 1 && unequalPages[i] == 1) {
                } else {
                  setLoaded(false);
                  jumpToPage(unequalPages[i] - 1);
                  setLoaded(false);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  jumpToPage(unequalPages[i] - 2);
                  setLoaded(false);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  jumpToPage(unequalPages[i] - 1);
                  setLoaded(false);
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  setLoaded(false);
                }
                const pageElement = document.getElementById(`docuPageTest${unequalPages[i]}`);
                if (pageElement) {
                  setLoaded(false);
                  const pageNumberValue = pageElement.getAttribute('aria-label'); 
                    const newDimensions = {
                    pageNumber: pageNumberValue,
                    clientWidth: pageElement.clientWidth,
                    clientHeight: pageElement.clientHeight
                  };
                  // Assign values to clientDimensions array
                  capturedDimensions.push(newDimensions);
                  // setClientDimensions(prevDimensions => [...prevDimensions, newDimensions]);
                }
              }
              jumpToPage(0);
              // console.log({capturedDimensions});

            // Check if the dimensions of any unequal page match with those of any equal page
            const matchFound = unequalPages.some(unequalPageNumber => {
              const unequalPage = capturedDimensions.find(page => page.pageNumber === `Page ${unequalPageNumber}`);
              const unequalPageHeight = unequalPage.clientHeight;

              return equalPages.some(eqPage => {
                  const equalPage = capturedDimensions.find(page => page.pageNumber === `Page ${eqPage}`);
                  return equalPage && equalPage.clientHeight === unequalPageHeight;
              });
          });

          if (matchFound) {
            // Recapture the dimensions of unequal pages
            await recaptureDimensions();
          } else {
            setLoaded(false);
            // Iterate over the total number of pages in the document
            for (let i = 1; i <= sessionStorage.getItem("TotalPages"); i++) {
              const pageNumber = `Page ${i}`;
              
              // Check if the page already exists in capturedDimensions
              const pageExists = capturedDimensions.some(obj => obj.pageNumber === pageNumber);

              // If the page doesn't already exist, add the first page dimensions
              if (!pageExists) {
                  finalDimensions.push({
                      pageNumber,
                      clientWidth: capturedDimensions[0].clientWidth,
                      clientHeight: capturedDimensions[0].clientHeight
                  });
              } else {
                  // If the page exists, add the dimensions from capturedDimensions
                  finalDimensions.push(capturedDimensions.find(obj => obj.pageNumber === pageNumber));
              }
            }
            setFinalClientDimensions([...finalDimensions]);
          }
          } else {
            // Iterate over the total number of pages in the document
            for (let i = 1; i <= sessionStorage.getItem("TotalPages"); i++) {
              const pageNumber = `Page ${i}`;

                  const newDimensions = {
                  pageNumber: pageNumber,
                  clientWidth: docuPageTestElement.clientWidth,
                  clientHeight: docuPageTestElement.clientHeight
                };
                // Assign values to clientDimensions array
                finalDimensions.push(newDimensions);
            }
            setFinalClientDimensions([...finalDimensions]);
            // setLoaded(true);
          }
          console.log({finalDimensions});
        }

      if (finalDimensions != []) {
          if (finalDimensions.length == sessionStorage.getItem("TotalPages")) {
            console.log({finalDimensions});
            renderInitialValuesToState(finalDimensions);
          }
        }
      }

    const intervalId = setInterval(checkForElement, 100);
    return () => clearInterval(intervalId);
  }

  const recaptureDimensions = async () => {
    setLoaded(false);
    const recapturedDimensions = [];
    for (let i = 0; i < unequalPages.length; i++) {
        const pageNum = unequalPages[i];
        jumpToPage(pageNum - 1);
        await new Promise(resolve => setTimeout(resolve, 500));
        const pageElement = document.getElementById(`docuPageTest${pageNum}`);
        if (pageElement) {
            const pageNumberValue = pageElement.getAttribute('aria-label'); 
            const newDimensions = {
                pageNumber: pageNumberValue,
                clientWidth: pageElement.clientWidth,
                clientHeight: pageElement.clientHeight
            };
            // Assign values to recapturedDimensions array
            recapturedDimensions.push(newDimensions);
        }
    }
    setFinalClientDimensions([...recapturedDimensions]);
    // setLoaded(true);
};

  useEffect(() => {
    if (file?.preview && !fileUrl) {
      console.log("AADHAAR");
      setFileUrl(file.preview);
      pdfViewer();
      initialRenderCal();
      setLoaded(true);
    }
  }, [file, fileUrl, props?.location?.state?.details]);


  const createFile = async (txnrefNo, signedStatus) => {
    setLoaded(false);
    try {
      let response = await fetch(
        URL.downloadfromtemp +
          "?at=" +
          btoa(sessionStorage.getItem("authToken")) +
          "&txnrefNo=" +
          btoa(txnrefNo) +
          "&signedStatus=" +
          signedStatus
      );
      let data = await response.blob();
      console.log(data);
      await test(data); // Call the test function here
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  const test = async (data) => {
    console.log(data);
     // Convert blob data to ArrayBuffer
     const arrayBuffer = await data.arrayBuffer();
     console.log(arrayBuffer);

    const loadingTask = pdfjsforOnDrag.getDocument(arrayBuffer);
    const pdf = await loadingTask.promise;
            const numPages = pdf.numPages;
            const pageDimensionsArr = [];
          for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
              const page = await pdf.getPage(pageNumber);
              const viewport = page.getViewport({ scale: 1 });

              pageDimensionsArr.push({
                  pageNumber: pageNumber,
                  width: viewport.width,
                  height: viewport.height,
              });
          }
          console.log(pageDimensionsArr);
          setPageDimensions(pageDimensionsArr);

          // Iterate through the array and compare dimensions
          for (let i = 1; i < pageDimensionsArr.length; i++) {
            if (pageDimensionsArr.length != 1) {

              if (pageDimensionsArr[i].width !== pageDimensionsArr[0].width || 
                pageDimensionsArr[i].height !== pageDimensionsArr[0].height) {
                  console.log("FALSE");
                  setEqualPageDimensions(false);
                  break;
              }
            }
          }

    let metadata = {
      type: data.type || "application/pdf", // Fallback to application/pdf if type is not provided
    };
  
    let fileName = sessionStorage.getItem("fileName");
  
    var file1 = new File([data], fileName.split("@")[1], metadata);
    file1.preview = window.URL.createObjectURL(file1);
    setFile(file1);
    setCanvas_width(sessionStorage.getItem("width"));
    setCanvas_height(sessionStorage.getItem("height"));
  };


  //---------Everytime page loads this is getting called and based on array values it returns Draggable div-----
  useEffect(() => {
    let data = {};
    if (sessionStorage.getItem("txnrefNo") != null && sessionStorage.getItem("ud") == "true") {
      data.signCoordinates = JSON.parse(sessionStorage.getItem("signCoordinates"));
    } else {
      data = props?.location?.state?.details;
    }
    if (
      data?.hasOwnProperty("externalSigner") &&
      data?.externalSigner
    ) {
      // Delay the rendering of draggable elements
      setTimeout(() => {
        renderSeal();

        // Initialize draggable and resizable behaviors
        initializeDraggableAndResizable();
      }, 1000);
    } else {
      if (frompath === "/download/tokenSignDownload" || frompath === "inbox" || (sessionStorage.getItem("txnrefNo") != null && sessionStorage.getItem("ud") == "true")) {
        setSelectedMode(data.signCoordinates.signMode + "");
        if (data.signCoordinates.signMode == "1") {
          document.getElementById("handSignContainer").style.display = ""; //
          document.getElementById("clientdownload").style.display = "none";
          document.getElementById("generateOtpMode").style.display = "none";
          document.getElementById("submitBtn").style.display = "";
          setTandcHeader("Aadhaar eSign");

          document.getElementById("aadhaarModeRadio").checked = true;
        } else if (data.signCoordinates.signMode == "2") {
          document.getElementById("handSignContainer").style.display = "";
          document.getElementById("clientdownload").style.display = "none";
          document.getElementById("generateOtpMode").style.display = "none";
          document.getElementById("submitBtn").style.display = "";

          setTandcHeader("Electronic Sign");
          setIsInsufficientUnits(false);
          document.getElementById("electronicModeRadio").checked = true;
        } else if (data.signCoordinates.signMode == "3") {
          document.getElementById("handSignContainer").style.display = "";
          document.getElementById("clientdownload").style.display = "";
          document.getElementById("generateOtpMode").style.display = "none";
          document.getElementById("submitBtn").style.display = "";
          var units = parseInt(sessionStorage.getItem("units"), 10);
          setTandcHeader("Self Token Sign");
          setIsInsufficientUnits(false);
          document.getElementById("selfDscTokenModeRadio").checked = true;
        } else if (data.signCoordinates.signMode == "4") {
          document.getElementById("otpSignModeRadio").checked = true;

          document.getElementById("handSignContainer").style.display = "none";
          document.getElementById("clientdownload").style.display = "none";
          document.getElementById("generateOtpMode").style.display = "";
          document.getElementById("submitBtn").style.display = "none";
          setIsInsufficientUnits(false);
          setTandcHeader("OTP Sign");
        }
      }
      renderSeal();
      // Initialize draggable and resizable behaviors
      initializeDraggableAndResizable();
    }
  }, [currentPage, dragArray]);

  const renderSeal = () => {
    let data = props?.location?.state?.details;
    if (dragArray) {
      dragArray.map((value, index) => {
        var count1 = value.count;
        var dragId = value.dragId;
        var current_page = value.pageNo;
        var dragContainer = "#docuPageTest" + current_page;
        var isDragIdExists = document.getElementById(dragId);
        if (isDragIdExists === null) {
          //Returned drag div will get append to dragContainer----
          $(dragContainer).append(function () {
            if (
              data?.hasOwnProperty("externalSigner") &&
              data?.externalSigner
            ) {
              return `
                <div id="${dragId}" class="drag" data-dragpage="${current_page}" style= "cursor: pointer !important;">
                  Click here to sign
                </div>
            `;
            } else {
              return (
                '<div id="drag-item"><div id = "' +
                dragId +
                '" class = "drag" data-dragpage="' +
                current_page +
                '">Seal No.' +
                count1 +
                '<img class="close" src=' +
                closeDragDiv +
                ' alt=""></div></div>'
              );
            }
          });
        }

        //-------------For appending the draggable div to fixed position of 0px x,y-axis and resized values-----
        const myDiv = document.getElementById(dragId);
        if (myDiv) {
          myDiv.style.left = value.left;
          myDiv.style.top = value.top;
          myDiv.style.height = value.resizeDragHeight;
          myDiv.style.width = value.resizeDragWidth;
          myDiv.style.backgroundColor = value.color;
        }
      });
    }
  };

  //-------Onclick, this function will prepare Array of objects(dragArray)-----
  const addSignatureStamp = () => {
    const randomColor = `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
      Math.random() * 255
    )},${Math.floor(Math.random() * 255)},${0.5})`;
    var dragId = "draggable" + count;
    setCount(count + 1);

    let defaultDragWidthValue = /iPhone|iPad|iPod|Android/i.test(
      navigator.userAgent
    )
      ? defaultDragWidthMob
      : defaultDragWidth;
    let defaultDragHeightValue = /iPhone|iPad|iPod|Android/i.test(
      navigator.userAgent
    )
      ? defaultDragHeightMob
      : defaultDragHeight;

    //Preparing the draggable div object-------
    const item = {
      dragId: dragId,
      count: count,
      pageNo: currentPage,
      left: defaultLeft,
      top: defaultTop,
      resizeDragWidth: defaultDragWidthValue,
      resizeDragHeight: defaultDragHeightValue,
      selectedPBatch: "C",
      color: randomColor,
    };
    //Storing the prepared draggable div object into the dragArray-----
    setDragArray([...dragArray, item]);
  };

  //------This function will be executed when the external signer onclick on seals while signing
  const handleSelectSignClick = (e) => {
    let data = props?.location?.state?.details;
    if (data.externalSigner) {
      if (selectedMode == "2" || selectedMode == "3" || selectedMode == "1") {
        document.getElementById("signaturePadBtn").click();
      } else {
        validationCheck();
      }
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [containmentPage]);

  //------Updating mutation ref-----------
  useEffect(() => {
    mutationRef.current = containmentPage;
  }, [containmentPage]);

  useEffect(() => {
    // Assuming this is some listener which cannot be created on every re-render
    // Possibly a socket connection or a listner on video
    const timer = setInterval(() => {}, 2000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // useEffect to update containmentPage when it changes
  useEffect(() => {
    // You can now use the updated containmentPage state to set containment in draggable
    $(".drag")
      .draggable({
        containment: "#testInner-" + (containmentPage - 1),
      })
      .resizable({
        containment: "#testInner-" + (containmentPage - 1),
      });
  }, [containmentPage]); // This useEffect will re-run whenever containmentPage changes

  //----------For draggable of marker, setting containment and getting position of markers and resized values-----
  const initializeDraggableAndResizable = () => {
    $(document).ready(function (event) {
      //-------For getting the id of draggable div which needs to be dragged on performing onmouseover--------
      if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        window.onmouseover = (e) => {
          if (window.location.pathname === "/preview") {
            if (e.target.id.includes("draggable")) {
              //Initializing the state variable containmentPage and this variable will be assigned to draggable as containment----
              setContainmentPage($("#" + e.target.id).data("dragpage"));
            }
          }
        };
      } else if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        if (window.location.pathname === "/preview") {
          window.ontouchstart = (e) => {
            if (e.target.id.includes("draggable")) {
              setContainmentPage($("#" + e.target.id).data("dragpage"));
            }
          };

          window.ontouchmove = (e) => {
            if (e.target.id.includes("draggable")) {
              setContainmentPage($("#" + e.target.id).data("dragpage"));
            }
          };
        }
      }
      let data = props?.location?.state?.details;
      var dragDiv;
      if (data?.hasOwnProperty("externalSigner") && data?.externalSigner) {
        $(".drag").draggable({ disabled: true });
        $(".drag").resizable({ disabled: true });
        $(".drag")
          .off()
          .on("click", function (e) {
            handleSelectSignClick();
          });
      } else {
        $(".drag")
          .draggable({
            //Setting containment based on dragpage value returned along with draggable div-----
            containment: "#testInner-" + (containmentPage - 1),

            //Provides us with updated x and y positions----------
            drag: function (event, ui) {
              // Prevent default touch scroll behavior while dragging (only for touch events)
              if (event.type.startsWith("touch")) {
                event.preventDefault();
              }
              // alert(event);
              var xPos;
              var yPos;
              for (
                let index = 0;
                index < sessionStorage.getItem("TotalPages");
                index++
              ) {
                //Getting particular draggable div------
                dragDiv = ui.helper[0];
                //Getting drag div's x and y positions--------
                xPos = ui.helper[0].style.left;
                yPos = ui.helper[0].style.top;
              }

              if (dragArray) {
                dragArray.map((value, index) => {
                  if (value.dragId === dragDiv.id) {
                    //Setting drag div's x and y positions to dragArray
                    value.left = xPos;
                    value.top = yPos;
                  }
                });
              }
            },

            stop: function (event, ui) {
              const batch = dragArray.filter(
                (dragArr) => dragArr.dragId == event.target.id
              );

              let countVal = 0;
              for (let i = 0; i < dragArray.length; i++) {
                if ("selectedPBatch" in dragArray[i]) {
                  if (dragArray[i].selectedPBatch == batch[0].selectedPBatch) {
                    countVal++;
                  }
                } else if ("selectedABatch" in dragArray[i]) {
                  if (dragArray[i].selectedABatch == batch[0].selectedABatch) {
                    countVal++;
                  }
                }
              }

              if (
                sessionStorage.getItem("TotalPages") != 1 &&
                dragArray.length > 1
              ) {
                if (
                  batch[0].hasOwnProperty("selectedABatch") ||
                  batch[0].hasOwnProperty("selectedPBatch")
                ) {
                  if (
                    batch[0].selectedPBatch != "F" &&
                    batch[0].selectedPBatch != "L" &&
                    batch[0].selectedPBatch != "C" &&
                    countVal > 1
                  ) {
                    confirmAlert({
                      title: "Confirm position",
                      message: `Do you want to reposition this seal on all ${countVal} pages? Seal position remains same, if the repositioned seal goes out of the page`,
                      buttons: [
                        {
                          label: "Yes",
                          className: "confirmBtn",
                          onClick: () => {
                            confirmationForPosition(batch);
                          },
                        },
                        {
                          label: "No",
                          className: "cancelBtn",
                          onClick: () => {
                            getCustomDrags(event.target.id);
                          },
                        },
                      ],
                    });
                  }
                }
              }
            },
          })
          .resizable({
            // containment: "#docuPageTest" + (containmentPage),
            containment: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
              ? ""
              : "#testInner-" + (containmentPage - 1),

            minHeight: window.innerWidth >= 768 ? 50 : 35,
            minWidth: window.innerWidth >= 768 ? 88 : 66,
            maxHeight: window.innerWidth >= 768 ? 92 : 68,
            maxWidth: window.innerWidth >= 768 ? 168 : 125,

            resize: function (event, ui) {
              // Prevent default touch scroll behavior while resizing
              if (event.type.startsWith("touch")) {
                event.preventDefault();
              }
              var dragDivHeight;
              var dragDivWidth;
              for (
                let index = 0;
                index < sessionStorage.getItem("TotalPages");
                index++
              ) {
                //Getting particular draggable div------
                dragDiv = ui.helper[0];
                //Getting drag div's resized height and width-------
                dragDivHeight = ui.helper[0].style.height;
                dragDivWidth = ui.helper[0].style.width;
              }

              if (dragArray) {
                dragArray.map((value, index) => {
                  if (value.dragId === dragDiv.id) {
                    //Setting drag div's resized height and width to dragArray------
                    value.resizeDragHeight = dragDivHeight;
                    value.resizeDragWidth = dragDivWidth;
                  }
                });
              }
            },

            stop: function (event, ui) {
              const batch = dragArray.filter(
                (dragArr) => dragArr.dragId == event.target.id
              );

              // Getting the count val for including it in message
              let countVal = 0;
              for (let i = 0; i < dragArray.length; i++) {
                if ("selectedPBatch" in dragArray[i]) {
                  if (dragArray[i].selectedPBatch == batch[0].selectedPBatch) {
                    countVal++;
                  }
                } else if ("selectedABatch" in dragArray[i]) {
                  if (dragArray[i].selectedABatch == batch[0].selectedABatch) {
                    countVal++;
                  }
                }
              }

              if (
                sessionStorage.getItem("TotalPages") != 1 &&
                dragArray.length > 1
              ) {
                if (
                  batch[0].hasOwnProperty("selectedABatch") ||
                  batch[0].hasOwnProperty("selectedPBatch")
                ) {
                  if (
                    batch[0].selectedPBatch != "F" &&
                    batch[0].selectedPBatch != "L" &&
                    batch[0].selectedPBatch != "C" &&
                    countVal > 1
                  ) {
                    confirmAlert({
                      title: "Confirm size",
                      message: `Do you want to resize this seal on all ${countVal} pages? Seal size remains same, if the seal goes out of the page`,
                      buttons: [
                        {
                          label: "Yes",
                          className: "confirmBtn",
                          onClick: () => {
                            confirmationForResize(batch);
                          },
                        },
                        {
                          label: "No",
                          className: "cancelBtn",
                          onClick: () => {
                            getCustomResizedDrags(event.target.id);
                          },
                        },
                      ],
                    });
                  }
                }
              }
            },
          });

        //---------To ge the custom positioned DragId like when user select All page option and after dragging if he selected position option as cancel
        const getCustomDrags = (dragObjId) => {
          // console.log(dragObjId);
          // console.log(customPositionedDragIds);
          setCustomPositionedDragIds(customPositionedDragIds => [...customPositionedDragIds, dragObjId]);
        };

        //---------To ge the custom resized DragId like when user select All page option and after resizing if he selected position option as cancel
        const getCustomResizedDrags = (dragObjId) => {
          setCustomResizedDragIds(customResizedDragIds => [...customResizedDragIds, dragObjId]);
        };

        //-------------For closing each markers-----------
        const showIt = (element) => {
          return element.parentNode;
        };

        $("img.close")
          .off()
          .on("click", function (e) {
            var parent = showIt(this);

            //For removal of draggable from array--------
            let closedDivId = parent.id;
            if (dragArray) {
              var filterdDragArray = dragArray.filter(
                (item) => item.dragId !== closedDivId
              );
              $("#" + closedDivId).remove();
              setDragArray(filterdDragArray);

              //For removal of draggable from UI---------
              $("#" + closedDivId).remove();
              toast.error("Seal removed from current page");
              setExclusionDragIds([...exclusionDragIds, closedDivId]);
              return;
            }
          });
      }
    });
  };

  useEffect(() => {
    console.log("Updated customPositionedDragIds:", customPositionedDragIds);
  }, [customPositionedDragIds]);
  useEffect(() => {
    // console.log("Updated customResizedDragIds:", customResizedDragIds);
  }, [customResizedDragIds]);

  //Asking users whether the draggables of All pages and Custom pages to be set to default positions or custom positions
  const confirmationForPosition = (batchValue) => {
    console.log({batchValue});
    var batchArray = [];
    let mainXCord = batchValue[0].left;
    let mainYCord = batchValue[0].top;

    if (batchValue[0].hasOwnProperty("selectedABatch")) {
      batchArray = dragArray.filter(
        (dragArr) =>
          dragArr.selectedABatch === batchValue[0].selectedABatch &&
          dragArr.dragId !== batchValue[0].dragId
      );
    } else if (batchValue[0].hasOwnProperty("selectedPBatch")) {
      batchArray = dragArray.filter(
        (dragArr) =>
          dragArr.selectedPBatch === batchValue[0].selectedPBatch &&
          dragArr.dragId !== batchValue[0].dragId
      );
    }
    console.log({batchArray});

    let newLeft = Number(mainXCord.slice(0, -2));
    let newTop = Number(mainYCord.slice(0, -2));

    const dragIdsToBeRemoved = [];
    const dragIdsToBeAdded = [];

    for (let i = 0; i < batchArray.length; i++) {
      let actualWidth = Number(batchArray[i].resizeDragWidth.slice(0, -2));
      let actualHeight = Number(batchArray[i].resizeDragHeight.slice(0, -2));
      if (
        (newLeft + actualWidth + 4) > finalClientDimensions[batchArray[i].pageNo - 1].clientWidth ||
        (newTop + actualHeight + 4) > finalClientDimensions[batchArray[i].pageNo - 1].clientHeight
      ) {
        console.log(batchArray[i].pageNo);
        dragIdsToBeAdded.push(batchArray[i].dragId);
        // setCustomPositionedDragIds([...customPositionedDragIds, batchArray[i].dragId]);
      } else {
        console.log(batchArray[i].dragId);
        if (customPositionedDragIds.includes(batchArray[i].dragId)) {
          dragIdsToBeRemoved.push(batchArray[i].dragId);
        }
        batchArray[i].left = mainXCord;
        batchArray[i].top = mainYCord;
      }
    }
    console.log({dragIdsToBeAdded});
    console.log({dragIdsToBeRemoved});

    // Update the customPositionedDragIds state
    setCustomPositionedDragIds(prevCustomPositionedDragIds => [
      ...prevCustomPositionedDragIds.filter(id => !dragIdsToBeRemoved.includes(id)), 
      ...dragIdsToBeAdded
    ]);
  };

  //Asking users whether the draggables of All pages and Custom pages to be set to default positions or custom positions
  const confirmationForResize = (batchValue) => {
    var batchArray = [];
    let mainResizedHeight = batchValue[0].resizeDragHeight;
    let mainResizedWidth = batchValue[0].resizeDragWidth;

    if (batchValue[0].hasOwnProperty("selectedABatch")) {
      batchArray = dragArray.filter(
        (dragArr) =>
          dragArr.selectedABatch === batchValue[0].selectedABatch &&
          dragArr.dragId !== batchValue[0].dragId
      );
    } else if (batchValue[0].hasOwnProperty("selectedPBatch")) {
      batchArray = dragArray.filter(
        (dragArr) =>
          dragArr.selectedPBatch === batchValue[0].selectedPBatch &&
          dragArr.dragId !== batchValue[0].dragId
      );
    }

    let newWidth = Number(mainResizedWidth.slice(0, -2));
    let newHeight = Number(mainResizedHeight.slice(0, -2));

    const dragIdsToBeRemoved = [];
    const dragIdsToBeAdded = [];

    for (let i = 0; i < batchArray.length; i++) {
      let actualLeft = Number(batchArray[i].left.slice(0, -2));
      let actualTop = Number(batchArray[i].top.slice(0, -2));

      if (
        actualLeft + newWidth > finalClientDimensions[batchArray[i].pageNo - 1].clientWidth ||
        actualTop + newHeight > finalClientDimensions[batchArray[i].pageNo - 1].clientHeight
      ) {
        dragIdsToBeAdded.push(batchArray[i].dragId);
      } else {
        if (customPositionedDragIds.includes(batchArray[i].dragId)) {
          dragIdsToBeRemoved.push(batchArray[i].dragId);
        }
        batchArray[i].resizeDragHeight = mainResizedHeight;
        batchArray[i].resizeDragWidth = mainResizedWidth;
      }
    }
    console.log({dragIdsToBeAdded});
    console.log({dragIdsToBeRemoved});

    //Update the customResizedDragIds state
    setCustomResizedDragIds(prevCustomResizedDragIds => [
      ...prevCustomResizedDragIds.filter(id => !dragIdsToBeRemoved.includes(id)),
      ...dragIdsToBeAdded
    ]);
  };

  /*--------------For Thumbnail Rendering-----------------*/
  const thumbnailPluginInstance = thumbnailPlugin();
  const { Thumbnails } = thumbnailPluginInstance;

  const renderThumbnailItem = (props) => (
    <div
      key={props.pageIndex}
      data-testid={`thumbnail-${props.pageIndex}`}
      style={{
        backgroundColor:
          props.pageIndex === props.currentPage ? "rgba(0, 0, 0, 0.3)" : "#fff",
        cursor: "pointer",
        display: "block",
        padding:
          sessionStorage.getItem("TotalPages") == 1 ? "0.7rem" : "0.5rem",
      }}
    >
      <div style={{ marginBottom: "0.1rem" }} onClick={props.onJumpToPage}>
        {props.renderPageThumbnail}
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          margin: "0 auto",
          width: "100px",
        }}
      >
        <div style={{ marginRight: "center" }}> {props.renderPageLabel}</div>
      </div>
    </div>
  );

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { jumpToPage } = pageNavigationPluginInstance;
  const { GoToNextPageButton, GoToPreviousPage } = pageNavigationPluginInstance;

  //For displaying of custom range field
  const rangeInput = (e) => {
    setTooltipOpen(false); //
    setSubmitted(false); //
    setSelectedOption(e.target.value);
    if (e.target.value === "P") {
      document.getElementById("range-fieldIdAdd").value = range;
      document.getElementById("range-fieldIdAdd").className = "showField";
    }
  };

  // For removing 0 and NaN from the array
  const removeItems = (array, itemsToRemove) => {
    var i = array.length;
    while (i--) {
      if (itemsToRemove.includes(array[i])) {
        //array[i] === itemToRemove ///itemsToRemove.includes(array[i])
        array.splice(i, 1);
      }
    }
  };

  //Providing the validations for custom selectedOptionArray field
  const setRangeValue = (e) => {
    console.log(rangeArray);
    console.log(allRangeArrayValues);
    let input = e.target.value;
    let regExp = new RegExp(/^[ 0-9, ]*$/);
    if (regExp.test(input)) {
      var stringInputs = e.target.value.split(",").map(Number);
      if (
        stringInputs &&
        stringInputs[0] != 0 &&
        stringInputs[0] != currentPage
      ) {
        jumpToPage(stringInputs[0] - 1);
      }
      for (var page of stringInputs) {
        if (page > Number(sessionStorage.getItem("TotalPages"))) {
          return;
        }
      }
      setRange(e.target.value);
      removeItems(stringInputs, [0, NaN]);
      setRangeArray([...new Set(stringInputs)]);
      setAllRangeArrayValues([...allRangeArrayValues, ...new Set(stringInputs)]);
    }
  };

  // resend otp counter for starting the timer
  const startResendOtpTimer = () => {
    let timerElement = document.getElementById("timer");
    let resendOtpBtn = document.getElementById("resendOtpbtn");

    if (timerElement && resendOtpBtn) {
      resendOtpBtn.style.display = "none";
      timerElement.style.display = "";

      let timeleftSec = timeleft;
      // Clear any existing timer event
      stopResendOtpTimer();
      timerEvent = setInterval(() => {
        if (timeleftSec < 0) {
          clearInterval(timerEvent);
          resendOtpBtn.style.display = "";
          timerElement.style.display = "none";
        } else {
          timerElement.innerHTML = "Resend OTP in " + timeleftSec + " Secs";
        }
        timeleftSec -= 1;
      }, 1000);
    }
  };

  // resend otp counter for ending the timer
  const stopResendOtpTimer = () => {
    if (timerEvent) {
      clearInterval(timerEvent);
      timerEvent = null; // Set timerEvent to null after clearing it
    }
  };

  const onCloseAddCommentsModal = () => {
    setOpenAddCommentsModal(false);
  };

  const onCloseSignersCommentsModal = () => {
    setOpensignersCommentsModal(false);
  };

  const onlyopenAddCommentsModal = () => {
    setOpenAddCommentsModal(true);
  };

  const signersComments = (e) => {
    var length = 0;
    if (commentsListDetails == null || commentsListDetails == "") {
      onlyopenAddCommentsModal();
    } else {
      var signerComment = signerComments;
      setOpensignersCommentsModal(true);
      if (isPrivate == 1) {
        var checkbox = document.getElementById("makeprivatecomment");
      }
    }
  };

  //On accepting the T&C this will get called
  const submit = () => {
    // console.log({finalClientDimensions});
    console.log({selectedOptionArray});
    //since signcoordinates are available in session
    let data1 = {};
    if (sessionStorage.getItem("txnrefNo") != null && sessionStorage.getItem("ud") == "true") {
      data1.signCoordinates = JSON.parse(sessionStorage.getItem("signCoordinates"));
    } else {
      data1 = props?.location?.state?.details;
      // console.log(data1);
    }
    console.log({ dragArray });

    let totalNumberOfPages = sessionStorage.getItem("TotalPages");
    let pageListArr = [];
    let customPositionedDragArray2 = [];
    let defaultPositionedDragArray2 = [];
    let customResizedDragArray2 = [];
    let defaultResizedDragArray2 = [];

    console.log({customPositionedDragIds});

    //-----Creating an Array of pageNo's which is customPositioned only when selected page is All page option
    for (let j = 0; j < customPositionedDragIds.length; j++) {
      for (let i = 0; i < dragArray.length; i++) {
        if (dragArray[i].dragId == customPositionedDragIds[j]) {
          pageListArr.push(dragArray[i].pageNo);
        }
      }
    }

    //-----Creating an Array of pageNo's which is customResized only when selected page is All page option
    for (let j = 0; j < customResizedDragIds.length; j++) {
      for (let i = 0; i < dragArray.length; i++) {
        if (dragArray[i].dragId == customResizedDragIds[j]) {
          pageListArr.push(dragArray[i].pageNo);
        }
      }
    }
    console.log({pageListArr});

    //------Creating an Array of PageNo's where the drag divs are NOT removed
    if (exclusionDragIds.length != 0) {
      for (let j = 0; j < exclusionDragIds.length; j++) {
        for (let i = 0; i < dragArray.length; i++) {
          if (dragArray[i].dragId != exclusionDragIds[j]) {
            pageListArr.push(dragArray[i].pageNo);
          }
        }
      }
      pageListArr = dragArray
        .filter((dragItem) => !exclusionDragIds.includes(dragItem.dragId))
        .map((dragItem) => dragItem.pageNo);
    }

    //------Creating an Array of pageNo's where selectedOptions are F/L/C
    for (let i = 0; i < dragArray.length; i++) {
      if (selectedOptionArray.includes("F")) {
        if (dragArray[i].pageNo == 1) {
          pageListArr.push(dragArray[i].pageNo);
        }
      }
      if (selectedOptionArray.includes("L")) {
        if (dragArray[i].pageNo == totalNumberOfPages) {
          pageListArr.push(dragArray[i].pageNo);
        }
      }
      if (selectedOptionArray.includes("C")) {
        for (let j = 0; j < currentPageNo.length; j++) {
          for (let i = 0; i < dragArray.length; i++) {
            if (dragArray[i].pageNo == currentPageNo[j]) {
              pageListArr.push(dragArray[i].pageNo);
            }
          }
        }
      }
    }

    console.log({allRangeArrayValues});

    //-------Creating an Array of PageNo's where selectedOptionArray is both A and P
    if (
      (selectedOptionArray.includes("A") &&
        selectedOptionArray.includes("P")) ||
      (frompath === "/download/tokenSignDownload" || frompath === "inbox" || (sessionStorage.getItem("txnrefNo") != null && sessionStorage.getItem("ud") == "true")) &&
        (data1.signCoordinates.signPage == "A" ||
          data1.signCoordinates.signPage == "P")
    ) {
      pageListArr = pageListArr.concat(allRangeArrayValues);
    }
    pageListArr = pageListArr.filter(function (item, pos, self) {
      //Removing the duplicates from the array
      return self.indexOf(item) == pos;
    });
    console.log({pageListArr});

    //-----Preparing the defaultPositionedDragArray2 based on the outcome of pageListArr for default positioned dragabble's
    defaultPositionedDragArray2 = dragArray.filter(
      (dragItem) => !pageListArr.includes(dragItem.pageNo)
    );
    const toRemove = new Set(defaultPositionedDragArray2);
    customPositionedDragArray2 = dragArray.filter((x) => !toRemove.has(x));

    //-----Preparing the defaultResizedDragArray2 based on the outcome of pageListArr for default resized dragabble's
    defaultResizedDragArray2 = dragArray.filter(
      (dragItem) => !pageListArr.includes(dragItem.pageNo)
    );
    const toRemove1 = new Set(defaultResizedDragArray2);
    customResizedDragArray2 = dragArray.filter((x) => !toRemove1.has(x));

    console.log({ defaultPositionedDragArray2 });
    console.log({ customPositionedDragArray2 });

    // ----------signCoordinates-----------
    let height = canvas_height;
    let width = canvas_width;
    let width_ratio;
    let height_ratio;
    let width_ratio_arr = [];
    let height_ratio_arr = [];
    // let clientWidth_arr = [460, 460, 460, 460, 460, 460, 460, 460, 460, 460, 460, 460, 460, 460];
    // let clientHeight_arr = [627, 627, 627, 627, 590, 627, 627, 590, 590, 590, 627, 627, 627, 627];
    let docuPageTestElement = document.getElementById(
      "docuPageTest" + currentPage
    );
    let data2 = props?.location?.state?.details;
    console.log(data2?.equalPageDimensions);
    console.log(equalPageDimensions);
    if (data2?.equalPageDimensions || equalPageDimensions) {
      for (let i = 0; i < finalClientDimensions.length; i++) {
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          width_ratio_arr.push(width / (finalClientDimensions[i].clientWidth - 20)); //22
          height_ratio_arr.push(height / (finalClientDimensions[i].clientHeight - 9)); //11.5
        } else {
          width_ratio_arr.push(width / (finalClientDimensions[i].clientWidth - 20)); //12, 8
          height_ratio_arr.push(height / (finalClientDimensions[i].clientHeight - 6)); //11.5,8
        }
      }
    } else {
      for (let i = 0; i < pageDimensions.length; i++) {
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          width_ratio_arr.push(pageDimensions[i].width / (finalClientDimensions[i].clientWidth - 20)); //22
          height_ratio_arr.push(pageDimensions[i].height / (finalClientDimensions[i].clientHeight - 9)); //11.5
        } else {
          width_ratio_arr.push(pageDimensions[i].width / (finalClientDimensions[i].clientWidth - 20)); //12, 8
          height_ratio_arr.push(pageDimensions[i].height / (finalClientDimensions[i].clientHeight - 6)); //11.5,8
        }
      }
    }
    console.log({width_ratio_arr});
    console.log({height_ratio_arr});

    let authToken = AuthToken;
    let actuall_x = [];
    let actuall_y = [];
    let actuall_width = [];
    let actuall_height = [];
    let actuall_x1 = [];
    let actuall_y1 = [];
    let actuall_width1 = [];
    let actuall_height1 = [];
    let customPositionedDragArray = [];
    let defaultPositionedDragArray = [];
    let defaultPositionedArr;
    let customPageListA = [];
    let docid = null;
    docid = docId;

    console.log({ exclusionDragIds });

    //specifing x, y values based on multi ppl external signer
    if (
      sessionStorage.getItem("txnrefNo") != null &&
      sessionStorage.getItem("ud") == "false"
    ) {
      for (let i = 0; i < dragArray.length; i++) {
        actuall_x.push(
          parseInt(Number(dragArray[i].left.slice(0, -2)) * width_ratio_arr[0])
        );
        actuall_y.push(
          parseInt(Number(dragArray[i].top.slice(0, -2)) * height_ratio_arr[0])
        );
      }
      if (selectedMode == "4") {
        docid = docId;
      }
    } else {
      if (data1?.hasOwnProperty("externalSigner") && data1?.externalSigner) {
        //If of External signer only
        if (data1.signCoordinates.signPage == "A") {
          //When signPage is A and no seal is removed
          if (data1.signCoordinates.signCoordinates.length == 1) {
            //When seals is of default positioned
            for (
              let k = 0;
              k < data1.signCoordinates.signCoordinates.length;
              k++
            ) {
              for (
                let j = 0;
                j <
                data1.signCoordinates.signCoordinates[k].signCoordinatesValues
                  .length;
                j++
              ) {
                if (
                  dragArray[j].left != "0px" &&
                  sessionStorage.getItem("TotalPages") != 1
                ) {
                  actuall_x.push(
                    parseInt(
                      Math.round(
                        Number(
                          data1.signCoordinates.signCoordinates[k]
                            .signCoordinatesValues[j].x
                        )
                      ),
                      10
                    )
                  );
                } else {
                  actuall_x.push(
                    parseInt(
                      Math.round(
                        Number(
                          data1.signCoordinates.signCoordinates[k]
                            .signCoordinatesValues[j].x
                        )
                      ),
                      10
                    )
                  );
                }
                actuall_y.push(
                  parseInt(
                    Math.round(
                      Number(
                        data1.signCoordinates.signCoordinates[k]
                          .signCoordinatesValues[j].y
                      )
                    ),
                    10
                  )
                );
                actuall_width.push(
                  data1.signCoordinates.signCoordinates[k]
                    .signCoordinatesValues[j].width
                );
                actuall_height.push(
                  data1.signCoordinates.signCoordinates[k]
                    .signCoordinatesValues[j].height
                );
              }
            }
          } else {
            //When seals is of custom positioned
            for (
              let i = 0;
              i < data1.signCoordinates.signCoordinates.length;
              i++
            ) {
              if (data1.signCoordinates.signCoordinates[i].page != "") {
                customPageListA.push(
                  data1.signCoordinates.signCoordinates[i].page
                );
              }
            }
            console.log({customPageListA});
            // customPageListA.shift();
            // console.log({customPageListA});

            for (let i = 0; i < customPageListA.length; i++) {
              for (let j = 0; j < dragArray.length; j++) {
                if (customPageListA[i] == dragArray[j].pageNo) {
                  customPositionedDragArray.push(dragArray[j]);
                }
              }
            }

            defaultPositionedArr = dragArray.filter(item => !customPositionedDragArray.some(customItem => customItem.pageNo === item.pageNo));            

            // for (let i = 0; i < customPageListA.length; i++) {
            //   for (let j = 0; j < dragArray.length; j++) {
            //     if (customPageListA[i] != dragArray[j].pageNo) {
            //       defaultPositionedDragArray.push(dragArray[j]);
            //     }
            //   }
            // }
            console.log({defaultPositionedArr});

            // defaultPositionedArr = defaultPositionedDragArray.filter(
            //   (defaultItem) =>
            //     defaultPositionedDragArray[0].pageNo == defaultItem.pageNo
            // );
            // console.log({defaultPositionedArr});
            console.log({customPositionedDragArray});

            for (let i = 0; i < defaultPositionedArr.length; i++) {
              // if (dragArray[i].left != "0px" && sessionStorage.getItem("TotalPages") != 1) {
              actuall_x.push(
                parseInt(
                  Math.round(
                    (Number(defaultPositionedArr[i].left.slice(0, -2)) + 5) *
                      width_ratio_arr[0]
                  ),
                  10
                )
              );

              actuall_y.push(
                parseInt(
                  Math.round(
                    Number(defaultPositionedArr[i].top.slice(0, -2)) *
                      height_ratio_arr[defaultPositionedArr[i].pageNo - 1]
                  ),
                  10
                )
              );

              actuall_width.push(
                parseInt(
                  Math.round(
                    Number(
                      defaultPositionedArr[i].resizeDragWidth.slice(0, -2)
                    ) * width_ratio_arr[0]
                  ),
                  10
                )
              );
              actuall_height.push(
                parseInt(
                  Math.round(
                    Number(
                      defaultPositionedArr[i].resizeDragHeight.slice(0, -2)
                    ) * height_ratio_arr[defaultPositionedArr[i].pageNo - 1]
                  ),
                  10
                )
              );
            }

            for (let i = 0; i < customPositionedDragArray.length; i++) {
              if (
                dragArray[i].left != "0px" &&
                sessionStorage.getItem("TotalPages") != 1
              ) {
                actuall_x1.push(
                  parseInt(
                    Math.round(
                      (Number(customPositionedDragArray[i].left.slice(0, -2)) +
                        5) *
                        width_ratio_arr[0]
                    ),
                    10
                  )
                );
              } else {
                actuall_x1.push(
                  parseInt(
                    Math.round(
                      Number(customPositionedDragArray[i].left.slice(0, -2)) *
                        width_ratio_arr[0]
                    ),
                    10
                  )
                );
              }
              actuall_y1.push(
                parseInt(
                  Math.round(
                    Number(customPositionedDragArray[i].top.slice(0, -2)) *
                      height_ratio_arr[customPositionedDragArray[i].pageNo - 1]
                  ),
                  10
                )
              );
              actuall_width1.push(
                parseInt(
                  Math.round(
                    Number(
                      customPositionedDragArray[i].resizeDragWidth.slice(0, -2)
                    ) * width_ratio_arr[0]
                  ),
                  10
                )
              );
              actuall_height1.push(
                parseInt(
                  Math.round(
                    Number(
                      customPositionedDragArray[i].resizeDragHeight.slice(0, -2)
                    ) * height_ratio_arr[customPositionedDragArray[i].pageNo - 1]
                  ),
                  10
                )
              );
            }
          }
        } else if (data1.signCoordinates.signPage == "P") {
          //When signPage is P or seals removed when selected A
          for (let i = 0; i < dragArray.length; i++) {
            if (
              dragArray[i].left != "0px" &&
              sessionStorage.getItem("TotalPages") != 1
            ) {
              actuall_x.push(
                parseInt(
                  Math.round(
                    (Number(dragArray[i].left.slice(0, -2)) + 5) * width_ratio_arr[0]
                  ),
                  10
                )
              );
            } else {
              actuall_x.push(
                parseInt(
                  Math.round(
                    Number(dragArray[i].left.slice(0, -2)) * width_ratio_arr[0]
                  ),
                  10
                )
              );
            }
            actuall_y.push(
              parseInt(
                Math.round(
                  Number(dragArray[i].top.slice(0, -2)) * height_ratio_arr[dragArray[i].pageNo - 1]
                ),
                10
              )
            );

            actuall_width.push(
              parseInt(
                Math.round(
                  Number(dragArray[i].resizeDragWidth.slice(0, -2)) *
                    width_ratio_arr[0]
                ),
                10
              )
            );
            actuall_height.push(
              parseInt(
                Math.round(
                  Number(dragArray[i].resizeDragHeight.slice(0, -2)) *
                    height_ratio_arr[dragArray[i].pageNo - 1]
                ),
                10
              )
            );
          }
        }
        docid = docId;
      } else {
        //IF of self signing only
        if (
          (selectedOptionArray.includes("A") && exclusionDragIds.length == 0) ||
          selectedOptionArray.includes("P")
        ) {
          //Calculating defaultPositioned Drag's x and y values and resized height and width values
          // console.log(defaultPositionedDragArray2);
          // console.log(customPositionedDragArray2);
          for (let i = 0; i < defaultPositionedDragArray2.length; i++) {
            if (
              defaultPositionedDragArray2[i].left != "0px" &&
              sessionStorage.getItem("TotalPages") != 1
            ) {
              actuall_x.push(
                parseInt(
                  Math.round(
                    (Number(defaultPositionedDragArray2[i].left.slice(0, -2)) +
                      5) *
                      width_ratio_arr[0]
                  ),
                  10
                )
              );
            } else {
              actuall_x.push(
                parseInt(
                  Math.round(
                    Number(defaultPositionedDragArray2[i].left.slice(0, -2)) *
                    width_ratio_arr[0]
                  ),
                  10
                )
              );
            }
            actuall_y.push(
              parseInt(
                Math.round(
                  Number(defaultPositionedDragArray2[i].top.slice(0, -2)) *
                  height_ratio_arr[defaultPositionedDragArray2[i].pageNo - 1]
                ),
                10
              )
            );
          }

          for (let i = 0; i < defaultResizedDragArray2.length; i++) {
            actuall_width.push(
              parseInt(
                Math.round(
                  Number(
                    defaultResizedDragArray2[i].resizeDragWidth.slice(0, -2)
                  ) * width_ratio_arr[0]
                ),
                10
              )
            );
            actuall_height.push(
              parseInt(
                Math.round(
                  Number(
                    defaultResizedDragArray2[i].resizeDragHeight.slice(0, -2)
                  ) * height_ratio_arr[defaultResizedDragArray2[i].pageNo - 1]

                ),
                10
              )
            );
          }

          //Calculating customPositoned Drag's x and y values and resized height and width values
          for (let i = 0; i < customPositionedDragArray2.length; i++) {
            if (
              customPositionedDragArray2[i].left != "0px" &&
              sessionStorage.getItem("TotalPages") != 1
            ) {
              actuall_x1.push(
                parseInt(
                  Math.round(
                    (Number(customPositionedDragArray2[i].left.slice(0, -2)) +
                      5) *
                      width_ratio_arr[0]
                  ),
                  10
                )
              );
            } else {
              actuall_x1.push(
                parseInt(
                  Math.round(
                    Number(customPositionedDragArray2[i].left.slice(0, -2)) *
                    width_ratio_arr[0]
                  ),
                  10
                )
              );
            }
            actuall_y1.push(
              parseInt(
                Math.round(
                  Number(customPositionedDragArray2[i].top.slice(0, -2)) *
                  height_ratio_arr[customPositionedDragArray2[i].pageNo - 1]
                ),
                10
              )
            );
          }
          for (let i = 0; i < customResizedDragArray2.length; i++) {
            actuall_width1.push(
              parseInt(
                Math.round(
                  Number(
                    customResizedDragArray2[i].resizeDragWidth.slice(0, -2)
                  ) * width_ratio_arr[0]
                ),
                10
              )
            );
            actuall_height1.push(
              parseInt(
                Math.round(
                  Number(
                    customResizedDragArray2[i].resizeDragHeight.slice(0, -2)
                  ) * height_ratio_arr[customResizedDragArray2[i].pageNo - 1]
                ),
                10
              )
            );
          }
        } else if (
          selectedOptionArray.includes("A") &&
          exclusionDragIds.length != 0
        ) {
          for (let i = 0; i < dragArray.length; i++) {
            if (
              dragArray[i].left != "0px" &&
              sessionStorage.getItem("TotalPages") != 1
            ) {
              actuall_x.push(
                parseInt(
                  Math.round(
                    (Number(dragArray[i].left.slice(0, -2)) + 5) * width_ratio_arr[0]
                  ),
                  10
                )
              );
            } else {
              actuall_x.push(
                parseInt(
                  Math.round(
                    Number(dragArray[i].left.slice(0, -2)) * width_ratio_arr[0]
                    ),
                  10
                )
              );
            }
            actuall_y.push(
              parseInt(
                Math.round(
                  Number(dragArray[i].top.slice(0, -2)) * height_ratio_arr[dragArray[i].pageNo - 1]
                ),
                10
              )
            );
            actuall_width.push(
              parseInt(
                Math.round(
                  Number(dragArray[i].resizeDragWidth.slice(0, -2)) *
                  width_ratio_arr[0]
                ),
                10
              )
            );
            actuall_height.push(
              parseInt(
                Math.round(
                  Number(dragArray[i].resizeDragHeight.slice(0, -2)) *
                  height_ratio_arr[dragArray[i].pageNo - 1]
                ),
                10
              )
            );
          }
        } else if (
          (selectedOptionArray.includes("F") ||
          selectedOptionArray.includes("L") ||
          selectedOptionArray.includes("C")) &&
          !selectedOptionArray.includes("A")
        ) {
          for (let i = 0; i < dragArray.length; i++) {
            if (
              dragArray[i].left != "0px" &&
              sessionStorage.getItem("TotalPages") != 1
            ) {
              actuall_x.push(
                parseInt(
                  Math.round(
                    (Number(dragArray[i].left.slice(0, -2)) + 5) * width_ratio_arr[0]
                  ),
                  10
                )
              );
            } else {
              actuall_x.push(
                parseInt(
                  Math.round(
                    Number(dragArray[i].left.slice(0, -2)) * width_ratio_arr[0]
                  ),
                  10
                )
              );
            }
            actuall_y.push(
              parseInt(
                Math.round(
                  Number(dragArray[i].top.slice(0, -2)) * height_ratio_arr[dragArray[i].pageNo - 1]
                ),
                10
              )
            );

            actuall_width.push(
              parseInt(
                Math.round(
                  Number(dragArray[i].resizeDragWidth.slice(0, -2)) *
                    width_ratio_arr[0]
                ),
                10
              )
            );
            actuall_height.push(
              parseInt(
                Math.round(
                  Number(dragArray[i].resizeDragHeight.slice(0, -2)) *
                    height_ratio_arr[dragArray[i].pageNo - 1]
                ),
                10
              )
            );
          }
        }

        if (selectedMode === "4") {
          docid = docId;
        }
      }
    }

    if (window.FileReader) {
      let response_data = {};
      let data = new FormData();

      var handSignImg = "";
      var externalJar = "false";
      if (
        selectedMode === "2" ||
        selectedMode === "4" ||
        selectedMode === "3" ||
        selectedMode === "1" ||
        data1.signMode === "2" ||
        data1.signMode === "3" ||
        data1.signMode === "4" ||
        data1.signMode === "1"
      ) {
        handSignImg = sessionStorage.getItem("handSignImg");
      }

      if (selectedMode === "1" || data1.signMode === "1") {
        externalJar = "true";
      }

      setLoaded(false);
      // let recwidth;
      // let recheight;

      // if (selectedMode == "4" || data1.signMode === "4") {
      //   if (
      //     parseInt(overlay_width * width_ratio, 10) === 133 ||
      //     parseInt(overlay_width * width_ratio, 10) < 160
      //   ) {
      //     recwidth = 160;
      //   } else {
      //     recwidth = parseInt(overlay_width * width_ratio, 10);
      //   }

      //   if (
      //     parseInt(overlay_height * height_ratio, 10) === 54 ||
      //     parseInt(overlay_height * height_ratio, 10) < 113
      //   ) {
      //     recheight = 113;
      //   } else {
      //     recheight = parseInt(overlay_height * height_ratio, 10);
      //   }
      // } else {
      //   recwidth = parseInt(overlay_width * width_ratio, 10);
      //   recheight = parseInt(overlay_height * height_ratio, 10);
      // }

      let signPg = "";
      let pgList = [];
      let tempSignCoordinateArray1 = [];
      let tempSignCoordinateArray2 = [];
      let signCoordinatesArray = [];
      let pageListArray = [];
      let pageListArray1 = [];
      let commonSignCoordinate;

      if (data1.hasOwnProperty("externalSigner") && data1.externalSigner) {
        signPg = data1.signCoordinates.signPage;
        pgList = data1.signCoordinates.pageList;
        let totalHeight =
          data1.signCoordinates.signCoordinates[0].signCoordinatesValues[0]
            .totHeight;
        let totalWidth =
          data1.signCoordinates.signCoordinates[0].signCoordinatesValues[0]
            .totWidth;
        pageListArray = data1.signCoordinates.pageList;

        commonSignCoordinate = {
          totHeight: "" + totalHeight,
          totWidth: "" + totalWidth,
          signature: "1",
        };

        if (data1.signCoordinates.signPage == "A") {
          if (data1.signCoordinates.signCoordinates.length == 1) {
            for (
              let j = 0;
              j <
              data1.signCoordinates.signCoordinates[0].signCoordinatesValues
                .length;
              j++
            ) {
              for (let i = 0; i < dragArray.length; i++) {
                tempSignCoordinateArray2.push({
                  ...commonSignCoordinate,
                  x: "" + actuall_x[j],
                  y: "" + actuall_y[j],
                  width: "" + actuall_width[j],
                  height: "" + actuall_height[j],
                });
                break;
              }
            }
            signCoordinatesArray.push({
              page: "",
              signCoordinatesValues: tempSignCoordinateArray2,
            });
          } else {
            for (let i = 0; i < defaultPositionedArr.length; i++) {
              tempSignCoordinateArray2.push({
                ...commonSignCoordinate,
                x: "" + actuall_x[i],
                y: "" + actuall_y[i],
                width: "" + actuall_width[i],
                height: "" + actuall_height[i],
              });
              // break;
            }
            signCoordinatesArray.push({
              page: "",
              signCoordinatesValues: tempSignCoordinateArray2,
            });
            for (let i = 0; i < customPageListA.length; i++) {
              for (let j = 0; j < customPositionedDragArray.length; j++) {
                if (customPageListA[i] == customPositionedDragArray[j].pageNo) {
                  tempSignCoordinateArray1.push({
                    ...commonSignCoordinate,
                    x: "" + actuall_x1[j],
                    y: "" + actuall_y1[j],
                    width: "" + actuall_width1[j],
                    height: "" + actuall_height1[j],
                  });
                }
              }
              signCoordinatesArray.push({
                page: "" + customPageListA[i],
                signCoordinatesValues: tempSignCoordinateArray1,
              });
              tempSignCoordinateArray1 = [];
            }
          }
        } else if (data1.signCoordinates.signPage == "P") {
          for (let i = 0; i < pageListArray.length; i++) {
            for (let j = 0; j < dragArray.length; j++) {
              if (pageListArray[i] == dragArray[j].pageNo) {
                tempSignCoordinateArray2.push({
                  ...commonSignCoordinate,
                  x: "" + actuall_x[j],
                  y: "" + actuall_y[j],
                  width: "" + actuall_width[j],
                  height: "" + actuall_height[j],
                });
              }
            }
            tempSignCoordinateArray1.push(tempSignCoordinateArray2);
            tempSignCoordinateArray2 = [];
          }

          pageListArray1 = pageListArray.map(String);
          for (let i = 0; i < pageListArray1.length; i++) {
            signCoordinatesArray.push({
              page: pageListArray1[i],
              signCoordinatesValues: tempSignCoordinateArray1[i],
            });
          }
        }
      } else {
        commonSignCoordinate = {
          totHeight: "" + height,
          totWidth: "" + width,
          signature: "1",
        };

        // creating pageListArray whichever pages seals are present
        dragArray.forEach(function (dragArr) {
          pageListArray.push(dragArr.pageNo);
        });
        pageListArray = [...new Set(pageListArray)]; //removing duplicates from array

        if (selectedOptionArray.includes("A")) {
          // console.log({defaultPositionedDragArray2});
          // console.log({customPositionedDragArray2});
          if (exclusionDragIds.length == 0) {
            signPg = "" + "A";
            for (let j = 0; j < allPageBatch - 1; j++) {
              for (let i = 0; i < defaultPositionedDragArray2.length; i++) {
                if (
                  defaultPositionedDragArray2[i].selectedABatch ==
                  "A" + (j + 1)
                ) {
                  tempSignCoordinateArray2.push({
                    ...commonSignCoordinate,
                    x: "" + actuall_x[i],
                    y: "" + actuall_y[i],
                    width: "" + actuall_width[i],
                    height: "" + actuall_height[i],
                    selectedBatch:
                      defaultPositionedDragArray2[i].selectedABatch,
                  });
                  break;
                }
              }
            }
            // console.log(tempSignCoordinateArray2);
            signCoordinatesArray.push({
              page: "",
              signCoordinatesValues: tempSignCoordinateArray2,
            });

            for (let i = 0; i < pageListArr.length; i++) {
              for (let j = 0; j < customPositionedDragArray2.length; j++) {
                if (pageListArr[i] == customPositionedDragArray2[j].pageNo) {
                  if (
                    customPositionedDragArray2[j].selectedABatch?.charAt(0) ===
                    "A"
                  ) {
                    tempSignCoordinateArray1.push({
                      ...commonSignCoordinate,
                      x: "" + actuall_x1[j],
                      y: "" + actuall_y1[j],
                      width: "" + actuall_width1[j],
                      height: "" + actuall_height1[j],
                      selectedBatch:
                        customPositionedDragArray2[j].selectedABatch,
                    });
                  } else
                    tempSignCoordinateArray1.push({
                      ...commonSignCoordinate,
                      x: "" + actuall_x1[j],
                      y: "" + actuall_y1[j],
                      width: "" + actuall_width1[j],
                      height: "" + actuall_height1[j],
                      selectedBatch:
                        customPositionedDragArray2[j].selectedPBatch,
                    });
                }
              }
              // console.log(tempSignCoordinateArray1);
              signCoordinatesArray.push({
                page: "" + pageListArr[i],
                signCoordinatesValues: tempSignCoordinateArray1,
              });
              tempSignCoordinateArray1 = [];
            }
          } else if (exclusionDragIds.length != 0) {
            signPg = "" + "P";
            pgList = pageListArray.map(Number);
            for (let i = 0; i < pageListArray.length; i++) {
              for (let j = 0; j < dragArray.length; j++) {
                if (pageListArray[i] == dragArray[j].pageNo) {
                  if (dragArray[j].selectedABatch?.charAt(0) === "A") {
                    tempSignCoordinateArray2.push({
                      ...commonSignCoordinate,
                      x: "" + (actuall_x.length == 0 ? actuall_x1[j] : actuall_x[j]),
                      y: "" + (actuall_y.length == 0 ? actuall_y1[j] : actuall_y[j]),
                      width: "" + (actuall_width.length == 0 ? actuall_width1[j] : actuall_width[j]),
                      height: "" + (actuall_height.length == 0 ? actuall_height1[j] : actuall_height[j]),
                      selectedBatch: dragArray[j].selectedABatch,
                    });
                  } else {
                    tempSignCoordinateArray2.push({
                      ...commonSignCoordinate,
                      x: "" + (actuall_x.length == 0 ? actuall_x1[j] : actuall_x[j]),
                      y: "" + (actuall_y.length == 0 ? actuall_y1[j] : actuall_y[j]),
                      width: "" + (actuall_width.length == 0 ? actuall_width1[j] : actuall_width[j]),
                      height: "" + (actuall_height.length == 0 ? actuall_height1[j] : actuall_height[j]),
                      selectedBatch: dragArray[j].selectedPBatch,
                    });
                  }
                }
              }
              // console.log(tempSignCoordinateArray2);
              tempSignCoordinateArray1.push(tempSignCoordinateArray2);
              tempSignCoordinateArray2 = [];
            }
            // pageListArray1 = pageListArray.map(String);
            pageListArray1 = pageListArray.map(String);
            for (let i = 0; i < pageListArray1.length; i++) {
              signCoordinatesArray.push({
                page: pageListArray1[i],
                signCoordinatesValues: tempSignCoordinateArray1[i],
              });
            }
          }
        } else if (
          selectedOptionArray.includes("P") ||
          selectedOptionArray.includes("F") ||
          selectedOptionArray.includes("L") ||
          (selectedOptionArray.includes("C") &&
            !selectedOptionArray.includes("A"))
        ) {
          signPg = "" + "P";
          pgList = pageListArray.map(Number); //CustomPageListArray sending to server

          if (selectedOptionArray.includes("P")) {
            if (defaultPositionedDragArray2.length != 0) {
              for (let j = 0; j < customPageBatch - 1; j++) {
                for (let i = 0; i < defaultPositionedDragArray2.length; i++) {
                  if (
                    defaultPositionedDragArray2[i].selectedPBatch ==
                    "P" + (j + 1)
                  ) {
                    tempSignCoordinateArray2.push({
                      ...commonSignCoordinate,
                      x: "" + actuall_x[i],
                      y: "" + actuall_y[i],
                      width: "" + actuall_width[i],
                      height: "" + actuall_height[i],
                      selectedBatch:
                        defaultPositionedDragArray2[i].selectedPBatch,
                    });
                    break;
                  }
                }
              }
              // console.log({ tempSignCoordinateArray2 });
              signCoordinatesArray.push({
                page: "",
                signCoordinatesValues: tempSignCoordinateArray2,
              });
            }
            if (customPositionedDragArray2.length != 0) {
              for (let i = 0; i < pageListArr.length; i++) {
                for (let j = 0; j < customPositionedDragArray2.length; j++) {
                  if (pageListArr[i] == customPositionedDragArray2[j].pageNo) {
                    if (
                      customPositionedDragArray2[j].selectedPBatch?.charAt(
                        0
                      ) === "P"
                    ) {
                      tempSignCoordinateArray1.push({
                        ...commonSignCoordinate,
                        x: "" + actuall_x1[j],
                        y: "" + actuall_y1[j],
                        width: "" + actuall_width1[j],
                        height: "" + actuall_height1[j],
                        selectedBatch:
                          customPositionedDragArray2[j].selectedPBatch,
                      });
                    } else
                      tempSignCoordinateArray1.push({
                        ...commonSignCoordinate,
                        x: "" + actuall_x1[j],
                        y: "" + actuall_y1[j],
                        width: "" + actuall_width1[j],
                        height: "" + actuall_height1[j],
                        selectedBatch:
                          customPositionedDragArray2[j].selectedPBatch,
                      });
                  }
                }
                signCoordinatesArray.push({
                  page: "" + pageListArr[i],
                  signCoordinatesValues: tempSignCoordinateArray1,
                });
                tempSignCoordinateArray1 = [];
              }
            }
            // console.log({ signCoordinatesArray });
          } else {
            for (let i = 0; i < pageListArray.length; i++) {
              for (let j = 0; j < dragArray.length; j++) {
                if (pageListArray[i] == dragArray[j].pageNo) {
                  tempSignCoordinateArray2.push({
                    ...commonSignCoordinate,
                    x: "" + actuall_x[j],
                    y: "" + actuall_y[j],
                    width: "" + actuall_width[j],
                    height: "" + actuall_height[j],
                    selectedBatch: dragArray[j].selectedPBatch,
                  });
                }
              }
              // console.log(tempSignCoordinateArray2);
              tempSignCoordinateArray1.push(tempSignCoordinateArray2);
              tempSignCoordinateArray2 = [];
            }

            pageListArray1 = pageListArray.map(String);
            // console.log({ pageListArray1 });
            for (let i = 0; i < pageListArray1.length; i++) {
              signCoordinatesArray.push({
                page: pageListArray1[i],
                signCoordinatesValues: tempSignCoordinateArray1[i],
              });
            }
          }
        }
      }

      let obj = {
        //****starts here
        //added the keys for template based generated PDF.
        tempCode: tempCode,
        groupCode: groupCode,
        subGroup: subGroup,
        isPrivate: isPrivate,
        signerComments: signerComments,
        authToken: authToken,
        docType: "PDF",
        docId: docid,
        sc: "Y",
        signersInfo: {
          signPage: signPg,
          pages: pgList,
          signMode: selectedMode,
          sealInfo: [
            {
              id: "1",
              handSignImg: handSignImg,
              displayMsg: "",
            },
          ],
          signCoordinates: signCoordinatesArray,
        },
        mobilenumotp: mobileotpvalue,
        emailnumotp: emailotpvalue,
        userIP: sessionStorage.getItem("userIP"),
        externalJar: externalJar,
        draftRefNumber: draftRefNumber,
        fromTemplatePage: fromTemplatePage,
        // imgpath: "",
        signUser: "",
        estampdtls: {},
        documentdtls: {
          docdata: "",
        },
      };
      console.log({ obj });

      if (data?.hasOwnProperty("externalSigner") && data?.externalSigner) {
        // if (data.signMode == "4") {
        //   if (
        //     parseInt(overlay_width * width_ratio, 10) === 133 ||
        //     parseInt(overlay_width * width_ratio, 10) < 160
        //   ) {
        //     recwidth = 160;
        //   } else {
        //     recwidth = parseInt(overlay_width * width_ratio, 10);
        //   }

        //   if (
        //     parseInt(overlay_height * height_ratio, 10) === 54 ||
        //     parseInt(overlay_height * height_ratio, 10) < 113
        //   ) {
        //     recheight = 113;
        //   } else {
        //     recheight = parseInt(overlay_height * height_ratio, 10);
        //   }
        // } else {
        //   recwidth = parseInt(overlay_width * width_ratio, 10);
        //   recheight = parseInt(overlay_height * height_ratio, 10);
        // }
        data.append("file", null);
      } else {
        // console.log(file);
        data.append("file", file);
        // data.append("file", null);
      }
      data.append("inputDetails", JSON.stringify(obj));
      // setLoaded(true);
      fetch(URL.getSignedDocV2, {
        method: "POST",
        headers: {
          enctype: "multipart/form-data",
        },
        body: data,
      })
        .then((response) => {
          setLoaded(true);
          if (response.status === 400) {
            props.history.push("/esign_error");
          } else if (response.status === 200) {
            return response.json();
          } else {
            props.history.push("/");
          }
        })
        .then((responseJson) => {
          response_data = responseJson;
          setResponsedata(responseJson);
          if (responseJson.status === "SUCCESS") {
            setSignerComments("");
            sessionStorage.setItem(
              "download_data",
              JSON.stringify(response_data)
            );
            if (selectedMode === "1") {
              props.history.push({
                pathname: "/esign",
                frompath: "/preview",
              });
            } else if (selectedMode === "2") {
              let data = {
                mode: selectedMode,
                docId: responseJson.docid,
                txnrefNo: responseJson.token,
                filename: responseJson.filename,
                actualFileName: responseJson.actualFileName,
                canvas_height: canvas_height,
                canvas_width: canvas_width,
              };
              props.history.push({
                pathname: "/download/tokenSignDownload",
                frompath: "/preview",
                state: {
                  details: data,
                },
              });
            } else if (selectedMode === "3") {
              setLoaded(false);
              if (responseJson.externalSigner) {
                if (responseJson.hasOwnProperty("loginMode")) {
                  var loginmode;
                  if (responseJson.loginMode === "INBOX") {
                    loginmode = 0;
                  } else if (responseJson.loginMode === "MOBILE") {
                    loginmode = 1;
                  } else if (responseJson.loginMode === "EMAIL") {
                    loginmode = 2;
                  }
                  setLoginMode(loginmode);
                }
              }
              // calltoclientforTokenCheck();
            } else if (selectedMode === "4") {
              setLoaded(true);
              document.getElementById("resendOtpbtn").style.display = "none";
              document.getElementById("timer").style.display = "none";
              startResendOtpTimer.timeleft = 0;
              document.getElementById("timer").innerHTML =
                "Resend OTP in " + 30 + " Secs";

              clearInterval(timerEvent);
              onCloseFirstModal();
              let data = {
                mode: selectedMode,
                docId: responseJson.docid,
                txnrefNo: responseJson.token,
                filename: responseJson.filename,
                actualFileName: responseJson.actualFileName,
                canvas_height: canvas_height,
                canvas_width: canvas_width,
              };
              props.history.push({
                pathname: "/download/tokenSignDownload",
                frompath: "/preview",
                state: {
                  details: data,
                },
              });
            }
          } else {
            if (responseJson.statusDetails.includes("OTP Validation Failed")) {
              alert(responseJson.statusDetails);
              onCloseFirstModal();
            } else if (responseJson.statusDetails.includes("Technical issue")) {
              onCloseFirstModal();
              onCloseOTPModal();
              confirmAlert({
                message: responseJson.statusDetails,
                buttons: [
                  {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                      setLoaded(true);
                    },
                  },
                ],
              });
            } else {
              onCloseFirstModal();
              onCloseOTPModal();
              confirmAlert({
                message: responseJson.statusDetails, //
                buttons: [
                  {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                      setLoaded(true);
                    },
                  },
                ],
              });
            }
          }
        })
        .catch((e) => {
          alert(e);
        });
    } else {
      confirmAlert({
        message: "Sorry, your browser does'nt support for preview",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
    }
    sessionStorage.setItem("ud", false);
    sessionStorage.removeItem("txnrefNo");
    sessionStorage.removeItem("signedStatus");
    sessionStorage.removeItem("fileName");
  };

  //Calling the Client Program and cheking whether the token is present
  const calltoclientforTokenCheck = () => {
    // console.log("CallToClientForTokenCheck");
    // console.log(responsedata);
    setDocrefNo(responsedata.docrefNo);
    let port = responsedata.port;
    let url = "http://127.0.0.1:" + port + "/TOKENSIGN/checkTokenExistence";
    let data = {
      alias: responsedata.alias,
      configPath: responsedata.configPath,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        setLoaded(false);

        if (response.status === 400) {
          props.history.push("/esign_error");
        } else if (response.status === 200) {
          return response.json();
        } else {
          props.history.push("/");
        }
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          setLoaded(false);
          // alert(responseJson.statusDetails)
          //this.setState({responsedata:responseJson})
          calltoclient();
        } else {
          if (sessionStorage.getItem("externalSigner") == "true") {
            unlockdocument();
          }
          setOpenFirstModal(false);
          confirmAlert({
            message: responseJson.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  setLoaded(true);
                  setOpenFirstModal(false);
                },
              },
            ],
          });
          // alert(responseJson.statusDetails)
        }
      })
      .catch((e) => {
        if (sessionStorage.getItem("externalSigner") == "true") {
          unlockdocument();
        }
        alert(
          "Signing Failed. Please Run Docuexec DSC Client and Retry Signing!"
        );
        // this.props.history.push('/accountInfo')
        setLoaded(true);
        setOpenFirstModal(false);
      });
  };

  //If the Token is present the DSC Token signing will take Place and gives the signedHash as response
  const calltoclient = () => {
    // console.log(responsedata);
    setTxnID(responsedata.txnid);
    let port = responsedata.port;
    // let port=8082
    let url = "http://127.0.0.1:" + port + "/TOKENSIGN/getDSCTokenSign";
    let data = {
      alias: responsedata.alias,
      company: responsedata.company,
      configPath: responsedata.configPath,
      corpUser: responsedata.corpUser,
      docHash: responsedata.docHash,
      group: responsedata.group,
      mid: responsedata.mid,
      name: responsedata.name,
      signMode: responsedata.signMode,
      signPage: responsedata.signMode,
      txnid: responsedata.txnid,
      type: responsedata.type,
      userIP: responsedata.userIP,
      username: responsedata.username,
    };
    // console.log(data);
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        setLoaded(false);
        if (response.status === 400) {
          props.history.push("/esign_error");
        } else if (response.status === 200) {
          return response.json();
        } else {
          props.history.push("/");
        }
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          // console.log(responseJson);
          setLoaded(false);
          setClientCallRespData(responseJson);
          // clientResponse();
        }
      })
      .catch((e) => {
        alert(e);
        setLoaded(true);
      });
  };

  //If OTP signing the input OTPs provided validations are done here
  const setInput = (e) => {
    let regNum = new RegExp(/^[0-9]*$/);

    let value1 = e.target.value;
    let name = e.target.name;
    if (name === "mobileotp") {
      if (regNum.test(e.target.value)) {
        setMobileotpvalue(value1);
      } else {
        return false;
      }
    }
    if (name === "emailotp") {
      if (regNum.test(e.target.value)) {
        setEmailotpvalue(value1);
      } else {
        return false;
      }
    }
  };

  //client program sending signesHash to Jsign
  const clientResponse = () => {
    // var jsmpsData = details;
    var jsmpsData = props?.location?.state?.details;
    if (
      jsmpsData.hasOwnProperty("externalSigner") &&
      jsmpsData.externalSigner
    ) {
      sessionStorage.setItem("externalSigner", true);
    }
    let obj = {
      signedHash: clientCallRespData.signedHash,
      // "signedHash":clientCallRespData.pdfdata,
      statusDetails: clientCallRespData.statusDetails,
      status: clientCallRespData.status,
      signerName: clientCallRespData.signerName,
      txnid: TxnID,
      authToken: clientCallRespData.authToken,
      externalSigner: sessionStorage.getItem("externalSigner"),
      loginMode: loginMode,
    };
    fetch(URL.selfTokenSign, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => {
        setLoaded(false);
        if (response.status === 400) {
          props.history.push("/esign_error");
        } else if (response.status === 200) {
          return response.json();
        } else {
          props.history.push("/");
        }
      })
      .then((responseJson) => {
        sessionStorage.setItem("download_data", JSON.stringify(responseJson));
        if (responseJson.status === "SUCCESS") {
          setLoaded(true);
          let data = {
            mode: selectedMode,
            docId: responseJson.docid,
            txnrefNo: responseJson.token,
            filename: responseJson.filename,
            actualFileName: responseJson.actualFileName,
            canvas_height: canvas_height,
            canvas_width: canvas_width,
          };
          props.history.push({
            pathname: "/download/tokenSignDownload",
            frompath: "/preview",
            state: {
              details: data,
            },
          });
        } else {
          setOpenFirstModal(false);
          //alert(responseJson.statusDetails)
          setLoaded(true);
          confirmAlert({
            message: responseJson.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  //   this.props.history.push('/accountInfo')
                },
              },
            ],
          });
        }
        // this.props.history.push('/')
      })
      .catch((e) => {
        setOpenFirstModal(false);
        setLoaded(true);
        alert(e);

        // this.props.history.push('/')
      });
  };

  //For removing all the seals which are added
  const removeAllPageSeals = (e) => {
    if (dragArray.length !== 0) {
      let msg;
      if (dragArray.length == 1) {
        msg =
          "Do you want to remove " + dragArray.length + " seal permanently?";
      } else {
        msg =
          "Do you want to remove " + dragArray.length + " seals permanently?";
      }

      confirmAlert({
        title: "Confirm remove",
        message: msg,
        buttons: [
          {
            label: "Confirm",
            className: "confirmBtn",
            onClick: () => {
              if (dragArray.length > 0) {
                setSelectedOptionArray([]);
                setAllRangeArrayValues([]);
                setCustomPositionedDragIds([]);
                setCustomResizedDragIds([]);
                $(".drag").remove();
                toast.error(
                  dragArray.length > 1
                    ? "Removed all seals permanently"
                    : "Removed a seal permanently"
                );
                setDragArray([]);
                setSelectedOption(null);
              }
            },
          },
          {
            label: "Cancel",
            className: "cancelBtn",
            onClick: () => {},
          },
        ],
      });
    } else {
      confirmAlert({
        message: "There are no seals added to remove.",
        buttons: [
          {
            fontSize: "14px",
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
    }
  };

  //For handling of the radio option selection
  const handleOptionChange = (e) => {
    setTooltipOpen(false);
    setSubmitted(false);
    //Calling the getRequiredUnits function only when selectedMode is Aadhar
    if (selectedMode === "1") {
      getRequiredUnits(e.target.value, selectedMode);
    }
    if (document.getElementById("customPage").checked === false) {
      document.getElementById("range-fieldIdAdd").className = "range-field";
    }
    setSelectedOption(e.target.value);
  };

  // On click of Add seals this function will be called
  const signaturePageSelected = (e) => {
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      setTooltipOpen(true);
    }
    setSubmitted(true);
    const totalNumberOfPages = sessionStorage.getItem("TotalPages");

    let firstPage = document.getElementById("firstPage");
    let lastPage = document.getElementById("lastPage");
    let allPage = document.getElementById("allPage");
    let customPage = document.getElementById("customPage");

    const randomColor = `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
      Math.random() * 255
    )},${Math.floor(Math.random() * 255)},${0.5})`;

    let defaultDragWidthValue = /iPhone|iPad|iPod|Android/i.test(
      navigator.userAgent
    )
      ? defaultDragWidthMob
      : defaultDragWidth;
    let defaultDragHeightValue = /iPhone|iPad|iPod|Android/i.test(
      navigator.userAgent
    )
      ? defaultDragHeightMob
      : defaultDragHeight;

    //When selected page is A
    if (allPage.checked === true) {
      setSelectedOptionArray([...selectedOptionArray, "A"]);
      var allPageArray = [];
      for (let i = 0; i < totalNumberOfPages; i++) {
        var dragId;
        dragId = "draggable" + (count + i);
        //Preparing the draggable div object-------
        const item = {
          dragId: dragId,
          count: count + i,
          pageNo: i + 1,
          left: defaultLeft,
          top: defaultTop,
          resizeDragWidth: defaultDragWidthValue,
          resizeDragHeight: defaultDragHeightValue,
          selectedABatch: "A" + allPageBatch,
          color: randomColor,
        };
        allPageArray.push(item);
      }
      setDragArray([...dragArray, ...allPageArray]);
      setCount(count + Number(totalNumberOfPages));
      setAllPageBatch(allPageBatch + 1);
      allPage.checked = false;
      toast.info("Seals added to all pages");
    } else if (firstPage.checked === true) {
      //When selected page is F
      setSelectedOptionArray([...selectedOptionArray, "F"]);
      if (currentPage !== 1 && !shown) {
        jumpToPage(0);
      }
      var dragId;
      setCount(count + 1);
      dragId = "draggable" + count;

      const item = {
        dragId: dragId,
        count: count,
        pageNo: 1,
        left: defaultLeft,
        top: defaultTop,
        resizeDragWidth: defaultDragWidthValue,
        resizeDragHeight: defaultDragHeightValue,
        selectedPBatch: "F",
        color: randomColor,
      };
      setDragArray([...dragArray, item]);
      firstPage.checked = false;
      toast.info("Seal added to first page");
    } else if (lastPage.checked === true) {
      //When selected page is L
      setSelectedOptionArray([...selectedOptionArray, "L"]);
      if (!shown) {
        jumpToPage(totalNumberOfPages - 1);
      }

      var dragId;
      setCount(count + 1);
      dragId = "draggable" + count;

      const item = {
        dragId: dragId,
        count: count,
        pageNo: Number(sessionStorage.getItem("TotalPages")),
        left: defaultLeft,
        top: defaultTop,
        resizeDragWidth: defaultDragWidthValue,
        resizeDragHeight: defaultDragHeightValue,
        selectedPBatch: "L",
        color: randomColor,
      };
      setDragArray([...dragArray, item]);
      lastPage.checked = false;
      toast.info("Seal added to last page");
    } else if (customPage.checked === true) {
      //When selected page is P
      if (document.getElementById("range-fieldIdAdd").value != "") {
        if (rangeArray.length != 0) {
          //
          setSelectedOptionArray([...selectedOptionArray, "P"]); //
          if (customPagesValid) {
            var customPageArray = [];
            for (let i = 0; i < rangeArray.length; i++) {
              var dragId;
              dragId = "draggable" + (count + i);
              const item = {
                dragId: dragId,
                count: count + i,
                pageNo: rangeArray[i],
                left: defaultLeft,
                top: defaultTop,
                resizeDragWidth: defaultDragWidthValue,
                resizeDragHeight: defaultDragHeightValue,
                selectedPBatch: "P" + customPageBatch,
                color: randomColor,
              };
              customPageArray.push(item);
            }
            setDragArray([...dragArray, ...customPageArray]);
            setCount(count + rangeArray.length);
            setCustomPageBatch(customPageBatch + 1);
          }
          customPage.checked = false;
          toast.info("Seals added to custom pages");
          document.getElementById("range-fieldIdAdd").className = "range-field";
          setRange("");
        } else {
          alert("Please enter a valid page no.");
        }
      } else {
        alert("Please enter the custom page no.");
      }
    } else if (
      //When No page option is selected
      !allPage.checked ||
      !firstPage.checked ||
      !lastPage.checked ||
      !customPage.checked
    ) {
      setSelectedOption("C");
      setSelectedOptionArray([...selectedOptionArray, "C"]);
      setCurrentPageNo([...currentPageNo, currentPage]);
      addSignatureStamp();
      toast.info("Seal added to current page");
    }
  };

  const paymentPreviewPage = () => {
    let body = {
      amount: sessionStorage.getItem("amount"),
      username: sessionStorage.getItem("username"),
      mysignTxnId: sessionStorage.getItem("mysignTxnId"),
    };
    setLoaded(true);
    fetch(URL.paymenturl, {
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
        if (responseJson.status == "SUCCESS") {
          setLoaded(true);
          alert(responseJson.statusDetails);
          setOpenSecondModal(false);
        } else {
          setLoaded(true);
          alert(responseJson.statusDetails);
        }
      });
  };

  const subscribedPlanDetails = () => {
    let sendername = "";
    if (sessionStorage.getItem("externalSigner") == "true") {
      sendername = ownerloginName;
    } else {
      sendername = sessionStorage.getItem("username");
    }

    var body = {
      loginname: sendername,
      authToken: sessionStorage.getItem("authToken"),
    };
    fetch(URL.subscribedPlanDetails, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          setPlanActive(true);
        } else {
          setPlanActive(false);
          setPlanActiveDetails(responseJson.statusDetails);
          setLoaded(false);
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const onOpenFirstModal = () => {
    let selectedOptionValue = sessionStorage.getItem("selectedOption");
    if (selectedOptionValue == null) {
      sessionStorage.setItem("selectedOption", selectedOption);
    }
    let data = props?.location?.state?.details;
    setSelectedOptionArray(
      selectedOptionArray.filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
      })
    );

    let result = false;
    result = stampingPosition();
    if (result == true) {
      onCloseFirstModal();
      confirmAlert({
        message: "Please verify and place the signing position on the document",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
      return;
    } else if (selectedOptionArray.at(-1) != "R" && dragArray.length != 0) {
      if (selectedMode != 0) {
        if (selectedMode === "1") {
          validationCheck();
        } else if (selectedMode === "2" || selectedMode === "3") {
          if (planActive === true) {
            // var handSignImg = sessionStorage.getItem("handSignImg");
            validationCheck();
          } else {
            confirmAlert({
              message: planActiveDetails,
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {},
                },
              ],
            });
          }
        } else {
          // var handSignImg = sessionStorage.getItem("handSignImg");
          if (mobileotpvalue.length == 0 || emailotpvalue.length == 0) {
            alert("Please Enter Both the OTP Fields");
            return;
          }
          validationCheck();
        }
      } else {
        confirmAlert({
          message: "Please select the mode!!!",
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
              onClick: () => {},
            },
          ],
        });
      }
    } else {
      confirmAlert({
        message: "Please add the seal to proceed",
        // message: "Please select the page!!!",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
    }
    // }
  };

  const validationCheck = () => {
    setLoaded(false);
    let authToken = sessionStorage.getItem("authToken");
    var consentCode = "nsdlTnC";
    if (selectedMode === "2" || selectedMode === "3" || selectedMode === "4") {
      consentCode = "consentDSC";
    } else {
      consentCode = "nsdlTnC";
    }
    var body = {
      authToken: authToken,
      consentTnC: consentCode,
    };
    if (isInsufficientUnits) {
      confirmAlert({
        message: "Insufficient Balance!! Please Topup your account",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
      setLoaded(true);
    } else {
      fetch(URL.getTermsAndConditions, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (response.status === 400) {
            props.history.push("/esign_error");
          } else if (response.status === 200) {
            return response.json();
          } else {
            props.history.push("/");
          }
        })
        .then((responseJson) => {
          setLoaded(true);
          setTandC(responseJson.TandC);
          setOpenFirstModal(true);
        })
        .catch((e) => {
          alert(e);
        });
    }
  };

  const handleModeChange = (e) => {
    if (selectedOption) {
      setSelectedMode(e.target.value);
      setLoaded(true);
      if (
        sessionStorage.getItem("ud") == "false" ||
        sessionStorage.getItem("ud") == null
      ) {
        var data = props?.location?.state?.details;
        //for multi user external signer fixing coordinates
        if (!(data?.hasOwnProperty("externalSigner") && data?.externalSigner)) {
          getRequiredUnits(selectedOption, e.target.value);
        }
      } else {
        getRequiredUnits(selectedOption, e.target.value);
      }

      if (e.target.value === "2") {
        document.getElementById("handSignContainer").style.display = "";
        document.getElementById("clientdownload").style.display = "none";
        document.getElementById("generateOtpMode").style.display = "none";
        document.getElementById("submitBtn").style.display = "";

        setTandcHeader("Electronic Sign");
        setIsInsufficientUnits(false);
      } else if (e.target.value === "1") {
        document.getElementById("handSignContainer").style.display = ""; //
        document.getElementById("clientdownload").style.display = "none";
        document.getElementById("generateOtpMode").style.display = "none";
        document.getElementById("submitBtn").style.display = "";
        setTandcHeader("Aadhaar eSign");
      } else if (e.target.value === "3") {
        document.getElementById("handSignContainer").style.display = "";
        document.getElementById("clientdownload").style.display = "";
        document.getElementById("generateOtpMode").style.display = "none";
        document.getElementById("submitBtn").style.display = "";

        setTandcHeader("Self Token Sign");
        var units = parseInt(sessionStorage.getItem("units"), 10);
        setIsInsufficientUnits(false);
      } else if (e.target.value === "4") {
        document.getElementById("handSignContainer").style.display = "none";
        document.getElementById("clientdownload").style.display = "none";
        document.getElementById("generateOtpMode").style.display = "";
        document.getElementById("submitBtn").style.display = "none";
        setTandcHeader("OTP Sign");
        setIsInsufficientUnits(false);
      }
    } else {
      confirmAlert({
        message: "Please add the seal to proceed",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
    }
  };

  const downloadClientprogram = () => {
    window.location.href =
      URL.downloadClientProgram +
      "?at=" +
      btoa(sessionStorage.getItem("authToken"));
  };

  //if the jSign DSC clientprogram is not running then we will unclock the locked document for 3rd party signing
  const unlockdocument = () => {
    let authToken = sessionStorage.getItem("authToken");
    var body = {
      authToken: authToken,
      signMode: selectedMode,
      username: username,
      email: signeremail,
      userId: signeruserId,
      email: signeremail,
      docrefNo: docrefNo,
    };
    fetch(URL.unlockdscdocument, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          props.history.push("/");
        }
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
        } else {
          alert(responseJson.statusDetails);
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  //For DSC signing if the 3rd party signer is not a jsign user then request for accesscode will be sent
  const generateaccesscode = () => {
    let authToken = sessionStorage.getItem("authToken");
    let signMode;
    var body = {
      authToken: authToken,
      signMode: selectedMode,
      username: username,
      email: signeremail,
      userId: signeruserId,
      email: signeremail,
      mobileNo: signerMobileNumber,
    };
    fetch(URL.generatedscaccesscode, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          props.history.push("/");
        }
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          setAccessCode(responseJson.accesscode);
          document.getElementById("accesscodeval").style.display = "";
          document.getElementById("accesscodeval").disabled = true;
        } else {
          alert(responseJson.statusDetails);
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  //For generating Esign Otp
  const generateEsignOtp = (e) => {
    sessionStorage.removeItem("handSignImg");
    if (dragArray.length != 0) {
      let result = false;
      result = stampingPosition();
      if (result == true) {
        confirmAlert({
          message:
            "Please verify and place the signing position on the document",
          buttons: [
            {
              label: "OK",
              className: "confirmBtn",
              onClick: () => {},
            },
          ],
        });
        return;
      } else {
        setLoaded(false);
        if (planActive == true) {
          document.getElementById("generateOtpBtn").disabled = true;
          let data = new FormData();
          let obj = {
            authToken: sessionStorage.getItem("authToken"),
            selectedMode: selectedMode,
            loginname: sessionStorage.getItem("username"),
            userIP: sessionStorage.getItem("userIP"),
            docId: docId,
            isPrivate: isPrivate,
            signerComments: signerComments,
          };
          data.append("file", file);
          data.append("inputDetails", JSON.stringify(obj));
          fetch(URL.generateOTP, {
            method: "POST",
            headers: {
              enctype: "multipart/form-data",
            },
            body: data,
          })
            .then((response) => {
              document.getElementById("generateOtpBtn").disabled = false;
              setLoaded(true);
              if (response.status === 400) {
                confirmAlert({
                  message: "Signing Failed.Try After Sometime.",
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => {},
                    },
                  ],
                });
              } else if (response.status === 200) {
                return response.json();
              } else {
                props.history.push("/");
              }
            })
            .then((responseJson) => {
              if (responseJson.status === "SUCCESS") {
                setOpenOTPModal(true);
                setLoaded(true);
                setDocId(responseJson.docID);
                setMobileNum(responseJson.mobilenum);
                setEmailId(responseJson.emailid);
                setTxnId(responseJson.txnid);
                startResendOtpTimer();
              } else {
                if (
                  responseJson.statusDetails.includes("OTP Generation Failed")
                ) {
                  confirmAlert({
                    message: responseJson.statusDetails,
                    buttons: [
                      {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => {
                          setLoaded(true);
                          setOpenOTPModal(false);
                        },
                      },
                    ],
                  });
                } else {
                  confirmAlert({
                    message: responseJson.statusDetails,
                    buttons: [
                      {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => {
                          setLoaded(true);
                          setOpenOTPModal(false);
                        },
                      },
                    ],
                  });
                }
              }
            })
            .catch((e) => {
              alert(e);
            });
        } else {
          confirmAlert({
            message: planActiveDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  setLoaded(true);
                },
              },
            ],
          });
        }
      }
    } else {
      confirmAlert({
        message: "Please add the seal to proceed",
        // message: "Please select the page!!!",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
    }
  };

  //To check whether the seals added are in default position, where it is added
  const stampingPosition = () => {
    let actuall_x = [];
    let actuall_y = [];
    let height = canvas_height;
    let width = canvas_width;
    let width_ratio;
    let height_ratio;
    width_ratio = width / document.getElementById("parent-div").clientWidth;
    height_ratio = height / document.getElementById("parent-div").clientHeight;

    if (
      sessionStorage.getItem("txnrefNo") != null &&
      sessionStorage.getItem("ud") == "false"
    ) {
      for (let i = 0; i < dragArray.length; i++) {
        actuall_x.push(
          parseInt(
            Math.round(Number(dragArray[i].left.slice(0, -2)) * width_ratio),
            10
          )
        );
        actuall_y.push(
          parseInt(
            Math.round(Number(dragArray[i].top.slice(0, -2)) * height_ratio),
            10
          )
        );
      }
    } else {
      var data = props?.location?.state?.details;
      if (data?.hasOwnProperty("externalSigner") && data?.externalSigner) {
        actuall_x = 3;
        actuall_y = 4;
      } else {
        for (let i = 0; i < dragArray.length; i++) {
          actuall_x.push(
            parseInt(
              Math.round(Number(dragArray[i].left.slice(0, -2)) * width_ratio),
              10
            )
          );
          actuall_y.push(
            parseInt(
              Math.round(Number(dragArray[i].top.slice(0, -2)) * height_ratio),
              10
            )
          );
        }
      }
    }

    for (let i = 0; i < dragArray.length; i++) {
      if (actuall_x[i] == 0 && actuall_y[i] == 0) {
        return true;
      }
    }
  };

  //To fetch the required units for aadhar signing
  const getRequiredUnits = (selectedPagevalue, selectedModeValue) => {
    if (
      selectedModeValue == "C" ||
      selectedModeValue == "F" ||
      selectedModeValue == "L"
    ) {
      selectedModeValue = "" + "P";
    }
    if (selectedPagevalue) {
      setSelectedOption(selectedPagevalue);
      let body = {
        authToken: sessionStorage.getItem("authToken"),
        loginname: sessionStorage.getItem("username"),
        signPage: selectedPagevalue,
        signMode: selectedModeValue,
      };
      setLoaded(false);
      fetch(URL.getRequiredUnits, {
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
          if (responseJson.status == "SUCCESS") {
            //checking whether required no of units are fetched from server or not.
            if (sessionStorage.hasOwnProperty("units")) {
              var finalunits = sessionStorage.getItem("units");
              if (sessionStorage.getItem("units").includes(",")) {
                var units = sessionStorage.getItem("units").split(" ", 1);
                var units1 = units[0].split(",");
                finalunits = units1[0] + units1[1] + "";
              } else {
                finalunits = sessionStorage.getItem("units");
              }
              var integer1 = parseInt(responseJson.units, 10);
              var integer2 = parseInt(finalunits, 10);
              var difference = integer1 - integer2;
              if (
                difference > 0 &&
                (selectedMode != "2" ||
                  selectedMode != "3" ||
                  selectedMode !== "4")
              ) {
                setIsInsufficientUnits(true);
                $("#topUpBtn").removeAttr("hidden");
                var requiredAmount = difference * 5;
                sessionStorage.setItem("amount", requiredAmount);
              } else {
                setIsInsufficientUnits(false);
                $("#topUpBtn").attr("hidden", "hidden");
              }
              setLoaded(true);
            } else {
              confirmAlert({
                message: "Unable to fecth required units, try after sometime.",
                buttons: [
                  {
                    label: "OK",
                    className: "confirmBtn",
                    onClick: () => {
                      // refs.history.push("/docUpload");
                    },
                  },
                ],
              });
              setLoaded(true);
            }
          } else {
            confirmAlert({
              message: responseJson.statusDetails,
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {},
                },
              ],
            });
            setLoaded(true);
          }
        });
    } else {
      confirmAlert({
        message: "Please add the seal to preceed",
        // message: "Please select the page!!!",
        buttons: [
          {
            label: "OK",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
    }
  };

  //On click of resend otp button
  const resendEsignOtp = (e) => {
    let obj = {
      authToken: sessionStorage.getItem("authToken"),
      selectedMode: selectedMode,
      loginname: sessionStorage.getItem("username"),
      docID: docId,
    };
    setLoaded(false);
    fetch(URL.resendEsignOtp, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((response) => {
        setLoaded(true);
        if (response.status === 400) {
          confirmAlert({
            message: "Signing Failed.Try After Sometime.",
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {},
              },
            ],
          });
        } else if (response.status === 200) {
          return response.json();
        } else {
          props.history.push("/");
        }
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          startResendOtpTimer();

          setLoaded(true);
          setOpenOTPModal(true);
        } else {
          confirmAlert({
            message: responseJson.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  setLoaded(true);
                  setOpenOTPModal(false);
                },
              },
            ],
          });
        }
      })
      .catch((e) => {
        alert(e);
        // this.props.history.push('/')
      });
  };

  //For hiding sidebar toggler when viewing document using modal
  const hideSidebarToggler = () => {
    setTooltipOpenModal(false);
    setIsHovered(false);
    document.getElementsByClassName(
      "d-lg-none navbar-toggler"
    )[0].style.display = "";
    document.getElementsByClassName(
      "d-md-down-none navbar-toggler"
    )[0].style.display = "";
    setShown(false);
  };

  //For closing Modal for OTP
  const onCloseOTPModal = () => {
    setDocId("");
    setOpenOTPModal(false);
    stopResendOtpTimer();
  };

  const onCloseFirstModal = () => {
    setOpenFirstModal(false);
  };

  //For closing Modal for payment
  const onCloseSecondModal = () => {
    setOpenSecondModal(false);
  };

  const setSingerComments = (e) => {
    const { name, value } = e.target;
    if (name === "signerComments") {
      setSignerComments(e.target.value.replace(/[^\w\s@#_,'":.\\-]/gi, ""));
    }
  };

  const toQRcode = () => {
    sessionStorage.setItem("paymentType", "ESM");
    setOpenSecondModal(true);
  };

  const makePrivatecomment = () => {
    var checkbox = document.getElementById("makeprivatecomment");
    if (checkbox.checked === false) {
      setIsPrivate(0);
    } else if (checkbox.checked === true) {
      setIsPrivate(1);
    }
  };

  //Modal for only reading the pdf document
  const modalBody = () => {
    $(".d-lg-none.navbar-toggler").css("display", "none");
    $(".d-md-down-none.navbar-toggler").css("display", "none");
    return (
      <div
        style={{
          backgroundColor: "#fff",
          flexDirection: "column",
          overflow: "hidden",
          left: 0,
          position: "fixed",
          top: 0,
          height: "100%",
          width: "100%",
          marginTop: "55px",
          zIndex: 1019,
        }}
      >
        <div
          style={{
            alignItems: "center",
            backgroundColor: "#000",
            color: "#fff",
            display: "flex",
            padding: ".5rem",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: "0 0 auto" }}>
            {props?.location?.state?.details?.files?.name}
          </div>
          <div
            style={{
              alignItems: "center",
              borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              display: "flex",
              padding: "4px",
            }}
          >
            <div style={{ padding: "0px 2px" }}>
              <GoToPreviousPage />
            </div>
            <div style={{ marginLeft: "10px", fontSize: "14px" }}>
              {" "}
              {currentPageView} / {sessionStorage.getItem("TotalPages")}{" "}
            </div>
            <div style={{ padding: "0px 2px", marginLeft: "6px" }}>
              <GoToNextPageButton />
            </div>
          </div>

          <button
            style={{
              backgroundColor: "#357edd",
              border: "none",
              borderRadius: "4px",
              color: "#ffffff",
              cursor: "pointer",
              padding: "8px",
              flex: "0 0 auto",
              marginTop: "5px",
            }}
            onClick={hideSidebarToggler}
          >
            Back
          </button>
        </div>

        <div
          style={{
            overflow: "auto",
            height: "472px",
          }}
        >
          {/* {console.log(fileUrl)} */}
          <Viewer
            fileUrl={fileUrl}
            defaultScale={SpecialZoomLevel.PageWidth}
            plugins={[pageNavigationPluginInstance, customPlugin]}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    );
  };

  //For displaying tooltip message on hover of Add seals Badge
  const getTooltipMessage = () => {
    return "Add to current page";
  };
  const getTooltipMessageForFullScreen = () => {
    return "Full preview";
  };

  const handleBadgeMouseEnter = (event) => {
    // console.log(event.target.id);
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      if (
        ((!selectedOption && submitted) || (selectedOption && submitted)) &&
        event.target.id === "signaturePage"
      ) {
        setTooltipOpen(true);
      } else if (
        selectedOption &&
        !submitted &&
        event.target.id === "signaturePage"
      ) {
        setTooltipOpen(false);
      } else if (event.target.id === "viewModal") {
        setTooltipOpenModal(true);
        setIsHovered(true);
      }
    }
  };
  const handleBadgeMouseLeave = (event) => {
    // console.log(event.target.id);
    if (event.target.id === "signaturePage") {
      setTooltipOpen(false);
    } else if (event.target.id === "viewModal") {
      setTooltipOpenModal(false);
      setIsHovered(false);
    }
  };

    const onRenderAnnotations = (e) => {

        // Find all Link annotation
        e.annotations.forEach((annotation) => {
            if (annotation.annotationType === 2) { // 2 represents 'Link' type
            // Find the anchor element associated with the annotation
            const linkElement = e.container.querySelector(`[data-annotation-id="${annotation.id}"] a`);
            if (linkElement) {
                // // Set the target attribute to '_blank' to open in a new tab
                // linkElement.setAttribute('target', '_blank');
                // Remove the href attribute to disable the link
                linkElement.removeAttribute('href');
                // Optionally, you can also prevent the default behavior of the link
                linkElement.addEventListener('click', (event) => {
                    event.preventDefault();
                });
            }
        }
        });
    // };

    return {
        onAnnotationLayerRender: onRenderAnnotations,
    };
};

const customPlugin = {
    onAnnotationLayerRender: onRenderAnnotations,
};

  const pdfViewer = () => {
    // const showThumbnail = !(detectMob);
    // const data = props.location.state.details;
    const showThumbnail = !/iPhone|iPad|iPod|Android/i.test(
      navigator.userAgent
    );
    const plugins = showThumbnail
      ? [thumbnailPluginInstance, pageNavigationPluginInstance, customPlugin]
      : [pageNavigationPluginInstance, customPlugin];
    return (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js">
        <div
          id="outer-most-div"
          style={{
            margin: "1rem auto",
            width: "64rem",
          }}
        >
          <div
            id="containerPDF"
            style={{
              display: "flex",
              marginTop: "-16px",
              // width: "1100px"
            }}
          >
            <div
              style={{
                borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                width: "12%",
                height: "620px",
                // height: "628px",
              }}
              id="hideThumbnailForMobile"
            >
              <Thumbnails renderThumbnailItem={renderThumbnailItem} />
            </div>
            <div className="parent-div" id="parent-div">
              {fileUrl && <Viewer
                // id="pdfViewer"
                fileUrl={fileUrl}
                renderLoader={() => null}
                plugins={plugins}
                // defaultScale={SpecialZoomLevel.PageFit}//
                defaultScale={SpecialZoomLevel.PageWidth}
                // defaultScale={SpecialZoomLevel.ActualSize}//
                onPageChange={handlePageChange}
                // onDocumentLoad={renderInitialValuesToState}
                // pageLayout={pageLayout}
                // onAnnotationLayerRender={annotationLayerRender}
              />}
            </div>
          </div>
        </div>
      </Worker>
    );
  };


const submitDeclineComments = () => {
 
  if (!signerComments) {
    if (!commentsListDetails.length) {
     
      onlyopenAddCommentsModal();
    } else {
     
      setOpensignersCommentsModal(true);
      if (isPrivate === 1) {
        document.getElementById("makeprivatecomment").checked = true;
      }
    }
  } else {
    const body = {
      authToken: AuthToken,
      isPrivate: isPrivate,
      signerComments: signerComments,
      docId: props.docId,
      userIP: sessionStorage.getItem("userIP"),
    };

    fetch(URL.declineSigning, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Failed to decline signing");
        }
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          confirmAlert({
            message: responseJson.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {

                  if (responseJson?.loginMode === 0) {
                    console.log("Navigating to /inbox with loginMode:", responseJson.loginMode);
                    props.history.push("/inbox");
                  } else {
                    console.log("Navigating to /home with loginMode:", responseJson.loginMode);
                    props.history.push("/home");
                  }
                  
                
                },
              },
            ],
          });
        } else if((responseJson.statusDetails="Cannot decline signing, document signing was already declined")||(responseJson.statusDetails="Decline Signing Failed. Try again later.")){
          
            confirmAlert({
              message: responseJson.statusDetails,
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {
       
                    if (responseJson?.loginMode === 0) {
                      console.log("Navigating to /inbox with loginMode:", responseJson.loginMode);
                      props.history.push("/inbox");
                    } else {
                      console.log("Navigating to /home with loginMode:", responseJson.loginMode);
                      props.history.push("/home");
                    }
                    
                   },
                },
              ],
            })
          }else{
              confirmAlert({
     
                 message: responseJson.statusDetails,
                 buttons: [
                   {
                     label: "OK",
                     className: "confirmBtn",
                     onClick: () => { },
                   },
                 ],
               });
             }
      })
      .catch((error) => {
        alert(error.message);
      });
  }
};


  return (
    <div id="mainDiv" style={{ overflow: overflow }}>
      <Loader
        loaded={loaded}
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
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      ></ToastContainer>
      <div
        className="container"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <Row>
          <Button
            style={{
              marginLeft: commentsMargin,
              display: isExternalGuestAccess,
              marginBottom: "0.5rem",
              fontWeight: "500",
              lineHeight: "1.2",
              fontSize: "17px",
              marginTop: "-5px",
            }}
            color="link"
            id="signersComments"
            onClick={signersComments}
          >
            Comments
            <i style={{ marginLeft: "10px" }} className="fa fa-comment-o"></i>
          </Button>
          <Button
            style={{
              fontSize: "12px",
              marginTop: "-5px",
              height: "32px",
              backgroundColor: isHovered
                ? "rgba(0, 0, 0, 0.15)"
                : "transparent",
              marginLeft:
                props?.location?.state?.details?.hasOwnProperty(
                  "externalSigner"
                ) && props?.location?.state?.details?.externalSigner
                  ? "20rem"
                  : "21rem",
            }}
            id="viewModal"
            onClick={() => setShown(true)}
            onMouseEnter={handleBadgeMouseEnter}
            onMouseLeave={handleBadgeMouseLeave}
          >
            <i
              class="fa fa-expand"
              aria-hidden="true"
              style={{ fontSize: "20px", color: "#20a8d8" }}
            ></i>
          </Button>
          {isHovered ? (
            <Tooltip
              isOpen={tooltipOpenModal}
              target="viewModal"
              placement="bottom"
              id="tooltip"
              hideArrow
            >
              {getTooltipMessageForFullScreen()}
            </Tooltip>
          ) : null}
        </Row>
      </div>
      <div className="item-container preview" id="container1">
        <div className="items" id="container2">
          <div
            className="grand-parent-div"
            id="decorate"
            style={{
              width: "582px",
              height: "620px",
              // height: "628px",
              marginBottom: "1px",
              backgroundColor: "rgba(0, 0, 0, 0.15)",
            }}
          >
            {pdfViewer()}
          </div>
          <div
            className="banking-details-container"
            id="bankingContainer"
            style={{
              margin: "0px 50px 50px 50px",
            }}
          >
            <div id="balanceContainer" style={{ height: "40px" }}>
              <b
                id="availableBalanceId"
                style={{
                  padding: "0% 0% 0% 0%",
                  color: "black",
                  fontSize: "13px",
                }}
              >
                Available Balance : {sessionStorage.getItem("units")}
              </b>
              <Button
                color="primary"
                className="px-4"
                id="topUpBtn"
                onClick={toQRcode}
                hidden
              >
                TopUp
              </Button>
            </div>

            <div id="docdiv0">
              <div
                id="documntsender0"
                style={{ display: "none" }}
              >
                <b>Document title:</b>&nbsp;
                {customDocName}{" "}
              </div>
            {/* </div> */}
            {/* <div id="docdiv1"> */}
              <div
                id="documntsender"
                style={{ display: "none" }}
              >
                <b>Sender:</b>&nbsp;
                {senderName}{" "}
              </div>
            {/* </div> */}
            {/* <div id="docdiv2"> */}
              <div
                id="documntsender1"
                style={{ display: "none" }}
              >
                <b>Requested on:</b>&nbsp;
                {requestedTime}
              </div>
            </div>

            {shown && ReactDOM.createPortal(modalBody(), document.body)}

            <div className="items-content-1" id="signPageSelectDiv">
              <div className="item-text">
                <span className="" style={{ marginRight: "40px" }}>
                  SELECT SIGNATURE PAGE
                </span>
                <div style={{ display: "contents" }}>
                  <Badge
                    color="primary"
                    style={{ cursor: "pointer", fontSize: "smaller" }}
                    onClick={signaturePageSelected}
                    id="signaturePage"
                    onMouseEnter={handleBadgeMouseEnter}
                    onMouseLeave={handleBadgeMouseLeave}
                  >
                    Add seals
                  </Badge>
                  <Tooltip
                    isOpen={tooltipOpen}
                    target="signaturePage"
                    placement="bottom"
                    id="tooltip"
                    hideArrow
                  >
                    {getTooltipMessage()}
                  </Tooltip>
                </div>
              </div>
              <div className="">
                <div className="radio-container">
                  <div className="radio-items" id="firstPageRadio">
                    <input
                      type="radio"
                      id="firstPage"
                      value="F"
                      name="signPage"
                      onChange={handleOptionChange}
                    />
                    <span className="label">First</span>
                  </div>
                  <div className="radio-items" hidden>
                    <input
                      type="radio"
                      id="append"
                      value="C"
                      name="signPage"
                      onChange={handleOptionChange}
                    />
                    <span className="label">Current</span>
                  </div>
                  <div className="radio-items" id="lastPageRadio">
                    <input
                      type="radio"
                      id="lastPage"
                      value="L"
                      name="signPage"
                      onChange={handleOptionChange}
                    />
                    <span className="label">Last</span>
                  </div>
                  <div className="radio-items" id="allPageRadio">
                    <input
                      type="radio"
                      id="allPage"
                      value="A"
                      name="signPage"
                      onChange={handleOptionChange}
                    />
                    <span className="label">All Pages</span>
                  </div>
                </div>
                <div
                  className="radio-container"
                  style={{ marginBottom: "10px" }}
                >
                  <div className="radio-items">
                    <input
                      type="radio"
                      id="customPage"
                      value="P"
                      name="signPage"
                      onChange={rangeInput}
                    />
                    <span className="label">Custom</span>
                  </div>
                  <div className="range-input" style={{ marginRight: "10px" }}>
                    <input
                      className="range-field"
                      id="range-fieldIdAdd"
                      value={range}
                      name="range-field"
                      onChange={setRangeValue}
                      type="text"
                      placeholder="eg 1,2,3,4,6"
                    />
                  </div>
                  <div className="item-text" style={{ display: "contents" }}>
                    <Badge
                      color="danger"
                      style={{ cursor: "pointer" }}
                      onClick={removeAllPageSeals}
                      id="removeAll"
                    >
                      Remove all seals
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="items-content-1">
              <div className="item-text">
                <span className="">SELECT SIGNATURE MODE</span>
              </div>
              <div className="">
                <div className="radio-container">
                  <div className="radio-items" id="signMode">
                    <input
                      type="radio"
                      id="electronicModeRadio"
                      value="2"
                      checked={selectedMode === "2"}
                      onChange={handleModeChange}
                    />
                    <span className="label">Electronic Sign</span>
                  </div>
                  <div className="radio-items" id="signMode">
                    <input
                      type="radio"
                      id="aadhaarModeRadio"
                      value="1"
                      checked={selectedMode === "1"}
                      onChange={handleModeChange}
                    />
                    <span id="aadhaarEsign" className="label">
                      Aadhaar eSign
                    </span>
                  </div>
                </div>
                <div className="radio-container">
                  <div className="radio-items" id="signMode">
                    <input
                      type="radio"
                      id="otpSignModeRadio"
                      value="4"
                      checked={selectedMode === "4"}
                      onChange={handleModeChange}
                    />
                    <span className="label" id="otpsigningtext">
                      OTP Sign
                    </span>
                  </div>
                  <div className="radio-items" id="signMode">
                    <input
                      type="radio"
                      id="selfDscTokenModeRadio"
                      value="3"
                      checked={selectedMode === "3"}
                      onChange={handleModeChange}
                    />
                    <span className="label" id="selftokentext">
                      DSC Token Sign
                    </span>
                    <span id="clientdownloadspan">
                      <a
                        href={
                          URL.downloadClientProgram +
                          "?at=" +
                          btoa(sessionStorage.getItem("authToken"))
                        }
                        id="clientdownload"
                        style={{ display: "none" }}
                      >
                        Download DSC Client
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div id="generateOtpMode" style={{ display: "none" }}>
                <Button
                  color="primary"
                  id="generateOtpBtn"
                  onClick={generateEsignOtp}
                >
                  {" "}
                  Generate OTP
                </Button>
              </div>

              <div>
                <canvas className="xx" id="textCanvas" height="60"></canvas>
                <img id="image" hidden={true} />
              </div>
              <div id="handSignContainer" style={{ display: "" }}>
                <HandSign signMode={selectedMode} data={"dxgfx"} />
              </div>

              <div id="acccesscodenote">
                <p id="accesscodemsg1" style={{ display: "none" }}>
                  For DSC signing generate and use Access Code
                </p>
                <div id="acessCodediv">
                  <Button
                    color="primary"
                    style={{ display: "none" }}
                    id="generateaccesscodeBtn"
                    onClick={generateaccesscode}
                  >
                    Get Access Code
                  </Button>
                  <Input
                    id="accesscodeval"
                    style={{ display: "none" }}
                    type="text"
                    name="accesscode"
                    defaultValue={accessCode}
                  />
                </div>
              </div>
            </div>
            <div className="submit-details" id="submitBtn">

            <button 
            style={{display:"none"}} id="declineButton"
                  className="upload-button"
                  onClick={submitDeclineComments}
                >
                  <span>DECLINE &#8594;</span>
                </button>&nbsp;&nbsp;
                {/* </div>
                <div className="submit-details"> */}

              <button className="upload-button" onClick={onOpenFirstModal}>
                <span>SUBMIT &#8594;</span>
              </button>
            </div>

            {/* <div id="note">
                <p id="p1">
                  Note: Stamp position may overlap on the contents after
                </p>
                <p id="p2">
                  signing. Please verify and adjust the signing position as
                </p>
                <p id="p3">required.</p>
              </div> */}

            <Modal
              className="modal-container"
              open={openAddCommentsModal}
              onClose={onCloseAddCommentsModal}
              center={true}
              closeOnOverlayClick={false}
            >
              <div className="para-text" id="addCommentsModalpara-text">
                <div className="para-content">
                  <Row id="otpmodalrow1">
                    <label style={{ Color: "Blue" }} id="addcommentsLabel">
                      Add my comments
                      <i
                        style={{ marginLeft: "10px" }}
                        class="fa fa-comment-o"
                      ></i>
                    </label>
                    <textarea
                      style={{ marginLeft: "0px", fontSize: "13px" }}
                      class="signercomments"
                      id="signerCommentsid"
                      name="signerComments"
                      placeholder="maximum 255 characters allowed"
                      title="maximum 255 characters allowed"
                      rows="3"
                      // onkeypress={setSingerComments}
                      onChange={setSingerComments}
                      // onPaste={setSingerComments}
                      value={signerComments}
                      required={true}
                      minLength={0}
                      maxLength={455}
                      autoComplete="off"
                    ></textarea>
                    <div>
                      <input
                        type="checkbox"
                        name="acceptance"
                        id="makeprivatecomment"
                        value="terms"
                        onClick={makePrivatecomment}
                      ></input>
                      <label
                        for="acceptance"
                        id="makeprivatecommentlabel"
                        style={{ fontSize: "13px", marginLeft: "5px" }}
                      >
                        show to me and sender only
                      </label>
                    </div>
                    <Button
                      id="addcommentsOkbutton"
                      style={{
                        float: "right",
                        marginLeft: "auto",
                        marginTop: "15px",
                        marginBottom: "-10px",
                      }}
                      color="primary"
                      onClick={onCloseAddCommentsModal}
                    >
                      OK
                    </Button>
                  </Row>
                </div>
              </div>
            </Modal>

            <Modal
              className="modal-container"
              open={opensignersCommentsModal}
              onClose={onCloseSignersCommentsModal}
              center={true}
              closeOnOverlayClick={false}
            >
              <div className="modal-head-1">
                <span style={{ color: "#c79807" }}>{commentsHeading}</span>
              </div>
              <div className="para-text" id="opensignersCommentsModalpara-text">
                <div className="para-content">
                  <Row id="otpmodalrow2">
                    <table
                      id="commentstable"
                      style={{
                        width: "100%",
                        border: "1px solid black",
                      }}
                    >
                      <tbody style={{ fontSize: "13px" }}>
                        <tr
                          style={{
                            border: "1px solid black",
                          }}
                        >
                          <th style={{ borderBottom: "1px solid black" }}>
                            Singer
                          </th>{" "}
                          <th style={{ borderBottom: "1px solid black" }}>
                            Comments
                          </th>{" "}
                          <th style={{ borderBottom: "1px solid black" }}>
                            Commented On
                          </th>
                        </tr>
                        {commentsListDetails.map((items, idx) => (
                          <tr>
                            <td
                              style={{
                                width: "20%",
                                borderBottom: "1px solid black",
                              }}
                            >
                              {items.SingerName}
                            </td>
                            <td
                              style={{
                                width: "55%",
                                borderBottom: "1px solid black",
                              }}
                            >
                              {items.SingerComments}
                            </td>
                            <td
                              style={{
                                width: "25%",
                                borderBottom: "1px solid black",
                              }}
                            >
                              {items.CommentedOn}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <label
                      style={{
                        Color: "Blue",
                        marginTop: "10px",
                        fontSize: "14px",
                      }}
                      id="addcommentsLabel"
                    >
                      Add my comments
                      <i
                        style={{
                          marginLeft: "10px",
                          marginTop: "10px",
                          fontSize: "14px",
                        }}
                        class="fa fa-comment-o"
                      ></i>
                    </label>

                    <div>
                      <textarea
                        style={{ fontSize: "13px" }}
                        class="signercomments"
                        id="signerCommentsid1"
                        name="signerComments"
                        placeholder="maximum 255 characters allowed"
                        title="maximum 255 characters allowed"
                        rows="3"
                        // onkeypress={setSignerComments}
                        onChange={setSingerComments}
                        // onpaste={setSingerComments}
                        value={signerComments}
                        required={true}
                        minLength={0}
                        maxLength={455}
                        autoComplete="off"
                      ></textarea>
                      <div>
                        <input
                          type="checkbox"
                          name="acceptance"
                          id="makeprivatecomment"
                          value="terms"
                          onClick={makePrivatecomment}
                        ></input>
                        <label
                          for="acceptance"
                          id="makeprivatecommentlabel"
                          style={{ fontSize: "13px", marginLeft: "5px" }}
                        >
                          show to me and sender only
                        </label>
                      </div>
                      <Button
                        id="addcommentsOkbutton"
                        style={{
                          float: "right",
                          marginBottom: "-10px",
                        }}
                        color="primary"
                        onClick={onCloseSignersCommentsModal}
                      >
                        OK
                      </Button>
                    </div>
                  </Row>
                </div>
              </div>
            </Modal>

            {/* Modal for OTP Signing*/}
            <Modal
              className="modal-container"
              open={openOTPModal}
              onClose={onCloseOTPModal}
              center={true}
              closeOnOverlayClick={false}
            >
              <div className="modal-head-1">
                <span style={{ color: "#c79807" }}>{tandcHeader}</span>
              </div>

              <div className="para-text" id="otpmodalpara-text">
                <div className="para-content" style={{ height: "175px" }}>
                  <Row id="otpmodalrow">
                    <InputGroup className="mb-3">
                      <label id="entermobileotp">Mobile OTP: &nbsp;</label>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>

                      <Input
                        type="text"
                        placeholder="Enter Mobile OTP"
                        name="mobileotp"
                        onChange={setInput}
                        maxLength="6"
                        required={true}
                        autoComplete="off"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <label id="enteremaileotp">Email OTP: &nbsp;</label>
                      <InputGroupAddon
                        id=" emailotpinputfield"
                        addonType="prepend"
                      >
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>

                      <Input
                        type="text"
                        placeholder="Enter Email OTP"
                        name="emailotp"
                        required={true}
                        maxLength="6"
                        onChange={setInput}
                        autoComplete="off"
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </InputGroup>
                    <span
                      id="timer"
                      style={{
                        verticalAlign: "-webkit-baseline-middle",
                        marginLeft: "-5px",
                        marginTop: "3%",
                        display: "",
                        color: "#73818f",
                        fontSize: "0.875rem",
                      }}
                    ></span>{" "}
                    <Button
                      style={{
                        margin: "auto",
                        float: "right",
                        display: "none",
                      }}
                      color="link"
                      className="px-0"
                      id="resendOtpbtn"
                      onClick={resendEsignOtp}
                    >
                      Resend OTP
                    </Button>
                  </Row>
                </div>
              </div>
              <br />
              <span id="mobilemsg">OTP Sent to Mobile No.: {mobileNum}</span>
              <br />
              <span id="emailmsg">OTP Sent to Email Id: {emailId}</span>
              <br />
              <br />

              <div id="handSignContainer2">
                <HandSign signMode={selectedMode} />
              </div>

              <div className="agree-div">
                <button
                  className="aggree-button"
                  style={{ width: "150px" }}
                  onClick={onOpenFirstModal}
                >
                  <span>SUBMIT &#8594; </span>
                </button>
              </div>
            </Modal>

            {/* Modal for Terms and Condistions */}
            <Modal
              className="modal-container"
              open={openFirstModal}
              onClose={onCloseFirstModal}
              center={true}
              closeOnOverlayClick={false}
            >
              <div className="modal-head-1">
                <span style={{ color: "#c79807" }}>{tandcHeader}</span>
              </div>
              <div className="modal-head-2">
                <span>Terms & Conditions</span>
              </div>
              <div className="para-text">
                <div className="para-content" id="paraContentId">
                  <span id="TCParagraph">{TandC}</span>
                </div>
              </div>
              <div className="agree-div">
                <button className="aggree-button" onClick={submit}>
                  <span>I AGREE WITH ALL TERMS AND CONDITIONS &#8594; </span>
                </button>
              </div>
            </Modal>

            {/* Modal for payment */}
            <Modal
              className="modal-container"
              open={openSecondModal}
              onClose={onCloseSecondModal}
              center={true}
              closeOnOverlayClick={false}
            >
              <div id="upiInvoice">
                <Row>
                  <Card style={{ margin: "5% 1% 0% 1%" }}>
                    <CardHeader>
                      <b>UPI Payment Details</b>
                      <Button
                        id="invoicePrintBtn"
                        color="primary"
                        onClick={() => window.print()}
                      >
                        Print
                      </Button>
                      <Button
                        id="invoicepayBtnPreview"
                        style={{
                          float: "right",
                          marginRight: "10px",
                          display: "none",
                        }}
                        color="primary"
                        onClick={() => paymentPreviewPage()}
                      >
                        Pay
                      </Button>
                    </CardHeader>
                    <CardBody id="qrInvoiceCard">
                      <QRDetails></QRDetails>
                    </CardBody>
                  </Card>
                </Row>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};
export default React.memo(Preview);
