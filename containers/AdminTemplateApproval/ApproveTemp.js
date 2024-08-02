import React, { useEffect, useState } from "react";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import "./AdminApr.css";
import Modal from "react-responsive-modal";
import tableIcons from "../Inbox/MaterialTableIcons";
import MaterialTable, { MTableToolbar } from "material-table";
var Loader = require("react-loader");

function ApproveTemp(props) {
  const [tempDetail, setTempDetail] = useState([]);
  const [allow, setallow] = useState(false);
  const [comments, setComments] = useState({});
  const [allowModal, setAllowModal] = useState(false);
  const [allowLoader, setAllowLoader] = useState(false);

  // to store data of rejected template..
  const [moreinfo, setMoreinfo] = useState({
    rejectedBy: "",
    rejectedOn: "",
    templateName: "",
  });

  // columns of the materail table..
  const columns = [
    {
      title: "",
      field: "",
      cellStyle: {
        width: "1%"
      }
    },
    {
      title: "Template Name",
      field: "templateName",
      cellStyle: {
        width: "19%",
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
      field: "groupName",
      type: "number",
      cellStyle: {
        width: "15%",
        paddingLeft: "3px"
      }
    },
    {
      title: "Sub Group",
      field: "subGroup",
      type: "string",
      cellStyle: {
        width: "14%",
        paddingLeft: "3px"
      },
    },
    {
      title: "Uploaded On",
      field: "uploadedOn",
      type: "string",
      cellStyle: {
        width: "16%",
        paddingLeft: "3px"
      }
    },
    {
      title: "Uploaded By",
      field: "uploadedBy",
      type: "string",
      cellStyle: {
        width: "16%",
        paddingLeft: "3px"
      }
    },
    {
      title: "Status",
      field: "status",
      type: "string",
      cellStyle: {
        width: "6%",
        paddingLeft: "3px"
      },
      render: (rowData) => {
        if (rowData.status === "1") {
          return (
            <>
              <span
                className="TemNameCssApp "
              >Not Viewed</span>
            </>
          );
        }
        else if (rowData.status === "2") {
          return (
            <span
              className="TemNameCssApp "
            >Resubmitted</span>
          );
        }
        else {
          return (
            <>
              <div className="viewFileCss3">
                <span id={`${rowData.templateCode}`}>
                  Rejected
                </span>
              </div>
            </>
          );
        }
      }
    },
    {
      title: "Actions",
      field: "",
      type: "",
      cellStyle: {
        width: "14%",
        paddingLeft: "5px",
      },
      render: (rowData) => {
        if (rowData.status === "1" || rowData.status === "2") {
          return (
            <div className="viewFileCss321Css">
              <button style={{ fontSize: "14px", padding: "0px" }}
                className="btn btn-link"
                onClick={(e) => viewTemplate(rowData.templateCode)}
                type="submit"
              >
                View Template
              </button>
              <span style={{ paddingTop: "1px" }} hidden={rowData.status === "2" ? false : true}>/</span>
              <button className="btn btn-link" value={rowData.comments} style={{ fontSize: "14px", padding: "0px" }} hidden={rowData.status === "2" ? false : true}
                onClick={(e) =>
                  viewComment(
                    e,
                    rowData.rejectedOn,
                    rowData.rejectedBy,
                    rowData.templateName
                  )
                }
                type="submit"
              >
                More Info
              </button>
            </div>
          )
        } else {
          return (
            <div className="viewFileCss321Css" >
              <button
                className="btn btn-link"
                value={rowData.comments}
                style={{ fontSize: "14px", padding: "0px" }}
                onClick={(e) =>
                  viewComment(
                    e,
                    rowData.rejectedOn,
                    rowData.rejectedBy,
                    rowData.templateName
                  )
                }
                type="submit"
              >
                More Info
              </button>
            </div>
          )
        }
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

    fetch(URL.getTemplateToBeApproved, options).then((response) =>
      response.json().then((data) => {
        if (data.status === "success") {
          setTempDetail(data.data);
          setallow(true);
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
            ],closeOnClickOutside: false
          });
        } else {
          confirmAlert({
            message: data.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
              },
            ],closeOnClickOutside: false
          });
        }
        setAllowLoader(true);
      })
    );
  }, []);

  // to view template details page is routed..
  const viewTemplate = (tempcode) => {
    props.history.push({
      frompath: "/getTempToApprove",
      pathname: "/viewTemplate",
      state: {
        templateCode: tempcode,
      },
    });
  };

  // to close modal..
  const closeTheModal = () => {
    setAllowModal(false);
  };

  // before rendering the comment modal, setting the value..
  const viewComment = (e, rejectedBy, rejectedByon, templateName) => {
    setComments(e.target.value);
    setMoreinfo({
      rejectedBy: rejectedByon,
      rejectedOn: rejectedBy,
      templateName: templateName,
    });
    setAllowModal(true);
  };

  // to display the rejected details.
  const moreInfo = () => {
    return (
      <div className="mainContentBodyCss">
        <div
          style={{ display: "flex", marginBottom: "5px" }}
          className="rejectedByCss"
        >
          <div style={{ fontStyle: "inherit", fontSize: "13px", fontWeight: "500", width: "50%", display: "flex" }}>
            {/* <span>Template name       :</span> */}
            <div style={{ width: "85%" }}>Template name </div> <div>:</div>
          </div>
          <div style={{ fontSize: "13px", width: "50%" }}>
            <span>{moreinfo.templateName}</span>
          </div>
        </div>
        <div
          style={{ display: "flex", marginBottom: "5px" }}
          className="rejectedByCss"
        >
          <div
            style={{ fontStyle: "inherit", fontSize: "13px", fontWeight: "500", width: "50%", display: "flex" }}
          >
            <div style={{ width: "85%" }}>Rejected by</div><div>:</div>
          </div>
          <div style={{ fontSize: "13px", width: "50%" }}>
            <span>{moreinfo.rejectedBy}</span>
          </div>
        </div>
        <div
          style={{ display: "flex", marginBottom: "2px" }}
          className="rejectedOncss"
        >
          <div
            style={{ fontStyle: "inherit", fontSize: "13px", fontWeight: "500", width: "50%", display: "flex" }}
          >
            <div style={{ width: "85%" }}>Rejected time</div><div>:</div>
          </div>
          <div style={{ fontSize: "13px", width: "50%" }}>
            <span>{moreinfo.rejectedOn}</span>
          </div>
        </div>
        <div
          style={{ display: "flex", marginBottom: "5px" }}
          className="rejectedByCss"
        ></div>
        <div style={{ fontStyle: "inherit", fontSize: "13px", fontWeight: "500", width: "50%", display: "flex", marginBottom: "10px" }}>
          <div style={{ width: "85%" }}>Reason of rejection </div> <div>:</div>
        </div>
      </div>
    );
  };

  // before rendering modal comment is setted.
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
        <div className="ScrollBarX1xx">
          <div className="MoreInfoCss">{moreInfo()}</div>
          <div className="spacingCss ">
            <div className="TextContentCss ScrollBarForApproveTemp">{showcomment()}</div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ApproveTemp;
