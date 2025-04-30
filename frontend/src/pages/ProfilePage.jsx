import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import "./ProfilePage.css";

const ProfilePage = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [scheduledSessions, setScheduledSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [averageScores, setAverageScores] = useState({});
  const [overallAverage, setOverallAverage] = useState("N/A");
  const navigate = useNavigate();

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
        const scheduledData =
          localStorage.getItem("scheduledSessions") || "[]";
        const completedData =
          localStorage.getItem("completedSessions") || "[]";
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

  return (
    <div className="dashboard-container">
      <div className="dashboard">

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
                <h4>{activeSession.duration}h</h4>
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
                <p>{session.date} - {session.duration}h</p>
                <p><strong>Average Score:</strong> {averageScores[session.id] || "N/A"}%</p>
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
                      <p><strong>Duration:</strong> {session.duration}h</p>
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