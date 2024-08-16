import React from 'react';

export default class Recharge extends React.Component{


    render(){
        return(
            <div className="eSign-error-container" >
                <div className="login-item">
                    <div className="hd-text">
                    <p className="failuer-msg1">
                        Insufficient Units  </p>
                    <p className="failuer-msg2">
                    Please Topup units to continue with Esign</p>
                    </div>
                </div>
            </div>
        )
    }
}