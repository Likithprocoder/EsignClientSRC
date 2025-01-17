import React, { Component } from "react";

class ServerMaintainance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="app">
        <div style={{ textAlign: "center", marginTop: "5%" }}>
          <h1>DocuExec</h1>
        </div>

        <div>
          <h3 style={{ textAlign: "center", marginTop: "10%" }}>
            Server under maintenance. Sorry for the inconvenience. Please login
            after 11:00 A.M on 03-January-2025.
          </h3>
        </div>
      </div>
    );
  }
}
export default ServerMaintainance;

