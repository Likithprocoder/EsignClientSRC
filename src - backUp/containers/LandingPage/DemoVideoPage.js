import React, { Component } from "react";
import {Button } from "reactstrap";
import DocuExecselfSignvideo from "./assets/Videos/DocuExecselfSignvideo.mp4";
import DocuExecthirdpartysigning from "./assets/Videos/DocuExecthirdpartysigning.mp4";
// import eStamping from "./assets/Videos/eStamping.mp4";
// import eStampingExecutionPending from "./assets/Videos/eStampingExecutionPending.mp4";

export default class DemoVideoPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responsedata: [],
      myVideo: "",
    };
  }
  playPause = () => {
    var myVideo1 = document.getElementById("video1");
    if (myVideo1.paused) myVideo1.play();
    else myVideo1.pause();
  };

  playPausethirdpartysigner = () => {
    var myVideo2 = document.getElementById("video2");
    if (myVideo2.paused) myVideo2.play();
    else myVideo2.pause();
  };

  /*playPauseeStamping = () => {
    var myVideo3 = document.getElementById("video3");
    if (myVideo3.paused) myVideo3.play();
    else myVideo3.pause();
  };

  playPauseStampingExceutionPending= () => {
    var myVideo4 = document.getElementById("video4");
    if (myVideo4.paused) myVideo4.play();
    else myVideo4.pause();
  };*/


  makeBig = () => {
    var myVideo = document.getElementById("video1");
    myVideo.width = 560;
  };

  makeSmall = () => {
    var myVideo = document.getElementById("video1");
    myVideo.width = 320;
  };

  makeNormal = () => {
    var myVideo = document.getElementById("video1");
    myVideo.width = 420;
  };
  ReturnToHome = () => {
    this.props.history.push("/LandingPage");
  };
  //
  render() {
    return (
      <div>
        <Button
          id="Play"
          style={{ marginLeft: "90%", marginTop: "1%" }}
          color="primary"
          className="px-4"
          onClick={this.ReturnToHome}
        >
          Back{" "}
        </Button>
        <table>
          <tr>
            <td>
              <h3 style={{ marginLeft: "70px" }}>
                Self Signing Document Execution
              </h3>
              <video
                id="video1"
                width="600"
                style={{
                  border: "4px solid black",
                  borderRadius: "5px",
                  marginRight: "30px",
                  marginLeft: "70px",
                }}
              >
                <source src={DocuExecselfSignvideo} type="video/mp4"></source>
                {/* <source src="mov_bbb.ogg" type="video/ogg"></source> */}
              </video>
              <Button
                style={{ marginLeft: "275px" }}
                color="primary"
                className="px-4"
                onClick={this.playPause}
              >
                Play/Pause
              </Button>
            </td>

            <td>
              <h3>Sign by Others Document Execution</h3>
              <video
                id="video2"
                width="600"
                style={{ border: "4px solid black", borderRadius: "5px" }}
              >
                <source
                  src={DocuExecthirdpartysigning}
                  type="video/mp4"
                ></source>
              </video>
              <Button
                style={{ marginLeft: "35%" }}
                color="primary"
                className="px-4"
                onClick={this.playPausethirdpartysigner}
              >
                Play/Pause
              </Button>
            </td>
          </tr>
          <br />
           {/* <tr>
            <td>
              <h3 style={{ marginLeft: "70px" }}>
                Document Execution with eStamping
              </h3>
              <video
                id="video3"
                width="600"
                style={{
                  border: "4px solid black",
                  borderRadius: "5px",
                  marginRight: "30px",
                  marginLeft: "70px",
                }}
              >
                <source src={eStamping} type="video/mp4"></source>
              </video>
              <Button
                style={{ marginLeft: "275px" }}
                color="primary"
                className="px-4"
                onClick={this.playPauseeStamping}
              >
                Play/Pause
              </Button>
            </td>
            <td>
              <h3>What if execution failed after eStamp purchase?</h3>
              <video
                id="video4"
                width="600"
                style={{ border: "4px solid black", borderRadius: "5px" }}
              >
                <source
                  src={eStampingExecutionPending}
                  type="video/mp4"
                ></source>
              </video>
              <Button
                style={{ marginLeft: "35%" }}
                color="primary"
                className="px-4"
                onClick={this.playPauseStampingExceutionPending}
              >
                Play/Pause
              </Button>
            </td>
          </tr> */}
        </table>
      </div>
    );
  }
}
