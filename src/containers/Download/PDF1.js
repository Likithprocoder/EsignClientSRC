
import React from "react";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const PDF1 = (props) => {
  console.log("finish prop in PDF1:", props.finish);
  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  // Define the toolbar transform logic
  let transform = (slot) => {
    console.log("Transform function is called");
    if (props.finish === true) {
      console.log("props.finish is true");
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
    } else {
      console.log("props.finish is false");
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
  );
};

export default PDF1;


