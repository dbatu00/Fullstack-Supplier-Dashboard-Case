const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://admin:admin@cluster0.9f7cuu3.mongodb.net/LoncaCase?retryWrites=true&w=majority";

mongoose.connect(uri);
const connection = mongoose.connection;

connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
  console.log(connection.name);
})

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});


app.get('/api/firstFiveDocuments', async (req, res) => {
  try {
    const collection = connection.db.collection('Orders');
    const documents = await collection.find({}).limit(5).toArray();
    
    // Print the first 5 documents to the terminal
    documents.slice(0, 5).forEach(doc => console.log(doc));
    console.log('Response:', JSON.stringify(documents));
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

