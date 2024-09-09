import React, { Component } from "react";
import { Card, CardBody, Col, Row, CardHeader, Button } from "reactstrap";
import "./css/style.css";
import "./subscription.css";
import logo from "./assets/img/logo.png";
import integra from "./assets/img/7i.png";
import document from "./assets/img/document.png";
import menu from "./assets/img/menu.png";
import { URL } from "../URLConstant";
import $, { event } from "jquery";
import { FormatItalic } from "@material-ui/icons";
import DemoVideoPage from "./DemoVideoPage";
import { Link } from "react-router-dom";
import DemoVideo1 from "./assets/img/DemoVideo1.jfif";
import slidingImag2 from "./assets/img/image2.jpeg";
import slidingImag4 from "./assets/img/image1.png";
import slidingImag3 from "./assets/img/image3.png";

// import SimpleImageSlider from "react-simple-image-slider";
// let slideIndex = 0;

export default class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responsedata: [],
      image: "",
      maxHeight: "70vh",
    };
  }

  listenScrollEvent = (e) => {
    e.preventDefault();
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };

  componentDidMount() {
    // console.log(this.detectMob());
    if (this.detectMob()) {
      this.setState({ maxHeight: "28vh" });
      // document.getElementsByClassName("carousel-inner").style.maxHeight="28vh";
    }
    window.addEventListener("scroll", this.listenScrollEvent);
    var body = {
      username: "",
    };
    this.setState({ loaded: false });
    fetch(URL.getSubscriptionLists, {
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
        if (responseJson.status === "SUCCESS") {
          this.setState({ responsedata: responseJson.list });
        }
      })
      .catch((e) => {
        this.setState({ loaded: true });
        alert(e);
      });
  }
  detectMob() {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.listenScrollEvent);
  }

  // getData() {
  //   setTimeout(() => {
  //     let data = document.getElementById("mainNav");
  //           console.log(data);

  //     let imageAnim = document.getElementById("image-animate");
  //     let imageArray = [slidingImag1, slidingImag2, slidingImag3];

  //     let imageIndex = 0;

  //     const startImage = () => {
  //       this.setState({ image: imageArray[imageIndex] });
  //       imageAnim.setAttribute("src", imageArray[imageIndex]);

  //       imageIndex++;
  //       if (imageIndex >= imageArray.length) {
  //         imageIndex = 0;
  //       }
  //     };

  //     setInterval(startImage, 800);
  //   }, 1000);
  // }

  createUI() {
    return this.state.responsedata.map((el, i) => (
      <div className="align-items-center">
        <div key={i}>
          <Col xs="11" sm="4" md="3">
            <Card id="subscard">
              <CardHeader>
                <div id="discriptionspan">
                  <b>{el.descrip}</b>
                  <br />
                </div>
              </CardHeader>
              <CardBody>
                <p id="amountspan">
                  <b>₹ {el.amount}</b>
                </p>
                <p id="paratag">
                  {el.signs} Electronic Signs
                  <br />
                  &nbsp;{el.storage} Storage
                  <br />
                </p>
                <button
                  className="aggree-button"
                  onClick={this.esignClick}
                  id="buyBtn"
                  name={el.amount}
                >
                  <span>Login</span>
                </button>
              </CardBody>
            </Card>
          </Col>
        </div>
      </div>
    ));
  }

  // showSlides() {
  //   let i;
  //   let slides = document.getElementsByClassName("mySlides");
  //   let dots = document.getElementsByClassName("dot");
  //   for (i = 0; i < slides.length; i++) {
  //     slides[i].style.display = "none";
  //   }
  //   slideIndex++;
  //   if (slideIndex > slides.length) {
  //     slideIndex = 1;
  //   }
  //   for (i = 0; i < dots.length; i++) {
  //     dots[i].className = dots[i].className.replace(" active", "");
  //   }
  //   slides[slideIndex - 1].style.display = "block";
  //   dots[slideIndex - 1].className += " active";
  //   setTimeout(this.showSlides, 2000); // Change image every 2 seconds
  // }

  menuClick = (event) => {
    event.preventDefault();
    var self = event.target;
    var scrollTo = $(self).attr("href");
    // console.log(scrollTo)
    if (scrollTo != null && scrollTo != "") {
      $("html, body").animate(
        {
          scrollTop: $(scrollTo).offset().top,
        },
        500
      );
    }
  };

  esignClick = () => {
    this.props.history.push("/login");
    window.location.reload(false);
  };

  subscriptionClick = () => {
    this.props.history.push("/subscriptions");
    // window.location.reload(false);
  };

  loginPage = () => {
    this.props.history.push("/login");
    window.location.reload(false);
  };

  registerPage = () => {
    this.props.history.push("/register");
    window.location.reload(false);
  };

  DemoVideoPage = () => {
    this.props.history.push("/DemoVideoPage");
  };

  render() {
    // const images = [
    //   // { url: slidingImag1 },
    //   { url: slidingImag2 },
    //   { url: slidingImag3 },
    // ];

    return (
      <div id="landingPage">
        <nav
          className="navbar navbar-expand-lg navbar-dark fixed-top"
          id="mainNav"
          style={{ height: "72px" }}
        >
          <div className="container">
            <a className="navbar-brand js-scroll-trigger" href="#page-top">
              <img src={logo} alt="" />
            </a>
            <button
              className="navbar-toggler navbar-toggler-right"
              type="button"
              data-toggle="collapse"
              data-target="#navbarResponsive"
              aria-controls="navbarResponsive"
              aria-expanded="false"
              aria-label="Toggle navigation"
              id="btnMenu"
              style={{
                backgroundColor: "#20a8d8",
              }}
            >
              Menu
              <img
                src={menu}
                className="img-responsive"
                style={{ marginLeft: "5px" }}
              />
            </button>
            <div className="collapse navbar-collapse" id="navbarResponsive">
              <ul className="navbar-nav text-uppercase ml-auto">
                <li className="nav-item">
                  <a
                    className="nav-link js-scroll-trigger"
                    onClick={this.menuClick}
                    href="#services"
                  >
                    Services
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link js-scroll-trigger"
                    onClick={this.menuClick}
                    href="#about"
                  >
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link js-scroll-trigger"
                    onClick={this.menuClick}
                    href="#subscriptions"
                  >
                    Subscriptions
                  </a>
                </li>
                {/* <li className="nav-item">
                  <a
                    className="nav-link js-scroll-trigger"
                    onClick={this.menuClick}
                    href="#contact"
                  >
                    Contact
                  </a>
                </li> */}
                <li className="nav-item" style={{marginBottom:"5px"}}>
                  <Button
                    color="primary"
                    className="px-4"
                    onClick={this.loginPage}
                  >
                    Login
                  </Button>
                </li>
                <li className="nav-item">
                  <Button
                    color="primary"
                    className="px-4"
                    onClick={this.registerPage}
                  >
                    Register Now
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* Masthead */}
        {/* <header className="masthead">
          <div className="container">
            <div className="masthead-subheading">Welcome To DocuExec</div>
            <div className="masthead-heading">
              <span>Document execution on the </span>
              <span>
                <i style={{ fontFamily: "initial" }}>Go!</i>
              </span>
            </div>
          </div>
        </header> */}
        {/* <header> */}
        {/* <div class="slideshow-container">

<div class="mySlides fade">
  <div class="numbertext">1 / 3</div>
  <img src={slidingImag1} style="width:100%"/>
  <div class="text"><div className="container">
            <div className="masthead-subheading">Welcome To DocuExec</div>
            <div className="masthead-heading">
              <span>Document execution on the </span>
              <span>
                <i style={{ fontFamily: "initial" }}>Go!</i>
              </span>
            </div>
          </div></div>
</div>

<div class="mySlides fade">
  <div class="numbertext">2 / 3</div>
  <img src={slidingImag2} style="width:100%"/>
  <div class="text">Caption Two</div>
</div>

<div class="mySlides fade">
  <div class="numbertext">3 / 3</div>
  <img src={slidingImag3} style="width:100%"/>
  <div class="text">Caption Three</div>
</div>

</div>
<br/>

<div style="text-align:center">
  <span class="dot"></span> 
  <span class="dot"></span> 
  <span class="dot"></span> 
</div> */}

        {/* <br />
          <SimpleImageSlider
            width={"75%"}
            height={"75%"}
            images={images}
            showBullets={false}
            showNavs={true}
            autoPlay={true}
            autoPlayDelay={2.0}
          /> */}
        {/* <br />
        <br />
        <br />

        <div class="wrapper">
          <img src={this.state.image} alt="" id="image-animate" />
        </div> */}
        <br />
        <br />
        <br />
        <header>
          <div
            style={{ backgroundColor: "#d1cfc9" }}
            id="carouselExampleIndicators"
            class="carousel slide"
            data-ride="carousel"
          >
            <ol class="carousel-indicators">
              <li
                data-target="#carouselExampleIndicators"
                data-slide-to="0"
                class="active"
              ></li>
              <li
                data-target="#carouselExampleIndicators"
                data-slide-to="1"
              ></li>
              <li
                data-target="#carouselExampleIndicators"
                data-slide-to="2"
              ></li>
            </ol>
            <div
              class="carousel-inner"
              style={{
                maxHeight: this.state.maxHeight,
                backgroundColor: "##d1cfc9",
              }}
            >
              <div class="carousel-item active">
                <img
                  //style={{
                  /* object-fit: none; */
                  // align:"center",
                  // display: "block",
                  // marginLeft: "auto",
                  // marginRight: "auto",
                  // backgroundColor: "#d1cfc9",
                  // maxHeight: "-webkit-fill-available",
                  // }}
                  class="d-block w-100"
                  src={slidingImag4}
                  alt="First slide"
                />
              </div>
              <div class="carousel-item" style={{ width: "100%" }}>
                <img
                  style={
                    {
                      /* object-fit: none; */
                      // align:"center",
                      // display: "block",
                      // marginLeft: "auto",
                      // marginRight: "auto",
                      // maxHeight: "-webkit-fill-available",
                    }
                  }
                  // class="d-block "
                  class="d-block w-100"
                  src={slidingImag2}
                  alt="Second slide"
                />
              </div>
              <div class="carousel-item">
                <img
                  // style={{
                  /* object-fit: none; */
                  // align:"center",
                  // display: "block",
                  // marginLeft: "auto",
                  // marginRight: "auto",
                  // maxHeight: "-webkit-fill-available",
                  // }}
                  // class="d-block "

                  class="d-block w-100"
                  src={slidingImag3}
                  alt="Third slide"
                />
              </div>
            </div>
            <a
              class="carousel-control-prev"
              href="#carouselExampleIndicators"
              role="button"
              data-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Previous</span>
            </a>
            <a
              class="carousel-control-next"
              href="#carouselExampleIndicators"
              role="button"
              data-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </header>
        {/* Services */}
        <section className="page-section" id="services">
          <div className="container">
            <div className="text-center">
              <h2 className="section-heading text-uppercase">Services</h2>
            </div>
            <div className="row text-center" id="signDoc">
              <div className="col-md-4" id="signDoc2">
                <img
                  src={document}
                  className="img-responsive"
                  id="aadhareSign"
                  onClick={this.esignClick}
                />
                <h4 className="my-3">Sign Document</h4>
                <p className="text-muted">
                  <a href="/login">Click here</a> to sign your document with
                  Aadhaar eSign/Electronic Sign/DSC Token/OTP Based Sign
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* <section className="page-section" id="DemoVedios">
          <div className="container">
            <div className="text-center">
              <h2 className="section-heading text-uppercase">
                Document Execution Demo
              </h2>
            </div> */}
        {/* <div className="row text-center" id="signDoc">
              <div className="col-md-4" id="signDoc2">
                <div className="timeline-image">
                  <Link to="/DemoVideoPage">
                    <img
                      style={{ width: "47%" }}
                      title="Play"
                      className="rounded-circle img-fluid"
                      src={DemoVideo1}
                      alt=""
                    />
                  </Link>
                </div>
                <br></br>
                <p className="text-muted">
                  Sample videos of Document Execution with and without
                  eStamping.
                </p>
              </div>
            </div> */}
        {/* </div>
         </section> */}
        {/* About */}
        <section className="page-section" id="about">
          <div className="container">
            <div className="text-center">
              <h2 className="section-heading text-uppercase">About</h2>
            </div>
            <ul className="timeline">
              <li>
                <div className="timeline-image">
                  <img
                    className="rounded-circle img-fluid"
                    src={integra}
                    alt=""
                  />
                </div>
                <div className="timeline-panel">
                  <div className="timeline-heading">
                    <h4 style={{ marginLeft: "-1%" }}>
                      Integra Micro Systems Private Ltd.
                    </h4>
                  </div>
                  <div className="timeline-body">
                    <p className="text-muted">
                      Integra is a leading provider of innovative hi-technology
                      products and solutions in the Government, BFSI and telecom
                      space, with a focus on India and Africa.
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>
        <section className="page-section" id="subscriptions">
          <div className="container">
            <div className="text-center">
              <h2 className="section-heading text-uppercase">SubscriptionS</h2>
            </div>
            <div>
              <Row className="align-items-center">
                <br></br>
                {this.createUI()}
              </Row>
            </div>
          </div>
        </section>
        {/* <section className="page-section" id="contact">
          <div className="container">
            <div className="text-center">
              <h2 className="section-heading text-uppercase">Contact Us</h2>
            </div>
            <form id="contactForm" name="sentMessage" noValidate="novalidate">
              <div className="row align-items-stretch mb-5">
                <div className="col-md-6">
                  <div className="form-group">
                    <input
                      className="form-control"
                      id="name"
                      type="text"
                      placeholder="Your Name *"
                      required="required"
                      data-validation-required-message="Please enter your name."
                    />
                    <p className="help-block text-danger"></p>
                  </div>
                  <div className="form-group">
                    <input
                      className="form-control"
                      id="email"
                      type="email"
                      placeholder="Your Email *"
                      required="required"
                      data-validation-required-message="Please enter your email address."
                    />
                    <p className="help-block text-danger"></p>
                  </div>
                  <div className="form-group mb-md-0">
                    <input
                      className="form-control"
                      id="phone"
                      type="tel"
                      placeholder="Your Phone *"
                      required="required"
                      data-validation-required-message="Please enter your phone number."
                    />
                    <p className="help-block text-danger"></p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group form-group-textarea mb-md-0">
                    <textarea
                      className="form-control"
                      id="message"
                      placeholder="Your Message *"
                      required="required"
                      data-validation-required-message="Please enter a message."
                    ></textarea>
                    <p className="help-block text-danger"></p>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div id="success"></div>
                <button
                  className="btn btn-primary btn-xl text-uppercase"
                  id="sendMessageButton"
                  type="submit"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </section> */}
        <hr></hr>
        <footer className="footer py-4">
          <div className="container">
            <div className="">
              <div className="">{URL.footerContent}</div>
              {/* <div className="col-lg-4 my-3 my-lg-0">
                                <a className="btn btn-dark btn-social mx-2" href="#!"><i className="fab fa-twitter"></i></a>
                                <a className="btn btn-dark btn-social mx-2" href="#!"><i className="fab fa-facebook-f"></i></a>
                                <a className="btn btn-dark btn-social mx-2" href="#!"><i className="fab fa-linkedin-in"></i></a>
                            </div> */}
              <div className="col-lg-4 text-lg-right">
                <a className="mr-3" href="#!" hidden>
                  Privacy Policy
                </a>
                <a href="#!" hidden>
                  Terms of Use
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}
