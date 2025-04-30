import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <h1>Hello, Buddy!</h1>
          <p>Let's Start Learning</p>
          <button className="schedule-btn" onClick={() => navigate("/Scheduler")}>
            ☉ Schedule Plan
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
