import React from "react";
import Dropzone from "react-dropzone";
import { URL } from "../URLConstant";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Table } from "reactstrap";
import $ from "jquery";
import "../../scss/jquery.dataTables.css";
import "./BulkRegistration.css";
import { ThreeSixtyOutlined } from "@material-ui/icons";

require("datatables.net-buttons/js/dataTables.buttons.min.js")(); //# HTML 5 file export
require("datatables.net-buttons/js/buttons.html5.js")(); //# HTML 5 file export
require("datatables.net-buttons/js/buttons.print.js")(); //# Print view button

var Loader = require("react-loader");

export default class BulkRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      summaryRes: "",
      responseData: [],
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
    document.getElementById("Registration-button").style.backgroundColor =
      "rgba(96, 218, 185, 0.78)";

    document.getElementById("Registration-button").style.cursor = "no-drop";
  }

  bulkRegistrationCall() {
    var role_id = sessionStorage.getItem("roleID");
    if(role_id==1 || role_id==5){
    this.setState({ loaded: false });
    let obj = {
      authToken: sessionStorage.getItem("authToken"),
      userIP: sessionStorage.getItem("userIP"),
    };
    const formData = new FormData();
    formData.append("file", this.state.files[0]);
    formData.append("inputDetails", JSON.stringify(obj));
    fetch(URL.BulkRegistration, {
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
            summaryRes: responseJson.summary,
            responseData: responseJson.userInfo,
          });
          document.getElementById("Registration-button").style.display = "none";

          document.getElementById("invalidFileValidation").style.display = "";

          this.setState({ color: "green" });
          msg = "Users registration successfull";
          document.getElementById("msgforRegistration").innerHTML = msg;

          this.setState({ loaded: true });
          $("#BulkRegistrationTbl").DataTable().destroy();
          $("#BulkRegistrationTbl").dataTable({
            buttons: [
              {
                extend: "csv",
                filename: "BulkRegistration",
              },
              {
                extend: "print",
              },
            ],
            data: Data,

            columns: [
              { data: "firstName" },
             // { data: "LogInName" },
              { data: "mobileNo" },
              { data: "emailId" },
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
          if (responseJson.hasOwnProperty("validFile")) {

            var msg = "";
            msg = responseJson.statusDetails;
            this.setState({ color: "red" });
            document.getElementById("invalidFileValidation").style.display =
              "none";
            document.getElementById("Registration-button").style.display =
              "none";

            document.getElementById("msgforRegistration").innerHTML = msg;
          } else {
            if (!this.state.sessionCheck) {
              var msg = "";
              var Data = responseJson.userInfo;
              this.setState({
                summaryRes: responseJson.summary,
                responseData: responseJson.userInfo,
              });
              this.setState({ color: "red" });
              msg = "All users registration failed";
              document.getElementById("msgforRegistration").innerHTML = msg;

              document.getElementById("invalidFileValidation").style.display =
                "";
              document.getElementById("Registration-button").style.display =
                "none";

              this.setState({ loaded: true });
              $("#BulkRegistrationTbl").DataTable().destroy();
              $("#BulkRegistrationTbl").dataTable({
                buttons: [
                  {
                    extend: "csv",
                    filename: "BulkRegistration",
                  },
                  {
                    extend: "print",
                  },
                ],
                data: Data,

                columns: [
                  {
                    data: "firstName",
                  },
                  //{ data: "LogInName" },
                  { data: "mobileNo" },
                  { data: "emailId" },
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

            if (responseJson.hasOwnProperty("bulkRegistrationPermission")) {
              var msg = "";
              msg = responseJson.statusDetails;
              this.setState({ color: "red" });
              document.getElementById("invalidFileValidation").style.display =
                "none";
              document.getElementById("Registration-button").style.display =
                "none";

              document.getElementById("msgforRegistration").innerHTML = msg;
            }
          }
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
    }else{
       confirmAlert({
         message:"Permission Denied",
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
        document.getElementById("Registration-button").style.backgroundColor =
          "#1DD1A1";

        document.getElementById("Registration-button").style.cursor = "pointer";
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
      // document.getElementById("droppedFile").style.display = "";
      // document.getElementById("droppedFileNameSize").style.display = "";
      return <span className="drop-csv">{this.state.files[0].name}</span>;
    }
  }

  printTableData = () => {
    $("#BulkRegistrationTbl").DataTable().buttons(["0"]).trigger();
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
                <h5>Upload CSV file for Bulk Registration</h5>
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

          {/* <div className="dropped-files">
            <aside>
              <h2
                className="dropped-files-name"
                id="droppedFile"
                style={{ display: "none" }}
              >
                Uploaded file
              </h2>
              <span id="droppedFileNameSize" style={{ display: "none" }}>
                {this.state.uploadedFileName}-{this.state.uploadedFileSize}
              </span>
            </aside>
          </div> */}
          <div className="next-nav">
            <button
              className="upload-button"
              id="Registration-button"
              disabled={this.state.isdisable}
              onClick={this.bulkRegistrationCall.bind(this)}
            >
              <span>Bulk Registration &#8594;</span>
            </button>
          </div>
        </div>
        <div id="downloadCvsLink" style={{ textAlign: "center" }}>
          <h5 id="msgforRegistration" style={{ color: this.state.color }}></h5>
          <div id="invalidFileValidation" style={{ display: "none" }}>
            <h5>
              {" "}
              {this.state.summaryRes.successCount}
              {this.state.summaryRes.totalRecordsCount} got success,{" "}
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
            id="BulkRegistrationTbl"
            style={{ textAlign: "center", width: "100%" }}
          >
            <thead>
              <tr>
                <th>First Name</th>
              {/* //  <th>Login Name</th> */}
                <th>Mobile Number</th>
                <th>Email Id</th>
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
