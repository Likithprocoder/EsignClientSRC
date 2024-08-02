import React, { Component } from "react";
export default class TandC extends Component {
  constructor() {
    super();
    
  }

  render() {

    return (
      <div id="page_1">
        <div id="p1dimg1">
          <div class="dclr"></div>
          <b>
            <p style={{ textAlign: "center" }}>DocuExec Customer Agreement</p>
          </b>
          <div style={{ marginLeft: "10px" }}>
            <p class="p2 ft3">
              PLEASE READ CAREFULLY THE COMPLETE AGREEMENT BEFORE ACCEPTING AND
              USING DOCUEXEC SOFTWARE AND SERVICES PROVIDED.
            </p>
            <p class="p3 ft4">
              This is an agreement between you as the user and Integra Micro
              Systems Private Limited providing the DocuExec services for
              Digital Signing of documents and associated services (hereinafter
              referred to as Integra/Company/DocuExec) governing the usage of
              services and associated general and service specific terms
              (hereinafter referred to as Terms).
            </p>
            <b>
              {" "}
              <p class="p1 ft5">Terminologies</p>
            </b>
            <p class="p4 ft4">
              Govt./Government refers to the Government of India, and Law refers
              to the applicable Indian Law and all the legal
              entities/authorities referred herein refers to the
              courts/entities/authorities in India, unless otherwise it is
              explicitly referred. The jurisdiction for approaching the legal
              system will be Bangalore, India.
            </p>
            <b>
              <p class="p1 ft5">Acceptance of Terms and Usage of service</p>
            </b>
            <p class="p5 ft4">
              You are of legal age to legally accept to the Terms, and entitled
              to use the software. You must register with valid identity and
              address proof as permitted by the Govt., and ensure that they are
              updated in the system whenever there is any change.
            </p>
            <p class="p6 ft6">
              You must have read and understood and agree to the Terms published
              time to time on the Terms. Company reserves the right to notify or
              update on its portal or enforce through usage time reading.
            </p>
            <p class="p7 ft7">
              You must be aware on the risks of online registration, and
              vulnerabilities and damages that may arise out of such
              vulnerabilities. You agree that the risks involved in using of the
              services including loss of personal information or data inspite of
              the safeguarding mechanisms and efforts put in place by the
              Company to prevent any such incidents, and you absolve the Company
              free from any liabilities and legal actions.
            </p>
            <p class="p8 ft4">
              You agree that in the event of identification of wrong information
              provided or managed by you, or breaching of the Terms, or misuse
              of the services, or indulging in tampering of any records or
              causing disruptions to the services, the Company can take up legal
              actions including and not limited to suspending or terminating the
              services to you and/or terminating your account.
            </p>
            <b>
              <p class="p1 ft5">Payments And Refunding</p>
            </b>
            <p class="p5 ft3">
              The payments are accepted in Indian Rupees and should be paid from
              a legally accepted source of funds in the Country.
            </p>
            <p class="p9 ft8">
              The payments to be made for use of services are to be evaluated by
              you based on your needs. Refund of money paid for a services is
              not permitted. However, in the event of Company declaring its
              infeasibility of providing the services due to any termination of
              continuation of business in the committed services, it may review
              and consider your refund request at its own discretion after
              evaluating the duration and quantity of services used out of the
              paid amount.
            </p>
          </div>
        </div>
        <div style={{ marginLeft: "10px" }}>
          {/* <div id="page_2"> */}
          {/* <div id="p2dimg1"> */}
          {/* <div class="dclr"></div> */}
          {/* <p class="p11 ft4"> */}
          {/* of providing the services due to any termination of continuation
                of business in the committed services, it may review and
                consider your refund request at its own discretion after
                evaluating the duration and quantity of services used out of the
                paid amount. */}
          {/* </p> */}
          <p class="p12 ft3">eSign Services</p>
          <p class="p13 ft4">
            You agree that the eSign services are extended through Esign
            Services Provider (ESP) partner, in turn depends on the eKYC related
            services offered by UIDAI (Aadhaar). Availability of these services
            depends on the availability of services from these entities.
          </p>
          <p class="p14 ft9">
            You agree that the eSign services may require your Aadhaar number or
            Virtual ID, and linked mobile number to receive OTP. DocuExec
            doesn’t store your Aadhaar number. However, any storing of the same
            along with eKYC data at ESP or CA (Certifying Authority) level is
            outside the purview of DocuExec.
          </p>
          <p class="p15 ft3">
            I read, and understood all the terms and conditions of this
            document. I accept all the above terms and conditions stated in this
            document.
          </p>
          {/* </div> */}

          {/* </div> */}
        </div>
      </div>
    );
  }
}
