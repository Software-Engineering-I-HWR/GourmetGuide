import express, {Request, Response} from 'express';
import {PDFDocument, StandardFonts} from 'pdf-lib';
import {Recipe} from './recipe_mock';

const app = express();
const port = 3000;

app.use(express.json());

const exampleRecipe: Recipe = {
    name: "Pfannkuchen ",
    image: "https://example.com/pancakes.jpg", // Image can be a URL or base64 string
    description: "Mehl, Zucker, Backpulver und Salz in einer Schüssel vermischen.\n" +
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

const page_width = 600;
const page_height = 800;


// Mock function to generate a PDF from a recipe
const createRecipePDF = async (recipe: Recipe) => {

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([page_width, page_height]);

    const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const logoBytes = await fetch('https://raw.githubusercontent.com/Software-Engineering-I-HWR/GourmetGuide/pdf-branch/backend/assets/logo.png').then((res) => res.arrayBuffer()); // If you fetch the image from a URL, use fetch instead
    const logoImage = await pdfDoc.embedPng(Buffer.from(logoBytes));

    // Get the dimensions of the logo image
    const logoDims = logoImage.scale(0.15); // Scale the logo down by 50%

    // Draw the logo at the top of the page
    page.drawImage(logoImage, {
        x: 50,
        y: 600,
        width: logoDims.width,
        height: logoDims.height,
    })

    page.moveTo(300, 725);

    // Title
    page.drawText(`Rezept: ${recipe.name}`, {
        x: 250,
        y: 700,
        size: 26,
        font: boldFont,
        lineHeight: 24,
        opacity: 0.75,
    },);

    // Zutaten
    page.drawText(`Zutaten:`, {
        x: 300,
        y: 650,
        size: 23,
        font: boldFont,
        lineHeight: 24,
        opacity: 0.75,
    },);

    let y = 620; // Start position for drawing

    // Loop through items and draw each one with a dot symbol
    for (let i = 0; i < recipe.ingredients.length; i++) {
        const item = recipe.ingredients[i];
        const dot = '•'; // Dot symbol

        // Combine dot and item text
        const text = `${dot} ${item}`;

        // Draw text on the page
        page.drawText(text, {
            x: 300,
            y: y,
            size: 18,
            font: normalFont,
        });

        // Move to the next line
        y -= 30;
    }

    page.drawText(recipe.description, {
        x: 50,
        y: 300,
        size: 18,
        font: normalFont,
    });

    //web link
    page.drawText(`www.gourmetguide.de`, {
        x: (page_width - normalFont.widthOfTextAtSize(`www.gourmetguide.de`, 20)) / 2,
        y: 30,
        size: 20,
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
        lineHeight: 24,
        opacity: 0.75,
    },);

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
