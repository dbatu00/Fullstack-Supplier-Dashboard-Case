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


// MonthlySale struct
class MonthlySale {
  constructor(year, month) {
    this.year = year;
    this.month = month;
    this.quantitySold = 0;
    this.totalRevenue = 0;
  }

  update(quantity, revenue) {
    this.quantitySold += quantity;
    this.totalRevenue += revenue;
  }
}

// MonthlySalesData structure
class MonthlySalesData {
  constructor() {
    this.sales = [];
  }

  findOrCreate(year, month) {
    const existingSale = this.sales.find(sale => sale.year === year && sale.month === month);

    if (existingSale) {
      return existingSale;
    } else {
      const newSale = new MonthlySale(year, month);
      this.sales.push(newSale);
      return newSale;
    }
  }
}

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
    const vendorSalesCollection = mongoose.connection.db.collection('vendor_sales');

    async function getSalesByVendor(vendorName) {
      const vendor = await vendorsCollection.findOne({ name: vendorName });
      if (!vendor) {
        console.log(`Vendor not found`);
        return null;
      }
      console.log(`Vendor found: ${vendorName}`);

      const vendorId = vendor._id;
      const sales = await vendorSalesCollection.find({ 'productInfo.vendorId': vendorId }).toArray();

      if (sales.length === 0) {
        console.log(`Sales not found`);
        return null;
      }
      console.log('Sales found');
      return sales;
    }

    // Route for total sales
    app.get('/api/totalSales', async (req, res) => {
      try {
        const vendorName = req.query.vendor;
        console.log(`totalSalesAPI: Received vendor name from React app: ${vendorName}`);

        const sales = await getSalesByVendor(vendorName);

        if (!sales) {
          return res.status(404).json({ message: 'Vendor or Sales not found' });
        }

        return res.json(sales);

      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    // Route for monthly sales
    app.get('/api/monthlySales', async (req, res) => {
      try {
        const vendorName = req.query.vendor;
        console.log(`MonthlySalesAPI: Received vendor name from React app: ${vendorName}`);

        const sales = await getSalesByVendor(vendorName);

        if (!sales) {
          return res.status(404).json({ message: 'Vendor or Sales not found' });
        }

        const monthlySalesData = new MonthlySalesData();

        for (const sale of sales) {
          const orderDate = new Date(sale.orderDate);
          const year = orderDate.getUTCFullYear();
          const month = orderDate.getUTCMonth() + 1; // months are 0-based

          const monthlySale = monthlySalesData.findOrCreate(year, month);
          monthlySale.update(sale.productInfo.quantity, sale.productInfo.quantity * sale.productInfo.margin);
        }

        return res.json(monthlySalesData.sales);

      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Call the startServer function to initiate the server
startServer();



