import React from "react";

import "./DigiLocker.css";

var Loader = require("react-loader");

class KYCStatusResponse extends React.Component {
  constructor() {
    super();
    this.state = {
      loaded: true,
    };
  }
  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    const ref_id = query.get("reference_id");
    const Fmsg=query.get("msg");
    const KYCstatusResp = query.get("status");
    var msg;
    
    if (KYCstatusResp == "Success") {
      msg = "KYC Verification completed successfully!";
      document.getElementById("StatusContainer").style.display="";
      document.getElementById("StatusInfo").innerHTML=msg;
      document.getElementById("ReferenceNumber").innerHTML="Reference Number: "+ref_id;
     
          
    } else if (KYCstatusResp == "Failure") {
      msg = "KYC Verification failed, Try after sometime again.";
            document.getElementById("StatusFailureContainer").style.display = "";
                  document.getElementById("StatusFailureInfo").innerHTML = msg;
                  document.getElementById("fmsg").innerHTML=Fmsg;
      
    }
  }
  render() {
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

        <div style={{ marginTop: "10%" }}>
          <span style={{ textAlign: "center", paddingLeft: "46%" }}>
            <img src="/logoStamp.png" style={{ width: "80px" }}></img>
          </span>

          <span id="StatusContainer" style={{ display: "none" }}>
            <h1
              style={{ color: "green", textAlign: "center" }}
              id="StatusInfo"
            ></h1>
            <br></br>
            <h4 style={{ textAlign: "center" }} id="ReferenceNumber"></h4>
          </span>
          <span id="StatusFailureContainer">
            <h1
              style={{ color: "orange", textAlign: "center" }}
              id="StatusFailureInfo"
            ></h1>
            <br></br>
            <h4 style={{ textAlign: "center" }} id="fmsg"></h4>
          </span>
          {/* <span style={{ textAlign: "center",fontFamily:"cursive" }}>
            <p>
              {" "}
              You can close this window and refersh your account for more Info.
            </p>
          </span> */}
        </div>
        {/* <p>
          KYC Verification is required to carryout Aadhaar based signing. KYC
          verification connects with your Digilocker account to collect KYC
          details as per Aadhaar data. <br></br>
          This process does not collect any other details linked with your
          Digilocker account, and does not get or store your Aadhaar number. In
          case you have not signed up for Digilocker,{" "}
          <a title="DigiLocker" href="" onClick={this.verifyKYCCall}>
            Click here
          </a>{" "}
          to signup for a free national Digilocker account.
        </p> */}
      </div>
    );
  }
}

export default KYCStatusResponse;
