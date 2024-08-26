// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generate-resume', (req, res) => {
    const { name, email, phone, education, experience, skills } = req.body;

    // Validate and sanitize input data here

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({ text: name, bold: true, size: 32 }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: `Email: ${email}`, break: 1 }),
                        new TextRun({ text: `Phone: ${phone}`, break: 1 }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Education", bold: true, break: 1 }),
                        new TextRun({ text: education, break: 1 }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Experience", bold: true, break: 1 }),
                        new TextRun({ text: experience, break: 1 }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Skills", bold: true, break: 1 }),
                        new TextRun({ text: skills, break: 1 }),
                    ],
                }),
            ],
        }],
    });

    Packer.toBuffer(doc).then(buffer => {
        const filePath = path.join(__dirname, `${name}_Resume.docx`);
        try {
            fs.writeFileSync(filePath, buffer);
            res.download(filePath, `${name}_Resume.docx`, (err) => {
                if (err) {
                    console.error("Error downloading file:", err);
                }
                fs.unlinkSync(filePath); // Delete the file after download
            });
        } catch (error) {
            console.error("Error writing file:", error);
            res.status(500).send("Error generating document");
        }
    }).catch(error => {
        console.error("Error generating document:", error);
        res.status(500).send("Error generating document");
    });
});

app.listen(PORT, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
    } else {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
});