import React, { useState, useEffect } from 'react';
import './styles.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function App() {
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState('Robin');
  const [apiData, setApiData] = useState(null);
  const [data, setData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [estimatedTotalRevenue, setEstimatedTotalRevenue] = useState(0);


  useEffect(() => {
    if (apiData && apiData.message === 'No Sales') {
      setData([]);
    } else if (apiData && apiData.endpoint === 'monthlySales') {
      const transformedData = apiData.data.map((item) => ({
        month: `${item.month}-${item.year}`,
        totalRevenue: item.totalRevenue,
      }));
  
      setData(transformedData.reverse());
    } else if (apiData && apiData.endpoint === 'totalSales') {
      if (apiData.data && apiData.data.length > 0) {
        // Modify the response to exclude _id and vendorId
        const modifiedSales = apiData.data.map((sale) => ({
          orderId: sale.orderId,
          productInfo: {
            productId: sale.productInfo.productId,
            quantity: sale.productInfo.quantity,
            margin: sale.productInfo.margin,
          },
          orderDate: sale.orderDate,
        }));
  
        setData(modifiedSales);
      } else {
        setData([]);
      }
    }
  }, [apiData]);
  

  const handleButtonClick = async (endpoint) => {
    try {
      setApiData(null); // Clear apiData before fetching new data
      setLoading(true);

      console.log(`Fetching data from /api/${endpoint} with vendor name ${vendor}`);
      
      const response = await fetch(`http://localhost:5000/api/${endpoint}?vendor=${vendor}`);
      console.log('Fetched successfully');
      console.log('Response:', response);

      const data = await response.json();
      if(data.message === 'Vendor or Sales not found') setApiData({message: 'No Sales'});
      else setApiData({data, endpoint})
      
     
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (apiData && apiData.endpoint === 'totalSales') {
      const filledData = fillMissingMargins(apiData.data);
      
      return (
        <div className="table-container">
          <table className="sales-table">
            <thead>
              <tr>
              <th>Order Date</th>
                <th>Order ID</th>
                <th>Product ID</th>
                <th>Quantity</th>
                <th>Margin</th>
                <th>Total Revenue</th>
                
              </tr>
            </thead>
            <tbody>
              {filledData.map((sale) => (
                <tr key={sale.orderId}>
                  <td>{sale.orderDate}</td>
                  <td>{sale.orderId}</td>
                  <td>{sale.productInfo.productId}</td>
                  <td>{sale.productInfo.quantity}</td>
                  <td>{sale.productInfo.margin}</td>
                  <td>{calculateRevenue(sale.productInfo)}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>         
        </div>
        
      );
    }
    return null;
  };

  const fillMissingMargins = (data) => {
    try {
      // Filter out sales with a margin
      const salesWithMargin = data.filter((sale) => sale.productInfo.margin !== undefined);
  
      // Calculate average margin
      const totalMargin = salesWithMargin.reduce((sum, sale) => sum + sale.productInfo.margin, 0);
      const totalQuantity = salesWithMargin.reduce((sum, sale) => sum + sale.productInfo.quantity, 0);
      const avgMargin = totalMargin / totalQuantity;
  
      // Fill in missing margins with the average
      const filledData = data.map((sale) => ({
        ...sale,
        productInfo: {
          ...sale.productInfo,
          margin: sale.productInfo.margin || `${avgMargin.toFixed(2)}*`,
        },
      }));
  
      return filledData;
    } catch (error) {
      console.error('Error filling missing margins:', error);
      return data; // Return the original data in case of an error
    }
  };
  
  const calculateRevenue = (productInfo) => {
    const { quantity, margin } = productInfo;

    // Check if the last character in margin is '*'
    const isEstimated = typeof margin === 'string' && margin.endsWith('*');
  
    // Remove '*' if it is present
    const cleanedMargin = isEstimated ? margin.slice(0, -1) : margin;
  
    if (quantity && cleanedMargin !== undefined) {
      const revenue = quantity * parseFloat(cleanedMargin); // Use parseFloat to handle string numbers
      if (isEstimated) {
        return `${revenue} (Estimated)`;
      } else {
        return revenue;
      }
    } else {
      // Handle cases where either quantity or margin is missing
      return 'N/A';
    }  
  };


  const totalRevenueElement = (
    <div className="total-revenue-container">
      <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
      <p>Estimated Total Revenue: ${estimatedTotalRevenue.toFixed(2)} (Estimated)</p>
    </div>
  );

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Vendor Name"
        value={vendor}
        onChange={(e) => setVendor(e.target.value)}
        className="input"
      />
      <div className="button-container">
        <button className='button' onClick={() => handleButtonClick('monthlySales')}>Monthly Sales</button>
        <button className='button' onClick={() => handleButtonClick('totalSales')}>Total Sales</button>
      </div>

      <div style={{ height: '20px' }}></div> {/* Add space here */}

      {renderTable()}

     

      {apiData && apiData.message === 'No Sales' && (
      <div>No sales found.</div>
      )}

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}

      {apiData && apiData.endpoint === 'monthlySales' && (
        <ResponsiveContainer width="80%" height={500}>
          <BarChart data={data}>
          <XAxis dataKey="month" stroke="black" tick={{ fill: 'black' }} />
          <YAxis stroke="black" tick={{ fill: 'black' }} tickFormatter={(value) => `$${value}`} />
          <CartesianGrid strokeDasharray="3 3" stroke="black" />
          <Tooltip />
          <Bar dataKey="totalRevenue" fill="#D2D000" />       
          </BarChart>
        </ResponsiveContainer>
      )}


     
    </div>
  );
}

export default App;
