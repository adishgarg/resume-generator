const express = require('express');
const bodyParser = require('body-parser');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generate-resume-docx', async (req, res) => {
    const { name, email, phone, education, experience, skills } = req.body;

    // Trim input data
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedEducation = education.trim();
    const trimmedExperience = experience.trim();
    const trimmedSkills = skills.trim();

    // Split and create lists
    const educationList = trimmedEducation.split('\n').map(item => new Paragraph({
        text: item.trim(),
        bullet: {
            level: 0
        }
    }));

    const experienceList = trimmedExperience.split('\n').map(item => new Paragraph({
        text: item.trim(),
        bullet: {
            level: 0
        }
    }));

    const skillsList = trimmedSkills.split('\n').map(item => new Paragraph({
        text: item.trim(),
        bullet: {
            level: 0
        }
    }));

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: trimmedName,
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    children: [
                        new TextRun(`Email: ${trimmedEmail}`),
                        new TextRun({ text: `Phone: ${trimmedPhone}`, break: 1 }),
                    ],
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    text: "Education",
                    heading: HeadingLevel.HEADING_2,
                }),
                ...educationList,
                new Paragraph({
                    text: "Experience",
                    heading: HeadingLevel.HEADING_2,
                }),
                ...experienceList,
                new Paragraph({
                    text: "Skills",
                    heading: HeadingLevel.HEADING_2,
                }),
                ...skillsList,
            ],
        }],
    });

    try {
        const buffer = await Packer.toBuffer(doc);
        res.setHeader('Content-Disposition', `attachment; filename=${trimmedName}_Resume.docx`);
        res.send(buffer);
    } catch (error) {
        console.error("Error generating document:", error);
        res.status(500).send("Error generating document");
    }
});

app.post('/generate-resume-pdf', async (req, res) => {
    const { name, email, phone, education, experience, skills } = req.body;

    // Trim input data
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedEducation = education.trim();
    const trimmedExperience = experience.trim();
    const trimmedSkills = skills.trim();

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    const fontSize = 12;

    page.drawText(trimmedName, { x: 50, y: height - 50, size: 24 });
    page.drawText(`Email: ${trimmedEmail}`, { x: 50, y: height - 80, size: fontSize });
    page.drawText(`Phone: ${trimmedPhone}`, { x: 50, y: height - 100, size: fontSize });

    let yPosition = height - 130;
    page.drawText("Education:", { x: 50, y: yPosition, size: 18 });
    yPosition -= 20;
    trimmedEducation.split('\n').forEach(item => {
        page.drawText(`- ${item.trim()}`, { x: 60, y: yPosition, size: fontSize });
        yPosition -= 20;
    });

    yPosition -= 20;
    page.drawText("Experience:", { x: 50, y: yPosition, size: 18 });
    yPosition -= 20;
    trimmedExperience.split('\n').forEach(item => {
        page.drawText(`- ${item.trim()}`, { x: 60, y: yPosition, size: fontSize });
        yPosition -= 20;
    });

    yPosition -= 20;
    page.drawText("Skills:", { x: 50, y: yPosition, size: 18 });
    yPosition -= 20;
    trimmedSkills.split('\n').forEach(item => {
        page.drawText(`- ${item.trim()}`, { x: 60, y: yPosition, size: fontSize });
        yPosition -= 20;
    });

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Disposition', `attachment; filename=${trimmedName}_Resume.pdf`);
    res.send(Buffer.from(pdfBytes));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});