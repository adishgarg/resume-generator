// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generate-resume', async (req, res) => {
    const { name, email, phone, education, experience, skills } = req.body;

    // Validate and sanitize input data here

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: name,
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `Email: ${email}`, break: 1 }),
                        new TextRun({ text: `Phone: ${phone}`, break: 1 }),
                    ],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    text: "Education",
                    heading: HeadingLevel.HEADING_2,
                    thematicBreak: true,
                }),
                new Paragraph({
                    text: education,
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    text: "Experience",
                    heading: HeadingLevel.HEADING_2,
                    thematicBreak: true,
                }),
                new Paragraph({
                    text: experience,
                    spacing: { after: 200 },
                }),
                new Paragraph({
                    text: "Skills",
                    heading: HeadingLevel.HEADING_2,
                    thematicBreak: true,
                }),
                new Paragraph({
                    text: skills,
                    spacing: { after: 200 },
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