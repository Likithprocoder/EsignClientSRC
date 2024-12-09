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
    const getTextWidth = (text, fontSize) => {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        // Set the font for the context (same as in Java code)
        context.font = `${fontSize}px Helvetica`;

        // Measure the width of the text
        const width = context.measureText(text).width;

        return width;
    };

    function extendString(input, targetLength) {
        // Check if the input is already at the target length
        if (input.length === targetLength) {
          return input; // No changes needed if input is already at the target length
        }
      
        // If the input is one character less than the target length, add one space
        if (input.length === targetLength - 1) {
          return input + " ";
        }
      
        // Initialize the result with the original input string
        let result = input;
      
        // Keep appending the entire input word until the result length approaches the target length
        while (result.length + 1 + input.length <= targetLength) {
          result += " " + input;
        }
      
        // If adding another full word would exceed the target length, add only as many characters as needed
        const remainingLength = targetLength - result.length;
        if (remainingLength > 1) {
          result += " " + input.substring(0, remainingLength - 1);
        }
      
        return result;
      }

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
            const { width, height } = page.getSize();
            let extendedString  = extendString('hii', 19);
            console.log(extendedString);
            
            let wtrkMarkWidth = getTextWidth(extendedString);
            console.log(wtrkMarkWidth);
            
            const textHeight = 80; // Rough estimate based on font size

            // Convert angle to radians
            const angleInRadians = (50 * Math.PI) / 180;

            // Calculate rotated bounding box width and height
            const rotatedWidth = Math.abs(Math.cos(angleInRadians)) * wtrkMarkWidth + Math.abs(Math.sin(angleInRadians)) * textHeight;
            const rotatedHeight = Math.abs(Math.sin(angleInRadians)) * wtrkMarkWidth + Math.abs(Math.cos(angleInRadians)) * textHeight;

            // Calculate the position to center the rotated watermark on the page
            const xPosition = (width - rotatedWidth) / 2;
            const yPosition = (height - rotatedHeight) / 2;

            page.drawText(extendedString, {
                x: 80,
                y: 100,
                size: textHeight,
                color: rgb(0.75, 0.75, 0.75),
                rotate: degrees(50),  // Use degrees() function to rotate text
                opacity: 0.5,
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
