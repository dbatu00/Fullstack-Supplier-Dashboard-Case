const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://admin:admin@cluster0.9f7cuu3.mongodb.net/LoncaCase?retryWrites=true&w=majority";

const vendorSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
});

const Vendor = mongoose.model('Vendor', vendorSchema);


function connectToDatabase() {
  return new Promise((resolve, reject) => {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    const connection = mongoose.connection;

    connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
      reject(error);
    });

    connection.once('open', () => {
      console.log(`MongoDB database connection to ${connection.name} established successfully`);
      resolve();
    });
  });
}

async function startServer() {
  try {
    await connectToDatabase();

    const ordersCollection = mongoose.connection.db.collection('Orders');
    const vendorsCollection = mongoose.connection.db.collection('Vendors');
    const parentProductsCollection = mongoose.connection.db.collection('parent_products');

    //table
    app.get('/api/totalSales', async (req, res) => {
    try{

      const vendorName = req.query.vendor; // Get vendor name from the request query parameters
      console.log(`Received vendor name from React app: ${vendorName}`);

      //res.json({ message: 'API is working!' });
      //const collection = connection.db.collection('Orders');

      const vendor = await vendorsCollection.findOne({ name: vendorName });

      // Check if the vendor exists
      if (!vendor) {
        return res.status(404).json({ message: 'Vendor not found' });
      }

      // Extract the vendor id from the found vendor
      const vendorId = vendor._id;

      // Return the vendor id to the React app
      res.json({ vendorId });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  //graph
  app.get('/api/monthlySales', async (req, res) => {
    try {

      const vendorName = req.query.vendor; // Get vendor name from the request query parameters
      console.log(`Received vendor name from React app: ${vendorName}`);

      //const collection = connection.db.collection('Orders');
      const documents = await ordersCollection.find({}).limit(5).toArray();

      res.json(documents);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

startServer();


