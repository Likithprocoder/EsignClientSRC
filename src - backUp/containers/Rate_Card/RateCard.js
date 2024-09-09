import React from 'react';
import {Badge, Button, Card, CardBody, CardHeader, Col, Row, Table, Input} from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { URL } from "../URLConstant";

let data = [
  { slNo: 1, amount: 10, units: 2 },
  { slNo: 2, amount: 50, units: 10 },
  { slNo: 3, amount: 100, units: 20 },
  { slNo: 4, amount: 500, units: 100 },
  { slNo: 5, amount: 1000, units: 200 },
  { slNo: 6, amount: 5000, units: 1000 },
];

export default class RateCard extends React.Component{
    constructor(){
        super();
        this.state = {
          customUnits: "",
          paymentType:"ESM"
        };
    }
    toQRCode(e){
        sessionStorage.setItem("amount", e)
        //sessionStorage.setItem("paymentType", this.state.paymentType);
         //this.props.history.push("/qrcode");
        let data = {
          paymentType: "ESM",
          amount:e
        };

        this.setState({ loaded: true });
        this.props.history.push({
          pathname: "/qrcode",
          frompath: "/rateCard",
          state: {
            details: data,
          },
        });
       
    }

    custUnitstoQrCode = () => {
        if(this.state.customUnits.length !==0 || this.state.customUnits.trim() !== ''){
             if (this.state.customUnits > 0) {
               // sessionStorage.setItem("amount", this.state.customUnits*5)
               //   sessionStorage.setItem("paymentType", this.state.paymentType);
               //   this.props.history.push("/qrcode");
               let data = {
                 paymentType: "ESM",
                 amount: this.state.customUnits * 5,
               };

               this.setState({ loaded: true });
               this.props.history.push({
                 pathname: "/qrcode",
                 frompath: "/rateCard",
                 state: {
                   details: data,
                 },
               });
             } else {
               confirmAlert({
                 message: "Units should be greater than zero",
                 buttons: [
                   {
                     label: "OK",
                     className: "confirmBtn",
                     onClick: () => {},
                   },
                 ],
               });
               //alert("Enter the Units")
             }
        }else{
            confirmAlert({
                message: "Enter the Units" ,
                buttons: [
                  {
                    label: 'OK',
                    className: 'confirmBtn',
                    onClick: () => { }
                  }
                ]
              })
            //alert("Enter the Units")
        }
    }


    handleCustom = (e) =>{
        let regNum = new RegExp(/^[0-9]*$/)
        let value = e.target.value
        if(regNum.test(e.target.value)){
            this.setState({customUnits: value})  
        }else{
            return false
        }
    }
    renderTableData(){
        return data.map((rate, index) => {
            return(
                <tr key={index}>
                    <td>{rate.slNo}</td>
                    <td>{rate.amount}</td>
                    <td>{rate.units}</td>
                    <td><Badge color="primary" style={{cursor: "pointer"}} onClick={() => this.toQRCode(rate.amount)}>TopUp</Badge></td>
                </tr>
            )
        })
    }

    render(){
        return(
            <div>
                <Row style = {{margin : "3% 0% 0% 0%"}}>
                    <Col xs="12" lg="7">
                        <Card>
                            <CardHeader>
                            <strong>Payment Options</strong>
                            </CardHeader>
                            <CardBody>
                                <Table hover bordered striped responsive  id = "paymentOption">
                                    <thead>
                                        <tr style = {{textAlign : "center"}}>
                                            <th>Sl. No.</th>
                                            <th>Currency in {URL.rupeeSymbol}.</th>
                                            <th>No. of Units</th>
                                            <th>Pay</th>
                                        </tr>
                                    </thead>
                                    <tbody id = "paymentOptionTbody">{this.renderTableData()}</tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>         
                </Row>
                <Row style = {{margin : "0% 0% 0% 0%"}}>
                    <Col xs="12" lg="5">
                        <Card>
                            <CardBody>
                                <Row>
                                    <b style={{padding:"0.35rem"}}>Custom :</b>
                                    <Input style={{width:"30%", padding:"0.35rem"}} type="text" placeholder="Enter Units" name="units" value={this.state.customUnits}
                                    onChange={this.handleCustom} autoComplete="off" maxLength="5"/>
                                    <Button color="primary" className="px-4" onClick={this.custUnitstoQrCode} style={{marginLeft:"15%"}}>TopUp Unit</Button>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>  
            </div>
        )
    }
}