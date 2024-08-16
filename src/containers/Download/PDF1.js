
import React from "react";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const PDF1 = (props) => {
  // console.log(props.url);
    const toolbarPluginInstance = toolbarPlugin();
    const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

    const transform = (slot) => {
      return {
        ...slot,
        Open: () => <></>,
        OpenMenuItem: () => <></>,
        EnterFullScreen: () => <></>,
        EnterFullScreenMenuItem: () => <></>,
        SwitchTheme: () => <></>,
        SwitchThemeMenuItem: () => <></>,
      };
    };

    return (
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js">
          {/* <div className="parent-div" id="parent-div" style={{ width: "100%" }}> */}
        <div
            className="rpv-core__viewer"
            style={{
                // border: '1px solid rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                height: '86%',
            }}
        >
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: 'rgba(203, 200, 200, 1)',
                    // backgroundColor: '#eeeeee',
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
                <Viewer fileUrl={props.url} plugins={[toolbarPluginInstance]} defaultScale={SpecialZoomLevel.PageWidth}/>
            </div>
        </div>
        {/* </div> */}
      </Worker>
    );
};

export default PDF1;
