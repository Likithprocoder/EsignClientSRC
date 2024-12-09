import React, { useState } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';  // Import degrees function

const WatermarkPDF = () => {
    const [file, setFile] = useState(null);
    const [watermarkedPDF, setWatermarkedPDF] = useState(null);

    // Handle file input change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    // Function to calculate the width of the text
    const getTextWidth = (text) => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const width = context.measureText(text).width;
        return width;


    };

    function isItNearBy(wtrkMarkWidth, targetLength) {
        // A intial check if the wtrkMarkWidth is alredy greater then targetLength.
        if (wtrkMarkWidth > targetLength) {
            return {
                status: "Greater"
            };
        } else {
            if ((targetLength === Math.round(wtrkMarkWidth)) || (targetLength - 1 === Math.round(wtrkMarkWidth))) {
                return {
                    status: "Equal"
                };
            } else {
                return {
                    status: "NotEqual"
                };
            }
        }
    };

    function extendString(wtrMrkCntnt, targetLength) {
        // Deep nesting..
        let newAppendString = `${wtrMrkCntnt}`;
        let stopWhileLoop = true;
        while (stopWhileLoop) {
            newAppendString += " ";
            // Pass the string to the method below, which will basically returns the width of the string that has been passed.
            // Determine whether, the more string needs to be added or not..
            let response = isItNearBy(getTextWidth(newAppendString), targetLength);
            if (response["status"] === "Equal") {
                stopWhileLoop = false;
            } else if (response["status"] === "Greater") {
                stopWhileLoop = false;
            } else {
                for (let key in wtrMrkCntnt) {
                    newAppendString += wtrMrkCntnt[key];
                    // Pass the string to the method below, which will basically returns the width of the string that has been passed.
                    // Determine whether, the more string needs to be added or not..
                    let response = isItNearBy(getTextWidth(newAppendString), targetLength);
                    if (response["status"] === "Equal") {
                        stopWhileLoop = false;
                        break;
                    } else if (response["status"] === "Greater") {
                        stopWhileLoop = false;
                        break;
                    } else {
                        continue;
                    }
                }
            }
        }
        return newAppendString
    };

    // Function to add watermark to the PDF
    const addWatermarkToPDF = async () => {
        if (!file) {
            alert('Please upload a PDF file first!');
            return;
        }
        // Read the file as an array buffer
        const fileArrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(fileArrayBuffer);
        // Get the pages of the PDF
        const pages = pdfDoc.getPages();
        // Add watermark to each page
        pages.forEach((page) => {
            let yPosition = page.getHeight() / 12;
            let xPosition = page.getWidth() / 10;
            let totalDimension = page.getHeight() + page.getWidth();
            const textHeight =  (4/100) * totalDimension; // Rough estimate based on font size
            let extendedString = extendString('WWWWWWWWWWWWWWW', 92);
            // Calculate the position to center the rotated watermark on the page
            page.drawText(extendedString, {
                x: xPosition,
                y: yPosition,
                size: textHeight,
                color: rgb(0.75, 0.75, 0.75),
                rotate: degrees(50),  // Use degrees() function to rotate text
                opacity: 0.4
            });
        });
        // Save the PDF with watermark
        const pdfBytes = await pdfDoc.save();
        // Create a Blob URL for the new PDF and set it to the state
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        const pdfUrl = URL.createObjectURL(pdfBlob);
        setWatermarkedPDF(pdfUrl);
    };

    // Function to download the watermarked PDF
    const downloadPDF = () => {
        if (watermarkedPDF) {
            const link = document.createElement('a');
            link.href = watermarkedPDF;
            link.download = 'watermarked.pdf';
            link.click();
        }
    };

    return (
        <div>
            <h1>Add Watermark to PDF</h1>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={addWatermarkToPDF}>Add Watermark</button>

            {watermarkedPDF && (
                <div>
                    <iframe
                        src={watermarkedPDF}
                        width="600"
                        height="500"
                        title="Watermarked PDF"
                    />
                    <button onClick={downloadPDF}>Download Watermarked PDF</button>
                </div>
            )}
        </div>
    );
};

export default WatermarkPDF;
