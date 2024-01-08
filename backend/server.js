const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://admin:admin@cluster0.9f7cuu3.mongodb.net/LoncaCase?retryWrites=true&w=majority";

function connectToDatabase() {
  return new Promise((resolve, reject) => {
    mongoose.connect(uri);

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
    //const vendorSalesCollection = mongoose.connection.db.collection('vendor_sales');


    const insertVendorSales = async (vendorName) => {
      try {
        console.log(`Processing vendor: ${vendorName}`);
        
        const vendor = await vendorsCollection.findOne({ name: vendorName });
        if (!vendor) {
          console.log(`Vendor not found: ${vendorName}`);
          return;
        }
        const vendorId = vendor._id;
    
        const products = await parentProductsCollection.find({ 'vendor': vendorId }).toArray();
        if (products.length === 0) {
          console.log(`No products found for vendor: ${vendorName}`);
          return;
        }
    
        const ordersOfProducts = [];
        for (const product of products) {
          const orderOfProduct = await ordersCollection.findOne({ 'cart_item.product': product._id });
    
          if (orderOfProduct) {
            ordersOfProducts.push(orderOfProduct);
            console.log("Order:", orderOfProduct);
          }
        }
        if (ordersOfProducts.length === 0) {
          console.log(`No orders found for any product for vendor: ${vendorName}`);
          return;
        }
    
        const vendorSalesDocument = {
          vendorId: vendorId,
          orders: ordersOfProducts
        };
        const result = await vendorSalesCollection.insertOne(vendorSalesDocument);
        console.log('Inserted into vendor_sales collection:', result);
      } catch (error) {
        console.error(`Error processing vendor ${vendorName}:`, error);
      }
    };
    
    // Iterate through all vendors and call the function
    /*
    const allVendors = await vendorsCollection.find({}).toArray();
    for (const vendor of allVendors) {
      await insertVendorSales(vendor.name);
    }
    */
    

    //table
    app.get('/api/totalSales', async (req, res) => {
    try{   
      
      //get vendorname
      const vendorName = req.query.vendor;
      console.log(`Received vendor name from React app: ${vendorName}`);


      //get vendor collection
      const vendor = await vendorsCollection.findOne({ name: vendorName });
      if (!vendor) 
      {
        console.log(`Vendor not found`);
        return res.status(404).json({ message: 'Vendor not found' });
      }
      else console.log(`Vendor found: ${vendorName}`)
      const vendorId = vendor._id;
      

      //get products collection
      const products = await parentProductsCollection.find({ 'vendor': vendorId }).toArray();
      if (products.length === 0) 
      {
        console.log(`Products not found`); 
        return res.status(404).json({ message: 'Products not found' });
      }
      else console.log('Products found');
          
      

      //time to read the console for debugging before next function starts
      const start = Date.now();
      while (Date.now() - start < 2000) {}


      let searchedProductCount = 0;
      //for each product that a vendor sales:
      //  1-)search order list to find a cart that has it
      //  2-)push the order into ordersOfProducts list
      //  3-)send response
      const ordersOfProducts = [];
      for (const product of products) 
      {
        searchedProductCount++;
        const orderOfProduct = await ordersCollection.findOne({ 'cart_item.product': product._id });
        console.log(`Searching order for ${searchedProductCount} out of ${products.length} products`);

        if (orderOfProduct) 
        {
          ordersOfProducts.push(orderOfProduct);
          console.log("Order ID:", orderOfProduct);
        }
      }
      if (ordersOfProducts.length === 0) 
      {
        console.log('No orders found for any product');
        return res.status(404).json({ message: 'No orders found for any product' });
      }
      else
      {
        console.log('Orders sent via API');
        return res.json(ordersOfProducts);
      } 
   
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


