// import React, {Component} from 'react';
// //import $ from 'jquery';
// //https://pspdfkit.com/blog/2018/open-pdf-in-react/
// import ReactDOM from 'react-dom';
// //import PDFObject from './pdfobject';

// class PDF extends Component{
// 	constructor(props){
// 	super(props)
// 		this.state = {
// 			url : this.props.url,
			
// 		}
// 	}

// 	componentDidMount () {
// 		// console.log(this.state.url);
// 		if(navigator.userAgent.indexOf("Chrome") !== -1 ){
// 			let iframe = ReactDOM.findDOMNode(this.refs.iframe)
// 			iframe.remove()
// 		}
// 	}

//  	getPdfPreview = () => {
// 		 if(navigator.userAgent.indexOf("Firefox") !== -1 ) {
// 				alert("Sorry, your browser does not support for preview")
// 		}
		
//     }

//     render(){
//         return (
//           <div className="embedtag-container" id="viewaftersigning">
//             <embed
//               title="PDF preview"
//               type="application/pdf"
//               src={this.props.url}
//               width="100%"
//               height="100%"
//             />
//             <br id="1" />
//             <br id="2" />
//             <iframe
//               title="PDF preview"
//               ref="iframe"
//               type="application/pdf"
//               src={this.props.url}
//               width="100%"
//               height="100%"
//               hidden
//             ></iframe>
//           </div>
//         );
//     }
// }
// export default PDF
////////////////////////////////////////////////////////////////////////////
// import React from "react";
// import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
// import { toolbarPlugin } from '@react-pdf-viewer/toolbar';
// import '@react-pdf-viewer/core/lib/styles/index.css';
// import '@react-pdf-viewer/toolbar/lib/styles/index.css';

// const PDF1 = (props) => {
//   console.log(props.url);
//     const toolbarPluginInstance = toolbarPlugin();
//     const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

//     const transform = (slot) => {
//       return {
//         ...slot,
//         Open: () => <></>,
//         OpenMenuItem: () => <></>,
//         EnterFullScreen: () => <></>,
//         EnterFullScreenMenuItem: () => <></>,
//         SwitchTheme: () => <></>,
//         SwitchThemeMenuItem: () => <></>,
//       };
//     };

//     return (
//       <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js">
//           {/* <div className="parent-div" id="parent-div" style={{ width: "100%" }}> */}
//         <div
//             className="rpv-core__viewer"
//             style={{
//                 // border: '1px solid rgba(0, 0, 0, 0.3)',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 height: '86%',
//             }}
//         >
//             <div
//                 style={{
//                     alignItems: 'center',
//                     backgroundColor: 'rgba(203, 200, 200, 1)',
//                     // backgroundColor: '#eeeeee',
//                     borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
//                     display: 'flex',
//                     padding: '0.25rem',
//                 }}
//             >
//                 <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
//             </div>
//             <div
//                 style={{
//                     flex: 1,
//                     overflow: 'hidden',
//                 }}
//             >
//                 <Viewer fileUrl={props.url} plugins={[toolbarPluginInstance]} defaultScale={SpecialZoomLevel.PageWidth}/>
//             </div>
//         </div>
//         {/* </div> */}
//       </Worker>
//     );
// };

// export default PDF1;

////////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";


const PDF = (props) => {
  // const [fileUrl, setFileUrl] = useState(props);
//   const defaultLayoutPluginInstance = defaultLayoutPlugin({
//     sidebarTabs: (defaultTabs) => [],
// });

return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.10.377/build/pdf.worker.min.js">
            <div className="parent-div" id="parent-div" style={{ width: "100%" }}>
          {/* <div
              className="rpv-core__viewer"
              style={{
                  border: '1px solid rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '70%',
              }}
          >
              <div
                  style={{
                      flex: 1,
                      overflow: 'hidden',
                  }}
              > */}
                  <Viewer fileUrl={props.url} plugins={[defaultLayoutPlugin]}/>
              {/* </div>
          </div> */}
          </div>
        </Worker>
      );
}

export default PDF;