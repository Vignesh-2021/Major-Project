import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./SessionCard.css";

const SessionCard = () => {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();
  const userPhoneNumber = localStorage.getItem("userPhoneNumber") || "+919381890586";

  const sendSMS = async (message) => {
    try {
      const response = await fetch("http://localhost:5000/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, toPhoneNumber: userPhoneNumber }),
      });
      if (!response.ok) throw new Error("Failed to send SMS");
      console.log("SMS sent:", await response.json());
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast.error("Failed to send SMS notification.");
    }
  };

  const generateUniqueId = (topic) => {
    return `${topic}-${crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
  };

  const safeSetStorage = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      console.log(`Updated ${key}:`, value);
      return true;
    } catch (error) {
      console.error(`Error updating ${key}:`, error);
      toast.error(`Failed to update ${key}.`);
      return false;
    }
  };

  // Convert total minutes to display format (e.g., 150 mins → "2 hrs 30 mins")
  const formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours === 0 && minutes === 0) return "0 mins";
    if (hours === 0) return `${minutes} mins`;
    if (minutes === 0) return `${hours} hrs`;
    return `${hours} hrs ${minutes} mins`;
  };

  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const loadSessions = () => {
    const storedSessions = JSON.parse(localStorage.getItem("scheduledSessions")) || [];
    const activeSession = JSON.parse(localStorage.getItem("activeSession")) || null;
    const timers = JSON.parse(localStorage.getItem("sessionTimers")) || {};

    console.log("Loaded sessions:", storedSessions);
    console.log("Loaded timers:", timers);

    const now = Date.now();
    const updatedSessions = storedSessions.map((session) => {
      if (!session.id) session.id = generateUniqueId(session.topic);
      if (session.completed === undefined) session.completed = false;
      const timerData = timers[session.topic] || { elapsedTime: 0, isRunning: false, lastUpdate: 0 };
      let elapsedTime = timerData.elapsedTime;
      let isTimerRunning = timerData.isRunning && activeSession?.topic === session.topic;

      if (isTimerRunning && timerData.lastUpdate) {
        elapsedTime += Math.floor((now - timerData.lastUpdate) / 1000);
        const durationInSeconds = (session.durationMinutes || 0) * 60; // Convert minutes to seconds
        console.log(`Checking completion - Topic: ${session.topic}, Elapsed: ${elapsedTime}, Duration: ${durationInSeconds}`);
        if (elapsedTime >= durationInSeconds) {
          if (activeSession?.topic === session.topic) {
            safeSetStorage("activeSession", null);
          }
          timers[session.topic] = { elapsedTime, isRunning: false, lastUpdate: 0 };
          const completedSessions = JSON.parse(localStorage.getItem("completedSessions")) || [];
          if (!completedSessions.some((s) => s.id === session.id)) {
            console.log(`Adding to completedSessions - Topic: ${session.topic}, ID: ${session.id}`);
            completedSessions.push({ ...session, completed: true, completedTime: elapsedTime });
            safeSetStorage("completedSessions", completedSessions);
            console.log("Updated completedSessions:", completedSessions);
            toast.success(`Session "${session.topic}" completed!`);
            sendSMS(`Session '${session.topic}' ended!`);
          }
          return null;
        }
      }

      return {
        ...session,
        active: activeSession ? session.topic === activeSession.topic : false,
        timer: elapsedTime,
        isTimerRunning,
      };
    }).filter((session) => session !== null);

    updatedSessions.sort((a, b) => {
      const dateA = a.date && !isNaN(new Date(a.date)) ? new Date(a.date) : new Date(0);
      const dateB = b.date && !isNaN(new Date(b.date)) ? new Date(b.date) : new Date(0);
      return dateB - dateA;
    });

    const completedSessions = JSON.parse(localStorage.getItem("completedSessions")) || [];
    const filteredScheduled = updatedSessions.filter(
      (s) => !s.completed && !completedSessions.some((c) => c.id === s.id)
    );
    console.log("Saving scheduledSessions:", filteredScheduled);

    setSessions(filteredScheduled);
    safeSetStorage("scheduledSessions", filteredScheduled);
    safeSetStorage("sessionTimers", timers);
  };

  useEffect(() => {
    loadSessions();
    const handleStorageChange = () => {
      console.log("Storage changed, reloading sessions");
      loadSessions();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    let lastTime = Date.now();
    const tick = () => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;

      setSessions((prevSessions) => {
        if (!prevSessions.length) return prevSessions;
        const timers = JSON.parse(localStorage.getItem("sessionTimers")) || {};
        const updatedSessions = prevSessions.map((session) => {
          if (!session.isTimerRunning) return session;

          const newTimer = session.timer + Math.floor(delta / 1000);
          timers[session.topic] = {
            elapsedTime: newTimer,
            isRunning: true,
            lastUpdate: now,
          };

          const durationInSeconds = (session.durationMinutes || 0) * 60; // Convert minutes to seconds
          console.log(`Interval check - Topic: ${session.topic}, Elapsed: ${newTimer}, Duration: ${durationInSeconds}`);
          if (newTimer >= durationInSeconds) {
            console.log(`Session completed in interval - Topic: ${session.topic}, Timer: ${newTimer}`);
            const completedSessions = JSON.parse(localStorage.getItem("completedSessions")) || [];
            if (!completedSessions.some((s) => s.id === session.id)) {
              console.log(`Adding to completedSessions - Topic: ${session.topic}, ID: ${session.id}`);
              completedSessions.push({ ...session, completed: true, completedTime: newTimer });
              safeSetStorage("completedSessions", completedSessions);
              console.log("Updated completedSessions in interval:", completedSessions);
              toast.success(`Session "${session.topic}" completed!`);
              sendSMS(`Session '${session.topic}' ended!`);
            }
            if (prevSessions.find((s) => s.active)?.topic === session.topic) {
              safeSetStorage("activeSession", null);
            }
            timers[session.topic] = { elapsedTime: newTimer, isRunning: false, lastUpdate: 0 };
            return null;
          }

          return { ...session, timer: newTimer };
        }).filter((session) => session !== null);

        updatedSessions.sort((a, b) => {
          const dateA = a.date && !isNaN(new Date(a.date)) ? new Date(a.date) : new Date(0);
          const dateB = b.date && !isNaN(new Date(b.date)) ? new Date(b.date) : new Date(0);
          return dateB - dateA;
        });

        const completedSessions = JSON.parse(localStorage.getItem("completedSessions")) || [];
        const filteredScheduled = updatedSessions.filter(
          (s) => !s.completed && !completedSessions.some((c) => c.id === s.id)
        );
        console.log("Saving scheduledSessions after completion:", filteredScheduled);

        safeSetStorage("sessionTimers", timers);
        const active = updatedSessions.find((s) => s.active);
        if (!active) {
          safeSetStorage("activeSession", null);
        } else {
          safeSetStorage("activeSession", active);
        }
        safeSetStorage("scheduledSessions", filteredScheduled);
        return filteredScheduled;
      });

      requestAnimationFrame(tick);
    };

    const frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleStartSession = (topic) => {
    const activeSession = sessions.find((s) => s.active);
    if (activeSession && activeSession.topic !== topic) {
      toast.error("Another session is already active. Stop it first.");
      return;
    }

    const timers = JSON.parse(localStorage.getItem("sessionTimers")) || {};
    const updatedSessions = sessions.map((session) => {
      if (session.topic === topic) {
        const timerData = timers[topic] || { elapsedTime: 0, isRunning: false, lastUpdate: 0 };
        timers[topic] = {
          elapsedTime: timerData.elapsedTime,
          isRunning: true,
          lastUpdate: Date.now(),
        };
        return {
          ...session,
          active: true,
          isTimerRunning: true,
          timer: timerData.elapsedTime,
        };
      }
      return session;
    });

    const sessionToActivate = updatedSessions.find((s) => s.topic === topic);
    setSessions(updatedSessions);
    safeSetStorage("scheduledSessions", updatedSessions);
    safeSetStorage("sessionTimers", timers);
    safeSetStorage("activeSession", sessionToActivate);

    toast.success("Session started!");
    sendSMS(`Session '${topic}' started!`);
    navigate("/summarizer", { state: { subject: topic } });
  };

  const handleStopSession = (topic) => {
    const timers = JSON.parse(localStorage.getItem("sessionTimers")) || {};
    const session = sessions.find((s) => s.topic === topic);
    const durationInSeconds = (session.durationMinutes || 0) * 60; // Convert minutes to seconds
    const updatedSessions = sessions.map((session) => {
      if (session.topic === topic) {
        timers[session.topic] = {
          elapsedTime: session.timer,
          isRunning: false,
          lastUpdate: 0,
        };
        console.log(`Stopping session - Topic: ${topic}, Elapsed: ${session.timer}, Duration: ${durationInSeconds}`);
        if (session.timer >= durationInSeconds) {
          console.log(`Session ${topic} qualifies for completion on stop`);
          const completedSessions = JSON.parse(localStorage.getItem("completedSessions")) || [];
          if (!completedSessions.some((s) => s.id === session.id)) {
            console.log(`Adding to completedSessions on stop - Topic: ${topic}, ID: ${session.id}`);
            completedSessions.push({ ...session, completed: true, completedTime: session.timer });
            safeSetStorage("completedSessions", completedSessions);
            console.log("Updated completedSessions on stop:", completedSessions);
            toast.success(`Session "${topic}" completed!`);
            sendSMS(`Session '${topic}' ended!`);
          }
          return null;
        }
        return {
          ...session,
          active: false,
          isTimerRunning: false,
        };
      }
      return session;
    }).filter((session) => session !== null);

    setSessions(updatedSessions);
    safeSetStorage("scheduledSessions", updatedSessions);
    safeSetStorage("sessionTimers", timers);
    safeSetStorage("activeSession", null);

    toast.error("Session stopped!");
  };

  const handleDeleteSession = (sessionId) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    const session = sessions.find((s) => s.id === sessionId);
    const updatedSessions = sessions.filter((s) => s.id !== sessionId);
    setSessions(updatedSessions);
    safeSetStorage("scheduledSessions", updatedSessions);

    if (session) {
      const timers = JSON.parse(localStorage.getItem("sessionTimers")) || {};
      delete timers[session.topic];
      safeSetStorage("sessionTimers", timers);
      console.log(`Deleted timer for topic: ${session.topic}`);
    }

    toast.success("Session deleted!");
    console.log("Deleted session ID:", sessionId);
  };

  return (
    <div className="session-page">
      <div className="sessions-list">
        {sessions.length === 0 ? (
          <p className="no-sessions">No sessions scheduled</p>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className={`session-card ${session.active ? "active" : ""}`}>
              <div className="session-info">
                <div>
                  <strong>Session Name:</strong>
                  <p>{session.topic?.trim() || "Untitled"}</p>
                </div>
                <div>
                  <strong>Date:</strong>
                  <p>{session.date || "N/A"}</p>
                </div>
                <div>
                  <strong>Duration:</strong>
                  <p>{formatDuration(session.durationMinutes || 0)}</p>
                </div>
                <div>
                  <strong>Time Elapsed:</strong>
                  <p>{formatTimer(session.timer || 0)}</p>
                </div>
              </div>
              <div className="button-group">
                {session.active ? (
                  <button
                    className="stop-button"
                    onClick={() => handleStopSession(session.topic)}
                    aria-label={`Stop session ${session.topic}`}
                  >
                    Stop ■
                  </button>
                ) : (
                  <button
                    className="start-button"
                    onClick={() => handleStartSession(session.topic)}
                    aria-label={`Start session ${session.topic}`}
                  >
                    Start ▶
                  </button>
                )}
                <button
                  className="delete-button"
                  onClick={() => handleDeleteSession(session.id)}
                  aria-label={`Delete session ${session.topic}`}
                >
                  <svg
                    className="trash-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    role="img"
                    aria-label="Trash icon"
                  >
                    <rect x="5" y="5" width="14" height="16" rx="2" ry="2" />
                    <line x1="9" y1="9" x2="9" y2="17" />
                    <line x1="15" y1="9" x2="15" y2="17" />
                    <path d="M5 5h14" />
                    <path d="M9 5V3h6v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SessionCard;