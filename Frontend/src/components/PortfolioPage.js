import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/Portfolio.css";

const PortfolioPage = () => {
  const { portfolioId } = useParams();
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`/api/portfolios/${portfolioId}`);
        setPortfolio(res.data.portfolio);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };

    fetchPortfolio();
  }, [portfolioId]);

  if (!portfolio) return <p>Loading...</p>;

  return (
    <div className="portfolio-container">
      {/* Static Header Section */}
      <header className="portfolio-header">
        <h1>{portfolio.title}</h1>
        <p>{portfolio.description}</p>
      </header>

      {/* Dynamic Sections */}
      <div className="sections">
        {portfolio.sections.map((section) => (
          <div key={section.id} className="section-card">
            <h3>{section.title}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>

      {/* Static Footer */}
      <footer className="portfolio-footer">
        <p>Created by {portfolio.creatorName || "Anonymous"}</p>
      </footer>
    </div>
  );
};

export default PortfolioPage;
