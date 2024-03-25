// src/pdfUtils.js

const fs = require('fs-extra');
const { PDFDocument, rgb } = require('pdf-lib');

async function createPDF() {
    const pdfDoc = await PDFDocument.create();
    return pdfDoc;
}

async function updatePDF(existingPdfBytes) {
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    return pdfDoc;
}

async function addPage(pdfDoc) {
    const page = pdfDoc.addPage([612, 792]); // A4 dimensions in PDF points (1 point = 1/72 inch)
    return pdfDoc;
}


async function removePage(pdfDoc, pageIndex) {
    pdfDoc.removePage(pageIndex);
    return pdfDoc;
}

async function signPDF(pdfDoc, signatureBytes) {
    // Add signature logic here
    return pdfDoc;
}

module.exports = {
    createPDF,
    updatePDF,
    addPage,
    removePage,
    signPDF
};
