const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: 'https://jordano-portfolio.vercel.app', // Permita seu domínio específico
  optionsSuccessStatus: 200,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

app.post('/send-email', (req, res) => {
  const { email, subject, message } = req.body;
  const mailOptions = {
    from: email,
    to: process.env.RECIPIENT_EMAIL,
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('Email sent: ' + info.response);
  });
});

// Adicione este endpoint para servir o arquivo PDF
app.get('/download-cv', (req, res) => {
  const file = path.join(__dirname, 'public', 'curriculo.pdf');
  res.download(file, 'Curriculo.pdf', (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading file');
    }
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
