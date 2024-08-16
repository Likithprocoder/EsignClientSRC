import React, { Component } from "react";

class ServerMaintainanceRegistration extends Component {
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
            after 1 P.M on 28-June-2024..
          </h3>
        </div>
      </div>
    );
  }
}
export default ServerMaintainanceRegistration;
