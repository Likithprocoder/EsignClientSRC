// material ui table ref link-----------------https://blog.logrocket.com/material-table-react-tutorial-with-examples/
import React from "react";
import { URL } from "../URLConstant";
import "../../scss/jquery.dataTables.css";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import MaterialTable, { MTableToolbar } from "material-table";
import tableIcons from "../Inbox/MaterialTableIcons";
import Modal from "react-responsive-modal";
import { Button, Input, Space, Table, Tooltip } from 'antd';
//import { indexOf } from "core-js/core/array";
import "./exitCorpGroup.css";
var Loader = require("react-loader");
var jsPDF = require("jspdf");

const pdfjs = require("pdfjs-dist");
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.min.js`;

export default class ApiKeyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      listOfApiKeys: [],
      rowData: "",
      fileName: "",
      enableStatus: false,
      isReasonModalVisible: false,
      isDisabled: 0,
      disableReason: "",
    };
    this.getApiKeyListForPlatformAdmin = this.getApiKeyListForPlatformAdmin.bind(this);
    this.updateApiKeyStatus = this.updateApiKeyStatus.bind(this);
  }

  componentDidMount() {
    // console.log(this.props);
    if (sessionStorage.getItem("roleID") === "1" || sessionStorage.getItem("roleID") === "6") {
        this.getApiKeyListForPlatformAdmin();
    } else {
        this.props.history.push("/");
    }
  }

  //------------------fetching api key list for admin api--------------
  getApiKeyListForPlatformAdmin = () => {
    let jsonWebToken = sessionStorage.getItem("jsonWebToken");
    this.setState({ loaded: false });
    fetch(URL.getApikeys, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jsonWebToken}`
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.status === "SUCCESS") {
          var listOfApiKeys = responseJson.data;
          listOfApiKeys =  listOfApiKeys.filter((item) => item.status !== 2)
          if (this.props.roleId === "6") {
            this.setState({ isDisabled: responseJson.data[0].isDisabled })
            if (listOfApiKeys.length === 5) {
              this.props.setApiKeyLimit(true); // Call the callback function
            } else {
              this.props.setApiKeyLimit(false); // Call the callback function
            }
          }
          let transformedData = [];

        if (sessionStorage.getItem("roleID") === "1") {
        listOfApiKeys.forEach((entity) => {
        const [key, records] = Object.entries(entity)[0];
          if (key === this.props.entityName) {
            // If records are not empty, transform the data
            if (records.length > 0) {
              transformedData = records.map(record => ({
                ...record,
                corporateEntity: key,
              }));
              // Sort by createdOn date in descending order
              transformedData.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));

              // Check if at least one record has status 1
              const hasStatusOne = transformedData.some(item => item.status === 1);
              if (hasStatusOne) {
                this.setState({ enableStatus: true });
                this.setState({ isDisabled: responseJson.data[0][this.props.entityName][0].isDisabled });
              }

            } else {
              // Handle case where there are no records for the given entity
              transformedData.push({
                corporateEntity: key,
                apiKey: "", // Placeholder value
                createdOn: "", // Placeholder value
                // Add other fields as needed with empty/default values
              });
            }
          }
          });

          
        } else {
            // Sort by createdOn date in descending order
            listOfApiKeys.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
        }

          this.setState({
            loaded: true,
            listOfApiKeys: (sessionStorage.getItem("roleID") === "6" ? listOfApiKeys : transformedData),
          });
        }
        else {
          this.setState({ loaded: true });
          if (responseJson.statusDetails === "Session Expired!!") {
            sessionStorage.clear();
            confirmAlert({
              message: responseJson.statusDetails,
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {this.props.history.push("/login");},
                },
              ],
            });
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

  //enabling ,disabling api key status
  updateApiKeyStatus = (status, apiKeyId) => {
    // console.log("status: "+status);
    // console.log("apiKeyId: "+apiKeyId);
    var message;
    if (status === 1) {
      message = "Do you want to enable the API key?";
    } else if (status === 0) {
      message = "Do you want to disable the API key?";
    } else {
      message = "Do you want to delete the API key?";
    }
    confirmAlert({
      message: message,
      buttons: [
        {
          label: "OK",
          className: "confirmBtn",
          onClick: () => {
            if (status === 0 && sessionStorage.getItem("roleID") === "1") {
              this.setState({ isReasonModalVisible: true });
            } else {
              this.updateKeyStatus(status, apiKeyId);
            }
          },
        },
        {
          label: "Cancel",
          className: "confirmBtn",
          onClick: () => {},
        },
      ],
    });
  }

  updateKeyStatus = (status, apiKeyId) => {
    // console.log(status);
    // console.log(apiKeyId);
    let inputs  = {};
            let jsonWebToken = sessionStorage.getItem("jsonWebToken");
            if (this.props.roleId === "6") {
              inputs = {
                apiID: apiKeyId,
                updatedStatus: status,
              }
            } else {
              inputs = {
                corpId: this.props.corpId,
                updatedStatus: status,
                reason: this.state.disableReason,
              }
              // console.log(inputs);
            }
            this.setState({ loaded: false });
            fetch(URL.updateapikey, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${jsonWebToken}`
              },
              body: JSON.stringify(inputs),
            })
              .then((response) => {
                return response.json();
              })
              .then((responseJson) => {
                if (responseJson.status === "SUCCESS") {
                  if (responseJson.statusDetails === "Api key removed successfully") {
                    confirmAlert({
                      message: "API key deleted successfully",
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn",
                          onClick: () => {
                            // window.location.reload(true);
                            this.getApiKeyListForPlatformAdmin();
                            this.setState({ loaded: true });
                          },
                        },
                      ],
                    });
                  } else if (responseJson.statusDetails === "Api key diabled successfully") {
                    confirmAlert({
                      message: "API key disabled successfully",
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn",
                          onClick: () => {
                            // window.location.reload(true);
                            this.getApiKeyListForPlatformAdmin();
                            this.setState({ loaded: true });
                          },
                        },
                      ],
                    });
                  } else if (responseJson.statusDetails === "Api keys diabled successfully") {
                    confirmAlert({
                      message: "API keys disabled successfully",
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn",
                          onClick: () => {
                            // window.location.reload(true);
                            this.getApiKeyListForPlatformAdmin();
                            this.setState({ loaded: true });
                          },
                        },
                      ],
                    });
                  } else if (responseJson.statusDetails === "Api key enabled successfully") {
                      confirmAlert({
                        message: "API key enabled successfully",
                        buttons: [
                          {
                            label: "OK",
                            className: "confirmBtn",
                            onClick: () => {
                              // window.location.reload(true);
                              this.getApiKeyListForPlatformAdmin();
                              this.setState({ loaded: true });
                            },
                          },
                        ],
                      });
                  } else if (responseJson.statusDetails === "Api keys enabled successfully") {
                    confirmAlert({
                      message: "API keys enabled successfully",
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn",
                          onClick: () => {
                            // window.location.reload(true);
                            this.getApiKeyListForPlatformAdmin();
                            this.setState({ loaded: true });
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
                            // window.location.reload(true);
                            this.setState({ loaded: true });
                          },
                        },
                      ],
                    });
                  }
                } else {
                  this.setState({ loaded: true });
                  if (responseJson.statusDetails === "Session Expired!!") {
                    sessionStorage.clear();
                    confirmAlert({
                      message: responseJson.statusDetails,
                      buttons: [
                        {
                          label: "OK",
                          className: "confirmBtn",
                          onClick: () => {this.props.history.push("/login");},
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
  }

  closeTheReasonModal = () => {
    this.setState({ isReasonModalVisible: false });
    this.setState({ disableReason: "" });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isDisabled !== this.state.isDisabled) {
    }
  }

  // Custom styles for the modal
  customModalStyles = {
    modal: {
      width: '600px', // Set the desired width here
      maxWidth: '100%',
      // zIndex: '10 !important'
    }
  };

  handleReasonSubmit = () => {
    this.setState({ isReasonModalVisible: false });
    this.updateKeyStatus(0, "");
    this.setState({ enableStatus: false });
    this.setState({ disableReason: "" });
  };

  setInput = (e) => {
    const value = e.target.value;
    // Regular expression to allow only alphanumeric characters and spaces
    const alphanumericValue = value.replace(/[^a-zA-Z0-9 ]/g, "");
    this.setState({ disableReason: alphanumericValue });
  }
  

  render() {
    const { listOfApiKeys, isReasonModalVisible, disableReason } = this.state;
    const {roleId} = this.props;
    const { TextArea } = Input;
    const columns = [
        {
            title: "",
            field: "status",
            cellStyle: {
              width: "4%",
              padding: "0px",
              paddingRight: "0%",
              paddingLeft: "1%",
              textAlign: "center",
            },
            render: (rowData) => {
                // console.log(rowData);
                var statusInfo;
                if (rowData.status === 1) {
                    return (
                        <i
                          className="fa fa-check"
                          style={{ color: "green", fontSize: "25px", padding: "0px" }}
                        ></i>
                      );
                } else if (rowData.status === 0) {
                    return (
                        <i
                          class="fa fa-times"
                          id="fafatimesid"
                          style={{ fontSize: "25px", padding: "0px", color: "#f86c6b" }}
                        ></i>
                      );
                }
                return statusInfo;
            },
          },
    ...(roleId !== "6" ? [{
        title: "User Name",
        field: "userName",
        type: "string",
        cellStyle: {
          width: "15%",
          paddingLeft: "5px",
        },
        // render: (rowData) => (rowData.userName ? rowData.userName : <>-</>), // Return hyphen for null or empty userName
      }] : []),
      {
        title: "App Name",
        field: "appName",
        type: "string",

        cellStyle: {
          width: "14%",
          paddingLeft: "15px",
        },
        // render: (rowData) => (rowData.appName ? rowData.appName : <>-</>), // Return hyphen for null or empty appName
      },
      ...(roleId === "6" ? [{
        title: "API Key",
        field: "apiKeyId",
        cellStyle: {
          width: "25%",
          paddingLeft: "2px",
          fontSize: "15px",
        },
        // render: (rowData) => (rowData.apiKeyId ? rowData.apiKeyId : <>-</>), // Return hyphen for null or empty apiKeyId
      }] : []),
      {
        title: "Created On",
        field: "createdOn",
        type: "datetime",
        cellStyle: {
          paddingLeft: "0px",
          width: "15%",
        },
        // render: (rowData) => (rowData.createdOn ? rowData.createdOn : <>-</>), // Return hyphen for null or empty createdOn
      },
    ...(roleId === "6" ? [{
        title: "Actions",
        cellStyle: {
          paddingLeft: "0px",
          width: "5%",
        },
        render: (rowData) => {

          // Check if isDisabled is 1 to conditionally disable the actions
      const isDisabled = this.state.isDisabled === 1;
      console.log(isDisabled);

      if (rowData.status === 1) {
        return (
          <div>
            <a
              type="button"
              style={{ color: isDisabled ? "gray" : "blue", cursor: isDisabled ? "not-allowed" : "pointer" }}
              onClick={(e) =>
                !isDisabled && this.updateApiKeyStatus(0, rowData.apiKeyId)
              }
            >
              Disable
            </a>
            /
            <a
              type="button"
              style={{ color: isDisabled ? "gray" : "red", cursor: isDisabled ? "not-allowed" : "pointer" }}
              onClick={(e) =>
                !isDisabled && this.updateApiKeyStatus(2, rowData.apiKeyId)
              }
            >
              Delete
            </a>
          </div>
        );
      } else if (rowData.status === 0) {
        return (
          <div>
            <a
              type="button"
              style={{ color: isDisabled ? "gray" : "blue", cursor: isDisabled ? "not-allowed" : "pointer" }}
              onClick={(e) =>
                !isDisabled && this.updateApiKeyStatus(1, rowData.apiKeyId)
              }
            >
              Enable
            </a>
            /
            <a
              type="button"
              style={{ color: isDisabled ? "gray" : "red", cursor: isDisabled ? "not-allowed" : "pointer" }}
              onClick={(e) =>
                !isDisabled && this.updateApiKeyStatus(2, rowData.apiKeyId)
              }
            >
              Delete
            </a>
          </div>
        );
      }
        },
      }] : []),
    ];

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
        {sessionStorage.getItem("roleID") !== "6" && <div id='tempGroupListCss' style={{ marginBottom: "10px", width: "100%"}}>
            {
                <span>Corporate Entity: <span style={{color: "blue"}}>{this.props.entityName}</span> 
                {this.state.enableStatus && !this.state.isDisabled ? <span style={{ float: "right"}}><button className="btn btn-danger" onClick={()=>this.updateApiKeyStatus(0, this.state.corpId)}>Disable all</button></span> : <span style={{ float: "right"}} onClick={()=>this.updateApiKeyStatus(1, this.state.corpId)}><button className="btn btn-primary">Enable all</button></span>}</span>
            }
        </div>}
        <MaterialTable
          columns={columns}
          icons={tableIcons}
          data={listOfApiKeys}
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
            rowStyle: (rowData) => ({
              backgroundColor: rowData.isDisabled === 1 ? '#b6b0b0' : '#ffffff', // Light red for disabled rows
            }),
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
      <Modal  open={isReasonModalVisible} onClose={this.closeTheReasonModal} center={true} closeOnOverlayClick={false} id="disableReason" styles={this.customModalStyles}>
      <div className="modal-header">
        <h5 className="modal-title">Disable Reason</h5>
      </div>
      <div className="modal-body">
        <TextArea
          value={disableReason}
          onChange={this.setInput}
          placeholder="Enter the reason for disabling"
          rows={4}
          cols={70}
        />
      </div>
      <div className="modal-footer">
        <Button className="btn btn-danger" onClick={this.closeTheReasonModal}>Cancel</Button>
        <Button className='btn btn-success' onClick={this.handleReasonSubmit}>Submit</Button>
      </div>
    </Modal>
      </div>
    );
  }
}
