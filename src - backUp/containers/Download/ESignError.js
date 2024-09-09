import React from 'react';

export default class ESignError extends React.Component{

    componentDidMount(){
        let qp = this.props.location.search;
        qp = qp.replace("?", "");
        let qp_list = qp.split("&");
        let parsed = {};
        for (let i in qp_list) {
            let kv = qp_list[i].split("=");
            parsed[kv[0]] = kv[1];
        }
        if(parsed.filename === "Txn"){
            document.getElementById('msg1').style.display = "none"
            document.getElementById('msg2').style.display = "none"
            document.getElementById('msg3').style.display = ""
        }
    }

    render(){
        return(
            <div className="eSign-error-container" >
            
                <div className="login-item">
                    <div className="hd-text">
                    <p id="msg1" className="failuer-msg1">
                        Aadhaar ESign  </p>
                    <p id="msg2" className="failuer-msg2" >
                    Failed please try again after sometime</p>
                    <p id="msg3" className="failuer-msg2" style={{display:"none", paddingTop:"15%"}}>
                        You have already ESigned the document</p>
                    </div>
                </div>
            </div>
        )
    }
}