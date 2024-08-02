import React, { useEffect, useState } from "react";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import "./Template.css";
import Modal from "react-responsive-modal";
import MaterialTable, { MTableToolbar } from "material-table";
import tableIcons from "../Inbox/MaterialTableIcons";

var Loader = require("react-loader");

function TempDraftData(props) {
  const [tempDetail, setTempDetail] = useState([]);
  const [comments, setComments] = useState({});
  const [allowModal, setAllowModal] = useState(false);
  const [allowLoader, setAllowLoader] = useState(false);
  const [moreinfo, setMoreinfo] = useState({
    rejectedBy: "",
    rejectedOn: "",
    templateName: "",
  });
  const [selectDrpDwn, setSelectDrpDwn] = useState({});

  // columns of the materail table..
  const columns = [
    {
      cellStyle: {
        width: "1%"
      }
    },
    {
      title: "Template Name",
      field: "templateName",
      cellStyle: {
        width: "21%",
        paddingLeft: "2px"
      },
      render: (rowData) => {
        return (
          (rowData.templateName).substring(0, 28)
        )
      }
    },
    {
      title: "Group",
      field: "templateGroup",
      type: "number",
      cellStyle: {
        width: "17%",
        paddingLeft: "3px"
      }
    },
    {
      title: "Sub Group",
      field: "templateSubGroup",
      type: "string",
      cellStyle: {
        width: "16%",
        paddingLeft: "3px"
      },
    },
    {
      title: "Created On",
      field: "uploadedOn",
      type: "string",
      cellStyle: {
        width: "16%",
        paddingLeft: "3px"
      },
      render: (rowData) => {
        return (
          (rowData.uploadedOn).substring(0, (rowData.uploadedOn).length - 9)
        )
      }
    },
    {
      title: "Updated On",
      field: "updatedOn",
      type: "string",
      cellStyle: {
        width: "16%",
        paddingLeft: "3px"
      },
      render: (rowData) => {
        if (!rowData.hasOwnProperty("updatedOn")) {
          return (
            <></>
          )
        } else {
          return (
            (rowData.updatedOn).substring(0, (rowData.updatedOn).length - 9)
          )
        }
      }
    },
    {
      title: "Actions",
      field: "",
      type: "",
      cellStyle: {
        width: "13%",
        paddingLeft: "3px"
      },
      render: (rowData) => {
        return (
          <>
            <a
              onClick={(e) =>
                viewDraftTemplate(rowData.draftRefNo, rowData.templateCode, rowData.templateName)
              }
              type="submit"
              style={{ textAlign: "center", color: "#20a8d8" }}
            >
              View/
            </a>
            <a
              onClick={(e) => deleteTemplate(rowData.draftRefNo, rowData.templateName)}
              type="submit"
              style={{ color: "#f86c6b" }}
            >
              Delete
            </a>
          </>
        )
      }
    }
  ];

  useEffect(() => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authToken: sessionStorage.getItem("authToken"),
      }),
    };

    fetch(URL.getDraftTemplates, options).then((response) =>
      response.json().then((data) => {
        if (data.status === "success") {
          setTempDetail(data.listOfDetail);
        } else if (data.statusDetails === "Session Expired") {
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
        setAllowLoader(true);
      })
    );
  }, []);

  // to continue the edit of field inputs in template page below () is executed.
  const viewDraftTemplate = (draftRefNo, tempCode, templateName1) => {
    const options1 = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authToken: sessionStorage.getItem("authToken"),
        templateCode: tempCode,
        temptDrftRef: draftRefNo
      }),
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authToken: sessionStorage.getItem("authToken"),
        temptDrftRef: draftRefNo,
      }),
    };

    fetch(URL.getEachTempDraftDetails, options).then((response) =>
      response.json().then((data) => {
        if (data.status === "success") {
          setTimeout(() => { }, 1500);
          let state = {
            userDetails: data.tempDetail, 
            templateCode: data.tempCode,
            templateName: data?.templateName,
            templateAttachments: data.templateAttachments,
            temptDrftRef: draftRefNo,
            toPathName: "/templatePdfPreview",
          };
          if ((data.dynamicTableData).hasOwnProperty("repeatAbleBolckData")) {
            state["reptDataToSveDraft"] = JSON.parse(data.dynamicTableData.repeatAbleBolckData).reptDataToSveDraft
            state["repeatAbleBlck"] = JSON.parse(data.dynamicTableData.repeatAbleBolckData).repeatAbleBlock
          };
          props.history.push({
            frompath: "/draftTemplates",
            pathname: "/template",
            state: state
          });
        } else if (data.statusDetails === "Session Expired") {
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
        } else {
          confirmAlert({
            message: data.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
              },
            ],
          });
        }
        setAllowLoader(true);
      })
    );
  };

  // to delete the draft templates.
  const deleteTemplate = (draftRefNo, templateName) => {
    confirmAlert({
      title: "Confirm Delete",
      message: `Do you want to delete draft saved template "${templateName}" data?`,
      buttons: [
        {
          label: "Confirm",
          className: "confirmBtn",
          onClick: () => {
            var body = {
              authToken: sessionStorage.getItem("authToken"),
              temptDrftRef: draftRefNo,
            };
            fetch(URL.deleteTempDraft, {
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
                if (responseJson.status === "success") {
                  confirmAlert({
                    message: responseJson.statusDetails,
                    buttons: [
                      {
                        label: "OK",
                        className: "confirmBtn",
                        onClick: () => {
                          window.location.reload(false);
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
                        onClick: () => { },
                      },
                    ],
                  });
                }
              });
          },
        },
        {
          label: "Cancel",
          className: "cancelBtn",
          onClick: () => { },
        },
      ],
    });
  };

  const closeTheModal = () => {
    setAllowModal(false);
  };

  // to display the rejected template details.
  const moreInfo = () => {
    return (
      <div className="mainContentBodyCss">
        <div
          style={{ display: "flex", marginBottom: "5px" }}
          className="rejectedByCss"
        >
          <div
            style={{
              fontStyle: "inherit",
              fontSize: "18px",
              fontWeight: "500",
              marginRight: "20px",
              width: "50%",
            }}
          >
            <span>Template Name :</span>
          </div>
          <div style={{ fontSize: "16px", width: "70%" }}>
            <span>{moreinfo.templateName}</span>
          </div>
        </div>
        <div
          style={{ display: "flex", marginBottom: "5px" }}
          className="rejectedByCss"
        >
          <div
            style={{
              fontStyle: "inherit",
              fontSize: "18px",
              fontWeight: "500",
              marginRight: "20px",
              width: "50%",
            }}
          >
            <span>Rejected By :</span>
          </div>
          <div style={{ fontSize: "16px", width: "70%" }}>
            <span>{moreinfo.rejectedBy}</span>
          </div>
        </div>
        <div
          style={{ display: "flex", marginBottom: "2px" }}
          className="rejectedOncss"
        >
          <div
            style={{
              fontStyle: "inherit",
              fontSize: "18px",
              fontWeight: "500",
              marginRight: "20px",
              width: "50%",
            }}
          >
            <span>Rejected Time :</span>
          </div>
          <div style={{ fontSize: "16px", width: "70%" }}>
            <span>{moreinfo.rejectedOn}</span>
          </div>
        </div>
      </div>
    );
  };

  const showcomment = () => {
    return <>{comments}</>;
  };

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

      <MaterialTable
        columns={columns}
        icons={tableIcons}
        data={tempDetail}
        options={{
          search: true,
          thirdSortClick: false,
          detailPanelType: "single",
          detailPanelColumnAlignment: "right",
          actionsColumnIndex: -1,
          padding: "dense",
          sorting: true,
          showTitle: false,
          headerStyle: {
            borderTop: "2px inset ",
            top: 0,
            borderTopWidth: "2px",
            backgroundColor: "#e8eaf5",
            color: "black",
            fontWeight: "normal",
            fontSize: "14px",
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

      <Modal
        className="inputTakingModel"
        onClose={closeTheModal}
        open={allowModal}
        center={true}
        closeOnOverlayClick={false}
      >
        <div className="scrollbarx">
          <div className="MoreInfoCss">{moreInfo()}</div>
          <div className="spacingCss ">
            <div style={{ marginBottom: "10px" }}>
              <span style={{ fontSize: "18px", fontWeight: "500" }}>
                Reason of rejection :
              </span>
            </div>
            <div className="TextContentCss ">{showcomment()}</div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default TempDraftData;