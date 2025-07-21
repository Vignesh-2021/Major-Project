import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import "./ProfilePage.css";
import { useGetUserQuery, useEditProfileMutation } from "../redux/features/auth/authApi";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [averageScores, setAverageScores] = useState({});
  const [overallAverage, setOverallAverage] = useState("N/A");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "", // Stores the 10-digit number without +91
  });
  const [updateError, setUpdateError] = useState("");
  const navigate = useNavigate();

  // Fetch user data from the database
  const { data: userData, error: fetchError, isLoading: isFetching } = useGetUserQuery();
  const [editProfile, { isLoading: isUpdating, error: updateApiError }] = useEditProfileMutation();

  // Get token from Redux state to display profile image if available
  const { token } = useSelector((state) => state.auth);

  // Populate form with fetched user data
  useEffect(() => {
    if (userData?.user) {
      const { name, email, mobileNumber } = userData.user;
      // Extract the 10-digit number after +91
      const mobileWithoutPrefix = mobileNumber.startsWith("+91")
        ? mobileNumber.slice(3)
        : mobileNumber;
      setFormData({
        name: name || "",
        email: email || "",
        password: "", // Password is not fetched for security; user must enter it to update
        mobileNumber: mobileWithoutPrefix || "",
      });
    }
  }, [userData]);

  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const updateSessions = () => {
      try {
        const scheduledData = localStorage.getItem("scheduledSessions") || "[]";
        const completedData = localStorage.getItem("completedSessions") || "[]";
        const activeData = localStorage.getItem("activeSession") || "null";

        const parsedScheduled = JSON.parse(scheduledData);
        const parsedCompleted = JSON.parse(completedData);
        const parsedActive = JSON.parse(activeData);

        const activeTopic = parsedActive?.topic || null;

        const filteredScheduled = parsedScheduled.filter(
          (session) =>
            (!activeTopic || session.topic !== activeTopic) &&
            !parsedCompleted.some((completed) => completed.id === session.id)
        );

        const trulyCompleted = [...parsedCompleted];

        setActiveSession(parsedActive);
        setScheduledSessions(filteredScheduled);
        setCompletedSessions(trulyCompleted);

        const scores = {};
        let allScores = [];
        filteredScheduled.forEach((session) => {
          const summaries = JSON.parse(
            localStorage.getItem(`summaries_${session.id}`) || "[]"
          );
          const validScores = summaries
            .filter((summary) => summary?.score?.percentage != null)
            .map((summary) => summary.score.percentage);
          scores[session.id] =
            validScores.length > 0
              ? (
                  validScores.reduce((sum, score) => sum + score, 0) /
                  validScores.length
                ).toFixed(1)
              : "N/A";
        });

        trulyCompleted.forEach((session) => {
          const summaries = JSON.parse(
            localStorage.getItem(`summaries_${session.id}`) || "[]"
          );
          const validScores = summaries
            .filter((summary) => summary?.score?.percentage != null)
            .map((summary) => summary.score.percentage);
          scores[session.id] =
            validScores.length > 0
              ? (
                  validScores.reduce((sum, score) => sum + score, 0) /
                  validScores.length
                ).toFixed(1)
              : "N/A";
          allScores = allScores.concat(validScores);
        });

        setOverallAverage(
          allScores.length > 0
            ? (
                allScores.reduce((sum, score) => sum + score, 0) /
                allScores.length
              ).toFixed(1)
            : "N/A"
        );
        setAverageScores(scores);
      } catch (err) {
        console.error("Error parsing sessions:", err);
        setActiveSession(null);
        setScheduledSessions([]);
        setCompletedSessions([]);
        setAverageScores({});
        setOverallAverage("N/A");
      }
    };

    updateSessions();
    const interval = setInterval(updateSessions, 3000);
    return () => clearInterval(interval);
  }, []);

  const getSessionScores = (sessionId) => {
    const summaries = JSON.parse(
      localStorage.getItem(`summaries_${sessionId}`) || "[]"
    );
    return summaries
      .filter((summary) => summary?.score?.percentage != null)
      .map((summary, index) => ({
        quizIndex: `Quiz ${index + 1}`,
        score: summary.score.percentage,
      }));
  };

  const getOverallPerformanceData = () => {
    const avg = parseFloat(overallAverage);
    if (isNaN(avg) || avg === "N/A") return [];
    return [
      { id: "Achieved", label: "Achieved", value: avg },
      { id: "Remaining", label: "Remaining", value: 100 - avg },
    ];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNumber") {
      // Allow only digits and limit to 10 digits
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: digitsOnly });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateError("");

    // Validate mobile number
    if (formData.mobileNumber.length !== 10) {
      setUpdateError("Mobile number must be exactly 10 digits");
      return;
    }

    // Prepare data to send to the backend
    const updatedData = {
      name: formData.name,
      email: formData.email,
      mobileNumber: `+91${formData.mobileNumber}`, // Prepend +91
    };

    // Only include password if the user entered a new one
    if (formData.password) {
      updatedData.password = formData.password;
    }

    try {
      await editProfile(updatedData).unwrap();
      // Optionally, you can update the local state or Redux state here
      alert("Profile updated successfully!");
    } catch (error) {
      setUpdateError(error.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <div className="profile-header-card">
          <div className="profile-info">
            <img
              className="profile-image"
              src={
                userData?.user?.profileImage
                  ? `http://localhost:5000/uploads/${userData.user.profileImage}`
                  : "https://via.placeholder.com/80"
              }
              alt="Profile"
            />
            <div className="profile-text">
              <h2>{userData?.user?.name || "User"}</h2>
              <p>{userData?.user?.email || "email@example.com"}</p>
            </div>
          </div>

          <div className="profile-form">
            {fetchError && <p style={{ color: "red" }}>{fetchError.data?.message || "Failed to load profile"}</p>}
            {updateError && <p style={{ color: "red" }}>{updateError}</p>}
            {isFetching ? (
              <p>Loading profile...</p>
            ) : (
              <form onSubmit={handleUpdate}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Username</label>
                    <input id="width-500"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input id="width-500"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Password (Leave blank to keep unchanged)</label>
                    <input id="width-500"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="New Password"
                    />
                  </div>
                  <div className="form-group">
                    <label>Mobile Number</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input id="width-500"
                        type="text"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="Enter 10-digit number"
                        maxLength="10"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="form-buttons">
                  <button className="btn update" type="submit" disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="overall-performance-section">
          <h3>Overall Performance of Completed Sessions</h3>
          <p><strong>Overall Average Score:</strong> {overallAverage}%</p>
          {completedSessions.length > 0 && getOverallPerformanceData().length > 0 ? (
            <div className="score-graph" style={{ height: "300px" }}>
              <ResponsivePie
                data={getOverallPerformanceData()}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={2}
                cornerRadius={3}
                colors={{ scheme: "category10" }}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: "circle",
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemTextColor: "#000",
                        },
                      },
                    ],
                  },
                ]}
              />
            </div>
          ) : (
            <p>No performance data available for completed sessions.</p>
          )}
        </div>

        <div className="active-session-section">
          <h3>Active Session</h3>
          {activeSession ? (
            <div className="stats-grid">
              <div className="stat-card">
                <h4>{activeSession.duration}</h4>
                <p>{activeSession.topic} — {activeSession.date}</p>
                <p><strong>Average Quiz Score:</strong> {averageScores[activeSession.id] || "0"}%</p>
              </div>
            </div>
          ) : (
            <div className="no-active-session-section"><p>No active sessions found.</p></div>
          )}
        </div>

        <div className="tasks">
          <h3>Upcoming Sessions</h3>
          {scheduledSessions.length > 0 ? (
            scheduledSessions.map((session) => (
              <div className="task-card" key={session.id}>
                <h4>{session.topic}</h4>
                <p>{session.date} - {session.duration}</p>
                <p><strong>Average Score:</strong> {averageScores[session.id] || "0"}%</p>
              </div>
            ))
          ) : (
            <p>No upcoming sessions.</p>
          )}
        </div>

        <div className="completed-tasks">
          <h3>Completed Sessions</h3>
          {completedSessions.length > 0 ? (
            <div className="completed-sessions-list">
              {completedSessions.map((session) => {
                const sessionScores = getSessionScores(session.id);
                return (
                  <div
                    className="completed-session-card"
                    key={session.id}
                    onClick={() => navigate("/summarizer", { state: { subject: session.topic, completedSessionId: session.id } })}
                  >
                    <div className="session-header">
                      <h4>{session.topic}</h4>
                      <span className="session-score">{averageScores[session.id] || "0"}%</span>
                    </div>
                    <div className="session-details">
                      <p><strong>Date:</strong> {session.date}</p>
                      <p><strong>Duration:</strong> {session.duration}</p>
                      <p><strong>Time Spent:</strong> {formatTimer(session.completedTime || 0)}</p>
                    </div>
                    {sessionScores.length > 0 && (
                      <div className="score-graph" style={{ height: "200px" }}>
                        <ResponsiveBar
                          data={sessionScores}
                          keys={["score"]}
                          indexBy="quizIndex"
                          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
                          padding={0.3}
                          colors={{ scheme: "nivo" }}
                          axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: "Quizzes",
                            legendPosition: "middle",
                            legendOffset: 40,
                          }}
                          axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: "Score (%)",
                            legendPosition: "middle",
                            legendOffset: -50,
                          }}
                          labelSkipWidth={12}
                          labelSkipHeight={12}
                          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
                          animate={true}
                          motionStiffness={90}
                          motionDamping={15}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p>No completed sessions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;