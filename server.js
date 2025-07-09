
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.post('/send-pdf', upload.single('pdf'), async (req, res) => {
  const email = req.body.email;
  const filePath = req.file.path;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: '"PDF Bot" <' + process.env.GMAIL_USER + '>',
      to: email,
      subject: 'Your Multiplication Report',
      text: 'Attached is your PDF report.',
      attachments: [{ filename: 'report.pdf', path: filePath }]
    });

    fs.unlinkSync(filePath);
    res.send({ success: true, message: 'Email sent!' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Error sending email.' });
  }
});

app.listen(3000, () => console.log('✅ Server running on http://localhost:3000'));
