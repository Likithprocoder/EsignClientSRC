import React, { useEffect, useState } from 'react'
import { memo } from 'react'
import Dropzone from "react-dropzone";
import './HtmlUpload.css';
import { confirmAlert } from 'react-confirm-alert'

var Loader = require("react-loader");

function HtmlUpload1(props) {
  if (props.location.hash !== "") {
    let hashData = (props.location.hash).split("&");
    let hashDataJs = {};
    for (let key in hashData) {
      let [keyz, value] = hashData[key].split("=");
      hashDataJs[keyz] = value;
    }
  }

  const [file, setFile] = useState({})

  const [allowToRotate, setAllowToRotate] = useState(true);

  const [valid, setValid] = useState({
    showFileName: true,
    filename: "",
    fileSize: ""
  })

  const onDrop = (e) => {
    setAllowToRotate(false);
    setFile(e);
    let file = e;
    let filesArray = [].slice.call(file);
    filesArray.forEach(element => {
      if (element.type === "text/html") {
        let fileName = element.name;
        let OfileName = fileName.split('.')[0];
        let filesize = element.size;
        let OfileSize = filesize / 1000;
        setValid({
          showFileName: false,
          filename: OfileName,
          fileSize: OfileSize
        })
        document.getElementById("btnToProceed").style.cursor = 'pointer';
      }
      else {
        confirmAlert({
          message: "invalid file! please select html file",
          buttons: [
              {
                  label: "OK",
                  className: "confirmBtn",
                  onClick: () => {
                    props.history.push("/htmlUpload");
                  },
              },
          ],
      });        
      }
    });
    setAllowToRotate(true);
  }

  const HtmlSelected = () => {
    if (valid.showFileName) {
      return (
        <div className='UPLDIV1 container'>
          <div className='container'>
            <span className='drophtml'>Drop Html Template File Here</span>
            <br />
            <span className='or'>OR</span>
            <br />
            <span> <input className="uploadfilebtn" value="Upload File" readOnly /></span>
          </div>
          <input type="file" className='inputhidden'></input>
        </div>
      )
    }
    else {
      return (
        < >
          <span className='afterHtmlSelection'> {valid.filename}-{valid.fileSize} KB </span>
        </>
      )
    }
  }

  function proceedBy() {

    props.history.push({
      pathname: "/templatePreview",
      frompath: "/uploadTemplate",
      state: {
        htmlFile: file
      }
    })
  }

  return (
    <>
      <Loader
        loaded={allowToRotate}
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
      <div className='container'>
        <div className='nameAndInput'>
          < >
            <h4> Upload Html Template File </h4>
          </>
          <Dropzone
            type="file"
            accept={[".html"]}
            className="inner-content"
            onDrop={e => onDrop(e)}
          >
            <div className="text-container">{HtmlSelected()}</div>
          </Dropzone>
        </div>
      </div>
      <div style={{ paddingTop: "40px", width: "100%", textAlign: "-webkit-center" }}>
        <button disabled={valid.showFileName} onClick={proceedBy} id='btnToProceed' style={{ cursor: 'not-allowed' }} className='upload-button'> <span>Proceed</span></button>
      </div>
    </>

  )
}

export default memo(HtmlUpload1)