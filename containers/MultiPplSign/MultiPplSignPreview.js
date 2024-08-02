import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/resizable";
import "jquery-ui-touch-punch";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import ReactDOM from 'react-dom';
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import closeDragDiv from "../MultiPplSign/close_Draggable.webp";
// import closeDragDiv from "../Upload/close_Draggable.webp";
import Modal from "react-responsive-modal";
import { URL } from "../URLConstant";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import "./client.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

var Loader = require("react-loader");

const pdfjsforOnDrag = require("pdfjs-dist");
pdfjsforOnDrag.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.js`;
const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
};

const statusFlag = "";
const defaultLeft = "0px";
const defaultTop = "0px";
const defaultDragWidth = "90px"; //84,88,104
const defaultDragHeight = "48px"; //46,46,62
const defaultDragWidthMob = "72px";//67
const defaultDragHeightMob = "37px";//35

const MultiPplSignPreview = (props) => {
  let clientInfo = props.location.state.details.signerInfo;
  // console.log(props);

  //-------Declaring a new state variable dragArray, count, currentPage, containmentPage----
  const [dragArray, setDragArray] = useState(null || []);
  const [dragArray1, setDragArray1] = useState(null || []);
  const [selectedOption, setSelectedOption] = useState("1");
  // const [selectedOption, setSelectedOption] = useState(null);
  const [openSecondModal, setOpenSecondModal] = useState(false);
  const [file, setFile] = useState("");
  const [count, setCount] = useState(1);
  const [count2, setCount2] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageView, setCurrentPageView] = useState(1);
  const [containmentPage, setContainmentPage] = useState(1);
  const [rangeArray, setRangeArray] = useState(null || []);
  const [overflow, setOverflow] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [canvas_width, setCanvas_width] = useState(null);
  const [canvas_height, setCanvas_height] = useState(null);
  const [loaded, setLoaded] = useState(true);
  const [selectedMode, setSelectedMode] = useState("2");
  const [isInsufficientUnits, setIsInsufficientUnits] = useState(false);
  const [currentPageNo, setCurrentPageNo] = useState(null || []);
  const [customDocName, setCustomDocName] = useState(props.customDocName);
  const isFirstRender = useRef(true);
  const mutationRef = useRef(containmentPage);
  const [allPageBatch, setAllPageBatch] = useState(1);
  const [customPageBatch, setCustomPageBatch] = useState(1);
  const [btnCount, setBtnCount] = useState(1);
  const [reqUnits, setReqUnits] = useState(0);
  const [totalUnits, setTotalUnits] = useState(0);
  const [finalunits, setFinalunits] = useState(sessionStorage.getItem("units"));
  const [customPositionedDragIds, setCustomPositionedDragIds] = useState(
    null || []
  );
  const [customResizedDragIds, setCustomResizedDragIds] = useState(
    null || []
  );
  const [range, setRange] = useState("");
  const [tandcHeader, setTandcHeader] = useState("");
  const [tandcHeaderAs, setTandcHeaderAs] = useState("aAadhar eSign");
  const [selectedOptionArray, setSelectedOptionArray] = useState(null || []);
  const [signerInfoo, setSignerInfoo] = useState(null || []);
  const [customPagesValid, setCustomPagesValid] = useState(true);
  const [previewHeight, setPreviewHeight] = useState(620);
  const [exclusionDragIds, setExclusionDragIds] = useState(null || []);
  // const [addRectanglePrevs, setAddRectanglePrevs] = useState(null || []);
  const [state, setState] = useState("");
  const [endDate, setEndDate] = useState(props.endDate);
  const [startDate, setStartDate] = useState(props.startDate);
  const [enableSignOrder, setEnableSignOrder] = useState(props.enableSignOrder);
  const [noSigns, setNoSigns] = useState(props.noSigns);
  const [signersInfo, setSignersInfo] = useState(props.signersInfo);
  const [Inputs, setInputs] = useState(props.Inputs);
  const [signerBatchNum, setSignerBatchNum] = useState(1);
  const [signerNameEmail, setSignerNameEmail] = useState("");
  const [signerValue, setSignerValue] = useState(null || []);
  const [count3, setCount3] = useState(0);
  const [senderComments, setSenderComments] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [submitted, setSubmitted] = useState(true);
  const [shown, setShown] = useState(false);
  const [mobileWidth, setMobileWidth] = useState(0);
  const [mobileHeight, setMobileHeight] = useState(0);
  const [tooltipOpenModal, setTooltipOpenModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [pageDimensions, setPageDimensions] = useState(props?.location?.state?.details?.pageDimensions || []);
  const [equalPageDimensions, setEqualPageDimensions] = useState(props?.location?.state?.details?.equalPageDimensions);
  const [finalClientDimensions, setFinalClientDimensions] = useState(null || []);
  const [unequalPages, setUnequalPages] = useState([]);
  const [prevSignersDragArray, setPrevSignersDragArray] = useState([]);

  //-------Page change event...geting TotalPages, currentPage-----
  const handlePageChange = (event) => {
    // console.log(event);
    //Storing total number of pages in session----
    sessionStorage.setItem("TotalPages", event.doc._pdfInfo.numPages);
    //Initializing a state variable currentPage----
    if (shown) {
      setCurrentPageView(event.currentPage + 1);
    } else if (!shown) {
      setCurrentPage(event.currentPage + 1);
    }
  };

  useLayoutEffect(() => {
    var data = props.location.state.details;
    setFileUrl(data.files.preview);
    console.log(data);

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
    const checkForElement = async () => {
      setLoaded(false);

      // Array to store the final result
      const finalDimensions = [];     
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

          // One record from equal pages to create All pages dimensions object 
          const pageElementEqual = document.getElementById(`docuPageTest${equalPages[0]}`);
          if (pageElementEqual) {
              const pageNumberValue = pageElementEqual.getAttribute('aria-label');
              const newDimensions = {
                  pageNumber: pageNumberValue,
                  clientWidth: pageElementEqual.clientWidth,
                  clientHeight: pageElementEqual.clientHeight
              };
              // Assign values to clientDimensions array
              capturedDimensions.push(newDimensions);
          }

          // Creating unequal pages dimensions object
          for (let i = 0; i < unequalPages.length; i++) {
              if (currentPage == 1 && unequalPages[i] == 1) {
              } else {
                  jumpToPage(unequalPages[i] - 1);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  jumpToPage(unequalPages[i] - 2);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  jumpToPage(unequalPages[i] - 1);
                  await new Promise(resolve => setTimeout(resolve, 2000));
              }
              const pageElement = document.getElementById(`docuPageTest${unequalPages[i]}`);
              if (pageElement) {
                  const pageNumberValue = pageElement.getAttribute('aria-label'); 
                  const newDimensions = {
                      pageNumber: pageNumberValue,
                      clientWidth: pageElement.clientWidth,
                      clientHeight: pageElement.clientHeight
                  };
                  console.log(newDimensions);
                  // Assign values to clientDimensions array
                  capturedDimensions.push(newDimensions);
              }
          }
          jumpToPage(0);
          console.log({capturedDimensions});

        //   capturedDimensions = [
        //     {
        //         "pageNumber": "Page 1",
        //         "clientWidth": 460,
        //         "clientHeight": 627
        //     },
        //     {
        //         "pageNumber": "Page 5",
        //         "clientWidth": 460,
        //         "clientHeight": 627
        //     }, 
        //     {
        //         "pageNumber": "Page 8",
        //         "clientWidth": 460,
        //         "clientHeight": 627
        //     }, 
        //     {
        //         "pageNumber": "Page 9",
        //         "clientWidth": 460,
        //         "clientHeight": 627
        //     }, 

        // ]

        let hasMatchingDimensions = true;

        while (hasMatchingDimensions) {
          // Check if the dimensions of any unequal page match with those of any equal page
          const matchFound = unequalPages.some(unequalPageNumber => {
              const unequalPage = capturedDimensions.find(page => page.pageNumber === `Page ${unequalPageNumber}`);
              const unequalPageHeight = unequalPage?.clientHeight;

              return equalPages.some(eqPage => {
                  const equalPage = capturedDimensions.find(page => page.pageNumber === `Page ${eqPage}`);
                  return equalPage && equalPage.clientHeight === unequalPageHeight;
              });
          });
          console.log(matchFound);

          if (matchFound) {
            // Recapture the dimensions of unequal pages
            const recapturedDimensions = await recaptureDimensions(capturedDimensions, unequalPages, equalPages);
            // const recapturedDimensions = await recaptureDimensions(unequalPages);
            console.log("Recapture dimensions completed");
            capturedDimensions = recapturedDimensions;
            console.log({capturedDimensions});

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
            setLoaded(true);
          } else {
            hasMatchingDimensions = false;
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
            setLoaded(true);
          }
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
          setLoaded(true);
        }
        console.log({finalDimensions});
        // setLoaded(true);
      }
    };

    if (
      props.location.frompath === "/signerInfo" ||
      props.location.frompath === "/multiPplSignPreview"
    ) {
      // console.log(props.location.state.details.files);
      setFile(props.location.state.details.files);
      setCanvas_width(props.location.state.details.width);
      setCanvas_height(props.location.state.details.height);
      setEndDate(props.location.state.details.endDate);
      setStartDate(props.location.state.details.startDate);
      setEnableSignOrder(props.location.state.details.enableSignOrder);
      setNoSigns(props.location.state.details.noSigns);
      setSignersInfo(props.location.state.details.signersInfo);
      setInputs(props.location.state.details.Inputs);
      setLoaded(false);
      setCustomDocName(props.location.state.details.custDocName);
      setSenderComments(props.location.state.details.senderComments);
    } else {
      props.history.push("/");
    }
    var ownerloginname = sessionStorage.getItem("username");
    sessionStorage.setItem("ownerlogin", ownerloginname);
    const intervalId = setInterval(checkForElement, 100);
    return () => clearInterval(intervalId);
  }, []);

  const recaptureDimensions = async (capturedDimensions, unequalPages, equalPages) => {
    console.log("recaptureDimensions");
    const recapturedDimensions = [];

    const unequalPagesToRecapture = unequalPages.filter(unequalPageNumber => {
        const unequalPage = capturedDimensions.find(page => page.pageNumber === `Page ${unequalPageNumber}`);
        const unequalPageHeight = unequalPage?.clientHeight;

        return equalPages.some(eqPage => {
            const equalPage = capturedDimensions.find(page => page.pageNumber === `Page ${eqPage}`);
            return equalPage && equalPage.clientHeight === unequalPageHeight;
        });
    });

    for (let i = 0; i < unequalPagesToRecapture.length; i++) {
        const pageNum = unequalPagesToRecapture[i];
        console.log(pageNum);
        jumpToPage(pageNum - 1);
        await new Promise(resolve => setTimeout(resolve, 500));
        const pageElement = document.getElementById(`docuPageTest${pageNum}`);
        console.log(pageElement);
        if (pageElement) {
            const pageNumberValue = pageElement.getAttribute('aria-label'); 
            const newDimensions = {
                pageNumber: pageNumberValue,
                clientWidth: pageElement.clientWidth,
                clientHeight: pageElement.clientHeight
            };
            console.log(newDimensions);
            // Assign values to recapturedDimensions array
            recapturedDimensions.push(newDimensions);
        }
    }

    // Remove recaptured pages from capturedDimensions
    const filteredDimensions = capturedDimensions.filter(
      dim => !recapturedDimensions.some(recDim => recDim.pageNumber === dim.pageNumber)
    );

    // Merge capturedDimensions and recapturedDimensions
    const updatedDimensions = [...filteredDimensions, ...recapturedDimensions];

    return updatedDimensions;
  };


  // const recaptureDimensions = async (unequalPages) => {
  //   console.log("recaptureDimensions");
  //   const recapturedDimensions = [];
  //   console.log(unequalPages.length);
  //   for (let i = 0; i < unequalPages.length; i++) {
  //       const pageNum = unequalPages[i];
  //       console.log(pageNum);
  //       jumpToPage(pageNum - 1);
  //       await new Promise(resolve => setTimeout(resolve, 500));
  //       const pageElement = document.getElementById(`docuPageTest${pageNum}`);
  //       console.log(pageElement);
  //       if (pageElement) {
  //           const pageNumberValue = pageElement.getAttribute('aria-label'); 
  //           const newDimensions = {
  //               pageNumber: pageNumberValue,
  //               clientWidth: pageElement.clientWidth,
  //               clientHeight: pageElement.clientHeight
  //           };
  //           console.log(newDimensions);
  //           // Assign values to recapturedDimensions array
  //           recapturedDimensions.push(newDimensions);
  //       }
  //   }
  //   setFinalClientDimensions([...recapturedDimensions]);
  //   setLoaded(true);
  //   return Promise.resolve();  // Return a resolved promise
  // };

  useEffect(() => {
    var data = props.location.state.details;
    // setFileUrl(data.files.preview);
    let noOfSigners = data.noSigns;
    for (let i = 0; i < noOfSigners; i++) {
      setSignerValue([...signerValue, "signer" + (i + 1)]);
    }
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // setWidth("335");
      // document.getElementById("modal-container").style.width="335px";
      if (window.innerWidth < 450) {
        document.getElementById("parent-div").style.width =
          window.innerWidth - 50 + "px";
           // document.getElementById("parent-div").style.paddingRight="5px";
      }
    }
    setMobileWidth(document.getElementById("decorate").offsetWidth);
    setMobileHeight(document.getElementById("decorate").offsetHeight);

    //for mobile, positions are recaluculated
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      const element = (document.getElementById("parent-div").style.width =
        "350px");
    }

    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // console.log("Mobile");
      // setOverflow("hidden");
      setOverflow("visible");
      document.getElementById("decorate").style.width = "";
      document.getElementById("decorate").style.height = "";
      document.getElementById("outer-most-div").style.margin = "2rem -1rem";
      document.getElementById("outer-most-div").style.width = "21rem";
      // document.getElementById("outer-most-div").style.height = "-21rem";
      document.getElementById("viewModal").style.marginLeft = "5%";
      document.getElementById("viewModal").style.height = "45px";
      document.getElementById("decorate").style.backgroundColor = "";
      document.getElementById("hideThumbnailForMobile").style.display = "none";
      document.getElementById("parent-div").style.height = "30rem";
      document.getElementById("decorate").style.height = "520px";
    } else {
      // console.log("Desktop");
    }

    if (btnCount == data.noSigns) {
      $("#submitBtn").removeAttr("hidden");
      $("#nextBtn").attr("hidden", "hidden");
    }

    if (canvas_width > canvas_height) {
      setPreviewHeight(350);
      document.getElementById("docuPageTest1").style.height = "350px";
      document.getElementById("docuPageTest1").style.width = "550px";
      document.getElementById("decorate").style.height = "350px";
      document.getElementById("decorate").style.width = "550px";
    }

    setLoaded(true);
    var is_KYC_Verified = sessionStorage.getItem("is_KYC_verified");
    if (is_KYC_Verified != 1) {
      document.getElementById("aadhaarModeRadio").disabled = true;
      document.getElementById("aadhaarModeRadio").title =
        "Requires KYC verification";
      document.getElementById("aadhaarEsign").title =
        "Requires KYC verification";
      document.getElementById("aadhaarEsign").style.color = "gray";
    }
  }, []);

  //---------Everytime page loads this is getting called and based on array values it returns Draggable div-----
  useEffect(() => {
    // console.log(dragArray);

    if (dragArray) {
      dragArray.map((value, index) => {
        var count1 = value.signersBatch.slice("signer".length);
        // var count1 = value.count;
        // console.log(count1);
        var dragId = value.dragId;
        var current_page = value.pageNo;
        var dragContainer = "#docuPageTest" + current_page;
        var isDragIdExists = document.getElementById(dragId);

        if (isDragIdExists === null) {
          // console.log(count1);
          // console.log(count2);
          //Returned drag div will get append to dragContainer----
          $(dragContainer).append(function () {
            return (
              '<div id="drag-item"><div id = "' +
              dragId +
              '" class = "drag" data-dragpage="' +
              current_page +
              '">' +
              (Number(count1)) +
              ". " +
              clientInfo[Number(count1)-1].signerName +
              '<img class="close" src=' +
              closeDragDiv +
              ' alt=""></div></div>'
            );
          });
        }

        const contentElements = document.getElementsByClassName("drag");

        // Iterate over all content elements
        for (let i = 0; i < contentElements.length; i++) {
          const contentElement = contentElements[i];
          const text = contentElement.innerText;
          const textLength = text.length;

          // Calculate the desired font size based on text length
          const fontSize = Math.max(10 - textLength * 0.1, 8);

          // Set the font size
          contentElement.style.fontSize = `${fontSize}px`;
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

  }, [currentPage, dragArray]);
  
  useEffect(() => {
    freezePrevSignerSeals();
  }, [currentPage, prevSignersDragArray]);

  //-------Onclick, this function will prepare Array of objects(dragArray)-----
  const addSignatureStamp = () => {
    const randomColor = `rgba(${Math.floor(Math.random() * 255)},${Math.floor(
      Math.random() * 255
    )},${Math.floor(Math.random() * 255)},${0.5})`;
    var dragId;
    dragId = "draggable" + count;
    setCount(count + 1);

    let defaultDragWidthValue = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? defaultDragWidthMob : defaultDragWidth;
    let defaultDragHeightValue = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? defaultDragHeightMob : defaultDragHeight;

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
      signersBatch: "signer" + signerBatchNum,
    };
    //Storing the prepared draggable div object into the dragArray-----
    setDragArray([...dragArray, item]);
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

  const freezePrevSignerSeals = () => {
    console.log({prevSignersDragArray});
    if (prevSignersDragArray) {
      for (let i = 0; i < prevSignersDragArray.length; i++) {
          let dragObj = prevSignersDragArray[i];
          let dragId = dragObj.dragId;
          let dragPageNo = dragObj.pageNo;
  
          // Check if the drag is on the current page or next/previous page
          if (
              dragPageNo === currentPage ||
              dragPageNo === currentPage - 1 ||
              dragPageNo === currentPage + 1
          ) {
              $("#" + dragId).draggable({ disabled: true });
              $("#" + dragId).css("cursor", "default");

              // Hide associated elements
              let closeSelector = "#" + dragId + " .close";
              let resizableSelector = "#" + dragId + " .ui-resizable-handle";
              $(closeSelector).hide();
              $(resizableSelector).hide();
          }
      }
  }
  }

  // useEffect to update containmentPage when it changes
  useEffect(() => {
    // to set updated containmentPage state to set containment in draggable
    $(".drag")
      .draggable({
        containment: "#testInner-" + (containmentPage - 1),
      })
      .resizable({
        containment: "#testInner-" + (containmentPage - 1),
      });
  }, [containmentPage]); // This useEffect will re-run whenever containmentPage changes

  //----------For draggable of marker, setting containment and getting position of markers and resized values-----
  $(document).ready(function (event) {
  //-------For getting the id of draggable div which needs to be dragged on performing onmouseover--------
  if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  window.onmouseover = (e) => {
    if (window.location.pathname === '/multiPplSignPreview') {
      if (e.target.id.includes("draggable")) {
        //Initializing the state variable containmentPage and this variable will be assigned to draggable as containment----
        setContainmentPage($("#" + e.target.id).data("dragpage"));
      }
    }
  };
  } else if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  if (window.location.pathname === "/multiPplSignPreview") {
    window.ontouchstart = (e) => {
        if (e.target.id.includes("draggable")) {
          // console.log("Before: "+containmentPage);
          setContainmentPage($("#" + e.target.id).data("dragpage"));
          // console.log("After: "+containmentPage);
        }
    };

    window.ontouchmove = (e) => {
        if (e.target.id.includes("draggable")) {
          // console.log("Before: "+containmentPage);
          setContainmentPage($("#" + e.target.id).data("dragpage"));
          // console.log("After: "+containmentPage);
        }
    };
  }
  }
    var dragDiv;
    $(".drag")
        .draggable({
          //Setting containment based on dragpage value returned along with draggable div-----
          containment: "#testInner-" + (containmentPage - 1),

          //Provides us with updated x and y positions----------
          drag: function (event, ui) {
            var xPos;
            var yPos;
            for (
              let index = 0;
              index < sessionStorage.getItem("TotalPages");
              index++
            ) {
              //Getting particular draggable div------
              dragDiv = ui.helper[0];
              //Getting drag div's x and y positions---------
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
            // console.log(batch);

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
            // console.log(countVal);

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
          containment: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? "" : "#testInner-" + (containmentPage - 1),

          minHeight: window.innerWidth >= 768 ? 54 : 42,
          minWidth: window.innerWidth >= 768 ? 76 : 64,
          maxHeight: window.innerWidth >= 768 ? 92 : 68,
          maxWidth: window.innerWidth >= 768 ? 168 : 125,

          resize: function (event, ui) {
            // console.log(event.target.id);
            var dragDivHeight;
            var dragDivWidth;
            // console.log(sessionStorage.getItem("TotalPages"));
            for (
              let index = 0;
              index < sessionStorage.getItem("TotalPages");
              index++
            ) {
              // console.log(index);
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
        // console.log(batch);

        let countVal = 0;
        for (let i = 0; i < dragArray.length; i++) {
          if ("selectedPBatch" in dragArray[i]) {
          if (dragArray[i].selectedPBatch == batch[0].selectedPBatch) {
            // console.log(dragArray[i].selectedPBatch == batch[0].selectedPBatch);
            countVal++;
          }
        }
        else if ("selectedABatch" in dragArray[i]) {
          if (dragArray[i].selectedABatch == batch[0].selectedABatch) {
            // console.log(dragArray[i].selectedPBatch == batch[0].selectedPBatch);
            countVal++;
          }
        }
        }
        // console.log(countVal);

        if (sessionStorage.getItem("TotalPages") != 1 && dragArray.length > 1) {
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
                message:
                  `Do you want to resize this seal on all ${countVal} pages?`,
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
      }
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

    // var count8=1;
    // $("img.close").unbind().click(function (e) {
    $("img.close")
      .off()
      .on("click", function (e) {
        // count8 = count8++;
        // console.log(count8);
        var parent = showIt(this);
        //console.log(dragArray);

        //For removal of draggable from array------
        let closedDivId = parent.id;
        if (dragArray) {
          // const mappedDragArray = dragArray.map(x => x.dragId);
          // if (mappedDragArray.includes(closedDivId)) {
          var filterdDragArray = dragArray.filter(
            (item) => item.dragId !== closedDivId
          );
          // console.log(filterdDragArray)
          $("#" + closedDivId).remove();
          setDragArray(filterdDragArray);
          //For removal of draggable from UI---------
          // console.log(closedDivId);
          $("#" + closedDivId).remove();
          toast.error("Seal removed from current page");
          // setExclusionDragIds(closedDivId);
          setExclusionDragIds(exclusionDragIds => [...exclusionDragIds, closedDivId]);
          return;
          // }
        }
      });
  });

  useEffect(() => {
    // console.log("Updated exclusionDragIds:", exclusionDragIds);
  }, [exclusionDragIds]);
  useEffect(() => {
    // console.log("Updated customPositionedDragIds:", customPositionedDragIds);
  }, [customPositionedDragIds]);
  useEffect(() => {
    // console.log("Updated customResizedDragIds:", customResizedDragIds);
  }, [customResizedDragIds]);

  //Asking users whether the draggables of All pages and Custom pages to be set to default positions or custom positions
  const confirmationForPosition = (batchValue) => {
    // console.log({batchValue});
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
        // console.log(batchArray[i].pageNo);
        dragIdsToBeAdded.push(batchArray[i].dragId);
        // setCustomPositionedDragIds([...customPositionedDragIds, batchArray[i].dragId]);
      } else {
        // console.log(batchArray[i].dragId);
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
  const { GoToNextPageButton, GoToPreviousPage } =
    pageNavigationPluginInstance;
  const { jumpToPage } = pageNavigationPluginInstance;

  //For displaying of custom range field
  const rangeInput = (e) => {
    setTooltipOpen(false);
    setSubmitted(false);
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
        array.splice(i, 1);
      }
    }
  };

  //Providing the validations for custom field
  const setRangeValue = (e) => {
    let input = e.target.value;

    let regExp = new RegExp(/^[ 0-9, ]*$/);
    if (regExp.test(input)) {
      var stringInputs = e.target.value.split(",").map(Number);
      if (stringInputs && stringInputs[0] != 0 && stringInputs[0] != currentPage) {/////
        jumpToPage(stringInputs[0] - 1);//
      }//
      for (var page of stringInputs) {
        if (page > Number(sessionStorage.getItem("TotalPages"))) {
          return;
        }
      }

      setRange(e.target.value);
      removeItems(stringInputs, [0, NaN]);
      setRangeArray([...new Set(stringInputs)]);
    }
  };

  //For removing all the seals which are added
  const removeAllPageSeals = (e) => {
    // console.log(selectedOption);
    let signerList = currentSignersList();
    // console.log(signerList);
    // console.log(dragArray);
    if (signerList?.length > 0) {
      let msg;
      if (signerList.length == 1) {
        msg =
          "Do you want to remove " + signerList.length + " seal permanently of this signers?";
      } else {
        msg =
          "Do you want to remove " + signerList.length + " seals permanently of this signers?";
      }
      // console.log(selectedOptionArray);
      // console.log(selectedOption);
      // setSelectedOptionArray([]);
      confirmAlert({
        title: "Confirm remove",
        message: msg,
        buttons: [
          {
            label: "Confirm",
            className: "confirmBtn",
            onClick: () => {
              let tempSelectedOptionArray = selectedOptionArray;
                for (let i = 0; i < signerList.length; i++) {
                  tempSelectedOptionArray.pop();
                  let closedDivId = signerList[i].dragId;
                  $("#" + closedDivId).remove();
                  const indexToRemove = dragArray.indexOf(signerList[i]);
                  if (indexToRemove !== -1) {
                    dragArray.splice(indexToRemove, 1);
                  }
                }
                toast.error((dragArray.length > 1) ? "Removed all seals for current signer" : "Removed a seal for current signer");
                // $(".drag").remove();
                setDragArray(dragArray);
                setSelectedOption(null);
              // console.log(tempSelectedOptionArray);
              setSelectedOptionArray(tempSelectedOptionArray);
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
        message: "There are no seals added for this signer to remove.",
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
    // console.log(selectedOptionArray);
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

    let defaultDragWidthValue = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? defaultDragWidthMob : defaultDragWidth;
    let defaultDragHeightValue = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? defaultDragHeightMob : defaultDragHeight;

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
          color: randomColor,
          selectedABatch: "A" + allPageBatch,
          signersBatch: "signer" + signerBatchNum,
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
      if (currentPage !== 1) {
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
        signersBatch: "signer" + signerBatchNum,
        color: randomColor,
      };
      setDragArray([...dragArray, item]);
      firstPage.checked = false;
      toast.info("Seal added to first page");
    } else if (lastPage.checked === true) {
      //When selected page is L
      setSelectedOptionArray([...selectedOptionArray, "L"]);
      jumpToPage(totalNumberOfPages - 1);
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
        signersBatch: "signer" + signerBatchNum,
        color: randomColor,
      };
      setDragArray([...dragArray, item]);
      lastPage.checked = false;
      toast.info("Seal added to last page");
    } else if (customPage.checked === true) {
      if (document.getElementById("range-fieldIdAdd").value != "") {
        if (rangeArray.length != 0) {
        setSelectedOptionArray([...selectedOptionArray, "P"]);
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
              signersBatch: "signer" + signerBatchNum,
              color: randomColor,
              selectedPBatch: "P" + customPageBatch,
            };
            customPageArray.push(item);
          }
          setDragArray([...dragArray, ...customPageArray]);
          setCount(count + rangeArray.length);
          setCustomPageBatch(customPageBatch + 1);
        }
        // $("signaturePage").click(function(){
        //   $("range-fieldIdAdd").val("");
        // });
        customPage.checked = false;
        toast.info("Seals added to custom pages");
        document.getElementById("range-fieldIdAdd").className = "range-field";
        setRange("");
      } else {
        alert("Please enter a valid page no.");
      }
      } else {
        alert("Please enter the custom page no.");
        // document.getElementById("range-fieldIdAdd").className = "showField";
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

  //To fetch the required units for aadhar signing
  const getRequiredUnits = (selectedPagevalue, selectedModeValue) => {
    // console.log(selectedPagevalue);
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
              var fnlunits = finalunits;
              if (finalunits.includes(",")) {
                var units = sessionStorage.getItem("units").split(" ", 1);
                var units1 = units[0].split(",");
                setFinalunits(units1[0] + units1[1] + "");
                fnlunits = units1[0] + units1[1] + "";
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
                sessionStorage.setItem("paymentType", "ESM");
              } else {
                setIsInsufficientUnits(false);
                $("#topUpBtn").attr("hidden", "hidden");
              }
              setLoaded(true);
              setReqUnits(integer1);
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
            // alert(responseJson.statusDetails)
            setLoaded(true);
          }
        });
    } else {
      confirmAlert({
        message: "Please select the page!!!",
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

  const onRenderAnnotations = (e) => {
    // console.log("InsideCustomPlugin")
      // console.log(e);
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
    const showThumbnail = !(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    const plugins = showThumbnail ? [thumbnailPluginInstance, pageNavigationPluginInstance, customPlugin] : [pageNavigationPluginInstance, customPlugin];
    return (
      // <div className="decorate" id="decorate">
      // <div>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js">
        <div
          id="outer-most-div"
          style={{
            margin: "1rem auto",
            width: "64rem",
          }}
        >
          {/* {loaded ? (
                <Loader
                  loaded={!loaded}
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
              ) : */}
          {/* ( */}
          <div
            style={{
              // border: "1px solid rgba(0, 0, 0, 0.1)",
              display: "flex",
              marginTop: "-16px",
            }}
          >
            <div
            id="hideThumbnailForMobile"
              style={{
                borderRight: "1px solid rgba(0, 0, 0, 0.1)",
                width: "12%",
                height: "620px",
              }}
            >
              <Thumbnails
                renderThumbnailItem={renderThumbnailItem}
                // plugins={[
                //   thumbnailPlugin({
                //     onLoadCompleted: () => setLoaded(false),
                //   }),
                // ]}
              />
            </div>
            <div className="parent-div" id="parent-div">
              <Viewer
                fileUrl={fileUrl}
                renderLoader={() => null}
                plugins={plugins}
                // defaultScale={SpecialZoomLevel.PageFit}
                defaultScale={SpecialZoomLevel.PageWidth}
                // defaultScale={.65}
                onPageChange={handlePageChange}
                // onDocumentLoad={checkForElement}
                // onDocumentLoad={handleDocumentLoad}
                // onDocumentLoad={() => setLoaded(false)}
              />
            </div>
          </div>
          {/* )} */}
        </div>
      </Worker>
      // </div>
    );
  };

  //For hiding sidebar toggler when viewing document using modal
  const hideSidebarToggler = () => {
    setTooltipOpenModal(false);
    setIsHovered(false);
    document.getElementsByClassName("d-lg-none navbar-toggler")[0].style.display = "";
    document.getElementsByClassName("d-md-down-none navbar-toggler")[0].style.display = "";
    setShown(false);
  }

  const toQRcode = () => {
    setOpenSecondModal(true);
  };

  //For displaying tooltip message on hover of Add seals Badge
  const getTooltipMessage = () => {
    return "Add to current page";
  };
  const getTooltipMessageForFullScreen = () => {
    return "Full preview";
  };

  const handleBadgeMouseEnter = (event) => {
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      if ((!selectedOption && submitted) || (selectedOption && submitted)  && event.target.id === "signaturePage") {
        setTooltipOpen(true);
      } else if (selectedOption && !submitted  && event.target.id === "signaturePage") {
        setTooltipOpen(false);
      } else if (event.target.id === "viewModal") {
        setTooltipOpenModal(true);
        setIsHovered(true);
      }
    }
  };

  const handleBadgeMouseLeave = (event) => {
    if (event.target.id === "signaturePage") {
      setTooltipOpen(false);
    } else if (event.target.id === "viewModal") {
      setTooltipOpenModal(false);
      setIsHovered(false);
    }
  };

  const currentSignersList = () => {
    // setSignerBatchNum(signerBatchNum + 1);

    const signersBatchFilter = "signer" + signerBatchNum; // Specify the signersBatch value you want to filter by
    // console.log(signersBatchFilter);
    // console.log(dragArray);
    const filteredElements = dragArray.filter(element => element.signersBatch === signersBatchFilter);
    // console.log(filteredElements);
    return filteredElements;
  }

  const preparingSignerInfo = () => {
    setSignerNameEmail(
      "" +
        clientInfo[count2].signerName +
        "(" +
        clientInfo[count2].signerEmail +
        ")"
    );
    setSignerBatchNum(signerBatchNum + 1);

    let totalNumberOfPages = sessionStorage.getItem("TotalPages");
    let pageListArr = [];
    let customPositionedDragArray2 = [];
    let defaultPositionedDragArray2 = [];
    // let clientInfo = props.location.state.details.signerInfo;
    let fromDate = props.location.state.details.startDate;
    let lastDate = props.location.state.details.endDate;
    let width = canvas_width;
    let height = canvas_height;
    // console.log({finalClientDimensions});
    let width_Ratio;
    let height_Ratio;
    let width_ratio_arr = [];
    let height_ratio_arr = [];

    let data2 = props?.location?.state?.details;
    if (data2.equalPageDimensions) {
      for (let i = 0; i < finalClientDimensions.length; i++) {
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          width_ratio_arr.push(width / (finalClientDimensions[i].clientWidth - 20));//18
          height_ratio_arr.push(height / (finalClientDimensions[i].clientHeight - 9));//11.5
        } else {
          width_ratio_arr.push(width / (finalClientDimensions[i].clientWidth - 20));//14
          height_ratio_arr.push(height / (finalClientDimensions[i].clientHeight - 6));//11.5
        }
      }
    } else {
      for (let i = 0; i < pageDimensions.length; i++) {
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          width_ratio_arr.push(pageDimensions[i].width / (finalClientDimensions[i].clientWidth - 20));//18
          height_ratio_arr.push(pageDimensions[i].height / (finalClientDimensions[i].clientHeight - 9));//11.5
        } else {
          width_ratio_arr.push(pageDimensions[i].width / (finalClientDimensions[i].clientWidth - 20));//14
          height_ratio_arr.push(pageDimensions[i].height / (finalClientDimensions[i].clientHeight - 6));//11.5
        }
      }
    }
      // if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      //   width_Ratio =
      //     width /
      //     (document.getElementById("docuPageTest" + currentPage).clientWidth -
      //       20);//18
      //   height_Ratio =
      //     height /
      //     (document.getElementById("docuPageTest" + currentPage).clientHeight -
      //       9);//11.5
      // } else {
      //   width_Ratio =
      //     width /
      //     (document.getElementById("docuPageTest" + currentPage).clientWidth - 20);//14
      //   height_Ratio =
      //     height /
      //     (document.getElementById("docuPageTest" + currentPage).clientHeight -
      //       6);//11.5
      // }
    console.log({width_ratio_arr});
    console.log({height_ratio_arr});

    let actuall_x = [];
    let actuall_y = [];
    let actuall_width = [];
    let actuall_height = [];
    let actuall_x1 = [];
    let actuall_y1 = [];
    let actuall_width1 = [];
    let actuall_height1 = [];
    // const signersBatchFilter = "signer" + signerBatchNum; // Specify the signersBatch value you want to filter by
    // console.log(signersBatchFilter);
    // const filteredElements = dragArray.filter(element => element.signersBatch === signersBatchFilter);
    const filteredElements = currentSignersList();
    console.log({customPositionedDragIds});
    //-----Creating an Array of pageNo's which is customPositioned
    for (let j = 0; j < customPositionedDragIds.length; j++) {
      for (let i = 0; i < filteredElements.length; i++) {
        if (filteredElements[i].dragId == customPositionedDragIds[j]) {
          pageListArr.push(filteredElements[i].pageNo);
        }
      }
    }
    // console.log(pageListArr);

    console.log({exclusionDragIds});
    //------Creating an Array of PageNo's where the drag divs are removed
    for (let j = 0; j < exclusionDragIds.length; j++) {
      for (let i = 0; i < filteredElements.length; i++) {
        if (filteredElements[i].dragId != exclusionDragIds[j]) {
          pageListArr.push(filteredElements[i].pageNo);
        }
      }
    }
    // console.log({pageListArr});

    //------Creating an Array of pageNo's where selectedOptions are F/L/C
    for (let i = 0; i < filteredElements.length; i++) {
      if (selectedOptionArray.includes("F")) {
        if (filteredElements[i].pageNo == 1) {
          pageListArr.push(filteredElements[i].pageNo);
        }
      }
      if (selectedOptionArray.includes("L")) {
        if (filteredElements[i].pageNo == totalNumberOfPages) {
          pageListArr.push(filteredElements[i].pageNo);
        }
      }
      if (selectedOptionArray.includes("C")) {
        for (let j = 0; j < currentPageNo.length; j++) {
          for (let i = 0; i < filteredElements.length; i++) {
            if (filteredElements[i].pageNo == currentPageNo[j]) {
              pageListArr.push(filteredElements[i].pageNo);
            }
          }
        }
      }
    }

    //Creating an Array of PageNo's where selectedOptionArray is either A or P
    if (
      selectedOptionArray.includes("A") &&
      selectedOptionArray.includes("P")
    ) {
      for (let i = 0; i < rangeArray.length; i++) {
        pageListArr.push(rangeArray[i]);
      }
      // console.log(pageListArr);
    }
    pageListArr = pageListArr.filter(function (item, pos, self) {
      return self.indexOf(item) == pos;
    });
    // console.log(pageListArr);

    //-----Preparing the defaultPositionedDragArray2 based on the outcome of pageListArr for default positioned dragabble's
    for (let i = 0; i < filteredElements.length; i++) {
      if (!pageListArr.includes(filteredElements[i].pageNo)) {
        defaultPositionedDragArray2.push(filteredElements[i]);
      }
    }
    // console.log(defaultPositionedDragArray2);

    const toRemove = new Set(defaultPositionedDragArray2);
    customPositionedDragArray2 = filteredElements.filter((x) => !toRemove.has(x));

    if (selectedOptionArray.includes("A") && exclusionDragIds.length == 0) {
      // console.log(defaultPositionedDragArray2);
      //Calculating defaultPositioned Drag's x and y values
      for (let i = 0; i < defaultPositionedDragArray2.length; i++) {
        if (
          defaultPositionedDragArray2[i].left != "0px" &&
          sessionStorage.getItem("TotalPages") != 1
        ) {
          actuall_x.push(
            parseInt(
              Math.round((Number(defaultPositionedDragArray2[i].left.slice(0, -2)) +
                5) *
                width_ratio_arr[0]),
              10
            )
          );
        } else {
          actuall_x.push(
            parseInt(
              Math.round(Number(defaultPositionedDragArray2[i].left.slice(0, -2)) *
              width_ratio_arr[0]), 
                10
            )
          );
        }
        actuall_y.push(
          parseInt(
            Math.round(Number(defaultPositionedDragArray2[i].top.slice(0, -2)) *
            height_ratio_arr[defaultPositionedDragArray2[i].pageNo - 1]), 
              10
          )
        );

        actuall_width.push(parseInt(
          Math.round(Number(defaultPositionedDragArray2[i].resizeDragWidth.slice(0, -2)) * width_ratio_arr[0]), 10
        ));
        actuall_height.push(parseInt(
          Math.round(Number(defaultPositionedDragArray2[i].resizeDragHeight.slice(0, -2)) * height_ratio_arr[defaultPositionedDragArray2[i].pageNo - 1]), 10
        ));
      }
      // console.log({actuall_x});
      // console.log({actuall_y});
      // console.log(actuall_width);
      // console.log(actuall_height);

      //Calculating customPositioned Drag's x and y values
      for (let i = 0; i < customPositionedDragArray2.length; i++) {
        if (
          customPositionedDragArray2[i].left != "0px" &&
          sessionStorage.getItem("TotalPages") != 1
        ) {
          actuall_x1.push(
            parseInt(
              Math.round((Number(customPositionedDragArray2[i].left.slice(0, -2)) +
                5) *
                width_ratio_arr[0]),
              10
            )
          );
        } else {
          actuall_x1.push(
            parseInt(
              Math.round(Number(customPositionedDragArray2[i].left.slice(0, -2)) *
              width_ratio_arr[0]), 10
            )
          );
        }
        actuall_y1.push(
          parseInt(
            Math.round(Number(customPositionedDragArray2[i].top.slice(0, -2)) *
            height_ratio_arr[customPositionedDragArray2[i].pageNo - 1]), 10
          )
        );

        actuall_width1.push(parseInt(
          Math.round(Number(customPositionedDragArray2[i].resizeDragWidth.slice(0, -2)) * width_ratio_arr[0]), 10
        ));
        actuall_height1.push(parseInt(
          Math.round(Number(customPositionedDragArray2[i].resizeDragHeight.slice(0, -2)) * width_ratio_arr[0]), 10
        ));
      }
    } else {
      for (let i = 0; i < filteredElements.length; i++) {
        if (
          filteredElements[i].left != "0px" &&
          sessionStorage.getItem("TotalPages") != 1
        ) {
          actuall_x.push(
            parseInt(Math.round((Number(filteredElements[i].left.slice(0, -2))) * width_ratio_arr[0]), 10)
          );
        } else {
          actuall_x.push(
            parseInt(Math.round(Number(filteredElements[i].left.slice(0, -2)) * width_ratio_arr[0]), 10)
          );
        }
        actuall_y.push(
          parseInt(Math.round(Number(filteredElements[i].top.slice(0, -2)) * height_ratio_arr[filteredElements[i].pageNo - 1]), 10)
        );
        actuall_width.push(parseInt(Math.round(Number(filteredElements[i].resizeDragWidth.slice(0, -2)) * width_ratio_arr[0]), 10));
        actuall_height.push(parseInt(Math.round(Number(filteredElements[i].resizeDragHeight.slice(0, -2)) * height_ratio_arr[filteredElements[i].pageNo - 1]), 10));
      }
    }
    // console.log({actuall_x});
    // console.log({actuall_y});
    // console.log({actuall_x1});
    // console.log({actuall_y1});

    let signPg = "";
    let pgList = [];
    let tempSignCoordinateArray1 = [];
    let tempSignCoordinateArray2 = [];
    let signCoordinatesArray = [];
    let pageListArray = [];
    let pageListArray1 = [];
    // console.log(selectedOptionArray);

    filteredElements.forEach(function (dragArr) {
      pageListArray.push(dragArr.pageNo);
    });
    pageListArray = [...new Set(pageListArray)];
    let commonSignCoordinate = {
      totHeight: "" + height,
      totWidth: "" + width,
      signature: "1",
    };

    if (selectedOptionArray.includes("A") && exclusionDragIds.length == 0) {
      signPg = "" + "A";
      for (let j = 0; j < allPageBatch - 1; j++) {
        for (let i = 0; i < defaultPositionedDragArray2.length; i++) {
          if (defaultPositionedDragArray2[i].selectedABatch == "A" + (j + 1)) {
            tempSignCoordinateArray2.push({
              ...commonSignCoordinate,
              x: "" + actuall_x[i],
              y: "" + actuall_y[i],
              width: "" + actuall_width[i],
              height: "" + actuall_height[i],
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
            tempSignCoordinateArray1.push({
              ...commonSignCoordinate,
              x: "" + actuall_x1[j],
              y: "" + actuall_y1[j],
              width: "" + actuall_width1[j],
              height: "" + actuall_height1[j],
            });
          }
        }
        // console.log(tempSignCoordinateArray1);
        signCoordinatesArray.push({
          page: "" + pageListArr[i],
          signCoordinatesValues: tempSignCoordinateArray1,
        });
        tempSignCoordinateArray1 = [];
        // console.log(signCoordinatesArray);
      }
      // console.log(tempSignCoordinateArray1);
    } else if (
      (selectedOptionArray.includes("P") ||
      selectedOptionArray.includes("F") ||
      selectedOptionArray.includes("L") ||
      selectedOptionArray.includes("C")) && !selectedOptionArray.includes("A")
    ) {
      signPg = "" + "P";
      pgList = pageListArray.map(Number); //
      // console.log(pgList);
      // console.log(pageListArray);
      for (let i = 0; i < pageListArray.length; i++) {
        for (let j = 0; j < filteredElements.length; j++) {
          if (pageListArray[i] == filteredElements[j].pageNo) {
            tempSignCoordinateArray2.push({
              ...commonSignCoordinate,
              x: "" + actuall_x[j],
              y: "" + actuall_y[j],
              width: "" + actuall_width[j],
              height: "" + actuall_height[j],
            });
          }
        }
        // console.log(tempSignCoordinateArray2);
        tempSignCoordinateArray1.push(tempSignCoordinateArray2);
        tempSignCoordinateArray2 = [];
      }
      // console.log(pageListArray);
      pageListArray1 = pageListArray.map(String);
      for (let i = 0; i < pageListArray1.length; i++) {
        signCoordinatesArray.push({
          page: pageListArray1[i],
          signCoordinatesValues: tempSignCoordinateArray1[i],
        });
      }
    } else if (
      selectedOptionArray.includes("A") &&
      exclusionDragIds.length != 0
    ) {
      {
        signPg = "" + "P";
        pgList = pageListArray.map(Number); //
        for (let i = 0; i < pageListArray.length; i++) {
          for (let j = 0; j < filteredElements.length; j++) {
            if (pageListArray[i] == filteredElements[j].pageNo) {
              tempSignCoordinateArray2.push({
                ...commonSignCoordinate,
                x: "" + actuall_x[j],
                y: "" + actuall_y[j],
                width: "" + actuall_width[j],
                height: "" + actuall_height[j],
              });
            }
          }
          // console.log(tempSignCoordinateArray2);
          tempSignCoordinateArray1.push(tempSignCoordinateArray2);
          tempSignCoordinateArray2 = [];
        }
        // console.log(pageListArray);
        pageListArray1 = pageListArray.map(String);
        for (let i = 0; i < pageListArray1.length; i++) {
          signCoordinatesArray.push({
            page: pageListArray1[i],
            signCoordinatesValues: tempSignCoordinateArray1[i],
          });
        }
      }
    }
    
    let info = {
      signMode: selectedMode,
      startDate: fromDate,
      endDate: lastDate + " 23:59:59",
      signOrder: "" + clientInfo[count2].signOrder,
      signInfo: [
        {
          id: "1",
          handSignImg: "",
          displayMsg: "",
        },
      ],
      signerInfo: {
        signerName: clientInfo[count2].signerName,
        signerEmail: clientInfo[count2].signerEmail,
        signerMobile: clientInfo[count2].signerMobile,
      },
      signCoordinates: signCoordinatesArray,
      signPage: "" + signPg,
      pages: pgList,
    };

    let temp = signerInfoo;
    temp.push(info);
    setSignerInfoo(temp);
    setCount2(count2 + 1);
  };

  const nextPreview = () => {
    console.log(dragArray);
    setSelectedOptionArray([]);

    let firstPage = document.getElementById("firstPage");
    let lastPage = document.getElementById("lastPage");
    let allPage = document.getElementById("allPage");
    let crntPage = document.getElementById("append");
    let customPage = document.getElementById("customPage");

    firstPage.checked = false;
    lastPage.checked = false;
    allPage.checked = false;
    crntPage.checked = false;
    customPage.checked = false;
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
      setPrevSignersDragArray([...dragArray]);
      //On click on next signer, it will disable the previous signers assigned Drags from dragging.
      // let filteredDragArray = [...dragArray];
      // console.log({filteredDragArray});

        // for (let i = 0; i < filteredDragArray.length; i++) {
        //   $( filteredDragArray[i].dragId ).draggable({ disabled: true });
        //   $( filteredDragArray[i].dragId ).css("cursor", "default");
        //   $(".close").hide();
        //   $(".ui-resizable-handle").hide();
        // }
        freezePrevSignerSeals();


    let flag = false;
    for (let j = 0; j < dragArray.length; j++) {
      if ("signer" + btnCount == dragArray[j].signersBatch) {
        flag = true;
        break;
      } else {
        flag = false;
      }
    }
    // console.log("flag1", flag);
    if (flag) {
      // if ((btnCount + 1) == noOfSigns) {
      //   statusFlag = "1";
      // }
      preparingSignerInfo();
      let lastDate = props.location.state.details.endDate;
      let noOfSigns = props.location.state.details.noSigns;

      let InputsVal = {
        emailDetails: props.location.state.details.emailDetails,
        declineSigning:props.location.state.details.declineSigning,
        loginname: sessionStorage.getItem("username"),
        signPurpose: "", //length-50 (future use)
        docType: "PDF",
        authToken: sessionStorage.getItem("authToken"),
        externalJar: true,
        userIP: "10.10.10.111",
        enableSignOrder: props.location.state.details.enableSignOrder,
        startDate: props.location.state.details.startDate,
        endDate: lastDate + " 23:59:59",
        noSigns: "" + noOfSigns,
        signersInfo: signerInfoo,
        customDocName: customDocName,
        sc: "Y",
        senderComments: senderComments,
      };
      setBtnCount(btnCount + 1);
      setTotalUnits(totalUnits + reqUnits);

      //checking next signer is last signer or not
      // console.log(btnCount);
      // console.log(noOfSigns);
      if (btnCount + 1 == noOfSigns) {
        $("#submitBtn").removeAttr("hidden");
        $("#nextBtn").attr("hidden", "hidden");
      } else if (btnCount + 1 < noOfSigns) {
        multiPplSignUnitsCheck();
      }
      setDragArray1([]);
      setDragArray1(dragArray);
      // console.log(InputsVal);
      return InputsVal;
    } else {
      confirmAlert({
        message: "Please add the seal to the current signer and proceed.",
        buttons: [
          {
            label: "Ok",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
    }
    }
  };

  const multiPplSignUnitsCheck = () => {
    let isInsufficientUnitsVal = false;
    //checking for units
    // var balanceUnits = parseInt(sessionStorage.getItem("units"), 10);
    var balanceUnits = parseInt(finalunits, 10);
    var difference = totalUnits + reqUnits - balanceUnits;
    if (
      (difference > 0 && selectedMode != "2") ||
      (difference > 0 && selectedMode != "3")
    ) {
      isInsufficientUnitsVal = true;
      setIsInsufficientUnits(true);
      $("#topUpBtn").removeAttr("hidden");
      var requiredAmount = difference * 5;
      sessionStorage.setItem("amount", requiredAmount);
    }
    return isInsufficientUnitsVal;
  };

  const handleModeChange = (e) => {
    console.log(e.target.value);
    if (selectedOption) {
    setSelectedMode(e.target.value);
    setLoaded(true);
    if (
      sessionStorage.getItem("ud") == "false" ||
      sessionStorage.getItem("ud") == null
    ) {
      var data = props.location.state.details;
      // console.log(data);
      //for multi user external signer fixing coordinates
      if (!(data.hasOwnProperty("externalSigner") && data.externalSigner)) {
        getRequiredUnits(selectedOption, e.target.value);
      }
    } else {
      getRequiredUnits(selectedOption, e.target.value);
    }

    if (e.target.value === "2") {
      document.getElementById("handSignContainer").style.display = "";
      document.getElementById("clientdownload").style.display = "none";
      // document.getElementById("generateOtpMode").style.display = "none";
      document.getElementById("submitBtn").style.display = "";

      setTandcHeader("Electronic Sign");
      // if(units < 1){
      //   this.setState({ isInsufficientUnits: true })
      // }else{
      setIsInsufficientUnits(false);
      // }
    } else if (e.target.value === "1") {
      // this.getRequiredUnits(this.state.selectedOption, e.target.value);
      document.getElementById("handSignContainer").style.display = "none";
      document.getElementById("clientdownload").style.display = "none";
      document.getElementById("submitBtn").style.display = "";
      setTandcHeaderAs("Aadhaar eSign");
      // console.log("aadhar signing");
    } else if (e.target.value === "3") {
      document.getElementById("handSignContainer").style.display = "";
      document.getElementById("clientdownload").style.display = "";
      // document.getElementById("selfDscTokenModeRadio").style.marginTop =
      //       "20px";
      // document.getElementById("generateOtpMode").style.display = "none";
      document.getElementById("submitBtn").style.display = "";

      setTandcHeader("Self Token Sign");
      var units = parseInt(sessionStorage.getItem("units"), 10);
      // if(units < 1){
      //   this.setState({ isInsufficientUnits: true })
      // }else{
      setIsInsufficientUnits(false);
      // }
    } else if (e.target.value === "4") {
      document.getElementById("handSignContainer").style.display = "none";
      document.getElementById("clientdownload").style.display = "none";
      // document.getElementById("generateOtpMode").style.display = "";
      document.getElementById("submitBtn").style.display = "none";
      setTandcHeader("OTP Sign");
      setIsInsufficientUnits(false);
    }
  } else {
    confirmAlert({
      message: "Please select the page!!!",
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

  const modalBody = () => {
    $(".d-lg-none.navbar-toggler").css("display", "none");
    $(".d-md-down-none.navbar-toggler").css("display", "none");
    return (
    <div
            style={{
                backgroundColor: '#fff',
                flexDirection: 'column',
                overflow: 'hidden',
                left: 0,
                position: 'fixed',
                top: 0,
                height: '100%',
                width: '100%',
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
            {props.location.state.details.files.name}
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
              <div style={{ marginLeft: "10px",  fontSize: "14px" }}>
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
	      marginTop: "10px",
            }}
            onClick={hideSidebarToggler}
          >
            Back
          </button>
        </div>
            <div
                style={{
                  flexGrow: 1,
                  overflow: 'auto',
                  height: 'calc(100% - 80px)',
              }}
            >
                <Viewer fileUrl={fileUrl} 
                defaultScale={SpecialZoomLevel.PageWidth}
                plugins={[pageNavigationPluginInstance, customPlugin]}
                onPageChange={handlePageChange}
                />
            </div>
        </div>
  );
  };

  const submitJob = () => {
    let result = false;
    result = stampingPosition();
    if (result == true) {
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
    }

    let flag = false;
    for (let j = 0; j < dragArray.length; j++) {
      if ("signer" + btnCount == dragArray[j].signersBatch) {// To check whether atleast one seal is added for current signer
        setCount3(count3 + 1);
        flag = true;
        break;
      } else {
        flag = false;
      }
    }
    // console.log("flag2", flag);
    if (flag) {
      var isInsufficientUnitsValue = multiPplSignUnitsCheck();
      // console.log(isInsufficientUnitsValue);
      if (!isInsufficientUnitsValue) {
        confirmAlert({
          title: "Confirm signing request",
          message: (
            <div>
              <p>No. of Signers: {props.location.state.details.noSigns}</p>
              {selectedMode == "1" ? <p>Total Units Charged: {totalUnits + reqUnits}</p> : ""}
            </div>
          ),
          buttons: [
            {
              label: "Submit",
              className: "confirmBtn",
              onClick: () => {
                let value = nextPreview();
                // console.log(value);
                setLoaded(false);
                let data = new FormData();
                setCount2(count2 - 1);
                // console.log(file);
                data.append("file", file);
                data.append("inputDetails", JSON.stringify(value));
                fetch(URL.mpsCreateJobsV2, {
                  method: "POST",
                  headers: { enctype: "multipart/form-data" },
                  body: data,
                })
                  .then((r) => r.json(value))
                  .then((res) => {
                    // console.log(res);
                    if (res.status === "SUCCESS") {
                      setLoaded(true);
                      confirmAlert({
                        message: res.statusDetails,
                        buttons: [
                          {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => {},
                          },
                        ],
                      });
                      //alert(res.statusDetails)
                      props.history.push("/");
                    } else {
                      setLoaded(true);
                      confirmAlert({
                        message: res.statusDetails,
                        buttons: [
                          {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => {},
                          },
                        ],
                      });
                      //alert(res.statusDetails)
                      props.history.push("/");
                    }
                  });
              },
            },
            {
              label: "Cancel",
              className: "cancelBtn",
              onClick: () => {
                setLoaded(true);
                //props.history.push("/docUpload")
              },
            },
          ],
        });
      } else {
        setLoaded(true);
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
        // alert("Insufficient Balance!! Please Topup your account")
      }
    } else {
      confirmAlert({
        title: "",
        message: "Please add the seal to the current signer and proceed.",
        buttons: [
          {
            label: "Ok",
            className: "confirmBtn",
            onClick: () => {},
          },
        ],
      });
    }
  };

  const onCloseSecondModal = () => {
    setOpenSecondModal(false);
  };

  //-------------default seal position for external signer validation--------------
  const stampingPosition = () => {
    let actuall_x = [];
    let actuall_y = [];
    let height = canvas_height;
    let width = canvas_width;
    let width_Ratio;
    let height_Ratio;

    width_Ratio = width / document.getElementById("parent-div").clientWidth;
    height_Ratio = height / document.getElementById("parent-div").clientHeight;

    if (
      sessionStorage.getItem("txnrefNo") != null &&
      sessionStorage.getItem("ud") == "true"
    ) {
      for (let i = 0; i < dragArray.length; i++) {
        actuall_x.push(
          parseInt(Number(dragArray[i].left.slice(0, -2)) * width_Ratio, 10)
        );
        actuall_y.push(
          parseInt(Number(dragArray[i].top.slice(0, -2)) * height_Ratio, 10)
        );
      }
    } else {
      var data = props.location.state.details;
      // console.log(data);
      if (data.hasOwnProperty("externalSigner") && data.externalSigner) {
        actuall_x = 3;
        actuall_y = 4;
      } else {
        for (let i = 0; i < dragArray.length; i++) {
          actuall_x.push(
            parseInt(Math.round(Number(dragArray[i].left.slice(0, -2)) * width_Ratio), 10)
          );
          actuall_y.push(
            parseInt(Math.round(Number(dragArray[i].top.slice(0, -2)) * height_Ratio), 10)
          );
        }
        // console.log(actuall_x);
        // console.log(actuall_y);
      }
    }

    for (let i = 0; i < dragArray.length; i++) {
      if (actuall_x[i] == 0 && actuall_y[i] == 0) {
        // setStampPositionFlag(true);
        return true;
      } else {
        continue;
      }
    }
    return false;
  };

  return (
    <div>
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
      <div className="row">
      <div className="col-md-6">
      <h4>Document Title: &nbsp;{customDocName}</h4>
      {/* {(btnCount <= noSigns) && <h6>Current Signer({btnCount}): &nbsp;{clientInfo[btnCount-1].signerName}({clientInfo[btnCount-1].signerEmail})</h6>} */}
      {btnCount <= noSigns && (
        <h6>
          Current Signer({btnCount}): &nbsp;{clientInfo[count2].signerName}(
          {clientInfo[count2].signerEmail})
        </h6>
      )}
      </div>
      {/* <button
            style={{
              fontSize: '12px',
              width: '76px',
              marginTop: "15px",
              height: "32px",
              marginLeft: props.location.state.details.hasOwnProperty("externalSigner") && props.location.state.details.externalSigner ? "18rem" : "-1rem",
          }}
          type="button" 
          class="btn btn-primary"
                id="viewModal"
                onClick={() => setShown(true)}
              >
                Read PDF
              </button> */}
              <Button
            style={{
              fontSize: "12px",
              marginTop: "-5px",
              height: "32px",
              backgroundColor: isHovered ? "rgba(0, 0, 0, 0.15)" : "transparent",
              marginLeft:
                props.location.state.details.hasOwnProperty("externalSigner") &&
                props.location.state.details.externalSigner
                  ? "18rem"
                  : "1rem",
            }}
            id="viewModal"
            onClick={() => setShown(true)}
            onMouseEnter={handleBadgeMouseEnter}
            onMouseLeave={handleBadgeMouseLeave}
          >
            <i class="fa fa-expand" aria-hidden="true" style={{fontSize: "20px", color: "#20a8d8"}}></i>
          </Button>
          { isHovered ? <Tooltip
            isOpen={tooltipOpenModal}
            target="viewModal"
            placement="bottom"
            id="tooltip"
            hideArrow
          >
            {getTooltipMessageForFullScreen()}
          </Tooltip> : null}
      </div>

      <div className="item-container preview" id="container1">
        <div className="items" id="container2">
        <div
            className="grand-parent-div"
            id="decorate"
            style={{
              width: "582px",
              height: "620px",
              marginBottom: "1px",
              backgroundColor: "rgba(0, 0, 0, 0.15)",
            }}
          >
            {pdfViewer()}
          </div>
          <div
            className="banking-details-container"
            style={{
              margin: "-10px 50px 50px 50px",
            }}
          >
            <div id="balanceContainer">
              <b
                style={{
                  padding: "0% 0% 0% 0%",
                  color: "black",
                  fontSize: "13px",
                }}
              >
                Available Balance : {sessionStorage.getItem("units")}
              </b>
              {/* &nbsp; */}
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
              {shown && ReactDOM.createPortal(modalBody(), document.body)}
            <div className="items-content-1">
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
                <div className="radio-container" style={{ marginBottom: "10px"}}>
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
                      disabled
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
              <div className="" style={{ marginBottom: "10px" }}>
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
                      id="selfDscTokenModeRadio"
                      style={{ marginLeft: "0px" }}
                      value="3"
                      checked={selectedMode === "3"}
                      onChange={handleModeChange}
                    />
                    <span className="label" id="selftokentext">
                      DSC Token Sign
                    </span>
                    <span id="clientdownloadspan" style={{ marginLeft: "20px" }}>
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
              <div id="handSignContainer" style={{ display: "none" }}></div>
            </div>
            <div id="submitBtn" hidden className="submit-details">
              <button className="upload-button" onClick={submitJob}>
                <span> Initiate Signing &#8594;</span>
              </button>
            </div>
            <div className="submit-details">
              <button
                id="nextBtn"
                className="upload-button"
                onClick={nextPreview}
              >
                <span>Next Signer &#8594;</span>
              </button>
            </div>
            <Modal
              className="modal-container"
              open={openSecondModal}
              onClose={onCloseSecondModal}
              center={true}
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
export default React.memo(MultiPplSignPreview);
