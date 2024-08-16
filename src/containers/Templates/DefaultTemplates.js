import React, { Component } from "react";
import $, { event } from "jquery";
import { memo } from "react";
import { URL } from "../URLConstant";
import "./Template.css";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Tabs, Tab, Typography } from "@material-ui/core";
import { confirmAlert } from "react-confirm-alert";


class DefaultTemplates extends Component {
  // Template Dimension Displayed..
  dimension = {
    height: "130px",
    width: "100px",
  };

  constructor(props) {
    super(props);
    this.state = {
      status: "",
      statusdetails: "",
      templateListArray: [],
      message: null,
      loaded: true,
      GroupNameAndCode: "",
      selectedOption: "",
      expanded: null,
    };
  }

  componentDidMount() {
    this.setState({ loaded: false });
    fetch(URL.getTemplateGrps, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authToken: sessionStorage.getItem("authToken")
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        if (responseJson.status == "SUCCESS") {
          this.setState({ GroupNameAndCode: responseJson.details });
        }
        else if (responseJson.statusDetails == "Session Expired") {
          confirmAlert({
            message: responseJson.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  this.props.history.push("/login");
                },
              },
            ],closeOnClickOutside: false
          });
        }
        else {
          confirmAlert({
            message: "SomeThing Went Wrong PLease Try Again",
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {

                },
              },
            ],closeOnClickOutside: false
          });
          this.setState({ loaded: true });
        }
      });
  }

  //j-query which increase img when cursor is on particular template
  bigimg = (props) => {
    $(document).ready(function () {
      $(`.toggle${props}1`).addClass("border1");
    });
  };

  //j-query which decrease img when cursor is on particular template
  smallimg(props) {
    $(document).ready(function () {
      $(`.toggle${props}1`).removeClass("border1");
    });
  }

  // push page based on the templateCode..
  clickfun = (templateCode, templateName) => {
    this.props.history.push({
      pathname: "/template",
      frompath: "/templates",
      state: {
        templateCode: templateCode,
        templateName: templateName,
      },
    });
  };

  test = (event, grpCode) => {
    const url = URL.getTemplateList;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        authToken: sessionStorage.getItem("authToken"),
        grpCode: grpCode,
      }),
    };
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        // if status is success set the data..

        if (data.status === "SUCCESS") {
          if (data.statusDetails === "Templates are unavailable within this group!") {
            confirmAlert({
              message: data.statusDetails,
              buttons: [
                {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => { },
                },
              ],closeOnClickOutside: false
            });
            this.setState({
              status: "",
              statusdetails: "",
              templateListArray: [],
            });
          }
          else {
            this.setState({
              status: data.status,
              statusdetails: data.statusdetails,
              templateListArray: data.templateListArray,
            });
          }
        }
        // if session Is Expired push to login page..
        else if (data.statusDetails === "Session Expired!!") {
          confirmAlert({
            message: data.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {
                  this.props.history.push("/login");
                },
              },
            ],closeOnClickOutside: false
          });
          this.props.history.push("/login");
        }
      })
      .catch((error) => {
        this.setState({
          messaage: "failure",
        });
        console.log(error);
        alert("SomeThing Went Wrong Please Try Again");
        this.props.history.push("/accountInfo");
      });

    this.setState({ loaded: false });
  };

  handleChange = (panel) => (event, isExpanded) => {
    this.setState({ expanded: isExpanded ? panel : null });
  };

  render() {
    const { GroupNameAndCode, expanded, templateListArray, selectedOption } =
      this.state;

    return (
      <div key="mainDIV">
        {GroupNameAndCode.length ? (
          GroupNameAndCode.map((posts, i) => (
            <div>
              <Accordion
                style={{
                  backgroundColor: "#FFFFF4",
                  borderWidth: "3px",
                  borderColor: "black",
                }}
                expanded={expanded === `panel${i}`}
                onClick={(e) => this.test(e, posts.code)}
                onChange={this.handleChange(`panel${i}`)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography >
                    <b>{posts.name}</b>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {templateListArray.length ? (
                      templateListArray.map((posts, i) => (
                        <div className="d-inline-block  mb-2 mr-sm-5 " key={i}>
                          <button
                            title={`${posts.tempDescp}`}
                            style={{ marginBottom: "5px" }}
                            className={`toggle${i + "1"}`}
                            onClick={(e) =>
                              this.clickfun(
                                posts.templateCode,
                                posts.templateName
                              )
                            }
                          >
                            {" "}
                            <img
                              style={this.dimension}
                              src={`data:image/jpg;base64,${posts.templateImg}`}
                              title={`${posts.tempDescp}`}
                              className={`toggle${i}`}
                              onMouseOver={(e) => this.bigimg(i)}
                              onMouseOut={(e) => this.smallimg(i)}
                            ></img>
                          </button>
                          <div className="templateNameCss">
                            <span>{posts.templateName}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <h3>
                        <span></span>
                      </h3>
                    )}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <br />
            </div>
          ))
        ) : (
          <h3>
            <span></span>
          </h3>
        )}
      </div>
    );
  }
}
export default memo(DefaultTemplates);
