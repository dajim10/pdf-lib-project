// src/index.js

const fs = require('fs-extra');
const { createPDF, updatePDF, addPage, removePage, signPDF } = require('./pdfUtils');

(async () => {
    // Example usage:
    try {
        // Create a new PDF
        let pdfDoc = await createPDF();

        // Add a page
        pdfDoc = await addPage(pdfDoc);

        // Save the PDF to a file
        const pdfBytes = await pdfDoc.save();
        await fs.writeFile('output.pdf', pdfBytes);
        console.log('PDF created successfully.');

    } catch (error) {
        console.error('Error:', error);
    }
})();
