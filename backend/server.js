const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

const migrationDone = 1;
const vendorIDadded = 1;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://admin:admin@cluster0.9f7cuu3.mongodb.net/LoncaCase?retryWrites=true&w=majority";

/*demo sale
product oid: 61aac288433e0592d8baf554
vendor oid: 61aac7f29955ef6272942997
vendor name: 'Dilvin'
*/

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
  try 
  {
    await connectToDatabase();

    const ordersCollection = mongoose.connection.db.collection('Orders');
    const vendorsCollection = mongoose.connection.db.collection('Vendors');
    const parentProductsCollection = mongoose.connection.db.collection('parent_products');
    const vendorSalesCollection = mongoose.connection.db.collection('vendor_sales');


    /*//////MIGRATION/////////
    //1-) get vendors
    //2-) get products of vendors
    //3-) get sales of the product
    //4-) push sale info to vendor_sales
    if (!migrationDone) 
    {
      console.log("Migration starts");
      let searchedVendorCount = 0;

      //1-)get vendor names
      const vendors = await vendorsCollection.find({}, { projection: { _id: 1, name: 1 } }).toArray();
      if (vendors.length === 0) 
        console.log('No vendors found');
      

      for(const vendor of vendors)
      {
        searchedVendorCount++;
        
        //2-)get products collection
        const products = await parentProductsCollection.find({ 'vendor': vendor._id }).toArray();
        if (products.length != 0) 
        {
          console.log("Products found for vendor", searchedVendorCount);
        }
          
        //3-)search orders for carts that have the product
        let searchedProductCount = 0;
        //for each product that a vendor lists:
        //  a-)search order list to find a cart that has it
        //  b-)get the relevant info and push to vendor_sales collection
        for (const product of products) 
        {
          searchedProductCount++;
          //a-)get order
          const query = { 'cart_item.product': product._id };
          const projection = { _id: 1, cart_item: { $elemMatch: { product: product._id } }, payment_at: 1 };
          const order = await ordersCollection.findOne(query, { projection });

          console.log(`Searching order for ${searchedProductCount} out of ${products.length} products for ${searchedVendorCount} out of ${vendors.length} vendors`);
    
          if (order) 
          {
            //b-)Push the order information to the vendor sales collection
            const vendorSalesDocument = 
            {
                orderId: order._id,
                productInfo: 
                {
                  productId: product._id,
                  quantity: order.cart_item[0].quantity, // Assuming there's only one item in the cart for simplicity
                  margin: order.cart_item[0].vendor_margin,
                },
                orderDate: order.payment_at,
                }; 
    
            const result = await vendorSalesCollection.insertOne(vendorSalesDocument);
            console.log('Inserted into vendor_sales collection:', result);
          }
        }
      }
    }
    ////////MIGRATION////////*/
    

    /*//////ADD VENDOR ID TO VENDOR_SALES//////////////
    if(!vendorIDadded)
    {
      const cursor = vendorSalesCollection.find();

      // Get the count of documents in the collections
      const vendorSalesCount = await vendorSalesCollection.countDocuments();
 

      console.log(`Total documents in vendor_sales collection: ${vendorSalesCount}`);

      // Counter for progress
      let processedVendorSales = 0;

      while (await cursor.hasNext()) {
        processedVendorSales++;
        console.log(`Processing ${processedVendorSales}/${vendorSalesCount} in vendor_sales collection`);
        const vendorSalesDocument = await cursor.next();
  
        const productId = vendorSalesDocument.productInfo.productId;
        console.log("Product ID:", productId);
  
        // Use productId to find vendorId in the other collection
        const vendorDocument = await parentProductsCollection.findOne({ '_id': productId });
  
        if (vendorDocument) {
          const vendorId = vendorDocument.vendor;
  
          // Update the vendorId in vendor_sales document
          await vendorSalesCollection.updateOne(
            { _id: vendorSalesDocument._id },
            { $set: { 'productInfo.vendorId': vendorId } }
          );
  
          console.log(`Added vendorId for orderId ${vendorSalesDocument.orderId} to ${vendorId}`);
        } else {
          console.log(`Vendor not found for orderId ${vendorSalesDocument.orderId}`);
        }
      }
  
      console.log('Finished updating vendorIds');

    }
    ///////ADD VENDOR ID TO VENDOR_SALES/////////////*/


    //table
    app.get('/api/totalSales', async (req, res) => {
      try{   
        
        //get vendorname
        const vendorName = req.query.vendor;
        console.log(`totalSalesAPI: Received vendor name from React app: ${vendorName}`);
    
    
        //get vendor 
        const vendor = await vendorsCollection.findOne({ name: vendorName });
        if (!vendor) 
        {
          console.log(`totalSalesAPI: Vendor not found`);
          return res.status(404).json({ message: 'Vendor not found' });
        }
        else console.log(`totalSalesAPI: Vendor found: ${vendorName}`)
        const vendorId = vendor._id;
        
    
        //get sales 
        const sales = await vendorSalesCollection.find({ 'productInfo.vendorId': vendorId }).toArray();
        
        if (sales.length === 0) 
        {
          console.log(`totalSalesAPI: Sales not found`); 
          return res.status(404).json({ message: 'Sales not found' });
        }
        else console.log('totalSalesAPI: Sales found');
            
        
    
        //time to read the console for debugging before next function starts
        const start = Date.now();
        while (Date.now() - start < 1000) {}
    
        return res.json(sales);
        
    
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
    
        const orders = await ordersCollection.find({}).limit(5).toArray();
    
        res.json(orders);
    
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


