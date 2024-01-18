import React, { useState, useEffect } from 'react';
import './styles.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function App() {
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState('Robin');
  const [apiData, setApiData] = useState(null);
  const [data, setData] = useState([]);


  //checking for apiData nullness 3 times is bizarre but it does not work otherwise
  useEffect(() => {
    if (apiData && apiData.message === 'No Sales' ) {setData([]);}
    else if(apiData && apiData.endpoint ==='monthlySales'){
      const transformedData = apiData.data.map((item) => ({
        month: `${item.month}-${item.year}`,
        totalRevenue: item.totalRevenue,
      }));

      setData(transformedData.reverse());
    }
    else if(apiData && apiData.endpoint ==='totalSales'){setData([]);}
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

      {apiData && apiData.endpoint === 'totalSales' && (
      <div style={{ marginTop: '20px', overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>ProductID</th>
              <th>Quantity</th>
              <th>Margin</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {/* Replace with your demo data for total sales */}
            <tr>
              <td>2023-03</td>
              <td>ABC123</td>
              <td>50</td>
              <td>10%</td>
              <td>$500</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    )}
    </div>
  );
}

export default App;
