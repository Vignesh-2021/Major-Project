import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Scheduler.css";

const Scheduler = () => {
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const MAX_HOURS_PER_DAY = 14;
  const today = new Date().toISOString().split("T")[0];

  const toTotalMinutes = (hours, minutes) => {
    const h = Number(hours) || 0;
    const m = Number(minutes) || 0;
    return h * 60 + m;
  };

  const formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0 && minutes === 0) return "0 mins";
    if (hours === 0) return `${minutes} mins`;
    if (minutes === 0) return `${hours} hrs`;
    return `${hours} hrs ${minutes} mins`;
  };

  const getTotalScheduledMinutesForDate = (targetDate) => {
    try {
      const stored = JSON.parse(localStorage.getItem("scheduledSessions")) || [];
      const newOnes = sessions.filter((s) => s.date === targetDate && !s.isCombined);
      const combined = [...stored, ...newOnes];
      return combined
        .filter((s) => s.date === targetDate && !s.isCombined)
        .reduce((total, s) => total + Number(s.durationMinutes), 0);
    } catch (e) {
      console.error("Error accessing localStorage:", e);
      return 0;
    }
  };

  const handleHoursChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && !isNaN(value))) {
      setHours(value);
    }
  };

  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= 59 && !isNaN(value))) {
      setMinutes(value);
    }
  };

  const generateUniqueId = (topic) => {
    return `${topic}-${crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
  };

  const handleAddSession = () => {
    setError("");
    if (!topic.trim() || !date || (hours === "" && minutes === "")) {
      setError("Please enter valid session details!");
      return;
    }

    const durationMinutes = toTotalMinutes(hours, minutes);
    if (durationMinutes <= 0) {
      setError("Duration must be greater than 0!");
      return;
    }

    const currentTotalMinutes = getTotalScheduledMinutesForDate(date);
    const maxMinutesPerDay = MAX_HOURS_PER_DAY * 60;

    if (currentTotalMinutes >= maxMinutesPerDay) {
      setError("This day is already full. Please select another date.");
      return;
    }

    if (currentTotalMinutes + durationMinutes > maxMinutesPerDay) {
      const remainingMinutes = maxMinutesPerDay - currentTotalMinutes;
      setError(
        `Only ${formatDuration(remainingMinutes)} left for this date. Please reduce the duration or pick another date.`
      );
      return;
    }

    const newSession = {
      id: generateUniqueId(topic),
      topic: topic.trim(),
      date,
      durationMinutes,
      isCombined: false, // Individual session
    };
    setSessions([...sessions, newSession]);
    handleReset();
  };

  const handleReset = () => {
    setTopic("");
    setDate("");
    setHours("");
    setMinutes("");
    setError("");
  };

  const handleDeleteSession = (index) => {
    if (window.confirm("Are you sure you want to delete this session?")) {
      setSessions(sessions.filter((_, i) => i !== index));
    }
  };

  const handleSchedule = () => {
    if (sessions.length === 0) {
      setError("No sessions to schedule!");
      return;
    }

    try {
      // Get existing sessions from localStorage
      const existing = JSON.parse(localStorage.getItem("scheduledSessions")) || [];

      // Group sessions by date to create combined sessions
      const sessionsByDate = sessions.reduce((acc, session) => {
        if (!acc[session.date]) {
          acc[session.date] = [];
        }
        acc[session.date].push(session);
        return acc;
      }, {});

      // Create combined sessions
      const combinedSessions = Object.keys(sessionsByDate).map((date) => {
        const sessionsForDate = sessionsByDate[date];
        const totalDuration = sessionsForDate.reduce(
          (sum, s) => sum + Number(s.durationMinutes),
          0
        );
        return {
          id: generateUniqueId(`Combined-${date}`),
          topic: `Combined Session for ${date}`,
          date,
          durationMinutes: totalDuration,
          isCombined: true,
          combinedDate: date, // Track the date this combined session represents
        };
      });

      // Combine individual and combined sessions
      const allSessions = [...existing, ...sessions, ...combinedSessions];

      // Save to localStorage
      localStorage.setItem("scheduledSessions", JSON.stringify(allSessions));
      navigate("/Sessions");
    } catch (e) {
      console.error("Error saving to localStorage:", e);
      setError("Failed to save sessions. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2 className="title">Time Scheduler</h2>
      <div className="form-group">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-container">
            <div className="input-box">
              <label htmlFor="topic">Topic Name:</label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter topic"
                required
                aria-required="true"
              />
            </div>

            <div className="input-box">
              <label htmlFor="date">Date:</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                required
              />
            </div>

            <div className="input-box duration-box">
              <label htmlFor="hours">Duration:</label>
              <div className="duration-inputs">
                <input
                  id="hours"
                  type="number"
                  value={hours}
                  onChange={handleHoursChange}
                  placeholder="Hours"
                  min="0"
                />
                <span>hrs</span>
                <input
                  type="number"
                  value={minutes}
                  onChange={handleMinutesChange}
                  placeholder="Minutes"
                  min="0"
                  max="59"
                />
                <span>mins</span>
              </div>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button className="add-button" onClick={handleAddSession}>
            +
          </button>

          <div className="session-list">
            {sessions.map((session, index) => (
              <div key={index} className="session-item">
                <p>
                  <strong>Topic:</strong> {session.topic}
                </p>
                <p>
                  <strong>Date:</strong> {session.date}
                </p>
                <p>
                  <strong>Duration:</strong> {formatDuration(session.durationMinutes)}
                </p>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteSession(index)}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          <button className="schedule-button" onClick={handleSchedule}>
            Schedule Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default Scheduler;