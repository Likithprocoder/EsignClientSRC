import React from 'react';
import { Button, Card, CardBody, CardHeader, Col, Row, Table} from 'reactstrap';
import { URL } from "../URLConstant";
import "react-confirm-alert/src/react-confirm-alert.css";
import { confirmAlert } from "react-confirm-alert";
import PDF1 from "../Download/PDF1";
var Loader = require("react-loader");
export default class Payment extends React.Component {
  constructor() {
    super();
    this.state = {
      balanceUnit: "",
      isConsentdisable: true,
      loadeSignTopUpComponent: false,
      loaded: true,
      isdisable: true,
    };
  }

  componentWillMount() {
    
      if(sessionStorage.getItem("is_KYC_verified")==1){
        this.setState({isdisable:false})
      }else{

  confirmAlert({
    message: "KYC verification is required to perform eSign TopUp.",
    buttons: [
      {
        label: "OK",
        className: "confirmBtn",
        onClick: () => {},
      },
    ],
  });
  
// document.getElementById("eSignTopUpId").style.cursor="no-drop";
 
        
     
        
        
      }
        

    if (sessionStorage.getItem("consenteSign") === "true") {
      if (sessionStorage.getItem("consentFlag") === "N") {
       
        // this.onOpenFirstModel();

      } else {
     
        this.setState({ loadeSignTopUpComponent: true });
      }
    } else {
      
      this.setState({ loadeSignTopUpComponent: true });
    }
  }

  componentDidMount() {
    if (this.state.loadeSignTopUpComponent) {
    } else {
      if (this.state.isConsentdisable) {
        let element = document.getElementById("submitConsentbutton");
        element.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
        element.style.cursor = "no-drop";
      }
    }
  }
  onBalanceUnit = (e) => {
    let value = e.target.value;
    this.setState({
      balanceUnit: value,
    });
  };

  onTopUp = () => {
    this.props.history.push("/rateCard");
  };

  onConsentChecked = () => {
    var checkedbox = document.getElementById("consentSigningCheckbox");
    let element1 = document.getElementById("submitConsentbutton");

    if (checkedbox.checked) {
      this.setState({ isConsentdisable: false });
      element1.style.backgroundColor = "#1DD1A1";
      element1.style.cursor = "pointer";
    } else {
      this.setState({ isConsentdisable: true });
      element1.style.backgroundColor = "rgba(96, 218, 185, 0.78)";
      element1.style.cursor = "no-drop";
    }
  };

  consenteSign = () => {
    let response_data = {};
    var body = {
      loginname: sessionStorage.getItem("username"),
      authToken: sessionStorage.getItem("authToken"),
      userIP: sessionStorage.getItem("userIP"),
      consentTnC: "consentTnC",
      docCode: "DOEXCONSENT",
    };
    this.setState({ loaded: false });
    fetch(URL.consenteSign, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJson) => {
        response_data = responseJson;
        if (responseJson.status === "SUCCESS") {
          this.setState({ loaded: true });
          sessionStorage.setItem(
            "download_data",
            JSON.stringify(response_data)
          );
         
          let data = {
            mode: this.state.selectedMode,
            docId: responseJson.docid,
          };
          sessionStorage.setItem("consentFlag", "Y");
          this.props.history.push({
            pathname: "/download/tokenSignDownload",
            frompath: "/preview",
            state: {
              details: data,
            },
          });
          // }
        } else {
          this.setState({ loaded: true });
          confirmAlert({
            message: responseJson.statusDetails,
            buttons: [
              {
                label: "OK",
                className: "confirmBtn",
                onClick: () => {},
              },
            ],
          });
          //alert(responseJson.statusDetails)
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
  };

  render() {
       if (this.state.loadeSignTopUpComponent) {
         return (
           <div>
             <Row>
               <Col>
                 <CardBody>
                   <Row>
                     <Col>
                       <b style={{ padding: "0% 0% 0% 0%" }}>
                         Available Balance :{" "}
                       </b>
                       {sessionStorage.getItem("units")}
                     </Col>
                   </Row>
                 </CardBody>
               </Col>
             </Row>
             <Row>
               <Col lg="6">
                 <Card>
                   <CardHeader>
                     <b>eSign Cost </b>
                   </CardHeader>
                   <CardBody>
                     <Table
                       hover
                       bordered
                       striped
                       responsive
                       style={{ marginBottom: "0" }}
                     >
                       <thead>
                         <tr style={{ textAlign: "center" }}>
                           <th>Sl. No.</th>
                           <th>eSign Pages</th>
                           <th>No. Units</th>
                         </tr>
                       </thead>
                       <tbody style={{ textAlign: "center" }}>
                         <tr>
                           <td>1</td>
                           <td>Single Page eSign</td>
                           <td>2</td>
                         </tr>
                         <tr>
                           <td>2</td>
                           <td>Multi Page eSign</td>
                           <td>2</td>
                         </tr>
                       </tbody>
                     </Table>
                   </CardBody>
                 </Card>
               </Col>
             </Row>
             <Row>
               <Col xs="6">
                 <Button
                 id="eSignTopUpId" 
                 disabled={this.state.isdisable}
                   color="primary"
                   className="px-4"
                   onClick={this.onTopUp}
                 >
                   TopUp
                 </Button>
               </Col>
             </Row>
           </div>
         );
       } else {
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
             <div id="pdfContainerdiv" style={{ height: "80vh" }}>
            {/* <div
              className="embedtag-container"
              id="viewaftersigning"
              style={{ height: "100%" }}
            > */}
              {/* <embed
                title="PDF preview"
                type="application/pdf"
                src={
                  URL.viewConsentFile +
                  "?at=" +
                  btoa(sessionStorage.getItem("authToken"))
                }
                width="100%"
                height="100%"
              /> */}
              {/* <br id="1" />
              <br id="2" /> */}
              <PDF1
                /* title="PDF preview"
                ref="iframe"
                type="application/pdf" */
                url={
                  URL.viewConsentFile +
                  "?at=" +
                  btoa(sessionStorage.getItem("authToken"))
                }
                /* width="100%"
                height="100%"
                hidden */
              />
              <div style={{marginTop: "20px"}}>
            <input
              type="checkbox"
              name="acceptance"
              id="consentSigningCheckbox"
              onChange={this.onConsentChecked}
            ></input>
            <label id="consentSigningLable" style={{ fontSize: "16px" }}>
              &nbsp; I agree with all the terms and conditions of DocuExec
            </label>
          </div>
            {/* </div> */}
          </div> 
             {/* <br></br> */}
             {/* <div>
               <input
                 type="checkbox"
                 name="acceptance"
                 id="consentSigningCheckbox"
                 onChange={this.onConsentChecked}
               ></input>
               <label id="consentSigningLable" style={{ fontSize: "16px" }}>
                 &nbsp; I agree with all the terms and conditions of DocuExec
               </label>
             </div> */}

             <div className="next-nav">
               <button
                 className="upload-button"
                 id="submitConsentbutton"
                 disabled={this.state.isConsentdisable}
                 onClick={this.consenteSign.bind(this)}
                 style={{ margin: "auto" }}
               >
                 <span>Submit &#8594;</span>
               </button>
             </div>
           </div>
          );
       
  }
}
}