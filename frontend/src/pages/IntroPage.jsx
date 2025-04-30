import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IntroPage() {
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", backgroundColor: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      
      {/* Background Blurs */}
      <div style={{ position: "absolute", top: "-100px", left: "-100px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)", zIndex: 0 }}></div>
      <div style={{ position: "absolute", top: "200px", right: "-150px", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(34,197,94,0.3) 0%, transparent 70%)", zIndex: 0 }}></div>
      <div style={{ position: "absolute", bottom: "-100px", left: "150px", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(251,191,36,0.3) 0%, transparent 70%)", zIndex: 0 }}></div>

      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#7C3AED" }}>Study Buddy</h1>
        <div style={{ display: "flex", gap: "16px" }}>
          <button
            onClick={() => navigate("/signup")}
            style={{ backgroundColor: "#7C3AED", color: "white", padding: "8px 20px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", transition: "0.3s" }}
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{ backgroundColor: "#F5F3FF", color: "#7C3AED", padding: "8px 20px", border: "1px solid #E0E7FF", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}
          >
            Log In
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between", padding: "32px 64px", position: "relative", zIndex: 1 }}>
        <div style={{
          maxWidth: "600px",
          transform: animate ? "translateY(0)" : "translateY(40px)",
          opacity: animate ? 1 : 0,
          transition: "all 1s ease-out"
        }}>
          <h2 style={{ fontSize: "72px", fontWeight: "900", marginBottom: "24px", lineHeight: "1.2" }}>
            AI - Personal <br />
            <span style={{ color: "#7C3AED" }}>Study Buddy!</span>
          </h2>
          <p style={{ fontSize: "18px", color: "#4B5563", marginBottom: "32px", lineHeight: "1.6" }}>
            The AI Personal Study Buddy is an intelligent, adaptive learning companion
            designed to help students manage their studies more effectively. It offers
            personalized study plans, tracks progress, suggests resources, and
            provides real-time assistance tailored to the learner's goals, strengths,
            and weaknesses.
          </p>
          <button style={{
            backgroundColor: "#7C3AED",
            color: "white",
            padding: "14px 28px",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
            onClick={() => navigate("/signup")}
            onMouseOver={(e) => e.target.style.backgroundColor = "#6D28D9"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#7C3AED"}
          >
            Get Started
          </button>
        </div>

        {/* Image Section */}
        <div style={{
          transform: animate ? "translateY(0)" : "translateY(40px)",
          opacity: animate ? 1 : 0,
          transition: "all 1s ease-out",
          transitionDelay: "0.2s"
        }}>
          <img
            src="/Group 9.png"
            alt="Study Buddy Illustration"
            style={{ width: "600px", height: "auto", marginTop: "-60px" }}
          />
        </div>
      </main>
    </div>
  );
}
