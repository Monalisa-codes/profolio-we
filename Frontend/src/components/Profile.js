import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [newPortfolioTitle, setNewPortfolioTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userID = localStorage.getItem("userId");
    const fetchPortfolios = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userID}/portfolios`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        setPortfolios(data.portfolios);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPortfolios();
  }, []);

  const handleAddPortfolio = async () => {
    if (!newPortfolioTitle) return alert("Enter a portfolio title");
  
    try {
      const response = await fetch("http://localhost:5000/portfolio/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: userID,
          settings: { title: newPortfolioTitle, subtitle: "", theme: "default", author: "", contact: "" },
          sections: [],
        }),
      });
  
      if (!response.ok) throw new Error("Failed to create portfolio");
  
      const data = await response.json();
      const portfolioId = data.portfolioId; // Get created portfolio's ID
  
      // Navigate to the edit page after creation
      navigate(`/portfolio/${portfolioId}/edit`);
    } catch (error) {
      console.error("Error creating portfolio:", error);
    }
  };
  


  return (
    <div className="profile-container">
      <span className="profile"><h2>My Profile</h2></span>
      {/* <div className="portfolio-input">
        <input
          type="text"
          placeholder="New Portfolio Title"
          value={newPortfolioTitle}
          onChange={(e) => setNewPortfolioTitle(e.target.value)}
        />
        <button onClick={handleAddPortfolio}>Add Portfolio</button>
      </div> */}

      <div className="flex-container">
        {/* 🔹 Create New Portfolio Card (Navigates to a new page) */}
        <div className="portfolio-card create-card"
          onClick={async () => {
            try {
              const response = await fetch("http://localhost:5000/portfolio/create", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  settings: {
                    title: "Untitled Portfolio", // ✅ Required field
                    subtitle: "",
                    theme: "default",
                    author: "",
                    contact: "",
                  },
                  sections: [],
                }),
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create portfolio");
              }

              const data = await response.json();
              const portfolioId = data.portfolioId; // ✅ Fetch newly created portfolio ID

              navigate(`/portfolio/${portfolioId}/edit`); // ✅ Navigate to edit route
            } catch (error) {
              console.error("Error creating portfolio:", error);
            }
          }}
        >
          <p>+ Create New Portfolio</p>
        </div>


        {/* 🔹 Display Existing Portfolios */}
        {portfolios.length === 0 ? (
          <p>No portfolios found. Start by creating one!</p>
        ) : (
          portfolios.map((portfolio) => (
            <div key={portfolio._id} className="portfolio-card">
              <Link to={`/portfolio/${portfolio._id}`}>{portfolio.title}</Link>
              <button onClick={() => navigate(`/portfolio/${portfolio._id}/edit`)}>Edit</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
