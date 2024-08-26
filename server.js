const express = require('express');
const bodyParser = require('body-parser');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType } = require('docx');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/generate-resume', async (req, res) => {
    const { name, email, phone, education, experience, skills } = req.body;

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: name,
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    thematicBreak: true,
                    spacing: { after: 300 },
                    children: [
                        new TextRun({
                            text: name,
                            bold: true,
                            size: 48,
                            color: "0000FF",
                            font: "Arial",
                        }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Email: ${email}`,
                            break: 1,
                            color: "555555",
                            font: "Arial",
                        }),
                        new TextRun({
                            text: `Phone: ${phone}`,
                            break: 1,
                            color: "555555",
                            font: "Arial",
                        }),
                    ],
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 300 },
                }),
                new Paragraph({
                    text: "Education",
                    heading: HeadingLevel.HEADING_2,
                    thematicBreak: true,
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: "Education",
                            bold: true,
                            size: 32,
                            color: "0000FF",
                            underline: {
                                type: UnderlineType.SINGLE,
                                color: "0000FF",
                            },
                            font: "Arial",
                        }),
                    ],
                }),
                new Paragraph({
                    text: education,
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: education,
                            font: "Arial",
                        }),
                    ],
                }),
                new Paragraph({
                    text: "Experience",
                    heading: HeadingLevel.HEADING_2,
                    thematicBreak: true,
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: "Experience",
                            bold: true,
                            size: 32,
                            color: "0000FF",
                            underline: {
                                type: UnderlineType.SINGLE,
                                color: "0000FF",
                            },
                            font: "Arial",
                        }),
                    ],
                }),
                new Paragraph({
                    text: experience,
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: experience,
                            font: "Arial",
                        }),
                    ],
                }),
                new Paragraph({
                    text: "Skills",
                    heading: HeadingLevel.HEADING_2,
                    thematicBreak: true,
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: "Skills",
                            bold: true,
                            size: 32,
                            color: "0000FF",
                            underline: {
                                type: UnderlineType.SINGLE,
                                color: "0000FF",
                            },
                            font: "Arial",
                        }),
                    ],
                }),
                new Paragraph({
                    text: skills,
                    spacing: { after: 200 },
                    children: [
                        new TextRun({
                            text: skills,
                            font: "Arial",
                        }),
                    ],
                }),
            ],
        }],
    });

    try {
        const buffer = await Packer.toBuffer(doc);
        res.setHeader('Content-Disposition', `attachment; filename=${name}_Resume.docx`);
        res.send(buffer);
    } catch (error) {
        console.error("Error generating document:", error);
        res.status(500).send("Error generating document");
    }
});

app.listen(PORT, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
    } else {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
});