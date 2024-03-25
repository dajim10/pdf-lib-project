const express = require('express');
const multer = require('multer');
const { createPDF, addPage, removePage, signPDF } = require('./src/pdfUtils');
const { PDFDocument } = require('pdf-lib');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static('public'));

async function mergePDFs(files) {
    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
        const pdfBytes = file.buffer;
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    return mergedPdf;
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/add-page', upload.single('pdfFile'), async (req, res) => {
    try {
        const existingPdfBytes = req.file.buffer;
        let pdfDoc = await updatePDF(existingPdfBytes);
        pdfDoc = await addPage(pdfDoc);
        const pdfBytes = await pdfDoc.save();

        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBytes);
    } catch (error) {
        console.error('Error adding page:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/remove-page', upload.single('pdfFile'), async (req, res) => {
    try {
        const existingPdfBytes = req.file.buffer;
        let pdfDoc = await updatePDF(existingPdfBytes);
        pdfDoc = await removePage(pdfDoc, 0); // Assuming you want to remove the first page
        const pdfBytes = await pdfDoc.save();

        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBytes);
    } catch (error) {
        console.error('Error removing page:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/merge', upload.array('pdfFiles'), async (req, res) => {
    try {
        const mergedPdf = await mergePDFs(req.files);
        const pdfBytes = await mergedPdf.save();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
        res.send(pdfBytes);
    } catch (error) {
        console.error('Error merging PDF files:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add more routes for other PDF manipulation operations as needed

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
