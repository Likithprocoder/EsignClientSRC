import React, { Component } from 'react';

var Loader = require("react-loader")

export default class ConsenteSign extends Component {
    constructor(props) {
        super(props);
        this.ifr = null;
        this.state = {
            aspUrl: "",
            aspRespXML: "",
            loaded: true

        }
    }

    componentWillMount() {
        let data = JSON.parse(sessionStorage.getItem("download_data"))
        this.setState({
            aspUrl: data.aspUrl,
            aspRespXML: data.espXML
            //  aspUrl: "https://pregw.esign.egov-nsdl.com/nsdl-esp/authenticate/esign-doc/",
            //  aspRespXML: "yfjhfjhfjhgjhg"
        })
    }

    componentDidMount() {
        var form = this.refs.form;
        form.submit()
    }


    logout() {
        this.props.history.push('./')
    }

    onLoad() {
    }


    render() {
        return (
            <div className="success-container">
                <iframe name="consentiframe" id="consentiframe" frameBorder="0" className="consentiframe" onLoad={this.onLoad.bind(this)} scrolling="yes"></iframe>
                <form id="URL" name="URL" method="POST" action={this.state.aspUrl} encType="multipart/form-data" target="consentiframe" ref="form">
                    <input type="hidden" name="obj" id="obj" value="" />
                    <input type="hidden" name="msg" id="msg" value={this.state.aspRespXML} />
                </form>
            </div>
        );
    }
}
