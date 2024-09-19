// material ui table ref link-----------------https://blog.logrocket.com/material-table-react-tutorial-with-examples/
import React from "react";
import { URL } from "../URLConstant";
import "../Inbox/inbox.css";
import "../../scss/jquery.dataTables.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import MaterialTable, { MTableToolbar } from "material-table";
import tableIcons from "../Inbox/MaterialTableIcons";
import { BorderColor } from "@material-ui/icons";
import "../Profile/ProfileDetails";
import "../Inbox/stepProgressBars.scss";
var Loader = require("react-loader");
const pdfjsforOnDrag = require("pdfjs-dist");
pdfjsforOnDrag.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js`;

export default class PendingActionInbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      inboxDataList: [],
      rowData: "",
      fileName: "",
      docId: "",
      username: "",
      firstName: "",
      email: "",
      userId: "",
      mobileNo: "",
      senderName: "",
      requestedTime: "",
      openEmailModal: false,

      authToken: "",
      canvas_width: "",
      canvas_height: "",
      data1: {},
      to: "",
      cc: "",
      array_emailTo: [],
      array_emailCc: [],
      subject: "",
      ebody: "",
      emailValidation: {},
      documentId: "",
      attachment: "",
      signerListDetails: [],
      opensignersCommentsModal: false,
      CommentsHeading:" ",
      totalPagesNum: null,
      signInfo: "",
      signPage: "",
      pageList: [],
      fileUrl: "",
      shown: false,
      fileName: "",
      currentPageView: 1,
      pageDimensions: "",
      equalPageDimensions: true,
    };
    this.customPlugin = this.customPlugin.bind(this);
  }

  componentDidMount() {
    this.getInbocDocDetails();
  }

  //------------------Inbox Table API--------------
  getInbocDocDetails = () => {
    var body = {
      authToken: sessionStorage.getItem("authToken"),
      docStatus: "pending"
    };
    this.setState({ loaded: false });
    fetch(URL.getInboxDocDetails, {
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
          var inboxDetails = responseJson.data;

          //-------------Hiding sign icon based on DOC_STATUS and displaying sign icon based on acesskey keyword present or not--------------
          var isSignEnable;
          for (var i = 0; i < inboxDetails.length; i++) {
            var rowData = inboxDetails[i];
            if (

              rowData.DOC_STATUS === -2
            ) {
              isSignEnable = true;
            } else {
              isSignEnable = false;
            }
            rowData.isSignEnable = isSignEnable;
            inboxDetails[i] = rowData;
          }
          this.setState({
            inboxDataList: inboxDetails,
            loaded: true
          });
        }else {
          this.setState({ loaded: true });
          if (responseJson.statusDetails.includes("not a string")) {
            this.props.history.push("/home");
          }
         else if (responseJson.statusDetails === "Session Expired!!") {
            sessionStorage.clear();
            this.props.history.push("/login");
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
          }
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
  };

  //Fetch call to get the coordinates when user selects Discard and sign again option
  getSignCoordinateDetails(data) {
    // console.log(data);
    //getting access for external signer
    fetch(URL.getSignCoordinateDetails, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        // console.log(responseJson);
        if (responseJson.status == "SUCCESS") {

          this.setState({
            loaded: true,
            signMode: responseJson.signMode,
            signInfo: responseJson.signInfo,
            signCoordinates: responseJson.signCoordinates,
            // signCoordinates: JSON.parse(responseJson.signCoordinates),
            signPage: responseJson.signPage,
            pageList: responseJson.pageList,
          });

          // this.createFile(responseJson.fileName);
          //changed for encryption
          // this.createFile(responseJson.docId);
          // this.createFile(responseJson.docId);
        } else {
          this.setState({ openOTPModal: false });
          confirmAlert({
            message: responseJson.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  this.props.history.push("/");
                },
              },
            ],
          });
          //alert(responseJson.statusDetails)
          this.setState({ loaded: true });
        }
      });
  }

  //------------------Signing from inbox call(self signing pending list)------------------
  CheckSigningMode = (rowData) => {
    console.log({rowData});
    let data = {
      docId: rowData.DOC_ID,
      authToken: sessionStorage.getItem("authToken"),
      txnrefNo: rowData.token,
    }
    this.setState({ loaded: true });
    this.props.history.push({
      pathname: "/download/tokenSignDownload",
      frompath: "/pendingActionsInbox",
      state: {
        details: data,
      },
    });
  };

  //-----------------View File--------------------
  viewStoredFile = (e) => {
    let pdfurl =
      URL.viewStoredFile +
      "?at=" +
      btoa(sessionStorage.getItem("authToken")) +
      "&docID=" +
      btoa(e.DOC_ID);
      this.setState({ fileUrl: pdfurl });
      this.setState({ fileName: e.DOC_NAME });
      this.setState({ shown: true})
  };

  onRenderAnnotations(e) {
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
        onAnnotationLayerRender: this.onRenderAnnotations,
    };
  };

  customPlugin() {
    return {
        onAnnotationLayerRender: this.onRenderAnnotations,
    };
  }; 

  render() {
    const columns = [
      {
        title: "",
        field: "STATUS",
        cellStyle: {
          width: "2%",
          padding: "0px",
          paddingRight: "0%",
          paddingLeft: "1%",
          textAlign: "center",
        },
        render: (rowData) => {
          if (rowData.DOC_STATUS === -2) {
            return (
              <i
                class="fa fa-clock-o"
                style={{ fontSize: "20px", padding: "0px" }}
              ></i>
            );
          } else {
            return (
              <i
                className="fa fa-check"
                style={{ color: "green", fontSize: "25px", padding: "0px" }}
              ></i>
            );
          }
        },
      },
      {
        title: "",
        field: "DOC_NAME",
        cellStyle: {
          width: "1%",
          padding: "0px",
          paddingRight: "0%",
          textAlign: "left",
          marginBottom: "4px",
        },
        render: (rowData) => {
          return (
            <i
              onClick={(row) => this.viewStoredFile(rowData)}
              id="pdfIcon"
              title="PDF preview"
              className="fa fa-file-pdf-o fa-lg"
            ></i>
          );
        },
      },
      {
        title: "File Name",
        field: "DOC_NAME",
        cellStyle: {
          width: "40%",
          padding: "0px",
          paddingLeft: "-5%",
        },
        customFilterAndSearch: (term, rowData) =>
          rowData.DOC_NAME.toLowerCase().indexOf(term.toLowerCase()) > -1,

        render: (rowData) => {
          return (
            <span
              title="PDF preview"
              onClick={(row) => this.viewStoredFile(rowData)}
              id="doc_name_td"
            >
              {rowData.DOC_NAME}
              <br></br>
              <span style={{ color: "#8d8282" }}>
                From: {"" + rowData.DOC_OWNER}
              </span>
            </span>
          );
        },
      },
      {
        title: "Size",
        field: "DOC_SIZE",
        type: "string",

        cellStyle: {
          width: "9%",
          paddingLeft: "0px",
        },

        render: (rowData) => {
          var stroagelimtvalue = "KB";
          var filesize;
          var filesizeinMB = rowData.DOC_SIZE;
          if (filesizeinMB >= 1024.0) {
            stroagelimtvalue = "MB";
            filesize = filesizeinMB / 1024;
            filesizeinMB = Math.round(filesize * 100) / 100.0;
            filesize = filesizeinMB + stroagelimtvalue;
          } else {
            filesize = filesizeinMB + stroagelimtvalue;
          }
          return filesize;
        },
      },
      {
        title: "Status",
        field: "DOC_STATUS",
        type: "string",
        //----------search field filter customization----------
        customFilterAndSearch: (term, rowData) =>
          (rowData.DOC_STATUS + "KB").indexOf(term) != -1,
        cellStyle: {
          width: "17%",
          paddingLeft: "0px",
        },
        render: (rowData) => {
          if (rowData.DOC_STATUS == -2 && rowData.SELF_SIGN == 1) {
            return <span style={{ color: "#da8302" }}>Sign pending</span>;
          } else if (rowData.SELF_SIGN == 1) {
            return <span style={{ color: "green" }}>Self signed</span>;
          }
        },
      },
      {
        title: "Last Updated",
        field: "LAST_UPDATED_ON",
        type: "datetime",
        cellStyle: {
          paddingLeft: "0px",
          width: "21%",
        },
      },
    ];
    const inboxData = this.state.inboxDataList;
    return (
      <div>
        <Loader
          loaded={this.state.loaded}
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
        <p><b className="blink_me">Note: </b>Once the action is performed successfully, the document will be moved to inbox.</p>
        {this.state.loaded && <MaterialTable
          columns={columns}
          icons={tableIcons}
          data={inboxData}
          options={{
            search: true,
            // searchFieldVariant: "outlined",
            thirdSortClick: false, //------not to Allow unsorted state on third header click------------------
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
              fontSize: "16px",
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
          actions={[
            (rowData) => {
              return rowData.isSignEnable
                ? {
                    icon: () => <BorderColor style={{ color: "#150178" }} />,
                    id: "signIcon",
                    tooltip: "Sign",
                    onClick: (event, rowData) => this.CheckSigningMode(rowData),
                    isFreeAction: false,
                    hidden: false,
                  }
                : {
                    icon: BorderColor,
                    id: "signIcon",
                    tooltip: "Sign",
                    onClick: (event, rowData) => this.CheckSigningMode(rowData),
                    // onClick: (event, rowData) => this.createFile(rowData),
                    isFreeAction: false,
                    hidden: true,
                  };
            },
          ]}
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
        ></MaterialTable>}
      </div>
    );
  }
}
