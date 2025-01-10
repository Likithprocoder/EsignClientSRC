
import React, { useState } from "react";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

var Loader = require("react-loader");

const PDF1 = (props) => {
  // console.log(props);
  // const [loaded, setLoaded] = useState(true);
  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  // Custom download function to download PDF with the original filename
  const handleDownload = async () => {
    try {
      const response = await fetch(props.url);
      const blob = await response.blob();

      // Create a link element for downloading the file
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = props.filename || "View Signed file.pdf"; // Set the desired filename here
      link.click();

      // Clean up
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Failed to download the file", error);
    }
  };

  // Define the toolbar transform logic
  let transform = (slot) => {
    if (props.finish === true) {
      // Download option is visible when finish is true
      return {
        ...slot,
        Open: () => <></>,
        OpenMenuItem: () => <></>,
        EnterFullScreen: () => <></>,
        EnterFullScreenMenuItem: () => <></>,
        SwitchTheme: () => <></>,
        SwitchThemeMenuItem: () => <></>,
        Print: () => <></>,
        PrintMenuItem: () => <></>,
        // PrintMenuItem: () => (
        //   <button onClick={handlePrint} className="rpv-core__button" aria-label="Print PDF" style={{ marginLeft: "11%", backgroundColor: "white" }}>
        //     Print
        //   </button>
        //   ),
        // Download: () => <></>,
        DownloadMenuItem: () => (
          <button onClick={handleDownload} className="rpv-core__button" style={{ marginLeft: "11%", backgroundColor: "white" }}>
           Download
          </button>
        ),
        Zoom: () => <></>,
        ZoomOut: () => <></>,
        ZoomOutMenuItem: () => <></>,
        ZoomIn: () => <></>,
        ZoomInMenuItem: () => <></>,
        Rotate: () => <></>,
        RotateBackwardMenuItem: () => <></>,
        RotateForwardMenuItem: () => <></>,
        SwitchScrollMode: () => <></>,
        SwitchScrollModeMenuItem: () => <></>,
        Download: () => (
              <button onClick={handleDownload} className="rpv-core__button">
                <i class="fa fa-download" aria-hidden="true" title="Download"></i>
              </button>
        ),
        // Print: () => (
        //   <button onClick={handlePrint} className="rpv-core__button" aria-label="Print PDF">
        //     <i className="fa fa-print" aria-hidden="true"></i>
        //   </button>
        // ),
      };
    } else {
      // Download option is hidden when finish is false
      return {
        ...slot,
        Open: () => <></>,
        OpenMenuItem: () => <></>,
        EnterFullScreen: () => <></>,
        EnterFullScreenMenuItem: () => <></>,
        SwitchTheme: () => <></>,
        SwitchThemeMenuItem: () => <></>,
        Print: () => <></>,
        PrintMenuItem: () => <></>,
        Download: () => <></>, // Hide download button
        DownloadMenuItem: () => <></>, // Hide download menu item
        Zoom: () => <></>,
        ZoomOut: () => <></>,
        ZoomOutMenuItem: () => <></>,
        ZoomIn: () => <></>,
        ZoomInMenuItem: () => <></>,
        Rotate: () => <></>,
        RotateBackwardMenuItem: () => <></>,
        RotateForwardMenuItem: () => <></>,
        SwitchScrollMode: () => <></>,
        SwitchScrollModeMenuItem: () => <></>,
      };
    }
  };

  return (
    <div>
    {/* <Loader
          loaded={loaded}
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
        /> */}
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js">
      <div
        className="rpv-core__viewer"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '86%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            backgroundColor: 'rgba(203, 200, 200, 1)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
            display: 'flex',
            padding: '0.25rem',
          }}
        >
          <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
        </div>
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <Viewer
            fileUrl={props.url}
            plugins={[toolbarPluginInstance]}
            defaultScale={SpecialZoomLevel.PageWidth}
          />
        </div>
      </div>
    </Worker>
    </div>
  );
};

export default PDF1;


