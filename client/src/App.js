import React, { useState, useEffect } from 'react';
import './styles.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

function App() {
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState('Robin');
  const [apiData, setApiData] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (apiData) {
      // Assuming apiData is an array of objects with 'year', 'month', and 'totalRevenue' properties
      const transformedData = apiData.map((item) => ({
        month: `${item.month}-${item.year}`,
        totalRevenue: item.totalRevenue,
      }));

      setData(transformedData.reverse());
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
      console.log('Data:', data);
      setApiData(data);
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

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}

      {data.length > 0 && (
        <ResponsiveContainer width="80%" height={400}>
          <BarChart data={data}>
          <XAxis dataKey="month" stroke="black" tick={{ fill: 'black' }} />
          <YAxis stroke="black" tick={{ fill: 'black' }} />
          <CartesianGrid strokeDasharray="3 3" stroke="black" />
          <Tooltip />
          <Legend iconSize={20} iconType="rect" />
          <Bar dataKey="totalRevenue" fill="#D2D000" />
          <Legend iconSize={20} iconType="rect" />        
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default App;
