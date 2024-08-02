import React, { Component } from 'react';

export default class ConsentResponse extends Component {

    constructor(props) {
        super(props)
        this.state = {
            msg: ""
        }
    }

    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

    componentDidMount() {

        let response = this.props.location.search;
        if (response.includes("consenteSign=")) {
            if (response.split("consenteSign=")[1] === "SUCCESS") {
                sessionStorage.setItem("consentFlag", "Y")
                this.setState({ msg: "Consent eSign completed. You can continue eSign by clicking Sign Document menu." })
            } else if (response.split("consenteSign=")[1] === "FAILURE") {
                this.setState({ msg: "Consent eSign Failed. Please try after some time." })
            }
        }
    }
    render() {
        return (
            <div className="login-main-container" style={{ paddingTop: "5%" }}>
                <div style={{ marginTop: "5%" }}>
                    <h4>{this.state.msg}</h4>
                </div>
            </div>
        )
    }
}