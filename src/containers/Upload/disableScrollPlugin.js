// const { Plugin } = require('@react-pdf-viewer/core');

// const disableScrollPlugin = () => {
//     const renderViewer = (props) => {
//         const { slot } = props;

//         if (slot.subSlot && slot.subSlot.attrs && slot.subSlot.attrs.style) {
//             slot.subSlot.attrs.style = Object.assign({}, slot.subSlot.attrs.style, {
//                 // Disable scrolling in the pages container
//                 overflow: 'hidden',
//             });
//         }

//         return slot;
//     };

//     return {
//         renderViewer,
//     };
// };

// module.exports = disableScrollPlugin;