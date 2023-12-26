import React, { useState } from 'react';

function App() {
  const [apiData, setApiData] = useState(null);

  const fetchData = async (endpoint) => {
    try {
      console.log(`Fetching data from /api/${endpoint}`);
      //const response = await fetch(`/api/${endpoint}`);
      const response = await fetch('http://localhost:5000/api/firstFiveDocuments');
      console.log('Fetched successfully');
      console.log('Response:', response);
      const data = await response.json();
      console.log('Data:', data);
      setApiData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <button onClick={() => fetchData('firstFiveDocuments')}>Fetch Data from /api/firstFiveDocuments</button> 
      <button onClick={() => fetchData('test')}>Test /api/test</button>

      {apiData && (
        <div>
          <h2>API Data:</h2>
          <pre>{JSON.stringify(apiData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
