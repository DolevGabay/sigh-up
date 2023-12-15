const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 80; // Change the port to 80
console.log('Server listening on port and working', port);

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes
app.options('/send-email', cors()); // Enable CORS preflight for the send-email route

const uri = `mongodb+srv://dolevg621:HhCcJFJAIF7sHekR@clustermails.nmi0cju.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB when the application starts
async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

//connectToMongo();

// Handle shutdown gracefully by closing the MongoDB connection
process.on('SIGINT', async () => {
  try {
    console.log('Closing MongoDB connection...');
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/addEmail', async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);
    const database = client.db('mails');
    const collection = database.collection('mails');
    
    // Insert email into MongoDB collection
    await collection.insertOne({ email });

    res.status(200).json({ success: true, message: 'Email added to MongoDB' });
  } catch (error) {
    console.error('Error adding email to MongoDB:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/send-email', async (req, res) => {
  const { subject, text } = req.body;
  console.log(subject, text)

  // Fetch the list of emails from MongoDB
  try {
    const database = client.db('mails');
    const collection = database.collection('mails');
    const result = await collection.find().toArray();

    if (!result || result.length === 0) {
      return res.status(400).send('No emails found in MongoDB.');
    }

    const to = result.map((item) => item.email).join(', '); // Concatenate emails with commas
    console.log('Emails retrieved from MongoDB:', to);

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

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}. MessageId: ${info.messageId}`);
    res.send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/get-emails', async (req, res) => {
  try {
    const database = client.db('mails');
    const collection = database.collection('mails');
    const result = await collection.find().toArray();

    if (!result || result.length === 0) {
      return res.status(400).send('No emails found in MongoDB.');
    }

    const emails = result.map((item) => item.email).join(', '); // Concatenate emails with commas
    console.log('Emails retrieved from MongoDB:', emails);

    res.send(emails);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/delete-email', async (req, res) => {
  try {
    const email = req.body.email;
    const database = client.db('mails');
    const collection = database.collection('mails');
    const result = await collection.deleteOne({ email });

    if (!result || result.length === 0) {
      return res.status(400).send('No emails found in MongoDB.');
    }

    res.send('Email deleted successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
