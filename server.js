import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import path from 'path';
const app = express();
const PORT = 3000;
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import os from 'os';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generate-resume', (req, res) => {
    const { name, email, phone, education, skills, achievements, experience } = req.body;

    const doc = new Document({
        sections: [
            {
                children: [
                    new Paragraph({
                        children:[
                            new TextRun({ 
                                text: name,
                                font : "Arial",
                                bold : true,
                                size : 46,
                                color: "000000",
                                underline: {type: "single", color: "000000"}
                            })
                        ],
                        heading: HeadingLevel.TITLE,
                        spacing:{
                            after: 200,
                        }
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun(`Mobile: ${phone} | Email: ${email}`),
                        ],
                    }),
                    new Paragraph({
                        text: "Education",
                        heading: HeadingLevel.HEADING_1,
                        thematicBreak: true,
                    }),
                    ...education.map(edu => [
                        new Paragraph({
                            children: [
                            new TextRun({
                            text: `${edu.institution} (${edu.startDate} - ${edu.endDate})`,
                            font : "Arial",
                            bold : true,
                            size : 24,
                            color: "000000"
                            }),
                        ],
                            heading: HeadingLevel.HEADING_2,
                            spacing:{
                                after: 200,
                            },
                            
                        }),
                        new Paragraph({
                            children:[
                            new TextRun({
                                text: `${edu.fieldOfStudy} - ${edu.degree}`,
                                italics: true,
                                size: 20,
                                color: "000000"
                            }),
                            ],indent: { 
                                left: 620
                            },
                            spacing:{
                                after: 200,
                            },
                        }),
                        new Paragraph({
                            text: edu.notes,
                            indent:{
                                left: 620
                            },
                            spacing:{
                                after: 400,
                            },
                        }),
                    ]).flat(),
                    new Paragraph({
                        text: "Experience",
                        heading: HeadingLevel.HEADING_1,
                        thematicBreak: true,
                    }),
                    ...experience.map(exp => [
                        new Paragraph({
                            children:[
                            new TextRun({
                                text: `${exp.company} (${exp.startDate} - ${exp.endDate})`,
                                font : "Arial",
                                bold : true,
                                color: "000000",
                                size : 24,
                            }),
                            ],
                            heading: HeadingLevel.HEADING_2,
                            spacing:{
                                after: 200,
                            },
                        }),
                        new Paragraph({
                            children:[
                            new TextRun({
                                text: `${exp.position}`,
                                italics: true,
                                size: 20,
                            }),
                            ],indent: {
                                left: 620
                            },
                            spacing:{
                                after: 200,
                            },
                        }),
                        new Paragraph({
                            text: exp.description,
                            indent: {
                                left: 620
                            },
                            spacing:{
                                after: 400,
                            },
                        }),
                    ]).flat(),
                    new Paragraph({
                        text: "Skills",
                        heading: HeadingLevel.HEADING_1,
                        thematicBreak: true,
                        spacing:{
                            after: 200,
                        },
                    }),
                    new Paragraph({
                        text: skills,
                        spacing:{
                            after: 400,
                        },
                    }),
                    new Paragraph({
                        text: "Achievements",
                        heading: HeadingLevel.HEADING_1,
                        thematicBreak: true,
                    }),
                    new Paragraph({
                        text: achievements,
                    }),
                ],
            },
        ],
    });

    const tempFilePath = path.join(os.tmpdir(), 'resume.docx');

    Packer.toBuffer(doc).then((buffer) => {
        // Write the buffer to a temporary file
        fs.writeFile(tempFilePath, buffer, (err) => {
            if (err) {
                console.error('Error writing file:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
    
            // Set the headers and send the file
            res.setHeader('Content-Disposition', 'attachment; filename=resume.docx');
            res.sendFile(tempFilePath, (err) => {
                if (err) {
                    console.error('Error sending file:', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    // Delete the temporary file after sending
                    fs.unlink(tempFilePath, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        }
                    });
                }
            });
        });
    })});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});