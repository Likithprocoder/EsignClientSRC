import React, {Component} from 'react';


var Loader = require("react-loader")

export default class ESign extends Component{
    constructor(props) {
    super(props);
    this.ifr = null;
        this.state = {
            aspUrl :"",
            aspRespXML: "",
            loaded: true

        }
    }

    componentWillMount(){
        let data = JSON.parse(sessionStorage.getItem("download_data"))
        console.log(data.aspUrl);
        console.log(data.espXML);
        this.setState({
            aspUrl: data.aspUrl,
            aspRespXML: data.espXML
        })
    }

    componentDidMount(){
        var form = this.refs.form;
        form.submit()
    }

    eSign(){
        this.props.history.push('./dropdoc')
    }

    logout(){
        this.props.history.push('./')
    }

    onLoad(){
    }
    
    render() {
        return (
            <div className="success-container">
            <Loader loaded={this.state.loaded}
                lines={13} radius={20}
                corners={1} rotate={0} direction={1} color="#000" speed={1}
                trail={60} shadow={false} hwaccel={false} className="spinner loader"
                zIndex={2e9} top="50%" left="50%" scale={1.00}
                loadedClassName="loadedContent"
                />
            <iframe name="my_iframe" id="my_iframe"  frameBorder="0" className="iframe" onLoad={this.onLoad.bind(this)} scrolling="yes"></iframe>
                <form id="URL" name="URL" method="POST" action={this.state.aspUrl} encType="multipart/form-data" target="my_iframe" ref="form">

                 {/* <form id="URL" name="URL" method="POST" action="https://pregw.esign.egov-nsdl.com/nsdl-esp/authenticate/esign-doc/" encType="multipart/form-data" target="my_iframe" ref="form"> */}
                <input type="hidden" name="obj" id="obj" value=""/>
                <input type="hidden" name="msg" id="msg" value={this.state.aspRespXML}/>
                </form>
            </div>
        );
    }
}