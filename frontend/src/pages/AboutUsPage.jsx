import React from "react";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

const teamMembers = [
  {
    name: "Makthala Vignesh",
    role: "Student",
    social: ["instagram", "github", "https://www.linkedin.com/in/vignesh-makthala-6b988b310/"],
  },
  {
    name: "Aaki Devi Sri",
    role: "Student",
    social: ["instagram", "github", "linkedin"],
  },
  {
    name: "Ravankol Akash",
    role: "Student",
    social: ["instagram", "github", "linkedin"],
  },
];

const iconStyle = {
  fontSize: "24px",
  margin: "0 8px",
  color: "#444",
  cursor: "pointer"
};

const AboutUs = () => {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #fde2e4, #e0c3fc)", padding: "24px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "24px", textDecoration: "underline" }}>About Us</h1>

      <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px", background: "linear-gradient(to right, #8e2de2, #4a00e0)", color: "white", padding: "8px 16px", borderRadius: "8px", display: "inline-block" }}>
        Mentor
      </h2>
      <div style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", width: "320px", margin: "0 auto 32px", padding: "24px" }}>
        <div style={{ width: "96px", height: "96px", backgroundColor: "#ccc", borderRadius: "50%", margin: "0 auto", border: "4px solid #8e2de2", marginBottom: "16px" }}></div>
        <p style={{ fontSize: "18px", fontWeight: "600" }}>P. Krishna Rao</p>
        <p style={{ fontSize: "14px", color: "#666" }}>Assistant Professor</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "16px" }}>
          <FaGithub style={iconStyle} />
          <FaLinkedin style={iconStyle} />
        </div>
      </div>

      <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px", background: "linear-gradient(to right, #8e2de2, #4a00e0)", color: "white", padding: "8px 16px", borderRadius: "8px", display: "inline-block" }}>
        Meet Our Team
      </h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap" }}>
        {teamMembers.map((member, index) => (
          <div
            key={index}
            style={{ backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", width: "240px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <div style={{ width: "80px", height: "80px", backgroundColor: "#ccc", borderRadius: "50%", border: "4px solid #8e2de2", marginBottom: "16px" }}></div>
            <p style={{ fontWeight: "600" }}>{member.name}</p>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>{member.role}</p>
            <div style={{ display: "flex", gap: "16px" }}>
              {member.social.map((platform, i) => {
                const Icon =
                  platform === "instagram"
                    ? FaInstagram
                    : platform === "github"
                    ? FaGithub
                    : FaLinkedin;
                return <Icon key={i} style={iconStyle} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
