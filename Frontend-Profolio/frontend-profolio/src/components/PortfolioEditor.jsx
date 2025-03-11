// src/components/PortfolioEditor.js
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Toolbar from './Toolbar';
import Canvas from './Canvas';

const PortfolioEditor = ({ portfolio, refreshPortfolios }) => {
  const [title, setTitle]   = useState(portfolio.title || 'Untitled Portfolio');
  const [items, setItems]   = useState(portfolio.items || []);
  const token = localStorage.getItem('token');

  // If editing an existing portfolio, load its latest data
  useEffect(() => {
    if (portfolio.id || portfolio._id) {
      fetch(`http://localhost:5000/api/portfolio/${portfolio._id || portfolio.id}`, {
        headers: { 'Authorization': 'Bearer ' + token },
      })
        .then((res) => res.json())
        .then((data) => {
          setTitle(data.title);
          setItems(data.items);
        })
        .catch((err) => console.error(err));
    }
  }, [portfolio, token]);

  const savePortfolio = async () => {
    const payload = { title, items };
    try {
      if (portfolio.id || portfolio._id) {
        // Update existing portfolio
        const res = await fetch(`http://localhost:5000/api/portfolio/edit/${portfolio._id || portfolio.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          alert('Portfolio saved successfully!');
          refreshPortfolios();
        } else {
          alert(data.msg || 'Error saving portfolio');
        }
      } else {
        // Create new portfolio
        const res = await fetch('http://localhost:5000/api/portfolio/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) {
          alert('Portfolio created successfully!');
          // Set the new ID for future updates
          portfolio.id = data.id;
          refreshPortfolios();
        } else {
          alert(data.msg || 'Error creating portfolio');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error saving portfolio');
    }
  };

  const downloadPDF = async () => {
    if (!(portfolio.id || portfolio._id)) {
      alert('Please save the portfolio before downloading PDF.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/portfolio/download-pdf/${portfolio._id || portfolio.id}`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
      });
      const blob = await res.blob();
      const url  = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', 'portfolio.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Error downloading PDF');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: '10px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Portfolio Title"
            style={{ fontSize: '20px', width: '100%', marginBottom: '10px' }}
          />
          <button onClick={savePortfolio} style={{ marginRight: '10px' }}>
            Save Portfolio
          </button>
          <button onClick={downloadPDF}>Download PDF</button>
        </div>
        <div style={{ display: 'flex', height: '80vh' }}>
          <Toolbar />
          <Canvas items={items} setItems={setItems} />
        </div>
      </div>
    </DndProvider>
  );
};

export default PortfolioEditor;
