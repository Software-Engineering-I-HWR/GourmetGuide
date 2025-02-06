import express, {Request, Response} from 'express';
import {PDFDocument, StandardFonts, rgb} from 'pdf-lib';
import {Recipe} from './recipe';
import cors from "cors";

const page_width = 600;
const page_height = 800;
const right_border_size = 25;
const empty_line_width = 1.5;

let finalImageHeight = 0;

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const addImageToPage = async (
    page: any,
    imageUrl: string,
    x: number,
    y: number,
    maxWidth: number,
    maxHeight: number,
    altText: string,
    recipeImage: number
) => {
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

        while (y + finalHeight > 599){
            y--;
        }

        if (recipeImage == 1) {
            finalImageHeight = finalHeight;
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

const calculateNewY = (
    currentY: number,
    text: string,
    font: any,
    fontSize: number,
    lineHeight: number
): number => {
    const lines = text.split('\n').length;
    return currentY - lines * fontSize * lineHeight;
};

const addLineBreaksToText = (text: string, font: any, start_x: number, text_size: number): string => {
    const words: string[] = text.replace(/\n/g, '').split(' ');

    let textWithNewLines = '';
    let currentRow = '';

    for (let word of words) {
        if (start_x + font.widthOfTextAtSize(currentRow + word, text_size) > page_width - right_border_size) {
            currentRow += '\n';
            textWithNewLines += currentRow;
            currentRow = '';
        }
        currentRow += word + ' ';
    }

    return textWithNewLines + currentRow;
};

const createRecipePDF = async (recipe: any) => {
    let pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([page_width, page_height]);

    const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawRectangle({
        x: 0,
        y: 800 - 150,
        width: 600,
        height: 150,
        color: rgb(0.027, 0.325, 0.427),
        borderColor: rgb(0.027, 0.325, 0.427),
    });

    //Title
    const title = recipe.name;
    let titleSize = 25;
    let titleTextWidth = boldFont.widthOfTextAtSize(title, titleSize);

    while (titleTextWidth > 550) {
        titleSize -= 1;
        titleTextWidth = boldFont.widthOfTextAtSize(title, titleSize);
    }

    page.drawText(`${title}`, {
        x: (600 - titleTextWidth) / 2,
        y: 750,
        size: titleSize,
        font: boldFont,
        opacity: 0.75,
        color: rgb(1, 1, 1),
    });

    //Category
    const category = recipe.category;
    let categorySize = 20;
    let categoryTextWidth = boldFont.widthOfTextAtSize(category, categorySize);

    while (categoryTextWidth > 550) {
        categorySize -= 1;
        categoryTextWidth = boldFont.widthOfTextAtSize(category, categorySize);
    }

    page.drawText(`${category}`, {
        x: (600 - categoryTextWidth) / 2,
        y: 700,
        size: categorySize,
        font: boldFont,
        opacity: 0.75,
        color: rgb(1, 1, 1),
    });

    //Image
    await addImageToPage(page, recipe.image, 30, 450, 250, 250, 'URL NOT FOUND', 1);

    //Allergen
    const tagLookupTable: { [key: string]: any } = {
        Vegan: 'vegan.png',
        Vegetarisch: 'vegetarian.png',
        Glutenfrei: 'glutenfrei.png',
        Eifrei: 'eifrei.png',
        Nussfrei: 'nussfrei.png',
        Lactosefrei: 'lactosefrei.png',
    };

    const baseLink =
        'https://raw.githubusercontent.com/Software-Engineering-I-HWR/GourmetGuide/refs/heads/main/Frontend/public/images/';

    let x = 560;

    for (const tag of recipe.allergen) {
        if (tag && tag in tagLookupTable) {
            await addImageToPage(page, baseLink + tagLookupTable[tag], x, 660, 35, 35, 'INTERNAL ERROR', 0);
            x -= 40;
        }
    }

    //Ingredients
    page.drawText(`Zutaten:`, {
        x: 310,
        y: 605,
        size: 25,
        font: boldFont,
        opacity: 0.75,
    });

    let nextY = 575;
    let enumeration = '';
    const font_size_for_enumeration = 12;

    for (let i = 0; i < recipe.ingredients.length; i++) {
        let item = recipe.ingredients[i];
        item = addLineBreaksToText(item, normalFont, 310, font_size_for_enumeration);
        enumeration += `${item}\n`;
    }

    page.drawText(enumeration, {
        x: 310,
        y: nextY,
        size: font_size_for_enumeration,
        font: normalFont,
        lineHeight: font_size_for_enumeration * empty_line_width,
    });

    const newY = calculateNewY(nextY, enumeration, normalFont, font_size_for_enumeration, empty_line_width);

    if (nextY - newY < finalImageHeight) {
        nextY -= Math.round(finalImageHeight);
    } else {
        nextY = newY;
    }

    page.drawLine({
        start: {x: 50, y: nextY},
        end: {x: 550, y: nextY},
        thickness: 0.5,
        color: rgb(0.5, 0.5, 0.5),
    });

    nextY -= 10;

    //Description
    page.drawText(`Zubereitung:`, {
        x: 75,
        y: nextY - 20,
        size: 25,
        font: boldFont,
        opacity: 0.75,
    });

    nextY -= 20;
    let newY2: number = nextY;
    let zubereitung_enumeration: string[] = recipe.description.replace(/\n/g, '').split('|');
    let zubereitung = '';
    const zubereitung_font_size_for_enumeration = 12;

    for (let i = 0; i < zubereitung_enumeration.length; i++) {
        let item = zubereitung_enumeration[i];
        item = addLineBreaksToText(item, normalFont, 75, zubereitung_font_size_for_enumeration)

        if (item && item != " ") {
            zubereitung += `${i + 1}. ${item}\n`;
        }

        newY2 = calculateNewY(newY2, item, normalFont, zubereitung_font_size_for_enumeration, empty_line_width);

        if (newY2 - 35 < 20) {
            page.drawText(zubereitung, {
                x: 75,
                y: nextY - 35,
                size: zubereitung_font_size_for_enumeration,
                font: normalFont,
                lineHeight: zubereitung_font_size_for_enumeration * empty_line_width,
            });

            page = pdfDoc.addPage([page_width, page_height]);

            nextY = 775;
            newY2 = 775;
            zubereitung = '';
        }
    }

    page.drawText(zubereitung, {
        x: 75,
        y: nextY - 35,
        size: zubereitung_font_size_for_enumeration,
        font: normalFont,
        lineHeight: zubereitung_font_size_for_enumeration * empty_line_width,
    });

    nextY = newY2 - 35;

    page.drawLine({
        start: {x: 50, y: nextY},
        end: {x: 550, y: nextY},
        thickness: 0.5,
        color: rgb(0.5, 0.5, 0.5),
    });

    nextY -= 20;

    // Author
    page.drawText(
        `Erstellt von ${recipe.creator} auf https://canoob.de:4000/recipe/${recipe.id}/`,
        {
            x: (page_width - normalFont.widthOfTextAtSize(`Erstellt von ${recipe.creator} auf https://canoob.de:4000/recipe/${recipe.id}/`, 12)) / 2,
            y: nextY,
            size: 12,
            font: normalFont,
            opacity: 0.75,
        }
    );

    return await pdfDoc.save();
};

const sanitizeText = (text: string): string => {
    return text.replace(/�/g, '').replace(/\t/g, ' ');
};

app.post('/generate-pdf', async (req: Request, res: Response) => {
    try {
        const sanitizedRecipe = {
            name: sanitizeText(req.body.name),
            image: req.body.image,
            category: sanitizeText(req.body.category),
            description: sanitizeText(req.body.description),
            ingredients: req.body.ingredients.map((ingredient: string) => sanitizeText(ingredient)),
            allergen: req.body.allergen.map((allergen: string) => sanitizeText(allergen)),
            creator: sanitizeText(req.body.creator),
            id: req.body.id,
        };

        const pdfBytes = await createRecipePDF(sanitizedRecipe);

        res.setHeader('Content-Type', 'application/pdf');
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        res.status(500).json({message: 'Error generating PDF'});
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
