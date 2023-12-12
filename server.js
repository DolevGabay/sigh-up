const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const XLSX = require('xlsx'); // Node.js library for Excel

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
app.options('/send-email', cors()); // Enable CORS preflight for the send-email route


app.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'dolevjunk1903@gmail.com',
      pass: 'nkyp kdtj utay voen',
    },
  });

  const mailOptions = {
    from: 'your-email@example.com',
    to,
    subject,
    text,
  };

  try {
    console.log("Email received:", mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    res.send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/addEmail', (req, res) => {
  const { email } = req.body;
  console.log(email);

  // Read existing Excel file
  const workbook = XLSX.readFile('email-list.xlsx');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Get the current data as an array of objects
  const data = XLSX.utils.sheet_to_json(worksheet);

  // Add the new email to the data array
  data.push({ Email: email });

  // Clear the worksheet
  XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  XLSX.utils.sheet_add_json(worksheet, data, { header: ['Email'] });

  // Save modified Excel file
  XLSX.writeFile(workbook, 'email-list.xlsx');

  res.send({ success: true });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
