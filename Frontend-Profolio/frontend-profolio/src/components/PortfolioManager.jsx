// src/components/PortfolioManager.js
import React, { useState, useEffect } from 'react';
import PortfolioEditor from './PortfolioEditor';


const PortfolioManager = () => {
  const [portfolios, setPortfolios]         = useState([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState(null);
  const token = localStorage.getItem('token');

  const fetchPortfolios = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Authentication error: No token found. Please log in again.");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/portfolio", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Ensure "Bearer " prefix
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
  
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
  
      console.log("Fetched Portfolios:", data);
      setPortfolios(data);
    } catch (err) {
      console.error("Error fetching portfolios:", err.message);
      alert(`Error: ${err.message}`);
    }
  };
  
  

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const handleNewPortfolio = () => {
    setSelectedPortfolio({ id: null, title: 'New Portfolio', items: [] });
  };

  const handleSelectPortfolio = (portfolio) => {
    setSelectedPortfolio(portfolio);
  };

  const refreshPortfolios = () => {
    fetchPortfolios();
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar: List of portfolios */}
      <div style={{ width: '25%', borderRight: '1px solid #ccc', padding: '10px' }}>
        <h3>Your Portfolios</h3>
        <button onClick={handleNewPortfolio}>Create New Portfolio</button>
        <ul>
          {portfolios.map((portfolio) => (
            <li key={portfolio._id}>
              <button onClick={() => handleSelectPortfolio(portfolio)}>
                {portfolio.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Editor */}
      <div style={{ flexGrow: 1 }}>
        {selectedPortfolio ? (
          <PortfolioEditor portfolio={selectedPortfolio} refreshPortfolios={refreshPortfolios} />
        ) : (
          <div style={{ padding: '20px' }}>Select a portfolio to edit or create a new one.</div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
