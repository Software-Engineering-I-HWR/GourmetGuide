import express, {Request, Response} from 'express';
import {PDFDocument} from 'pdf-lib';

const app = express();
const port = 3000;

app.use(express.json());

// Mock function to generate a PDF from a recipe
const createRecipePDF = async () => {

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([350, 400]);

    page.moveTo(10, 375);

    // Title
    page.drawText(`Recipe:`);

    // Serialize the PDF to a Uint8Array
    return await pdfDoc.save();
};

// API endpoint to create and download the PDF
app.post('/generate-pdf', async (req: Request, res: Response) => {

    try {
        // Generate the PDF
        const pdfBytes = await createRecipePDF();

        // Set the response headers to download the PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=recipe.pdf');

        // Send the PDF to the client
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        res.status(500).json({message: 'Error generating PDF'});
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
