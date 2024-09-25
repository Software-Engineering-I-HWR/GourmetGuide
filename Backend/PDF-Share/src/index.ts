import express, {Request, Response} from 'express';
import {PDFDocument, StandardFonts} from 'pdf-lib';
import {Recipe} from './recipe';

const app = express();
const port = 3000;

app.use(express.json());

const page_width = 600;
const page_height = 800;

const right_border_size = 20;
const empty_line_width = 1.5;
const min_font_size = 5;

const addImageToPage = async (page: any, imageUrl: string, x: number, y: number, maxWidth: number, maxHeight: number, altText: string) => {
    try {
        // Try to fetch and embed the image
        const isPng = imageUrl.toLowerCase().endsWith('.png');
        const isJpg = imageUrl.toLowerCase().endsWith('.jpg');

        if (!isPng && !isJpg) {
            altText = 'Unsupported image format';
        }

        // Fetch the image data
        const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());

        // Embed the image based on its format
        let image;
        if (isPng) {
            image = await page.doc.embedPng(imageBytes);
        } else if (isJpg) {
            image = await page.doc.embedJpg(imageBytes);
        }
        // Scale the image proportionally
        const { width, height } = image.scale(1);
        let finalWidth = width;
        let finalHeight = height;

        // Resize if necessary to fit within bounds
        if (finalWidth > maxWidth || finalHeight > maxHeight) {
            const widthRatio = maxWidth / finalWidth;
            const heightRatio = maxHeight / finalHeight;
            const scaleRatio = Math.min(widthRatio, heightRatio);

            finalWidth *= scaleRatio;
            finalHeight *= scaleRatio;
        }

        // Draw the image on the page
        page.drawImage(image, {
            x,
            y,
            width: finalWidth,
            height: finalHeight,
        });
    } catch (error) {
        console.log(`Error fetching image from ${imageUrl}, showing alternative text instead.`);
        // Draw alternative text if the image fails
        page.drawText(altText, {
            x,
            y,
            size: 12,
            font: await page.doc.embedFont(StandardFonts.Helvetica),
        });
    }
};

function addLineBreaksToText(text: string, font: any, start_x: number, text_size: number): string {

    const words: string [] = text.replace(/\n/g, '').split(' ')

    let textWithNewLines = '';
    let currentRow = '';

    for (let word of words) {
        if ((start_x + font.widthOfTextAtSize(currentRow + word, text_size)) > (page_width - right_border_size)) {
            currentRow += '\n';
            textWithNewLines += currentRow;
            currentRow = '';
        }
        currentRow += word + ' ';
    }

    return textWithNewLines + currentRow;
}

function getMaximumTextSize(text: string, font: any, top_y: number, bottom_y: number, max_text_size: number): number {
    for (let i = max_text_size; i > min_font_size; i--) {
        const lineHeight = font.heightAtSize(i) * 1.5; // Berechnung der Zeilenhöhe (1.5 für Zeilenabstand)
        const totalHeight = lineHeight * text.split('\n').length; // Gesamthöhe basierend auf Anzahl der Zeilen

        // Prüfe, ob der Text in den definierten Bereich passt
        if ((top_y - totalHeight) > bottom_y) {
            return i; // Wenn er passt, nimm diese Schriftgröße
        }
    }
    return min_font_size;
}

function getMaximumNumerationTextsize(font: any, top_y: number, bottom_y: number, max_text_size: number, elements: string[], start_x: number) {

    let num_of_elements = elements.length;

    //account for oversize elements as 2 elements
    for (let element of elements) {
        if ((addLineBreaksToText(element, font, start_x, max_text_size).split("\n").length - 1) >= 1) {
            num_of_elements += 1;
        }
    }

    //1 empty element for spacing
    num_of_elements += 1;

    for (let i = max_text_size; i > min_font_size; i--) {
        if ((top_y - (font.heightAtSize(i) * empty_line_width * num_of_elements)) > bottom_y) {
            return i;
        }
    }

    return min_font_size;
}

const createRecipePDF = async (recipe: any) => {

    let pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([page_width, page_height]);

    const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    await addImageToPage(page, 'https://raw.githubusercontent.com/Software-Engineering-I-HWR/GourmetGuide/refs/heads/main/Frontend/public/images/Logo.jpg', 50, 650, 100, 100, "LOGO.PNG NOT FOUND ON GITHUB MAIN BRANCH");

    // title
    page.drawText(`Rezept: ${recipe.name}`, {
        x: 250,
        y: 700,
        size: 25,
        font: boldFont,
        lineHeight: 24,
        opacity: 0.75,
    },);

    // image
    await addImageToPage(page, recipe.image, 45, 475, 200, 200, "URL NOT FOUND");

    // ingredients header
    page.drawText(`Zutaten:`, {
        x: 275,
        y: 650,
        size: 25,
        font: boldFont,
        lineHeight: 24,
        opacity: 0.75,
    },);

    // ingredients list
    let enumeration = ''

    let font_size_for_enumeration = getMaximumNumerationTextsize(normalFont, 620, 370, 18, recipe.ingredients, 275);

    for (let i = 0; i < recipe.ingredients.length; i++) {
        let item = recipe.ingredients[i];
        const dot = '•';

        item = addLineBreaksToText(item, normalFont, 275, font_size_for_enumeration)

        enumeration += `${dot} ${item}\n`;
    }

    page.drawText(enumeration, {
        x: 275,
        y: 620,
        size: font_size_for_enumeration,
        font: normalFont,
        lineHeight: font_size_for_enumeration * empty_line_width,
    });

    // description

    let description_with_new_lines = addLineBreaksToText(recipe.description, normalFont, 50, 18);

    let description_max_size: number  = getMaximumTextSize(description_with_new_lines, normalFont, 350, 50, 18);

    for (let i = 18; i > 5; i--) {
        description_max_size  = getMaximumTextSize(description_with_new_lines, normalFont, 350, 50, 18)
        description_with_new_lines = addLineBreaksToText(description_with_new_lines, normalFont, 50, i);
        console.log(description_with_new_lines);
        console.log(description_max_size);
        if (i < description_max_size) break;
    }

    description_with_new_lines = addLineBreaksToText(description_with_new_lines, normalFont, 50, description_max_size);

    console.log(description_with_new_lines);
    console.log(description_max_size);

    page.drawText(description_with_new_lines, {
        x: 50,
        y: 350,
        size: description_max_size,
        font: normalFont,
        lineHeight: description_max_size * empty_line_width,
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

function sanitizeText(text: string): string {
    return text.replace(/�/g, ''); // Remove the replacement characters
}

// API endpoint to create and download the PDF
app.post('/generate-pdf', async (req: Request, res: Response) => {

    try {

        const sanitizedRecipe: Recipe = {
            name: sanitizeText(req.body.name),
            image: req.body.image, // Assuming image URL is fine
            description: sanitizeText(req.body.description),
            ingredients: req.body.ingredients.map((ingredient: string) => sanitizeText(ingredient))
        };

        const pdfBytes = await createRecipePDF(sanitizedRecipe);

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
