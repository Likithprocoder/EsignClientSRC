// material ui table ref link-----------------https://blog.logrocket.com/material-table-react-tutorial-with-examples/
import React from "react";
import { Row } from "reactstrap";
import { URL } from "../URLConstant";
import "../../scss/jquery.dataTables.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import MaterialTable, { MTableToolbar } from "material-table";
import tableIcons from "../Inbox/MaterialTableIcons";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { Delete, MoreVert, MoreHoriz, BorderColor } from "@material-ui/icons";
import "../Profile/ProfileDetails";
import Modal from "react-responsive-modal";
import {
  Button,
  Progress,
  Card,
  CardHeader,
  CardBody,
  Input,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
//import { indexOf } from "core-js/core/array";
var Loader = require("react-loader");
var jsPDF = require("jspdf");

const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.min.js`;

export default class TemplateList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      listOfTemplates: [],
      rowData: "",
      fileName: "",
      authToken: "",
    };
  }

  componentDidMount() {
    this.getTemplatesToAdmin();
  }

  //------------------fetching templates for admin api--------------
  getTemplatesToAdmin = () => {
    var inputTogetTempList = {
      authToken: sessionStorage.getItem("authToken"),
    };
    this.setState({ loaded: false });
    fetch(URL.getTemplateListForAdmin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputTogetTempList),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          var listOfTemplates = responseJson.listOfDetail;
          this.setState({
            loaded: true,
            listOfTemplates: listOfTemplates,
          });
        }
        else {
          this.setState({ loaded: true });
          if (responseJson.statusDetails === "Session Expired") {
            sessionStorage.clear();
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
            this.props.history.push("/login");
          } 
          else {
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
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
  };

  //enabling ,disabling template
  updateTemplate(status, templateCode, templateName) {
    var message;
    if (status === "0") {
      message = "Do you want to enable the template";
    } else {
      message = "Do you want to disable the template";
    }
    confirmAlert({
      message: message,
      buttons: [
        {
          label: "OK",
          className: "confirmBtn",
          onClick: () => {
            var inputTogetTempList = {
              authToken: sessionStorage.getItem("authToken"),
              userIP: sessionStorage.getItem("userIP"),
              tempCode: templateCode,
              tempName: templateName,
              status: status,
            };
            this.setState({ loaded: false });
            fetch(URL.updateTemplate, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(inputTogetTempList),
            })
              .then((response) => {
                return response.json();
              })
              .then((responseJson) => {
                if (responseJson.status === "Success") {
                  confirmAlert({
                    message: responseJson.statusDetails,
                    buttons: [
                      {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => {
                          window.location.reload(true);
                        },
                      },
                    ],
                  });
                } else {
                  this.setState({ loaded: true });
                  if (responseJson.statusDetails === "Session Expired!!") {
                    sessionStorage.clear();
                    this.props.history.push("/login");
                  } else {
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
                }
              })
              .catch((e) => {
                this.setState({ loaded: true });
                alert(e);
              });
          },
        },
        {
          label: "Cancel",
          className: "confirmBtn",
          onClick: () => { },
        },
      ],
    });
  }

  render() {
    const { listOfTemplates } = this.state;

    const columns = [
      {
        title: "",
        field: "",
        cellStyle: {
          width: "2%",
          padding: "0px",
          paddingRight: "0%",
          paddingLeft: "1%",
          textAlign: "center",
        },
      },

      {
        title: "Template Name",
        field: "templateName",
        cellStyle: {
          width: "35%",
          paddingLeft: "2px",
          fontSize: "15px",
        },
      },
      {
        title: "Template code",
        field: "templateCode",
        type: "string",

        cellStyle: {
          width: "20%",
          paddingLeft: "5px",
        },
      },
      {
        title: "Group",
        field: "groupCode",
        type: "string",

        cellStyle: {
          width: "15%",
          paddingLeft: "5px",
        },
      },
      {
        title: "Sub Group",
        field: "subgroup",
        type: "datetime",
        cellStyle: {
          paddingLeft: "0px",
          width: "15%",
        },
      },
      {
        title: "Status",
        field: "status",
        cellStyle: {
          paddingLeft: "0px",
          width: "7%",
        },
        render: (rowData) => {
          var statusInfo;
          if (rowData.status === "1") {
            statusInfo = "Active";
          } else if (rowData.status === "0") {
            statusInfo = "Inactive";
          } else {
            statusInfo = "Removed";
          }
          return statusInfo;
        },
      },
      {
        title: "Action",
        cellStyle: {
          paddingLeft: "0px",
          width: "18%",
        },
        render: (rowData) => {
          if (rowData.status === "1") {
            return (
              <div>
                <a
                  type="button"
                  style={{ color: "blue" }}
                  onClick={(e) =>
                    this.updateTemplate(
                      rowData.status,
                      rowData.templateCode,
                      rowData.templateName
                    )
                  }
                >
                  Disable
                </a>
              </div>
            );
          } else if (rowData.status === "0") {
            return (
              <div>
                <a
                  type="button"
                  style={{ color: "green" }}
                  onClick={(e) =>
                    this.updateTemplate(
                      rowData.status,
                      rowData.templateCode,
                      rowData.templateName
                    )
                  }
                >
                  Enable
                </a>
                {/* /
                <a type="button" style={{ color: "red" }}>Remove</a> */}
              </div>
            );
          } else {
            return <>-</>;
          }
        },
      },
    ];

    return (
      <div>
        <MaterialTable
          columns={columns}
          icons={tableIcons}
          data={listOfTemplates}
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
      </div>
    );
  }
}
