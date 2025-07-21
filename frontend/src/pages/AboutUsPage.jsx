import React from "react";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

// Mentor data
const mentor = {
  name: "P. Krishna Rao",
  role: "Assistant Professor",
  image: "https://via.placeholder.com/150", // Replace with actual image URL
  social: {
    github: "https://github.com/mentor",
    linkedin: "https://linkedin.com/in/mentor",
  },
};

// Team members data
const teamMembers = [
  {
    name: "Makthala Vignesh",
    role: "Student",
    image: "/Student-1.jpg", // Replace with actual image URL
    social: {
      instagram: "https://instagram.com/vignesh",
      github: "https://github.com/Vignesh-2021",
      linkedin: "https://www.linkedin.com/in/vignesh-makthala-6b988b310/",
    },
  },
  {
    name: "Aaki Devi Sri",
    role: "Student",
    image: "/Student-2.jpg", // Replace with actual image URL
    social: {
      instagram: "https://www.instagram.com/_devishree_16?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      github: "https://github.com/aakidevisri",
      linkedin: "https://www.linkedin.com/in/aaki-devisri-642591277/",
    },
  },
  {
    name: "Ravankol Akash",
    role: "Student",
    image: "https://via.placeholder.com/150", // Replace with actual image URL
    social: {
      instagram: "https://instagram.com/akash",
      github: "https://github.com/akash",
      linkedin: "https://www.linkedin.com/in/akash",
    },
  },
];

const iconStyle = {
  fontSize: "24px",
  margin: "0 8px",
  color: "#444",
  cursor: "pointer",
};

const AboutUs = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #fde2e4, #e0c3fc)",
        padding: "24px",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "38px",
          fontWeight: "800",
          marginBottom: "24px",
          textDecoration: "underline",
        }}
      >
        About Us
      </h1>

      {/* Mentor Section */}
      <h2
        style={{
          fontSize: "35px",
          fontWeight: "600",
          marginBottom: "8px",
          background: "linear-gradient(to right, #8e2de2, #4a00e0)",
          color: "white",
          width: "900px",
          padding: "8px 16px",
          borderRadius: "8px",
          display: "inline-block",
        }}
      >
        Mentor
      </h2>
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          width: "320px",
          margin: "0 auto 32px",
          padding: "24px",
        }}
      >
        <img
          src={mentor.image}
          alt={mentor.name}
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "100%",
            border: "4px solid #8e2de2",
            marginBottom: "16px",
            objectFit: "cover",
          }}
        />
        <p style={{ fontSize: "18px", fontWeight: "600" }}>{mentor.name}</p>
        <p style={{ fontSize: "14px", color: "#666" }}>{mentor.role}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <a href={mentor.social.github} target="_blank" rel="noopener noreferrer">
            <FaGithub style={iconStyle} />
          </a>
          <a href={mentor.social.linkedin} target="_blank" rel="noopener noreferrer">
            <FaLinkedin style={iconStyle} />
          </a>
        </div>
      </div>

      {/* Team Section */}
      <h2
        style={{
          fontSize: "35px",
          fontWeight: "600",
          marginBottom: "16px",
          background: "linear-gradient(to right, #8e2de2, #4a00e0)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          width: "900px",
          display: "inline-block",
        }}
      >
        Meet Our Team
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        {teamMembers.map((member, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              width: "240px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={member.image}
              alt={member.name}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "4px solid #8e2de2",
                marginBottom: "16px",
                objectFit: "cover",
              }}
            />
            <p style={{ fontWeight: "600" }}>{member.name}</p>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
              {member.role}
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <a href={member.social.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram style={iconStyle} />
              </a>
              <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                <FaGithub style={iconStyle} />
              </a>
              <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                <FaLinkedin style={iconStyle} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
