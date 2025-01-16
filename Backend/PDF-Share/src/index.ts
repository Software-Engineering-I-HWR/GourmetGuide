import express, {Request, Response} from 'express';
import {PDFDocument, StandardFonts} from 'pdf-lib';
import {Recipe} from './recipe';
import cors from "cors";

const page_width = 600;
const page_height = 800;
const right_border_size = 25;
const empty_line_width = 1.5;
const min_font_size = 5;

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const addImageToPage = async (page: any, imageUrl: string, x: number, y: number, maxWidth: number, maxHeight: number, altText: string) => {
    try {
        const isPng = imageUrl.toLowerCase().includes('.png');
        const isJpg = imageUrl.toLowerCase().includes('.jpg');

        if (!isPng && !isJpg) {
            altText = 'Unsupported image format';
        }

        const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());

        let image;
        if (isPng) {
            image = await page.doc.embedPng(imageBytes);
        } else if (isJpg) {
            image = await page.doc.embedJpg(imageBytes);
        }

        const {width, height} = image.scale(1);
        let finalWidth = width;
        let finalHeight = height;

        if (finalWidth > maxWidth || finalHeight > maxHeight) {
            const widthRatio = maxWidth / finalWidth;
            const heightRatio = maxHeight / finalHeight;
            const scaleRatio = Math.min(widthRatio, heightRatio);

            finalWidth *= scaleRatio;
            finalHeight *= scaleRatio;
        }

        page.drawImage(image, {
            x,
            y,
            width: finalWidth,
            height: finalHeight,
        });
    } catch (error) {
        console.log(`Error fetching image from ${imageUrl}, showing alternative text instead.`);
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
        const lineHeight = font.heightAtSize(i) * 1.5;
        const totalHeight = lineHeight * text.split('\n').length;

        if ((top_y - totalHeight) > bottom_y) {
            return i;
        }
    }
    return min_font_size;
}

function getMaximumNumerationTextsize(font: any, top_y: number, bottom_y: number, max_text_size: number, elements: string[], start_x: number) {

    let num_of_elements = elements.length;

    for (let element of elements) {
        if ((addLineBreaksToText(element, font, start_x, max_text_size).split("\n").length - 1) >= 1) {
            num_of_elements += 1;
        }
    }

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

    const title = addLineBreaksToText(recipe.name, boldFont, 250, 25)

    page.drawText(`Rezept: ${title}`, {
        x: 215,
        y: 725,
        size: 25,
        font: boldFont,
        lineHeight: 24,
        opacity: 0.75,
    },);

    await addImageToPage(page, recipe.image, 45, 425, 200, 200, "URL NOT FOUND");

    page.drawText(`Zutaten:`, {
        x: 275,
        y: 640,
        size: 25,
        font: boldFont,
        lineHeight: 24,
        opacity: 0.75,
    },);

    let enumeration = ''
    let font_size_for_enumeration = getMaximumNumerationTextsize(normalFont, 610, 370, 18, recipe.ingredients, 275);

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

    let description_with_new_lines = addLineBreaksToText(recipe.description, normalFont, 50, 18);
    let description_max_size: number = getMaximumTextSize(description_with_new_lines, normalFont, 350, 50, 18);

    for (let i = 18; i > 5; i--) {
        description_max_size = getMaximumTextSize(description_with_new_lines, normalFont, 350, 50, 18)
        description_with_new_lines = addLineBreaksToText(description_with_new_lines, normalFont, 50, i);

        if (i < description_max_size) break;
    }

    description_with_new_lines = addLineBreaksToText(description_with_new_lines, normalFont, 50, description_max_size);

    page.drawText(description_with_new_lines, {
        x: 50,
        y: 350,
        size: description_max_size,
        font: normalFont,
        lineHeight: description_max_size * empty_line_width,
    });

    page.drawText(`Von ${recipe.creator} erstellt auf https://canoob.de:4000/recipe/${recipe.id}/`, {
        x: (page_width - normalFont.widthOfTextAtSize(`Von ${recipe.creator} erstellt auf https://canoob.de:4000/recipe/${recipe.id}`, 17)) / 2,
        y: 25,
        size: 17,
        font: await pdfDoc.embedFont(StandardFonts.Helvetica),
        lineHeight: 24,
        opacity: 0.75,
    },);

    return await pdfDoc.save();
};

function sanitizeText(text: string): string {
    return text.replace(/�/g, '');
}

app.post('/generate-pdf', async (req: Request, res: Response) => {
    try {
        console.log(req.body.id);
        console.log(req.body.creator);

        const sanitizedRecipe: Recipe = {
            name: sanitizeText(req.body.name),
            image: req.body.image,
            description: sanitizeText(req.body.description),
            ingredients: req.body.ingredients.map((ingredient: string) => sanitizeText(ingredient)),
            creator: sanitizeText(req.body.creator),
            id: req.body.id,
        };

        const pdfBytes = await createRecipePDF(sanitizedRecipe);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=recipe.pdf');
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        res.status(500).json({message: 'Error generating PDF'});
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});