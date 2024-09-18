import express, {Request, Response} from 'express';
import {PDFDocument} from 'pdf-lib';
import {Recipe} from './recipe_mock';
import fs from 'fs';

const app = express();
const port = 3000;

app.use(express.json());

const exampleRecipe: Recipe = {
    name: "Pfannkuchen ",
    image: "https://example.com/pancakes.jpg", // Image can be a URL or base64 string
    description:    "Mehl, Zucker, Backpulver und Salz in einer Schüssel vermischen.\n" +
                    "Eier und Milch in einer separaten Schüssel verquirlen.\n" +
                    "Die nassen und trockenen Zutaten zusammenmischen.\n" +
                    "In einer heißen Pfanne backen, bis die Pfannkuchen goldbraun sind.",
    ingredients: [
        "2 Tassen Mehl",
        "1 Esslöffel Zucker",
        "1 Teelöffel Backpulver",
        "1/2 Teelöffel Salz",
        "1 Tasse Milch",
        "2 Eier\n"
    ],
};

// Mock function to generate a PDF from a recipe
const createRecipePDF = async (recipe: Recipe) => {

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    const logoBytes = await fetch('https://raw.githubusercontent.com/Software-Engineering-I-HWR/GourmetGuide/pdf-branch/backend/assets/logo.png').then((res) => res.arrayBuffer()); // If you fetch the image from a URL, use fetch instead
    const logoImage = await pdfDoc.embedPng(Buffer.from(logoBytes));

    // Get the dimensions of the logo image
    const logoDims = logoImage.scale(0.2); // Scale the logo down by 50%

    // Draw the logo at the top of the page
    page.drawImage(logoImage, {
        x: 50,
        y: 550,
        width: logoDims.width,
        height: logoDims.height,
    })

    page.moveTo(300, 725);

    // Title
    page.drawText(`Rezept: ${recipe.name}`);

    // Serialize the PDF to a Uint8Array
    return await pdfDoc.save();
};

// API endpoint to create and download the PDF
app.post('/generate-pdf', async (req: Request, res: Response) => {

    try {
        // Generate the PDF
        const pdfBytes = await createRecipePDF(exampleRecipe);

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
