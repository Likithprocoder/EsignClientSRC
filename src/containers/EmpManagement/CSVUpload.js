import React from "react";
import Dropzone from "react-dropzone";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Table } from "reactstrap";
import $ from "jquery";
import "../../scss/jquery.dataTables.css";
import "./CSVUpload.css";
import { ThreeSixtyOutlined } from "@material-ui/icons";

require("datatables.net-buttons/js/dataTables.buttons.min.js")(); //# HTML 5 file export
require("datatables.net-buttons/js/buttons.html5.js")(); //# HTML 5 file export
require("datatables.net-buttons/js/buttons.print.js")(); //# Print view button

var Loader = require("react-loader");

export default class CSVUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      responseData: [],
      failureCount: 0,
      totalCount: 0,
      file: "",
      files: [],
      isdisable: true,
      loaded: false,
      uploadedFileName: "",
      uploadedFileSize: "",
      color: "",
      sessionCheck: false,
    };
  }

  componentDidMount() {
    this.setState({ loaded: true });
    document.getElementById("UploadCSV-button").style.backgroundColor =
      "rgba(96, 218, 185, 0.78)";

    document.getElementById("UploadCSV-button").style.cursor = "no-drop";
  }

  uploadCSVCall() {
    this.setState({ loaded: false });
    let obj = {
      authToken: sessionStorage.getItem("authToken"),
      userIP: sessionStorage.getItem("userIP"),
    };
    const formData = new FormData();
    formData.append("file", this.state.files[0]);
    formData.append("inputDetails", JSON.stringify(obj));
    fetch(URL.uploadEmployees, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        this.setState({ loaded: true });

        if (responseJson.status == "SUCCESS") {
          var msg = "";
          var Data = responseJson.userInfo;
          this.setState({
            failureCount: responseJson.failureCount,
            totalCount: responseJson.totalCount,
            responseData: responseJson.userInfo,
          });
          document.getElementById("UploadCSV-button").style.display = "none";

          document.getElementById("invalidFileValidation").style.display = "";

          this.setState({ color: "green" });
          msg = "Employee details upload successful";
          document.getElementById("msgForUpload").innerHTML = msg;

          this.setState({ loaded: true });
          $("#uploadEmpTbl").DataTable().destroy();
          $("#uploadEmpTbl").dataTable({
            buttons: [
              {
                extend: "csv",
                filename: "EmployeeData",
              },
              {
                extend: "print",
              },
            ],
            data: Data,

            columns: [
              { data: "empId" },
              { data: "name" },
              { data: "mobile" },
              { data: "email" },
              { data: "designation" },
              { data: "status" },
              { data: "statusDetails" },
            ],
          });
        } else {
          if (responseJson.statusDetails === "Session Expired!!") {
            this.setState({ sessionCheck: true });
            sessionStorage.clear();
            this.setState({ loaded: true });
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
            this.setState({ loaded: true });
          }
          if (responseJson.statusDetails === "No records available in uploaded file" || responseJson.statusDetails === "The uploaded file is empty. Please upload a valid file with data." || responseJson.statusDetails === "File name contains invalid characters. Only alphanumeric characters, dots, hyphens, underscores, and parentheses are allowed." || responseJson.statusDetails === "Invalid file format. Please upload a CSV file." || responseJson.statusDetails === "Invalid data, contains more or less than 5 columns" || responseJson.statusDetails === "Invalid data, incorrect column name, expected [Emp Id, First Name, Mobile No, Email Id, Designation]") {
          } else {
            if ( responseJson.failureCount == 0 ) {
              var msg = "";
              msg = responseJson.statusDetails;
              this.setState({ color: "green" });
              document.getElementById("invalidFileValidation").style.display =
                "none";
              document.getElementById("UploadCSV-button").style.display =
                "none";
              document.getElementById("msgForUpload").innerHTML = msg;
            } else {
              if (!this.state.sessionCheck) {
                var msg = "";
                var Data = responseJson.userInfo;
                this.setState({
                  failureCount: responseJson.failureCount,
                  totalCount: responseJson.totalCount,
                  responseData: responseJson.userInfo,
                });
                this.setState({ color: "red" });
                ;
                (responseJson.failureCount == responseJson.totalCount) ? msg = "All Employee details upload failed" : msg = "Some Employee details upload failed"
                document.getElementById("msgForUpload").innerHTML = msg;
  
                document.getElementById("invalidFileValidation").style.display =
                  "";
                document.getElementById("UploadCSV-button").style.display =
                  "none";
  
                this.setState({ loaded: true });
                $("#uploadEmpTbl").DataTable().destroy();
                $("#uploadEmpTbl").dataTable({
                  buttons: [
                    {
                      extend: "csv",
                      filename: "EmployeeData",
                    },
                    {
                      extend: "print",
                    },
                  ],
                  data: Data,
  
                  columns: [
                    { data: "empId" },
                    { data: "name" },
                    { data: "mobile" },
                    { data: "email" },
                    { data: "designation" },
                    { data: "status" },
                    { data: "statusDetails" },
                  ],
                });
              } else {
                confirmAlert({
                  message: "Session Expired!!",
                  buttons: [
                    {
                      label: "OK",
                      className: "confirmBtn",
                      onClick: () => {},
                    },
                  ],
                });
                sessionStorage.clear();
                this.setState({ loaded: true });
                this.props.history.push("/login");
              }
  
              // if (responseJson.hasOwnProperty("uploadCsvPermission")) {
              //   var msg = "";
              //   msg = responseJson.statusDetails;
              //   this.setState({ color: "red" });
              //   document.getElementById("invalidFileValidation").style.display =
              //     "none";
              //   document.getElementById("UploadCSV-button").style.display =
              //     "none";
  
              //   document.getElementById("msgForUpload").innerHTML = msg;
              // }
            }
          }
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });

  }

  onDrop(files) {
    if (files.length > 0) {
      if (files[0].name.length < 128) {
        var fileName = files[0].name;
        var name1 = fileName.split(".csv");
        if (name1.length > 2) {
          confirmAlert({
            message: "Invalid File name ",
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {},
              },
            ],
          });
          return null;
        }

        var file = files[0];
        var filesize = files[0].size;
        var filesizeinKB = filesize / 1024;
        this.setState({
          files: files,
          isdisable: false,
          uploadedFileName: fileName,
          uploadedFileSize: filesizeinKB.toFixed(2) + " KB",
        });
        document.getElementById("UploadCSV-button").style.backgroundColor =
          "#1DD1A1";

        document.getElementById("UploadCSV-button").style.cursor = "pointer";
      } else {
        confirmAlert({
          message: "Please select CSV File only...",
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
  }

  isCSVSelected() {
    if (this.state.isdisable) {
      return (
        <div>
          <span className="drop-csv">Drop CSV here </span>
          <i className="fas fa-file-csv" style={{ fontSize: "24px" }}></i>
          <br />
          <span className="drop-csv">OR</span>
          <br />
          <span className="drop-csv">
            <input
              class="btn btn rounded-pill"
              style={{
                width: "112px",
                fontSize: "inherit",
                backgroundColor: "gray",
                color: "white",
              }}
              value="Upload CSV"
            />
          </span>
        </div>
      );
    } else {
      return <span className="drop-csv">{this.state.files[0].name}</span>;
    }
  }

  printTableData = () => {
    $("#uploadEmpTbl").DataTable().buttons(["0"]).trigger();
  };

  render() {
    return (
      <div
        className="main-profile-container animated fadeIn"
        style={{ marginTop: "-20px" }}
      >
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
        <div className="csv-lg-container">
          <div className="csv-container" id="csv-container1">
            <section className="">
              <div className="dropzone">
                <h5>Upload Employee Details File</h5>
                <Dropzone
                  type="file"
                  accept={[".csv"]}
                  className="inner-content"
                  onDrop={this.onDrop.bind(this)}
                >
                  <div className="text-container">{this.isCSVSelected()}</div>
                </Dropzone>
              </div>
            </section>
          </div>
          <div className="next-nav">
            <button
              className="upload-button"
              id="UploadCSV-button"
              disabled={this.state.isdisable}
              onClick={this.uploadCSVCall.bind(this)}
            >
              <span>Proceed &#8594;</span>
            </button>
          </div>
        </div>
        <div id="downloadCvsLink" style={{ textAlign: "center" }}>
          <h5 id="msgForUpload" style={{ color: this.state.color }}></h5>
          <div id="invalidFileValidation" style={{ display: "none" }}>
            <h5>
              {" "}
              {this.state.totalCount - this.state.failureCount}/{this.state.totalCount} got success,{" "}
              <a href="#" onClick={this.printTableData}>
                click here
              </a>{" "}
              for more details.
            </h5>
          </div>
        </div>
        <div className="csv-table">
          <Table
            hover
            bordered
            striped
            responsive
            id="uploadEmpTbl"
            style={{ textAlign: "center", width: "100%" }}
          >
            <thead>
              <tr>
                <th>Emp Id</th>
                <th>First Name</th>
                <th>Mobile Number</th>
                <th>Email Id</th>
                <th>Designation</th>
                <th>Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
          </Table>
        </div>
      </div>
    );
  }
}

